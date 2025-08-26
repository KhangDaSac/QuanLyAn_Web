import React, { useState, useRef, useEffect } from "react";

export interface Option {
  value: string;
  label: string;
}

interface ComboboxSearchProps {
  options: Option[];
  value: string; // Giá trị được chọn hiện tại
  onChange: (value: string) => void; // Callback khi chọn option mới
  placeholder?: string;
  className?: string;
}

const ComboboxSearch: React.FC<ComboboxSearchProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Tìm option được chọn
  const selectedOption = options.find((opt) => opt.value === value);

  // Lọc danh sách theo từ khoá tìm kiếm
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Khi chọn option
  const handleSelect = (option: Option) => {
    onChange(option.value);
    setQuery("");
    setIsOpen(false);
  };

  // Cập nhật text hiển thị dựa trên giá trị được chọn
  const displayText = selectedOption ? selectedOption.label : "";

  return (
    <div ref={comboboxRef} className={`relative w-full ${className}`}>
      {/* Nút hiển thị combobox */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm flex justify-between items-center"
      >
        <span
          className={`flex-1 ${!displayText ? "text-gray-400" : ""}`}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {displayText || placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 flex-shrink-0 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Thanh tìm kiếm nằm trong dropdown */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Danh sách option */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-red-100 ${
                    option.value === value ? "bg-red-50 font-medium" : ""
                  }`}
                  style={{
                    whiteSpace: "normal", // Cho phép xuống dòng
                    wordBreak: "break-word", // Ngắt từ nếu quá dài
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">Không tìm thấy</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComboboxSearch;
