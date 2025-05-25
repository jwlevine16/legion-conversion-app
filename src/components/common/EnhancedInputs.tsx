// src/components/common/EnhancedInputs.tsx
// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

// Enhanced Number Input with validation and formatting
export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  step = "0.01",
  prefix,
  suffix,
  required = false,
  error,
  className = "",
  autoFocus = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setIsValid(newValue === "" || !isNaN(parseFloat(newValue)));
    onChange(e);
  };

  const hasError = error || (!isValid && value !== "");

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full p-3 border rounded-lg text-base transition-all duration-200 ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-12" : ""} ${
            hasError
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : isFocused
              ? "border-blue-500 focus:ring-2 focus:ring-blue-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
          placeholder={placeholder}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
        {hasError && (
          <AlertCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
            size={16}
          />
        )}
      </div>
      {hasError && (
        <p className="text-red-600 text-sm flex items-center gap-1">
          <AlertCircle size={14} />
          {error || "Please enter a valid number"}
        </p>
      )}
    </div>
  );
}

// Enhanced Results Card with copy functionality
export function ResultCard({
  title,
  value,
  color = "blue",
  prefix = "",
  suffix = "",
  copyValue,
  loading = false,
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copyValue || value) {
      try {
        await navigator.clipboard.writeText(copyValue || value.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  };

  if (loading) {
    return (
      <div
        className={`p-6 rounded-lg border-2 ${colorClasses[color]} animate-pulse ${className}`}
      >
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-lg border-2 shadow-sm hover:shadow-md transition-all duration-200 group ${colorClasses[color]} ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-sm opacity-80">{title}</div>
        {(copyValue || value) && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white hover:bg-opacity-50 rounded"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </div>
      <div className="text-2xl font-bold">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </div>
    </div>
  );
}

// Loading Skeleton Component
export function LoadingSkeleton({ lines = 3, className = "" }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
}

// Empty State Component
export function EmptyState({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  className = "",
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && <Icon size={48} className="mx-auto mb-4 text-gray-400" />}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
