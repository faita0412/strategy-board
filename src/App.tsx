import {
  useRef,
  useState,
} from 'react'

import {
  toPng,
} from 'html-to-image'

import BoardCanvas from './components/BoardCanvas'
import Sidebar from './components/Sidebar'
import OperatorPanel from './components/OperatorPanel'
import RightSidebar from './components/RightSidebar'

import {
  MAPS,
} from './data/maps'

import type {
  MapId,
} from './data/maps'

import {
  OPERATORS,
} from './data/operators'

import {
  GADGETS,
} from './data/gadgets'

import {
  OPERATOR_GADGETS,
} from './data/operatorGadgets'

import type {
  Tool,
  PenObject,
  Marker,
  TextItem,
  OperatorDefinition,
  OperatorItem,
  GadgetItem,
  OperatorGadgetItem,
} from './types/board'

import './App.css'

const BOARD_CENTER_X = 775
const BOARD_CENTER_Y = 450

export const NUMBER_COLORS:
Record<number, string> = {
  1: '#ef4444',
  2: '#3b82f6',
  3: '#22c55e',
  4: '#eab308',
  5: '#a855f7',
}

export function numberToAlphabet(
  index: number
) {
  let result = ''
  let number = index + 1

  while (number > 0) {
    number--

    result =
      String.fromCharCode(
        65 + (number % 26)
      ) + result

    number =
      Math.floor(
        number / 26
      )
  }

  return result
}

