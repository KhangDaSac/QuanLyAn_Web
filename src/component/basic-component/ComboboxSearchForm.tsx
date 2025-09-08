import React, { useState, useRef, useEffect } from "react";

export interface Option {
  value: string;
  label: string;
}

interface ComboboxSearchFormProps {
  options: Option[];
  value: string; // Giá trị được chọn hiện tại
  onChange: (value: string) => void; // Callback khi chọn option mới
  placeholder?: string;
  className?: string;
  forceDirection?: 'up' | 'down' | 'auto'; // Force hướng hiển thị
}

const ComboboxSearchForm: React.FC<ComboboxSearchFormProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  className = "",
  forceDirection = "auto",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const comboboxRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tìm option được chọn
  const selectedOption = options.find((opt) => opt.value === value);

  // Lọc danh sách theo từ khoá tìm kiếm
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  // Tính toán hướng hiển thị dropdown
  const calculateDropdownDirection = () => {
    // Nếu có force direction, dùng force direction
    if (forceDirection !== 'auto') {
      setDropdownDirection(forceDirection);
      return;
    }
    
    if (comboboxRef.current) {
      const rect = comboboxRef.current.getBoundingClientRect();
      const dropdownHeight = 240; // max-h-60 = 240px
      
      // Kiểm tra không gian trong viewport
      const viewportSpaceBelow = window.innerHeight - rect.bottom;
      const viewportSpaceAbove = rect.top;
      
      // Kiếm tra scrollable container cha
      let scrollableContainer = comboboxRef.current.parentElement;
      while (scrollableContainer) {
        const computedStyle = window.getComputedStyle(scrollableContainer);
        if (computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
          break;
        }
        scrollableContainer = scrollableContainer.parentElement;
      }
      
      if (scrollableContainer) {
        // Có scrollable container - ưu tiên hiển thị ở dưới
        const containerRect = scrollableContainer.getBoundingClientRect();
        const spaceInContainer = containerRect.bottom - rect.bottom;
        
        // Chỉ flip lên trên khi thực sự không đủ chỗ và có đủ chỗ ở trên
        if (spaceInContainer < 100 && viewportSpaceAbove > dropdownHeight) {
          setDropdownDirection('up');
        } else {
          setDropdownDirection('down');
        }
      } else {
        // Không có scrollable container - logic cũ
        if (viewportSpaceBelow < dropdownHeight && viewportSpaceAbove > viewportSpaceBelow) {
          setDropdownDirection('up');
        } else {
          setDropdownDirection('down');
        }
      }
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (comboboxRef.current && !comboboxRef.current.contains(target)) {
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

  // Xử lý mở/đóng dropdown
  const handleToggle = () => {
    if (!isOpen) {
      calculateDropdownDirection();
    }
    setIsOpen(!isOpen);
  };

  // Cập nhật text hiển thị dựa trên giá trị được chọn
  const displayText = selectedOption ? selectedOption.label : "";

  // Class cho dropdown dựa trên hướng
  const dropdownClasses = dropdownDirection === 'up' 
    ? "absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden z-50"
    : "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden z-50";

  return (
    <div ref={comboboxRef} className={`relative w-full ${className}`}>
      {/* Nút hiển thị combobox */}
      <div
        onClick={handleToggle}
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

      {/* Dropdown luôn ở dưới combobox hoặc trên tùy theo không gian */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={dropdownClasses}
        >
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

export default ComboboxSearchForm;
