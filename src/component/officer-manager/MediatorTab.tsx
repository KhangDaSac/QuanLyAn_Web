import { useState, useEffect } from 'react';
import MediatorCard from '../mediator-manager/MediatorCard';
import MediatorForm from '../mediator-manager/MediatorForm';
import ConfirmModal from '../basic-component/ConfirmModal';
import { ToastContainer, useToast } from '../basic-component/Toast';
import { MediatorService } from '../../services/MediatorService';
import type { MediatorResponse } from '../../types/response/mediator/MediatorResponse';
import type { MediatorSearchRequest } from '../../types/request/mediator/MediatorSearchRequest';
import type { MediatorRequest } from '../../types/request/mediator/MediatorRequest';
import { StatusOfOfficer } from '../../types/enum/StatusOfOfficer';
import ComboboxSearch from '../basic-component/ComboboxSearch';

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
    fetchMediators();
  }, []);

  const fetchMediators = async () => {
    try {
      setLoading(true);
      const response = await MediatorService.search(mediatorSearch);
      setMediators(response.data || []);
    } catch (error) {
      console.error('Error fetching mediators:', error);
      toast.error('Có lỗi xảy ra', 'Không thể tải danh sách hòa giải viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMediators();
  };

  const handleClearFilters = () => {
    setMediatorSearch({
      officerId: null,
      fullName: null,
      statusOfOfficer: null
    });
    setStatusOfOfficerFilters({ statusOfOfficer: "" });
    fetchMediators();
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
            Thêm Hòa giải viên
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
                onClick={handleClearFilters}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
