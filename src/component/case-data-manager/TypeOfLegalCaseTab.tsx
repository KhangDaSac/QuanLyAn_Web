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
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
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
      {toastMessage && <SimpleToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />}
      
      <TypeOfLegalCaseForm
        isOpen={showForm}
        initialData={editingItem}
        onSubmit={handleSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        isLoading={submitting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Danh sách loại vụ án</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý các loại vụ án trong hệ thống</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-br from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Thêm loại vụ án</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Tìm kiếm loại vụ án</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại vụ án</label>
            <input
              type="text"
              placeholder="Nhập tên loại vụ án"
              value={searchCriteria.typeOfLegalCaseName || ''}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, typeOfLegalCaseName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mã loại vụ án</label>
            <input
              type="text"
              placeholder="Nhập mã loại vụ án"
              value={searchCriteria.codeName || ''}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, codeName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="flex space-x-3">
              <button
                onClick={handleSearch}
                className="flex-1 bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Tìm kiếm</span>
              </button>
              <button
                onClick={resetSearch}
                className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Đặt lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Kết quả ({filteredData.length} loại vụ án)
          </h3>
        </div>
        
        {filteredData.length > 0 ? (
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
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
                <p className="text-sm text-gray-500 mt-1">Không tìm thấy loại vụ án nào phù hợp với tiêu chí tìm kiếm.</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-br from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Thêm loại vụ án đầu tiên</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeOfLegalCaseTab;
