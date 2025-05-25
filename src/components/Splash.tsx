// @ts-nocheck
import React from "react";

export default function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="animate-fade-in-scale">
        <img
          src="/LEGION VERTICAL K.png"
          alt="Legion Paper"
          className="w-48 md:w-60 lg:w-72 select-none drop-shadow-lg"
          draggable={false}
        />
      </div>

      {/* Custom CSS for fade-in with scale animation */}
      <style jsx>{`
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
