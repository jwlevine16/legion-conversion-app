// src/LegionPaperApp.tsx — master layout with new Product Lookup tab
// @ts-nocheck
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Splash from "./components/Splash";

/* existing feature tabs */
import CostsWeights from "./components/CostsWeights";
import SheetsCalc from "./components/SheetsCalc";
import MarginCalc from "./components/MarginCalc";
import MetricConv from "./components/MetricConv";
import WorkOrders from "./components/WorkOrders";
import EuroUsd from "./components/EuroUsd";
import PaperWeight from "./components/PaperWeight";
import ThicknessConv from "./components/ThicknessConv";
import MetricPricing from "./components/MetricPricing";

/* NEW */
import ItemLookup from "./components/ItemLookup";

export default function LegionPaperApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("lookup"); // default to the new tab
  const [menuOpen, setMenuOpen] = useState(false);

  /* splash screen timer (4 seconds) */
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <Splash />;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "lookup" && <ItemLookup />} {/* NEW */}
        {activeTab === "costs" && <CostsWeights />}
        {activeTab === "sheets" && <SheetsCalc />}
        {activeTab === "margin" && <MarginCalc />}
        {activeTab === "metric" && <MetricConv />}
        {activeTab === "work" && <WorkOrders />}
        {activeTab === "fx" && <EuroUsd />}
        {activeTab === "weight" && <PaperWeight />}
        {activeTab === "thick" && <ThicknessConv />}
        {activeTab === "pricing" && <MetricPricing />}
      </main>
    </div>
  );
}
