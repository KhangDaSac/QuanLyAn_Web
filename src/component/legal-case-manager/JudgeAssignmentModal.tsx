import { useState, useEffect } from 'react';
import type { JudgeResponse } from '../../types/response/judge/JudgeResponse';
import type { JudgeSearchRequest } from '../../types/request/judge/JudgeSearchRequest';
import { JudgeService } from '../../services/JudgeService';
import type { LegalCaseResponse } from '../../types/response/legal-case/LegalCaseResponse';
import { StatusOfOfficer } from '../../types/enum/StatusOfOfficer';

interface JudgeAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (judgeId: string) => void;
    legalCase: LegalCaseResponse | null;
    isLoading?: boolean;
}

const isOfficerWorking = (status: string | StatusOfOfficer): boolean => {
    // Kiểm tra cả key và value của enum
    return status === 'WORKING' || status === StatusOfOfficer.WORKING || status === 'Đang làm việc';
};

const JudgeAssignmentModal = ({
    isOpen,
    onClose,
    onAssign,
    legalCase,
    isLoading = false
}: JudgeAssignmentModalProps) => {
    const [judges, setJudges] = useState<JudgeResponse[]>([]);
    const [selectedJudge, setSelectedJudge] = useState<JudgeResponse | null>(null);
    const [searchParams, setSearchParams] = useState<JudgeSearchRequest>({
        officerId: null,
        fullName: null,
        statusOfOfficer: null
    });
    const [isSearching, setIsSearching] = useState(false);

    // Ngăn cuộn trang khi modal mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            loadJudges();
        } else {
            document.body.style.overflow = 'unset';
            setSelectedJudge(null);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const loadJudges = async () => {
        setIsSearching(true);
        try {
            const response = await JudgeService.search(searchParams);
            if (response.success && response.data) {
                const availableJudges = response.data.content.filter(judge => 
                    isOfficerWorking(judge.statusOfOfficer as any) && 
                    (judge.maxNumberOfLegalCase === -1 || judge.numberOfLegalCases < judge.maxNumberOfLegalCase)
                );
                setJudges(availableJudges);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách thẩm phán:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = () => {
        loadJudges();
    };

    const handleAssign = () => {
        if (selectedJudge) {
            onAssign(selectedJudge.officerId);
        }
    };

    const handleInputChange = (field: keyof JudgeSearchRequest, value: string) => {
        setSearchParams(prev => ({
            ...prev,
            [field]: value || null
        }));
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] relative z-[10000] mx-auto overflow-hidden"
            >
                <div className="overflow-y-auto max-h-[90vh]">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Phân công thẩm phán</h2>
                                <p className="text-gray-500 mt-1">
                                    Số thụ lý: <span className="font-medium">{legalCase?.acceptanceNumber}</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Form */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tìm kiếm thẩm phán</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã thẩm phán
                                </label>
                                <input
                                    type="text"
                                    value={searchParams.officerId || ''}
                                    onChange={(e) => handleInputChange('officerId', e.target.value)}
                                    placeholder="Nhập mã thẩm phán"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ tên
                                </label>
                                <input
                                    type="text"
                                    value={searchParams.fullName || ''}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    placeholder="Nhập họ tên thẩm phán"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Judge List */}
                    <div className="p-6">
                        {isSearching ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Đang tìm kiếm thẩm phán...</p>
                            </div>
                        ) : judges.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thẩm phán</h3>
                                <p className="text-gray-500">Không có thẩm phán nào phù hợp với điều kiện tìm kiếm</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {judges.map((judge) => (
                                    <div
                                        key={judge.officerId}
                                        onClick={() => setSelectedJudge(judge)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedJudge?.officerId === judge.officerId
                                                ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                                                : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{judge.fullName}</h4>
                                                        <p className="text-sm text-gray-500">Mã: {judge.officerId}</p>
                                                        <p className="text-sm text-gray-500">Email: {judge.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right mr-4">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Đang xử lý: <span className="font-medium">
                                                        {judge.maxNumberOfLegalCase === -1 
                                                            ? `${judge.numberOfLegalCases} án` 
                                                            : `${judge.numberOfLegalCases}/${judge.maxNumberOfLegalCase} án`
                                                        }
                                                    </span>
                                                </p>
                                                {judge.maxNumberOfLegalCase !== -1 && (
                                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${
                                                                (judge.numberOfLegalCases / judge.maxNumberOfLegalCase) > 0.8 
                                                                    ? 'bg-red-500' 
                                                                    : (judge.numberOfLegalCases / judge.maxNumberOfLegalCase) > 0.6 
                                                                    ? 'bg-yellow-500' 
                                                                    : 'bg-green-500'
                                                            }`}
                                                            style={{ width: `${(judge.numberOfLegalCases / judge.maxNumberOfLegalCase) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                                {judge.maxNumberOfLegalCase === -1 && (
                                                    <div className="w-32 h-2 flex items-center justify-center">
                                                        <span className="text-xs text-green-600 font-medium">Không giới hạn</span>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedJudge?.officerId === judge.officerId && (
                                                <div className="ml-2">
                                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedJudge || isLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isLoading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                )}
                                <span>{isLoading ? 'Đang phân công...' : 'Phân công'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JudgeAssignmentModal;
