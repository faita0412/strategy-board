import { useState } from 'react'

import type {
  OperatorDefinition,
  OperatorGadgetDefinition,
  Tool,
} from '../types/board'

type OperatorPanelProps = {
  operators: OperatorDefinition[]

  selectedOperatorId: string | null

  tool: Tool

  onSelect: (
    operatorId: string
  ) => void

  operatorGadgets: OperatorGadgetDefinition[]

  selectedOperatorGadgetId: string | null

  onOperatorGadgetSelect: (
    operatorGadgetId: string
  ) => void
}

type OperatorSide =
  | 'attack'
  | 'defense'

function OperatorPanel({
  operators,

  selectedOperatorId,

  tool,

  onSelect,

  operatorGadgets,

  selectedOperatorGadgetId,

  onOperatorGadgetSelect,
}: OperatorPanelProps) {
  const [
    selectedSide,
    setSelectedSide,
  ] = useState<OperatorSide>(
    'attack'
  )

  const filteredOperators =
    operators.filter(
      (operator) =>
        operator.side ===
        selectedSide
    )

  return (
    <div className="operator-panel">

      {/* HEADER */}

      <div className="operator-panel-header">

        <div className="operator-panel-title">
          OPERATORS
        </div>

        <div className="operator-side-tabs">

          <button
            type="button"

            className={
              selectedSide ===
              'attack'
                ? 'operator-side-tab active'
                : 'operator-side-tab'
            }

            onClick={() =>
              setSelectedSide(
                'attack'
              )
            }
          >
            ATTACK
          </button>

          <button
            type="button"

            className={
              selectedSide ===
              'defense'
                ? 'operator-side-tab active'
                : 'operator-side-tab'
            }

            onClick={() =>
              setSelectedSide(
                'defense'
              )
            }
          >
            DEFENSE
          </button>

        </div>

      </div>

      {/* CONTENT */}

      <div className="operator-panel-content">

        {/* OPERATOR LIST */}

        <div className="operator-list">

          {filteredOperators.map(
            (operator) => {
              const isActive =
                selectedOperatorId ===
                  operator.id &&
                tool ===
                  'operator'

              return (
                <button
                  key={
                    operator.id
                  }

                  type="button"

                  title={
                    operator.name
                  }

                  className={
                    isActive
                      ? 'operator-button active'
                      : 'operator-button'
                  }

                  onClick={() =>
                    onSelect(
                      operator.id
                    )
                  }
                >
                  <img
                    src={
                      operator.image
                    }

                    alt={
                      operator.name
                    }
                  />
                </button>
              )
            }
          )}

        </div>

        {/* UNIQUE GADGET */}

        {selectedOperatorId &&
          operatorGadgets.length > 0 && (

            <div className="operator-gadget-area">

              <div className="operator-gadget-title">
                UNIQUE GADGET
              </div>

              <div className="operator-gadget-list">

                {operatorGadgets.map(
                  (gadget) => {
                    const isActive =
                      selectedOperatorGadgetId ===
                        gadget.id &&
                      tool ===
                        'operatorGadget'

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
                            ? 'operator-gadget-button active'
                            : 'operator-gadget-button'
                        }

                        onClick={() =>
                          onOperatorGadgetSelect(
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

                          onError={(e) => {
                            e.currentTarget.style.display =
                              'none'
                          }}
                        />
                      </button>
                    )
                  }
                )}

              </div>

            </div>

          )}

      </div>

    </div>
  )
}

export default OperatorPanel