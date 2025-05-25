// ===================================================================
// Enhanced WorkOrders.tsx
// src/components/WorkOrders.tsx
// ===================================================================

import React, { useState } from "react";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { ClipboardList } from "lucide-react";

export default function WorkOrders() {
  const [state, setState] = useState({
    parentLength: "",
    parentWidth: "",
    parentCost: "",
    cutLength: "",
    cutWidth: "",
    goal: "",
    cuttingCharge: "",
  });

  const [errors, setErrors] = useState({});

  const update = (changes) => {
    setState((prev) => ({ ...prev, ...changes }));
    setErrors({});
  };

  const yieldPerParent = () => {
    const {
      parentLength: pL,
      parentWidth: pW,
      cutLength: cL,
      cutWidth: cW,
    } = state;
    if (!(pL && pW && cL && cW)) return 0;
    const o1 = Math.floor(+pL / +cL) * Math.floor(+pW / +cW);
    const o2 = Math.floor(+pL / +cW) * Math.floor(+pW / +cL);
    return Math.max(o1, o2);
  };

  const parentsNeeded = () =>
    state.goal ? Math.ceil(+state.goal / yieldPerParent()) : 0;

  const costPerCut = () => {
    if (!state.goal) return 0;
    const totalParent = parentsNeeded() * (+state.parentCost || 0);
    const total = totalParent + (+state.cuttingCharge || 0);
    return total / +state.goal;
  };

  const hasParentSpecs = state.parentLength && state.parentWidth;
  const hasCutSpecs = state.cutLength && state.cutWidth;
  const hasAllSpecs = hasParentSpecs && hasCutSpecs;
  const hasGoal = state.goal;
  const hasCosts = state.parentCost;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Work Orders</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Enhanced Inputs */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">
              Parent Sheet Specifications
            </h3>

            <NumberInput
              label="Parent Length"
              value={state.parentLength}
              onChange={(e) => update({ parentLength: e.target.value })}
              placeholder="Enter parent length"
              required
              autoFocus
            />

            <NumberInput
              label="Parent Width"
              value={state.parentWidth}
              onChange={(e) => update({ parentWidth: e.target.value })}
              placeholder="Enter parent width"
              required
            />

            <NumberInput
              label="Parent Sheet Cost"
              value={state.parentCost}
              onChange={(e) => update({ parentCost: e.target.value })}
              placeholder="Enter cost per parent sheet"
              prefix="$"
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-green-600">
              Cut-To Specifications
            </h3>

            <NumberInput
              label="Cut Length"
              value={state.cutLength}
              onChange={(e) => update({ cutLength: e.target.value })}
              placeholder="Enter cut length"
              required
            />

            <NumberInput
              label="Cut Width"
              value={state.cutWidth}
              onChange={(e) => update({ cutWidth: e.target.value })}
              placeholder="Enter cut width"
              required
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">
              Production Goals (Optional)
            </h3>

            <NumberInput
              label="Target Quantity"
              value={state.goal}
              onChange={(e) => update({ goal: e.target.value })}
              placeholder="Enter target quantity"
              suffix="pieces"
              step="1"
            />

            <NumberInput
              label="Cutting Charge"
              value={state.cuttingCharge}
              onChange={(e) => update({ cuttingCharge: e.target.value })}
              placeholder="Enter cutting charge"
              prefix="$"
            />
          </div>
        </div>

        {/* Enhanced Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-orange-600">Results</h3>

          {!hasAllSpecs ? (
            <EmptyState
              icon={ClipboardList}
              title="Enter Sheet Specifications"
              description="Fill in both parent sheet and cut-to dimensions to see yield calculations"
            />
          ) : (
            <>
              <ResultCard
                title="Yield per Parent Sheet"
                value={yieldPerParent().toLocaleString()}
                color="orange"
                suffix=" pieces"
                copyValue={yieldPerParent()}
              />

              {hasGoal && (
                <ResultCard
                  title="Parent Sheets Needed"
                  value={parentsNeeded().toLocaleString()}
                  color="blue"
                  suffix=" sheets"
                  copyValue={parentsNeeded()}
                />
              )}

              {hasGoal && hasCosts && (
                <ResultCard
                  title="Cost per Cut Sheet"
                  value={`$${costPerCut().toFixed(2)}`}
                  color="green"
                  copyValue={costPerCut().toFixed(2)}
                />
              )}

              {/* Calculation breakdown */}
              {hasGoal && (
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Production Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Total pieces needed:
                      </span>
                      <span className="font-medium">
                        {(+state.goal).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pieces per parent:</span>
                      <span className="font-medium">
                        {yieldPerParent().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Parent sheets needed:
                      </span>
                      <span className="font-medium">
                        {parentsNeeded().toLocaleString()}
                      </span>
                    </div>
                    {hasCosts && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Material cost:</span>
                          <span className="font-medium">
                            ${(parentsNeeded() * +state.parentCost).toFixed(2)}
                          </span>
                        </div>
                        {state.cuttingCharge && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Cutting charge:
                            </span>
                            <span className="font-medium">
                              ${(+state.cuttingCharge).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
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
