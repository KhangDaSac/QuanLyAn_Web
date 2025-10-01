import { useState, useEffect } from 'react';
import type TypeOfDecisionResponse from '../../types/response/type-of-decision/TypeOfDecisionResponse';
import type TypeOfDecisionRequest from '../../types/request/type-of-decision/TypeOfDecisionRequest';
import type TypeOfDecisionUpdateRequest from '../../types/request/type-of-decision/TypeOfDecisionUpdateRequest';
import ComboboxSearch, { type Option } from '../basic-component/ComboboxSearch';
import { CourtIssued } from '../../types/enum/CourtIssued';

interface TypeOfDecisionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TypeOfDecisionRequest | TypeOfDecisionUpdateRequest) => void;
    typeOfDecision?: TypeOfDecisionResponse | null;
    typeOfLegalCaseOptions: Option[];
    isLoading?: boolean;
}

const TypeOfDecisionForm = ({
    isOpen,
    onClose,
    onSubmit,
    typeOfDecision,
    typeOfLegalCaseOptions,
    isLoading = false
}: TypeOfDecisionFormProps) => {
    const [formData, setFormData] = useState<TypeOfDecisionRequest>({
        typeOfDecisionName: '',
        typeOfLegalCaseId: '',
        courtIssued: "CURRENT_COURT" as CourtIssued,
        theEndDecision: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const courtIssuedOptions: Option[] = [
        { value: "CURRENT_COURT", label: 'Tòa án hiện tại' },
        { value: "SUPERIOR_COURT", label: 'Tòa án cấp trên' }
    ];

    // Load data when editing
    useEffect(() => {
        if (typeOfDecision) {
            console.log('TypeOfDecision from backend:', typeOfDecision);
            console.log('CourtIssued value:', typeOfDecision.courtIssued);
            
            // Xử lý courtIssued - có thể backend trả về enum name hoặc enum value
            let courtIssuedValue: string;
            const courtIssuedStr = typeOfDecision.courtIssued as string;
            if (courtIssuedStr === "CURRENT_COURT" || courtIssuedStr === "Tòa án hiện tại") {
                courtIssuedValue = "CURRENT_COURT";
            } else {
                courtIssuedValue = "SUPERIOR_COURT";
            }
            
            setFormData({
                typeOfDecisionName: typeOfDecision.typeOfDecisionName,
                typeOfLegalCaseId: typeOfDecision.typeOfLegalCase.typeOfLegalCaseId,
                courtIssued: courtIssuedValue as CourtIssued,
                theEndDecision: typeOfDecision.theEndDecision
            });
        } else {
            // Reset form for create mode
            setFormData({
                typeOfDecisionName: '',
                typeOfLegalCaseId: '',
                courtIssued: "CURRENT_COURT" as CourtIssued,
                theEndDecision: false
            });
        }
        setErrors({});
    }, [typeOfDecision, isOpen]);

    // Ngăn cuộn trang khi modal mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.typeOfDecisionName.trim()) {
            newErrors.typeOfDecisionName = 'Tên loại quyết định là bắt buộc';
        }

        if (!formData.typeOfLegalCaseId) {
            newErrors.typeOfLegalCaseId = 'Loại án là bắt buộc';
        }

        if (!formData.courtIssued) {
            newErrors.courtIssued = 'Cấp tòa là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (typeOfDecision) {
            // Update existing TypeOfDecision - gửi tất cả field, field không thay đổi = null
            let originalCourtIssued: string;
            const courtIssuedStr = typeOfDecision.courtIssued as string;
            if (courtIssuedStr === "CURRENT_COURT" || courtIssuedStr === "Tòa án hiện tại") {
                originalCourtIssued = "CURRENT_COURT";
            } else {
                originalCourtIssued = "SUPERIOR_COURT";
            }
            
            console.log('Form courtIssued:', formData.courtIssued);
            console.log('Original courtIssued:', originalCourtIssued);
            console.log('CourtIssued changed:', formData.courtIssued !== originalCourtIssued);
            
            const updateData: TypeOfDecisionUpdateRequest = {
                typeOfDecisionName: formData.typeOfDecisionName !== typeOfDecision.typeOfDecisionName 
                    ? formData.typeOfDecisionName : null,
                typeOfLegalCaseId: formData.typeOfLegalCaseId !== typeOfDecision.typeOfLegalCase.typeOfLegalCaseId 
                    ? formData.typeOfLegalCaseId : null,
                courtIssued: formData.courtIssued !== originalCourtIssued 
                    ? formData.courtIssued as CourtIssued : null,
                theEndDecision: formData.theEndDecision !== typeOfDecision.theEndDecision 
                    ? formData.theEndDecision : null
            };
            
            console.log('Update data to send:', updateData);
            
            // Kiểm tra có field nào thay đổi không
            const hasChanges = Object.values(updateData).some(value => value !== null);
            if (!hasChanges) {
                onClose();
                return;
            }
            
            onSubmit(updateData);
        } else {
            // Create new TypeOfDecision - gửi đầy đủ thông tin
            const createData: TypeOfDecisionRequest = {
                typeOfDecisionName: formData.typeOfDecisionName,
                typeOfLegalCaseId: formData.typeOfLegalCaseId,
                courtIssued: formData.courtIssued,
                theEndDecision: formData.theEndDecision
            };
            onSubmit(createData);
        }
    };

    const handleInputChange = (field: keyof TypeOfDecisionRequest, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
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
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative z-[10000] mx-auto overflow-hidden"
            >
                <form onSubmit={handleSubmit}>
                    <div className="overflow-y-auto max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {typeOfDecision ? 'Chỉnh sửa loại quyết định' : 'Thêm loại quyết định mới'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 space-y-6">
                            {/* Type of Decision Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên loại quyết định <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.typeOfDecisionName}
                                    onChange={(e) => handleInputChange('typeOfDecisionName', e.target.value)}
                                    placeholder="Nhập tên loại quyết định"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                        errors.typeOfDecisionName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.typeOfDecisionName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.typeOfDecisionName}</p>
                                )}
                            </div>

                            {/* Type of Legal Case */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại án <span className="text-red-500">*</span>
                                </label>
                                <ComboboxSearch
                                    options={typeOfLegalCaseOptions.filter(option => option.value !== '')}
                                    value={formData.typeOfLegalCaseId}
                                    onChange={(value) => handleInputChange('typeOfLegalCaseId', value)}
                                    placeholder="Chọn loại án"
                                />
                                {errors.typeOfLegalCaseId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.typeOfLegalCaseId}</p>
                                )}
                            </div>

                            {/* Court Issued */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cấp tòa <span className="text-red-500">*</span>
                                </label>
                                <ComboboxSearch
                                    options={courtIssuedOptions}
                                    value={formData.courtIssued}
                                    onChange={(value) => handleInputChange('courtIssued', value as CourtIssued)}
                                    placeholder="Chọn cấp tòa"
                                />
                                {errors.courtIssued && (
                                    <p className="mt-1 text-sm text-red-600">{errors.courtIssued}</p>
                                )}
                            </div>

                            {/* The End Decision */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.theEndDecision}
                                        onChange={(e) => handleInputChange('theEndDecision', e.target.checked)}
                                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Quyết định kết thúc</span>
                                </label>
                                <p className="mt-1 text-xs text-gray-500">
                                    Đánh dấu nếu đây là quyết định kết thúc vụ án
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isLoading && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    )}
                                    <span>{isLoading ? 'Đang lưu...' : (typeOfDecision ? 'Cập nhật' : 'Tạo mới')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TypeOfDecisionForm;