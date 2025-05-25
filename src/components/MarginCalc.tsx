// @ts-nocheck
import React, { useState } from "react";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { Percent } from "lucide-react";

export default function MarginCalc() {
  const [state, setState] = useState({
    calculationType: "find-margin",
    ourCost: "",
    sellingPrice: "",
    marginPercent: "",
  });

  const [errors, setErrors] = useState({});

  const update = (changes) => {
    setState((prev) => ({ ...prev, ...changes }));
    setErrors({});
  };

  const marginPct = () =>
    ((+state.sellingPrice - +state.ourCost) / +state.sellingPrice) * 100;
  const sellPrice = () => +state.ourCost / (1 - +state.marginPercent / 100);
  const costMax = () => +state.sellingPrice * (1 - +state.marginPercent / 100);

  const money = (n) => (n ? `$${parseFloat(n).toFixed(2)}` : "");

  const hasRequiredInputs = () => {
    switch (state.calculationType) {
      case "find-margin":
        return state.ourCost && state.sellingPrice;
      case "find-selling":
        return state.ourCost && state.marginPercent;
      case "find-cost":
        return state.sellingPrice && state.marginPercent;
      default:
        return false;
    }
  };

  const calculationModes = [
    {
      id: "find-margin",
      label: "Find Margin %",
      color: "blue",
      description: "Calculate profit margin from cost and selling price",
      inputs: [
        {
          key: "ourCost",
          label: "Our Cost",
          prefix: "$",
          placeholder: "Enter our cost",
        },
        {
          key: "sellingPrice",
          label: "Selling Price",
          prefix: "$",
          placeholder: "Enter selling price",
        },
      ],
    },
    {
      id: "find-selling",
      label: "Find Selling Price",
      color: "green",
      description:
        "Calculate required selling price from cost and target margin",
      inputs: [
        {
          key: "ourCost",
          label: "Our Cost",
          prefix: "$",
          placeholder: "Enter our cost",
        },
        {
          key: "marginPercent",
          label: "Target Margin",
          suffix: "%",
          placeholder: "Enter target margin",
        },
      ],
    },
    {
      id: "find-cost",
      label: "Find Our Cost",
      color: "orange",
      description:
        "Calculate maximum allowable cost from selling price and target margin",
      inputs: [
        {
          key: "sellingPrice",
          label: "Selling Price",
          prefix: "$",
          placeholder: "Enter selling price",
        },
        {
          key: "marginPercent",
          label: "Target Margin",
          suffix: "%",
          placeholder: "Enter target margin",
        },
      ],
    },
  ];

  const currentMode = calculationModes.find(
    (mode) => mode.id === state.calculationType
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Margin Calculator</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-purple-600">
            Choose Calculation
          </h3>

          {/* Compact calculation mode selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {calculationModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => update({ calculationType: mode.id })}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  state.calculationType === mode.id
                    ? `border-${mode.color}-500 bg-${mode.color}-50 shadow-md`
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`font-medium text-sm ${
                    state.calculationType === mode.id
                      ? `text-${mode.color}-700`
                      : "text-gray-700"
                  }`}
                >
                  {mode.label}
                </div>
              </button>
            ))}
          </div>

          {/* Description for selected mode */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {currentMode.description}
          </div>

          {/* Dynamic inputs based on selected mode */}
          <div
            className={`bg-${currentMode.color}-50 p-4 rounded-lg space-y-4`}
          >
            <h4 className={`font-semibold text-${currentMode.color}-800`}>
              {currentMode.label}
            </h4>

            {currentMode.inputs.map((input, index) => (
              <NumberInput
                key={input.key}
                label={input.label}
                value={state[input.key]}
                onChange={(e) => update({ [input.key]: e.target.value })}
                placeholder={input.placeholder}
                prefix={input.prefix}
                suffix={input.suffix}
                required
                error={errors[input.key]}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-purple-600">Result</h3>

          {!hasRequiredInputs() ? (
            <EmptyState
              icon={Percent}
              title="Enter Required Values"
              description={`Fill in the required fields to calculate your ${
                state.calculationType === "find-margin"
                  ? "margin percentage"
                  : state.calculationType === "find-selling"
                  ? "selling price"
                  : "maximum cost"
              }`}
            />
          ) : (
            <>
              {state.calculationType === "find-margin" && (
                <ResultCard
                  title="Margin Percentage"
                  value={marginPct().toFixed(2)}
                  color="blue"
                  suffix="%"
                  copyValue={marginPct().toFixed(2)}
                />
              )}

              {state.calculationType === "find-selling" && (
                <ResultCard
                  title="Required Selling Price"
                  value={money(sellPrice())}
                  color="green"
                  copyValue={sellPrice().toFixed(2)}
                />
              )}

              {state.calculationType === "find-cost" && (
                <ResultCard
                  title="Maximum Cost Allowed"
                  value={money(costMax())}
                  color="orange"
                  copyValue={costMax().toFixed(2)}
                />
              )}

              {/* Enhanced calculation summary */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h4 className="font-semibold text-purple-800 mb-3">
                  Calculation Summary
                </h4>
                <div className="space-y-2 text-sm">
                  {state.calculationType === "find-margin" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Our Cost:</span>
                        <span className="font-medium">
                          {money(+state.ourCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Selling Price:</span>
                        <span className="font-medium">
                          {money(+state.sellingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Gross Profit:</span>
                        <span className="font-medium">
                          {money(+state.sellingPrice - +state.ourCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Markup %:</span>
                        <span className="font-medium">
                          {(
                            ((+state.sellingPrice - +state.ourCost) /
                              +state.ourCost) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </>
                  )}
                  {state.calculationType === "find-selling" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Our Cost:</span>
                        <span className="font-medium">
                          {money(+state.ourCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Target Margin:</span>
                        <span className="font-medium">
                          {state.marginPercent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Gross Profit:</span>
                        <span className="font-medium">
                          {money(sellPrice() - +state.ourCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Markup %:</span>
                        <span className="font-medium">
                          {(
                            ((sellPrice() - +state.ourCost) / +state.ourCost) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </>
                  )}
                  {state.calculationType === "find-cost" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Selling Price:</span>
                        <span className="font-medium">
                          {money(+state.sellingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Target Margin:</span>
                        <span className="font-medium">
                          {state.marginPercent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Gross Profit:</span>
                        <span className="font-medium">
                          {money(+state.sellingPrice - costMax())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Markup %:</span>
                        <span className="font-medium">
                          {(
                            ((+state.sellingPrice - costMax()) / costMax()) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
