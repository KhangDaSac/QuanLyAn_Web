import { useState, useEffect } from "react";
import BatchCard from "../component/batch-manager/BatchCard";
import BatchForm from "../component/batch-manager/BatchForm";
import ConfirmModal from "../component/basic-component/ConfirmModal";
import Pagination from "../component/basic-component/Pagination";
import type { Option } from "../component/basic-component/ComboboxSearch";
import { ToastContainer, useToast } from "../component/basic-component/Toast";
import { BatchService } from "../services/BatchService";
import type { BatchResponse } from "../types/response/batch/BatchResponse";
import type BatchSearchRequest from "../types/request/batch/BatchSearchRequest";
import type { BatchRequest } from "../types/request/batch/BatchRequest";
import { useAuth } from "../context/authContext/useAuth";
import { Permission } from "../utils/authUtils";

const BatchManagement = () => {
  // Helper function to clean search criteria
  const cleanSearchCriteria = (criteria: BatchSearchRequest): BatchSearchRequest => {
    return {
      batchId: criteria.batchId?.trim() || null,
      batchName: criteria.batchName?.trim() || null,
      note: criteria.note?.trim() || null,
      startStorageDate: criteria.startStorageDate ? criteria.startStorageDate + ' 00:00:00' : null,
      endStorageDate: criteria.endStorageDate ? criteria.endStorageDate + ' 23:59:59' : null,
    }
  };

  const auth = useAuth();
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    isFirst: true,
    isLast: false,
  });

  // Separate state for sort criteria
  const [sortBy, setSortBy] = useState("batchId");

  // Page size options
  const pageSizeOptions: Option[] = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  // Sort by options
  const sortByOptions: Option[] = [
    { value: "batchId", label: "Mã đợt nhập" },
    { value: "batchName", label: "Tên đợt nhập" },
    { value: "storageDate", label: "Ngày tạo" },
  ];

  const [batchSearch, setBatchSearch] = useState<BatchSearchRequest>({
    batchId: null,
    batchName: null,
    note: null,
    startStorageDate: null,
    endStorageDate: null
  });

  // States for form modal
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Toast và Confirm Modal
  const toast = useToast();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "warning" | "danger" | "info" | "success";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
  });

  useEffect(() => {
    const initialSearch = async () => {
      setLoading(true);
      try {
        try {
          const { data } = await BatchService.searchWithPagination(
            batchSearch,
            pagination.page,
            pagination.size,
            sortBy
          );
          if (data) {
            setBatches(data.content);
            setPagination({
              page: data.number,
              size: data.size,
              totalElements: data.totalElements || data.numberOfElement,
              totalPages:
                data.totalPages ||
                Math.ceil((data.totalElements || data.numberOfElement) / data.size),
              hasNext: data.hasNext,
              hasPrevious: data.hasPrevious,
              isFirst: data.isFirst,
              isLast: data.isLast,
            });
          }
        } catch (paginationError) {
          const { data } = await BatchService.search(batchSearch);
          if (data) {
            setBatches(data);
            setPagination({
              page: 0,
              size: data.length,
              totalElements: data.length,
              totalPages: 1,
              hasNext: false,
              hasPrevious: false,
              isFirst: true,
              isLast: true,
            });
          }
        }
      } catch (error) {
        console.error("Error searching batches:", error);
      } finally {
        setLoading(false);
      }
    };

    initialSearch();
  }, []);

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (pagination.hasPrevious) {
            handlePageChange(pagination.page - 1);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (pagination.hasNext) {
            handlePageChange(pagination.page + 1);
          }
          break;
        case "Home":
          event.preventDefault();
          if (!pagination.isFirst) {
            handlePageChange(0);
          }
          break;
        case "End":
          event.preventDefault();
          if (!pagination.isLast) {
            handlePageChange(pagination.totalPages - 1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    pagination.page,
    pagination.hasNext,
    pagination.hasPrevious,
    pagination.isFirst,
    pagination.isLast,
    pagination.totalElements,
    pagination.size,
  ]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const cleanedCriteria = cleanSearchCriteria(batchSearch);
      // Try pagination first, fallback to regular search if pagination not supported
      try {
        const { data } = await BatchService.searchWithPagination(
          cleanedCriteria,
          0,
          pagination.size,
          sortBy
        );
        if (data) {
          setBatches(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement,
            totalPages:
              data.totalPages ||
              Math.ceil((data.totalElements || data.numberOfElement) / data.size),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (paginationError) {
        const response = await BatchService.search(cleanedCriteria);
        if (response.success && response.data) {
          setBatches(response.data);
          setPagination({
            page: 0,
            size: response.data.length,
            totalElements: response.data.length,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
            isFirst: true,
            isLast: true,
          });
        } else {
          toast.error("Lỗi", "Không thể tìm kiếm đợt nhập án");
        }
      }
    } catch (error) {
      console.error("Error searching batches:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    const clearedSearch = {
      batchId: null,
      batchName: null,
      note: null,
      startStorageDate: null,
      endStorageDate: null
    };
    setBatchSearch(clearedSearch);
    setPagination((prev) => ({ ...prev, page: 0 }));
    const searchWithCleared = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(clearedSearch);
        try {
          const { data } = await BatchService.searchWithPagination(
            cleanedCriteria,
            0,
            pagination.size,
            sortBy
          );
          if (data) {
            setBatches(data.content);
            setPagination({
              page: data.number,
              size: data.size,
              totalElements: data.totalElements || data.numberOfElement,
              totalPages:
                data.totalPages ||
                Math.ceil((data.totalElements || data.numberOfElement) / data.size),
              hasNext: data.hasNext,
              hasPrevious: data.hasPrevious,
              isFirst: data.isFirst,
              isLast: data.isLast,
            });
          }
        } catch (paginationError) {
          // If pagination fails, fallback to regular search
          console.log("Pagination not supported, using regular search");
          const response = await BatchService.search(cleanedCriteria);
          if (response.success && response.data) {
            setBatches(response.data);
            setPagination({
              page: 0,
              size: response.data.length,
              totalElements: response.data.length,
              totalPages: 1,
              hasNext: false,
              hasPrevious: false,
              isFirst: true,
              isLast: true,
            });
          }
        }
      } catch (error) {
        console.error("Error searching batches:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithCleared();
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    const searchWithNewPage = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(batchSearch);
        try {
          const { data } = await BatchService.searchWithPagination(
            cleanedCriteria,
            page,
            pagination.size,
            sortBy
          );
          if (data) {
            setBatches(data.content);
            setPagination({
              page: data.number,
              size: data.size,
              totalElements: data.totalElements || data.numberOfElement,
              totalPages:
                data.totalPages ||
                Math.ceil((data.totalElements || data.numberOfElement) / data.size),
              hasNext: data.hasNext,
              hasPrevious: data.hasPrevious,
              isFirst: data.isFirst,
              isLast: data.isLast,
            });
          }
        } catch (paginationError) {
          // If pagination fails, just use current data
          console.log("Pagination not supported, cannot change page");
          toast.error("Lỗi", "Chức năng phân trang chưa được hỗ trợ");
        }
      } catch (error) {
        console.error("Error searching batches:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewPage();
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, page: 0, size }));
    // Perform search with new page size
    const searchWithNewSize = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(batchSearch);
        // Try pagination first, fallback to regular search if pagination not supported
        try {
          const { data } = await BatchService.searchWithPagination(
            cleanedCriteria,
            0,
            size,
            sortBy
          );
          if (data) {
            setBatches(data.content);
            setPagination({
              page: data.number,
              size: data.size,
              totalElements: data.totalElements || data.numberOfElement,
              totalPages:
                data.totalPages ||
                Math.ceil((data.totalElements || data.numberOfElement) / data.size),
              hasNext: data.hasNext,
              hasPrevious: data.hasPrevious,
              isFirst: data.isFirst,
              isLast: data.isLast,
            });
          }
        } catch (paginationError) {
          // If pagination fails, just use current data
          console.log("Pagination not supported, cannot change page size");
          toast.error("Lỗi", "Chức năng phân trang chưa được hỗ trợ");
        }
      } catch (error) {
        console.error("Error searching batches:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewSize();
  };

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPagination((prev) => ({ ...prev, page: 0 }));
    const searchWithNewSort = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(batchSearch);
        // Try pagination first, fallback to regular search if pagination not supported
        try {
          const { data } = await BatchService.searchWithPagination(
            cleanedCriteria,
            0,
            pagination.size,
            newSortBy
          );
          if (data) {
            setBatches(data.content);
            setPagination({
              page: data.number,
              size: data.size,
              totalElements: data.totalElements || data.numberOfElement,
              totalPages:
                data.totalPages ||
                Math.ceil((data.totalElements || data.numberOfElement) / data.size),
              hasNext: data.hasNext,
              hasPrevious: data.hasPrevious,
              isFirst: data.isFirst,
              isLast: data.isLast,
            });
          }
        } catch (paginationError) {
          // If pagination fails, just use current data
          console.log("Pagination not supported, cannot change sort");
          toast.error("Lỗi", "Chức năng sắp xếp chưa được hỗ trợ");
        }
      } catch (error) {
        console.error("Error searching batches:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewSort();
  };

  const handleEdit = (batch: BatchResponse) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDelete = (batchId: string) => {
    const batch = batches.find(b => b.batchId === batchId);
    if (!batch) return;

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa đợt nhập án',
      message: `Bạn có chắc chắn muốn xóa đợt nhập án "${batch.batchName}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => confirmDelete(batchId),
    });
  };

  const confirmDelete = async (batchId: string) => {
    try {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      setLoading(true);
      const response = await BatchService.delete(batchId);
      if (response.success) {
        setBatches(prev => prev.filter(b => b.batchId !== batchId));
        toast.success('Xóa thành công', 'Đợt nhập án đã được xóa khỏi hệ thống!');
        // Update pagination count
        setPagination(prev => ({ 
          ...prev, 
          totalElements: Math.max(0, prev.totalElements - 1)
        }));
      } else {
        toast.error('Xóa thất bại', response.error || 'Có lỗi xảy ra khi xóa đợt nhập án');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa đợt nhập án. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: BatchRequest) => {
    try {
      setFormLoading(true);

      if (editingBatch) {
        // Cập nhật đợt nhập án
        const response = await BatchService.update(editingBatch.batchId, data);
        if (response.success) {
          toast.success("Cập nhật thành công", "Đợt nhập án đã được cập nhật thành công!");
        } else {
          toast.error("Cập nhật thất bại", response.error || "Có lỗi xảy ra khi cập nhật đợt nhập án");
          return;
        }
      } else {
        // Thêm đợt nhập án mới
        const response = await BatchService.create(data);
        if (response.success) {
          toast.success("Thêm mới thành công", "Đợt nhập án mới đã được thêm vào hệ thống!");
        } else {
          toast.error("Thêm mới thất bại", response.error || "Có lỗi xảy ra khi thêm đợt nhập án");
          return;
        }
      }

      // Load lại danh sách sau khi thêm/sửa thành công
      await handleSearch();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving batch:", error);
      toast.error(
        "Có lỗi xảy ra",
        "Không thể lưu thông tin đợt nhập án. Vui lòng thử lại!"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleAddNew = () => {
    setEditingBatch(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Quản lý đợt nhập án
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Quản lý các đợt nhập án trong hệ thống ({pagination.totalElements > 0 ? pagination.totalElements : batches.length} đợt nhập)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            Bộ lọc
          </button>
          {auth?.hasPermission(Permission.MANAGE_CASE_DATA) && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm đợt nhập
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bộ lọc tìm kiếm
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ID đợt nhập */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID đợt nhập
              </label>
              <input
                type="text"
                value={batchSearch.batchId || ""}
                onChange={(e) =>
                  setBatchSearch((prev) => ({
                    ...prev,
                    batchId: e.target.value || null,
                  }))
                }
                placeholder="Nhập ID đợt nhập"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Tên đợt nhập */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đợt nhập
              </label>
              <input
                type="text"
                value={batchSearch.batchName || ""}
                onChange={(e) =>
                  setBatchSearch((prev) => ({
                    ...prev,
                    batchName: e.target.value || null,
                  }))
                }
                placeholder="Nhập tên đợt nhập"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <input
                type="text"
                value={batchSearch.note || ""}
                onChange={(e) =>
                  setBatchSearch((prev) => ({
                    ...prev,
                    note: e.target.value || null,
                  }))
                }
                placeholder="Nhập ghi chú"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Ngày tạo từ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tạo từ
              </label>
              <input
                type="date"
                value={batchSearch.startStorageDate || ""}
                onChange={(e) =>
                  setBatchSearch((prev) => ({
                    ...prev,
                    startStorageDate: e.target.value || null,
                  }))
                }
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Ngày tạo đến */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tạo đến
              </label>
              <input
                type="date"
                value={batchSearch.endStorageDate || ""}
                onChange={(e) =>
                  setBatchSearch((prev) => ({
                    ...prev,
                    endStorageDate: e.target.value || null,
                  }))
                }
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 md:px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50">
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Tìm kiếm</span>
              </span>
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 md:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Pagination Component */}
      {!loading && batches.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.size}
          hasNext={pagination.hasNext}
          hasPrevious={pagination.hasPrevious}
          isFirst={pagination.isFirst}
          isLast={pagination.isLast}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortByChange}
          pageSizeOptions={pageSizeOptions}
          sortOptions={sortByOptions}
          currentSort={sortBy}
          showPageInfo={true}
          showPageSizeSelector={true}
          showSortSelector={true}
          className="mb-6"
        />
      )}

      {/* Batch List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {batches.map((batch) => (
            <BatchCard
              key={batch.batchId}
              batch={batch}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && batches.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <svg
            className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            Không có đợt nhập nào
          </h3>
          <p className="text-sm md:text-base text-gray-600 px-4">
            Hiện tại chưa có đợt nhập nào trong hệ thống hoặc không có kết quả tìm
            kiếm phù hợp.
          </p>
        </div>
      )}

      {/* Form Modal */}
      <BatchForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        batch={editingBatch}
        isLoading={formLoading}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default BatchManagement;