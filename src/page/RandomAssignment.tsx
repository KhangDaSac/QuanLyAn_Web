import { useState, useEffect } from "react";
import ComboboxSearch, { type Option } from '../component/basic-component/ComboboxSearch';
import RandomAssignmentService from "../services/RandomAssignmentService";
import { LegalRelationshipGroupService } from "../services/LegalRelationshipGroupService";
import type { LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import type { JudgeResponse } from "../types/response/judge/JudgeResponse";
import type { LegalRelationshipGroupResponse } from "../types/response/legal-case/LegalRelationshipGroup";
import { StatusOfLegalCase } from "../types/enum/StatusOfLegalCase";
import { ToastContainer, useToast } from "../component/basic-component/Toast";

const RandomAssignment = () => {
    const { toasts, addToast, removeToast } = useToast();
    const [legalRelationshipGroups, setLegalRelationshipGroups] = useState<LegalRelationshipGroupResponse[]>([]);
    const [legalRelationshipGroupOptions, setLegalRelationshipGroupOptions] = useState<Option[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");
    const [pendingCases, setPendingCases] = useState<LegalCaseResponse[]>([]);
    const [selectedCases, setSelectedCases] = useState<string[]>([]);
    const [assignableJudges, setAssignableJudges] = useState<JudgeResponse[]>([]);
    const [assignedCases, setAssignedCases] = useState<LegalCaseResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showJudges, setShowJudges] = useState(false);

    // Load danh sách nhóm quan hệ pháp luật khi component mount
    useEffect(() => {
        loadLegalRelationshipGroups();
    }, []);

    const loadLegalRelationshipGroups = async () => {
        try {
            const response = await LegalRelationshipGroupService.getAll();
            if (response.success && response.data) {
                setLegalRelationshipGroups(response.data);
                setLegalRelationshipGroupOptions(
                    response.data.map((group: LegalRelationshipGroupResponse) => ({
                        value: group.legalRelationshipGroupId,
                        label: group.legalRelationshipGroupName
                    }))
                );
            }
        } catch (error) {
            console.error("Error loading legal relationship groups:", error);
            addToast({
                title: "Lỗi",
                message: "Không thể tải danh sách nhóm quan hệ pháp luật",
                type: "error"
            });
        }
    };

    const searchPendingCases = async () => {
        if (!selectedGroupId) {
            addToast({
                title: "Thông báo",
                message: "Vui lòng chọn nhóm quan hệ pháp luật",
                type: "warning"
            });
            return;
        }

        setSearchLoading(true);
        try {
            const searchRequest = {
                acceptanceNumber: null,
                startAcceptanceDate: null,
                endAcceptanceDate: null,
                plaintiff: null,
                plaintiffAddress: null,
                defendant: null,
                defendantAddress: null,
                typeOfLegalCaseId: null,
                legalRelationshipId: null,
                legalRelationshipGroupId: selectedGroupId,
                statusOfLegalCase: "WAITING_FOR_ASSIGNMENT" as StatusOfLegalCase, // Cast string key thành type
                judgeName: null,
                batchId: null,
                storageDate: null
            };

            const response = await RandomAssignmentService.searchPendingCases(searchRequest);
            if (response.success && response.data) {
                setPendingCases(response.data);
                setSelectedCases([]);
                setShowJudges(false);
                setAssignedCases([]);
            } else {
                addToast({
                    title: "Thông báo",
                    message: response.message || "Không thể tìm kiếm án",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Error searching pending cases:", error);
            addToast({
                title: "Lỗi",
                message: "Lỗi khi tìm kiếm án chờ phân công",
                type: "error"
            });
        } finally {
            setSearchLoading(false);
        }
    };

    const loadAssignableJudges = async () => {
        if (selectedCases.length === 0) {
            addToast({
                title: "Thông báo",
                message: "Vui lòng chọn ít nhất một án để phân công",
                type: "warning"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await RandomAssignmentService.getAssignableJudges();
            if (response.success && response.data) {
                setAssignableJudges(response.data);
                setShowJudges(true);
            } else {
                addToast({
                    title: "Lỗi",
                    message: response.message || "Không thể tải danh sách thẩm phán",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Error loading assignable judges:", error);
            addToast({
                title: "Lỗi",
                message: "Lỗi khi tải danh sách thẩm phán",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRandomAssignment = async () => {
        if (selectedCases.length === 0) {
            addToast({
                title: "Thông báo",
                message: "Vui lòng chọn ít nhất một án để phân công",
                type: "warning"
            });
            return;
        }

        if (assignableJudges.length === 0) {
            addToast({
                title: "Thông báo",
                message: "Không có thẩm phán nào đủ điều kiện phân công",
                type: "warning"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await RandomAssignmentService.assignRandomly(selectedCases);
            if (response.success && response.data) {
                setAssignedCases(response.data);
                addToast({
                    title: "Thành công",
                    message: `Đã phân công thành công ${response.data.length} án`,
                    type: "success"
                });
                
                // Reset lại danh sách sau khi phân công thành công
                setPendingCases([]);
                setSelectedCases([]);
                setShowJudges(false);
                setAssignableJudges([]);
            } else {
                addToast({
                    title: "Lỗi",
                    message: response.message || "Không thể phân công án",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Error assigning cases randomly:", error);
            addToast({
                title: "Lỗi",
                message: "Lỗi khi phân công án ngẫu nhiên",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCase = (caseId: string) => {
        setSelectedCases(prev => 
            prev.includes(caseId) 
                ? prev.filter(id => id !== caseId)
                : [...prev, caseId]
        );
    };

    const handleSelectAll = () => {
        setSelectedCases(pendingCases.map(c => c.legalCaseId));
    };

    const handleDeselectAll = () => {
        setSelectedCases([]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Phân Công Án Ngẫu Nhiên
                            </h1>
                            <p className="text-gray-600">
                                Tìm kiếm và phân công án chờ phân công cho thẩm phán một cách ngẫu nhiên
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="text-sm text-gray-500">
                                <span className="font-medium">Tổng số án chờ:</span>
                                <span className="ml-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
                                    {pendingCases.length}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-medium">Đã chọn:</span>
                                <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                    {selectedCases.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bộ lọc tìm kiếm */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nhóm quan hệ pháp luật <span className="text-red-500">*</span>
                            </label>
                            <ComboboxSearch
                                options={legalRelationshipGroupOptions}
                                value={selectedGroupId}
                                onChange={setSelectedGroupId}
                                placeholder="Chọn nhóm quan hệ pháp luật"
                            />
                        </div>
                        
                        <button
                            onClick={searchPendingCases}
                            disabled={searchLoading || !selectedGroupId}
                            className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            {searchLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Đang tìm...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Tìm kiếm</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            {/* Danh sách án chờ phân công */}
            {pendingCases.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Danh sách án chờ phân công ({pendingCases.length})
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleSelectAll}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Chọn tất cả
                            </button>
                            <button
                                onClick={handleDeselectAll}
                                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                Bỏ chọn tất cả
                            </button>
                            <button
                                onClick={loadAssignableJudges}
                                disabled={selectedCases.length === 0 || loading}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Xem thẩm phán ({selectedCases.length})
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingCases.map((legalCase) => (
                            <div
                                key={legalCase.legalCaseId}
                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                    selectedCases.includes(legalCase.legalCaseId)
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleSelectCase(legalCase.legalCaseId)}
                            >
                                {/* Sử dụng LegalCaseCard cho bố cục đẹp hơn */}
                                {/* <LegalCaseCard legalCase={legalCase} /> */}
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        {legalCase.acceptanceNumber}
                                    </h3>
                                    <input
                                        type="checkbox"
                                        checked={selectedCases.includes(legalCase.legalCaseId)}
                                        onChange={() => handleSelectCase(legalCase.legalCaseId)}
                                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Nguyên đơn: {legalCase.plaintiff}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Bị đơn: {legalCase.defendant}
                                </p>
                                <div className="text-xs text-gray-500">
                                    <p>Ngày tiếp nhận: {new Date(legalCase.acceptanceDate).toLocaleDateString('vi-VN')}</p>
                                    <p>Quan hệ pháp luật: {legalCase.legalRelationship.legalRelationshipName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading khi đang tìm kiếm */}
            {searchLoading && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tìm kiếm...</h3>
                        <p className="text-gray-600">Vui lòng chờ trong giây lát.</p>
                    </div>
                </div>
            )}

            {/* Message khi không có dữ liệu */}
            {searchLoading === false && pendingCases.length === 0 && selectedGroupId && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy án chờ phân công</h3>
                        <p className="text-gray-600">Không có án nào chờ phân công cho nhóm quan hệ pháp luật đã chọn.</p>
                    </div>
                </div>
            )}

            {/* Danh sách thẩm phán đủ điều kiện */}
            {showJudges && assignableJudges.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Thẩm phán đủ điều kiện ({assignableJudges.length})
                        </h2>
                        
                        <button
                            onClick={handleRandomAssignment}
                            disabled={loading || selectedCases.length === 0}
                            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Đang phân công...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Phân công ngẫu nhiên</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {assignableJudges.map((judge) => (
                            <div
                                key={judge.judgeId}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {judge.fullName}
                                </h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Email: {judge.email}</p>
                                    <p>Số án hiện tại: {judge.numberOfLegalCases}</p>
                                    <p>Số án tối đa: {judge.maxNumberOfLegalCase === -1 ? 'Không giới hạn' : judge.maxNumberOfLegalCase}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Kết quả phân công */}
            {assignedCases.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Kết quả phân công ({assignedCases.length} án)
                    </h2>
                    
                    <div className="space-y-4">
                        {assignedCases.map((legalCase) => (
                            <div
                                key={legalCase.legalCaseId}
                                className="border border-green-200 rounded-lg p-4 bg-green-50"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {legalCase.acceptanceNumber}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Nguyên đơn: {legalCase.plaintiff}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Bị đơn: {legalCase.defendant}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-800">
                                            Thẩm phán: {legalCase.judge?.fullName}
                                        </p>
                                        <p className="text-sm text-green-600">
                                            Email: {legalCase.judge?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </div>
    );
};

export default RandomAssignment;
