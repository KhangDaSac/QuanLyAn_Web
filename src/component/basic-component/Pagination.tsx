import React from "react";
import ComboboxSearch, { type Option } from "./ComboboxSearch";

interface PaginationProps {
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;

  // Handlers
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange?: (sortBy: string) => void;

  // Options
  pageSizeOptions?: Option[];
  sortOptions?: Option[];
  currentSort?: string;

  // Customization
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
  showSortSelector?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  hasNext,
  hasPrevious,
  isFirst,
  isLast,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  pageSizeOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ],
  sortOptions = [],
  currentSort = "",
  showPageInfo = true,
  showPageSizeSelector = true,
  showSortSelector = false,
  className = "",
}) => {
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return; // Don't handle if user is typing in an input
      }

      switch (event.key) {
        case "ArrowLeft":
          if (!isFirst && currentPage > 1) {
            onPageChange(currentPage - 1);
          }
          break;
        case "ArrowRight":
          if (!isLast && currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
          }
          break;
        case "Home":
          if (!isFirst) {
            onPageChange(0);
          }
          break;
        case "End":
          if (!isLast) {
            onPageChange(totalPages - 1);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, isFirst, isLast, onPageChange]);

  const renderPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Tính toán để hiển thị 5 trang xung quanh trang hiện tại
      let startPage = Math.max(0, currentPage - 2);
      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

      // Điều chỉnh startPage nếu không đủ 5 trang ở cuối
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(0, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    // Nếu không có trang nào, hiển thị ít nhất trang 1
    if (pageNumbers.length === 0) {
      pageNumbers.push(0);
    }

    return pageNumbers.map((pageNum) => (
      <button
        key={pageNum}
        onClick={() => onPageChange(pageNum)}
        className={`min-w-[40px] px-3 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
          pageNum === currentPage
            ? "bg-red-600 text-white border-red-600 shadow-lg transform scale-105"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
        }`}
        title={`Trang ${pageNum + 1}`}>
        {pageNum + 1}
      </button>
    ));
  };

  if (totalPages <= 1 && !showPageSizeSelector && !showSortSelector) {
    return null; // Don't render if there's only one page and no other controls
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Page Size Selector */}
          {showPageSizeSelector && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Số bản ghi:
              </span>
              <ComboboxSearch
                options={pageSizeOptions}
                value={pageSize.toString()}
                onChange={(value) => onPageSizeChange(parseInt(value))}
                placeholder="Chọn số bản ghi"
                isSearch={false}
              />
            </div>
          )}

          {/* Sort Selector */}
          {showSortSelector && sortOptions.length > 0 && onSortChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Sắp xếp theo:
              </span>
              <ComboboxSearch
                options={sortOptions}
                value={currentSort}
                onChange={onSortChange}
                placeholder="Chọn cách sắp xếp"
                isSearch={false}
              />
            </div>
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-1">
              {/* First Page Button */}
              <button
                onClick={() => onPageChange(0)}
                disabled={isFirst}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:shadow-md"
                title="Trang đầu (Home)">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Previous Page Button */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:shadow-md"
                title="Trang trước (←)">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {renderPageNumbers()}

              {/* Next Page Button */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:shadow-md"
                title="Trang sau (→)">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Last Page Button */}
              <button
                onClick={() => onPageChange(totalPages - 1)}
                disabled={isLast}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 hover:border-red-300 transition-all duration-200 hover:shadow-md"
                title="Trang cuối (End)">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7m-8 0l7-7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