function App() {
  /* ========================================
     EXPORT AREA
  ======================================== */

  const exportAreaRef =
    useRef<HTMLDivElement | null>(
      null
    )

  /* ========================================
     TOOL
  ======================================== */

  const [
    tool,
    setTool,
  ] =
    useState<Tool>(
      'select'
    )

  /* ========================================
     PEN
  ======================================== */

  const [
    penWidth,
    setPenWidth,
  ] =
    useState(4)

  const [
    penColor,
    setPenColor,
  ] =
    useState('#ffffff')

  /* ========================================
     TEXT
  ======================================== */

  const [
    textValue,
    setTextValue,
  ] =
    useState('')

  const [
    textFontSize,
    setTextFontSize,
  ] =
    useState(24)

  const [
    textColor,
    setTextColor,
  ] =
    useState('#ffffff')

  /* ========================================
     MAP
  ======================================== */

  const mapIds =
    Object.keys(
      MAPS
    ) as MapId[]

  const defaultMapId =
    mapIds.includes(
      'clubhouse' as MapId
    )
      ? ('clubhouse' as MapId)
      : mapIds[0]

  if (!defaultMapId) {
    return (
      <div className="app">
        MAP DATA NOT FOUND
      </div>
    )
  }

  const [
    mapId,
    setMapId,
  ] =
    useState<MapId>(
      defaultMapId
    )

  const selectedMap =
    MAPS[mapId]

  const [
    floor,
    setFloor,
  ] =
    useState(
      selectedMap.defaultFloor
    )

  /* ========================================
     PEN OBJECTS
  ======================================== */

  const [
    penObjects,
    setPenObjects,
  ] =
    useState<PenObject[]>(
      []
    )

  /* ========================================
     MARKERS
  ======================================== */

  const [
    markers,
    setMarkers,
  ] =
    useState<Marker[]>(
      []
    )

  const [
    alphabetCount,
    setAlphabetCount,
  ] =
    useState(0)

  const [
    numberCount,
    setNumberCount,
  ] =
    useState(1)

  /* ========================================
     TEXT ITEMS
  ======================================== */

  const [
    textItems,
    setTextItems,
  ] =
    useState<TextItem[]>(
      []
    )

  /* ========================================
     OPERATORS
  ======================================== */

  const [
    operatorItems,
    setOperatorItems,
  ] =
    useState<OperatorItem[]>(
      []
    )

  const [
    selectedOperatorId,
    setSelectedOperatorId,
  ] =
    useState<string | null>(
      null
    )

  /* ========================================
     COMMON GADGETS
  ======================================== */

  const [
    gadgetItems,
    setGadgetItems,
  ] =
    useState<GadgetItem[]>(
      []
    )

  const [
    selectedGadgetId,
    setSelectedGadgetId,
  ] =
    useState<string | null>(
      null
    )

  /* ========================================
     UNIQUE GADGETS
  ======================================== */

  const [
    operatorGadgetItems,
    setOperatorGadgetItems,
  ] =
    useState<
      OperatorGadgetItem[]
    >(
      []
    )

  const [
    selectedOperatorGadgetId,
    setSelectedOperatorGadgetId,
  ] =
    useState<string | null>(
      null
    )

  /* ========================================
     DEFENSE PLAN
  ======================================== */

  const [
    selectedDefenseOperators,
    setSelectedDefenseOperators,
  ] =
    useState<
      OperatorDefinition[][]
    >(
      [
        [],
        [],
        [],
        [],
        [],
      ]
    )

  const [
    defenseNotes,
    setDefenseNotes,
  ] =
    useState<string[]>(
      [
        '',
        '',
        '',
        '',
        '',
      ]
    )

  const [
    activeDefenseSlot,
    setActiveDefenseSlot,
  ] =
    useState<number | null>(
      null
    )

  const [
    selectedDefenseOperatorForDelete,
    setSelectedDefenseOperatorForDelete,
  ] =
    useState<{
      slotIndex: number
      operatorId: string
    } | null>(
      null
    )

  /* ========================================
     CURRENT MAP
  ======================================== */

  const floorKeys =
    Object.keys(
      selectedMap.floors
    )

  const currentFloor =
    selectedMap.floors[
      floor
    ]

  /* ========================================
     WAIT FOR EXPORT IMAGES
  ======================================== */

  const waitForExportImages =
    async (
      element: HTMLElement
    ) => {
      const images =
        Array.from(
          element.querySelectorAll(
            'img'
          )
        )

      if (
        images.length === 0
      ) {
        return
      }

      const failedImages:
        string[] = []

      await Promise.all(
        images.map(
          (
            image
          ) =>
            new Promise<void>(
              (
                resolve
              ) => {
                if (
                  image.complete
                ) {
                  if (
                    image.naturalWidth ===
                    0
                  ) {
                    failedImages.push(
                      image.src
                    )
                  }

                  resolve()
                  return
                }

                const handleLoad =
                  () => {
                    cleanup()
                    resolve()
                  }

                const handleError =
                  () => {
                    failedImages.push(
                      image.src
                    )

                    cleanup()
                    resolve()
                  }

                const cleanup =
                  () => {
                    image.removeEventListener(
                      'load',
                      handleLoad
                    )

                    image.removeEventListener(
                      'error',
                      handleError
                    )
                  }

                image.addEventListener(
                  'load',
                  handleLoad
                )

                image.addEventListener(
                  'error',
                  handleError
                )
              }
            )
        )
      )

      if (
        failedImages.length >
        0
      ) {
        console.error(
          'PNG export: failed images',
          failedImages
        )

        throw new Error(
          `Failed to load ${failedImages.length} image(s)`
        )
      }
    }

  /* ========================================
     EXPORT PNG
  ======================================== */

  const handleExportPng =
    async () => {
      const exportElement =
        exportAreaRef.current

      if (
        !exportElement
      ) {
        return
      }

      try {
        /*
          右サイドの画像が
          読み込み済みか確認
        */

        await waitForExportImages(
          exportElement
        )

        /*
          選択中表示をPNGへ
          残さないように解除
        */

        setSelectedDefenseOperatorForDelete(
          null
        )

        setActiveDefenseSlot(
          null
        )

        /*
          Reactの画面更新を待つ
        */

        await new Promise<void>(
          (
            resolve
          ) => {
            requestAnimationFrame(
              () => {
                requestAnimationFrame(
                  () => {
                    resolve()
                  }
                )
              }
            )
          }
        )

        const dataUrl =
          await toPng(
            exportElement,
            {
              pixelRatio: 2,

              backgroundColor:
                '#0b0e12',

              cacheBust: false,
            }
          )

        const link =
          document.createElement(
            'a'
          )

        const safeFloor =
          floor
            .replaceAll(
              '/',
              '-'
            )
            .replaceAll(
              '\\',
              '-'
            )

        link.download =
          `r6s-tactics-${mapId}-${safeFloor}.png`

        link.href =
          dataUrl

        document.body.appendChild(
          link
        )

        link.click()

        link.remove()
      } catch (
        error
      ) {
        console.error(
          'PNG export failed:',
          error
        )

        alert(
          'PNG保存に失敗しました。Consoleを確認してください。'
        )
      }
    }

  /* ========================================
     DEFENSE SLOT SELECT
  ======================================== */

  const handleDefenseSlotSelect =
    (
      index: number
    ) => {
      setActiveDefenseSlot(
        (
          current
        ) =>
          current ===
          index
            ? null
            : index
      )
    }

  /* ========================================
     DEFENSE OPERATOR REGISTER
  ======================================== */

  const handleDefenseOperatorSelect =
    (
      operatorId: string
    ) => {
      const operator =
        OPERATORS.find(
          (
            item
          ) =>
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

      setSelectedDefenseOperators(
        (
          current
        ) => {
          const alreadyExists =
            current.some(
              (
                slotOperators
              ) =>
                slotOperators.some(
                  (
                    item
                  ) =>
                    item.id ===
                    operator.id
                )
            )

          if (
            alreadyExists
          ) {
            return current
          }

          if (
            activeDefenseSlot !==
            null
          ) {
            return current.map(
              (
                slotOperators,
                index
              ) =>
                index ===
                activeDefenseSlot
                  ? [
                      ...slotOperators,
                      operator,
                    ]
                  : slotOperators
            )
          }

          const emptyIndex =
            current.findIndex(
              (
                slotOperators
              ) =>
                slotOperators.length ===
                0
            )

          if (
            emptyIndex ===
            -1
          ) {
            return current
          }

          return current.map(
            (
              slotOperators,
              index
            ) =>
              index ===
              emptyIndex
                ? [
                    ...slotOperators,
                    operator,
                  ]
                : slotOperators
          )
        }
      )
    }

  /* ========================================
     DEFENSE NOTE
  ======================================== */

  const handleDefenseNoteChange =
    (
      index: number,
      value: string
    ) => {
      setDefenseNotes(
        (
          current
        ) =>
          current.map(
            (
              note,
              noteIndex
            ) =>
              noteIndex ===
              index
                ? value
                : note
          )
      )
    }

  /* ========================================
     SELECT OPERATOR FOR DELETE
  ======================================== */

  const handleDefenseOperatorDeleteSelect =
    (
      slotIndex: number,
      operatorId: string
    ) => {
      setSelectedDefenseOperatorForDelete(
        (
          current
        ) => {
          if (
            current?.slotIndex ===
              slotIndex &&
            current.operatorId ===
              operatorId
          ) {
            return null
          }

          return {
            slotIndex,
            operatorId,
          }
        }
      )
    }

  /* ========================================
     DELETE SELECTED DEFENSE OPERATOR
  ======================================== */

  const handleDefenseSlotClear =
    (
      index: number
    ) => {
      if (
        !selectedDefenseOperatorForDelete ||
        selectedDefenseOperatorForDelete
          .slotIndex !==
          index
      ) {
        return
      }

      const operatorId =
        selectedDefenseOperatorForDelete
          .operatorId

      setSelectedDefenseOperators(
        (
          current
        ) =>
          current.map(
            (
              slotOperators,
              slotIndex
            ) =>
              slotIndex ===
              index
                ? slotOperators.filter(
                    (
                      operator
                    ) =>
                      operator.id !==
                      operatorId
                  )
                : slotOperators
          )
      )

      setSelectedDefenseOperatorForDelete(
        null
      )
    }

  /* ========================================
     MAP CHANGE
  ======================================== */

  const handleMapChange =
    (
      newMapId: MapId
    ) => {
      const newMap =
        MAPS[
          newMapId
        ]

      if (
        !newMap
      ) {
        return
      }

      setMapId(
        newMapId
      )

      setFloor(
        newMap.defaultFloor
      )

      setPenObjects([])
      setMarkers([])
      setTextItems([])
      setOperatorItems([])
      setGadgetItems([])
      setOperatorGadgetItems([])

      setAlphabetCount(0)
      setNumberCount(1)

      setSelectedOperatorId(
        null
      )

      setSelectedGadgetId(
        null
      )

      setSelectedOperatorGadgetId(
        null
      )

      setTextValue('')

      setSelectedDefenseOperators(
        [
          [],
          [],
          [],
          [],
          [],
        ]
      )

      setDefenseNotes(
        [
          '',
          '',
          '',
          '',
          '',
        ]
      )

      setActiveDefenseSlot(
        null
      )

      setSelectedDefenseOperatorForDelete(
        null
      )

      setTool(
        'select'
      )
    }

  /* ========================================
     FLOOR CHANGE
  ======================================== */

  const handleFloorChange =
    (
      newFloor: string
    ) => {
      setFloor(
        newFloor
      )
    }

  /* ========================================
     PLACE OPERATOR
  ======================================== */

  const handleOperatorSelect =
    (
      operatorId: string
    ) => {
      const operator =
        OPERATORS.find(
          (
            item
          ) =>
            item.id ===
            operatorId
        )

      if (
        !operator
      ) {
        return
      }

      setOperatorItems(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              BOARD_CENTER_X,

            y:
              BOARD_CENTER_Y,

            operatorId:
              operator.id,

            name:
              operator.name,

            image:
              operator.image,
          },
        ]
      )

      if (
        operator.side ===
        'defense'
      ) {
        handleDefenseOperatorSelect(
          operator.id
        )
      }

      setSelectedOperatorId(
        null
      )

      setSelectedGadgetId(
        null
      )

      setSelectedOperatorGadgetId(
        null
      )

      setTool(
        'select'
      )
    }

  /* ========================================
     PLACE GADGET
  ======================================== */

  const handleGadgetSelect =
    (
      gadgetId: string
    ) => {
      const gadget =
        GADGETS.find(
          (
            item
          ) =>
            item.id ===
            gadgetId
        )

      if (
        !gadget
      ) {
        return
      }

      setGadgetItems(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              BOARD_CENTER_X,

            y:
              BOARD_CENTER_Y,

            gadgetId:
              gadget.id,

            name:
              gadget.name,

            image:
              gadget.image,
          },
        ]
      )

      setSelectedOperatorId(
        null
      )

      setSelectedGadgetId(
        null
      )

      setSelectedOperatorGadgetId(
        null
      )

      setTool(
        'select'
      )
    }

  /* ========================================
     PLACE UNIQUE GADGET
  ======================================== */

  const handleOperatorGadgetSelect =
    (
      operatorGadgetId: string
    ) => {
      const gadget =
        OPERATOR_GADGETS.find(
          (
            item
          ) =>
            item.id ===
            operatorGadgetId
        )

      if (
        !gadget
      ) {
        return
      }

      setOperatorGadgetItems(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              BOARD_CENTER_X,

            y:
              BOARD_CENTER_Y,

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

      setSelectedOperatorId(
        null
      )

      setSelectedGadgetId(
        null
      )

      setSelectedOperatorGadgetId(
        null
      )

      setTool(
        'select'
      )
    }

  /* ========================================
     ALPHABET MARKER
  ======================================== */

  const handleAlphabetMarkerAdd =
    () => {
      const label =
        numberToAlphabet(
          alphabetCount
        )

      setMarkers(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              BOARD_CENTER_X,

            y:
              BOARD_CENTER_Y,

            label,

            color:
              '#f59e0b',

            kind:
              'alphabet',
          },
        ]
      )

      setAlphabetCount(
        alphabetCount +
        1
      )

      setTool(
        'select'
      )
    }

  /* ========================================
     NUMBER MARKER
  ======================================== */

  const handleNumberMarkerAdd =
    () => {
      setMarkers(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            x:
              BOARD_CENTER_X,

            y:
              BOARD_CENTER_Y,

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
        numberCount ===
        5
          ? 1
          : numberCount +
            1
      )

      setTool(
        'select'
      )
    }

  /* ========================================
     CLEAR BOARD
  ======================================== */

  const clearBoard =
    () => {
      setPenObjects([])
      setMarkers([])
      setTextItems([])
      setOperatorItems([])
      setGadgetItems([])
      setOperatorGadgetItems([])

      setAlphabetCount(0)
      setNumberCount(1)

      setSelectedOperatorId(
        null
      )

      setSelectedGadgetId(
        null
      )

      setSelectedOperatorGadgetId(
        null
      )

      setTextValue('')

      setSelectedDefenseOperators(
        [
          [],
          [],
          [],
          [],
          [],
        ]
      )

      setDefenseNotes(
        [
          '',
          '',
          '',
          '',
          '',
        ]
      )

      setActiveDefenseSlot(
        null
      )

      setSelectedDefenseOperatorForDelete(
        null
      )

      setTool(
        'select'
      )
    }

  return (
    <div className="app">

      {/* =================================
          HEADER
      ================================= */}

      <header className="header">

        <div>

          <h1>
            R6S TACTICS BOARD
          </h1>

          <span>
            Strategy Editor
          </span>

        </div>

        <div className="header-actions">

          <button
            className="export-button"
            onClick={
              handleExportPng
            }
          >
            Export PNG
          </button>

          <button
            className="clear-button"
            onClick={
              clearBoard
            }
          >
            Clear Board
          </button>

        </div>

      </header>

      {/* =================================
          MAIN
      ================================= */}

      <div className="main">

        {/* =================================
            LEFT SIDEBAR
        ================================= */}

        <Sidebar
          tool={
            tool
          }

          setTool={
            setTool
          }

          penWidth={
            penWidth
          }

          setPenWidth={
            setPenWidth
          }

          penColor={
            penColor
          }

          setPenColor={
            setPenColor
          }

          textValue={
            textValue
          }

          setTextValue={
            setTextValue
          }

          textFontSize={
            textFontSize
          }

          setTextFontSize={
            setTextFontSize
          }

          textColor={
            textColor
          }

          setTextColor={
            setTextColor
          }

          mapId={
            mapId
          }

          selectedMap={
            selectedMap
          }

          floor={
            floor
          }

          floorKeys={
            floorKeys
          }

          alphabetCount={
            alphabetCount
          }

          numberCount={
            numberCount
          }

          gadgets={
            GADGETS
          }

          selectedGadgetId={
            selectedGadgetId
          }

          onGadgetSelect={
            handleGadgetSelect
          }

          onAlphabetMarkerAdd={
            handleAlphabetMarkerAdd
          }

          onNumberMarkerAdd={
            handleNumberMarkerAdd
          }

          onMapChange={
            handleMapChange
          }

          onFloorChange={
            handleFloorChange
          }
        />

        {/* =================================
            WORK AREA
        ================================= */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >

          {/* =================================
              PNG EXPORT AREA

              マップ + 右サイドのみ
          ================================= */}

          <div
            ref={
              exportAreaRef
            }
            className="export-area"
          >

            {/* =============================
                BOARD AREA
            ============================= */}

            <main className="board-area">

              <div className="board-title">

                {selectedMap.name}

                {' / '}

                {floor}

              </div>

              <BoardCanvas
                tool={
                  tool
                }

                penWidth={
                  penWidth
                }

                penColor={
                  penColor
                }

                textValue={
                  textValue
                }

                textFontSize={
                  textFontSize
                }

                textColor={
                  textColor
                }

                imagePath={
                  currentFloor
                    ?.image ??
                  ''
                }

                penObjects={
                  penObjects
                }

                setPenObjects={
                  setPenObjects
                }

                markers={
                  markers
                }

                setMarkers={
                  setMarkers
                }

                textItems={
                  textItems
                }

                setTextItems={
                  setTextItems
                }

                alphabetCount={
                  alphabetCount
                }

                setAlphabetCount={
                  setAlphabetCount
                }

                numberCount={
                  numberCount
                }

                setNumberCount={
                  setNumberCount
                }

                operatorItems={
                  operatorItems
                }

                setOperatorItems={
                  setOperatorItems
                }

                selectedOperatorId={
                  selectedOperatorId
                }

                operators={
                  OPERATORS
                }

                gadgetItems={
                  gadgetItems
                }

                setGadgetItems={
                  setGadgetItems
                }

                selectedGadgetId={
                  selectedGadgetId
                }

                gadgets={
                  GADGETS
                }

                operatorGadgetItems={
                  operatorGadgetItems
                }

                setOperatorGadgetItems={
                  setOperatorGadgetItems
                }

                selectedOperatorGadgetId={
                  selectedOperatorGadgetId
                }

                operatorGadgets={
                  OPERATOR_GADGETS
                }

                onDefenseOperatorSelect={
                  handleDefenseOperatorSelect
                }
              />

            </main>

            {/* =============================
                RIGHT SIDEBAR
            ============================= */}

            <RightSidebar
              selectedDefenseOperators={
                selectedDefenseOperators
              }

              defenseNotes={
                defenseNotes
              }

              activeDefenseSlot={
                activeDefenseSlot
              }

              selectedDefenseOperatorForDelete={
                selectedDefenseOperatorForDelete
              }

              onDefenseSlotSelect={
                handleDefenseSlotSelect
              }

              onDefenseOperatorDeleteSelect={
                handleDefenseOperatorDeleteSelect
              }

              onDefenseNoteChange={
                handleDefenseNoteChange
              }

              onDefenseSlotClear={
                handleDefenseSlotClear
              }
            />

          </div>

          {/* =================================
              OPERATOR PANEL

              PNGには含めない
          ================================= */}

          <div
            style={{
              paddingLeft: '18px',
              paddingBottom: '18px',
            }}
          >

            <OperatorPanel
              operators={
                OPERATORS
              }

              selectedOperatorId={
                selectedOperatorId
              }

              tool={
                tool
              }

              onSelect={
                handleOperatorSelect
              }

              operatorGadgets={
                OPERATOR_GADGETS
              }

              selectedOperatorGadgetId={
                selectedOperatorGadgetId
              }

              onOperatorGadgetSelect={
                handleOperatorGadgetSelect
              }
            />

          </div>

        </div>

      </div>

    </div>
  )
}

export default App