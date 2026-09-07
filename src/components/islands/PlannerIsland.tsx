import { useEffect, useState } from "react";

import {
  decodePlannerState,
  encodePlannerState,
  validatePlannerSelection,
} from "../../core/tool-definitions";
import type { PlannerDefinition } from "../../data/schemas/tools";

interface Props {
  definition: PlannerDefinition;
}

export default function PlannerIsland({ definition }: Props) {
  const [selection, setSelection] = useState<Record<string, string>>({});
  const errors = validatePlannerSelection(definition, selection);

  useEffect(() => {
    setSelection(decodePlannerState(window.location.hash, definition));
  }, [definition]);

  function updateSelection(slotId: string, optionId: string) {
    const next = { ...selection, [slotId]: optionId };
    if (!optionId) delete next[slotId];
    setSelection(next);

    const fragment = encodePlannerState(next);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${fragment}`,
    );
  }

  return (
    <div className="planner" data-tool-id={definition.id}>
      <div className="planner__slots">
        {definition.slots.map((slot, index) => (
          <label key={slot.id}>
            <span><b>{String(index + 1).padStart(2, "0")}</b>{slot.label}</span>
            <select
              value={selection[slot.id] ?? ""}
              required={slot.required}
              onChange={(event) => updateSelection(slot.id, event.currentTarget.value)}
            >
              <option value="">Choose an option</option>
              {slot.options.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="planner__status" aria-live="polite">
        <span className="eyebrow">Build status</span>
        {errors.length > 0 ? (
          <ul>{errors.map((message) => <li key={message}>{message}</li>)}</ul>
        ) : (
          <p>Required slots are complete. This selection is encoded in the URL fragment.</p>
        )}
      </div>
    </div>
  );
}
