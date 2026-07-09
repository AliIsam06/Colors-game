import type { Cell, Level, Pair } from './types'

export type PathMap = Record<string, Cell[]>

export function keyOfCell(cell: Cell): string {
  return `${cell.x},${cell.y}`
}

export function cellsEqual(left: Cell, right: Cell): boolean {
  return left.x === right.x && left.y === right.y
}

export function areAdjacent(left: Cell, right: Cell): boolean {
  const dx = Math.abs(left.x - right.x)
  const dy = Math.abs(left.y - right.y)
  return dx + dy === 1
}

export function findPairById(level: Level, pairId: string): Pair | undefined {
  return level.pairs.find((pair) => pair.id === pairId)
}

export function findEndpointPairAtCell(level: Level, cell: Cell): Pair | undefined {
  return level.pairs.find((pair) => {
    return pair.endpoints.some((endpoint) => cellsEqual(endpoint, cell))
  })
}

export function pathConnectsPair(pair: Pair, path: Cell[] | undefined): boolean {
  if (!path || path.length < 2) {
    return false
  }

  const first = path[0]
  const last = path.at(-1)
  if (!last) {
    return false
  }

  return (
    (cellsEqual(first, pair.endpoints[0]) && cellsEqual(last, pair.endpoints[1])) ||
    (cellsEqual(first, pair.endpoints[1]) && cellsEqual(last, pair.endpoints[0]))
  )
}

export function getLevelCompletion(level: Level, paths: PathMap): {
  completed: boolean
  connectedPairs: number
  filledCells: number
} {
  let connectedPairs = 0
  const filled = new Set<string>()

  level.pairs.forEach((pair) => {
    filled.add(keyOfCell(pair.endpoints[0]))
    filled.add(keyOfCell(pair.endpoints[1]))

    const path = paths[pair.id]
    if (pathConnectsPair(pair, path)) {
      connectedPairs += 1
    }

    path?.forEach((point) => filled.add(keyOfCell(point)))
  })

  return {
    completed:
      connectedPairs === level.pairs.length && filled.size === level.size * level.size,
    connectedPairs,
    filledCells: filled.size,
  }
}
