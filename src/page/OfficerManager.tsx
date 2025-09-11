import { useState, useEffect } from 'react';
import JudgeCard from '../component/judge-manager/JudgeCard';
import JudgeForm from '../component/judge-manager/JudgeForm';
import MediatorCard from '../component/mediator-manager/MediatorCard';
import MediatorForm from '../component/mediator-manager/MediatorForm';
import ConfirmModal from '../component/basic-component/ConfirmModal';
import { ToastContainer, useToast } from '../component/basic-component/Toast';
import { JudgeService } from '../services/JudgeService';
import { MediatorService } from '../services/MediatorService';
import type { JudgeResponse } from '../types/response/judge/JudgeResponse';
import type { JudgeSearchRequest } from '../types/request/judge/JudgeSearchRequest';
import type { JudgeRequest } from '../types/request/judge/JudgeRequest';
import type { MediatorResponse } from '../types/response/mediator/MediatorResponse';
import type { MediatorSearchRequest } from '../types/request/mediator/MediatorSearchRequest';
import type { MediatorRequest } from '../types/request/mediator/MediatorRequest';
import { StatusOfOfficer } from '../types/enum/StatusOfOfficer';
import ComboboxSearch from '../component/basic-component/ComboboxSearch';

type ActiveTab = 'judges' | 'mediators';

