import { useState, useEffect } from 'react';
import LegalCaseCard from '../component/legal-case-manager/LegalCaseCard';
import LegalCaseForm from '../component/legal-case-manager/LegalCaseForm';
import ConfirmModal from '../component/basic-component/ConfirmModal';
import { ToastContainer, useToast } from '../component/basic-component/Toast';
import { LegalCaseService } from '../services/LegalCaseService';
import { TypeOfLegalCaseService } from '../services/TypeOfLegalCaseService';
import type { LegalCaseResponse } from '../types/response/legal-case/LegalCaseResponse';
import type { LegalCaseSearchRequest } from '../types/request/legal-case/LegalCaseSearchRequest';
import type { LegalCaseRequest } from '../types/request/legal-case/LegalCaseRequest';
import ComboboxSearch, { type Option } from '../component/basic-component/ComboboxSearch';
import { LegalRelationshipService } from '../services/LegalRelationshipService';
import { LegalRelationshipGroupService } from '../services/LegalRelationshipGroupService';

const LegalCaseManager = () => {
  const [legalCases, setLegalCases] = useState<LegalCaseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [legalCaseSearch, setLegalCaseSearch] = useState<LegalCaseSearchRequest>({
    acceptanceNumber: null,
    startAcceptanceDate: null,
    endAcceptanceDate: null,
    plaintiff: null,
    plaintiffAddress: null,
    defendant: null,
    defendantAddress: null,
    typeOfLegalCaseId: null,
    legalRelationshipId: null,
    legalRelationshipGroupId: null,
    statusOfLegalCase: null,
    judgeName: null,
    batchId: null,
    storageDate: null
  });

  const [statusOfLegalCaseFilters, setStatusOfLegalCaseFilters] = useState({
    statusOfLegalCase: "",
  });

  const statusOfLegalCases: Option[] = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "TEMPORARY_SUSPENSION", label: "Tạm đình chỉ" },
    { value: "OVERDUE", label: "Án hủy" },
    { value: "EDIT_LEGAL_CASE", label: "Án sửa" },
    { value: "WAITING_FOR_ASSIGNMENT", label: "Chờ được phân công" },
    { value: "IN_PROCESS", label: "Đang giải quyết" },
    { value: "SOLVED", label: "Đã được giải quyết" },
  ];

  const [typeOfLegalCaseFilters, setTypeOfLegalCaseFilters] = useState({
    typeOfLegalCaseId: "",
  });
  const [typeOfLegalCases, setTypeOfLegalCases] = useState<Option[]>([
    { value: "", label: "Tất cả loại án" }
  ]);

  const [legalRelationshipFilters, setLegalRelationshipFilters] = useState({
    legalRelationshipId: "",
  });
  const [legalRelationships, setLegalRelationships] = useState<Option[]>([
    { value: "", label: "Tất cả quan hệ pháp luật" }
  ]);

  const [legalRelationshipGroupFilters, setLegalRelationshipGroupFilters] = useState({
    legalRelationshipGroupId: "",
  });
  const [legalRelationshipGroups, setLegalRelationshipGroups] = useState<Option[]>([
    { value: "", label: "Tất cả nhóm quan hệ pháp luật" }
  ]);

  // States for form modal
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<LegalCaseResponse | null>(null);
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
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchLegalCases();
    fetchTypeOfLegalCases();
    fetchLegalRelationships();
    fetchLegalRelationshipGroups();
  }, []);

  const fetchLegalCases = async () => {
    setLoading(true);
    try {
      setLegalCases((await LegalCaseService.top50()).data);
    } catch (error) {
      console.error('Error fetching legal cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypeOfLegalCases = async () => {
    setLoading(true);
    try {
      setTypeOfLegalCases([
        ...typeOfLegalCases,
        ...(await TypeOfLegalCaseService.getAll()).data.map(
          (item): Option => ({
            value: item.typeOfLegalCaseId,
            label: item.typeOfLegalCaseName
          })
        )
      ]);
    } catch (error) {
      console.error('Error fetching legal cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLegalRelationships = async () => {
    setLoading(true);
    try {
      setLegalRelationships([
        ...legalRelationships,
        ...(await LegalRelationshipService.getAll()).data.map(
          (item): Option => ({
            value: item.legalRelationshipId,
            label: item.legalRelationshipName
          })
        )
      ]);
    } catch (error) {
      console.error('Error fetching legal cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLegalRelationshipGroups = async () => {
    setLoading(true);
    try {
      setLegalRelationshipGroups([
        ...legalRelationshipGroups,
        ...(await LegalRelationshipGroupService.getAll()).data.map(
          (item): Option => ({
            value: item.legalRelationshipGroupId,
            label: item.legalRelationshipGroupName
          })
        )
      ]);
    } catch (error) {
      console.error('Error fetching legal cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      setLegalCases((await LegalCaseService.search(legalCaseSearch)).data);
      console.log((await LegalCaseService.search(legalCaseSearch)).data)
    } catch (error) {
      console.error('Error searching legal cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setLegalCaseSearch({
      acceptanceNumber: null,
      startAcceptanceDate: null,
      endAcceptanceDate: null,
      plaintiff: null,
      plaintiffAddress: null,
      defendant: null,
      defendantAddress: null,
      typeOfLegalCaseId: null,
      legalRelationshipId: null,
      legalRelationshipGroupId: null,
      statusOfLegalCase: null,
      judgeName: null,
      batchId: null,
      storageDate: null
    })
    fetchLegalCases();
  };

  const handleEdit = (legalCase: LegalCaseResponse) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận chỉnh sửa',
      message: `Bạn có muốn chỉnh sửa án "${legalCase.acceptanceNumber}"?`,
      type: 'info',
      onConfirm: () => confirmEdit(legalCase),
    });
  };

  const confirmEdit = (legalCase: LegalCaseResponse) => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    setEditingCase(legalCase);
    setShowForm(true);
    toast.info('Bắt đầu chỉnh sửa', `Đang mở form chỉnh sửa án "${legalCase.acceptanceNumber}"`);
  };

  const handleDelete = async (legalCaseId: string) => {
    const legalCase = legalCases.find(lc => lc.legalCaseId === legalCaseId);
    if (!legalCase) return;

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa án',
      message: `Bạn có chắc chắn muốn xóa án "${legalCase.acceptanceNumber}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => confirmDelete(legalCaseId),
    });
  };

  const confirmDelete = async (legalCaseId: string) => {
    try {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      setLoading(true);
      await LegalCaseService.delete(legalCaseId);
      setLegalCases(prev => prev.filter(lc => lc.legalCaseId !== legalCaseId));
      toast.success('Xóa thành công', 'Án đã được xóa khỏi hệ thống!');
    } catch (error) {
      console.error('Error deleting legal case:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa án. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: LegalCaseRequest) => {
    try {
      setFormLoading(true);
      
      if (editingCase) {
        // Cập nhật án
        await LegalCaseService.update(editingCase.legalCaseId, data as LegalCaseRequest);
        toast.success('Cập nhật thành công', 'Án đã được cập nhật thành công!');
      } else {
        // Thêm án mới
        await LegalCaseService.create(data as LegalCaseRequest);
        toast.success('Thêm mới thành công', 'Án mới đã được thêm vào hệ thống!');
      }
      
      // Load lại danh sách án sau khi thêm/sửa thành công
      await fetchLegalCases();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving legal case:', error);
      toast.error('Có lỗi xảy ra', 'Không thể lưu thông tin án. Vui lòng thử lại!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  const handleAddNew = () => {
    setEditingCase(null);
    setShowForm(true);
  };

  const handleAssign = (legalCase: LegalCaseResponse) => {
    console.log('Assign legal case:', legalCase);
    // Implement assign functionality
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản Lý Án</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý và theo dõi các vụ án trong hệ thống</p>
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
            Thêm án mới
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số thụ lý</label>
              <input
                type="text"
                value={legalCaseSearch.acceptanceNumber || ''}
                onChange={(e) => setLegalCaseSearch({...legalCaseSearch, acceptanceNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Nhập số thụ lý"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày thụ lý từ</label>
              <input
                type="date"
                value={legalCaseSearch.startAcceptanceDate || ''}
                onChange={(e) => setLegalCaseSearch({...legalCaseSearch, startAcceptanceDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày thụ lý đến</label>
              <input
                type="date"
                value={legalCaseSearch.endAcceptanceDate || ''}
                onChange={(e) => setLegalCaseSearch({...legalCaseSearch, endAcceptanceDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nguyên đơn</label>
              <input
                type="text"
                value={legalCaseSearch.plaintiff || ''}
                onChange={(e) => setLegalCaseSearch({...legalCaseSearch, plaintiff: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Tên nguyên đơn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bị đơn</label>
              <input
                type="text"
                value={legalCaseSearch.defendant || ''}
                onChange={(e) => setLegalCaseSearch({...legalCaseSearch, defendant: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Tên bị đơn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thẩm phán</label>
              <input
                type="text"
                value={legalCaseSearch.judgeName || ''}
                onChange={(e) => setLegalCaseSearch({...legalCaseSearch, judgeName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Tên thẩm phán"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <ComboboxSearch
                options={statusOfLegalCases}
                value={statusOfLegalCaseFilters.statusOfLegalCase}
                onChange={(value) => {
                  setStatusOfLegalCaseFilters({statusOfLegalCase: value});
                  setLegalCaseSearch({...legalCaseSearch, statusOfLegalCase: value});
                }}
                placeholder="Chọn trạng thái"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại án</label>
              <ComboboxSearch
                options={typeOfLegalCases}
                value={typeOfLegalCaseFilters.typeOfLegalCaseId}
                onChange={(value) => {
                  setTypeOfLegalCaseFilters({typeOfLegalCaseId: value});
                  setLegalCaseSearch({...legalCaseSearch, typeOfLegalCaseId: value});
                }}
                placeholder="Chọn loại án"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quan hệ pháp luật</label>
              <ComboboxSearch
                options={legalRelationships}
                value={legalRelationshipFilters.legalRelationshipId}
                onChange={(value) => {
                  setLegalRelationshipFilters({legalRelationshipId: value});
                  setLegalCaseSearch({...legalCaseSearch, legalRelationshipId: value});
                }}
                placeholder="Chọn quan hệ pháp luật"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Tổng án</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{legalCases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Chờ phân công</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {legalCases.filter(lc => lc.statusOfLegalCase === 'WAITING_FOR_ASSIGNMENT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Đã phân công</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {legalCases.filter(lc => lc.judge !== null).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Quá hạn</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {legalCases.filter(lc => {
                  const expiredDate = new Date(lc.expiredDate);
                  const currentDate = new Date();
                  return expiredDate < currentDate && lc.statusOfLegalCase !== 'SOLVED';
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Legal Cases List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {legalCases.map((legalCase) => (
            <LegalCaseCard
              key={legalCase.legalCaseId}
              legalCase={legalCase}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAssign={handleAssign}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && legalCases.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Không có án nào</h3>
          <p className="text-sm md:text-base text-gray-600 px-4">Hiện tại chưa có án nào trong hệ thống hoặc không có kết quả tìm kiếm phù hợp.</p>
        </div>
      )}

      {/* Form Modal */}
      <LegalCaseForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        legalCase={editingCase}
        legalRelationships={legalRelationships}
        isLoading={formLoading}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      {/* Toast Container */}
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
      />
    </div>
  );
};

export default LegalCaseManager;
