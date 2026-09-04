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

  textValue: string

  setTextValue: React.Dispatch<
    React.SetStateAction<string>
  >

  textFontSize: number

  setTextFontSize: React.Dispatch<
    React.SetStateAction<number>
  >

  textColor: string

  setTextColor: React.Dispatch<
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

const TEXT_COLORS = [
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

  textValue,
  setTextValue,

  textFontSize,
  setTextFontSize,

  textColor,
  setTextColor,

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

          <button
            type="button"
            className={
              selectedToolClass(
                'text'
              )
            }
            onClick={() =>
              setTool(
                'text'
              )
            }
          >
            TEXT
          </button>
        </div>
      </section>

      {/* PEN SETTINGS */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          PEN SETTINGS
        </div>

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

      {/* TEXT */}

      <section className="sidebar-section">
        <div className="sidebar-section-title">
          TEXT
        </div>

        <div className="text-setting-block">

          {/* INPUT */}

          <input
            type="text"
            className="text-input"
            placeholder="Enter text..."
            value={textValue}
            onChange={(e) =>
              setTextValue(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                textValue.trim()
              ) {
                setTool(
                  'text'
                )
              }
            }}
          />

          {/* SIZE */}

          <div className="text-option-block">
            <div className="text-option-label">
              SIZE
            </div>

            <div className="text-size-control">
              <input
                type="range"
                min="12"
                max="60"
                step="1"
                value={textFontSize}
                onChange={(e) =>
                  setTextFontSize(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <div className="text-size-value">
                {textFontSize}px
              </div>
            </div>
          </div>

          {/* COLOR */}

          <div className="text-option-block">
            <div className="text-option-label">
              COLOR
            </div>

            <div className="text-color-grid">
              {TEXT_COLORS.map(
                (color) => {
                  const isActive =
                    textColor ===
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
                          ? 'text-color-button active'
                          : 'text-color-button'
                      }
                      style={{
                        backgroundColor:
                          color.value,
                      }}
                      onClick={() => {
                        setTextColor(
                          color.value
                        )
                      }}
                    />
                  )
                }
              )}
            </div>
          </div>

          {/* PLACE */}

          <button
            type="button"
            className={
              tool === 'text'
                ? 'text-place-button active'
                : 'text-place-button'
            }
            disabled={
              !textValue.trim()
            }
            onClick={() =>
              setTool(
                'text'
              )
            }
          >
            PLACE TEXT
          </button>
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

          <div className="status-row">
            <span>
              TEXT SIZE
            </span>

            <strong>
              {textFontSize}px
            </strong>
          </div>
        </div>
      </section>

    </aside>
  )
}

export default Sidebar