const OfficerManager = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('judges');
  
  // Judge states
  const [judges, setJudges] = useState<JudgeResponse[]>([]);
  const [judgeSearch, setJudgeSearch] = useState<JudgeSearchRequest>({
    officerId: null,
    fullName: null,
    statusOfOfficer: null
  });
  const [showJudgeForm, setShowJudgeForm] = useState(false);
  const [editingJudge, setEditingJudge] = useState<JudgeResponse | null>(null);
  
  // Mediator states
  const [mediators, setMediators] = useState<MediatorResponse[]>([]);
  const [mediatorSearch, setMediatorSearch] = useState<MediatorSearchRequest>({
    officerId: null,
    fullName: null,
    statusOfOfficer: null
  });
  const [showMediatorForm, setShowMediatorForm] = useState(false);
  const [editingMediator, setEditingMediator] = useState<MediatorResponse | null>(null);
  
  // Common states
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [statusOfOfficerFilters, setStatusOfOfficerFilters] = useState({
    statusOfOfficer: "",
  });

  const statusOfOfficers = [
    ...Object.entries(StatusOfOfficer).map(([key, value]) => ({
      value: key,
      label: value
    }))
  ];

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
    if (activeTab === 'judges') {
      fetchJudges();
    } else if (activeTab === 'mediators') {
      fetchMediators();
    }
  }, [activeTab]);

  const fetchJudges = async () => {
    setLoading(true);
    try {
      const response = await JudgeService.getTop50()
      if (response.success && response.data) {
        setJudges(response.data);
      }
    } catch (error) {
      console.error('Error fetching judges:', error);
      toast.error('Lỗi', 'Không thể tải danh sách thẩm phán');
    } finally {
      setLoading(false);
    }
  };

  const fetchMediators = async () => {
    setLoading(true);
    try {
      const response = await MediatorService.getLimit50()
      if (response.success && response.data) {
        setMediators(response.data);
      }
    } catch (error) {
      console.error('Error fetching mediators:', error);
      toast.error('Lỗi', 'Không thể tải danh sách hòa giải viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (activeTab === 'judges') {
        const response = await JudgeService.search(judgeSearch);
        if (response.success && response.data) {
          setJudges(response.data);
        }
      } else if (activeTab === 'mediators') {
        const response = await MediatorService.search(mediatorSearch);
        if (response.success && response.data) {
          setMediators(response.data);
        }
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Lỗi', activeTab === 'judges' ? 'Không thể tìm kiếm thẩm phán' : 'Không thể tìm kiếm hòa giải viên');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    if (activeTab === 'judges') {
      setJudgeSearch({
        officerId: null,
        fullName: null,
        statusOfOfficer: null
      });
      fetchJudges();
    } else if (activeTab === 'mediators') {
      setMediatorSearch({
        officerId: null,
        fullName: null,
        statusOfOfficer: null
      });
      fetchMediators();
    }
    setStatusOfOfficerFilters({ statusOfOfficer: "" });
  };

  const handleEdit = (judge: JudgeResponse) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận chỉnh sửa',
      message: `Bạn có muốn chỉnh sửa thông tin thẩm phán "${judge.fullName}"?`,
      type: 'info',
      onConfirm: () => confirmEditJudge(judge),
    });
  };

  const confirmEditJudge = (judge: JudgeResponse) => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    setEditingJudge(judge);
    setShowJudgeForm(true);
    toast.info('Bắt đầu chỉnh sửa', `Đang mở form chỉnh sửa thẩm phán "${judge.fullName}"`);
  };

  const handleEditMediator = (mediator: MediatorResponse) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận chỉnh sửa',
      message: `Bạn có muốn chỉnh sửa thông tin hòa giải viên "${mediator.fullName}"?`,
      type: 'info',
      onConfirm: () => confirmEditMediator(mediator),
    });
  };

  const confirmEditMediator = (mediator: MediatorResponse) => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    setEditingMediator(mediator);
    setShowMediatorForm(true);
    toast.info('Bắt đầu chỉnh sửa', `Đang mở form chỉnh sửa hòa giải viên "${mediator.fullName}"`);
  };

  const handleDelete = async (officerId: string) => {
    if (activeTab === 'judges') {
      const judge = judges.find(j => j.officerId === officerId);
      if (!judge) return;

      setConfirmModal({
        isOpen: true,
        title: 'Xác nhận xóa thẩm phán',
        message: `Bạn có chắc chắn muốn xóa thẩm phán "${judge.fullName}"? Hành động này không thể hoàn tác.`,
        type: 'danger',
        onConfirm: () => confirmDeleteJudge(officerId),
      });
    } else if (activeTab === 'mediators') {
      const mediator = mediators.find(m => m.officerId === officerId);
      if (!mediator) return;

      setConfirmModal({
        isOpen: true,
        title: 'Xác nhận xóa hòa giải viên',
        message: `Bạn có chắc chắn muốn xóa hòa giải viên "${mediator.fullName}"? Hành động này không thể hoàn tác.`,
        type: 'danger',
        onConfirm: () => confirmDeleteMediator(officerId),
      });
    }
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

  const handleFormSubmit = async (data: JudgeRequest) => {
    try {
      setFormLoading(true);

      if (editingJudge) {
        // Cập nhật thẩm phán
        await JudgeService.update(editingJudge.officerId, data);
        toast.success('Cập nhật thành công', 'Thông tin thẩm phán đã được cập nhật thành công!');
      } else {
        // Thêm thẩm phán mới
        await JudgeService.create(data);
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

  const handleMediatorFormSubmit = async (data: MediatorRequest) => {
    try {
      setFormLoading(true);

      if (editingMediator) {
        // Cập nhật hòa giải viên
        await MediatorService.update(editingMediator.officerId, data);
        toast.success('Cập nhật thành công', 'Thông tin hòa giải viên đã được cập nhật thành công!');
      } else {
        // Thêm hòa giải viên mới
        await MediatorService.create(data);
        toast.success('Thêm mới thành công', 'Hòa giải viên mới đã được thêm vào hệ thống!');
      }

      // Load lại danh sách hòa giải viên sau khi thêm/sửa thành công
      await fetchMediators();
      handleCloseMediatorForm();
    } catch (error) {
      console.error('Error saving mediator:', error);
      toast.error('Có lỗi xảy ra', 'Không thể lưu thông tin hòa giải viên. Vui lòng thử lại!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowJudgeForm(false);
    setEditingJudge(null);
  };

  const handleCloseMediatorForm = () => {
    setShowMediatorForm(false);
    setEditingMediator(null);
  };

  const handleAddNew = () => {
    setEditingJudge(null);
    setShowJudgeForm(true);
  };

  const handleAddNewMediator = () => {
    setEditingMediator(null);
    setShowMediatorForm(true);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản Lý Nhân viên</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý và theo dõi thông tin thẩm phán và hòa giải viên trong hệ thống</p>
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
            onClick={activeTab === 'judges' ? handleAddNew : handleAddNewMediator}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('judges')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'judges'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H3m4 10v6a1 1 0 001 1h1m0 0h4m-5 0v-6m5 6v-6m-5 0H9a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
              Thẩm phán
            </button>
            <button
              onClick={() => setActiveTab('mediators')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mediators'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Hòa giải viên
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Nhân viên</label>
                  <input
                    type="text"
                    value={activeTab === 'judges' ? (judgeSearch.officerId || '') : (mediatorSearch.officerId || '')}
                    onChange={(e) => {
                      const value = e.target.value || null;
                      if (activeTab === 'judges') {
                        setJudgeSearch(prev => ({ ...prev, officerId: value }));
                      } else {
                        setMediatorSearch(prev => ({ ...prev, officerId: value }));
                      }
                    }}
                    placeholder="Nhập ID nhân viên"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhân viên</label>
                  <input
                    type="text"
                    value={activeTab === 'judges' ? (judgeSearch.fullName || '') : (mediatorSearch.fullName || '')}
                    onChange={(e) => {
                      const value = e.target.value || null;
                      if (activeTab === 'judges') {
                        setJudgeSearch(prev => ({ ...prev, fullName: value }));
                      } else {
                        setMediatorSearch(prev => ({ ...prev, fullName: value }));
                      }
                    }}
                    placeholder="Nhập tên nhân viên"
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
                      if (activeTab === 'judges') {
                        setJudgeSearch(prev => ({ ...prev, statusOfOfficer: status }));
                      } else {
                        setMediatorSearch(prev => ({ ...prev, statusOfOfficer: status }));
                      }
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

          {/* Content based on active tab */}
          {!loading && (
            <>
              {activeTab === 'judges' && (
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

              {activeTab === 'mediators' && (
                <>
                  {mediators.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {mediators.map((mediator) => (
                        <MediatorCard
                          key={mediator.officerId}
                          mediator={mediator}
                          onEdit={handleEditMediator}
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
            </>
          )}
        </div>
      </div>

      {/* Form Modals */}
      <JudgeForm
        isOpen={showJudgeForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        judge={editingJudge}
        isLoading={formLoading}
      />

      <MediatorForm
        isOpen={showMediatorForm}
        onClose={handleCloseMediatorForm}
        onSubmit={handleMediatorFormSubmit}
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

export default OfficerManager;
