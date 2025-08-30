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
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl transform rounded-lg bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {judge ? 'Cập nhật thẩm phán' : 'Thêm thẩm phán mới'}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <span className="sr-only">Đóng</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-4">
                        <div className="space-y-6">
                            {/* Họ và Tên */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập họ"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập tên"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email - chỉ hiện khi thêm mới */}
                            {!judge && (
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email || ''}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            )}

                            {/* Số án tối đa và Trạng thái */}
                            <div className={`grid grid-cols-1 ${judge ? 'md:grid-cols-2' : ''} gap-4`}>
                                <div>
                                    <label htmlFor="maxNumberOfLegalCase" className="block text-sm font-medium text-gray-700 mb-2">
                                        Số án tối đa <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="maxNumberOfLegalCase"
                                        min="1"
                                        value={formData.maxNumberOfLegalCase}
                                        onChange={(e) => handleInputChange('maxNumberOfLegalCase', parseInt(e.target.value) || 0)}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                            errors.maxNumberOfLegalCase ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập số án tối đa"
                                    />
                                    {errors.maxNumberOfLegalCase && (
                                        <p className="mt-1 text-sm text-red-600">{errors.maxNumberOfLegalCase}</p>
                                    )}
                                </div>

                                {/* Trạng thái - chỉ hiện khi cập nhật */}
                                {judge && (
                                    <div>
                                        <label htmlFor="statusOfJudge" className="block text-sm font-medium text-gray-700 mb-2">
                                            Trạng thái <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="statusOfJudge"
                                            value={formData.statusOfJudge || 'ACTIVE'}
                                            onChange={(e) => handleInputChange('statusOfJudge', e.target.value as StatusOfJudge)}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
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
                                            <p className="mt-1 text-sm text-red-600">{errors.statusOfJudge}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    judge ? 'Cập nhật' : 'Thêm mới'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JudgeForm;
