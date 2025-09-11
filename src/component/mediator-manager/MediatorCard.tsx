import { type MediatorResponse } from "../../types/response/mediator/MediatorResponse";
import { StatusOfOfficer } from "../../types/enum/StatusOfOfficer";

interface MediatorCardProps {
    mediator: MediatorResponse;
    onEdit?: (mediator: MediatorResponse) => void;
    onDelete?: (mediatorId: string) => void;
}

const MediatorCard = ({ mediator, onEdit, onDelete }: MediatorCardProps) => {
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
        return StatusOfOfficer[status as keyof typeof StatusOfOfficer] || status;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
            {/* Header với tên hòa giải viên */}
            <div className="flex items-start space-x-4 mb-4">
                <div className="w-15 h-15 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                        {mediator.fullName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {mediator.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {mediator.officerId}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm px-4 py-2 rounded-full font-medium border ${getStatusColor(mediator.statusOfOfficer)}`}>
                        {getStatusText(mediator.statusOfOfficer)}
                    </span>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-xs text-green-600 font-medium">Thông tin cá nhân</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                            {mediator.lastName} {mediator.firstName}
                        </p>
                        <p className="text-xs text-gray-600 break-all">
                            Email: {mediator.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                {onEdit && (
                    <button
                        onClick={() => onEdit(mediator)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Sửa</span>
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(mediator.officerId)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Xóa</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediatorCard;
