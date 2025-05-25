// @ts-nocheck
import React, { useState } from "react";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { Tag } from "lucide-react";

export default function MetricPricing() {
  const [base, setBase] = useState("m2");
  const [price, setPrice] = useState("");

  // area relationships
  const M2_PER_YD2 = 0.836127;
  const FT2_PER_M2 = 10.7639;
  const FT2_PER_YD2 = 9;

  /* conversion helpers (cost for **one full** target unit) */
  const m2_to_ft2 = (p) => (p / FT2_PER_M2).toFixed(4);
  const m2_to_yd2 = (p) => (p * M2_PER_YD2).toFixed(4);

  const ft2_to_m2 = (p) => (p * FT2_PER_M2).toFixed(4);
  const ft2_to_yd2 = (p) => (p * FT2_PER_YD2).toFixed(4);

  const yd2_to_m2 = (p) => (p / M2_PER_YD2).toFixed(4);
  const yd2_to_ft2 = (p) => (p / FT2_PER_YD2).toFixed(4);

  /* compute */
  const num = parseFloat(price) || 0;
  const results =
    base === "m2"
      ? { m2: num, ft2: m2_to_ft2(num), yd2: m2_to_yd2(num) }
      : base === "ft2"
      ? { m2: ft2_to_m2(num), ft2: num, yd2: ft2_to_yd2(num) }
      : { m2: yd2_to_m2(num), ft2: yd2_to_ft2(num), yd2: num };

  const units = [
    {
      id: "m2",
      label: "$/m²",
      fullName: "Price per Square Meter",
      color: "blue",
      description: "Metric pricing standard used internationally",
    },
    {
      id: "ft2",
      label: "$/ft²",
      fullName: "Price per Square Foot",
      color: "green",
      description: "Common US pricing for flooring, real estate, etc.",
    },
    {
      id: "yd2",
      label: "$/yd²",
      fullName: "Price per Square Yard",
      color: "orange",
      description: "Used for carpeting, fabric, and large area pricing",
    },
  ];

  const currentUnit = units.find((u) => u.id === base);
  const otherUnits = units.filter((u) => u.id !== base);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Metric Pricing</h2>

      {/* Enhanced unit selector */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-600">
          Choose Base Unit
        </h3>

        <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1">
          {units.map((unit) => (
            <button
              key={unit.id}
              className={`py-2 px-2 text-sm font-medium rounded-md transition-all ${
                base === unit.id
                  ? `bg-${unit.color}-500 text-white shadow-sm`
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => {
                setBase(unit.id);
                setPrice("");
              }}
            >
              {unit.label}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {currentUnit.description}
        </div>
      </div>

      {/* Enhanced input */}
      <div className={`bg-${currentUnit.color}-50 p-4 rounded-lg mb-6`}>
        <h4 className={`font-semibold text-${currentUnit.color}-800 mb-3`}>
          {currentUnit.fullName}
        </h4>

        <NumberInput
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={`Enter price in ${currentUnit.label}`}
          prefix="$"
          step="0.0001"
        />
      </div>

      {/* Enhanced results */}
      {!price ? (
        <EmptyState
          icon={Tag}
          title="Enter Price Value"
          description={`Enter a price in ${currentUnit.label} to see conversions to other units`}
          className="py-8"
        />
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {otherUnits.map((unit) => (
              <ResultCard
                key={unit.id}
                title={unit.fullName}
                value={`$${parseFloat(results[unit.id]).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  }
                )}`}
                color={unit.color}
                copyValue={parseFloat(results[unit.id]).toFixed(4)}
              />
            ))}
          </div>

          {/* Conversion reference */}
          <div
            className={`bg-${currentUnit.color}-50 border-l-4 border-${currentUnit.color}-500 p-4 rounded`}
          >
            <h4 className={`font-semibold text-${currentUnit.color}-800 mb-2`}>
              Area Conversion Factors
            </h4>
            <div className="text-sm space-y-1">
              <div>1 m² = 10.764 ft² = 1.196 yd²</div>
              <div>1 ft² = 0.0929 m² = 0.111 yd²</div>
              <div>1 yd² = 0.836 m² = 9 ft²</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
