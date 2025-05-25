// @ts-nocheck
import React, { useState } from "react";
import { mWeight } from "../utils/paperMath";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { Layers } from "lucide-react";

export default function SheetsCalc() {
  const [state, setState] = useState({
    width: "",
    length: "",
    basisWeight: "",
    targetLbs: "",
    targetSheets: "",
    calculationType: "sheets-from-lbs",
  });

  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const update = (changes) => {
    setState((prev) => ({ ...prev, ...changes }));
    setErrors({});
    if (
      Object.keys(changes).some((key) =>
        ["width", "length", "basisWeight"].includes(key)
      )
    ) {
      setIsCalculating(true);
      setTimeout(() => setIsCalculating(false), 200);
    }
  };

  const lbsSheet =
    mWeight(+state.width || 0, +state.length || 0, +state.basisWeight || 0) /
    1000;
  const sheetsNeeded = () => (+state.targetLbs || 0) / lbsSheet;
  const lbsNeeded = () => (+state.targetSheets || 0) * lbsSheet;

  const hasSpecs = state.width && state.length && state.basisWeight;
  const hasTarget =
    state.calculationType === "sheets-from-lbs"
      ? state.targetLbs
      : state.targetSheets;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Sheets Calculator</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Enhanced inputs */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-blue-600">
            Paper Specifications
          </h3>

          <NumberInput
            label="Width"
            value={state.width}
            onChange={(e) => update({ width: e.target.value })}
            placeholder="Enter width"
            suffix="inches"
            required
            error={errors.width}
            autoFocus
          />

          <NumberInput
            label="Length"
            value={state.length}
            onChange={(e) => update({ length: e.target.value })}
            placeholder="Enter length"
            suffix="inches"
            required
            error={errors.length}
          />

          <NumberInput
            label="Basis Weight"
            value={state.basisWeight}
            onChange={(e) => update({ basisWeight: e.target.value })}
            placeholder="Enter basis weight"
            suffix="GSM"
            required
            error={errors.basisWeight}
          />

          {/* Enhanced calculation type toggle */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">
              Choose Calculation
            </h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() =>
                  update({
                    calculationType: "sheets-from-lbs",
                    targetSheets: "",
                  })
                }
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                  state.calculationType === "sheets-from-lbs"
                    ? "bg-blue-500 text-white shadow-sm transform scale-[0.98]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sheets from Lbs
              </button>
              <button
                onClick={() =>
                  update({ calculationType: "lbs-from-sheets", targetLbs: "" })
                }
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                  state.calculationType === "lbs-from-sheets"
                    ? "bg-green-500 text-white shadow-sm transform scale-[0.98]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Lbs from Sheets
              </button>
            </div>
          </div>

          {/* Target input */}
          {state.calculationType === "sheets-from-lbs" && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-blue-800">
                How many sheets to get target weight?
              </h4>
              <NumberInput
                value={state.targetLbs}
                onChange={(e) => update({ targetLbs: e.target.value })}
                placeholder="Enter target weight"
                suffix="lbs"
              />
            </div>
          )}

          {state.calculationType === "lbs-from-sheets" && (
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-green-800">
                How much weight for target sheets?
              </h4>
              <NumberInput
                value={state.targetSheets}
                onChange={(e) => update({ targetSheets: e.target.value })}
                placeholder="Enter number of sheets"
                suffix="sheets"
                step="1"
              />
            </div>
          )}
        </div>

        {/* Enhanced results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-purple-600">Results</h3>

          {!hasSpecs ? (
            <EmptyState
              icon={Layers}
              title="Enter Paper Specifications"
              description="Fill in width, length, and basis weight to start calculating"
            />
          ) : !hasTarget ? (
            <EmptyState
              icon={Layers}
              title="Enter Target Value"
              description={`Enter your target ${
                state.calculationType === "sheets-from-lbs"
                  ? "weight"
                  : "sheet count"
              } to see the calculation`}
            />
          ) : (
            <>
              {state.calculationType === "sheets-from-lbs" &&
                state.targetLbs && (
                  <ResultCard
                    title="Sheets Needed for Target Weight"
                    value={sheetsNeeded().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    color="blue"
                    suffix=" sheets"
                    loading={isCalculating}
                    copyValue={sheetsNeeded().toFixed(2)}
                  />
                )}

              {state.calculationType === "lbs-from-sheets" &&
                state.targetSheets && (
                  <ResultCard
                    title="Weight Needed for Target Sheets"
                    value={lbsNeeded().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    color="green"
                    suffix=" lbs"
                    loading={isCalculating}
                    copyValue={lbsNeeded().toFixed(2)}
                  />
                )}

              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Paper Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">M-Weight:</span>
                    <span className="font-medium">
                      {mWeight(
                        +state.width || 0,
                        +state.length || 0,
                        +state.basisWeight || 0
                      ).toFixed(2)}{" "}
                      lbs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lbs per Sheet:</span>
                    <span className="font-medium">
                      {lbsSheet.toFixed(4)} lbs
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
