import { useState, useEffect } from "react";
import { type LegalRelationshipResponse } from "../../types/response/legal-relationship/LegalRelationshipResponse";
import { type LegalRelationshipRequest } from "../../types/request/legal-relationship/LegalRelationshipRequest";
import { type LegalRelationshipSearchRequest } from "../../types/request/legal-relationship/LegalRelationshipSearchRequest";
import { type LegalRelationshipGroupResponse } from "../../types/response/legal-relationship-group/LegalRelationshipGroupResponse";
import { type TypeOfLegalCaseResponse } from "../../types/response/type-of-legal-case/TypeOfLegalCaseResponse";
import { LegalRelationshipService } from "../../services/LegalRelationshipService";
import { TypeOfLegalCaseService } from "../../services/TypeOfLegalCaseService";
import { LegalRelationshipGroupService } from "../../services/LegalRelationshipGroupService";
import LegalRelationshipForm from "./LegalRelationshipForm";
import LegalRelationshipCard from "./LegalRelationshipCard";
import { useToast, ToastContainer } from "../basic-component/Toast";
import ConfirmModal from "../basic-component/ConfirmModal";
import ComboboxSearch, { type Option } from "../basic-component/ComboboxSearch";

const LegalRelationshipTab = () => {
  const [relationships, setRelationships] = useState<
    LegalRelationshipResponse[]
  >([]);
  const [typeOfLegalCases, setTypeOfLegalCases] = useState<
    TypeOfLegalCaseResponse[]
  >([]);
  const [groups, setGroups] = useState<LegalRelationshipGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<LegalRelationshipResponse | null>(null);
  const [searchCriteria, setSearchCriteria] =
    useState<LegalRelationshipSearchRequest>({});
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
  const [sortBy, setSortBy] = useState("legalRelationshipName");

  // Page size options
  const pageSizeOptions: Option[] = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  // Sort by options
  const sortByOptions: Option[] = [
    { value: "legalRelationshipName", label: "Tên quan hệ pháp luật" },
    { value: "legalRelationshipId", label: "Mã quan hệ pháp luật" },
  ];

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
    loadData();
  }, []);

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    pagination.totalPages,
  ]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTypeOfLegalCases(),
        loadGroups(),
      ]);
      handleSearch();
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Lỗi", "Lỗi khi tải dữ liệu");
    }
  };

  const loadTypeOfLegalCases = async () => {
    try {
      const response = await TypeOfLegalCaseService.top50();
      if (response.success && response.data) {
        setTypeOfLegalCases(response.data);
      } else {
        setTypeOfLegalCases([]);
      }
    } catch (error) {
      console.error("Error loading type of legal cases:", error);
      setTypeOfLegalCases([]);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await LegalRelationshipGroupService.getAll();
      if (response.success && response.data) {
        setGroups(response.data);
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error("Error loading groups:", error);
      setGroups([]);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await LegalRelationshipService.search(
        searchCriteria,
        pagination.page,
        pagination.size,
        sortBy
      );
      if (data) {
        setRelationships(data.content);
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
    } catch (error) {
      console.error("Error searching legal relationships:", error);
      toast.error("Lỗi", "Lỗi khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    const searchWithNewPage = async () => {
      setLoading(true);
      try {
        const { data } = await LegalRelationshipService.search(
          searchCriteria,
          page,
          pagination.size,
          sortBy
        );
        if (data) {
          setRelationships(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement,
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal relationships:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewPage();
  };

  const handlePageSizeChange = (size: string) => {
    const newSize = parseInt(size);
    setPagination((prev) => ({ ...prev, page: 0, size: newSize }));
    const searchWithNewSize = async () => {
      setLoading(true);
      try {
        const { data } = await LegalRelationshipService.search(
          searchCriteria,
          0,
          newSize,
          sortBy
        );
        if (data) {
          setRelationships(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement,
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal relationships:", error);
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
        const { data } = await LegalRelationshipService.search(
          searchCriteria,
          0,
          pagination.size,
          newSortBy
        );
        if (data) {
          setRelationships(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement,
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal relationships:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewSort();
  };

  const handleSubmit = async (data: LegalRelationshipRequest) => {
    try {
      console.log('Submitting data:', data);
      console.log('Is editing:', !!editingItem);
      
      if (editingItem) {
        console.log('Updating with ID:', editingItem.legalRelationshipId);
        const result = await LegalRelationshipService.update(
          editingItem.legalRelationshipId,
          data
        );
        if (result.success) {
          toast.success("Thành công", "Cập nhật quan hệ pháp luật thành công");
        } else {
          toast.error("Thất bại", `${result.error}`);
        }
      } else {
        console.log('Creating new legal relationship');
        const result = await LegalRelationshipService.create(data);
        console.log('Create result:', result);
        if (result.success) {
          toast.success("Thành công", "Thêm mới quan hệ pháp luật thành công");
        } else {
          toast.error("Thất bại", `${result.error}`);
        }
      }
      setShowForm(false);
      setEditingItem(null);
      handleSearch();
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Lỗi", "Có lỗi xảy ra");
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const resetSearch = () => {
    setSearchCriteria({});
    setPagination((prev) => ({ ...prev, page: 0 }));
    const performSearch = async () => {
      setLoading(true);
      try {
        const { data } = await LegalRelationshipService.search(
          {},
          0,
          pagination.size,
          sortBy
        );
        if (data) {
          setRelationships(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement,
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal relationships:", error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  };

  const handleEdit = (item: LegalRelationshipResponse) => {
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận chỉnh sửa",
      message: `Bạn có muốn chỉnh sửa quan hệ pháp luật "${item.legalRelationshipName}"?`,
      type: "danger",
      onConfirm: () => confirmEdit(item),
    });
  };

  const handleDelete = (id: string) => {
    const item = relationships.find((item) => item.legalRelationshipId === id);
    if (!item) return;

    setConfirmModal({
      isOpen: true,
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn xóa quan hệ pháp luật "${item.legalRelationshipName}"? Hành động này không thể hoàn tác.`,
      type: "danger",
      onConfirm: () => confirmDelete(item.legalRelationshipId),
    });
  };

  const confirmDelete = async (id: string) => {
    try {
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      setLoading(true);
      const result = await LegalRelationshipService.delete(id);
      if (result.success) {
        toast.success("Xóa thành công", "Quan hệ pháp luật đã được xóa!");
        handleSearch();
      } else {
        toast.error("Xóa thất bại", `${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi xóa");
    } finally {
      setLoading(false);
    }
  };

  const confirmEdit = (item: LegalRelationshipResponse) => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    setEditingItem(item);
    setShowForm(true);
    toast.info(
      "Bắt đầu chỉnh sửa",
      `Đang mở form chỉnh sửa quan hệ pháp luật "${item.legalRelationshipName}"`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <LegalRelationshipForm
        isOpen={showForm}
        initialData={editingItem}
        typeOfLegalCases={typeOfLegalCases}
        groups={groups}
        onSubmit={handleSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        isLoading={loading}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách quan hệ pháp luật
              </h2>
              <p className="text-sm text-gray-600 mt-1">Quản lý các quan hệ pháp luật trong hệ thống</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                  showFilters
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Bộ lọc
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-medium rounded-lg">
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
                Thêm
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên quan hệ pháp luật</label>
                  <input
                    type="text"
                    value={searchCriteria.legalRelationshipName || ''}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, legalRelationshipName: e.target.value }))}
                    placeholder="Nhập tên quan hệ pháp luật"
                    className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại vụ án</label>
                  <ComboboxSearch
                    options={typeOfLegalCases.map(type => ({ value: type.typeOfLegalCaseId, label: type.typeOfLegalCaseName }))}
                    value={searchCriteria.typeOfLegalCaseId || ''}
                    onChange={(value) => setSearchCriteria(prev => ({ ...prev, typeOfLegalCaseId: value }))}
                    placeholder="Chọn loại vụ án"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm quan hệ pháp luật</label>
                  <ComboboxSearch
                    options={groups.map(g => ({ value: g.legalRelationshipGroupId, label: g.legalRelationshipGroupName }))}
                    value={searchCriteria.legalRelationshipGroupId || ''}
                    onChange={(value) => setSearchCriteria(prev => ({ ...prev, legalRelationshipGroupId: value }))}
                    placeholder="Nhóm quan hệ pháp luật"
                  />
                </div>
                <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                  <button
                    onClick={handleSearch}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Tìm kiếm
                  </button>
                  <button
                    onClick={resetSearch}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Đặt lại
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Page Size and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-10 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Hiển thị:
                  </label>
                  <ComboboxSearch
                    options={pageSizeOptions}
                    value={pagination.size.toString()}
                    onChange={handlePageSizeChange}
                    placeholder="Chọn số lượng"
                    className="w-24"
                    isSearch={false}
                  />
                  <span className="text-sm text-gray-500">mục/trang</span>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Sắp xếp theo:
                  </label>
                  <ComboboxSearch
                    options={sortByOptions}
                    value={sortBy}
                    onChange={handleSortByChange}
                    placeholder="Chọn tiêu chí sắp xếp"
                    className="w-48"
                    isSearch={false}
                  />
                </div>
              </div>

              {/* Pagination Info and Navigation */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center space-x-1">
                  {/* Nút trang đầu */}
                  <button
                    onClick={() => handlePageChange(0)}
                    disabled={pagination.isFirst}
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
                        d="M11 19l-7-7 7-7M21 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* Nút trang trước */}
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevious}
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

                  {/* Dãy số trang */}
                  {(() => {
                    const totalPages = pagination.totalPages;
                    const currentPage = pagination.page;

                    const maxPagesToShow = 5;
                    const pageNumbers = [];

                    if (totalPages <= maxPagesToShow) {
                      for (let i = 0; i < totalPages; i++) {
                        pageNumbers.push(i);
                      }
                    } else {
                      let startPage = Math.max(0, currentPage - 2);
                      let endPage = Math.min(
                        totalPages - 1,
                        startPage + maxPagesToShow - 1
                      );

                      if (endPage - startPage < maxPagesToShow - 1) {
                        startPage = Math.max(0, endPage - maxPagesToShow + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pageNumbers.push(i);
                      }
                    }

                    if (pageNumbers.length === 0) {
                      pageNumbers.push(0);
                    }

                    return pageNumbers.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[40px] px-3 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
                          pageNum === currentPage
                            ? "bg-red-600 text-white border-red-600 shadow-lg transform scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                        }`}
                        title={`Trang ${pageNum + 1}`}>
                        {pageNum + 1}
                      </button>
                    ));
                  })()}

                  {/* Nút trang sau */}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
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

                  {/* Nút trang cuối */}
                  <button
                    onClick={() => handlePageChange(pagination.totalPages - 1)}
                    disabled={pagination.isLast}
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
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Kết quả ({relationships.length} quan hệ pháp luật)
              </h3>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm mới
              </button>
            </div>

            {relationships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relationships.map((item) => (
                  <LegalRelationshipCard
                    key={item.legalRelationshipId}
                    relationship={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
                    <p className="text-sm text-gray-500 mt-1">Không tìm thấy quan hệ pháp luật nào phù hợp với tiêu chí tìm kiếm.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

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
    </div>
  );
};

export default LegalRelationshipTab;
