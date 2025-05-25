// @ts-nocheck
import React, { useState } from "react";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { Weight } from "lucide-react";

export default function PaperWeight() {
  const [mode, setMode] = useState("lbs");
  const [lbs, setLbs] = useState("");
  const [gsm, setGsm] = useState("");

  const toGsmText = (l) => Math.round((l * 1406.5) / 950);
  const toGsmCover = (l) => Math.round((l * 1406.5) / 520);
  const toLbText = (g) => Math.round((g * 950) / 1406.5);
  const toLbCover = (g) => Math.round((g * 520) / 1406.5);

  const modes = [
    {
      id: "lbs",
      label: "Lbs → gsm",
      color: "blue",
      description: "Convert US basis weight to grams per square meter",
    },
    {
      id: "gsm",
      label: "gsm → Lbs",
      color: "green",
      description: "Convert grams per square meter to US basis weight",
    },
  ];

  const currentMode = modes.find((m) => m.id === mode);
  const hasInput = mode === "lbs" ? lbs : gsm;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">US Basis ↔ gsm</h2>

      {/* Enhanced mode selector */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-600">
          Choose Conversion Direction
        </h3>

        <div className="flex bg-gray-100 rounded-lg p-1">
          {modes.map((modeOption) => (
            <button
              key={modeOption.id}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                mode === modeOption.id
                  ? `bg-${modeOption.color}-500 text-white shadow-sm`
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => {
                setMode(modeOption.id);
                setGsm("");
                setLbs("");
              }}
            >
              {modeOption.label}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {currentMode.description}
        </div>
      </div>

      {/* Enhanced input */}
      <div className={`bg-${currentMode.color}-50 p-4 rounded-lg mb-6`}>
        <h4 className={`font-semibold text-${currentMode.color}-800 mb-3`}>
          {currentMode.label}
        </h4>

        {mode === "lbs" ? (
          <NumberInput
            label="Basis Weight"
            value={lbs}
            onChange={(e) => setLbs(e.target.value)}
            placeholder="Enter basis weight"
            suffix="lbs"
            step="0.1"
          />
        ) : (
          <NumberInput
            label="Paper Weight"
            value={gsm}
            onChange={(e) => setGsm(e.target.value)}
            placeholder="Enter gsm"
            suffix="gsm"
            step="1"
          />
        )}
      </div>

      {/* Enhanced results */}
      {!hasInput ? (
        <EmptyState
          icon={Weight}
          title="Enter Paper Weight"
          description={`Enter a ${
            mode === "lbs" ? "basis weight in pounds" : "weight in gsm"
          } to see the conversion`}
          className="py-8"
        />
      ) : (
        <div className="space-y-4">
          {mode === "gsm" && gsm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard
                title="Text Weight"
                value={toLbText(+gsm).toLocaleString()}
                color="blue"
                suffix=" lb Text"
                copyValue={toLbText(+gsm)}
              />
              <ResultCard
                title="Cover Weight"
                value={toLbCover(+gsm).toLocaleString()}
                color="green"
                suffix=" lb Cover"
                copyValue={toLbCover(+gsm)}
              />
            </div>
          )}

          {mode === "lbs" && lbs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard
                title="Text Basis"
                value={toGsmText(+lbs).toLocaleString()}
                color="blue"
                suffix=" gsm"
                copyValue={toGsmText(+lbs)}
              />
              <ResultCard
                title="Cover Basis"
                value={toGsmCover(+lbs).toLocaleString()}
                color="green"
                suffix=" gsm"
                copyValue={toGsmCover(+lbs)}
              />
            </div>
          )}

          {/* Conversion reference */}
          <div
            className={`bg-${currentMode.color}-50 border-l-4 border-${currentMode.color}-500 p-4 rounded`}
          >
            <h4 className={`font-semibold text-${currentMode.color}-800 mb-2`}>
              About Paper Basis Weights
            </h4>
            <div className="text-sm space-y-1">
              <div>
                <strong>Text Weight:</strong> Based on 25" × 38" (950 sq in)
                ream of 500 sheets
              </div>
              <div>
                <strong>Cover Weight:</strong> Based on 20" × 26" (520 sq in)
                ream of 500 sheets
              </div>
              <div>
                <strong>GSM:</strong> Grams per square meter (international
                standard)
              </div>
            </div>
          </div>

          {/* Comparison table for context */}
          {hasInput && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-3">
                Common Paper Weights
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-600 mb-2">
                    Text Weights
                  </div>
                  <div className="space-y-1">
                    <div>60 lb Text ≈ 89 gsm</div>
                    <div>70 lb Text ≈ 104 gsm</div>
                    <div>80 lb Text ≈ 119 gsm</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-600 mb-2">
                    Cover Weights
                  </div>
                  <div className="space-y-1">
                    <div>80 lb Cover ≈ 216 gsm</div>
                    <div>100 lb Cover ≈ 270 gsm</div>
                    <div>120 lb Cover ≈ 324 gsm</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
