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
  TextItem,
  OperatorDefinition,
  OperatorItem,
  GadgetDefinition,
  GadgetItem,
  OperatorGadgetDefinition,
  OperatorGadgetItem,
} from '../types/board'

const BOARD_WIDTH = 1550
const BOARD_HEIGHT = 900

type BoardCanvasProps = {
  tool: Tool

  penWidth: number
  penColor: string

  textValue: string
  textFontSize: number
  textColor: string

  imagePath: string

  penObjects: PenObject[]

  setPenObjects: React.Dispatch<
    React.SetStateAction<PenObject[]>
  >

  markers: Marker[]

  setMarkers: React.Dispatch<
    React.SetStateAction<Marker[]>
  >

  textItems: TextItem[]

  setTextItems: React.Dispatch<
    React.SetStateAction<TextItem[]>
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

  onDefenseOperatorSelect: (
    operatorId: string
  ) => void
}

/* ========================================
   OPERATOR
======================================== */

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

  onSelect: (
    operatorId: string
  ) => void
}

function OperatorIcon({
  item,
  tool,
  onMove,
  onDelete,
  onSelect,
}: OperatorIconProps) {
  const [image] =
    useImage(
      item.image
    )

  return (
    <Group
      x={
        item.x
      }

      y={
        item.y
      }

      draggable={
        tool ===
        'select'
      }

      onDragEnd={(e) => {
        onMove(
          item.id,
          e.target.x(),
          e.target.y()
        )
      }}

      onClick={(e) => {
        if (
          tool !==
          'select'
        ) {
          return
        }

        e.cancelBubble =
          true

        onSelect(
          item.operatorId
        )
      }}

      onMouseDown={(e) => {
        if (
          tool !==
          'eraser'
        ) {
          return
        }

        e.cancelBubble =
          true

        onDelete(
          item.id
        )
      }}
    >
      {image && (
        <KonvaImage
          image={
            image
          }

          x={
            -18
          }

          y={
            -18
          }

          width={
            36
          }

          height={
            36
          }
        />
      )}
    </Group>
  )
}

/* ========================================
   COMMON GADGET
======================================== */

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
    useImage(
      item.image
    )

  return (
    <Group
      x={
        item.x
      }

      y={
        item.y
      }

      draggable={
        tool ===
        'select'
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
          tool !==
          'eraser'
        ) {
          return
        }

        e.cancelBubble =
          true

        onDelete(
          item.id
        )
      }}
    >
      {image && (
        <KonvaImage
          image={
            image
          }

          x={
            -16
          }

          y={
            -16
          }

          width={
            32
          }

          height={
            32
          }
        />
      )}
    </Group>
  )
}

/* ========================================
   UNIQUE GADGET
======================================== */

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
    useImage(
      item.image
    )

  return (
    <Group
      x={
        item.x
      }

      y={
        item.y
      }

      draggable={
        tool ===
        'select'
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
          tool !==
          'eraser'
        ) {
          return
        }

        e.cancelBubble =
          true

        onDelete(
          item.id
        )
      }}
    >
      {image && (
        <KonvaImage
          image={
            image
          }

          x={
            -16
          }

          y={
            -16
          }

          width={
            32
          }

          height={
            32
          }
        />
      )}
    </Group>
  )
}

/* ========================================
   BOARD
======================================== */

