import type {
  OperatorDefinition,
} from '../types/board'

type SelectedDefenseOperatorForDelete = {
  slotIndex: number
  operatorId: string
} | null

type RightSidebarProps = {
  selectedDefenseOperators:
    OperatorDefinition[][]

  defenseNotes: string[]

  activeDefenseSlot:
    number | null

  selectedDefenseOperatorForDelete:
    SelectedDefenseOperatorForDelete

  onDefenseSlotSelect: (
    index: number
  ) => void

  onDefenseOperatorDeleteSelect: (
    slotIndex: number,
    operatorId: string
  ) => void

  onDefenseNoteChange: (
    index: number,
    value: string
  ) => void

  onDefenseSlotClear: (
    index: number
  ) => void
}

function RightSidebar({
  selectedDefenseOperators,
  defenseNotes,
  activeDefenseSlot,
  selectedDefenseOperatorForDelete,
  onDefenseSlotSelect,
  onDefenseOperatorDeleteSelect,
  onDefenseNoteChange,
  onDefenseSlotClear,
}: RightSidebarProps) {
  return (
    <aside className="right-sidebar">

      <div className="right-sidebar-title">
        DEFENSE PLAN
      </div>

      <div className="defense-plan-list">

        {Array.from({
          length: 5,
        }).map((_, index) => {
          const operators =
            selectedDefenseOperators[
              index
            ] ?? []

          const note =
            defenseNotes[
              index
            ] ?? ''

          const isActive =
            activeDefenseSlot ===
            index

          const hasSelectedOperator =
            selectedDefenseOperatorForDelete
              ?.slotIndex ===
            index

          return (
            <div
              key={index}
              className={
                isActive
                  ? 'defense-plan-slot active'
                  : 'defense-plan-slot'
              }
            >

              {/* =================================
                  SLOT HEADER
              ================================= */}

              <div className="defense-plan-slot-header">

                {/* =================================
                    NUMBER / ADD DESTINATION
                ================================= */}

                <button
                  type="button"
                  className="defense-plan-number"
                  onClick={() =>
                    onDefenseSlotSelect(
                      index
                    )
                  }
                  title={
                    isActive
                      ? 'Cancel operator destination'
                      : `Add next operator to ${index + 1}`
                  }
                >
                  {index + 1}
                </button>

                {/* =================================
                    OPERATOR AREA
                ================================= */}

                <div className="defense-plan-operator">

                  {operators.length >
                  0 ? (
                    <div className="defense-plan-operator-icons">

                      {operators.map(
                        (
                          operator
                        ) => {
                          const isSelectedForDelete =
                            selectedDefenseOperatorForDelete
                              ?.slotIndex ===
                              index &&
                            selectedDefenseOperatorForDelete
                              .operatorId ===
                              operator.id

                          return (
                            <button
                              key={
                                operator.id
                              }
                              type="button"
                              className={
                                isSelectedForDelete
                                  ? 'defense-plan-operator-button selected-for-delete'
                                  : 'defense-plan-operator-button'
                              }
                              onClick={() =>
                                onDefenseOperatorDeleteSelect(
                                  index,
                                  operator.id
                                )
                              }
                              title={
                                isSelectedForDelete
                                  ? `${operator.name} - selected for delete`
                                  : `${operator.name} - click to select`
                              }
                            >
                              <img
                                className="defense-plan-operator-image"
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
                  ) : (
                    <span className="defense-plan-empty">
                      NOT SELECTED
                    </span>
                  )}

                </div>

                {/* =================================
                    DELETE SELECTED OPERATOR
                ================================= */}

                <button
                  type="button"
                  className="defense-plan-clear-button"
                  onClick={() =>
                    onDefenseSlotClear(
                      index
                    )
                  }
                  disabled={
                    !hasSelectedOperator
                  }
                  title={
                    hasSelectedOperator
                      ? 'Delete selected operator'
                      : 'Select an operator first'
                  }
                >
                  ×
                </button>

              </div>

              {/* =================================
                  ONE LINE MEMO
              ================================= */}

              <input
                type="text"
                className="defense-plan-note"
                placeholder={
                  `Player Name`
                }
                value={
                  note
                }
                onChange={(e) =>
                  onDefenseNoteChange(
                    index,
                    e.target.value
                  )
                }
              />

            </div>
          )
        })}

      </div>

    </aside>
  )
}

export default RightSidebar