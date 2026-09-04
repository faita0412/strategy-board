export type Tool =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'markerAlphabet'
  | 'markerNumber'
  | 'operator'
  | 'gadget'
  | 'operatorGadget'
  | 'text'

export type PenObject = {
  id: string

  points: number[]

  x: number
  y: number

  strokeWidth: number
  strokeColor: string

  eraserPaths: number[][]
}

export type Marker = {
  id: string

  x: number
  y: number

  label: string
  color: string

  kind:
    | 'alphabet'
    | 'number'
}

export type TextItem = {
  id: string

  x: number
  y: number

  text: string

  fontSize: number
  color: string
}

export type OperatorDefinition = {
  id: string
  name: string
  image: string

  side:
    | 'attack'
    | 'defense'
}

export type OperatorItem = {
  id: string

  x: number
  y: number

  operatorId: string

  name: string
  image: string
}

export type GadgetDefinition = {
  id: string
  name: string
  image: string

  side:
    | 'attack'
    | 'defense'
    | 'both'
}

export type GadgetItem = {
  id: string

  x: number
  y: number

  gadgetId: string

  name: string
  image: string
}

export type OperatorGadgetDefinition = {
  id: string

  name: string

  operatorId: string

  image: string
}

export type OperatorGadgetItem = {
  id: string

  x: number
  y: number

  operatorGadgetId: string
  operatorId: string

  name: string
  image: string
}

export type FloorDefinition = {
  image: string
}

export type MapDefinition = {
  id: string

  name: string

  defaultFloor: string

  floors: Record<
    string,
    FloorDefinition
  >
}