import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LegalCaseService } from '../services/LegalCaseService';
import { DecisionService } from '../services/DecisionService';
import { LegalRelationshipService } from '../services/LegalRelationshipService';
import type { LegalCaseResponse } from '../types/response/legal-case/LegalCaseResponse';
import type { Option } from '../component/basic-component/ComboboxSearch';
import JudgeAssignmentModal from '../component/legal-case-manager/JudgeAssignmentModal';
import LegalCaseForm from '../component/legal-case-manager/LegalCaseForm';
import ConfirmModal from '../component/basic-component/ConfirmModal';
import { ToastContainer, useToast } from '../component/basic-component/Toast';
import type { AssignAssignmentRequest } from '../types/request/legal-case/AssignAssignmentRequest';
import type { LegalCaseRequest } from '../types/request/legal-case/LegalCaseRequest';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const getStatusDisplayInfo = (status: string) => {
    switch (status) {
        case 'WAITING_FOR_ASSIGNMENT':
            return { text: 'Chờ phân công', color: 'bg-yellow-100 text-yellow-800' };
        case 'IN_PROCESS':
            return { text: 'Đang giải quyết', color: 'bg-purple-100 text-purple-800' };
        case 'SOLVED':
            return { text: 'Đã giải quyết', color: 'bg-green-100 text-green-800' };
        case 'TEMPORARY_SUSPENSION':
            return { text: 'Tạm đình chỉ', color: 'bg-red-100 text-red-800' };
        case 'OVERDUE':
            return { text: 'Quá hạn', color: 'bg-orange-100 text-orange-800' };
        case 'CANCELED':
            return { text: 'Đã hủy', color: 'bg-gray-100 text-gray-800' };
        case 'EDITED':
            return { text: 'Đã sửa', color: 'bg-blue-100 text-blue-800' };
        default:
            return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
    }
};

