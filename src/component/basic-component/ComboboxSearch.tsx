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
  isSearch?: boolean; // Hiển thị thanh tìm kiếm, mặc định là true
}

const ComboboxSearch: React.FC<ComboboxSearchProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  className = "",
  isSearch = true, // Mặc định là true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Tìm option được chọn
  const selectedOption = options.find((opt) => opt.value === value);

  // Lọc danh sách theo từ khoá tìm kiếm - chỉ khi isSearch = true
  const filteredOptions = isSearch 
    ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
    : options;

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
        className="w-full px-3 border border-gray-300 rounded-lg bg-white cursor-pointer focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm flex justify-between items-center"
        style={{
          height: "40px", // Chiều cao cố định thay vì minHeight
          minWidth: "120px", // Đảm bảo chiều rộng tối thiểu
        }}
      >
        <span
          className={`flex-1 ${!displayText ? "text-gray-400" : ""}`}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "24px", // Line height cố định để text luôn căn giữa
            height: "24px", // Chiều cao cố định cho text
            display: "flex",
            alignItems: "center",
          }}
        >
          {displayText || placeholder}
        </span>
        <svg
          className="w-4 h-4 ml-2 flex-shrink-0 transform transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            minWidth: "16px", // Đảm bảo icon không bị co lại
            minHeight: "16px",
          }}
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
          {/* Thanh tìm kiếm nằm trong dropdown - chỉ hiển thị khi isSearch = true */}
          {isSearch && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full px-3 border border-gray-300 rounded-lg outline-none text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                style={{
                  height: "32px", // Chiều cao cố định thay vì minHeight
                }}
              />
            </div>
          )}

          {/* Danh sách option */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`px-3 text-sm cursor-pointer hover:bg-red-100 transition-colors ${
                    option.value === value ? "bg-red-50 font-medium" : ""
                  }`}
                  style={{
                    whiteSpace: "normal", // Cho phép xuống dòng
                    wordBreak: "break-word", // Ngắt từ nếu quá dài
                    height: "36px", // Chiều cao cố định thay vì minHeight
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 text-sm text-gray-500" style={{ height: "36px", display: "flex", alignItems: "center" }}>
                Không tìm thấy
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComboboxSearch;