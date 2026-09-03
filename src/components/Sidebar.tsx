import type {
  GadgetDefinition,
  MapDefinition,
  Tool,
} from '../types/board'

import { MAPS } from '../data/maps'
import type { MapId } from '../data/maps'

type SidebarProps = {
  tool: Tool

  setTool: React.Dispatch<
    React.SetStateAction<Tool>
  >

  penWidth: number

  setPenWidth: React.Dispatch<
    React.SetStateAction<number>
  >

  penColor: string

  setPenColor: React.Dispatch<
    React.SetStateAction<string>
  >

  mapId: MapId

  selectedMap: MapDefinition

  floor: string

  floorKeys: string[]

  alphabetCount: number

  numberCount: number

  gadgets: GadgetDefinition[]

  selectedGadgetId: string | null

  onGadgetSelect: (
    gadgetId: string
  ) => void

  onMapChange: (
    mapId: MapId
  ) => void

  onFloorChange: (
    floor: string
  ) => void
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#ef4444',
  2: '#3b82f6',
  3: '#22c55e',
  4: '#eab308',
  5: '#a855f7',
}

const PEN_COLORS = [
  {
    name: 'White',
    value: '#ffffff',
  },
  {
    name: 'Red',
    value: '#ef4444',
  },
  {
    name: 'Blue',
    value: '#3b82f6',
  },
  {
    name: 'Green',
    value: '#22c55e',
  },
  {
    name: 'Yellow',
    value: '#eab308',
  },
  {
    name: 'Purple',
    value: '#a855f7',
  },
]

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

function Sidebar({
  tool,
  setTool,

  penWidth,
  setPenWidth,

  penColor,
  setPenColor,

  mapId,
  selectedMap,

  floor,
  floorKeys,

  alphabetCount,
  numberCount,

  gadgets,
  selectedGadgetId,

  onGadgetSelect,

  onMapChange,
  onFloorChange,
}: SidebarProps) {
  const selectedToolClass = (
    targetTool: Tool
  ) =>
    tool === targetTool
      ? 'tool-button active'
      : 'tool-button'

  return (
    <aside className="sidebar">

      {/* MAP */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          MAP
        </div>

        <select
          className="sidebar-select"
          value={mapId}
          onChange={(e) =>
            onMapChange(
              e.target.value as MapId
            )
          }
        >
          {Object.entries(MAPS).map(
            ([id, map]) => (
              <option
                key={id}
                value={id}
              >
                {map.name}
              </option>
            )
          )}
        </select>
      </section>

      {/* FLOOR */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          FLOOR
        </div>

        <div className="floor-buttons">
          {floorKeys.map(
            (floorKey) => (
              <button
                key={floorKey}
                type="button"
                className={
                  floor === floorKey
                    ? 'floor-button active'
                    : 'floor-button'
                }
                onClick={() =>
                  onFloorChange(
                    floorKey
                  )
                }
              >
                {floorKey}
              </button>
            )
          )}
        </div>
      </section>

      {/* TOOLS */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          TOOLS
        </div>

        <div className="tool-grid">
          <button
            type="button"
            className={
              selectedToolClass(
                'select'
              )
            }
            onClick={() =>
              setTool(
                'select'
              )
            }
          >
            SELECT
          </button>

          <button
            type="button"
            className={
              selectedToolClass(
                'pen'
              )
            }
            onClick={() =>
              setTool(
                'pen'
              )
            }
          >
            PEN
          </button>

          <button
            type="button"
            className={
              selectedToolClass(
                'eraser'
              )
            }
            onClick={() =>
              setTool(
                'eraser'
              )
            }
          >
            ERASER
          </button>
        </div>
      </section>

      {/* PEN SETTINGS */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          PEN SETTINGS
        </div>

        {/* PEN WIDTH */}

        <div className="pen-setting-block">
          <div className="pen-setting-label">
            WIDTH
          </div>

          <div className="pen-width-control">
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={penWidth}
              onChange={(e) =>
                setPenWidth(
                  Number(
                    e.target.value
                  )
                )
              }
            />

            <div className="pen-width-value">
              {penWidth}px
            </div>
          </div>
        </div>

        {/* PEN COLOR */}

        <div className="pen-setting-block">
          <div className="pen-setting-label">
            COLOR
          </div>

          <div className="pen-color-grid">
            {PEN_COLORS.map(
              (color) => {
                const isActive =
                  penColor ===
                  color.value

                return (
                  <button
                    key={
                      color.value
                    }
                    type="button"
                    title={
                      color.name
                    }
                    className={
                      isActive
                        ? 'pen-color-button active'
                        : 'pen-color-button'
                    }
                    style={{
                      backgroundColor:
                        color.value,
                    }}
                    onClick={() => {
                      setPenColor(
                        color.value
                      )

                      setTool(
                        'pen'
                      )
                    }}
                  />
                )
              }
            )}
          </div>
        </div>
      </section>

      {/* MARKERS */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          MARKERS
        </div>

        <div className="marker-buttons">
          <button
            type="button"
            className={
              tool ===
              'markerAlphabet'
                ? 'marker-button alphabet active'
                : 'marker-button alphabet'
            }
            onClick={() =>
              setTool(
                'markerAlphabet'
              )
            }
          >
            <span className="marker-preview alphabet">
              {numberToAlphabet(
                alphabetCount
              )}
            </span>

            <span>
              ALPHABET
            </span>
          </button>

          <button
            type="button"
            className={
              tool ===
              'markerNumber'
                ? 'marker-button number active'
                : 'marker-button number'
            }
            onClick={() =>
              setTool(
                'markerNumber'
              )
            }
          >
            <span
              className="marker-preview number"
              style={{
                background:
                  NUMBER_COLORS[
                    numberCount
                  ],
              }}
            >
              {numberCount}
            </span>

            <span>
              NUMBER
            </span>
          </button>
        </div>
      </section>

      {/* COMMON GADGETS */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          COMMON GADGETS
        </div>

        <div className="gadget-grid">
          {gadgets.map(
            (gadget) => {
              const isActive =
                tool ===
                  'gadget' &&
                selectedGadgetId ===
                  gadget.id

              return (
                <button
                  key={
                    gadget.id
                  }
                  type="button"
                  title={
                    gadget.name
                  }
                  className={
                    isActive
                      ? 'gadget-button active'
                      : 'gadget-button'
                  }
                  onClick={() =>
                    onGadgetSelect(
                      gadget.id
                    )
                  }
                >
                  <img
                    src={
                      gadget.image
                    }
                    alt={
                      gadget.name
                    }
                  />
                </button>
              )
            }
          )}
        </div>
      </section>

      {/* STATUS */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          STATUS
        </div>

        <div className="status-box">
          <div className="status-row">
            <span>
              MAP
            </span>

            <strong>
              {selectedMap.name}
            </strong>
          </div>

          <div className="status-row">
            <span>
              FLOOR
            </span>

            <strong>
              {floor}
            </strong>
          </div>

          <div className="status-row">
            <span>
              TOOL
            </span>

            <strong>
              {tool}
            </strong>
          </div>

          <div className="status-row">
            <span>
              PEN WIDTH
            </span>

            <strong>
              {penWidth}px
            </strong>
          </div>
        </div>
      </section>

    </aside>
  )
}

export default Sidebar