const LegalCaseDetailsPage = () => {
    const { legalCaseId } = useParams<{ legalCaseId: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [legalCase, setLegalCase] = useState<LegalCaseResponse | null>(null);
    const [decisions, setDecisions] = useState<any[]>([]);
    const [legalRelationships, setLegalRelationships] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [decisionsLoading, setDecisionsLoading] = useState(false);

    // Modal states
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (legalCaseId) {
            fetchLegalCase();
            fetchDecisions();
            fetchLegalRelationships();
        }
    }, [legalCaseId]);

    const fetchLegalCase = async () => {
        if (!legalCaseId) return;
        
        setLoading(true);
        try {
            const response = await LegalCaseService.getById(legalCaseId);
            if (response.success && response.data) {
                setLegalCase(response.data);
            } else {
                toast.error('Lỗi', 'Không thể tải thông tin vụ án');
                navigate('/legal-case');
            }
        } catch (error) {
            console.error('Error fetching legal case:', error);
            toast.error('Lỗi', 'Không thể tải thông tin vụ án');
            navigate('/legal-case');
        } finally {
            setLoading(false);
        }
    };

    const fetchDecisions = async () => {
        if (!legalCaseId) return;

        setDecisionsLoading(true);
        try {
            const response = await DecisionService.getByLegalCase(legalCaseId);
            if (response.success && response.data) {
                setDecisions(response.data);
            }
        } catch (error) {
            console.error('Error fetching decisions:', error);
            toast.error('Lỗi', 'Không thể tải danh sách quyết định');
        } finally {
            setDecisionsLoading(false);
        }
    };

    const fetchLegalRelationships = async () => {
        try {
            const response = await LegalRelationshipService.getAll();
            if (response.success && response.data) {
                const options: Option[] = response.data.map(item => ({
                    value: item.legalRelationshipId,
                    label: item.legalRelationshipName
                }));
                setLegalRelationships(options);
            }
        } catch (error) {
            console.error('Error fetching legal relationships:', error);
        }
    };

    const handleEdit = () => {
        setShowEditForm(true);
    };

    const handleDelete = () => {
        setShowConfirmModal(true);
    };

    const handleAssign = () => {
        setShowAssignmentModal(true);
    };

    const handleAssignSubmit = async (judgeId: string) => {
        if (!legalCase) return;

        setAssignmentLoading(true);
        try {
            const request: AssignAssignmentRequest = {
                legalCaseId: legalCase.legalCaseId,
                judgeId: judgeId
            };

            const response = await LegalCaseService.assignAssignment(request);
            
            if (response.success) {
                toast.success('Phân công thành công', `Đã phân công thẩm phán cho án "${legalCase.acceptanceNumber}"`);
                setShowAssignmentModal(false);
                await fetchLegalCase(); // Reload data
            } else {
                toast.error('Phân công thất bại', response.error || 'Có lỗi xảy ra khi phân công thẩm phán');
            }
        } catch (error) {
            console.error('Error assigning judge:', error);
            toast.error('Phân công thất bại', 'Có lỗi xảy ra khi phân công thẩm phán');
        } finally {
            setAssignmentLoading(false);
        }
    };

    const handleFormSubmit = async (data: LegalCaseRequest) => {
        if (!legalCase) return;

        try {
            setFormLoading(true);
            await LegalCaseService.update(legalCase.legalCaseId, data as LegalCaseRequest);
            toast.success('Cập nhật thành công', 'Án đã được cập nhật thành công!');
            setShowEditForm(false);
            await fetchLegalCase(); // Reload data
        } catch (error) {
            console.error('Error updating legal case:', error);
            toast.error('Có lỗi xảy ra', 'Không thể cập nhật thông tin án. Vui lòng thử lại!');
        } finally {
            setFormLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!legalCase) return;

        try {
            await LegalCaseService.delete(legalCase.legalCaseId);
            toast.success('Xóa thành công', 'Án đã được xóa khỏi hệ thống!');
            navigate('/legal-case');
        } catch (error) {
            console.error('Error deleting legal case:', error);
            toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa án. Vui lòng thử lại!');
        }
        setShowConfirmModal(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!legalCase) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy vụ án</h3>
                <p className="text-gray-600">Vụ án không tồn tại hoặc đã bị xóa.</p>
            </div>
        );
    }

    console.log('Legal Case Data:', legalCase);
    console.log('Status:', legalCase.statusOfLegalCase);
    console.log('Status Type:', typeof legalCase.statusOfLegalCase);
    return (
        <div className="space-y-6 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/legal-case')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay lại
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chi tiết vụ án</h1>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">Số thụ lý: {legalCase.acceptanceNumber}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    {!legalCase.judge && (
                        <button
                            onClick={handleAssign}
                            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600  text-sm font-medium rounded-lg bg-blue-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Phân công
                        </button>
                    )}
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-4 py-2 border border-yellow-600 text-yellow-600 text-sm font-medium rounded-lg bg-yellow-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa
                    </button>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-lg bg-red-50 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Case Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
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
                                {(() => {
                                    const statusInfo = getStatusDisplayInfo(legalCase.statusOfLegalCase as string);
                                    return (
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                            {statusInfo.text}
                                        </span>
                                    );
                                })()}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Ngày nhập kho</label>
                                <p className="text-base text-gray-900">
                                    {legalCase.storageDate ? formatDate(legalCase.storageDate) : 'Chưa nhập kho'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Parties Information */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
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

                    {/* Legal Relationship */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
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
                </div>

                {/* Right Column - Assignment & Decisions */}
                <div className="space-y-6">
                    {/* Assignment Information */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin phân công</h3>
                        <div className="space-y-4">
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

                    {/* Decisions List */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách quyết định</h3>
                        {decisionsLoading ? (
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
                                        <div className="space-y-2 text-sm">
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

            {/* Modals */}
            <JudgeAssignmentModal
                isOpen={showAssignmentModal}
                onClose={() => setShowAssignmentModal(false)}
                onAssign={handleAssignSubmit}
                legalCase={legalCase}
                isLoading={assignmentLoading}
            />

            <LegalCaseForm
                isOpen={showEditForm}
                onClose={() => setShowEditForm(false)}
                onSubmit={handleFormSubmit}
                legalCase={legalCase}
                legalRelationships={legalRelationships}
                isLoading={formLoading}
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmDelete}
                title="Xác nhận xóa án"
                message={`Bạn có chắc chắn muốn xóa án "${legalCase.acceptanceNumber}"? Hành động này không thể hoàn tác.`}
                type="danger"
                confirmText="Xác nhận"
                cancelText="Hủy"
            />

            {/* Toast Container */}
            <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
        </div>
    );
};

export default LegalCaseDetailsPage;