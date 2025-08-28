import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const comboboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tìm option được chọn
  const selectedOption = options.find((opt) => opt.value === value);

  // Lọc danh sách theo từ khoá tìm kiếm
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  // Tính toán vị trí dropdown
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Kiểm tra xem click có phải trong combobox button hoặc dropdown không
      const isClickInButton = comboboxRef.current && comboboxRef.current.contains(target);
      const isClickInDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      
      if (!isClickInButton && !isClickInDropdown) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cập nhật vị trí khi mở dropdown
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen]);

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
        ref={buttonRef}
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

      {/* Dropdown sử dụng Portal */}
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden z-[10000]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Thanh tìm kiếm nằm trong dropdown */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* Danh sách option */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option);
                  }}
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default ComboboxSearch;
