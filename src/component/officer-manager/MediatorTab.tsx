import { useState, useEffect } from 'react';
import MediatorCard from './MediatorCard';
import MediatorForm from './MediatorForm';
import ConfirmModal from '../basic-component/ConfirmModal';
import Pagination from '../basic-component/Pagination';
import { ToastContainer, useToast } from '../basic-component/Toast';
import { MediatorService } from '../../services/MediatorService';
import type { MediatorResponse } from '../../types/response/mediator/MediatorResponse';
import type { MediatorSearchRequest } from '../../types/request/mediator/MediatorSearchRequest';
import type { MediatorRequest } from '../../types/request/mediator/MediatorRequest';
import { StatusOfOfficer } from '../../types/enum/StatusOfOfficer';
import ComboboxSearch, { type Option } from '../basic-component/ComboboxSearch';

const MediatorTab = () => {
  const [mediators, setMediators] = useState<MediatorResponse[]>([]);
  const [mediatorSearch, setMediatorSearch] = useState<MediatorSearchRequest>({
    officerId: null,
    fullName: null,
    statusOfOfficer: null
  });
  const [showMediatorForm, setShowMediatorForm] = useState(false);
  const [editingMediator, setEditingMediator] = useState<MediatorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
  const [sortBy, setSortBy] = useState("fullName");

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
    { value: "fullName", label: "Họ và tên" },
    { value: "officerId", label: "Mã hòa giải viên" },
    { value: "statusOfOfficer", label: "Trạng thái" },
  ];

  const [statusOfOfficerFilters, setStatusOfOfficerFilters] = useState({
    statusOfOfficer: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning' as 'warning' | 'danger',
    onConfirm: () => {}
  });

  const toast = useToast();

  const statusOfOfficers = Object.values(StatusOfOfficer).map(status => ({
    value: status,
    label: status
  }));

  useEffect(() => {
    loadMediators();
  }, []);

  const loadMediators = async (
    page: number = 0,
    size: number = 10,
    sort: string = "fullName",
    searchRequest?: MediatorSearchRequest
  ) => {
    try {
      setLoading(true);
      const requestToUse = searchRequest || {
        officerId: null,
        fullName: null,
        statusOfOfficer: null
      };
      
      const response = await MediatorService.search(requestToUse, page, size, sort);
      if (response.success && response.data) {
        setMediators(response.data.content);
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
        toast.error('Lỗi', 'Không thể tải danh sách hòa giải viên');
      }
    } catch (error) {
      console.error('Error fetching mediators:', error);
      toast.error('Có lỗi xảy ra', 'Không thể tải danh sách hòa giải viên');
    } finally {
      setLoading(false);
    }
  };

  const fetchMediators = async () => {
    await loadMediators(pagination.page, pagination.size, sortBy, mediatorSearch);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      await loadMediators(0, pagination.size, sortBy, mediatorSearch);
    } catch (error) {
      console.error('Error searching mediators:', error);
      toast.error('Lỗi', 'Không thể tìm kiếm hòa giải viên');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const clearedSearch = {
      officerId: null,
      fullName: null,
      statusOfOfficer: null
    };
    setMediatorSearch(clearedSearch);
    setStatusOfOfficerFilters({ statusOfOfficer: "" });
    loadMediators(0, pagination.size, sortBy, clearedSearch);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    loadMediators(page, pagination.size, sortBy, mediatorSearch);
  };

  const handlePageSizeChange = (size: number) => {
    loadMediators(0, size, sortBy, mediatorSearch);
  };

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    loadMediators(0, pagination.size, newSortBy, mediatorSearch);
  };

  const handleEdit = (mediator: MediatorResponse) => {
    setEditingMediator(mediator);
    setShowMediatorForm(true);
  };

  const handleDelete = (officerId: string) => {
    const mediator = mediators.find(m => m.officerId === officerId);
    if (!mediator) return;

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa hòa giải viên',
      message: `Bạn có chắc chắn muốn xóa hòa giải viên "${mediator.fullName}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => confirmDeleteMediator(officerId),
    });
  };

  const confirmDeleteMediator = async (officerId: string) => {
    try {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      setLoading(true);
      await MediatorService.delete(officerId);
      setMediators(prev => prev.filter(m => m.officerId !== officerId));
      toast.success('Xóa thành công', 'Hòa giải viên đã được xóa khỏi hệ thống!');
    } catch (error) {
      console.error('Error deleting mediator:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa hòa giải viên. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: MediatorRequest) => {
    try {
      setFormLoading(true);

      if (editingMediator) {
        await MediatorService.update(editingMediator.officerId, data);
        toast.success('Cập nhật thành công', 'Thông tin hòa giải viên đã được cập nhật thành công!');
      } else {
        await MediatorService.create(data);
        toast.success('Thêm mới thành công', 'Hòa giải viên mới đã được thêm vào hệ thống!');
      }

      await fetchMediators();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving mediator:', error);
      toast.error('Có lỗi xảy ra', 'Không thể lưu thông tin hòa giải viên. Vui lòng thử lại!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowMediatorForm(false);
    setEditingMediator(null);
  };

  const handleAddNew = () => {
    setEditingMediator(null);
    setShowMediatorForm(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quản Lý Hòa Giải Viên</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý và theo dõi thông tin hòa giải viên trong hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Bộ lọc
          </button>
          <button
            onClick={handleAddNew}
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Hòa giải viên</label>
              <input
                type="text"
                value={mediatorSearch.officerId || ''}
                onChange={(e) => {
                  const value = e.target.value || null;
                  setMediatorSearch(prev => ({ ...prev, officerId: value }));
                }}
                placeholder="Nhập ID hòa giải viên"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên hòa giải viên</label>
              <input
                type="text"
                value={mediatorSearch.fullName || ''}
                onChange={(e) => {
                  const value = e.target.value || null;
                  setMediatorSearch(prev => ({ ...prev, fullName: value }));
                }}
                placeholder="Nhập tên hòa giải viên"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <ComboboxSearch
                options={statusOfOfficers}
                value={statusOfOfficerFilters.statusOfOfficer}
                onChange={(value) => {
                  setStatusOfOfficerFilters({ statusOfOfficer: value });
                  const status = value === "" ? null : (value as StatusOfOfficer);
                  setMediatorSearch(prev => ({ ...prev, statusOfOfficer: status }));
                }}
                placeholder="Chọn trạng thái"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Pagination Component */}
      {!loading && mediators.length > 0 && (
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

      {/* Mediator Cards */}
      {!loading && (
        <>
          {mediators.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {mediators.map((mediator) => (
                <MediatorCard
                  key={mediator.officerId}
                  mediator={mediator}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Không có hòa giải viên nào</h3>
              <p className="text-sm md:text-base text-gray-600 px-4">Hiện tại chưa có hòa giải viên nào trong hệ thống hoặc không có kết quả tìm kiếm phù hợp.</p>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      <MediatorForm
        isOpen={showMediatorForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        mediator={editingMediator}
        isLoading={formLoading}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Container */}
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
      />
    </div>
  );
};

export default MediatorTab;
