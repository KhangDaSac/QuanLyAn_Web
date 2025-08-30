import { type JudgeResponse } from "../../types/response/judge/JudgeResponse";
import { StatusOfJudge } from "../../types/enum/StatusOfJudge";

interface JudgeCardProps {
    judge: JudgeResponse;
    onEdit?: (judge: JudgeResponse) => void;
    onDelete?: (judgeId: string) => void;
}

const JudgeCard = ({ judge, onEdit, onDelete }: JudgeCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case StatusOfJudge.WORKING:
                return 'bg-green-100 text-green-800';
            case StatusOfJudge.NOT_WORKING:
                return 'bg-gray-100 text-gray-800';
            case StatusOfJudge.ON_BUSINESS_TRIP:
                return 'bg-blue-100 text-blue-800';
            case StatusOfJudge.ON_LEAVE:
                return 'bg-yellow-100 text-yellow-800';
            case StatusOfJudge.DISCIPLINED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        // Vì status đã là giá trị tiếng Việt, chỉ cần return luôn
        return status;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3 lg:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                {judge.fullName}
                            </h3>
                            <p className="text-sm text-gray-500">ID: {judge.judgeId}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-md px-5 py-1 rounded-full font-medium ${getStatusColor(judge.statusOfJudge)}`}>
                                {getStatusText(judge.statusOfJudge)}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Email</span>
                                <span className="text-sm md:text-base text-gray-900 font-medium">
                                    {judge.email}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Số án tối đa</span>
                                <span className="text-sm md:text-base text-gray-900 font-medium">
                                    {judge.maxNumberOfLegalCase === -1 ? 'Không giới hạn' : judge.maxNumberOfLegalCase}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Số án hiện tại</span>
                                <span className="text-sm md:text-base text-gray-900 font-medium">
                                    {judge.numberOfLegalCases}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Tỷ lệ công việc</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm md:text-base text-gray-900 font-medium">
                                        {judge.maxNumberOfLegalCase === -1 
                                            ? `${judge.numberOfLegalCases} án` 
                                            : `${((judge.numberOfLegalCases / judge.maxNumberOfLegalCase) * 100).toFixed(1)}%`
                                        }
                                    </span>
                                    {judge.maxNumberOfLegalCase !== -1 && (
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${(judge.numberOfLegalCases / judge.maxNumberOfLegalCase) > 0.8
                                                    ? 'bg-red-500'
                                                    : (judge.numberOfLegalCases / judge.maxNumberOfLegalCase) > 0.6
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                    }`}
                                                style={{
                                                    width: `${Math.min((judge.numberOfLegalCases / judge.maxNumberOfLegalCase) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 justify-end lg:justify-start">
                        {onEdit && (
                            <button
                                onClick={() => onEdit?.(judge)}
                                className="flex items-center space-x-1 px-3 py-2 text-md font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="text-md">Sửa</span>
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={() => onDelete?.(judge.judgeId)}
                                className="flex items-center space-x-1 px-3 py-2 text-md font-medium border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Xóa</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JudgeCard;
