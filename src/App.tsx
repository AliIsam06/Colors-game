import { startTransition, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { getLevelCompletion, pathConnectsPair, type PathMap } from './game/logic'
import { levels } from './game/levels'
import { areAdjacent, cellsEqual, findEndpointPairAtCell, findPairById, keyOfCell } from './game/logic'
import type { Cell, Level, Pair } from './game/types'

type SaveData = {
  completedIds: string[]
  selectedLevelId: string | null
}

type ActivePath = {
  pairId: string
  points: Cell[]
}

const SAVE_KEY = 'colors-flow-save'

function readSave(): SaveData {
  if (typeof window === 'undefined') {
    return { completedIds: [], selectedLevelId: null }
  }

  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) {
      return { completedIds: [], selectedLevelId: null }
    }

    const parsed = JSON.parse(raw) as Partial<SaveData>
    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      selectedLevelId:
        typeof parsed.selectedLevelId === 'string' ? parsed.selectedLevelId : null,
    }
  } catch {
    return { completedIds: [], selectedLevelId: null }
  }
}

function getInitialLevelIndex(selectedLevelId: string | null): number {
  const foundIndex = levels.findIndex((level) => level.id === selectedLevelId)
  return foundIndex >= 0 ? foundIndex : 0
}

function getBoardCell(
  event: React.PointerEvent<HTMLDivElement>,
  element: HTMLDivElement,
  size: number,
): Cell | null {
  const rect = element.getBoundingClientRect()
  const relativeX = event.clientX - rect.left
  const relativeY = event.clientY - rect.top

  if (
    relativeX < 0 ||
    relativeY < 0 ||
    relativeX > rect.width ||
    relativeY > rect.height
  ) {
    return null
  }

  const x = Math.min(size - 1, Math.floor((relativeX / rect.width) * size))
  const y = Math.min(size - 1, Math.floor((relativeY / rect.height) * size))

  return { x, y }
}

function getFilledRatio(level: Level, paths: PathMap): string {
  const completion = getLevelCompletion(level, paths)
  return `${completion.filledCells}/${level.size * level.size}`
}

