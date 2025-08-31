import { useState, useEffect } from 'react';
import { type LegalRelationshipGroupRequest } from '../../types/request/legal-relationship-group/LegalRelationshipGroupRequest';
import { type LegalRelationshipGroupResponse } from '../../types/response/legal-relationship-group/LegalRelationshipGroupResponse';

interface LegalRelationshipGroupFormProps {
  initialData?: LegalRelationshipGroupResponse | null;
  onSubmit: (data: LegalRelationshipGroupRequest) => void;
  onCancel: () => void;
}

const LegalRelationshipGroupForm = ({ initialData, onSubmit, onCancel }: LegalRelationshipGroupFormProps) => {
  const [formData, setFormData] = useState<LegalRelationshipGroupRequest>({
    legalRelationshipGroupName: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<LegalRelationshipGroupRequest>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        legalRelationshipGroupName: initialData.legalRelationshipGroupName,
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LegalRelationshipGroupRequest> = {};

    if (!formData.legalRelationshipGroupName.trim()) {
      newErrors.legalRelationshipGroupName = 'Tên nhóm quan hệ pháp luật là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LegalRelationshipGroupRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {initialData ? 'Cập nhật nhóm quan hệ pháp luật' : 'Thêm mới nhóm quan hệ pháp luật'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="legalRelationshipGroupName" className="block text-sm font-medium text-gray-700 mb-2">
                Tên nhóm quan hệ pháp luật <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="legalRelationshipGroupName"
                value={formData.legalRelationshipGroupName}
                onChange={(e) => handleInputChange('legalRelationshipGroupName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.legalRelationshipGroupName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên nhóm quan hệ pháp luật"
              />
              {errors.legalRelationshipGroupName && (
                <p className="mt-1 text-sm text-red-600">{errors.legalRelationshipGroupName}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả cho nhóm quan hệ pháp luật"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {initialData ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LegalRelationshipGroupForm;
