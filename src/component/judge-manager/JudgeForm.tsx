import { useState, useEffect } from 'react';
import type { JudgeResponse } from '../../types/response/judge/JudgeResponse';
import type { JudgeRequest } from '../../types/request/judge/JudgeRequest';
import type { StatusOfJudge } from '../../types/enum/StatusOfJudge';

interface JudgeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: JudgeRequest) => void;
    judge?: JudgeResponse | null;
    isLoading?: boolean;
}

const JudgeForm = ({
    isOpen,
    onClose,
    onSubmit,
    judge,
    isLoading = false
}: JudgeFormProps) => {
    const [formData, setFormData] = useState<JudgeRequest>({
        firstName: '',
        lastName: '',
        maxNumberOfLegalCase: 0,
        statusOfJudge: null,
        email: null
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const statusOptions = [
        { value: 'ACTIVE', label: 'Đang hoạt động' },
        { value: 'INACTIVE', label: 'Không hoạt động' },
        { value: 'ON_LEAVE', label: 'Đang nghỉ phép' },
        { value: 'RETIRED', label: 'Đã nghỉ hưu' }
    ];

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
        if (judge) {
            // Chế độ sửa
            setFormData({
                firstName: judge.firstName,
                lastName: judge.lastName,
                maxNumberOfLegalCase: judge.maxNumberOfLegalCase,
                statusOfJudge: judge.statusOfJudge,
                email: judge.email
            });
        } else {
            // Chế độ thêm mới
            setFormData({
                firstName: '',
                lastName: '',
                maxNumberOfLegalCase: 0,
                statusOfJudge: null,
                email: null
            });
        }
        setErrors({});
    }, [judge, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Tên là bắt buộc';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Họ là bắt buộc';
        }

        if (formData.maxNumberOfLegalCase <= 0) {
            newErrors.maxNumberOfLegalCase = 'Số án tối đa phải lớn hơn 0';
        }

        if (!judge && !formData.email?.trim()) {
            newErrors.email = 'Email là bắt buộc';
        }

        if (!judge && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Nếu đang sửa, không gửi email
        if (judge) {
            const updateData: JudgeRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                maxNumberOfLegalCase: formData.maxNumberOfLegalCase,
                statusOfJudge: formData.statusOfJudge,
                email: null
            };
            onSubmit(updateData);
        } else {
            // Khi tạo mới, gửi email
            const createData: JudgeRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                maxNumberOfLegalCase: formData.maxNumberOfLegalCase,
                statusOfJudge: null,
                email: formData.email
            };
            onSubmit(createData);
        }
    };

    const handleInputChange = (field: keyof JudgeRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Xóa lỗi khi người dùng bắt đầu nhập
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
                <div className="overflow-y-auto max-h-[90vh] p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {judge ? 'Cập nhật thẩm phán' : 'Thêm thẩm phán mới'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Họ và Tên */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập họ"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập tên"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email - chỉ hiện khi thêm mới */}
                        {!judge && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>
                        )}

                        {/* Số án tối đa và Trạng thái */}
                        <div className={`grid grid-cols-1 ${judge ? 'md:grid-cols-2' : ''} gap-6`}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số án tối đa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxNumberOfLegalCase}
                                    onChange={(e) => handleInputChange('maxNumberOfLegalCase', parseInt(e.target.value) || 0)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                        errors.maxNumberOfLegalCase ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập số án tối đa"
                                />
                                {errors.maxNumberOfLegalCase && (
                                    <p className="text-red-500 text-xs mt-1">{errors.maxNumberOfLegalCase}</p>
                                )}
                            </div>

                            {/* Trạng thái - chỉ hiện khi cập nhật */}
                            {judge && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trạng thái <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.statusOfJudge || 'ACTIVE'}
                                        onChange={(e) => handleInputChange('statusOfJudge', e.target.value as StatusOfJudge)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                            errors.statusOfJudge ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.statusOfJudge && (
                                        <p className="text-red-500 text-xs mt-1">{errors.statusOfJudge}</p>
                                    )}
                                </div>
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
                                    judge ? 'Cập nhật' : 'Thêm mới'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
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

export default JudgeForm;
