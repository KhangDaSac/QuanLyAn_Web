import { useState, useEffect } from 'react';
import type { LegalCaseResponse } from '../../types/response/legal-case/LegalCaseResponse';
import ComboboxSearchForm, { type Option } from '../basic-component/ComboboxSearchForm';
import type { LegalCaseRequest } from '../../types/request/legal-case/LegalCaseRequest';
import { BatchService } from '../../services/BatchService';
import { JudgeService } from '../../services/JudgeService';
import { MediatorService } from '../../services/MediatorService';
interface LegalCaseFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: LegalCaseRequest) => void;
    legalCase?: LegalCaseResponse | null;
    legalRelationships: Option[];
    isLoading?: boolean;
}

const LegalCaseForm = ({
    isOpen,
    onClose,
    onSubmit,
    legalCase,
    legalRelationships,
    isLoading = false
}: LegalCaseFormProps) => {
    // Internal form state uses strings for input compatibility
    const [formData, setFormData] = useState({
        acceptanceNumber: '',
        acceptanceDate: '',
        plaintiff: '',
        plaintiffAddress: '',
        defendant: '',
        defendantAddress: '',
        note: '',
        legalRelationshipId: '',
        judgeId: '',
        mediatorId: '',
        batchId: '',
    });

    // Store original values to track changes during editing
    const [originalData, setOriginalData] = useState({
        acceptanceNumber: '',
        acceptanceDate: '',
        plaintiff: '',
        plaintiffAddress: '',
        defendant: '',
        defendantAddress: '',
        note: '',
        legalRelationshipId: '',
        judgeId: '',
        mediatorId: '',
        batchId: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [batches, setBatches] = useState<Option[]>([]);
    const [judges, setJudges] = useState<Option[]>([]);
    const [mediators, setMediators] = useState<Option[]>([]);

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

    // Load batches, judges và mediators từ API
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load batches
                const batchResponse = await BatchService.getAll();
                if (batchResponse.success && batchResponse?.data?.content) {
                    const batchOptions: Option[] = batchResponse.data.content.map(batch => ({
                        value: batch.batchId,
                        label: batch.batchId + " - " + batch.batchName
                    }));
                    setBatches(batchOptions);
                }

                // Load judges
                const judgeResponse = await JudgeService.getAll();
                if (judgeResponse.success && judgeResponse.data) {
                    const judgeOptions: Option[] = [
                        { value: '', label: 'Không chọn' },
                        ...judgeResponse.data.map(judge => ({
                            value: judge.officerId,
                            label: judge.fullName
                        }))
                    ];
                    setJudges(judgeOptions);
                }

                // Load mediators
                const mediatorResponse = await MediatorService.getAll();
                if (mediatorResponse.success && mediatorResponse.data) {
                    const mediatorOptions: Option[] = [
                        { value: '', label: 'Không chọn' },
                        ...mediatorResponse.data.map(mediator => ({
                            value: mediator.officerId,
                            label: mediator.fullName
                        }))
                    ];
                    setMediators(mediatorOptions);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (legalCase) {
            // Chế độ sửa
            const editData = {
                acceptanceNumber: legalCase.acceptanceNumber,
                acceptanceDate: legalCase.acceptanceDate,
                plaintiff: legalCase.plaintiff,
                plaintiffAddress: legalCase.plaintiffAddress,
                defendant: legalCase.defendant,
                defendantAddress: legalCase.defendantAddress,
                note: legalCase.note || '',
                legalRelationshipId: legalCase.legalRelationship.legalRelationshipId,
                judgeId: legalCase.judge?.officerId || '',
                mediatorId: legalCase.mediator?.officerId || '',
                batchId: legalCase.batch?.batchId || ''
            };
            setFormData(editData);
            setOriginalData(editData); // Store original values for comparison
        } else {
            // Chế độ thêm mới
            const newData = {
                acceptanceNumber: '',
                acceptanceDate: '',
                plaintiff: '',
                plaintiffAddress: '',
                defendant: '',
                defendantAddress: '',
                note: '',
                legalRelationshipId: '',
                judgeId: '',
                mediatorId: '',
                batchId: ''
            };
            setFormData(newData);
            setOriginalData(newData); // For new items, original is empty
        }
        setErrors({});
    }, [legalCase, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.acceptanceNumber.trim()) {
            newErrors.acceptanceNumber = 'Số thụ lý là bắt buộc';
        }

        if (!formData.acceptanceDate) {
            newErrors.acceptanceDate = 'Ngày thụ lý là bắt buộc';
        }

        if (!formData.plaintiff.trim()) {
            newErrors.plaintiff = 'Nguyên đơn là bắt buộc';
        }

        if (!formData.legalRelationshipId) {
            newErrors.legalRelationshipId = 'Quan hệ pháp luật là bắt buộc';
        }

        if (!formData.batchId) {
            newErrors.batchId = 'Đợt nhập án là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Helper function to clean form data - for updates, only send changed fields
    const cleanFormData = (data: typeof formData): LegalCaseRequest => {
        // For new legal cases (no legalCase prop), send all non-empty optional fields
        if (!legalCase) {
            return {
                acceptanceNumber: data.acceptanceNumber,
                acceptanceDate: data.acceptanceDate,
                plaintiff: data.plaintiff,
                legalRelationshipId: data.legalRelationshipId,
                batchId: data.batchId,
                
                // Optional fields - send null if empty
                plaintiffAddress: data.plaintiffAddress?.trim() || null,
                defendant: data.defendant?.trim() || null,
                defendantAddress: data.defendantAddress?.trim() || null,
                note: data.note?.trim() || null,
                judgeId: data.judgeId || null,
                mediatorId: data.mediatorId || null,
            };
        }

        // For updates, only send changed fields, set unchanged fields to null
        return {
            // Required fields - send if changed
            acceptanceNumber: data.acceptanceNumber !== originalData.acceptanceNumber ? data.acceptanceNumber : null,
            acceptanceDate: data.acceptanceDate !== originalData.acceptanceDate ? data.acceptanceDate : null,
            plaintiff: data.plaintiff !== originalData.plaintiff ? data.plaintiff : null,
            legalRelationshipId: data.legalRelationshipId !== originalData.legalRelationshipId ? data.legalRelationshipId : null,
            batchId: data.batchId !== originalData.batchId ? data.batchId : null,
            
            // Optional fields - send if changed (comparing trimmed values)
            plaintiffAddress: (data.plaintiffAddress?.trim() || '') !== (originalData.plaintiffAddress?.trim() || '') 
                ? (data.plaintiffAddress?.trim() || null) : null,
            defendant: (data.defendant?.trim() || '') !== (originalData.defendant?.trim() || '') 
                ? (data.defendant?.trim() || null) : null,
            defendantAddress: (data.defendantAddress?.trim() || '') !== (originalData.defendantAddress?.trim() || '') 
                ? (data.defendantAddress?.trim() || null) : null,
            note: (data.note?.trim() || '') !== (originalData.note?.trim() || '') 
                ? (data.note?.trim() || null) : null,
            judgeId: data.judgeId !== originalData.judgeId ? (data.judgeId || null) : null,
            mediatorId: data.mediatorId !== originalData.mediatorId ? (data.mediatorId || null) : null,
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const cleanedData = cleanFormData(formData);
            onSubmit(cleanedData);
        }
    };

    const handleButtonSubmit = () => {
        if (validateForm()) {
            const cleanedData = cleanFormData(formData);
            onSubmit(cleanedData);
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative z-[10000] mx-auto flex flex-col"
            >
                {/* Fixed Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl bg-white">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {legalCase ? 'Cập nhật án' : 'Thêm án mới'}
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

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Số thụ lý */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số thụ lý <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.acceptanceNumber}
                                    onChange={(e) => handleInputChange('acceptanceNumber', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${errors.acceptanceNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Nhập số thụ lý"
                                />
                                {errors.acceptanceNumber && (
                                    <p className="text-red-500 text-xs mt-1">{errors.acceptanceNumber}</p>
                                )}
                            </div>

                            {/* Ngày thụ lý */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày thụ lý <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.acceptanceDate}
                                    onChange={(e) => handleInputChange('acceptanceDate', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${errors.acceptanceDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.acceptanceDate && (
                                    <p className="text-red-500 text-xs mt-1">{errors.acceptanceDate}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nguyên đơn */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nguyên đơn/Bị cáo <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.plaintiff}
                                    onChange={(e) => handleInputChange('plaintiff', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-vertical ${errors.plaintiff ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Nhập tên nguyên đơn/bị cáo"
                                    rows={2}
                                />
                                {errors.plaintiff && (
                                    <p className="text-red-500 text-xs mt-1">{errors.plaintiff}</p>
                                )}
                            </div>

                            {/* Địa chỉ nguyên đơn */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ nguyên đơn 
                                </label>
                                <textarea
                                    value={formData.plaintiffAddress}
                                    onChange={(e) => handleInputChange('plaintiffAddress', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-vertical ${errors.plaintiffAddress ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Nhập địa chỉ nguyên đơn"
                                    rows={2}
                                />
                                {errors.plaintiffAddress && (
                                    <p className="text-red-500 text-xs mt-1">{errors.plaintiffAddress}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bị đơn */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bị đơn
                                </label>
                                <textarea
                                    value={formData.defendant}
                                    onChange={(e) => handleInputChange('defendant', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-vertical"
                                    placeholder="Nhập tên bị đơn"
                                    rows={2}
                                />
                            </div>

                            {/* Địa chỉ bị đơn */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ bị đơn
                                </label>
                                <textarea
                                    value={formData.defendantAddress}
                                    onChange={(e) => handleInputChange('defendantAddress', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none resize-vertical"
                                    placeholder="Nhập địa chỉ bị đơn"
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* Quan hệ pháp luật */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quan hệ pháp luật <span className="text-red-500">*</span>
                            </label>
                            <ComboboxSearchForm
                                options={legalRelationships}
                                value={formData.legalRelationshipId}
                                onChange={(value) => handleInputChange('legalRelationshipId', value)}
                                placeholder="Chọn quan hệ pháp luật"
                            />
                            {errors.legalRelationshipId && (
                                <p className="text-red-500 text-xs mt-1">{errors.legalRelationshipId}</p>
                            )}
                        </div>

                        {/* Batch */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đợt nhập án <span className="text-red-500">*</span>
                            </label>
                            <ComboboxSearchForm
                                options={batches}
                                value={formData.batchId}
                                onChange={(value) => handleInputChange('batchId', value)}
                                placeholder="Chọn đợt nhập"
                            />
                            {errors.batchId && (
                                <p className="text-red-500 text-xs mt-1">{errors.batchId}</p>
                            )}
                        </div>

                        {/* Optional fields in a grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Thẩm phán */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thẩm phán
                                </label>
                                <ComboboxSearchForm
                                    options={judges}
                                    value={formData.judgeId}
                                    onChange={(value) => handleInputChange('judgeId', value)}
                                    placeholder="Chọn thẩm phán"
                                />
                            </div>

                            {/* Hòa giải viên */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hòa giải viên
                                </label>
                                <ComboboxSearchForm
                                    options={mediators}
                                    value={formData.mediatorId}
                                    onChange={(value) => handleInputChange('mediatorId', value)}
                                    placeholder="Chọn hòa giải viên"
                                />
                            </div>
                        </div>

                        {/* Ghi chú */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú
                            </label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                                placeholder="Nhập ghi chú về vụ án"
                                rows={3}
                            />
                        </div>
                    </form>
                </div>

                {/* Fixed Footer */}
                <div className="border-t border-gray-200 p-6 bg-white rounded-b-xl">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleButtonSubmit}
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
                                legalCase ? 'Cập nhật' : 'Thêm mới'
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
                </div>
            </div>
        </div>
    );
};

export default LegalCaseForm;
