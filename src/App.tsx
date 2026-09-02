import { useRef, useState } from 'react'
import {
  Stage,
  Layer,
  Rect,
  Text,
  Line,
  Circle,
  Group,
  Image as KonvaImage,
} from 'react-konva'
import type Konva from 'konva'
import useImage from 'use-image'
import './App.css'

type Tool =
  | 'select'
  | 'pen'
  | 'eraser'
  | 'markerAlphabet'
  | 'markerNumber'

type PenObject = {
  id: string
  points: number[]
  x: number
  y: number
  eraserPaths: number[][]
}

type Marker = {
  id: string
  x: number
  y: number
  label: string
  color: string
  kind: 'alphabet' | 'number'
}

/*
  数字マーカーの色
*/
const NUMBER_COLORS: Record<number, string> = {
  1: '#ef4444',
  2: '#3b82f6',
  3: '#22c55e',
  4: '#eab308',
  5: '#a855f7',
}

/*
  Clubhouse マップ画像
*/
const CLUBHOUSE_MAPS: Record<string, string> = {
  B1: '/maps/clubhouse/basement.webp',
  '1F': '/maps/clubhouse/first-floor.webp',
  '2F': '/maps/clubhouse/second-floor.webp',
}

/*
  Alphabet変換

  0 = A
  1 = B
  ...
  25 = Z
  26 = AA
*/
function numberToAlphabet(index: number) {
  let result = ''
  let number = index + 1

  while (number > 0) {
    number--

    result =
      String.fromCharCode(65 + (number % 26)) + result

    number = Math.floor(number / 26)
  }

  return result
}

/*
  ID生成
*/
function createId() {
  return `${Date.now()}-${Math.random()}`
}

/*
  ========================================
  MAP BACKGROUND
  ========================================
*/
function MapBackground({
  floor,
}: {
  floor: string
}) {
  const imagePath = CLUBHOUSE_MAPS[floor]

  const [image] = useImage(
    imagePath ?? ''
  )

  if (!image) {
    return (
      <Text
        text={`MAP IMAGE NOT FOUND - CLUBHOUSE ${floor}`}
        x={0}
        y={330}
        width={1100}
        align="center"
        fill="#39414b"
        fontSize={26}
        fontStyle="bold"
        listening={false}
      />
    )
  }

  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={1100}
      height={720}
      listening={false}
    />
  )
}

