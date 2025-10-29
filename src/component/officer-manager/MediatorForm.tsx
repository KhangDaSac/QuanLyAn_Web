import { useState, useEffect } from 'react';
import type { MediatorResponse } from '../../types/response/mediator/MediatorResponse';
import type { MediatorRequest } from '../../types/request/mediator/MediatorRequest';
import { OfficerStatus } from '../../types/enum/OfficerStatus';
import ComboboxSearchForm, { type Option } from '../basic-component/ComboboxSearchForm';

interface MediatorFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MediatorRequest) => void;
    mediator?: MediatorResponse | null;
    isLoading?: boolean;
}

const MediatorForm = ({
    isOpen,
    onClose,
    onSubmit,
    mediator,
    isLoading = false
}: MediatorFormProps) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        statusOfOfficer: '',
        email: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const statusOptions = [
        { value: "WORKING", label: OfficerStatus.WORKING },
        { value: "NOT_WORKING", label: OfficerStatus.NOT_WORKING },
        { value: "ON_BUSINESS_TRIP", label: OfficerStatus.ON_BUSINESS_TRIP },
        { value: "ON_LEAVE", label: OfficerStatus.ON_LEAVE },
        { value: "DISCIPLINED", label: OfficerStatus.DISCIPLINED }
    ];

    const statusOptionsForCombobox: Option[] = statusOptions.map(option => ({
        value: option.value,
        label: option.label
    }));

    // Ngăn cuộn trang khi modal mở
    useEffect(() => {
        if (isOpen) {
            // Lưu trạng thái scroll hiện tại
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Khôi phục trạng thái scroll
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Cleanup khi component unmount
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (mediator) {
            // Chế độ sửa
            setFormData({
                firstName: mediator.firstName || '',
                lastName: mediator.lastName || '',
                statusOfOfficer: mediator.officerStatus || '',
                email: mediator.email || ''
            });
        } else {
            // Chế độ thêm mới
            setFormData({
                firstName: '',
                lastName: '',
                statusOfOfficer: '',
                email: ''
            });
        }
        setErrors({});
    }, [mediator, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Tên là bắt buộc';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Họ là bắt buộc';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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

        if (mediator) {
            // Update existing mediator - chỉ gửi các field đã thay đổi
            const updateData: MediatorRequest = {};
            
            // Chỉ thêm field nào thay đổi so với giá trị ban đầu
            if (formData.firstName !== mediator.firstName) {
                updateData.firstName = formData.firstName;
            }
            
            if (formData.lastName !== mediator.lastName) {
                updateData.lastName = formData.lastName;
            }
            
            if (formData.statusOfOfficer && formData.statusOfOfficer !== mediator.officerStatus) {
                updateData.officerStatus = formData.statusOfOfficer as OfficerStatus;
            }
            
            if (formData.email && formData.email !== mediator.email) {
                updateData.email = formData.email;
            }
            
            // Nếu không có field nào thay đổi, không gửi request
            if (Object.keys(updateData).length === 0) {
                onClose();
                return;
            }
            
            onSubmit(updateData);
        } else {
            // Create new mediator - gửi đầy đủ thông tin
            const createData: MediatorRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                officerStatus: null, // Mặc định khi tạo mới
                email: formData.email || null
            };
            onSubmit(createData);
        }
    };

    const handleInputChange = (field: keyof MediatorRequest, value: string | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]" style={{
            margin: 0,
            padding: '1rem',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh'
        }}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative z-[10000] mx-auto overflow-hidden">
                <div className="overflow-y-auto max-h-[90vh] p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mediator ? 'Cập nhật hòa giải viên' : 'Thêm hòa giải viên mới'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isLoading}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Họ */}
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

                            {/* Tên */}
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

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value || null)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nhập email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <ComboboxSearchForm
                                options={statusOptionsForCombobox}
                                value={formData.statusOfOfficer || ''}
                                onChange={(value) => handleInputChange('officerStatus', value || null)}
                                placeholder="Chọn trạng thái"
                            />
                            {errors.statusOfOfficer && (
                                <p className="text-red-500 text-xs mt-1">{errors.statusOfOfficer}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </span>
                                ) : mediator ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MediatorForm;
