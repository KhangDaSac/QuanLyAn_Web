import { useState, useEffect } from 'react';
import { type TypeOfLegalCaseRequest } from '../../types/request/type-of-legal-case/TypeOfLegalCaseRequest';
import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';

interface TypeOfLegalCaseFormProps {
  initialData?: TypeOfLegalCaseResponse | null;
  onSubmit: (data: TypeOfLegalCaseRequest) => void;
  onCancel: () => void;
}

const TypeOfLegalCaseForm = ({ initialData, onSubmit, onCancel }: TypeOfLegalCaseFormProps) => {
  const [formData, setFormData] = useState<TypeOfLegalCaseRequest>({
    typeOfLegalCaseName: '',
    codeName: ''
  });

  const [errors, setErrors] = useState<Partial<TypeOfLegalCaseRequest>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        typeOfLegalCaseName: initialData.typeOfLegalCaseName,
        codeName: initialData.codeName
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TypeOfLegalCaseRequest> = {};

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
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof TypeOfLegalCaseRequest, value: string) => {
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
              {initialData ? 'Cập nhật loại vụ án' : 'Thêm mới loại vụ án'}
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
              <label htmlFor="typeOfLegalCaseName" className="block text-sm font-medium text-gray-700 mb-2">
                Tên loại vụ án <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="typeOfLegalCaseName"
                value={formData.typeOfLegalCaseName}
                onChange={(e) => handleInputChange('typeOfLegalCaseName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.typeOfLegalCaseName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên loại vụ án"
              />
              {errors.typeOfLegalCaseName && (
                <p className="mt-1 text-sm text-red-600">{errors.typeOfLegalCaseName}</p>
              )}
            </div>

            <div>
              <label htmlFor="codeName" className="block text-sm font-medium text-gray-700 mb-2">
                Mã loại vụ án <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="codeName"
                value={formData.codeName}
                onChange={(e) => handleInputChange('codeName', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.codeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập mã loại vụ án (VD: HS, DS, ...)"
                maxLength={10}
              />
              {errors.codeName && (
                <p className="mt-1 text-sm text-red-600">{errors.codeName}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Mã sẽ được tự động chuyển thành chữ hoa
              </p>
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

export default TypeOfLegalCaseForm;
