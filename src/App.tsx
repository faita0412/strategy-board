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
     MULTIPLE DEFENSE OPERATORS
  ======================================== */

  const [
    selectedDefenseOperators,
    setSelectedDefenseOperators,
  ] = useState<
    OperatorDefinition[][]
  >([
    [],
    [],
    [],
    [],
    [],
  ])

  /* ========================================
     DEFENSE NOTES
  ======================================== */

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
     ACTIVE DEFENSE SLOT

     null = 自動登録

     0 = 1番
     1 = 2番
     2 = 3番
     3 = 4番
     4 = 5番
  ======================================== */

  const [
    activeDefenseSlot,
    setActiveDefenseSlot,
  ] = useState<number | null>(
    null
  )

  /* ========================================
     SELECTED OPERATOR FOR DELETE

     右サイドで削除対象として
     選択したオペレーター
  ======================================== */

  const [
    selectedDefenseOperatorForDelete,
    setSelectedDefenseOperatorForDelete,
  ] = useState<{
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
     DEFENSE SLOT SELECT
  ======================================== */

  const handleDefenseSlotSelect = (
    index: number
  ) => {
    setActiveDefenseSlot(
      (current) =>
        current === index
          ? null
          : index
    )
  }

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
          右サイド全体ですでに
          登録済みなら重複登録しない
        */

        const alreadyExists =
          current.some(
            (slotOperators) =>
              slotOperators.some(
                (item) =>
                  item.id ===
                  operator.id
              )
          )

        if (alreadyExists) {
          return current
        }

        /*
          登録先番号が指定されている場合
        */

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

        /*
          指定されていない場合は
          最初の空き番号へ登録
        */

        const emptyIndex =
          current.findIndex(
            (slotOperators) =>
              slotOperators.length ===
              0
          )

        /*
          1〜5が全部埋まっている場合は
          番号を指定するまで登録しない
        */

        if (
          emptyIndex === -1
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
     SELECT OPERATOR FOR DELETE
  ======================================== */

  const handleDefenseOperatorDeleteSelect = (
    slotIndex: number,
    operatorId: string
  ) => {
    setSelectedDefenseOperatorForDelete(
      (current) => {
        /*
          同じオペレーターを
          もう一度クリックしたら選択解除
        */

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

  const handleDefenseSlotClear = (
    index: number
  ) => {
    /*
      その番号内で削除対象が
      選択されていなければ何もしない
    */

    if (
      !selectedDefenseOperatorForDelete ||
      selectedDefenseOperatorForDelete
        .slotIndex !== index
    ) {
      return
    }

    const operatorId =
      selectedDefenseOperatorForDelete
        .operatorId

    /*
      選択された1人だけ削除
    */

    setSelectedDefenseOperators(
      (current) =>
        current.map(
          (
            slotOperators,
            slotIndex
          ) =>
            slotIndex === index
              ? slotOperators.filter(
                  (operator) =>
                    operator.id !==
                    operatorId
                )
              : slotOperators
        )
    )

    /*
      削除後は選択解除
    */

    setSelectedDefenseOperatorForDelete(
      null
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
      [],
      [],
      [],
      [],
      [],
    ])

    setDefenseNotes([
      '',
      '',
      '',
      '',
      '',
    ])

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
      マップ中央へ配置
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
      防衛側なら配置した瞬間に
      右サイドへ登録
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
          item.id === gadgetId
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
      [],
      [],
      [],
      [],
      [],
    ])

    setDefenseNotes([
      '',
      '',
      '',
      '',
      '',
    ])

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

    </div>
  )
}

export default App