import { useEffect, useMemo, useState } from "react";

import {
  decodeCalculatorState,
  encodeCalculatorState,
  evaluateCalculator,
  normalizeCalculatorInputs,
} from "../../core/tool-definitions";
import type { CalculatorDefinition } from "../../data/schemas/tools";

interface Props {
  definition: CalculatorDefinition;
}

export default function CalculatorIsland({ definition }: Props) {
  const defaults = useMemo(
    () =>
      Object.fromEntries(
        definition.inputs.map((input) => [input.id, input.defaultValue]),
      ),
    [definition],
  );
  const [values, setValues] = useState<Record<string, number>>(defaults);
  const normalized = normalizeCalculatorInputs(definition, values);
  let result: number | null = null;
  let error = "";

  try {
    result = evaluateCalculator(definition, normalized);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Calculation failed.";
  }

  useEffect(() => {
    setValues(decodeCalculatorState(window.location.hash, definition));
  }, [definition]);

  function updateValue(inputId: string, value: number) {
    const next = normalizeCalculatorInputs(definition, {
      ...values,
      [inputId]: value,
    });
    setValues(next);

    const fragment = encodeCalculatorState(next);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${fragment}`,
    );
  }

  return (
    <div className="calculator" data-tool-id={definition.id}>
      <div className="calculator__inputs">
        {definition.inputs.map((input) => (
          <label key={input.id}>
            <span>{input.label}</span>
            <span className="calculator__control">
              <input
                type="number"
                min={input.min}
                max={input.max}
                step={input.step}
                value={normalized[input.id]}
                onChange={(event) =>
                  updateValue(input.id, event.currentTarget.valueAsNumber)
                }
              />
              {input.unit && <small>{input.unit}</small>}
            </span>
          </label>
        ))}
      </div>

      <output className="calculator__result" aria-live="polite">
        <span>{definition.resultLabel}</span>
        {error ? (
          <strong>{error}</strong>
        ) : (
          <strong>
            {result?.toFixed(definition.precision)} {definition.resultUnit}
          </strong>
        )}
      </output>
    </div>
  );
}
