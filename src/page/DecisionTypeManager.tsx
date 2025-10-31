import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TypeOfDecisionCard from '../component/decision-type-manager/DecisionTypeCard';
import DecisionTypeForm from '../component/decision-type-manager/DecisionTypeForm';
import ConfirmModal from '../component/basic-component/ConfirmModal';
import Pagination from '../component/basic-component/Pagination';
import { ToastContainer, useToast } from '../component/basic-component/Toast';
import { DecisionTypeService } from '../services/DecisionTypeService';
import { LegalCaseTypeService } from '../services/LegalCaseTypeService';
import type DecisionTypeResponse from '../types/response/decision-type/DecisionTypeResponse';
import type DecisionTypeSearchRequest from '../types/request/decision-type/DecisionTypeSearchRequest';
import type DecisionTypeRequest from '../types/request/decision-type/DecisionTypeRequest';
import ComboboxSearch, { type Option } from '../component/basic-component/ComboboxSearch';
import { CourtIssued } from '../types/enum/CourtIssued';

const DecisionTypeManager = () => {
  // Helper function to clean search criteria
  const cleanSearchCriteria = (criteria: DecisionTypeSearchRequest): DecisionTypeSearchRequest => {
    return {
      decisionTypeId: criteria.decisionTypeId?.trim() || null,
      decisionTypeName: criteria.decisionTypeName?.trim() || null,
      legalCaseTypeId: criteria.legalCaseTypeId || null,
      courtIssued: criteria.courtIssued || null,
      theEndDecision: criteria.theEndDecision !== null ? criteria.theEndDecision : null
    }
  };

  const navigate = useNavigate();
  const [decisionTypes, setDecisionTypes] = useState<DecisionTypeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [decisionTypeSearch, setDecisionTypeSearch] = useState<DecisionTypeSearchRequest>({
    decisionTypeId: null,
    decisionTypeName: null,
    legalCaseTypeId: null,
    courtIssued: null,
    theEndDecision: null
  });

  const [legalCaseTypeOptions, setLegalCaseTypeOptions] = useState<Option[]>([]);
  
  const courtIssuedOptions: Option[] = [
    { value: '', label: 'Tất cả cấp tòa' },
    { value: "CURRENT_COURT", label: 'Tòa án hiện tại' },
    { value: "SUPERIOR_COURT", label: 'Tòa án cấp trên' }
  ];

  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDecisionType, setSelectedDecisionType] = useState<DecisionTypeResponse | null>(null);
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
  const [sortBy, setSortBy] = useState("decisionTypeId");

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
    { value: "decisionTypeId", label: "Mã loại quyết định" },
    { value: "decisionTypeName", label: "Tên loại quyết định" },
    { value: "courtIssued", label: "Cấp tòa" },
    { value: "isTheEndDecision", label: "Quyết định kết thúc" },
  ];

  useEffect(() => {
    loadTypeOfDecisions();
    loadTypeOfLegalCases();
  }, []);

  const loadTypeOfDecisions = async (
    page: number = 0, 
    size: number = 10, 
    sort: string = "decisionTypeId",
    searchRequest?: DecisionTypeSearchRequest
  ) => {
    setLoading(true);
    try {
      // Use provided search request or empty object for initial load
      const requestToUse = searchRequest || {
        decisionTypeId: null,
        decisionTypeName: null,
        legalCaseTypeId: null,
        courtIssued: null,
        theEndDecision: null
      };
      
      const response = await DecisionTypeService.search(
        requestToUse,
        page,
        size,
        sort
      );
      if (response.success && response.data) {
        setDecisionTypes(response.data.content);
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
      const response = await LegalCaseTypeService.getAll();
      if (response.success && response.data) {
        const options: Option[] = response.data.map(item => ({
          value: item.legalCaseTypeId,
          label: item.legalCaseTypeName
        }));
        setLegalCaseTypeOptions([{ value: '', label: 'Tất cả loại án' }, ...options]);
      }
    } catch (error) {
      console.error('Error loading type of legal cases:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const cleanedCriteria = cleanSearchCriteria(decisionTypeSearch);
      await loadTypeOfDecisions(0, pagination.size, sortBy, cleanedCriteria);
    } catch (error) {
      console.error('Error searching type of decisions:', error);
      toast.error('Lỗi', 'Không thể tìm kiếm loại quyết định');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const clearedSearch = {
      decisionTypeId: null,
      decisionTypeName: null,
      legalCaseTypeId: null,
      courtIssued: null,
      theEndDecision: null
    };
    setDecisionTypeSearch(clearedSearch);
    const cleanedCriteria = cleanSearchCriteria(clearedSearch);
    loadTypeOfDecisions(0, pagination.size, sortBy, cleanedCriteria);
  };

  const handleCreate = () => {
    setSelectedDecisionType(null);
    setShowCreateForm(true);
  };

  const handleEdit = (typeOfDecision: DecisionTypeResponse) => {
    setSelectedDecisionType(typeOfDecision);
    setShowEditForm(true);
  };

  const handleDelete = (typeOfDecision: DecisionTypeResponse) => {
    setSelectedDecisionType(typeOfDecision);
    setShowConfirmModal(true);
  };

  const handleViewDetails = (typeOfDecision: DecisionTypeResponse) => {
    navigate(`/type-of-decision-details/${typeOfDecision.decisionTypeId}`);
  };

  const handleFormSubmit = async (data: DecisionTypeRequest) => {
    try {
      setFormLoading(true);
      
      if (selectedDecisionType) {
        // Update
        const response = await DecisionTypeService.update(selectedDecisionType.decisionTypeId, data as DecisionTypeRequest);
        if (response.success) {
          toast.success('Cập nhật thành công', 'Loại quyết định đã được cập nhật!');
          setShowEditForm(false);
          await loadTypeOfDecisions(pagination.page, pagination.size, sortBy, decisionTypeSearch);
        } else {
          toast.error('Cập nhật thất bại', response.error || 'Có lỗi xảy ra khi cập nhật loại quyết định');
        }
      } else {
        // Create
        const response = await DecisionTypeService.create(data as DecisionTypeRequest);
        if (response.success) {
          toast.success('Tạo thành công', 'Loại quyết định mới đã được tạo!');
          setShowCreateForm(false);
          await loadTypeOfDecisions(pagination.page, pagination.size, sortBy, decisionTypeSearch);
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
    if (!selectedDecisionType) return;

    try {
      const response = await DecisionTypeService.delete(selectedDecisionType.decisionTypeId);
      if (response.success) {
        toast.success('Xóa thành công', 'Loại quyết định đã được xóa khỏi hệ thống!');
        await loadTypeOfDecisions(pagination.page, pagination.size, sortBy, decisionTypeSearch);
      } else {
        toast.error('Xóa thất bại', response.error || 'Có lỗi xảy ra khi xóa loại quyết định');
      }
    } catch (error) {
      console.error('Error deleting type of decision:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa loại quyết định');
    }
    setShowConfirmModal(false);
    setSelectedDecisionType(null);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    const cleanedCriteria = cleanSearchCriteria(decisionTypeSearch);
    loadTypeOfDecisions(page, pagination.size, sortBy, cleanedCriteria);
  };

  const handlePageSizeChange = (size: number) => {
    const cleanedCriteria = cleanSearchCriteria(decisionTypeSearch);
    loadTypeOfDecisions(0, size, sortBy, cleanedCriteria);
  };

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    const cleanedCriteria = cleanSearchCriteria(decisionTypeSearch);
    loadTypeOfDecisions(0, pagination.size, newSortBy, cleanedCriteria);
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
                value={decisionTypeSearch.decisionTypeId || ''}
                onChange={(e) => setDecisionTypeSearch(prev => ({ ...prev, decisionTypeId: e.target.value || null }))}
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
                value={decisionTypeSearch.decisionTypeName || ''}
                onChange={(e) => setDecisionTypeSearch(prev => ({ ...prev, decisionTypeName: e.target.value || null }))}
                placeholder="Nhập tên loại quyết định"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại án
              </label>
              <ComboboxSearch
                options={legalCaseTypeOptions}
                value={decisionTypeSearch.legalCaseTypeId || ''}
                onChange={(value) => setDecisionTypeSearch(prev => ({ ...prev, legalCaseTypeId: value || null }))}
                placeholder="Chọn loại án"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp tòa
              </label>
              <ComboboxSearch
                options={courtIssuedOptions}
                value={decisionTypeSearch.courtIssued || ''}
                onChange={(value) => setDecisionTypeSearch(prev => ({ ...prev, courtIssued: value as CourtIssued || null }))}
                placeholder="Chọn cấp tòa"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={decisionTypeSearch.theEndDecision || false}
                  onChange={(e) => setDecisionTypeSearch(prev => ({ ...prev, theEndDecision: e.target.checked }))}
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
      {!loading && decisionTypes.length > 0 && (
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
      ) : decisionTypes.length === 0 ? (
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
            {decisionTypes.map((typeOfDecision) => (
              <TypeOfDecisionCard
                key={typeOfDecision.decisionTypeId}
                decisionType={typeOfDecision}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <DecisionTypeForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleFormSubmit}
        typeOfLegalCaseOptions={legalCaseTypeOptions}
        isLoading={formLoading}
      />

      <DecisionTypeForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleFormSubmit}
        typeOfDecision={selectedDecisionType}
        typeOfLegalCaseOptions={legalCaseTypeOptions}
        isLoading={formLoading}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa loại quyết định"
        message={`Bạn có chắc chắn muốn xóa loại quyết định "${selectedDecisionType?.decisionTypeName}"? Hành động này không thể hoàn tác.`}
        type="danger"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default DecisionTypeManager;