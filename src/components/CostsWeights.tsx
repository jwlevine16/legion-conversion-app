// @ts-nocheck
import React, { useState } from "react";
import { mWeight, sqFt, lbsPerSheet, sheetsPerLb } from "../utils/paperMath";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { Calculator } from "lucide-react";

export default function CostsWeights() {
  const [state, setState] = useState({
    width: "",
    length: "",
    basisWeight: "",
    costType: "lb",
    costPerLb: "",
    costPerSht: "",
  });

  const [errors, setErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const update = (changes) => {
    setState((prev) => ({ ...prev, ...changes }));
    // Clear errors when user types
    if (errors) {
      setErrors({});
    }
    // Simulate calculation delay for complex operations
    if (
      Object.keys(changes).some((key) =>
        ["width", "length", "basisWeight"].includes(key)
      )
    ) {
      setIsCalculating(true);
      setTimeout(() => setIsCalculating(false), 300);
    }
  };

  const fmtMoney = (n, d = 2) =>
    n && !isNaN(n)
      ? `$${parseFloat(n).toLocaleString("en-US", {
          minimumFractionDigits: d,
          maximumFractionDigits: d,
        })}`
      : "";

  const mW = mWeight(
    +state.width || 0,
    +state.length || 0,
    +state.basisWeight || 0
  );
  const sqft = sqFt(+state.width || 0, +state.length || 0);
  const lbsSheet = lbsPerSheet(
    +state.width || 0,
    +state.length || 0,
    +state.basisWeight || 0
  );
  const sheetLb = sheetsPerLb(
    +state.width || 0,
    +state.length || 0,
    +state.basisWeight || 0
  );

  const costSheet = () =>
    state.costType === "sht"
      ? +state.costPerSht || 0
      : (+state.costPerLb || 0) * lbsSheet;
  const costLb = () =>
    state.costType === "lb"
      ? +state.costPerLb || 0
      : (+state.costPerSht || 0) * sheetLb;
  const costFt2 = () => (sqft ? costSheet() / sqft : 0);
  const costCwt = () => costLb() * 100;
  const costYard = () =>
    state.width ? costFt2() * (+state.width / 12) * 3 : 0;
  const costMSI = () => costFt2() * 6.944;

  const hasInputs = state.width && state.length && state.basisWeight;
  const hasCostInputs = state.costPerLb || state.costPerSht;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Calculate Costs and Weights</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Enhanced Inputs */}
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

          {/* Enhanced cost toggle */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Cost Input (Optional)
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => update({ costType: "lb", costPerSht: "" })}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  state.costType === "lb"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Cost per Lb
              </button>
              <button
                onClick={() => update({ costType: "sht", costPerLb: "" })}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  state.costType === "sht"
                    ? "bg-green-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Cost per Sheet
              </button>
            </div>

            {state.costType === "lb" && (
              <NumberInput
                value={state.costPerLb}
                onChange={(e) => update({ costPerLb: e.target.value })}
                placeholder="Enter cost per lb"
                prefix="$"
                step="0.001"
              />
            )}
            {state.costType === "sht" && (
              <NumberInput
                value={state.costPerSht}
                onChange={(e) => update({ costPerSht: e.target.value })}
                placeholder="Enter cost per sheet"
                prefix="$"
                step="0.001"
              />
            )}
          </div>
        </div>

        {/* Enhanced Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-600">Results</h3>

          {!hasInputs ? (
            <EmptyState
              icon={Calculator}
              title="Enter Paper Specifications"
              description="Fill in the width, length, and basis weight to see calculations"
              actionText="Start Calculating"
              onAction={() => document.querySelector("input").focus()}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard
                  title="M-Weight"
                  value={mW.toFixed(2)}
                  color="blue"
                  suffix=" lbs"
                  loading={isCalculating}
                  copyValue={mW.toFixed(2)}
                />

                {hasCostInputs && (
                  <ResultCard
                    title={
                      state.costType === "lb" ? "Cost per Sheet" : "Cost per Lb"
                    }
                    value={
                      state.costType === "lb"
                        ? fmtMoney(costSheet(), 3)
                        : fmtMoney(costLb(), 3)
                    }
                    color="green"
                    loading={isCalculating}
                    copyValue={
                      state.costType === "lb"
                        ? costSheet().toFixed(3)
                        : costLb().toFixed(3)
                    }
                  />
                )}
              </div>

              {/* Detailed breakdown */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Paper Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Roll Weight", mW.toFixed(2) + " lbs"],
                    ["Square Feet", sqft.toFixed(2) + " ft²"],
                    ["Lbs/Sheet", lbsSheet.toFixed(4) + " lbs"],
                    ["Sheets/Lb", sheetLb.toFixed(4)],
                  ].map(([label, val]) => (
                    <div className="flex justify-between" key={label}>
                      <span className="text-blue-700">{label}:</span>
                      <span className="font-bold text-blue-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hasCostInputs && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h4 className="font-semibold text-green-800 mb-3">
                    Cost Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["Cost/Sheet", fmtMoney(costSheet(), 3)],
                      ["Cost/Lb", fmtMoney(costLb(), 3)],
                      ["Cost/Cwt", fmtMoney(costCwt(), 2)],
                      ["Cost/Ft²", fmtMoney(costFt2(), 2)],
                      ["Cost/Linear Yard", fmtMoney(costYard(), 2)],
                      ["Cost/MSI", fmtMoney(costMSI(), 2)],
                    ].map(([label, val]) => (
                      <div className="flex justify-between" key={label}>
                        <span className="text-green-700">{label}:</span>
                        <span className="font-bold text-green-900">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
