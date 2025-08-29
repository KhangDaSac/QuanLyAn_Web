import { useState, useEffect } from 'react';
import JudgeCard from '../component/judge-manager/JudgeCard';
import JudgeForm from '../component/judge-manager/JudgeForm';
import ConfirmModal from '../component/basic-component/ConfirmModal';
import { ToastContainer, useToast } from '../component/basic-component/Toast';
import { JudgeService } from '../services/JudgeService';
import type { JudgeResponse } from '../types/response/judge/JudgeResponse';
import type { JudgeSearchRequest } from '../types/request/judge/JudgeSearchRequest';
import type { JudgeRequest, JudgeCreateRequest, StatusOfJudge } from '../types/request/judge/JudgeRequest';

const JudgeManager = () => {
  const [judges, setJudges] = useState<JudgeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [judgeSearch, setJudgeSearch] = useState<JudgeSearchRequest>({
    judgeId: null,
    fullName: null,
    statusOfJudge: null
  });

  const [statusOfJudgeFilters, setStatusOfJudgeFilters] = useState({
    statusOfJudge: "",
  });

  const statusOfJudges = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "ACTIVE", label: "Đang hoạt động" },
    { value: "INACTIVE", label: "Không hoạt động" },
    { value: "ON_LEAVE", label: "Đang nghỉ phép" },
    { value: "RETIRED", label: "Đã nghỉ hưu" },
  ];

  // States for form modal
  const [showForm, setShowForm] = useState(false);
  const [editingJudge, setEditingJudge] = useState<JudgeResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Toast và Confirm Modal
  const toast = useToast();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'warning' | 'danger' | 'info' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => { },
  });

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    setLoading(true);
    try {
      const response = await JudgeService.getAll();
      setJudges(response.data);
    } catch (error) {
      console.error('Error fetching judges:', error);
      toast.error('Lỗi', 'Không thể tải danh sách thẩm phán');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await JudgeService.search(judgeSearch);
      setJudges(response.data);
    } catch (error) {
      console.error('Error searching judges:', error);
      toast.error('Lỗi', 'Không thể tìm kiếm thẩm phán');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setJudgeSearch({
      judgeId: null,
      fullName: null,
      statusOfJudge: null
    });
    setStatusOfJudgeFilters({ statusOfJudge: "" });
    fetchJudges();
  };

  const handleEdit = (judge: JudgeResponse) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận chỉnh sửa',
      message: `Bạn có muốn chỉnh sửa thông tin thẩm phán "${judge.fullName}"?`,
      type: 'info',
      onConfirm: () => confirmEdit(judge),
    });
  };

  const confirmEdit = (judge: JudgeResponse) => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    setEditingJudge(judge);
    setShowForm(true);
    toast.info('Bắt đầu chỉnh sửa', `Đang mở form chỉnh sửa thẩm phán "${judge.fullName}"`);
  };

  const handleDelete = async (judgeId: string) => {
    const judge = judges.find(j => j.judgeId === judgeId);
    if (!judge) return;

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa thẩm phán',
      message: `Bạn có chắc chắn muốn xóa thẩm phán "${judge.fullName}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => confirmDelete(judgeId),
    });
  };

  const confirmDelete = async (judgeId: string) => {
    try {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      setLoading(true);
      await JudgeService.delete(judgeId);
      setJudges(prev => prev.filter(j => j.judgeId !== judgeId));
      toast.success('Xóa thành công', 'Thẩm phán đã được xóa khỏi hệ thống!');
    } catch (error) {
      console.error('Error deleting judge:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa thẩm phán. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: JudgeCreateRequest | Omit<JudgeRequest, 'email'>) => {
    try {
      setFormLoading(true);

      if (editingJudge) {
        // Cập nhật thẩm phán (không cập nhật email)
        await JudgeService.update(editingJudge.judgeId, data as Omit<JudgeRequest, 'email'>);
        toast.success('Cập nhật thành công', 'Thông tin thẩm phán đã được cập nhật thành công!');
      } else {
        // Thêm thẩm phán mới
        await JudgeService.create(data as JudgeCreateRequest);
        toast.success('Thêm mới thành công', 'Thẩm phán mới đã được thêm vào hệ thống!');
      }

      // Load lại danh sách thẩm phán sau khi thêm/sửa thành công
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
    setShowForm(false);
    setEditingJudge(null);
  };

  const handleAddNew = () => {
    setEditingJudge(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản Lý Thẩm Phán</h1>
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
            Thêm thẩm phán mới
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ID Thẩm phán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Thẩm phán</label>
              <input
                type="text"
                value={judgeSearch.judgeId || ''}
                onChange={(e) => setJudgeSearch(prev => ({ ...prev, judgeId: e.target.value || null }))}
                placeholder="Nhập ID thẩm phán"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
              <input
                type="text"
                value={judgeSearch.fullName || ''}
                onChange={(e) => setJudgeSearch(prev => ({ ...prev, fullName: e.target.value || null }))}
                placeholder="Nhập họ tên thẩm phán"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={statusOfJudgeFilters.statusOfJudge}
                onChange={(e) => {
                  setStatusOfJudgeFilters({ statusOfJudge: e.target.value });
                  setJudgeSearch(prev => ({ 
                    ...prev, 
                    statusOfJudge: e.target.value ? e.target.value as StatusOfJudge : null 
                  }));
                }}
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              >
                {statusOfJudges.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 md:px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Tìm kiếm</span>
              </span>
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 md:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Judges List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {judges.map((judge) => (
            <JudgeCard
              key={judge.judgeId}
              judge={judge}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && judges.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Không có thẩm phán nào</h3>
          <p className="text-sm md:text-base text-gray-600 px-4">Hiện tại chưa có thẩm phán nào trong hệ thống hoặc không có kết quả tìm kiếm phù hợp.</p>
        </div>
      )}

      {/* Form Modal */}
      <JudgeForm
        isOpen={showForm}
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

export default JudgeManager;