function BoardCanvas({
  tool,

  penWidth,
  penColor,

  textValue,
  textFontSize,
  textColor,

  imagePath,

  penObjects,
  setPenObjects,

  markers,
  setMarkers,

  textItems,
  setTextItems,

  setAlphabetCount,
  setNumberCount,

  operatorItems,
  setOperatorItems,

  operators,

  gadgetItems,
  setGadgetItems,

  operatorGadgetItems,
  setOperatorGadgetItems,

  onDefenseOperatorSelect,
}: BoardCanvasProps) {
  const isDrawing =
    useRef(
      false
    )

  const activePenId =
    useRef<
      string | null
    >(
      null
    )

  const getPointerPosition = (
    stage: Konva.Stage
  ) => {
    return (
      stage.getPointerPosition()
    )
  }

  /* ========================================
     DEFENSE OPERATOR SELECT
  ======================================== */

  const handleOperatorClick = (
    operatorId: string
  ) => {
    const operator =
      operators.find(
        (item) =>
          item.id ===
          operatorId
      )

    if (
      !operator ||
      operator.side !==
        'defense'
    ) {
      return
    }

    onDefenseOperatorSelect(
      operator.id
    )
  }

  /* ========================================
     MARKER COUNT
  ======================================== */

  const numberToAlphabet = (
    index: number
  ) => {
    let result =
      ''

    let number =
      index + 1

    while (
      number > 0
    ) {
      number--

      result =
        String.fromCharCode(
          65 +
          (
            number %
            26
          )
        ) +
        result

      number =
        Math.floor(
          number /
          26
        )
    }

    return result
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

    let index =
      0

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

    let nextNumber =
      1

    while (
      usedNumbers.includes(
        nextNumber
      ) &&
      nextNumber <=
        5
    ) {
      nextNumber++
    }

    if (
      nextNumber >
      5
    ) {
      nextNumber =
        1
    }

    setNumberCount(
      nextNumber
    )
  }

  /* ========================================
     MOUSE DOWN

     マップをクリックして配置するのは
     PEN / ERASER / TEXT のみ
  ======================================== */

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent>
  ) => {
    const stage =
      e.target.getStage()

    if (
      !stage
    ) {
      return
    }

    const pointer =
      getPointerPosition(
        stage
      )

    if (
      !pointer
    ) {
      return
    }

    /* PEN */

    if (
      tool ===
      'pen'
    ) {
      const id =
        crypto.randomUUID()

      isDrawing.current =
        true

      activePenId.current =
        id

      setPenObjects(
        (
          current
        ) => [
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

            eraserPaths:
              [],
          },
        ]
      )

      return
    }

    /* ERASER */

    if (
      tool ===
      'eraser'
    ) {
      isDrawing.current =
        true

      setPenObjects(
        (
          current
        ) =>
          current.map(
            (
              penObject
            ) => ({
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

    /* TEXT */

    if (
      tool ===
      'text'
    ) {
      const trimmedText =
        textValue.trim()

      if (
        !trimmedText
      ) {
        return
      }

      setTextItems(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              pointer.x,

            y:
              pointer.y,

            text:
              trimmedText,

            fontSize:
              textFontSize,

            color:
              textColor,
          },
        ]
      )

      return
    }
  }

  /* ========================================
     MOUSE MOVE
  ======================================== */

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

    if (
      !stage
    ) {
      return
    }

    const pointer =
      getPointerPosition(
        stage
      )

    if (
      !pointer
    ) {
      return
    }

    /* PEN */

    if (
      tool ===
      'pen'
    ) {
      const penId =
        activePenId.current

      if (
        !penId
      ) {
        return
      }

      setPenObjects(
        (
          current
        ) =>
          current.map(
            (
              penObject
            ) => {
              if (
                penObject.id !==
                penId
              ) {
                return (
                  penObject
                )
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

    /* ERASER */

    if (
      tool ===
      'eraser'
    ) {
      setPenObjects(
        (
          current
        ) =>
          current.map(
            (
              penObject
            ) => {
              const paths = [
                ...penObject.eraserPaths,
              ]

              const lastIndex =
                paths.length -
                1

              if (
                lastIndex <
                0
              ) {
                return (
                  penObject
                )
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

  /* ========================================
     PEN MOVE / DELETE
  ======================================== */

  const movePenObject = (
    id: string,
    x: number,
    y: number
  ) => {
    setPenObjects(
      (
        current
      ) =>
        current.map(
          (
            item
          ) =>
            item.id ===
            id
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
      (
        current
      ) =>
        current.filter(
          (
            item
          ) =>
            item.id !==
            id
        )
    )
  }

  /* ========================================
     MARKER MOVE / DELETE
  ======================================== */

  const moveMarker = (
    id: string,
    x: number,
    y: number
  ) => {
    setMarkers(
      (
        current
      ) =>
        current.map(
          (
            item
          ) =>
            item.id ===
            id
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
      (
        current
      ) => {
        const next =
          current.filter(
            (
              item
            ) =>
              item.id !==
              id
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

  /* ========================================
     TEXT MOVE / DELETE
  ======================================== */

  const moveTextItem = (
    id: string,
    x: number,
    y: number
  ) => {
    setTextItems(
      (
        current
      ) =>
        current.map(
          (
            item
          ) =>
            item.id ===
            id
              ? {
                  ...item,
                  x,
                  y,
                }
              : item
        )
    )
  }

  const deleteTextItem = (
    id: string
  ) => {
    setTextItems(
      (
        current
      ) =>
        current.filter(
          (
            item
          ) =>
            item.id !==
            id
        )
    )
  }

  /* ========================================
     OPERATOR MOVE / DELETE
  ======================================== */

  const moveOperator = (
    id: string,
    x: number,
    y: number
  ) => {
    setOperatorItems(
      (
        current
      ) =>
        current.map(
          (
            item
          ) =>
            item.id ===
            id
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
      (
        current
      ) =>
        current.filter(
          (
            item
          ) =>
            item.id !==
            id
        )
    )
  }

  /* ========================================
     GADGET MOVE / DELETE
  ======================================== */

  const moveGadget = (
    id: string,
    x: number,
    y: number
  ) => {
    setGadgetItems(
      (
        current
      ) =>
        current.map(
          (
            item
          ) =>
            item.id ===
            id
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
      (
        current
      ) =>
        current.filter(
          (
            item
          ) =>
            item.id !==
            id
        )
    )
  }

  /* ========================================
     UNIQUE GADGET MOVE / DELETE
  ======================================== */

  const moveOperatorGadget = (
    id: string,
    x: number,
    y: number
  ) => {
    setOperatorGadgetItems(
      (
        current
      ) =>
        current.map(
          (
            item
          ) =>
            item.id ===
            id
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
      (
        current
      ) =>
        current.filter(
          (
            item
          ) =>
            item.id !==
            id
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

        {/* =================================
            MAP
        ================================= */}

        <Layer>
          <MapBackground
            imagePath={
              imagePath
            }
          />
        </Layer>

        {/* =================================
            PEN
        ================================= */}

        {penObjects.map(
          (
            penObject
          ) => (
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

        {/* =================================
            MARKERS
        ================================= */}

        <Layer>
          {markers.map(
            (
              marker
            ) => (
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
                      radius={
                        18
                      }

                      fill={
                        marker.color
                      }
                    />

                    <Text
                      text={
                        marker.label
                      }

                      x={
                        -18
                      }

                      y={
                        -9
                      }

                      width={
                        36
                      }

                      align="center"

                      fill="#111111"

                      fontSize={
                        18
                      }

                      fontStyle="bold"

                      listening={
                        false
                      }
                    />
                  </>
                ) : (
                  <>
                    <Rect
                      x={
                        -18
                      }

                      y={
                        -18
                      }

                      width={
                        36
                      }

                      height={
                        36
                      }

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

                      x={
                        -18
                      }

                      y={
                        -9
                      }

                      width={
                        36
                      }

                      align="center"

                      fill="#ffffff"

                      fontSize={
                        18
                      }

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

        {/* =================================
            TEXT
        ================================= */}

        <Layer>
          {textItems.map(
            (
              item
            ) => (
              <Group
                key={
                  item.id
                }

                x={
                  item.x
                }

                y={
                  item.y
                }

                draggable={
                  tool ===
                  'select'
                }

                onDragEnd={(e) =>
                  moveTextItem(
                    item.id,
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

                  deleteTextItem(
                    item.id
                  )
                }}
              >
                <Text
                  text={
                    item.text
                  }

                  fill={
                    item.color
                  }

                  fontSize={
                    item.fontSize
                  }

                  fontStyle="bold"

                  padding={
                    4
                  }

                  shadowColor="#000000"

                  shadowBlur={
                    4
                  }

                  shadowOpacity={
                    0.8
                  }

                  shadowOffsetX={
                    1
                  }

                  shadowOffsetY={
                    1
                  }
                />
              </Group>
            )
          )}
        </Layer>

        {/* =================================
            OPERATORS
        ================================= */}

        <Layer>
          {operatorItems.map(
            (
              item
            ) => (
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

                onSelect={
                  handleOperatorClick
                }
              />
            )
          )}
        </Layer>

        {/* =================================
            COMMON GADGETS
        ================================= */}

        <Layer>
          {gadgetItems.map(
            (
              item
            ) => (
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

        {/* =================================
            UNIQUE GADGETS
        ================================= */}

        <Layer>
          {operatorGadgetItems.map(
            (
              item
            ) => (
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