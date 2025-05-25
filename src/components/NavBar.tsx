// ==================== NavBar.tsx — Mobile-First Responsive ====================
// @ts-nocheck
import React from "react";
import {
  Menu,
  X,
  Search,
  Scale,
  Layers,
  Percent,
  Ruler,
  ClipboardList,
  DollarSign,
  Weight,
  Tag,
} from "lucide-react";

export default function NavBar({
  activeTab,
  setActiveTab,
  menuOpen,
  setMenuOpen,
}) {
  const tabs = [
    { id: "lookup", label: "Lookup", icon: Search },
    { id: "costs", label: "Costs & Weights", icon: Scale },
    { id: "sheets", label: "Sheets", icon: Layers },
    { id: "margin", label: "Margin", icon: Percent },
    { id: "metric", label: "Metric", icon: Ruler },
    { id: "work", label: "Work Orders", icon: ClipboardList },
    { id: "fx", label: "€ → $", icon: DollarSign },
    { id: "weight", label: "Basis ↔ gsm", icon: Weight },
    { id: "thick", label: "Thickness", icon: Ruler },
    { id: "pricing", label: "Metric $", icon: Tag },
  ];

  return (
    <header className="bg-blue-900 text-white shadow-lg relative sticky top-0 z-50">
      {/* Top bar - improved mobile spacing */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/legion-horizontal.png"
            alt="Legion Paper Logo"
            className="w-40 md:w-52 lg:w-60 select-none"
            draggable={false}
          />
        </div>
        {/* Larger touch target for mobile - Apple standard 44x44px minimum */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown - improved UX */}
      {menuOpen && (
        <>
          {/* Backdrop for easier dismissal */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-full right-2 sm:right-4 bg-white text-gray-800 rounded-lg shadow-xl p-2 z-50 w-72 max-w-[calc(100vw-1rem)]">
            <h3 className="font-bold mb-3 px-2 text-lg">Quick Navigation</h3>
            <div className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full text-left p-3 rounded-lg min-h-[48px] touch-manipulation transition-colors ${
                    activeTab === id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      activeTab === id ? "text-blue-600" : "text-gray-500"
                    }
                  />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Desktop strip - responsive centering */}
      <nav className="bg-white shadow-md relative overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-6 py-2 px-4 justify-center min-w-max md:min-w-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center justify-center w-[72px] min-h-[44px] relative flex-shrink-0 ${
                  activeTab === id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium whitespace-nowrap">
                  {label}
                </span>
                {/* Underline: centered beneath icon+label */}
                {activeTab === id && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-8 bg-blue-600 rounded-full transition-all duration-150" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}
