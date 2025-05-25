// src/components/ItemLookup.tsx - Mobile-First Responsive
// @ts-nocheck
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Search, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnPrAvOhT7AcVwFJkoiXb-p8DqlfkSoGQXpRHxjs_iB9ooOSZKKd6JvGBSO6nuKSSrkSmTswAtDHsJ/pub?output=csv&gid=0";

function parseCSVRow(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

export default function ItemLookup() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ field: "code", asc: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!query || items.length) return;
    setLoading(true);
    setError("");
    fetch(CSV_URL)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then((csv) => {
        const rows = csv.trim().split(/\r?\n/);
        if (rows.length < 2)
          throw new Error("CSV appears to be empty or invalid");
        const dataRows = rows.slice(1);
        const parsed = dataRows
          .map((line) => {
            const fields = parseCSVRow(line);
            const code = (fields[0] || "").replace(/"/g, "").trim();
            const description = (fields[1] || "").replace(/"/g, "").trim();
            const priceRaw = (fields[2] || "").replace(/"/g, "").trim();
            const price = parseFloat(priceRaw.replace(/[^0-9.-]/g, "")) || 0;
            return code ? { code, description, price } : null;
          })
          .filter(Boolean);
        setItems(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load product data: ${err.message}`);
        setLoading(false);
      });
  }, [query, items.length]);

  const filtered = useMemo(() => {
    if (!query) return [];
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!searchTerms.length) return [];
    return items.filter((item) => {
      const codeText = item.code.toLowerCase();
      const descText = item.description.toLowerCase();
      return searchTerms.every(
        (term) => codeText.includes(term) || descText.includes(term)
      );
    });
  }, [items, query]);

  const results = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let v1 = a[sort.field];
      let v2 = b[sort.field];
      if (sort.field === "price") {
        v1 = Number(v1) || 0;
        v2 = Number(v2) || 0;
      } else {
        v1 = String(v1).toLowerCase();
        v2 = String(v2).toLowerCase();
      }
      if (v1 < v2) return sort.asc ? -1 : 1;
      if (v1 > v2) return sort.asc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  const toggleSort = (field) =>
    setSort((prev) =>
      prev.field === field ? { field, asc: !prev.asc } : { field, asc: true }
    );

  const headCell = (label, field) => (
    <th
      onClick={() => toggleSort(field)}
      className={`px-4 py-3 text-gray-600 cursor-pointer select-none hover:text-gray-800 ${
        field === "price" ? "text-right" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sort.field === field &&
          (sort.asc ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
      </span>
    </th>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4 p-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6 ml-auto"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        Product Lookup
      </h2>

      {/* Enhanced search input for mobile */}
      <div className="relative max-w-full sm:max-w-lg mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by item code or description (e.g., '250gsm' or 'Moab')"
          className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
        />
      </div>

      {loading && (
        <div className="bg-blue-50 text-blue-700 font-medium p-3 rounded mb-4 border-l-4 border-blue-500 flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Loading product data...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 font-medium p-3 rounded mb-4 border-l-4 border-red-500">
          {error}
        </div>
      )}

      {query && !loading && !error && (
        <div className="bg-blue-50 text-blue-700 font-medium p-3 rounded mb-4 border-l-4 border-blue-500">
          {results.length.toLocaleString()} products found
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {query &&
        !loading &&
        !error &&
        results.length === 0 &&
        items.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No matches found</h3>
              <p>Try broadening your search terms or check spelling</p>
            </div>
            <div className="text-sm text-gray-400">
              Search suggestions: "paper", "envelope", "cardstock", "bond"
            </div>
          </div>
        )}

      {query && results.length > 0 && !loading && (
        <>
          {/* Mobile Card View (shown only on mobile) */}
          <div className="block sm:hidden space-y-3 mb-4">
            {results.map((item, index) => (
              <div
                key={`${item.code}-${index}`}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 touch-manipulation"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.code}
                  </div>
                  <div className="text-green-700 font-bold text-lg tabular-nums">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow-sm border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  {headCell("Item Code", "code")}
                  {headCell("Description", "description")}
                  {headCell("List Price", "price")}
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr
                    key={`${item.code}-${index}`}
                    className="odd:bg-gray-50 hover:bg-blue-50 border-b border-gray-100"
                  >
                    <td className="px-4 py-3 text-gray-800 font-normal">
                      {item.code}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-normal">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-green-800 font-bold text-right tabular-nums">
                      ${item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!query && (
        <div className="bg-gray-50 text-gray-600 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Search Tips:</h3>
          <ul className="text-sm space-y-1">
            <li>• Search for any part of the item code or description</li>
            <li>
              • Use multiple words to narrow results (e.g., "Stonehenge 320")
            </li>
            <li>• All search terms must match for a result to appear</li>
            <li className="hidden sm:list-item">
              • Click column headers to sort results
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
