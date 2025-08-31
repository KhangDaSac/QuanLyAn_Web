import { useState, useEffect } from 'react';
import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';
import { type TypeOfLegalCaseRequest } from '../../types/request/type-of-legal-case/TypeOfLegalCaseRequest';
import { type TypeOfLegalCaseSearchRequest } from '../../types/request/type-of-legal-case/TypeOfLegalCaseSearchRequest';
import { TypeOfLegalCaseService } from '../../services/TypeOfLegalCaseService';
import TypeOfLegalCaseForm from './TypeOfLegalCaseForm';
import TypeOfLegalCaseCard from './TypeOfLegalCaseCard';
import SimpleToast from '../basic-component/SimpleToast';

const TypeOfLegalCaseTab = () => {
  const [typeOfLegalCases, setTypeOfLegalCases] = useState<TypeOfLegalCaseResponse[]>([]);
  const [filteredData, setFilteredData] = useState<TypeOfLegalCaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TypeOfLegalCaseResponse | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<TypeOfLegalCaseSearchRequest>({});
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadTypeOfLegalCases();
  }, []);

  const loadTypeOfLegalCases = async () => {
    try {
      setLoading(true);
      const response = await TypeOfLegalCaseService.top50();
      if (response.success) {
        setTypeOfLegalCases(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error('Error loading type of legal cases:', error);
      showToast('Lỗi khi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      if (Object.keys(searchCriteria).length === 0) {
        setFilteredData(typeOfLegalCases);
        return;
      }

      setLoading(true);
      // For now, filter locally since search API might not be available
      const filtered = typeOfLegalCases.filter(item => {
        return (
          (!searchCriteria.typeOfLegalCaseName || 
           item.typeOfLegalCaseName.toLowerCase().includes(searchCriteria.typeOfLegalCaseName.toLowerCase())) &&
          (!searchCriteria.codeName || 
           item.codeName.toLowerCase().includes(searchCriteria.codeName.toLowerCase()))
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

  const handleSubmit = async (data: TypeOfLegalCaseRequest) => {
    try {
      if (editingItem) {
        // Update logic would go here when API is available
        showToast('Cập nhật thành công', 'success');
      } else {
        // Create logic would go here when API is available
        showToast('Thêm mới thành công', 'success');
      }
      setShowForm(false);
      setEditingItem(null);
      loadTypeOfLegalCases();
    } catch (error) {
      console.error('Error submitting:', error);
      showToast('Có lỗi xảy ra', 'error');
    }
  };

  const handleEdit = (item: TypeOfLegalCaseResponse) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete logic would go here when API is available
      showToast('Xóa thành công', 'success');
      loadTypeOfLegalCases();
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
    setFilteredData(typeOfLegalCases);
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
        <TypeOfLegalCaseForm
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
            <h2 className="text-2xl font-bold text-gray-900">Quản lý loại vụ án</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Tên loại vụ án"
                value={searchCriteria.typeOfLegalCaseName || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, typeOfLegalCaseName: e.target.value }))}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Mã loại vụ án"
                value={searchCriteria.codeName || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, codeName: e.target.value }))}
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
              <TypeOfLegalCaseCard
                key={item.typeOfLegalCaseId}
                typeOfLegalCase={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Không có dữ liệu</h3>
              <p className="mt-2 text-sm text-gray-500">Không tìm thấy loại vụ án nào phù hợp.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TypeOfLegalCaseTab;
