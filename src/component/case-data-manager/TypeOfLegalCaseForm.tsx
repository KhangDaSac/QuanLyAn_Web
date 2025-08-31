import { useState, useEffect } from 'react';
import { type TypeOfLegalCaseRequest } from '../../types/request/type-of-legal-case/TypeOfLegalCaseRequest';
import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';
import SimpleToast from '../basic-component/SimpleToast';

interface TypeOfLegalCaseFormProps {
  isOpen: boolean;
  initialData?: TypeOfLegalCaseResponse | null;
  onSubmit: (data: TypeOfLegalCaseRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TypeOfLegalCaseForm = ({ 
  isOpen, 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: TypeOfLegalCaseFormProps) => {
  const [formData, setFormData] = useState<TypeOfLegalCaseRequest>({
    typeOfLegalCaseName: '',
    codeName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Ngăn cuộn trang khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        typeOfLegalCaseName: initialData.typeOfLegalCaseName,
        codeName: initialData.codeName
      });
    } else {
      // Reset form khi không có initialData
      setFormData({
        typeOfLegalCaseName: '',
        codeName: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.typeOfLegalCaseName.trim()) {
      newErrors.typeOfLegalCaseName = 'Tên loại vụ án là bắt buộc';
    }

    if (!formData.codeName.trim()) {
      newErrors.codeName = 'Mã loại vụ án là bắt buộc';
    } else if (formData.codeName.length > 10) {
      newErrors.codeName = 'Mã loại vụ án không được quá 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        onSubmit(formData);
        showToast(
          initialData ? 'Cập nhật loại vụ án thành công!' : 'Thêm loại vụ án mới thành công!',
          'success'
        );
      } catch (error) {
        showToast('Có lỗi xảy ra khi lưu dữ liệu', 'error');
      }
    }
  };

  const handleInputChange = (field: keyof TypeOfLegalCaseRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
      style={{ 
        margin: 0, 
        padding: '1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Toast */}
      {toastMessage && (
        <SimpleToast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage('')} 
        />
      )}
      
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative z-[10000] mx-auto overflow-hidden"
      >
        <div className="overflow-y-auto max-h-[90vh] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Cập nhật loại vụ án' : 'Thêm loại vụ án mới'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên loại vụ án <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.typeOfLegalCaseName}
                onChange={(e) => handleInputChange('typeOfLegalCaseName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.typeOfLegalCaseName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên loại vụ án"
              />
              {errors.typeOfLegalCaseName && (
                <p className="text-red-500 text-xs mt-1">{errors.typeOfLegalCaseName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã loại vụ án <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.codeName}
                onChange={(e) => handleInputChange('codeName', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.codeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mã loại vụ án (VD: HS, DS, ...)"
                maxLength={10}
              />
              {errors.codeName && (
                <p className="text-red-500 text-xs mt-1">{errors.codeName}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Mã sẽ được tự động chuyển thành chữ hoa
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  initialData ? 'Cập nhật' : 'Thêm mới'
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TypeOfLegalCaseForm;
