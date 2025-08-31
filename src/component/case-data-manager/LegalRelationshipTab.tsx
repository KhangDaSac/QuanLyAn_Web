import { useState, useEffect } from 'react';
import { type LegalRelationshipResponse } from '../../types/response/legal-case/LegalRelationshipResponse';
import { type LegalRelationshipRequest } from '../../types/request/legal-relationship/LegalRelationshipRequest';
import { type LegalRelationshipSearchRequest } from '../../types/request/legal-relationship/LegalRelationshipSearchRequest';
import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';
import { type LegalRelationshipGroupResponse } from '../../types/response/legal-relationship-group/LegalRelationshipGroupResponse';
import { LegalRelationshipService } from '../../services/LegalRelationshipService';
import { TypeOfLegalCaseService } from '../../services/TypeOfLegalCaseService';
import { LegalRelationshipGroupService } from '../../services/LegalRelationshipGroupService';
import LegalRelationshipForm from './LegalRelationshipForm';
import LegalRelationshipCard from './LegalRelationshipCard';
import { useToast, ToastContainer } from '../basic-component/Toast';

const LegalRelationshipTab = () => {
  const [relationships, setRelationships] = useState<LegalRelationshipResponse[]>([]);
  const [filteredData, setFilteredData] = useState<LegalRelationshipResponse[]>([]);
  const [typeOfLegalCases, setTypeOfLegalCases] = useState<TypeOfLegalCaseResponse[]>([]);
  const [groups, setGroups] = useState<LegalRelationshipGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LegalRelationshipResponse | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<LegalRelationshipSearchRequest>({});
  const { toasts, success, error: showError, removeToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadRelationships(),
        loadTypeOfLegalCases(),
        loadGroups()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Lỗi', 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadRelationships = async () => {
    try {
      const response = await LegalRelationshipService.getAllLegalRelationships();
      if (response.success) {
        setRelationships(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error('Error loading relationships:', error);
    }
  };

  const loadTypeOfLegalCases = async () => {
    try {
      const response = await TypeOfLegalCaseService.top50();
      if (response.success) {
        setTypeOfLegalCases(response.data);
      }
    } catch (error) {
      console.error('Error loading type of legal cases:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await LegalRelationshipGroupService.getAllLegalRelationshipGroups();
      if (response.success) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (Object.keys(searchCriteria).length === 0) {
        setFilteredData(relationships);
        return;
      }

      setLoading(true);
      const filtered = relationships.filter(item => {
        return (
          (!searchCriteria.legalRelationshipName || 
           item.legalRelationshipName.toLowerCase().includes(searchCriteria.legalRelationshipName.toLowerCase())) &&
          (!searchCriteria.typeOfLegalCaseId || 
           item.typeOfLegalCase.typeOfLegalCaseId === searchCriteria.typeOfLegalCaseId) &&
          (!searchCriteria.legalRelationshipGroupId || 
           item.legalRelationshipGroup.legalRelationshipGroupId === searchCriteria.legalRelationshipGroupId)
        );
      });
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error searching:', error);
      showError('Lỗi', 'Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: LegalRelationshipRequest) => {
    try {
      if (editingItem) {
        await LegalRelationshipService.updateLegalRelationship(editingItem.legalRelationshipId, data);
        success('Thành công', 'Cập nhật thành công');
      } else {
        await LegalRelationshipService.createLegalRelationship(data);
        success('Thành công', 'Thêm mới thành công');
      }
      setShowForm(false);
      setEditingItem(null);
      loadRelationships();
    } catch (error) {
      console.error('Error submitting:', error);
      showError('Lỗi', 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (item: LegalRelationshipResponse) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await LegalRelationshipService.deleteLegalRelationship(id);
      success('Thành công', 'Xóa thành công');
      loadRelationships();
    } catch (error) {
      console.error('Error deleting:', error);
      showError('Lỗi', 'Lỗi khi xóa');
    }
  };

  const resetSearch = () => {
    setSearchCriteria({});
    setFilteredData(relationships);
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {showForm && (
        <LegalRelationshipForm
          initialData={editingItem}
          typeOfLegalCases={typeOfLegalCases}
          groups={groups}
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
            <h2 className="text-2xl font-bold text-gray-900">Quản lý quan hệ pháp luật</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Tên quan hệ pháp luật"
                value={searchCriteria.legalRelationshipName || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, legalRelationshipName: e.target.value }))}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={searchCriteria.typeOfLegalCaseId || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, typeOfLegalCaseId: e.target.value }))}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn loại vụ án</option>
                {typeOfLegalCases.map(type => (
                  <option key={type.typeOfLegalCaseId} value={type.typeOfLegalCaseId}>
                    {type.typeOfLegalCaseName}
                  </option>
                ))}
              </select>

              <select
                value={searchCriteria.legalRelationshipGroupId || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, legalRelationshipGroupId: e.target.value }))}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn nhóm quan hệ pháp luật</option>
                {groups.map(group => (
                  <option key={group.legalRelationshipGroupId} value={group.legalRelationshipGroupId}>
                    {group.legalRelationshipGroupName}
                  </option>
                ))}
              </select>

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
              <LegalRelationshipCard
                key={item.legalRelationshipId}
                relationship={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Không có dữ liệu</h3>
              <p className="mt-2 text-sm text-gray-500">Không tìm thấy quan hệ pháp luật nào phù hợp.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LegalRelationshipTab;
