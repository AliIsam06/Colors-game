export type Cell = {
  x: number
  y: number
}

export type Pair = {
  id: string
  color: string
  endpoints: [Cell, Cell]
}

export type PatternName = 'rows' | 'columns' | 'spiral'

export type TransformName =
  | 'none'
  | 'rotate90'
  | 'rotate180'
  | 'rotate270'
  | 'mirror-x'
  | 'mirror-y'

export type LevelBlueprint = {
  id: string
  title: string
  subtitle: string
  size: number
  pattern: PatternName
  lengths: number[]
  transform?: TransformName
}

export type Level = LevelBlueprint & {
  pairs: Pair[]
}
