import { useState, useEffect } from 'react';
import type DecisionRequest from '../../types/request/decision/DecisionRequest';
import { TypeOfDecisionService } from '../../services/TypeOfDecisionService';
import ComboboxSearch, { type Option } from '../basic-component/ComboboxSearch';

interface DecisionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DecisionRequest) => void;
    legalCaseId: string;
    isLoading?: boolean;
}

const DecisionForm = ({
    isOpen,
    onClose,
    onSubmit,
    legalCaseId,
    isLoading = false
}: DecisionFormProps) => {
    const [formData, setFormData] = useState<DecisionRequest>({
        number: '',
        releaseDate: '',
        note: '',
        typeOfDecisionId: '',
        legalCaseId: legalCaseId,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [typeOfDecisions, setTypeOfDecisions] = useState<Option[]>([]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                number: '',
                releaseDate: '',
                note: '',
                typeOfDecisionId: '',
                legalCaseId: legalCaseId,
            });
            setErrors({});
            fetchTypeOfDecisions();
        }
    }, [isOpen, legalCaseId]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const fetchTypeOfDecisions = async () => {
        try {
            const response = await TypeOfDecisionService.getAll();
            if (response.success && response.data) {
                const options: Option[] = response.data.map(item => ({
                    value: item.typeOfDecisionId,
                    label: item.typeOfDecisionName
                }));
                setTypeOfDecisions(options);
            }
        } catch (error) {
            console.error('Error fetching type of decisions:', error);
        }
    };

    const handleInputChange = (field: keyof DecisionRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.number.trim()) {
            newErrors.number = 'Số quyết định là bắt buộc';
        }

        if (!formData.releaseDate) {
            newErrors.releaseDate = 'Ngày ban hành là bắt buộc';
        }

        if (!formData.typeOfDecisionId) {
            newErrors.typeOfDecisionId = 'Loại quyết định là bắt buộc';
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
                            Thêm quyết định mới
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
                        {/* Decision Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số quyết định <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) => handleInputChange('number', e.target.value)}
                                placeholder="Nhập số quyết định"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                            />
                            {errors.number && (
                                <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                            )}
                        </div>

                        {/* Release Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày ban hành <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.releaseDate}
                                onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                            />
                            {errors.releaseDate && (
                                <p className="text-red-500 text-xs mt-1">{errors.releaseDate}</p>
                            )}
                        </div>

                        {/* Type of Decision */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại quyết định <span className="text-red-500">*</span>
                            </label>
                            <ComboboxSearch
                                options={typeOfDecisions}
                                value={formData.typeOfDecisionId}
                                onChange={(value) => handleInputChange('typeOfDecisionId', value)}
                                placeholder="Chọn loại quyết định"
                            />
                            {errors.typeOfDecisionId && (
                                <p className="text-red-500 text-xs mt-1">{errors.typeOfDecisionId}</p>
                            )}
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú
                            </label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                placeholder="Nhập ghi chú (tùy chọn)"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-sm resize-none"
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
                                        Đang lưu...
                                    </span>
                                ) : (
                                    'Thêm quyết định'
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

export default DecisionForm;