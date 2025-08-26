import { type LegalCaseResponse } from "../../types/response/legal-case/LegalCaseResponse";

interface LegalCaseCardProps {
  legalCase: LegalCaseResponse;
  onEdit?: (legalCase: LegalCaseResponse) => void;
  onDelete?: (legalCaseId: string) => void;
  onAssign?: (legalCase: LegalCaseResponse) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    WAITING_FOR_ASSIGNMENT: {
      label: 'Chờ phân công',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    ASSIGNED: {
      label: 'Đã phân công',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    IN_PROGRESS: {
      label: 'Đang xử lý',
      className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    COMPLETED: {
      label: 'Hoàn thành',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    CANCELLED: {
      label: 'Đã hủy',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const LegalCaseCard = ({ legalCase, onEdit, onDelete, onAssign }: LegalCaseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
      {/* Horizontal Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
        
        {/* Left Section - Main Info */}
        <div className="flex-1 space-y-3 lg:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Án số: {legalCase.acceptanceNumber}
              </h3>
              <p className="text-sm text-gray-500">ID: {legalCase.legalCaseId}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(legalCase.statusOfLegalCase)}
              <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full font-medium">
                {legalCase.legalRelationship.typeOfLegalCase.codeName}
              </span>
            </div>
          </div>

          {/* Parties - Horizontal on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Nguyên đơn</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{legalCase.plaintiff}</p>
                <p className="text-xs text-gray-600 truncate">{legalCase.plaintiffAddress}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Bị đơn</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{legalCase.defendant}</p>
                <p className="text-xs text-gray-600 truncate">{legalCase.defendantAddress}</p>
              </div>
            </div>
          </div>

          {/* Legal Relationship */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 mb-1">Quan hệ pháp luật</p>
            <p className="text-sm font-semibold text-blue-900 mb-1 line-clamp-2">
              {legalCase.legalRelationship.legalRelationshipName}
            </p>
            <p className="text-xs text-blue-700 truncate">
              {legalCase.legalRelationship.legalRelationshipGroup.legalRelationshipGroupName}
            </p>
          </div>
        </div>

        {/* Right Section - Dates & Status */}
        <div className="lg:w-72 space-y-3">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Ngày tiếp nhận</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(legalCase.acceptanceDate)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Ngày hết hạn</p>
              <p className="text-sm font-semibold text-red-600">
                {formatDate(legalCase.expiredDate)}
              </p>
            </div>
          </div>

          {/* Judge Assignment */}
          {legalCase.judge ? (
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-green-600 font-medium">Thẩm phán</p>
              </div>
              <p className="text-sm font-semibold text-green-900 truncate">{legalCase.judge.judgeName}</p>
              {legalCase.assignmentDate && (
                <p className="text-xs text-green-700">
                  {formatDate(legalCase.assignmentDate)}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-orange-600 font-medium">Chưa phân công</p>
              </div>
            </div>
          )}

          {/* Storage Date */}
          <div className="text-xs text-gray-500">
            <span>Lưu trữ: {formatDate(legalCase.storageDate.split(' ')[0])}</span>
          </div>
        </div>
      </div>

      {/* Actions - Always at bottom */}
      <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit?.(legalCase)}
          className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Sửa</span>
        </button>

        {!legalCase.judge && (
          <button
            onClick={() => onAssign?.(legalCase)}
            className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <span>Phân công</span>
          </button>
        )}

        <button
          onClick={() => onDelete?.(legalCase.legalCaseId)}
          className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
};

export default LegalCaseCard;
