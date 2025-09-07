import { useState, useEffect } from 'react';
import { type LegalRelationshipGroupRequest } from '../../types/request/legal-relationship-group/LegalRelationshipGroupRequest';
import { type LegalRelationshipGroupResponse } from '../../types/response/legal-relationship-group/LegalRelationshipGroupResponse';
import { useToast, ToastContainer } from '../basic-component/Toast';

interface LegalRelationshipGroupFormProps {
  isOpen: boolean;
  initialData?: LegalRelationshipGroupResponse | null;
  onSubmit: (data: LegalRelationshipGroupRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LegalRelationshipGroupForm = ({ 
  isOpen,
  initialData, 
  onSubmit, 
  onCancel,
  isLoading = false 
}: LegalRelationshipGroupFormProps) => {
  const [formData, setFormData] = useState<LegalRelationshipGroupRequest>({
    legalRelationshipGroupName: '',
    description: ''
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
        legalRelationshipGroupName: initialData.legalRelationshipGroupName,
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.legalRelationshipGroupName.trim()) {
      newErrors.legalRelationshipGroupName = 'Tên nhóm quan hệ pháp luật là bắt buộc';
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
          initialData ? 'Cập nhật nhóm quan hệ pháp luật thành công!' : 'Thêm nhóm quan hệ pháp luật mới thành công!'
        );
      } catch (error) {
        showError('Lỗi', 'Có lỗi xảy ra khi lưu dữ liệu');
      }
    }
  };

  const handleInputChange = (field: keyof LegalRelationshipGroupRequest, value: string) => {
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
              {initialData ? 'Cập nhật nhóm quan hệ pháp luật' : 'Thêm nhóm quan hệ pháp luật mới'}
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
                Tên nhóm quan hệ pháp luật <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.legalRelationshipGroupName}
                onChange={(e) => handleInputChange('legalRelationshipGroupName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.legalRelationshipGroupName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên nhóm quan hệ pháp luật"
              />
              {errors.legalRelationshipGroupName && (
                <p className="text-red-500 text-xs mt-1">{errors.legalRelationshipGroupName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Nhập mô tả cho nhóm quan hệ pháp luật"
              />
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

export default LegalRelationshipGroupForm;
