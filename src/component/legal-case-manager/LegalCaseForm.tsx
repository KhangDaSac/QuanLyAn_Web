import { useState, useEffect } from 'react';
import type { LegalCaseResponse } from '../../types/response/legal-case/LegalCaseResponse';
import ComboboxSearchForm, { type Option } from '../basic-component/ComboboxSearchForm';
import type { LegalCaseRequest } from '../../types/request/legal-case/LegalCaseRequest';
import { LitigantType } from '../../types/enum/LitigantType';
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
        note: '',
        legalRelationshipId: '',
        judgeId: '',
        mediatorId: '',
        batchId: '',
    });

    // Litigants state
    const [litigants, setLitigants] = useState<Array<{
        name: string;
        yearOfBirth: string;
        address: string;
        litigantType: string;
        ordinal: number;
    }>>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [batches, setBatches] = useState<Option[]>([]);
    const [judges, setJudges] = useState<Option[]>([]);
    const [mediators, setMediators] = useState<Option[]>([]);

    const litigantTypeOptions: Option[] = [
        { value: "PLAINTIFF", label: LitigantType.PLAINTIFF },
        { value: "DEFENDANT", label: LitigantType.DEFENDANT },
        { value: "ACCUSED", label: LitigantType.ACCUSED }
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

    // Load batches, judges và mediators từ API
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load batches
                const batchResponse = await BatchService.getAll();
                if (batchResponse.success && batchResponse?.data) {
                    const batchOptions: Option[] = batchResponse.data.map(batch => ({
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
            setFormData({
                acceptanceNumber: legalCase.acceptanceNumber,
                acceptanceDate: legalCase.acceptanceDate,
                note: legalCase.note || '',
                legalRelationshipId: legalCase.legalRelationship.legalRelationshipId,
                judgeId: legalCase.judge?.officerId || '',
                mediatorId: legalCase.mediator?.officerId || '',
                batchId: legalCase.batch?.batchId || ''
            });
            
            // Load litigants from legalCase
            setLitigants(legalCase.litigants.map((lit, index) => ({
                name: lit.name,
                yearOfBirth: lit.yearOfBirth,
                address: lit.address,
                litigantType: lit.litigantType,
                ordinal: lit.ordinal || index + 1
            })));
        } else {
            // Chế độ thêm mới
            setFormData({
                acceptanceNumber: '',
                acceptanceDate: '',
                note: '',
                legalRelationshipId: '',
                judgeId: '',
                mediatorId: '',
                batchId: ''
            });
            
            // Start with one empty litigant
            setLitigants([{
                name: '',
                yearOfBirth: '',
                address: '',
                litigantType: 'PLAINTIFF',
                ordinal: 1
            }]);
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

        if (litigants.length === 0) {
            newErrors.litigants = 'Phải có ít nhất một đương sự';
        }

        litigants.forEach((litigant, index) => {
            if (!litigant.name.trim()) {
                newErrors[`litigant_${index}_name`] = 'Tên đương sự là bắt buộc';
            }
            if (!litigant.litigantType) {
                newErrors[`litigant_${index}_type`] = 'Loại đương sự là bắt buộc';
            }
        });

        if (!formData.legalRelationshipId) {
            newErrors.legalRelationshipId = 'Quan hệ pháp luật là bắt buộc';
        }

        if (!formData.batchId) {
            newErrors.batchId = 'Đợt nhập án là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Helper function to clean form data
    const cleanFormData = (): LegalCaseRequest => {
        return {
            acceptanceNumber: formData.acceptanceNumber,
            acceptanceDate: formData.acceptanceDate,
            legalRelationshipId: formData.legalRelationshipId,
            batchId: formData.batchId,
            note: formData.note?.trim() || null,
            judgeId: legalCase ? null : (formData.judgeId || null), // Không cho sửa judge khi edit
            mediatorId: formData.mediatorId || null,
            litigants: litigants.map((lit, index) => ({
                litigantType: lit.litigantType as any,
                ordinal: index + 1,
                name: lit.name.trim(),
                yearOfBirth: lit.yearOfBirth.trim() || null,
                address: lit.address.trim() || null
            }))
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const cleanedData = cleanFormData();
            onSubmit(cleanedData);
        }
    };

    const handleButtonSubmit = () => {
        if (validateForm()) {
            const cleanedData = cleanFormData();
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

    const handleLitigantChange = (index: number, field: string, value: string) => {
        const newLitigants = [...litigants];
        newLitigants[index] = { ...newLitigants[index], [field]: value };
        setLitigants(newLitigants);
        
        // Clear error for this litigant field
        const errorKey = `litigant_${index}_${field === 'litigantType' ? 'type' : field}`;
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }));
        }
    };

    const addLitigant = () => {
        setLitigants([...litigants, {
            name: '',
            yearOfBirth: '',
            address: '',
            litigantType: 'PLAINTIFF',
            ordinal: litigants.length + 1
        }]);
    };

    const removeLitigant = (index: number) => {
        if (litigants.length > 1) {
            setLitigants(litigants.filter((_, i) => i !== index));
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

                        {/* Đương sự */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Đương sự <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addLitigant}
                                    className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Thêm đương sự
                                </button>
                            </div>
                            
                            {errors.litigants && (
                                <p className="text-red-500 text-xs">{errors.litigants}</p>
                            )}

                            <div className="space-y-4">
                                {litigants.map((litigant, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-semibold text-gray-700">Đương sự #{index + 1}</h4>
                                            {litigants.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLitigant(index)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Loại đương sự */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Loại <span className="text-red-500">*</span>
                                                </label>
                                                <ComboboxSearchForm
                                                    options={litigantTypeOptions}
                                                    value={litigant.litigantType}
                                                    onChange={(value) => handleLitigantChange(index, 'litigantType', value)}
                                                    placeholder="Chọn loại"
                                                />
                                                {errors[`litigant_${index}_type`] && (
                                                    <p className="text-red-500 text-xs mt-1">{errors[`litigant_${index}_type`]}</p>
                                                )}
                                            </div>

                                            {/* Tên */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Họ và tên <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={litigant.name}
                                                    onChange={(e) => handleLitigantChange(index, 'name', e.target.value)}
                                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                                                        errors[`litigant_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Nhập họ và tên"
                                                />
                                                {errors[`litigant_${index}_name`] && (
                                                    <p className="text-red-500 text-xs mt-1">{errors[`litigant_${index}_name`]}</p>
                                                )}
                                            </div>

                                            {/* Năm sinh */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Năm sinh
                                                </label>
                                                <input
                                                    type="number"
                                                    value={litigant.yearOfBirth}
                                                    onChange={(e) => handleLitigantChange(index, 'yearOfBirth', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                                                    placeholder="Nhập năm sinh"
                                                />
                                            </div>

                                            {/* Địa chỉ */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Địa chỉ
                                                </label>
                                                <input
                                                    type="text"
                                                    value={litigant.address}
                                                    onChange={(e) => handleLitigantChange(index, 'address', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                                                    placeholder="Nhập địa chỉ"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                            {/* Thẩm phán - chỉ hiển thị khi tạo mới */}
                            {!legalCase && (
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
                            )}

                            {/* Hòa giải viên */}
                            <div className={!legalCase ? '' : 'md:col-span-2'}>
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
