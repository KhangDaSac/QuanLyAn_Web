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
            case 'WORKING':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'NOT_WORKING':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'ON_BUSINESS_TRIP':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ON_LEAVE':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'DISCIPLINED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        return StatusOfJudge[status as keyof typeof StatusOfJudge] || status;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4 hover:shadow-xl transition-all duration-300">
            {/* Single Row Layout - 1 thẩm phán 1 dòng */}
            <div className="flex items-center justify-between space-x-8">
                
                {/* Thông tin cá nhân */}
                <div className="flex items-center space-x-6">
                    <div className="min-w-0">
                        <h3 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                            {judge.fullName}
                        </h3>
                        <p className="text-lg text-gray-500">ID: {judge.judgeId}</p>
                        <p className="text-lg text-gray-600 truncate max-w-64">{judge.email}</p>
                    </div>
                    
                    <span className={`text-xl px-6 py-3 rounded-full font-semibold border whitespace-nowrap ${getStatusColor(judge.statusOfJudge)}`}>
                        {getStatusText(judge.statusOfJudge)}
                    </span>
                </div>

                {/* Thống kê theo thứ tự: Số án tối đa, Số án đang đảm nhận, Số án tạm đình chỉ, Số án quá hạn, Số án hủy + sửa */}
                <div className="flex items-center space-x-8">
                    {/* 1. Số án tối đa */}
                    <div className="text-center bg-blue-50 rounded-lg px-4 py-3">
                        <p className="text-lg text-blue-600 font-medium whitespace-nowrap">Số án tối đa</p>
                        <p className="text-2xl font-bold text-blue-700">
                            {judge.maxNumberOfLegalCase === -1 ? '∞' : judge.maxNumberOfLegalCase}
                        </p>
                    </div>
                    
                    {/* 2. Số án đang đảm nhận */}
                    <div className="text-center bg-green-50 rounded-lg px-4 py-3">
                        <p className="text-lg text-green-600 font-medium whitespace-nowrap">Đang đảm nhận</p>
                        <p className="text-2xl font-bold text-green-700">
                            {judge.numberOfLegalCases}
                        </p>
                    </div>
                    
                    {/* 3. Số án tạm đình chỉ */}
                    <div className="text-center bg-orange-50 rounded-lg px-4 py-3">
                        <p className="text-lg text-orange-600 font-medium whitespace-nowrap">Tạm đình chỉ</p>
                        <p className="text-2xl font-bold text-orange-700">
                            {judge.numberOfTemporarySuspension}
                        </p>
                    </div>
                    
                    {/* 4. Số án quá hạn */}
                    <div className="text-center bg-red-50 rounded-lg px-4 py-3">
                        <p className="text-lg text-red-600 font-medium whitespace-nowrap">Quá hạn</p>
                        <p className="text-2xl font-bold text-red-700">
                            {judge.numberOfOverdue}
                        </p>
                    </div>
                    
                    {/* 5. Số án hủy + sửa */}
                    <div className="text-center bg-yellow-50 rounded-lg px-4 py-3">
                        <p className="text-lg text-yellow-600 font-medium whitespace-nowrap">Hủy + Sửa</p>
                        <p className="text-2xl font-bold text-yellow-700">
                            {judge.numberOfCanceledAndEdited}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    {onEdit && (
                        <button
                            onClick={() => onEdit?.(judge)}
                            className="flex items-center space-x-2 px-5 py-3 text-xl font-semibold border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Sửa</span>
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={() => onDelete?.(judge.judgeId)}
                            className="flex items-center space-x-2 px-5 py-3 text-xl font-semibold border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Xóa</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};export default JudgeCard;
