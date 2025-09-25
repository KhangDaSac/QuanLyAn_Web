import { useState, useEffect } from 'react';
import TypeOfDecisionCard from '../component/type-of-decision-manager/TypeOfDecisionCard';
import TypeOfDecisionForm from '../component/type-of-decision-manager/TypeOfDecisionForm';
import ConfirmModal from '../component/basic-component/ConfirmModal';
import Pagination from '../component/basic-component/Pagination';
import { ToastContainer, useToast } from '../component/basic-component/Toast';
import { TypeOfDecisionService } from '../services/TypeOfDecisionService';
import { TypeOfLegalCaseService } from '../services/TypeOfLegalCaseService';
import type TypeOfDecisionResponse from '../types/response/type-of-decision/TypeOfDecisionResponse';
import type TypeOfDecisionSearchRequest from '../types/request/type-of-decision/TypeOfDecisionSearchRequest';
import type TypeOfDecisionRequest from '../types/request/type-of-decision/TypeOfDecisionRequest';
import ComboboxSearch, { type Option } from '../component/basic-component/ComboboxSearch';
import { CourtIssued } from '../types/enum/CourtIssued';

const TypeOfDecisionManager = () => {
  const [typeOfDecisions, setTypeOfDecisions] = useState<TypeOfDecisionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [typeOfDecisionSearch, setTypeOfDecisionSearch] = useState<TypeOfDecisionSearchRequest>({
    typeOfDecisionId: null,
    typeOfDecisionName: null,
    typeOfLegalCaseId: null,
    courtIssued: null,
    theEndDecision: null
  });

  const [typeOfLegalCaseOptions, setTypeOfLegalCaseOptions] = useState<Option[]>([]);
  
  const courtIssuedOptions: Option[] = [
    { value: '', label: 'Tất cả cấp tòa' },
    { value: CourtIssued.CURRENT_COURT, label: 'Tòa án hiện tại' },
    { value: CourtIssued.SUPERIOR_COURT, label: 'Tòa án cấp trên' }
  ];

  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTypeOfDecision, setSelectedTypeOfDecision] = useState<TypeOfDecisionResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const toast = useToast();

  // Pagination state - using server-side pagination like LegalCaseManager
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
  const [sortBy, setSortBy] = useState("typeOfDecisionId");

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
    { value: "typeOfDecisionId", label: "Mã loại quyết định" },
    { value: "typeOfDecisionName", label: "Tên loại quyết định" },
    { value: "courtIssued", label: "Cấp tòa" },
    { value: "theEndDecision", label: "Quyết định kết thúc" },
  ];

  useEffect(() => {
    loadTypeOfDecisions();
    loadTypeOfLegalCases();
  }, []);

  const loadTypeOfDecisions = async (
    page: number = 0, 
    size: number = 10, 
    sort: string = "typeOfDecisionId",
    searchRequest?: TypeOfDecisionSearchRequest
  ) => {
    setLoading(true);
    try {
      // Use provided search request or empty object for initial load
      const requestToUse = searchRequest || {
        typeOfDecisionId: null,
        typeOfDecisionName: null,
        typeOfLegalCaseId: null,
        courtIssued: null,
        theEndDecision: null
      };
      
      const response = await TypeOfDecisionService.search(
        requestToUse,
        page,
        size,
        sort
      );
      if (response.success && response.data) {
        setTypeOfDecisions(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalElements: response.data.totalElements || response.data.numberOfElement,
          totalPages: response.data.totalPages || Math.ceil((response.data.totalElements || response.data.numberOfElement) / response.data.size),
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
          isFirst: response.data.isFirst,
          isLast: response.data.isLast,
        });
      } else {
        toast.error('Lỗi', 'Không thể tải danh sách loại quyết định');
      }
    } catch (error) {
      console.error('Error loading type of decisions:', error);
      toast.error('Lỗi', 'Không thể tải danh sách loại quyết định');
    } finally {
      setLoading(false);
    }
  };

  const loadTypeOfLegalCases = async () => {
    try {
      const response = await TypeOfLegalCaseService.getAll();
      if (response.success && response.data) {
        const options: Option[] = response.data.map(item => ({
          value: item.typeOfLegalCaseId,
          label: item.typeOfLegalCaseName
        }));
        setTypeOfLegalCaseOptions([{ value: '', label: 'Tất cả loại án' }, ...options]);
      }
    } catch (error) {
      console.error('Error loading type of legal cases:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchRequest: TypeOfDecisionSearchRequest = {
        ...typeOfDecisionSearch,
        typeOfDecisionId: typeOfDecisionSearch.typeOfDecisionId || null,
        typeOfDecisionName: typeOfDecisionSearch.typeOfDecisionName || null,
        typeOfLegalCaseId: typeOfDecisionSearch.typeOfLegalCaseId || null,
        courtIssued: typeOfDecisionSearch.courtIssued || null
      };

      await loadTypeOfDecisions(0, pagination.size, sortBy, searchRequest);
    } catch (error) {
      console.error('Error searching type of decisions:', error);
      toast.error('Lỗi', 'Không thể tìm kiếm loại quyết định');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const clearedSearch = {
      typeOfDecisionId: null,
      typeOfDecisionName: null,
      typeOfLegalCaseId: null,
      courtIssued: null,
      theEndDecision: null
    };
    setTypeOfDecisionSearch(clearedSearch);
    loadTypeOfDecisions(0, pagination.size, sortBy, clearedSearch);
  };

  const handleCreate = () => {
    setSelectedTypeOfDecision(null);
    setShowCreateForm(true);
  };

  const handleEdit = (typeOfDecision: TypeOfDecisionResponse) => {
    setSelectedTypeOfDecision(typeOfDecision);
    setShowEditForm(true);
  };

  const handleDelete = (typeOfDecision: TypeOfDecisionResponse) => {
    setSelectedTypeOfDecision(typeOfDecision);
    setShowConfirmModal(true);
  };

  const handleFormSubmit = async (data: TypeOfDecisionRequest) => {
    try {
      setFormLoading(true);
      
      if (selectedTypeOfDecision) {
        // Update
        const response = await TypeOfDecisionService.update(selectedTypeOfDecision.typeOfDecisionId, data);
        if (response.success) {
          toast.success('Cập nhật thành công', 'Loại quyết định đã được cập nhật!');
          setShowEditForm(false);
          await loadTypeOfDecisions(pagination.page, pagination.size, sortBy, typeOfDecisionSearch);
        } else {
          toast.error('Cập nhật thất bại', response.error || 'Có lỗi xảy ra khi cập nhật loại quyết định');
        }
      } else {
        // Create
        const response = await TypeOfDecisionService.create(data);
        if (response.success) {
          toast.success('Tạo thành công', 'Loại quyết định mới đã được tạo!');
          setShowCreateForm(false);
          await loadTypeOfDecisions(pagination.page, pagination.size, sortBy, typeOfDecisionSearch);
        } else {
          toast.error('Tạo thất bại', response.error || 'Có lỗi xảy ra khi tạo loại quyết định');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra', 'Không thể lưu thông tin loại quyết định');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTypeOfDecision) return;

    try {
      const response = await TypeOfDecisionService.delete(selectedTypeOfDecision.typeOfDecisionId);
      if (response.success) {
        toast.success('Xóa thành công', 'Loại quyết định đã được xóa khỏi hệ thống!');
        await loadTypeOfDecisions(pagination.page, pagination.size, sortBy, typeOfDecisionSearch);
      } else {
        toast.error('Xóa thất bại', response.error || 'Có lỗi xảy ra khi xóa loại quyết định');
      }
    } catch (error) {
      console.error('Error deleting type of decision:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa loại quyết định');
    }
    setShowConfirmModal(false);
    setSelectedTypeOfDecision(null);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    loadTypeOfDecisions(page, pagination.size, sortBy, typeOfDecisionSearch);
  };

  const handlePageSizeChange = (size: number) => {
    loadTypeOfDecisions(0, size, sortBy, typeOfDecisionSearch);
  };

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    loadTypeOfDecisions(0, pagination.size, newSortBy, typeOfDecisionSearch);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý loại quyết định</h1>
          <p className="text-gray-600 mt-1">
            Tìm thấy {pagination.totalElements} loại quyết định
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ lọc
          </button>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã loại quyết định
              </label>
              <input
                type="text"
                value={typeOfDecisionSearch.typeOfDecisionId || ''}
                onChange={(e) => setTypeOfDecisionSearch(prev => ({ ...prev, typeOfDecisionId: e.target.value || null }))}
                placeholder="Nhập mã loại quyết định"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên loại quyết định
              </label>
              <input
                type="text"
                value={typeOfDecisionSearch.typeOfDecisionName || ''}
                onChange={(e) => setTypeOfDecisionSearch(prev => ({ ...prev, typeOfDecisionName: e.target.value || null }))}
                placeholder="Nhập tên loại quyết định"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại án
              </label>
              <ComboboxSearch
                options={typeOfLegalCaseOptions}
                value={typeOfDecisionSearch.typeOfLegalCaseId || ''}
                onChange={(value) => setTypeOfDecisionSearch(prev => ({ ...prev, typeOfLegalCaseId: value || null }))}
                placeholder="Chọn loại án"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp tòa
              </label>
              <ComboboxSearch
                options={courtIssuedOptions}
                value={typeOfDecisionSearch.courtIssued || ''}
                onChange={(value) => setTypeOfDecisionSearch(prev => ({ ...prev, courtIssued: value as CourtIssued || null }))}
                placeholder="Chọn cấp tòa"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={typeOfDecisionSearch.theEndDecision || false}
                  onChange={(e) => setTypeOfDecisionSearch(prev => ({ ...prev, theEndDecision: e.target.checked }))}
                  className="w-4 h-4 bg-gray-100 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Quyết định kết thúc</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đặt lại
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      )}

      {/* Pagination Component - Top */}
      {!loading && typeOfDecisions.length > 0 && (
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

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : typeOfDecisions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy loại quyết định nào</h3>
          <p className="text-gray-600 mb-4">Không có loại quyết định nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeOfDecisions.map((typeOfDecision) => (
              <TypeOfDecisionCard
                key={typeOfDecision.typeOfDecisionId}
                typeOfDecision={typeOfDecision}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <TypeOfDecisionForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleFormSubmit}
        typeOfLegalCaseOptions={typeOfLegalCaseOptions}
        isLoading={formLoading}
      />

      <TypeOfDecisionForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleFormSubmit}
        typeOfDecision={selectedTypeOfDecision}
        typeOfLegalCaseOptions={typeOfLegalCaseOptions}
        isLoading={formLoading}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa loại quyết định"
        message={`Bạn có chắc chắn muốn xóa loại quyết định "${selectedTypeOfDecision?.typeOfDecisionName}"? Hành động này không thể hoàn tác.`}
        type="danger"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default TypeOfDecisionManager;