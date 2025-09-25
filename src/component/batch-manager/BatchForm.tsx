import { useState, useEffect } from 'react';
import type { BatchResponse } from '../../types/response/batch/BatchResponse';
import type { BatchRequest } from '../../types/request/batch/BatchRequest';

interface BatchFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BatchRequest) => void;
    batch?: BatchResponse | null;
    isLoading?: boolean;
}

const BatchForm = ({
    isOpen,
    onClose,
    onSubmit,
    batch,
    isLoading = false
}: BatchFormProps) => {
    const [formData, setFormData] = useState<BatchRequest>({
        batchName: '',
        note: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

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
        if (batch) {
            // Chế độ sửa
            setFormData({
                batchName: batch.batchName,
                note: batch.note
            });
        } else {
            // Chế độ thêm mới
            setFormData({
                batchName: '',
                note: ''
            });
        }
        setErrors({});
    }, [batch, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.batchName.trim()) {
            newErrors.batchName = 'Tên đợt nhập là bắt buộc';
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

    const handleInputChange = (field: keyof typeof formData, value: string) => {
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
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative z-[10000] mx-auto"
            >
                <div className="overflow-y-auto max-h-[90vh] p-6"
                     style={{ position: 'relative' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {batch ? 'Cập nhật đợt nhập án' : 'Thêm đợt nhập án mới'}
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
                        {/* Tên đợt nhập */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đợt nhập án <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.batchName}
                                onChange={(e) => handleInputChange('batchName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${errors.batchName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập tên đợt nhập án"
                            />
                            {errors.batchName && (
                                <p className="text-red-500 text-xs mt-1">{errors.batchName}</p>
                            )}
                        </div>

                        {/* Ghi chú */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú
                            </label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                                placeholder="Nhập ghi chú về đợt nhập án"
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
                                    batch ? 'Cập nhật' : 'Thêm mới'
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

export default BatchForm;