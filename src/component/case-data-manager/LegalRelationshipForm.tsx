import { useState, useEffect } from 'react';
import { type LegalRelationshipRequest } from '../../types/request/legal-relationship/LegalRelationshipRequest';
import { type LegalRelationshipResponse } from '../../types/response/legal-relationship/LegalRelationshipResponse';
import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';
import { type LegalRelationshipGroupResponse } from '../../types/response/legal-relationship-group/LegalRelationshipGroupResponse';

interface LegalRelationshipFormProps {
  initialData?: LegalRelationshipResponse | null;
  typeOfLegalCases: TypeOfLegalCaseResponse[];
  groups: LegalRelationshipGroupResponse[];
  onSubmit: (data: LegalRelationshipRequest) => void;
  onCancel: () => void;
}

const LegalRelationshipForm = ({ initialData, typeOfLegalCases, groups, onSubmit, onCancel }: LegalRelationshipFormProps) => {
  const [formData, setFormData] = useState<LegalRelationshipRequest>({
    legalRelationshipName: '',
    typeOfLegalCaseId: '',
    legalRelationshipGroupId: ''
  });

  const [errors, setErrors] = useState<Partial<LegalRelationshipRequest>>({});

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
    const newErrors: Partial<LegalRelationshipRequest> = {};

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
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LegalRelationshipRequest, value: string) => {
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
              {initialData ? 'Cập nhật quan hệ pháp luật' : 'Thêm mới quan hệ pháp luật'}
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
              <label htmlFor="legalRelationshipName" className="block text-sm font-medium text-gray-700 mb-2">
                Tên quan hệ pháp luật <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="legalRelationshipName"
                value={formData.legalRelationshipName}
                onChange={(e) => handleInputChange('legalRelationshipName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.legalRelationshipName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên quan hệ pháp luật"
              />
              {errors.legalRelationshipName && (
                <p className="mt-1 text-sm text-red-600">{errors.legalRelationshipName}</p>
              )}
            </div>

            <div>
              <label htmlFor="typeOfLegalCaseId" className="block text-sm font-medium text-gray-700 mb-2">
                Loại vụ án <span className="text-red-500">*</span>
              </label>
              <select
                id="typeOfLegalCaseId"
                value={formData.typeOfLegalCaseId}
                onChange={(e) => handleInputChange('typeOfLegalCaseId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                <p className="mt-1 text-sm text-red-600">{errors.typeOfLegalCaseId}</p>
              )}
            </div>

            <div>
              <label htmlFor="legalRelationshipGroupId" className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm quan hệ pháp luật <span className="text-red-500">*</span>
              </label>
              <select
                id="legalRelationshipGroupId"
                value={formData.legalRelationshipGroupId}
                onChange={(e) => handleInputChange('legalRelationshipGroupId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                <p className="mt-1 text-sm text-red-600">{errors.legalRelationshipGroupId}</p>
              )}
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

export default LegalRelationshipForm;
