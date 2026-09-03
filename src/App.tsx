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
  OperatorItem,
  GadgetItem,
  OperatorGadgetItem,
} from './types/board'

import './App.css'

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

  const selectedOperatorGadgets =
    selectedOperatorId
      ? OPERATOR_GADGETS.filter(
          (gadget) =>
            gadget.operatorId ===
            selectedOperatorId
        )
      : []

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

  const handleOperatorSelect = (
    operatorId: string
  ) => {
    setSelectedOperatorId(
      operatorId
    )

    setSelectedGadgetId(
      null
    )

    setSelectedOperatorGadgetId(
      null
    )

    setTool(
      'operator'
    )
  }

  const handleGadgetSelect = (
    gadgetId: string
  ) => {
    setSelectedGadgetId(
      gadgetId
    )

    setSelectedOperatorId(
      null
    )

    setSelectedOperatorGadgetId(
      null
    )

    setTool(
      'gadget'
    )
  }

  const handleOperatorGadgetSelect = (
    operatorGadgetId: string
  ) => {
    setSelectedOperatorGadgetId(
      operatorGadgetId
    )

    setSelectedGadgetId(
      null
    )

    setTool(
      'operatorGadget'
    )
  }

  const clearBoard = () => {
    setPenObjects([])
    setMarkers([])
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
              selectedOperatorGadgets
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