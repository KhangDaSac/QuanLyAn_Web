import { useState, useEffect } from "react";
import ComboboxSearch, { type Option } from '../component/basic-component/ComboboxSearch';
import LegalCaseCardSimple from '../component/random-assignment/LegalCaseCardSimple';
import JudgeCardSimple from '../component/random-assignment/JudgeCardSimple';
import Pagination from "../component/basic-component/Pagination";
import { LegalCaseService } from "../services/LegalCaseService";
import { JudgeService } from "../services/JudgeService";
import { LegalRelationshipGroupService } from "../services/LegalRelationshipGroupService";
import type { LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import type { JudgeResponse } from "../types/response/judge/JudgeResponse";
import type { LegalRelationshipGroupResponse } from "../types/response/legal-relationship-group/LegalRelationshipGroupResponse";
import type { AssignmentListRequest } from "../types/request/legal-case/AssignmentListReques";
import { ToastContainer, useToast } from "../component/basic-component/Toast";

const RandomAssignment = () => {
    const { toasts, addToast, removeToast } = useToast();
    const [legalRelationshipGroupOptions, setLegalRelationshipGroupOptions] = useState<Option[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");
    const [hasMediator, setHasMediator] = useState<boolean>(false);
    const [pendingCases, setPendingCases] = useState<LegalCaseResponse[]>([]);
    const [selectedCases, setSelectedCases] = useState<string[]>([]);
    const [assignableJudges, setAssignableJudges] = useState<JudgeResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    
    // Pagination state
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
        isFirst: true,
        isLast: false,
    });

    // Separate state for sort criteria
    const [sortBy, setSortBy] = useState("acceptanceDate");

    // Page size options
    const pageSizeOptions: Option[] = [
        { value: "5", label: "5" },
        { value: "10", label: "10" },
        { value: "20", label: "20" },
        { value: "50", label: "50" },
    ];

    // Sort by options
    const sortByOptions: Option[] = [
        { value: "acceptanceDate", label: "Ngày thụ lý" },
        { value: "acceptanceNumber", label: "Số thụ lý" },
        { value: "plaintiff", label: "Nguyên đơn" },
        { value: "defendant", label: "Bị đơn" },
    ];
    useEffect(() => {
        loadLegalRelationshipGroups();
        loadAllJudges(); 
    }, []);

    // Keyboard navigation for pagination
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle arrow keys when not typing in input fields
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            switch (event.key) {
                case "ArrowLeft":
                    event.preventDefault();
                    if (pagination.hasPrevious) {
                        handlePageChange(pagination.page - 1);
                    }
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    if (pagination.hasNext) {
                        handlePageChange(pagination.page + 1);
                    }
                    break;
                case "Home":
                    event.preventDefault();
                    if (!pagination.isFirst) {
                        handlePageChange(0);
                    }
                    break;
                case "End":
                    event.preventDefault();
                    if (!pagination.isLast) {
                        handlePageChange(pagination.totalPages - 1);
                    }
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [
        pagination.page,
        pagination.hasNext,
        pagination.hasPrevious,
        pagination.isFirst,
        pagination.isLast,
        pagination.totalPages,
    ]);

    const loadLegalRelationshipGroups = async () => {
        try {
            const response = await LegalRelationshipGroupService.getAll();
            if (response.success && response.data) {
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

    const searchPendingCases = async (page: number = 0, customSize?: number) => {
        // Validate input theo quy tắc: có mediator HOẶC có legalRelationshipGroupId
        if (hasMediator && selectedGroupId) {
            addToast({
                title: "Thông báo",
                message: "Chỉ có thể chọn một trong hai: có mediator hoặc nhóm quan hệ pháp luật",
                type: "warning"
            });
            return;
        }

        if (!hasMediator && !selectedGroupId) {
            addToast({
                title: "Thông báo",
                message: "Vui lòng chọn có mediator hoặc chọn nhóm quan hệ pháp luật",
                type: "warning"
            });
            return;
        }

        setSearchLoading(true);
        try {
            const searchRequest: AssignmentListRequest = {
                isMediator: hasMediator,
                legalRelationshipGroupId: hasMediator ? null : selectedGroupId
            };
            const response = await LegalCaseService.getAssignmentList(
                searchRequest, 
                page, 
                customSize || pagination.size, 
                sortBy
            );
            if (response.success && response.data) {
                // Use server-side pagination data
                setPendingCases(response.data.content);
                setPagination({
                    page: response.data.number,
                    size: response.data.size,
                    totalElements: response.data.totalElements || response.data.numberOfElement,
                    totalPages: response.data.totalPages || Math.ceil((response.data.totalElements || response.data.numberOfElement) / response.data.size),
                    hasNext: response.data.hasNext,
                    hasPrevious: response.data.hasPrevious,
                    isFirst: response.data.isFirst,
                    isLast: response.data.isLast,
                });
                
                setSelectedCases([]);
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

    // Pagination handlers
    const handlePageChange = (page: number) => {
        searchPendingCases(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPagination((prev) => ({ ...prev, page: 0, size }));
        // Use the new size directly in the search call
        searchPendingCases(0, size);
    };

    const handleSortByChange = (newSortBy: string) => {
        setSortBy(newSortBy);
        setPagination((prev) => ({ ...prev, page: 0 }));
        searchPendingCases(0);
    };

    const handleSearchClick = () => {
        searchPendingCases(0);
    };

    const loadAllJudges = async () => {
        setLoading(true);
        try {
            const response = await JudgeService.getAssignableJudges();
            if (response.success && response.data) {
                setAssignableJudges(response.data);
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
          const request = {
              legalCaseIds: selectedCases
          };
            const response = await LegalCaseService.randomAssignment(request);
            if (response.success) {
                addToast({
                    title: "Thành công",
                    message: `Đã phân công thành công`,
                    type: "success"
                });
                setPendingCases([]);
                setSelectedCases([]);
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
        // Select all cases on current page
        const currentPageIds = pendingCases.map(c => c.legalCaseId);
        setSelectedCases(prev => {
            const newSelected = [...prev];
            currentPageIds.forEach(id => {
                if (!newSelected.includes(id)) {
                    newSelected.push(id);
                }
            });
            return newSelected;
        });
    };

    const handleDeselectAll = () => {
        // Deselect all cases on current page
        const currentPageIds = pendingCases.map(c => c.legalCaseId);
        setSelectedCases(prev => prev.filter(id => !currentPageIds.includes(id)));
    };

    const handleDeselectAllPages = () => {
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
                                Phân công án ngẫu nhiên
                            </h1>
                            <p className="text-gray-600">
                                Tìm kiếm và phân công án chờ phân công cho thẩm phán một cách ngẫu nhiên
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="text-sm text-gray-500">
                                <span className="font-medium">Tổng số án chờ:</span>
                                <span className="ml-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
                                    {pagination.totalElements > 0 ? pagination.totalElements : pendingCases.length}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-medium">Đã chọn:</span>
                                <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                    {selectedCases.length}
                                </span>
                            </div>
                            {pagination.totalElements > pagination.size && (
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">Trang:</span>
                                    <span className="ml-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full font-semibold">
                                        {pagination.page + 1}/{pagination.totalPages}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bộ lọc tìm kiếm */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc tìm kiếm</h3>

                    <div className="space-y-4">
                        {/* Radio buttons cho loại tìm kiếm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Loại tìm kiếm <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="searchType"
                                        checked={!hasMediator}
                                        onChange={() => {
                                            setHasMediator(false);
                                            setSelectedGroupId("");
                                        }}
                                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Theo nhóm quan hệ pháp luật
                                    </span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="searchType"
                                        checked={hasMediator}
                                        onChange={() => {
                                            setHasMediator(true);
                                            setSelectedGroupId("");
                                        }}
                                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Có hòa giải viên
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                            <div className="lg:col-span-2">
                                {!hasMediator && (
                                    <>
                                        <ComboboxSearch
                                            options={legalRelationshipGroupOptions}
                                            value={selectedGroupId}
                                            onChange={setSelectedGroupId}
                                            placeholder="Chọn nhóm quan hệ pháp luật"
                                        />
                                    </>
                                )}
                                {hasMediator && (
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-blue-800">
                                            Sẽ tìm kiếm tất cả án có hòa giải viên
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSearchClick}
                                disabled={searchLoading || (!hasMediator && !selectedGroupId)}
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
                </div>

                {/* Pagination Component */}
                {!searchLoading && pendingCases.length > 0 && pagination.totalPages > 1 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalElements={pagination.totalElements}
                        pageSize={pagination.size}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                        isFirst={pagination.isFirst}
                        isLast={pagination.isLast}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onSortChange={handleSortByChange}
                        pageSizeOptions={pageSizeOptions}
                        sortOptions={sortByOptions}
                        currentSort={sortBy}
                        showPageInfo={true}
                        showPageSizeSelector={true}
                        showSortSelector={true}
                        className="mb-4"
                    />
                )}

                {/* Danh sách án chờ phân công */}
                {pendingCases.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Danh sách án chờ phân công
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleSelectAll}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Chọn trang này
                                </button>
                                <button
                                    onClick={handleDeselectAll}
                                    className="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Bỏ chọn trang này
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingCases.map((legalCase) => (
                                <LegalCaseCardSimple
                                    key={legalCase.legalCaseId}
                                    legalCase={legalCase}
                                    isSelected={selectedCases.includes(legalCase.legalCaseId)}
                                    onSelect={handleSelectCase}
                                />
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

                {/* Danh sách thẩm phán đủ điều kiện - Luôn hiển thị */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Thẩm phán đủ điều kiện ({assignableJudges.length})
                        </h2>
                        
                        <button
                            onClick={handleRandomAssignment}
                            disabled={loading || selectedCases.length === 0 || assignableJudges.length === 0}
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

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải danh sách thẩm phán...</p>
                        </div>
                    ) : assignableJudges.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            {selectedCases.length === 0 
                                ? "Chọn án để xem thẩm phán đủ điều kiện phân công." 
                                : "Không có thẩm phán đủ điều kiện phân công cho các án đã chọn."
                            }
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {assignableJudges.map((judge) => (
                                <JudgeCardSimple
                                    key={judge.officerId}
                                    judge={judge}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
        </div>
    );
};

export default RandomAssignment;
