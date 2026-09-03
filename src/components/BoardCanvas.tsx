import { useRef } from 'react'

import {
  Stage,
  Layer,
  Line,
  Group,
  Circle,
  Rect,
  Text,
  Image as KonvaImage,
} from 'react-konva'

import useImage from 'use-image'
import type Konva from 'konva'

import MapBackground from './MapBackground'

import type {
  Tool,
  PenObject,
  Marker,
  OperatorDefinition,
  OperatorItem,
  GadgetDefinition,
  GadgetItem,
  OperatorGadgetDefinition,
  OperatorGadgetItem,
} from '../types/board'

const BOARD_WIDTH = 1350
const BOARD_HEIGHT = 900

const NUMBER_COLORS: Record<number, string> = {
  1: '#ef4444',
  2: '#3b82f6',
  3: '#22c55e',
  4: '#eab308',
  5: '#a855f7',
}

function numberToAlphabet(index: number) {
  let result = ''
  let number = index + 1

  while (number > 0) {
    number--

    result =
      String.fromCharCode(
        65 + (number % 26)
      ) + result

    number = Math.floor(
      number / 26
    )
  }

  return result
}

type BoardCanvasProps = {
  tool: Tool

  penWidth: number
  penColor: string

  imagePath: string

  penObjects: PenObject[]
  setPenObjects: React.Dispatch<
    React.SetStateAction<PenObject[]>
  >

  markers: Marker[]
  setMarkers: React.Dispatch<
    React.SetStateAction<Marker[]>
  >

  alphabetCount: number
  setAlphabetCount: React.Dispatch<
    React.SetStateAction<number>
  >

  numberCount: number
  setNumberCount: React.Dispatch<
    React.SetStateAction<number>
  >

  operatorItems: OperatorItem[]
  setOperatorItems: React.Dispatch<
    React.SetStateAction<OperatorItem[]>
  >

  selectedOperatorId: string | null
  operators: OperatorDefinition[]

  gadgetItems: GadgetItem[]
  setGadgetItems: React.Dispatch<
    React.SetStateAction<GadgetItem[]>
  >

  selectedGadgetId: string | null
  gadgets: GadgetDefinition[]

  operatorGadgetItems: OperatorGadgetItem[]
  setOperatorGadgetItems: React.Dispatch<
    React.SetStateAction<OperatorGadgetItem[]>
  >

  selectedOperatorGadgetId: string | null
  operatorGadgets: OperatorGadgetDefinition[]
}

type OperatorIconProps = {
  item: OperatorItem
  tool: Tool

  onMove: (
    id: string,
    x: number,
    y: number
  ) => void

  onDelete: (
    id: string
  ) => void
}

function OperatorIcon({
  item,
  tool,
  onMove,
  onDelete,
}: OperatorIconProps) {
  const [image] =
    useImage(item.image)

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable={
        tool === 'select'
      }
      onDragEnd={(e) => {
        onMove(
          item.id,
          e.target.x(),
          e.target.y()
        )
      }}
      onMouseDown={(e) => {
        if (
          tool !== 'eraser'
        ) {
          return
        }

        e.cancelBubble = true

        onDelete(
          item.id
        )
      }}
    >
      {image && (
        <KonvaImage
          image={image}
          x={-18}
          y={-18}
          width={36}
          height={36}
        />
      )}
    </Group>
  )
}

type GadgetIconProps = {
  item: GadgetItem
  tool: Tool

  onMove: (
    id: string,
    x: number,
    y: number
  ) => void

  onDelete: (
    id: string
  ) => void
}

function GadgetIcon({
  item,
  tool,
  onMove,
  onDelete,
}: GadgetIconProps) {
  const [image] =
    useImage(item.image)

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable={
        tool === 'select'
      }
      onDragEnd={(e) => {
        onMove(
          item.id,
          e.target.x(),
          e.target.y()
        )
      }}
      onMouseDown={(e) => {
        if (
          tool !== 'eraser'
        ) {
          return
        }

        e.cancelBubble = true

        onDelete(
          item.id
        )
      }}
    >
      {image && (
        <KonvaImage
          image={image}
          x={-16}
          y={-16}
          width={32}
          height={32}
        />
      )}
    </Group>
  )
}

type OperatorGadgetIconProps = {
  item: OperatorGadgetItem
  tool: Tool

  onMove: (
    id: string,
    x: number,
    y: number
  ) => void

  onDelete: (
    id: string
  ) => void
}

