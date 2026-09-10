import { useState } from 'react'

import BoardCanvas from './components/BoardCanvas'
import Sidebar from './components/Sidebar'
import OperatorPanel from './components/OperatorPanel'
import RightSidebar from './components/RightSidebar'

import { MAPS } from './data/maps'
import type { MapId } from './data/maps'

import { OPERATORS } from './data/operators'
import { GADGETS } from './data/gadgets'
import { OPERATOR_GADGETS } from './data/operatorGadgets'

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

export const NUMBER_COLORS: Record<number, string> = {
  1: '#ef4444',
  2: '#3b82f6',
  3: '#22c55e',
  4: '#eab308',
  5: '#a855f7',
}

export function numberToAlphabet(index: number) {
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

function App() {
  /* ========================================
     TOOL
  ======================================== */

  const [tool, setTool] =
    useState<Tool>('select')

  /* ========================================
     PEN
  ======================================== */

  const [penWidth, setPenWidth] =
    useState(4)

  const [penColor, setPenColor] =
    useState('#ffffff')

  /* ========================================
     TEXT
  ======================================== */

  const [textValue, setTextValue] =
    useState('')

  const [
    textFontSize,
    setTextFontSize,
  ] = useState(24)

  const [
    textColor,
    setTextColor,
  ] = useState('#ffffff')

  /* ========================================
     MAP
  ======================================== */

  const mapIds =
    Object.keys(MAPS) as MapId[]

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

  const [mapId, setMapId] =
    useState<MapId>(
      defaultMapId
    )

  const selectedMap =
    MAPS[mapId]

  const [floor, setFloor] =
    useState(
      selectedMap.defaultFloor
    )

  /* ========================================
     PEN OBJECTS
  ======================================== */

  const [
    penObjects,
    setPenObjects,
  ] = useState<PenObject[]>([])

  /* ========================================
     MARKERS
  ======================================== */

  const [
    markers,
    setMarkers,
  ] = useState<Marker[]>([])

  const [
    alphabetCount,
    setAlphabetCount,
  ] = useState(0)

  const [
    numberCount,
    setNumberCount,
  ] = useState(1)

  /* ========================================
     TEXT ITEMS
  ======================================== */

  const [
    textItems,
    setTextItems,
  ] = useState<TextItem[]>([])

  /* ========================================
     OPERATORS
  ======================================== */

  const [
    operatorItems,
    setOperatorItems,
  ] = useState<OperatorItem[]>([])

  const [
    selectedOperatorId,
    setSelectedOperatorId,
  ] = useState<string | null>(
    null
  )

  /* ========================================
     COMMON GADGETS
  ======================================== */

  const [
    gadgetItems,
    setGadgetItems,
  ] = useState<GadgetItem[]>([])

  const [
    selectedGadgetId,
    setSelectedGadgetId,
  ] = useState<string | null>(
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
    >([])

  const [
    selectedOperatorGadgetId,
    setSelectedOperatorGadgetId,
  ] =
    useState<string | null>(
      null
    )

  /* ========================================
     RIGHT SIDEBAR
  ======================================== */

  const [
    selectedDefenseOperators,
    setSelectedDefenseOperators,
  ] = useState<
    (OperatorDefinition | null)[]
  >([
    null,
    null,
    null,
    null,
    null,
  ])

  const [
    defenseNotes,
    setDefenseNotes,
  ] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ])

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
     DEFENSE OPERATOR REGISTER
  ======================================== */

  const handleDefenseOperatorSelect = (
    operatorId: string
  ) => {
    const operator =
      OPERATORS.find(
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

    setSelectedDefenseOperators(
      (current) => {
        /*
          同じオペレーターが
          登録済みなら追加しない
        */

        const alreadyExists =
          current.some(
            (item) =>
              item?.id ===
              operator.id
          )

        if (
          alreadyExists
        ) {
          return current
        }

        /*
          1～5の最初の空き枠
        */

        const emptyIndex =
          current.findIndex(
            (item) =>
              item === null
          )

        if (
          emptyIndex === -1
        ) {
          return current
        }

        const next = [
          ...current,
        ]

        next[
          emptyIndex
        ] = operator

        return next
      }
    )
  }

  /* ========================================
     DEFENSE NOTE
  ======================================== */

  const handleDefenseNoteChange = (
    index: number,
    value: string
  ) => {
    setDefenseNotes(
      (current) =>
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
     CLEAR DEFENSE SLOT
  ======================================== */

  const handleDefenseSlotClear = (
    index: number
  ) => {
    setSelectedDefenseOperators(
      (current) =>
        current.map(
          (
            operator,
            operatorIndex
          ) =>
            operatorIndex ===
            index
              ? null
              : operator
        )
    )

    setDefenseNotes(
      (current) =>
        current.map(
          (
            note,
            noteIndex
          ) =>
            noteIndex ===
            index
              ? ''
              : note
        )
    )
  }

  /* ========================================
     MAP CHANGE
  ======================================== */

  const handleMapChange = (
    newMapId: MapId
  ) => {
    const newMap =
      MAPS[newMapId]

    if (!newMap) {
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

    setSelectedDefenseOperators([
      null,
      null,
      null,
      null,
      null,
    ])

    setDefenseNotes([
      '',
      '',
      '',
      '',
      '',
    ])

    setTool(
      'select'
    )
  }

  /* ========================================
     FLOOR CHANGE
  ======================================== */

  const handleFloorChange = (
    newFloor: string
  ) => {
    setFloor(
      newFloor
    )
  }

  /* ========================================
     AUTO PLACE OPERATOR
  ======================================== */

  const handleOperatorSelect = (
    operatorId: string
  ) => {
    const operator =
      OPERATORS.find(
        (item) =>
          item.id ===
          operatorId
      )

    if (!operator) {
      return
    }

    /*
      マップ中央に配置
    */

    setOperatorItems(
      (current) => [
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

    /*
      防衛側なら配置した瞬間
      右サイドにも登録
    */

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
     AUTO PLACE COMMON GADGET
  ======================================== */

  const handleGadgetSelect = (
    gadgetId: string
  ) => {
    const gadget =
      GADGETS.find(
        (item) =>
          item.id ===
          gadgetId
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
     AUTO PLACE UNIQUE GADGET
  ======================================== */

  const handleOperatorGadgetSelect = (
    operatorGadgetId: string
  ) => {
    const gadget =
      OPERATOR_GADGETS.find(
        (item) =>
          item.id ===
          operatorGadgetId
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
     AUTO PLACE ALPHABET
  ======================================== */

  const handleAlphabetMarkerAdd = () => {
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
      alphabetCount + 1
    )

    setTool(
      'select'
    )
  }

  /* ========================================
     AUTO PLACE NUMBER
  ======================================== */

  const handleNumberMarkerAdd = () => {
    setMarkers(
      (current) => [
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
      numberCount === 5
        ? 1
        : numberCount + 1
    )

    setTool(
      'select'
    )
  }

  /* ========================================
     CLEAR BOARD
  ======================================== */

  const clearBoard = () => {
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

    setSelectedDefenseOperators([
      null,
      null,
      null,
      null,
      null,
    ])

    setDefenseNotes([
      '',
      '',
      '',
      '',
      '',
    ])

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

        <button
          className="clear-button"
          onClick={
            clearBoard
          }
        >
          Clear Board
        </button>

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
            BOARD AREA
        ================================= */}

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
                ?.image ?? ''
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

          {/* =================================
              OPERATOR PANEL
          ================================= */}

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

        </main>

        {/* =================================
            RIGHT SIDEBAR
        ================================= */}

        <RightSidebar
          selectedDefenseOperators={
            selectedDefenseOperators
          }

          defenseNotes={
            defenseNotes
          }

          onDefenseNoteChange={
            handleDefenseNoteChange
          }

          onDefenseSlotClear={
            handleDefenseSlotClear
          }
        />

      </div>

    </div>
  )
}

export default App