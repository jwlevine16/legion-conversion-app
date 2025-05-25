// @ts-nocheck
import React, { useState } from "react";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";
import { Ruler } from "lucide-react";

export default function MetricConv() {
  const [state, setState] = useState({
    conversionType: "weight",
    kg: "",
    lbs: "",
    inches: "",
    cm: "",
    m2: "",
    ft2: "",
    lengthInches: "",
    widthInches: "",
    lengthCm: "",
    widthCm: "",
  });

  const update = (c) => setState((p) => ({ ...p, ...c }));

  // Conversion functions
  const kg2lbs = (kg) => (kg ? (+kg * 2.2046).toFixed(2) : "");
  const lbs2kg = (lb) => (lb ? (+lb * 0.4535924).toFixed(2) : "");
  const in2cm = (i) => (i ? (+i * 2.54).toFixed(2) : "");
  const cm2in = (c) => (c ? (+c / 2.54).toFixed(2) : "");
  const m22ft2 = (m) => (m ? (+m * 10.7639).toFixed(2) : "");
  const ft22m2 = (f) => (f ? (+f / 10.7639).toFixed(2) : "");

  const conversionTypes = [
    {
      id: "weight",
      label: "Weight",
      color: "blue",
      description: "Convert between kilograms and pounds",
    },
    {
      id: "length",
      label: "Length",
      color: "green",
      description: "Convert between inches and centimeters",
    },
    {
      id: "area",
      label: "Area",
      color: "orange",
      description: "Convert between square meters and square feet",
    },
    {
      id: "size",
      label: "Dimensions",
      color: "purple",
      description: "Convert length × width dimensions",
    },
  ];

  const currentType = conversionTypes.find(
    (type) => type.id === state.conversionType
  );

  const hasInputs = () => {
    switch (state.conversionType) {
      case "weight":
        return state.kg || state.lbs;
      case "length":
        return state.inches || state.cm;
      case "area":
        return state.m2 || state.ft2;
      case "size":
        return (
          (state.lengthInches && state.widthInches) ||
          (state.lengthCm && state.widthCm)
        );
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Metric Conversions</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Enhanced conversion type selector and inputs */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-purple-600">
            Choose Conversion Type
          </h3>

          {/* Compact conversion type selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {conversionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => update({ conversionType: type.id })}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  state.conversionType === type.id
                    ? `border-${type.color}-500 bg-${type.color}-50 shadow-md`
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`font-medium text-sm ${
                    state.conversionType === type.id
                      ? `text-${type.color}-700`
                      : "text-gray-700"
                  }`}
                >
                  {type.label}
                </div>
              </button>
            ))}
          </div>

          {/* Description for selected type */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {currentType.description}
          </div>

          {/* Dynamic inputs based on conversion type */}
          <div
            className={`bg-${currentType.color}-50 p-4 rounded-lg space-y-4`}
          >
            <h4 className={`font-semibold text-${currentType.color}-800 mb-3`}>
              {currentType.label} Conversion
            </h4>

            {state.conversionType === "weight" && (
              <>
                <NumberInput
                  label="Kilograms"
                  value={state.kg}
                  onChange={(e) =>
                    update({ kg: e.target.value, lbs: kg2lbs(e.target.value) })
                  }
                  placeholder="Enter weight in kg"
                  suffix="kg"
                />
                <NumberInput
                  label="Pounds"
                  value={state.lbs}
                  onChange={(e) =>
                    update({ lbs: e.target.value, kg: lbs2kg(e.target.value) })
                  }
                  placeholder="Enter weight in lbs"
                  suffix="lbs"
                />
              </>
            )}

            {state.conversionType === "length" && (
              <>
                <NumberInput
                  label="Inches"
                  value={state.inches}
                  onChange={(e) =>
                    update({
                      inches: e.target.value,
                      cm: in2cm(e.target.value),
                    })
                  }
                  placeholder="Enter length in inches"
                  suffix="in"
                />
                <NumberInput
                  label="Centimeters"
                  value={state.cm}
                  onChange={(e) =>
                    update({
                      cm: e.target.value,
                      inches: cm2in(e.target.value),
                    })
                  }
                  placeholder="Enter length in cm"
                  suffix="cm"
                />
              </>
            )}

            {state.conversionType === "area" && (
              <>
                <NumberInput
                  label="Square Meters"
                  value={state.m2}
                  onChange={(e) =>
                    update({ m2: e.target.value, ft2: m22ft2(e.target.value) })
                  }
                  placeholder="Enter area in m²"
                  suffix="m²"
                />
                <NumberInput
                  label="Square Feet"
                  value={state.ft2}
                  onChange={(e) =>
                    update({ ft2: e.target.value, m2: ft22m2(e.target.value) })
                  }
                  placeholder="Enter area in ft²"
                  suffix="ft²"
                />
              </>
            )}

            {state.conversionType === "size" && (
              <div className="space-y-4">
                <div>
                  <h5
                    className={`text-sm font-medium text-${currentType.color}-700 mb-2`}
                  >
                    Inches
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      label="Length"
                      value={state.lengthInches}
                      onChange={(e) =>
                        update({
                          lengthInches: e.target.value,
                          lengthCm: in2cm(e.target.value),
                        })
                      }
                      placeholder="Length"
                      suffix="in"
                    />
                    <NumberInput
                      label="Width"
                      value={state.widthInches}
                      onChange={(e) =>
                        update({
                          widthInches: e.target.value,
                          widthCm: in2cm(e.target.value),
                        })
                      }
                      placeholder="Width"
                      suffix="in"
                    />
                  </div>
                </div>

                <div>
                  <h5
                    className={`text-sm font-medium text-${currentType.color}-700 mb-2`}
                  >
                    Centimeters
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      label="Length"
                      value={state.lengthCm}
                      onChange={(e) =>
                        update({
                          lengthCm: e.target.value,
                          lengthInches: cm2in(e.target.value),
                        })
                      }
                      placeholder="Length"
                      suffix="cm"
                    />
                    <NumberInput
                      label="Width"
                      value={state.widthCm}
                      onChange={(e) =>
                        update({
                          widthCm: e.target.value,
                          widthInches: cm2in(e.target.value),
                        })
                      }
                      placeholder="Width"
                      suffix="cm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-purple-600">
            Conversion Results
          </h3>

          {!hasInputs() ? (
            <EmptyState
              icon={Ruler}
              title="Enter Values to Convert"
              description={`Enter values in the ${currentType.label.toLowerCase()} fields to see the conversion`}
            />
          ) : (
            <>
              {state.conversionType === "weight" && (state.kg || state.lbs) && (
                <ResultCard
                  title="Weight Conversion"
                  value={
                    state.kg && state.lbs
                      ? `${state.kg} kg = ${kg2lbs(state.kg)} lbs`
                      : state.kg
                      ? `${state.kg} kg = ${kg2lbs(state.kg)} lbs`
                      : `${state.lbs} lbs = ${lbs2kg(state.lbs)} kg`
                  }
                  color="blue"
                  copyValue={state.kg || state.lbs}
                />
              )}

              {state.conversionType === "length" &&
                (state.inches || state.cm) && (
                  <ResultCard
                    title="Length Conversion"
                    value={
                      state.inches && state.cm
                        ? `${state.inches}" = ${in2cm(state.inches)} cm`
                        : state.inches
                        ? `${state.inches}" = ${in2cm(state.inches)} cm`
                        : `${state.cm} cm = ${cm2in(state.cm)}"`
                    }
                    color="green"
                    copyValue={state.inches || state.cm}
                  />
                )}

              {state.conversionType === "area" && (state.m2 || state.ft2) && (
                <ResultCard
                  title="Area Conversion"
                  value={
                    state.m2 && state.ft2
                      ? `${state.m2} m² = ${m22ft2(state.m2)} ft²`
                      : state.m2
                      ? `${state.m2} m² = ${m22ft2(state.m2)} ft²`
                      : `${state.ft2} ft² = ${ft22m2(state.ft2)} m²`
                  }
                  color="orange"
                  copyValue={state.m2 || state.ft2}
                />
              )}

              {state.conversionType === "size" &&
                (state.lengthInches || state.lengthCm) &&
                (state.widthInches || state.widthCm) && (
                  <div className="space-y-4">
                    <ResultCard
                      title="Dimensions (Inches)"
                      value={`${
                        state.lengthInches || cm2in(state.lengthCm)
                      }" × ${state.widthInches || cm2in(state.widthCm)}"`}
                      color="purple"
                      copyValue={`${
                        state.lengthInches || cm2in(state.lengthCm)
                      } x ${state.widthInches || cm2in(state.widthCm)}`}
                    />
                    <ResultCard
                      title="Dimensions (Centimeters)"
                      value={`${
                        state.lengthCm || in2cm(state.lengthInches)
                      } cm × ${state.widthCm || in2cm(state.widthInches)} cm`}
                      color="purple"
                      copyValue={`${
                        state.lengthCm || in2cm(state.lengthInches)
                      } x ${state.widthCm || in2cm(state.widthInches)}`}
                    />
                  </div>
                )}

              {/* Conversion reference */}
              <div
                className={`bg-${currentType.color}-50 border-l-4 border-${currentType.color}-500 p-4 rounded`}
              >
                <h4
                  className={`font-semibold text-${currentType.color}-800 mb-2`}
                >
                  Quick Reference
                </h4>
                <div className="text-sm space-y-1">
                  {state.conversionType === "weight" && (
                    <>
                      <div>1 kg = 2.2046 lbs</div>
                      <div>1 lb = 0.4536 kg</div>
                    </>
                  )}
                  {state.conversionType === "length" && (
                    <>
                      <div>1 inch = 2.54 cm</div>
                      <div>1 cm = 0.3937 inches</div>
                    </>
                  )}
                  {state.conversionType === "area" && (
                    <>
                      <div>1 m² = 10.764 ft²</div>
                      <div>1 ft² = 0.0929 m²</div>
                    </>
                  )}
                  {state.conversionType === "size" && (
                    <div>Enter dimensions in either unit system</div>
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
