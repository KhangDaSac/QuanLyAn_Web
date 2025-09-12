import { useState, useEffect } from 'react';
import type { LegalCaseResponse } from '../../types/response/legal-case/LegalCaseResponse';
import { DecisionService } from '../../services/DecisionService';
import { StatusOfLegalCase } from '../../types/enum/StatusOfLegalCase';
import { ToastContainer, useToast } from '../basic-component/Toast';

interface LegalCaseDetailsProps {
    legalCase: LegalCaseResponse;
    onClose: () => void;
    onEdit: (legalCase: LegalCaseResponse) => void;
    onDelete: (legalCaseId: string) => void;
    onAssign: (legalCase: LegalCaseResponse) => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const LegalCaseDetails = ({ legalCase, onClose, onEdit, onDelete, onAssign }: LegalCaseDetailsProps) => {
    const [decisions, setDecisions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchDecisions();
    }, [legalCase.legalCaseId]);

    const fetchDecisions = async () => {
        setLoading(true);
        try {
            const response = await DecisionService.getByLegalCase(legalCase.legalCaseId);
            if (response.success && response.data) {
                setDecisions(response.data);
            }
        } catch (error) {
            console.error('Error fetching decisions:', error);
            toast.error('Lỗi', 'Không thể tải danh sách quyết định');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết vụ án</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Số thụ lý</label>
                                <p className="text-base font-semibold text-gray-900">{legalCase.acceptanceNumber}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Ngày thụ lý</label>
                                <p className="text-base text-gray-900">{formatDate(legalCase.acceptanceDate)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Trạng thái</label>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    legalCase.statusOfLegalCase === StatusOfLegalCase.WAITING_FOR_ASSIGNMENT
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : legalCase.statusOfLegalCase === StatusOfLegalCase.IN_PROCESS
                                        ? 'bg-purple-100 text-purple-800'
                                        : legalCase.statusOfLegalCase === StatusOfLegalCase.SOLVED
                                        ? 'bg-green-100 text-green-800'
                                        : legalCase.statusOfLegalCase === StatusOfLegalCase.TEMPORARY_SUSPENSION
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {legalCase.statusOfLegalCase === StatusOfLegalCase.WAITING_FOR_ASSIGNMENT && 'Chờ phân công'}
                                    {legalCase.statusOfLegalCase === StatusOfLegalCase.IN_PROCESS && 'Đang xử lý'}
                                    {legalCase.statusOfLegalCase === StatusOfLegalCase.SOLVED && 'Đã giải quyết'}
                                    {legalCase.statusOfLegalCase === StatusOfLegalCase.TEMPORARY_SUSPENSION && 'Tạm đình chỉ'}
                                    {legalCase.statusOfLegalCase === StatusOfLegalCase.OVERDUE && 'Quá hạn'}
                                    {legalCase.statusOfLegalCase === StatusOfLegalCase.CANCELED && 'Đã hủy'}
                                    {legalCase.statusOfLegalCase === StatusOfLegalCase.EDITED && 'Đã sửa'}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Ngày nhập kho</label>
                                <p className="text-base text-gray-900">
                                    {legalCase.storageDate ? formatDate(legalCase.storageDate) : 'Chưa nhập kho'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin các bên */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin các bên</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    {legalCase.legalRelationship.typeOfLegalCase.codeName === 'HS' ? 'Bị cáo' : 'Nguyên đơn'}
                                </label>
                                <p className="text-base font-semibold text-gray-900 mb-2">{legalCase.plaintiff}</p>
                                <p className="text-sm text-gray-700">{legalCase.plaintiffAddress}</p>
                            </div>
                            {legalCase.legalRelationship.typeOfLegalCase.codeName !== 'HS' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Bị đơn</label>
                                    <p className="text-base font-semibold text-gray-900 mb-2">{legalCase.defendant}</p>
                                    <p className="text-sm text-gray-700">{legalCase.defendantAddress}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quan hệ pháp luật */}
                    <div className="bg-purple-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {legalCase.legalRelationship.typeOfLegalCase.codeName === 'HS' ? 'Tội danh' : 'Quan hệ pháp luật'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    {legalCase.legalRelationship.typeOfLegalCase.codeName === 'HS' ? 'Tội' : 'Quan hệ pháp luật'}
                                </label>
                                <p className="text-base font-semibold text-gray-900">{legalCase.legalRelationship.legalRelationshipName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nhóm quan hệ pháp luật</label>
                                <p className="text-base text-gray-900">{legalCase.legalRelationship.legalRelationshipGroup.legalRelationshipGroupName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Loại án</label>
                                <p className="text-base text-gray-900">{legalCase.legalRelationship.typeOfLegalCase.typeOfLegalCaseName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin phân công */}
                    <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin phân công</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Thẩm phán</label>
                                {legalCase.judge ? (
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">{legalCase.judge.fullName}</p>
                                        <p className="text-sm text-gray-700">{legalCase.judge.email}</p>
                                    </div>
                                ) : (
                                    <p className="text-base text-gray-500 italic">Chưa được phân công</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Hòa giải viên</label>
                                {legalCase.mediator ? (
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">{legalCase.mediator.fullName}</p>
                                        <p className="text-sm text-gray-700">{legalCase.mediator.email}</p>
                                    </div>
                                ) : (
                                    <p className="text-base text-gray-500 italic">Không có hòa giải viên</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Danh sách quyết định */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Danh sách quyết định</h3>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                </div>
                            ) : decisions.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500">Chưa có quyết định nào</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {decisions.map((decision, index) => (
                                        <div key={decision.decisionId} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-gray-900">
                                                    Quyết định #{index + 1}
                                                </h4>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(decision.decisionDate)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600">Số quyết định:</span>
                                                    <span className="ml-2 text-gray-900">{decision.decisionNumber}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600">Loại quyết định:</span>
                                                    <span className="ml-2 text-gray-900">{decision.typeOfDecision.typeOfDecisionName}</span>
                                                </div>
                                            </div>
                                            {decision.description && (
                                                <div className="mt-3">
                                                    <span className="font-medium text-gray-600">Mô tả:</span>
                                                    <p className="mt-1 text-gray-900">{decision.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    {!legalCase.judge && (
                        <button
                            onClick={() => onAssign(legalCase)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Phân công
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(legalCase)}
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa
                    </button>
                    <button
                        onClick={() => onDelete(legalCase.legalCaseId)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa
                    </button>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
        </div>
    );
};

export default LegalCaseDetails;