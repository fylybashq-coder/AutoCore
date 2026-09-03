import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export default function SearchableSelect({ options, value, onChange, placeholder = "Select..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selectedOption = options.find(o => String(o.id) === String(value));

  const filteredOptions = options.filter(o => {
    const label = (o.name || `${o.brand || ""} ${o.model || ""}`).toLowerCase();
    const phone = (o.phone || o.plate_number || "").toLowerCase();
    return label.includes(search.toLowerCase()) || phone.includes(search.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition"
      >
        <span className={selectedOption ? "text-slate-800 font-bold" : "text-slate-400"}>
          {selectedOption ? (selectedOption.name ? `${selectedOption.name} (${selectedOption.phone})` : `${selectedOption.brand} ${selectedOption.model} (${selectedOption.plate_number})`) : placeholder}
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
            <Search size={14} className="text-slate-400 ml-1" />
            <input
              autoFocus
              type="text"
              placeholder="Type name or phone to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent border-none outline-none font-medium text-slate-800"
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-bold">No results found</div>
            ) : (
              filteredOptions.map((o) => {
                const label = o.name ? `${o.name} (${o.phone})` : `${o.brand} ${o.model} (${o.plate_number}) - ${o.phone || ''}`;
                const isSelected = String(o.id) === String(value);
                return (
                  <div
                    key={o.id}
                    onClick={() => {
                      onChange(String(o.id));
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl cursor-pointer transition ${
                      isSelected ? "bg-blue-50 text-blue-600 font-bold" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <Check size={14} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}