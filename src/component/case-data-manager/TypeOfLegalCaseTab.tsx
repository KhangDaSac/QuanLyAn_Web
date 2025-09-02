import { useState, useEffect } from 'react';
import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';
import { type TypeOfLegalCaseSearchRequest } from '../../types/request/type-of-legal-case/TypeOfLegalCaseSearchRequest';
import { TypeOfLegalCaseService } from '../../services/TypeOfLegalCaseService';
import TypeOfLegalCaseForm from './TypeOfLegalCaseForm';
import TypeOfLegalCaseCard from './TypeOfLegalCaseCard';
import { useToast, ToastContainer } from '../basic-component/Toast';

const TypeOfLegalCaseTab = () => {
  const [typeOfLegalCases, setTypeOfLegalCases] = useState<TypeOfLegalCaseResponse[]>([]);
  const [filteredData, setFilteredData] = useState<TypeOfLegalCaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TypeOfLegalCaseResponse | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<TypeOfLegalCaseSearchRequest>({});
  const [submitting, setSubmitting] = useState(false);
  const { toasts, success, error: showError, removeToast } = useToast();
  const [showFilters, setShowFilters] = useState(false);

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
      showError('Lỗi', 'Lỗi khi tải dữ liệu');
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
      showError('Lỗi', 'Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (editingItem) {
        // Update logic would go here when API is available
        success('Thành công', 'Cập nhật thành công');
      } else {
        // Create logic would go here when API is available
        success('Thành công', 'Thêm mới thành công');
      }
      setShowForm(false);
      setEditingItem(null);
      loadTypeOfLegalCases();
    } catch (error) {
      console.error('Error submitting:', error);
      showError('Lỗi', 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: TypeOfLegalCaseResponse) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      // Delete logic would go here when API is available
      success('Thành công', 'Xóa thành công');
      loadTypeOfLegalCases();
    } catch (error) {
      console.error('Error deleting:', error);
      showError('Lỗi', 'Lỗi khi xóa');
    }
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Danh sách loại vụ án</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý các loại vụ án trong hệ thống</p>
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
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm loại vụ án
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại vụ án</label>
              <input
                type="text"
                value={searchCriteria.typeOfLegalCaseName || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, typeOfLegalCaseName: e.target.value }))}
                placeholder="Nhập tên loại vụ án"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã loại vụ án</label>
              <input
                type="text"
                value={searchCriteria.codeName || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, codeName: e.target.value }))}
                placeholder="Nhập mã loại vụ án"
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      )}

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
