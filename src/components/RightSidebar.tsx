import type {
  OperatorDefinition,
} from '../types/board'

type RightSidebarProps = {
  selectedDefenseOperators: (
    OperatorDefinition | null
  )[]

  defenseNotes: string[]

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
          const operator =
            selectedDefenseOperators[
              index
            ] ?? null

          const note =
            defenseNotes[
              index
            ] ?? ''

          return (
            <div
              key={index}
              className="defense-plan-slot"
            >

              {/* SLOT HEADER */}

              <div className="defense-plan-slot-header">

                <div className="defense-plan-number">
                  {index + 1}
                </div>

                <div className="defense-plan-operator">

                  {operator ? (
                    <>
                      <img
                        className="defense-plan-operator-image"
                        src={
                          operator.image
                        }
                        alt={
                          operator.name
                        }
                      />

                      <span className="defense-plan-operator-name">
                        {operator.name}
                      </span>
                    </>
                  ) : (
                    <span className="defense-plan-empty">
                      NOT SELECTED
                    </span>
                  )}

                </div>

                <button
                  type="button"
                  className="defense-plan-clear-button"
                  onClick={() =>
                    onDefenseSlotClear(
                      index
                    )
                  }
                  disabled={
                    !operator &&
                    !note
                  }
                  title="Clear slot"
                >
                  ×
                </button>

              </div>

              {/* ONE LINE MEMO */}

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