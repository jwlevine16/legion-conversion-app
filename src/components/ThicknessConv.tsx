// @ts-nocheck
import React, { useState } from "react";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { Ruler } from "lucide-react";

export default function ThicknessConv() {
  const [mode, setMode] = useState("in");
  const [inch, setIn] = useState("");
  const [mm, setMm] = useState("");
  const [pt, setPt] = useState("");

  /** locale formatter */
  const fmt = (n, d) =>
    n !== ""
      ? Number(n).toLocaleString(undefined, {
          minimumFractionDigits: d,
          maximumFractionDigits: d,
        })
      : "";

  /** keep all fields in sync */
  const sync = (type, val) => {
    if (type === "in") {
      setIn(val);
      const n = +val;
      setMm(val ? fmt(n * 25.4, 3) : "");
      setPt(val ? fmt(n * 72, 2) : "");
    }
    if (type === "mm") {
      setMm(val);
      const n = +val / 25.4;
      setIn(fmt(n, 4));
      setPt(fmt(n * 72, 2));
    }
    if (type === "pt") {
      setPt(val);
      const n = +val / 72;
      setIn(fmt(n, 4));
      setMm(fmt(n * 25.4, 3));
    }
  };

  const inchVal =
    +inch || +mm.replace(/,/g, "") / 25.4 || +pt.replace(/,/g, "") / 72 || 0;

  const modes = [
    {
      id: "in",
      label: "Inches",
      color: "blue",
      description:
        "Enter thickness in inches (most precise for small measurements)",
    },
    {
      id: "mm",
      label: "Millimeters",
      color: "green",
      description: "Enter thickness in millimeters (metric standard)",
    },
    {
      id: "pt",
      label: "Points",
      color: "orange",
      description: "Enter thickness in points (printing industry standard)",
    },
  ];

  const currentMode = modes.find((m) => m.id === mode);
  const hasInput = inch || mm || pt;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Thickness Conversion</h2>

      {/* Enhanced mode selector */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-600">
          Choose Input Unit
        </h3>

        <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-lg p-1">
          {modes.map((modeOption) => (
            <button
              key={modeOption.id}
              onClick={() => setMode(modeOption.id)}
              className={`py-2 px-3 text-sm font-medium rounded-md transition-all ${
                mode === modeOption.id
                  ? `bg-${modeOption.color}-500 text-white shadow-sm`
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {modeOption.label}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {currentMode.description}
        </div>
      </div>

      {/* Enhanced input field */}
      <div className={`bg-${currentMode.color}-50 p-4 rounded-lg mb-6`}>
        <h4 className={`font-semibold text-${currentMode.color}-800 mb-3`}>
          Enter Thickness in {currentMode.label}
        </h4>

        {mode === "in" && (
          <NumberInput
            label="Thickness"
            value={inch}
            onChange={(e) => sync("in", e.target.value)}
            placeholder="Enter thickness"
            suffix="inches"
            step="0.0001"
          />
        )}
        {mode === "mm" && (
          <NumberInput
            label="Thickness"
            value={mm.replace(/,/g, "")}
            onChange={(e) => sync("mm", e.target.value)}
            placeholder="Enter thickness"
            suffix="mm"
            step="0.001"
          />
        )}
        {mode === "pt" && (
          <NumberInput
            label="Thickness"
            value={pt.replace(/,/g, "")}
            onChange={(e) => sync("pt", e.target.value)}
            placeholder="Enter thickness"
            suffix="pt"
            step="0.1"
          />
        )}
      </div>

      {/* Enhanced results */}
      {!hasInput ? (
        <EmptyState
          icon={Ruler}
          title="Enter Thickness Value"
          description={`Enter a thickness value in ${currentMode.label.toLowerCase()} to see all conversions`}
          className="py-8"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <ResultCard
              title="Inches"
              value={fmt(inchVal, 4)}
              color="blue"
              suffix=" in"
              copyValue={inchVal.toFixed(4)}
            />
            <ResultCard
              title="Millimeters"
              value={mm}
              color="green"
              suffix=" mm"
              copyValue={mm.replace(/,/g, "")}
            />
            <ResultCard
              title="Points"
              value={pt}
              color="orange"
              suffix=" pt"
              copyValue={pt.replace(/,/g, "")}
            />
            <ResultCard
              title="Microns"
              value={fmt(inchVal * 25400, 1)}
              color="purple"
              suffix=" μm"
              copyValue={(inchVal * 25400).toFixed(1)}
            />
          </div>

          {/* Conversion reference */}
          <div
            className={`bg-${currentMode.color}-50 border-l-4 border-${currentMode.color}-500 p-4 rounded`}
          >
            <h4 className={`font-semibold text-${currentMode.color}-800 mb-2`}>
              Conversion Reference
            </h4>
            <div className="text-sm space-y-1">
              <div>1 inch = 25.4 mm = 72 pt = 25,400 μm</div>
              <div>1 mm = 0.0394 in = 2.835 pt = 1,000 μm</div>
              <div>1 point = 0.0139 in = 0.353 mm = 353 μm</div>
            </div>
          </div>

          {/* Common thickness examples */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3">
              Common Paper Thicknesses
            </h4>
            <div className="text-sm space-y-1">
              <div>
                <strong>Copy Paper:</strong> ~0.004" (0.1mm, 4 mils)
              </div>
              <div>
                <strong>Business Card:</strong> ~0.014" (0.35mm, 14 mils)
              </div>
              <div>
                <strong>Cardstock:</strong> ~0.012" (0.3mm, 12 mils)
              </div>
              <div>
                <strong>Paperboard:</strong> ~0.024" (0.6mm, 24 mils)
              </div>
            </div>
          </div>

          {/* Precision note */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <div className="text-sm text-blue-700">
              <strong>Note:</strong> Measurements are rounded for readability.
              For maximum precision, use the inches value as the base unit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