function toBoardPath(points: Cell[], size: number): string {
  return points
    .map((point, index) => {
      const x = ((point.x + 0.5) / size) * 100
      const y = ((point.y + 0.5) / size) * 100
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

function getPairLabel(index: number): string {
  return `${index + 1}`.padStart(2, '0')
}

function getBoardGap(size: number): number {
  if (size >= 12) {
    return 3
  }

  if (size >= 10) {
    return 4
  }

  if (size >= 8) {
    return 5
  }

  return 8
}

function App() {
  const initialSave = useMemo(readSave, [])
  const [completedIds, setCompletedIds] = useState(initialSave.completedIds)
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(
    getInitialLevelIndex(initialSave.selectedLevelId),
  )
  const [paths, setPaths] = useState<PathMap>({})
  const [activePath, setActivePath] = useState<ActivePath | null>(null)
  const [moveCount, setMoveCount] = useState(0)
  const [justCompletedLevelId, setJustCompletedLevelId] = useState<string | null>(null)

  const boardRef = useRef<HTMLDivElement | null>(null)
  const pathsRef = useRef<PathMap>(paths)
  const activePathRef = useRef<ActivePath | null>(activePath)
  const pointerIdRef = useRef<number | null>(null)

  const currentLevel = levels[selectedLevelIndex]
  const currentLevelId = currentLevel.id

  useEffect(() => {
    pathsRef.current = paths
  }, [paths])

  useEffect(() => {
    activePathRef.current = activePath
  }, [activePath])

  useEffect(() => {
    window.localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        completedIds,
        selectedLevelId: currentLevelId,
      } satisfies SaveData),
    )
  }, [completedIds, currentLevelId])

  useEffect(() => {
    setPaths({})
    setMoveCount(0)
    setActivePath(null)
    setJustCompletedLevelId(null)
  }, [currentLevelId])

  const unlockedIndex = useMemo(() => {
    const furthestCompleted = completedIds.reduce((furthest, completedId) => {
      const index = levels.findIndex((level) => level.id === completedId)
      return Math.max(furthest, index)
    }, -1)

    return Math.min(levels.length - 1, Math.max(0, furthestCompleted + 1))
  }, [completedIds])

  const displayPaths = useMemo(() => {
    if (!activePath) {
      return paths
    }

    return {
      ...paths,
      [activePath.pairId]: activePath.points,
    }
  }, [activePath, paths])

  const occupancy = useMemo(() => {
    const map = new Map<string, string>()

    Object.entries(displayPaths).forEach(([pairId, pairPath]) => {
      pairPath.forEach((point) => {
        map.set(keyOfCell(point), pairId)
      })
    })

    return map
  }, [displayPaths])

  const completion = useMemo(
    () => getLevelCompletion(currentLevel, displayPaths),
    [currentLevel, displayPaths],
  )
  const nextLevel = levels[selectedLevelIndex + 1]
  const connectedPairIds = useMemo(() => {
    return new Set(
      currentLevel.pairs
        .filter((pair) => pathConnectsPair(pair, displayPaths[pair.id]))
        .map((pair) => pair.id),
    )
  }, [currentLevel.pairs, displayPaths])
  const boardGap = getBoardGap(currentLevel.size)

  useEffect(() => {
    if (!completion.completed) {
      return
    }

    setCompletedIds((previous) => {
      if (previous.includes(currentLevelId)) {
        return previous
      }

      return [...previous, currentLevelId]
    })
    setJustCompletedLevelId(currentLevelId)
  }, [completion.completed, currentLevelId])

  const isCurrentLevelCompleted = completedIds.includes(currentLevelId)
  const canGoNext =
    selectedLevelIndex < levels.length - 1 &&
    (selectedLevelIndex + 1 <= unlockedIndex ||
      (nextLevel ? completedIds.includes(nextLevel.id) : false))
  const headerLabel = currentLevel.subtitle

  function commitPaths(nextPaths: PathMap) {
    pathsRef.current = nextPaths
    setPaths(nextPaths)
  }

  function openLevel(index: number) {
    const level = levels[index]
    const isUnlocked = index <= unlockedIndex || completedIds.includes(level.id)

    if (!isUnlocked) {
      return
    }

    startTransition(() => {
      setSelectedLevelIndex(index)
    })
  }

  function beginPath(cell: Cell): ActivePath | null {
    const endpointPair = findEndpointPairAtCell(currentLevel, cell)

    if (endpointPair) {
      const existingPath = pathsRef.current[endpointPair.id]

      if (existingPath && existingPath.length > 1 && cellsEqual(existingPath.at(-1)!, cell)) {
        return { pairId: endpointPair.id, points: existingPath }
      }

      return { pairId: endpointPair.id, points: [cell] }
    }

    const extendableEntry = Object.entries(pathsRef.current).find(([, path]) => {
      return path.length > 1 && cellsEqual(path.at(-1)!, cell)
    })

    if (!extendableEntry) {
      return null
    }

    return {
      pairId: extendableEntry[0],
      points: extendableEntry[1],
    }
  }

  function updateActivePath(cell: Cell) {
    const draft = activePathRef.current
    if (!draft) {
      return
    }

    const currentPair = findPairById(currentLevel, draft.pairId)
    if (!currentPair) {
      return
    }

    const lastPoint = draft.points.at(-1)
    if (!lastPoint || cellsEqual(lastPoint, cell)) {
      return
    }

    if (!areAdjacent(lastPoint, cell)) {
      return
    }

    const previousPoint = draft.points.at(-2)
    if (previousPoint && cellsEqual(previousPoint, cell)) {
      const rewound = {
        ...draft,
        points: draft.points.slice(0, -1),
      }
      activePathRef.current = rewound
      setActivePath(rewound)
      return
    }

    if (draft.points.some((point) => cellsEqual(point, cell))) {
      return
    }

    const targetIsPairEndpoint = currentPair.endpoints.some((endpoint) => cellsEqual(endpoint, cell))
    const lastIsConnectedEndpoint =
      currentPair.endpoints.some((endpoint) => cellsEqual(lastPoint, endpoint)) &&
      draft.points.length > 1

    if (lastIsConnectedEndpoint && !targetIsPairEndpoint) {
      return
    }

    const blockingEndpoint = currentLevel.pairs.find((pair) => {
      if (pair.id === draft.pairId) {
        return false
      }

      return pair.endpoints.some((endpoint) => cellsEqual(endpoint, cell))
    })

    if (blockingEndpoint) {
      return
    }

    const nextPaths = { ...pathsRef.current }
    const crossedPairId = Object.entries(nextPaths).find(([pairId, pairPath]) => {
      if (pairId === draft.pairId) {
        return false
      }

      return pairPath.some((point) => cellsEqual(point, cell))
    })?.[0]

    if (crossedPairId) {
      delete nextPaths[crossedPairId]
      commitPaths(nextPaths)
    }

    const extended = {
      ...draft,
      points: [...draft.points, cell],
    }
    activePathRef.current = extended
    setActivePath(extended)
  }

  function finalizePath() {
    const draft = activePathRef.current
    if (!draft) {
      return
    }

    const nextPaths = { ...pathsRef.current }
    if (draft.points.length > 1) {
      nextPaths[draft.pairId] = draft.points
    } else {
      delete nextPaths[draft.pairId]
    }

    commitPaths(nextPaths)
    activePathRef.current = null
    setActivePath(null)
    setMoveCount((current) => current + 1)
  }

  function resetBoard() {
    commitPaths({})
    activePathRef.current = null
    setActivePath(null)
    setMoveCount(0)
    setJustCompletedLevelId(null)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const board = boardRef.current
    if (!board) {
      return
    }

    const cell = getBoardCell(event, board, currentLevel.size)
    if (!cell) {
      return
    }

    const nextDraft = beginPath(cell)
    if (!nextDraft) {
      return
    }

    pointerIdRef.current = event.pointerId
    board.setPointerCapture(event.pointerId)
    activePathRef.current = nextDraft
    setActivePath(nextDraft)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    const board = boardRef.current
    if (!board) {
      return
    }

    const cell = getBoardCell(event, board, currentLevel.size)
    if (!cell) {
      return
    }

    updateActivePath(cell)
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    finalizePath()
    pointerIdRef.current = null
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    finalizePath()
    pointerIdRef.current = null
  }

  function goToNextLevel() {
    if (!canGoNext) {
      return
    }

    openLevel(selectedLevelIndex + 1)
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-brand">
            <img src="/brand/colors-flow-logo.png" alt="Colors Flow logo" className="hero-logo" />
            <p className="eyebrow">Colors Flow</p>
          </div>
          <h1>ألوان، مسارات، ولوحة لازم تمتلئ بالكامل.</h1>
          <p className="hero-text">
            لعبة ألغاز موجهة للموبايل: اسحب بين النقاط المتشابهة، امنع التقاطع، وامسح
            اللوحة كلها بمسارات نظيفة.
          </p>
        </div>

        <div className="hero-stats" aria-label="Game stats">
          <div className="stat-card">
            <span className="stat-label">المراحل</span>
            <strong>{levels.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">تم الإنجاز</span>
            <strong>{completedIds.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">المقاس</span>
            <strong>
              {currentLevel.size}x{currentLevel.size}
            </strong>
          </div>
        </div>
      </section>

      <section className="game-layout">
        <div className="board-panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">{headerLabel}</p>
              <h2>{currentLevel.title}</h2>
            </div>
            <div className={`status-chip ${completion.completed ? 'done' : ''}`}>
              {completion.completed ? 'مكتملة' : 'قيد الحل'}
            </div>
          </div>

          <div className="board-meta">
            <div>
              <span>المربعات المملوءة</span>
              <strong>{getFilledRatio(currentLevel, displayPaths)}</strong>
            </div>
            <div>
              <span>الخطوات</span>
              <strong>{moveCount}</strong>
            </div>
            <div>
              <span>الألوان</span>
              <strong>{currentLevel.pairs.length}</strong>
            </div>
          </div>

          <div
            ref={boardRef}
            className="game-board"
            style={{
              ['--grid-size' as string]: currentLevel.size,
              ['--cell-gap' as string]: `${boardGap}px`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onLostPointerCapture={handlePointerCancel}
          >
            <div className="board-grid">
              {Array.from({ length: currentLevel.size * currentLevel.size }, (_, index) => {
                const x = index % currentLevel.size
                const y = Math.floor(index / currentLevel.size)
                const cell = { x, y }
                const endpointPair = findEndpointPairAtCell(currentLevel, cell)
                const occupiedPairId = occupancy.get(keyOfCell(cell))
                const occupiedPair = occupiedPairId
                  ? findPairById(currentLevel, occupiedPairId)
                  : null

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`board-cell ${occupiedPair ? 'occupied' : ''}`}
                    style={{
                      ['--cell-glow' as string]:
                        occupiedPair?.color ?? endpointPair?.color ?? 'transparent',
                    }}
                  >
                  </div>
                )
              })}
            </div>

            <svg className="path-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Object.entries(displayPaths).map(([pairId, pairPath]) => {
                const pair = findPairById(currentLevel, pairId)
                if (!pair || pairPath.length < 2) {
                  return null
                }

                return (
                  <g key={pairId}>
                    <path
                      d={toBoardPath(pairPath, currentLevel.size)}
                      className="path-shadow"
                      style={{ stroke: pair.color }}
                    />
                    <path
                      d={toBoardPath(pairPath, currentLevel.size)}
                      className="path-stroke"
                      style={{ stroke: pair.color }}
                    />
                  </g>
                )
              })}
            </svg>

            <div className="endpoint-grid" aria-hidden="true">
              {Array.from({ length: currentLevel.size * currentLevel.size }, (_, index) => {
                const x = index % currentLevel.size
                const y = Math.floor(index / currentLevel.size)
                const cell = { x, y }
                const endpointPair = findEndpointPairAtCell(currentLevel, cell)

                return (
                  <div key={`endpoint-${x}-${y}`} className="endpoint-cell">
                    {endpointPair ? (
                      <div
                        className={`endpoint ${connectedPairIds.has(endpointPair.id) ? 'connected' : ''} ${
                          activePath?.pairId === endpointPair.id ? 'active' : ''
                        }`}
                        style={{ ['--pair-color' as string]: endpointPair.color }}
                      >
                        <span className="endpoint-ring" />
                        <span className="endpoint-core" />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>

            {justCompletedLevelId === currentLevelId ? (
              <div className="victory-banner">
                <p>تمت المرحلة بنجاح</p>
                <button
                  type="button"
                  onClick={selectedLevelIndex < levels.length - 1 ? goToNextLevel : resetBoard}
                >
                  {selectedLevelIndex < levels.length - 1 ? 'المرحلة التالية' : 'إعادة المرحلة'}
                </button>
              </div>
            ) : null}
          </div>

          <div className="controls-row">
            <button type="button" className="ghost-button" onClick={resetBoard}>
              إعادة اللوحة
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => openLevel(Math.max(0, selectedLevelIndex - 1))}
              disabled={selectedLevelIndex === 0}
            >
              السابق
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={goToNextLevel}
              disabled={!canGoNext}
            >
              التالي
            </button>
          </div>
        </div>

        <aside className="sidebar-panel">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">لوحة المراحل</p>
              <h2>اختر المرحلة</h2>
            </div>
            <div className={`status-chip ${isCurrentLevelCompleted ? 'done' : ''}`}>
              {isCurrentLevelCompleted ? 'منجزة' : 'جديدة'}
            </div>
          </div>

          <div className="level-list">
            {levels.map((level, index) => {
              const isUnlocked = index <= unlockedIndex || completedIds.includes(level.id)
              const isSelected = index === selectedLevelIndex
              const isDone = completedIds.includes(level.id)

              return (
                <button
                  key={level.id}
                  type="button"
                  className={`level-card ${isSelected ? 'selected' : ''} ${isDone ? 'done' : ''}`}
                  onClick={() => openLevel(index)}
                  disabled={!isUnlocked}
                >
                  <div className="level-card-top">
                    <span className="level-index">{getPairLabel(index)}</span>
                    <span className="level-size">
                      {level.size}x{level.size}
                    </span>
                  </div>
                  <strong>{level.title}</strong>
                  <span>{level.subtitle}</span>
                  <div className="level-swatches">
                    {level.pairs.map((pair: Pair) => (
                      <span
                        key={pair.id}
                        className="swatch"
                        style={{ backgroundColor: pair.color }}
                      />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="tips-card">
            <p className="panel-kicker">طريقة اللعب</p>
            <ul>
              <li>ابدأ من نقطة لون واسحب حتى النقطة المطابقة.</li>
              <li>الخطوط لا تتقاطع، وكل اللوحة يجب أن تمتلئ.</li>
              <li>إذا مررت فوق خط آخر سيتم مسحه لإعطاءك فرصة إعادة ترتيبه.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
