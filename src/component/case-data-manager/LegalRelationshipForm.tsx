import { useState, useEffect } from 'react';
import { type LegalRelationshipRequest } from '../../types/request/legal-relationship/LegalRelationshipRequest';
import { type LegalRelationshipResponse } from '../../types/response/legal-relationship/LegalRelationshipResponse';
import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';
import { type LegalRelationshipGroupResponse } from '../../types/response/legal-relationship-group/LegalRelationshipGroupResponse';
import { useToast, ToastContainer } from '../basic-component/Toast';

interface LegalRelationshipFormProps {
  isOpen: boolean;
  initialData?: LegalRelationshipResponse | null;
  typeOfLegalCases: TypeOfLegalCaseResponse[];
  groups: LegalRelationshipGroupResponse[];
  onSubmit: (data: LegalRelationshipRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LegalRelationshipForm = ({ 
  isOpen,
  initialData, 
  typeOfLegalCases, 
  groups, 
  onSubmit, 
  onCancel,
  isLoading = false 
}: LegalRelationshipFormProps) => {
  const [formData, setFormData] = useState<LegalRelationshipRequest>({
    legalRelationshipName: '',
    typeOfLegalCaseId: '',
    legalRelationshipGroupId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toasts, success, error: showError, removeToast } = useToast();

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
        legalRelationshipName: initialData.legalRelationshipName,
        typeOfLegalCaseId: initialData.typeOfLegalCase.typeOfLegalCaseId,
        legalRelationshipGroupId: initialData.legalRelationshipGroup.legalRelationshipGroupId
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.legalRelationshipName.trim()) {
      newErrors.legalRelationshipName = 'Tên quan hệ pháp luật là bắt buộc';
    }

    if (!formData.typeOfLegalCaseId) {
      newErrors.typeOfLegalCaseId = 'Loại vụ án là bắt buộc';
    }

    if (!formData.legalRelationshipGroupId) {
      newErrors.legalRelationshipGroupId = 'Nhóm quan hệ pháp luật là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        onSubmit(formData);
        success(
          'Thành công',
          initialData ? 'Cập nhật quan hệ pháp luật thành công!' : 'Thêm quan hệ pháp luật mới thành công!'
        );
      } catch (error) {
        showError('Lỗi', 'Có lỗi xảy ra khi lưu dữ liệu');
      }
    }
  };

  const handleInputChange = (field: keyof LegalRelationshipRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative z-[10000] mx-auto overflow-hidden"
      >
        <div className="overflow-y-auto max-h-[90vh] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Cập nhật quan hệ pháp luật' : 'Thêm quan hệ pháp luật mới'}
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
                Tên quan hệ pháp luật <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.legalRelationshipName}
                onChange={(e) => handleInputChange('legalRelationshipName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.legalRelationshipName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên quan hệ pháp luật"
              />
              {errors.legalRelationshipName && (
                <p className="text-red-500 text-xs mt-1">{errors.legalRelationshipName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại vụ án <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.typeOfLegalCaseId}
                onChange={(e) => handleInputChange('typeOfLegalCaseId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.typeOfLegalCaseId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn loại vụ án</option>
                {typeOfLegalCases.map(type => (
                  <option key={type.typeOfLegalCaseId} value={type.typeOfLegalCaseId}>
                    {type.typeOfLegalCaseName} ({type.codeName})
                  </option>
                ))}
              </select>
              {errors.typeOfLegalCaseId && (
                <p className="text-red-500 text-xs mt-1">{errors.typeOfLegalCaseId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm quan hệ pháp luật <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.legalRelationshipGroupId}
                onChange={(e) => handleInputChange('legalRelationshipGroupId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.legalRelationshipGroupId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn nhóm quan hệ pháp luật</option>
                {groups.map(group => (
                  <option key={group.legalRelationshipGroupId} value={group.legalRelationshipGroupId}>
                    {group.legalRelationshipGroupName}
                  </option>
                ))}
              </select>
              {errors.legalRelationshipGroupId && (
                <p className="text-red-500 text-xs mt-1">{errors.legalRelationshipGroupId}</p>
              )}
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

export default LegalRelationshipForm;