/*
  ========================================
  APP
  ========================================
*/
function App() {
  const [tool, setTool] =
    useState<Tool>('select')

  const [floor, setFloor] =
    useState('2F')

  /*
    PEN OBJECTS
  */
  const [penObjects, setPenObjects] =
    useState<PenObject[]>([])

  /*
    MARKERS
  */
  const [markers, setMarkers] =
    useState<Marker[]>([])

  /*
    次のAlphabet
  */
  const [
    alphabetCount,
    setAlphabetCount,
  ] = useState(0)

  /*
    次のNumber
  */
  const [
    numberCount,
    setNumberCount,
  ] = useState(1)

  /*
    描画状態
  */
  const isDrawing =
    useRef(false)

  const isErasing =
    useRef(false)

  const currentPenId =
    useRef<string | null>(null)

  /*
    ========================================
    MOUSE DOWN
    ========================================
  */
  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent>
  ) => {
    const stage =
      e.target.getStage()

    if (!stage) return

    const pos =
      stage.getPointerPosition()

    if (!pos) return

    /*
      ----------------
      PEN
      ----------------
    */
    if (tool === 'pen') {
      const id = createId()

      isDrawing.current = true

      currentPenId.current =
        id

      setPenObjects((prev) => [
        ...prev,
        {
          id,
          points: [
            pos.x,
            pos.y,
          ],
          x: 0,
          y: 0,
          eraserPaths: [],
        },
      ])

      return
    }

    /*
      ----------------
      ERASER
      ----------------
    */
    if (tool === 'eraser') {
      isErasing.current = true

      setPenObjects((prev) =>
        prev.map((pen) => ({
          ...pen,

          eraserPaths: [
            ...pen.eraserPaths,

            [
              pos.x - pen.x,
              pos.y - pen.y,
            ],
          ],
        }))
      )

      return
    }

    /*
      ----------------
      ALPHABET MARKER
      ----------------
    */
    if (
      tool ===
      'markerAlphabet'
    ) {
      const label =
        numberToAlphabet(
          alphabetCount
        )

      setMarkers((prev) => [
        ...prev,
        {
          id: createId(),
          x: pos.x,
          y: pos.y,
          label,
          color: '#f5a623',
          kind: 'alphabet',
        },
      ])

      setAlphabetCount(
        (prev) => prev + 1
      )

      return
    }

    /*
      ----------------
      NUMBER MARKER
      1〜5
      ----------------
    */
    if (
      tool ===
      'markerNumber'
    ) {
      /*
        5まで置いたら終了
      */
      if (numberCount > 5) {
        return
      }

      const label =
        String(numberCount)

      const color =
        NUMBER_COLORS[
          numberCount
        ]

      setMarkers((prev) => [
        ...prev,
        {
          id: createId(),
          x: pos.x,
          y: pos.y,
          label,
          color,
          kind: 'number',
        },
      ])

      setNumberCount(
        (prev) => prev + 1
      )

      return
    }
  }

  /*
    ========================================
    MOUSE MOVE
    ========================================
  */
  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent>
  ) => {
    const stage =
      e.target.getStage()

    if (!stage) return

    const point =
      stage.getPointerPosition()

    if (!point) return

    /*
      ----------------
      PEN DRAWING
      ----------------
    */
    if (
      tool === 'pen' &&
      isDrawing.current &&
      currentPenId.current
    ) {
      const activeId =
        currentPenId.current

      setPenObjects((prev) =>
        prev.map((pen) => {
          if (
            pen.id !== activeId
          ) {
            return pen
          }

          return {
            ...pen,

            points:
              pen.points.concat([
                point.x -
                  pen.x,

                point.y -
                  pen.y,
              ]),
          }
        })
      )

      return
    }

    /*
      ----------------
      ERASER
      ----------------
    */
    if (
      tool === 'eraser' &&
      isErasing.current
    ) {
      setPenObjects((prev) =>
        prev.map((pen) => {
          if (
            pen.eraserPaths
              .length === 0
          ) {
            return pen
          }

          const paths =
            pen.eraserPaths.map(
              (path) => [...path]
            )

          const lastIndex =
            paths.length - 1

          paths[lastIndex] =
            paths[
              lastIndex
            ].concat([
              point.x -
                pen.x,

              point.y -
                pen.y,
            ])

          return {
            ...pen,
            eraserPaths:
              paths,
          }
        })
      )
    }
  }

  /*
    ========================================
    MOUSE UP
    ========================================
  */
  const handleMouseUp = () => {
    isDrawing.current = false

    isErasing.current = false

    currentPenId.current =
      null
  }

  /*
    ========================================
    PEN MOVE
    ========================================
  */
  const handlePenDragEnd = (
    id: string,
    x: number,
    y: number
  ) => {
    setPenObjects((prev) =>
      prev.map((pen) =>
        pen.id === id
          ? {
              ...pen,
              x,
              y,
            }
          : pen
      )
    )
  }

  /*
    ========================================
    MARKER MOVE
    ========================================
  */
  const handleMarkerDragEnd = (
    id: string,
    x: number,
    y: number
  ) => {
    setMarkers((prev) =>
      prev.map((marker) =>
        marker.id === id
          ? {
              ...marker,
              x,
              y,
            }
          : marker
      )
    )
  }

  /*
    ========================================
    CLEAR BOARD
    ========================================
  */
  const clearBoard = () => {
    setPenObjects([])

    setMarkers([])

    setAlphabetCount(0)

    setNumberCount(1)
  }

  return (
    <div className="app">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="header">

        <div>

          <h1>
            R6S TACTICS BOARD
          </h1>

          <span>
            Strategy Editor
          </span>

        </div>

        <button
          className="clear-button"
          onClick={clearBoard}
        >
          Clear Board
        </button>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <div className="main">

        {/* ====================================
            SIDEBAR
        ==================================== */}

        <aside className="sidebar">

          {/* MAP */}

          <section>

            <h2>MAP</h2>

            <select
              defaultValue="Clubhouse"
            >

              <option>
                Clubhouse
              </option>

            </select>

          </section>

          {/* FLOOR */}

          <section>

            <h2>FLOOR</h2>

            <div className="floor-buttons">

              {[
                'B1',
                '1F',
                '2F',
              ].map((item) => (

                <button
                  key={item}

                  className={
                    floor === item
                      ? 'active'
                      : ''
                  }

                  onClick={() =>
                    setFloor(
                      item
                    )
                  }
                >

                  {item}

                </button>

              ))}

            </div>

          </section>

          {/* TOOLS */}

          <section>

            <h2>TOOLS</h2>

            <div className="tool-buttons">

              {/* SELECT */}

              <button
                className={
                  tool ===
                  'select'
                    ? 'active'
                    : ''
                }

                onClick={() =>
                  setTool(
                    'select'
                  )
                }
              >
                Select
              </button>

              {/* PEN */}

              <button
                className={
                  tool ===
                  'pen'
                    ? 'active'
                    : ''
                }

                onClick={() =>
                  setTool(
                    'pen'
                  )
                }
              >
                Pen
              </button>

              {/* ERASER */}

              <button
                className={
                  tool ===
                  'eraser'
                    ? 'active'
                    : ''
                }

                onClick={() =>
                  setTool(
                    'eraser'
                  )
                }
              >
                Eraser
              </button>

            </div>

          </section>

          {/* MARKERS */}

          <section>

            <h2>MARKERS</h2>

            <div className="tool-buttons">

              {/* ALPHABET */}

              <button
                className={
                  tool ===
                  'markerAlphabet'
                    ? 'active'
                    : ''
                }

                onClick={() =>
                  setTool(
                    'markerAlphabet'
                  )
                }
              >
                Alphabet
              </button>

              {/* NUMBER */}

              <button
                className={
                  tool ===
                  'markerNumber'
                    ? 'active'
                    : ''
                }

                onClick={() =>
                  setTool(
                    'markerNumber'
                  )
                }
              >
                Number 1-5
              </button>

            </div>

          </section>

          {/* NEXT ALPHABET */}

          <div className="current-status">

            <span>
              Next Alphabet
            </span>

            <strong>
              {numberToAlphabet(
                alphabetCount
              )}
            </strong>

          </div>

          {/* NEXT NUMBER */}

          <div className="current-status">

            <span>
              Next Number
            </span>

            <strong>
              {numberCount <= 5
                ? numberCount
                : 'Complete'}
            </strong>

          </div>

          {/* NUMBER COLORS */}

          <div className="current-status">

            <span>
              Number Colors
            </span>

            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                gap: '6px',
              }}
            >

              {[1, 2, 3, 4, 5].map(
                (number) => (

                  <div
                    key={number}

                    style={{
                      width: '28px',

                      height: '28px',

                      borderRadius:
                        '4px',

                      background:
                        NUMBER_COLORS[
                          number
                        ],

                      color:
                        number === 4
                          ? '#111'
                          : '#fff',

                      display:
                        'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',

                      fontWeight:
                        'bold',

                      border:
                        '2px solid white',
                    }}
                  >
                    {number}
                  </div>

                )
              )}

            </div>

          </div>

          {/* FLOOR STATUS */}

          <div className="current-status">

            <span>
              Current Floor
            </span>

            <strong>
              {floor}
            </strong>

          </div>

        </aside>

        {/* ====================================
            BOARD
        ==================================== */}

        <main className="board-area">

          <div className="board-title">

            Clubhouse / {floor}

          </div>

          <div className="canvas-wrapper">

            <Stage
              width={1100}
              height={720}

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

              {/* ================================
                  BACKGROUND
              ================================ */}

              <Layer>

                {/* 黒背景 */}

                <Rect
                  x={0}
                  y={0}

                  width={1100}
                  height={720}

                  fill="#151a20"

                  listening={
                    false
                  }
                />

                {/* R6S MAP */}

                <MapBackground
                  floor={floor}
                />

              </Layer>

              {/* ================================
                  PEN OBJECTS
              ================================ */}

              {penObjects.map(
                (pen) => (

                  <Layer
                    key={pen.id}
                  >

                    <Group
                      x={pen.x}
                      y={pen.y}

                      draggable={
                        tool ===
                        'select'
                      }

                      onDragEnd={(
                        e
                      ) =>
                        handlePenDragEnd(
                          pen.id,
                          e.target.x(),
                          e.target.y()
                        )
                      }
                    >

                      {/* PEN */}

                      <Line
                        points={
                          pen.points
                        }

                        stroke="#ff4747"

                        strokeWidth={5}

                        lineCap="round"

                        lineJoin="round"

                        hitStrokeWidth={
                          20
                        }
                      />

                      {/* ERASER */}

                      {pen.eraserPaths.map(
                        (
                          path,
                          index
                        ) => (

                          <Line
                            key={
                              index
                            }

                            points={
                              path
                            }

                            stroke="#000000"

                            strokeWidth={
                              30
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

              {/* ================================
                  MARKERS
              ================================ */}

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

                      onDragEnd={(
                        e
                      ) =>
                        handleMarkerDragEnd(
                          marker.id,
                          e.target.x(),
                          e.target.y()
                        )
                      }
                    >

                      {/* =========================
                          ALPHABET MARKER
                      ========================= */}

                      {marker.kind ===
                        'alphabet' && (
                        <>

                          <Circle
                            radius={18}

                            fill={
                              marker.color
                            }

                            stroke="#ffffff"

                            strokeWidth={
                              2
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

                            fontSize={
                              16
                            }

                            fontStyle="bold"

                            listening={
                              false
                            }
                          />

                        </>
                      )}

                      {/* =========================
                          NUMBER MARKER
                      ========================= */}

                      {marker.kind ===
                        'number' && (
                        <>

                          <Rect
                            x={-18}
                            y={-18}

                            width={36}
                            height={36}

                            fill={
                              marker.color
                            }

                            stroke="#ffffff"

                            strokeWidth={
                              2
                            }

                            cornerRadius={
                              4
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

                            fill={
                              marker.label ===
                              '4'
                                ? '#111111'
                                : '#ffffff'
                            }

                            fontSize={
                              16
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

            </Stage>

          </div>

        </main>

      </div>

    </div>
  )
}

export default App