// @ts-nocheck
import React, { useState, useEffect } from "react";
import { RefreshCcw, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { NumberInput, ResultCard, EmptyState } from "./common/EnhancedInputs";

export default function EuroUsd() {
  const [rate, setRate] = useState(1.1);
  const [error, setError] = useState(false);
  const [eurKg, setEurKg] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRate = async () => {
    setLoading(true);
    setError(false);
    try {
      const r = await fetch(
        "https://api.exchangerate.host/convert?from=EUR&to=USD"
      );
      if (!r.ok) throw new Error("primary");
      const j = await r.json();
      if (j?.result) {
        setRate(j.result);
        setLastUpdated(new Date());
        setLoading(false);
        return;
      }
      throw new Error("shape");
    } catch {
      try {
        const f = await fetch("https://open.er-api.com/v6/latest/EUR");
        if (!f.ok) throw new Error("fallback");
        const j2 = await f.json();
        if (j2?.rates?.USD) {
          setRate(j2.rates.USD);
          setLastUpdated(new Date());
          setLoading(false);
          return;
        }
        throw new Error("shape2");
      } catch {
        setError(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRate();
  }, []);

  const usdPerLb = eurKg
    ? (((parseFloat(eurKg) || 0) * rate) / 2.20462).toFixed(2)
    : "";

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">€ /kg → $ /lb</h2>

      <NumberInput
        label="Price per Kilogram"
        value={eurKg}
        onChange={(e) => setEurKg(e.target.value)}
        placeholder="Enter price per kg"
        prefix="€"
        className="mb-4"
      />

      <div className="flex items-center justify-between text-xs text-gray-500 mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {error ? (
            <>
              <WifiOff size={14} className="text-red-600" />
              <span className="text-red-600">
                Live FX unavailable - using 1 € = 1.10 $
              </span>
            </>
          ) : (
            <>
              <Wifi size={14} className="text-green-600" />
              <span>
                1 € = {rate.toFixed(4)} $
                {lastUpdated && (
                  <span className="text-gray-400 ml-1">
                    ({lastUpdated.toLocaleTimeString()})
                  </span>
                )}
              </span>
            </>
          )}
        </div>
        <button
          onClick={fetchRate}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 p-1"
          title="Refresh exchange rate"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {!eurKg ? (
        <EmptyState
          title="Enter Euro Price"
          description="Enter a price per kilogram in Euros to see the conversion"
          className="py-8"
        />
      ) : (
        <ResultCard
          title="Price in $ per lb"
          value={`$${usdPerLb}`}
          color="blue"
          copyValue={usdPerLb}
        />
      )}
    </div>
  );
}
