import { useState, useEffect } from 'react';
import { type LegalRelationshipGroupResponse } from '../../types/response/legal-relationship-group/LegalRelationshipGroupResponse';
import { type LegalRelationshipGroupRequest } from '../../types/request/legal-relationship-group/LegalRelationshipGroupRequest';
import { type LegalRelationshipGroupSearchRequest } from '../../types/request/legal-relationship-group/LegalRelationshipGroupSearchRequest';
import { LegalRelationshipGroupService } from '../../services/LegalRelationshipGroupService';
import LegalRelationshipGroupForm from './LegalRelationshipGroupForm';
import LegalRelationshipGroupCard from './LegalRelationshipGroupCard';
import ConfirmModal from '../basic-component/ConfirmModal';
import { useToast } from '../basic-component/Toast';

const LegalRelationshipGroupTab = () => {
  const [groups, setGroups] = useState<LegalRelationshipGroupResponse[]>([]);
  const [filteredData, setFilteredData] = useState<LegalRelationshipGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LegalRelationshipGroupResponse | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<LegalRelationshipGroupSearchRequest>({});
  const [showFilters, setShowFilters] = useState(false);
  const toast = useToast();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'warning' | 'danger';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => { },
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await LegalRelationshipGroupService.getAllLegalRelationshipGroups();
      if (response.success) {
        setGroups(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách nhóm quan hệ pháp luật');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      if (Object.keys(searchCriteria).length === 0) {
        setFilteredData(groups);
        return;
      }

      setLoading(true);
      const filtered = groups.filter(item => {
        return (
          (!searchCriteria.legalRelationshipGroupName || 
           item.legalRelationshipGroupName.toLowerCase().includes(searchCriteria.legalRelationshipGroupName.toLowerCase()))
        );
      });
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Lỗi tìm kiếm', 'Không thể thực hiện tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: LegalRelationshipGroupRequest) => {
    try {
      if (editingItem) {
        await LegalRelationshipGroupService.updateLegalRelationshipGroup(editingItem.legalRelationshipGroupId, data);
        toast.success('Cập nhật thành công', `Đã cập nhật nhóm quan hệ pháp luật "${data.legalRelationshipGroupName}"`);
      } else {
        await LegalRelationshipGroupService.createLegalRelationshipGroup(data);
        toast.success('Thêm mới thành công', `Đã thêm nhóm quan hệ pháp luật "${data.legalRelationshipGroupName}"`);
      }
      setShowForm(false);
      setEditingItem(null);
      loadGroups();
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Có lỗi xảy ra', 'Không thể lưu thông tin nhóm quan hệ pháp luật');
    }
  };

  const handleEdit = (item: LegalRelationshipGroupResponse) => {
    setEditingItem(item);
    setShowForm(true);
    toast.info('Chỉnh sửa nhóm quan hệ pháp luật', `Đang mở form chỉnh sửa "${item.legalRelationshipGroupName}"`);
  };

  const handleDelete = async (item: LegalRelationshipGroupResponse) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa',
      message: `Bạn có chắc chắn muốn xóa nhóm quan hệ pháp luật "${item.legalRelationshipGroupName}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => confirmDelete(item.legalRelationshipGroupId)
    });
  };

  const confirmDelete = async (_id: string) => {
    try {
      toast.success('Xóa thành công', 'Nhóm quan hệ pháp luật đã được xóa khỏi hệ thống');
      loadGroups();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa nhóm quan hệ pháp luật');
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
    toast.info('Thêm mới', 'Đang mở form thêm nhóm quan hệ pháp luật mới');
  };

  const resetSearch = () => {
    setSearchCriteria({});
    setFilteredData(groups);
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
      {/* Header với nút thêm mới */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Danh sách nhóm quan hệ pháp luật</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý các nhóm quan hệ pháp luật trong hệ thống</p>
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
            onClick={handleAddNew}
            className="inline-flex items-center px-6 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm nhóm quan hệ
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhóm quan hệ pháp luật</label>
              <input
                type="text"
                value={searchCriteria.legalRelationshipGroupName || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, legalRelationshipGroupName: e.target.value }))}
                placeholder="Nhập tên nhóm quan hệ pháp luật"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Tìm kiếm
              </button>
              <button
                onClick={resetSearch}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data List */}
      <div className="space-y-4">
        {filteredData.map((item) => (
          <LegalRelationshipGroupCard
            key={item.legalRelationshipGroupId}
            group={item}
            onEdit={handleEdit}
            onDelete={(id) => {
              const itemToDelete = filteredData.find(item => item.legalRelationshipGroupId === id);
              if (itemToDelete) {
                handleDelete(itemToDelete);
              }
            }}
          />
        ))}
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <LegalRelationshipGroupForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default LegalRelationshipGroupTab;