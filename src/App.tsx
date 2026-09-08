import { useState } from 'react'

import BoardCanvas from './components/BoardCanvas'
import Sidebar from './components/Sidebar'
import OperatorPanel from './components/OperatorPanel'

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
  OperatorItem,
  GadgetItem,
  OperatorGadgetItem,
} from './types/board'

import './App.css'

const BOARD_CENTER_X = 675
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
  const [tool, setTool] =
    useState<Tool>('select')

  const [penWidth, setPenWidth] =
    useState(4)

  const [penColor, setPenColor] =
    useState('#ffffff')

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

  const [
    penObjects,
    setPenObjects,
  ] = useState<PenObject[]>([])

  const [
    markers,
    setMarkers,
  ] = useState<Marker[]>([])

  const [
    textItems,
    setTextItems,
  ] = useState<TextItem[]>([])

  const [
    alphabetCount,
    setAlphabetCount,
  ] = useState(0)

  const [
    numberCount,
    setNumberCount,
  ] = useState(1)

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

  const floorKeys =
    Object.keys(
      selectedMap.floors
    )

  const currentFloor =
    selectedMap.floors[
      floor
    ]

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

    setTool(
      'select'
    )
  }

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
          item.id === operatorId
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

    setTool(
      'select'
    )
  }

  return (
    <div className="app">
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

      <div className="main">
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
          />

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
      </div>
    </div>
  )
}

export default App