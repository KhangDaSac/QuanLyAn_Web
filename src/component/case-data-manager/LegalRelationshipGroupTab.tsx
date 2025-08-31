import { useState, useEffect } from 'react';
import { type LegalRelationshipGroupResponse } from '../../types/response/legal-relationship-group/LegalRelationshipGroupResponse';
import { type LegalRelationshipGroupRequest } from '../../types/request/legal-relationship-group/LegalRelationshipGroupRequest';
import { type LegalRelationshipGroupSearchRequest } from '../../types/request/legal-relationship-group/LegalRelationshipGroupSearchRequest';
import { LegalRelationshipGroupService } from '../../services/LegalRelationshipGroupService';
import LegalRelationshipGroupForm from './LegalRelationshipGroupForm';
import LegalRelationshipGroupCard from './LegalRelationshipGroupCard';
import SimpleToast from '../basic-component/SimpleToast';

const LegalRelationshipGroupTab = () => {
  const [groups, setGroups] = useState<LegalRelationshipGroupResponse[]>([]);
  const [filteredData, setFilteredData] = useState<LegalRelationshipGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LegalRelationshipGroupResponse | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<LegalRelationshipGroupSearchRequest>({});
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
      showToast('Lỗi khi tải dữ liệu', 'error');
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
      showToast('Lỗi khi tìm kiếm', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: LegalRelationshipGroupRequest) => {
    try {
      if (editingItem) {
        await LegalRelationshipGroupService.updateLegalRelationshipGroup(editingItem.legalRelationshipGroupId, data);
        showToast('Cập nhật thành công', 'success');
      } else {
        await LegalRelationshipGroupService.createLegalRelationshipGroup(data);
        showToast('Thêm mới thành công', 'success');
      }
      setShowForm(false);
      setEditingItem(null);
      loadGroups();
    } catch (error) {
      console.error('Error submitting:', error);
      showToast('Có lỗi xảy ra', 'error');
    }
  };

  const handleEdit = (item: LegalRelationshipGroupResponse) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await LegalRelationshipGroupService.deleteLegalRelationshipGroup(id);
      showToast('Xóa thành công', 'success');
      loadGroups();
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Lỗi khi xóa', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const resetSearch = () => {
    setSearchCriteria({});
    setFilteredData(groups);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {toastMessage && <SimpleToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />}
      
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

      {!showForm && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quản lý nhóm quan hệ pháp luật</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Thêm mới</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tên nhóm quan hệ pháp luật"
                value={searchCriteria.legalRelationshipGroupName || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, legalRelationshipGroupName: e.target.value }))}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Tìm kiếm
                </button>
                <button
                  onClick={resetSearch}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <LegalRelationshipGroupCard
                key={item.legalRelationshipGroupId}
                group={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Không có dữ liệu</h3>
              <p className="mt-2 text-sm text-gray-500">Không tìm thấy nhóm quan hệ pháp luật nào phù hợp.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LegalRelationshipGroupTab;
