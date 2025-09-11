import { useState, useEffect } from 'react';
import JudgeCard from './JudgeCard';
import JudgeForm from './JudgeForm';
import ConfirmModal from '../basic-component/ConfirmModal';
import { ToastContainer, useToast } from '../basic-component/Toast';
import { JudgeService } from '../../services/JudgeService';
import type { JudgeResponse } from '../../types/response/judge/JudgeResponse';
import type { JudgeSearchRequest } from '../../types/request/judge/JudgeSearchRequest';
import type { JudgeRequest } from '../../types/request/judge/JudgeRequest';
import { StatusOfOfficer } from '../../types/enum/StatusOfOfficer';
import ComboboxSearch from '../basic-component/ComboboxSearch';

const JudgeTab = () => {
  const [judges, setJudges] = useState<JudgeResponse[]>([]);
  const [judgeSearch, setJudgeSearch] = useState<JudgeSearchRequest>({
    officerId: null,
    fullName: null,
    statusOfOfficer: null
  });
  const [showJudgeForm, setShowJudgeForm] = useState(false);
  const [editingJudge, setEditingJudge] = useState<JudgeResponse | null>(null);
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
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      const response = await JudgeService.search(judgeSearch);
      setJudges(response.data || []);
    } catch (error) {
      console.error('Error fetching judges:', error);
      toast.error('Có lỗi xảy ra', 'Không thể tải danh sách thẩm phán');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJudges();
  };

  const handleClearFilters = () => {
    setJudgeSearch({
      officerId: null,
      fullName: null,
      statusOfOfficer: null
    });
    setStatusOfOfficerFilters({ statusOfOfficer: "" });
    fetchJudges();
  };

  const handleEdit = (judge: JudgeResponse) => {
    setEditingJudge(judge);
    setShowJudgeForm(true);
  };

  const handleDelete = (officerId: string) => {
    const judge = judges.find(j => j.officerId === officerId);
    if (!judge) return;

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa thẩm phán',
      message: `Bạn có chắc chắn muốn xóa thẩm phán "${judge.fullName}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => confirmDeleteJudge(officerId),
    });
  };

  const confirmDeleteJudge = async (officerId: string) => {
    try {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      setLoading(true);
      await JudgeService.delete(officerId);
      setJudges(prev => prev.filter(j => j.officerId !== officerId));
      toast.success('Xóa thành công', 'Thẩm phán đã được xóa khỏi hệ thống!');
    } catch (error) {
      console.error('Error deleting judge:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa thẩm phán. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: JudgeRequest) => {
    try {
      setFormLoading(true);

      if (editingJudge) {
        await JudgeService.update(editingJudge.officerId, data);
        toast.success('Cập nhật thành công', 'Thông tin thẩm phán đã được cập nhật thành công!');
      } else {
        await JudgeService.create(data);
        toast.success('Thêm mới thành công', 'Thẩm phán mới đã được thêm vào hệ thống!');
      }

      await fetchJudges();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving judge:', error);
      toast.error('Có lỗi xảy ra', 'Không thể lưu thông tin thẩm phán. Vui lòng thử lại!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowJudgeForm(false);
    setEditingJudge(null);
  };

  const handleAddNew = () => {
    setEditingJudge(null);
    setShowJudgeForm(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quản Lý Thẩm Phán</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý và theo dõi thông tin thẩm phán trong hệ thống</p>
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
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Thẩm phán</label>
              <input
                type="text"
                value={judgeSearch.officerId || ''}
                onChange={(e) => {
                  const value = e.target.value || null;
                  setJudgeSearch(prev => ({ ...prev, officerId: value }));
                }}
                placeholder="Nhập ID thẩm phán"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên thẩm phán</label>
              <input
                type="text"
                value={judgeSearch.fullName || ''}
                onChange={(e) => {
                  const value = e.target.value || null;
                  setJudgeSearch(prev => ({ ...prev, fullName: value }));
                }}
                placeholder="Nhập tên thẩm phán"
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
                  setJudgeSearch(prev => ({ ...prev, statusOfOfficer: status }));
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

      {/* Judge Cards */}
      {!loading && (
        <>
          {judges.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {judges.map((judge) => (
                <JudgeCard
                  key={judge.officerId}
                  judge={judge}
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
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Không có thẩm phán nào</h3>
              <p className="text-sm md:text-base text-gray-600 px-4">Hiện tại chưa có thẩm phán nào trong hệ thống hoặc không có kết quả tìm kiếm phù hợp.</p>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      <JudgeForm
        isOpen={showJudgeForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        judge={editingJudge}
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

export default JudgeTab;