function OperatorGadgetIcon({
  item,
  tool,
  onMove,
  onDelete,
}: OperatorGadgetIconProps) {
  const [image] =
    useImage(item.image)

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable={
        tool === 'select'
      }
      onDragEnd={(e) => {
        onMove(
          item.id,
          e.target.x(),
          e.target.y()
        )
      }}
      onMouseDown={(e) => {
        if (
          tool !== 'eraser'
        ) {
          return
        }

        e.cancelBubble = true

        onDelete(
          item.id
        )
      }}
    >
      {image && (
        <KonvaImage
          image={image}
          x={-16}
          y={-16}
          width={32}
          height={32}
        />
      )}
    </Group>
  )
}

function BoardCanvas({
  tool,

  penWidth,
  penColor,

  imagePath,

  penObjects,
  setPenObjects,

  markers,
  setMarkers,

  alphabetCount,
  setAlphabetCount,

  numberCount,
  setNumberCount,

  operatorItems,
  setOperatorItems,

  selectedOperatorId,
  operators,

  gadgetItems,
  setGadgetItems,

  selectedGadgetId,
  gadgets,

  operatorGadgetItems,
  setOperatorGadgetItems,

  selectedOperatorGadgetId,
  operatorGadgets,
}: BoardCanvasProps) {
  const isDrawing =
    useRef(false)

  const activePenId =
    useRef<string | null>(
      null
    )

  const getPointerPosition = (
    stage: Konva.Stage
  ) => {
    return stage.getPointerPosition()
  }

  const recalculateAlphabetCount = (
    nextMarkers: Marker[]
  ) => {
    const usedLabels =
      nextMarkers
        .filter(
          (marker) =>
            marker.kind ===
            'alphabet'
        )
        .map(
          (marker) =>
            marker.label
        )

    let index = 0

    while (
      usedLabels.includes(
        numberToAlphabet(
          index
        )
      )
    ) {
      index++
    }

    setAlphabetCount(
      index
    )
  }

  const recalculateNumberCount = (
    nextMarkers: Marker[]
  ) => {
    const usedNumbers =
      nextMarkers
        .filter(
          (marker) =>
            marker.kind ===
            'number'
        )
        .map(
          (marker) =>
            Number(
              marker.label
            )
        )

    let nextNumber = 1

    while (
      usedNumbers.includes(
        nextNumber
      ) &&
      nextNumber <= 5
    ) {
      nextNumber++
    }

    if (
      nextNumber > 5
    ) {
      nextNumber = 1
    }

    setNumberCount(
      nextNumber
    )
  }

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent>
  ) => {
    const stage =
      e.target.getStage()

    if (!stage) {
      return
    }

    const pointer =
      getPointerPosition(
        stage
      )

    if (!pointer) {
      return
    }

    if (
      tool === 'pen'
    ) {
      const id =
        crypto.randomUUID()

      isDrawing.current =
        true

      activePenId.current =
        id

      setPenObjects(
        (current) => [
          ...current,

          {
            id,

            points: [
              pointer.x,
              pointer.y,
            ],

            x: 0,
            y: 0,

            strokeWidth:
              penWidth,

            strokeColor:
              penColor,

            eraserPaths: [],
          },
        ]
      )

      return
    }

    if (
      tool === 'eraser'
    ) {
      isDrawing.current =
        true

      setPenObjects(
        (current) =>
          current.map(
            (penObject) => ({
              ...penObject,

              eraserPaths: [
                ...penObject.eraserPaths,

                [
                  pointer.x -
                    penObject.x,

                  pointer.y -
                    penObject.y,
                ],
              ],
            })
          )
      )

      return
    }

    if (
      tool ===
      'markerAlphabet'
    ) {
      const label =
        numberToAlphabet(
          alphabetCount
        )

      setMarkers(
        (current) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              pointer.x,

            y:
              pointer.y,

            label,

            color:
              '#f59e0b',

            kind:
              'alphabet',
          },
        ]
      )

      setAlphabetCount(
        alphabetCount + 1
      )

      return
    }

    if (
      tool ===
      'markerNumber'
    ) {
      setMarkers(
        (current) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              pointer.x,

            y:
              pointer.y,

            label:
              String(
                numberCount
              ),

            color:
              NUMBER_COLORS[
                numberCount
              ],

            kind:
              'number',
          },
        ]
      )

      setNumberCount(
        numberCount === 5
          ? 1
          : numberCount + 1
      )

      return
    }

    if (
      tool ===
        'operator' &&
      selectedOperatorId
    ) {
      const operator =
        operators.find(
          (item) =>
            item.id ===
            selectedOperatorId
        )

      if (!operator) {
        return
      }

      setOperatorItems(
        (current) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              pointer.x,

            y:
              pointer.y,

            operatorId:
              operator.id,

            name:
              operator.name,

            image:
              operator.image,
          },
        ]
      )

      return
    }

    if (
      tool ===
        'gadget' &&
      selectedGadgetId
    ) {
      const gadget =
        gadgets.find(
          (item) =>
            item.id ===
            selectedGadgetId
        )

      if (!gadget) {
        return
      }

      setGadgetItems(
        (current) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              pointer.x,

            y:
              pointer.y,

            gadgetId:
              gadget.id,

            name:
              gadget.name,

            image:
              gadget.image,
          },
        ]
      )

      return
    }

    if (
      tool ===
        'operatorGadget' &&
      selectedOperatorGadgetId
    ) {
      const gadget =
        operatorGadgets.find(
          (item) =>
            item.id ===
            selectedOperatorGadgetId
        )

      if (!gadget) {
        return
      }

      setOperatorGadgetItems(
        (current) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              pointer.x,

            y:
              pointer.y,

            operatorGadgetId:
              gadget.id,

            operatorId:
              gadget.operatorId,

            name:
              gadget.name,

            image:
              gadget.image,
          },
        ]
      )
    }
  }

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent>
  ) => {
    if (
      !isDrawing.current
    ) {
      return
    }

    const stage =
      e.target.getStage()

    if (!stage) {
      return
    }

    const pointer =
      getPointerPosition(
        stage
      )

    if (!pointer) {
      return
    }

    if (
      tool === 'pen'
    ) {
      const penId =
        activePenId.current

      if (!penId) {
        return
      }

      setPenObjects(
        (current) =>
          current.map(
            (penObject) => {
              if (
                penObject.id !==
                penId
              ) {
                return penObject
              }

              return {
                ...penObject,

                points: [
                  ...penObject.points,

                  pointer.x -
                    penObject.x,

                  pointer.y -
                    penObject.y,
                ],
              }
            }
          )
      )

      return
    }

    if (
      tool === 'eraser'
    ) {
      setPenObjects(
        (current) =>
          current.map(
            (penObject) => {
              const paths = [
                ...penObject.eraserPaths,
              ]

              const lastIndex =
                paths.length - 1

              if (
                lastIndex < 0
              ) {
                return penObject
              }

              paths[
                lastIndex
              ] = [
                ...paths[
                  lastIndex
                ],

                pointer.x -
                  penObject.x,

                pointer.y -
                  penObject.y,
              ]

              return {
                ...penObject,

                eraserPaths:
                  paths,
              }
            }
          )
      )
    }
  }

  const handleMouseUp = () => {
    isDrawing.current =
      false

    activePenId.current =
      null
  }

  const movePenObject = (
    id: string,
    x: number,
    y: number
  ) => {
    setPenObjects(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  x,
                  y,
                }
              : item
        )
    )
  }

  const deletePenObject = (
    id: string
  ) => {
    setPenObjects(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    )
  }

  const moveMarker = (
    id: string,
    x: number,
    y: number
  ) => {
    setMarkers(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  x,
                  y,
                }
              : item
        )
    )
  }

  const deleteMarker = (
    id: string
  ) => {
    setMarkers(
      (current) => {
        const next =
          current.filter(
            (item) =>
              item.id !== id
          )

        recalculateAlphabetCount(
          next
        )

        recalculateNumberCount(
          next
        )

        return next
      }
    )
  }

  const moveOperator = (
    id: string,
    x: number,
    y: number
  ) => {
    setOperatorItems(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  x,
                  y,
                }
              : item
        )
    )
  }

  const deleteOperator = (
    id: string
  ) => {
    setOperatorItems(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    )
  }

  const moveGadget = (
    id: string,
    x: number,
    y: number
  ) => {
    setGadgetItems(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  x,
                  y,
                }
              : item
        )
    )
  }

  const deleteGadget = (
    id: string
  ) => {
    setGadgetItems(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    )
  }

  const moveOperatorGadget = (
    id: string,
    x: number,
    y: number
  ) => {
    setOperatorGadgetItems(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  x,
                  y,
                }
              : item
        )
    )
  }

  const deleteOperatorGadget = (
    id: string
  ) => {
    setOperatorGadgetItems(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    )
  }

  return (
    <div className="canvas-wrapper">

      <Stage
        width={
          BOARD_WIDTH
        }
        height={
          BOARD_HEIGHT
        }
        onMouseDown={
          handleMouseDown
        }
        onMouseMove={
          handleMouseMove
        }
        onMouseUp={
          handleMouseUp
        }
        onMouseLeave={
          handleMouseUp
        }
      >

        {/* MAP */}

        <Layer>
          <MapBackground
            imagePath={
              imagePath
            }
          />
        </Layer>

        {/* PEN */}

        {penObjects.map(
          (penObject) => (
            <Layer
              key={
                penObject.id
              }
            >
              <Group
                x={
                  penObject.x
                }
                y={
                  penObject.y
                }
                draggable={
                  tool ===
                  'select'
                }
                onDragEnd={(e) =>
                  movePenObject(
                    penObject.id,
                    e.target.x(),
                    e.target.y()
                  )
                }
                onMouseDown={(e) => {
                  if (
                    tool !==
                    'eraser'
                  ) {
                    return
                  }

                  e.cancelBubble =
                    true

                  deletePenObject(
                    penObject.id
                  )
                }}
              >
                <Line
                  points={
                    penObject.points
                  }

                  stroke={
                    penObject.strokeColor
                  }

                  strokeWidth={
                    penObject.strokeWidth
                  }

                  lineCap="round"

                  lineJoin="round"
                />

                {penObject.eraserPaths.map(
                  (
                    erasePath,
                    index
                  ) => (
                    <Line
                      key={
                        index
                      }

                      points={
                        erasePath
                      }

                      stroke="black"

                      strokeWidth={
                        22
                      }

                      lineCap="round"

                      lineJoin="round"

                      globalCompositeOperation="destination-out"
                    />
                  )
                )}
              </Group>
            </Layer>
          )
        )}

        {/* MARKERS */}

        <Layer>
          {markers.map(
            (marker) => (
              <Group
                key={
                  marker.id
                }

                x={
                  marker.x
                }

                y={
                  marker.y
                }

                draggable={
                  tool ===
                  'select'
                }

                onDragEnd={(e) =>
                  moveMarker(
                    marker.id,
                    e.target.x(),
                    e.target.y()
                  )
                }

                onMouseDown={(e) => {
                  if (
                    tool !==
                    'eraser'
                  ) {
                    return
                  }

                  e.cancelBubble =
                    true

                  deleteMarker(
                    marker.id
                  )
                }}
              >
                {marker.kind ===
                'alphabet' ? (
                  <>
                    <Circle
                      radius={18}

                      fill={
                        marker.color
                      }
                    />

                    <Text
                      text={
                        marker.label
                      }

                      x={-18}
                      y={-9}

                      width={36}

                      align="center"

                      fill="#111111"

                      fontSize={18}

                      fontStyle="bold"

                      listening={
                        false
                      }
                    />
                  </>
                ) : (
                  <>
                    <Rect
                      x={-18}
                      y={-18}

                      width={36}
                      height={36}

                      fill={
                        marker.color
                      }

                      cornerRadius={
                        3
                      }
                    />

                    <Text
                      text={
                        marker.label
                      }

                      x={-18}
                      y={-9}

                      width={36}

                      align="center"

                      fill="#ffffff"

                      fontSize={18}

                      fontStyle="bold"

                      listening={
                        false
                      }
                    />
                  </>
                )}
              </Group>
            )
          )}
        </Layer>

        {/* OPERATORS */}

        <Layer>
          {operatorItems.map(
            (item) => (
              <OperatorIcon
                key={
                  item.id
                }
                item={
                  item
                }
                tool={
                  tool
                }
                onMove={
                  moveOperator
                }
                onDelete={
                  deleteOperator
                }
              />
            )
          )}
        </Layer>

        {/* COMMON GADGETS */}

        <Layer>
          {gadgetItems.map(
            (item) => (
              <GadgetIcon
                key={
                  item.id
                }
                item={
                  item
                }
                tool={
                  tool
                }
                onMove={
                  moveGadget
                }
                onDelete={
                  deleteGadget
                }
              />
            )
          )}
        </Layer>

        {/* UNIQUE GADGETS */}

        <Layer>
          {operatorGadgetItems.map(
            (item) => (
              <OperatorGadgetIcon
                key={
                  item.id
                }
                item={
                  item
                }
                tool={
                  tool
                }
                onMove={
                  moveOperatorGadget
                }
                onDelete={
                  deleteOperatorGadget
                }
              />
            )
          )}
        </Layer>

      </Stage>

    </div>
  )
}

export default BoardCanvas