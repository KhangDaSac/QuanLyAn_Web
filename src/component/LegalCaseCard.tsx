interface LegalRelationshipGroup {
  legalRelationshipGroupId: string;
  legalRelationshipGroupName: string;
  description: string;
}

interface TypeOfLegalCase {
  typeOfLegalCaseId: string;
  typeOfLegalCaseName: string;
  codeName: string;
}

interface LegalRelationship {
  legalRelationshipId: string;
  legalRelationshipName: string;
  typeOfLegalCase: TypeOfLegalCase;
  legalRelationshipGroup: LegalRelationshipGroup;
}

interface JudgeResponse {
  judgeId: string;
  judgeName: string;
  email: string;
  phone: string;
}

interface LegalCase {
  legalCaseId: string;
  acceptanceNumber: string;
  acceptanceDate: string;
  expiredDate: string;
  plaintiff: string;
  plaintiffAddress: string;
  defendant: string;
  defendantAddress: string;
  legalRelationship: LegalRelationship;
  storageDate: string;
  assignment: string | null;
  assignmentDate: string | null;
  statusOfLegalCase: string;
  judge: JudgeResponse | null;
}

interface LegalCaseCardProps {
  legalCase: LegalCase;
  onEdit?: (legalCase: LegalCase) => void;
  onDelete?: (legalCaseId: string) => void;
  onAssign?: (legalCase: LegalCase) => void;
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

const formatDateTime = (dateTimeString: string) => {
  return new Date(dateTimeString).toLocaleString('vi-VN');
};

const LegalCaseCard = ({ legalCase, onEdit, onDelete, onAssign }: LegalCaseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Án số: {legalCase.acceptanceNumber}
          </h3>
          <p className="text-sm text-gray-500">ID: {legalCase.legalCaseId}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(legalCase.statusOfLegalCase)}
          <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full font-medium">
            {legalCase.legalRelationship.typeOfLegalCase.codeName}
          </span>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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

      {/* Parties */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Nguyên đơn</p>
            <p className="text-sm font-semibold text-gray-900">{legalCase.plaintiff}</p>
            <p className="text-xs text-gray-600">{legalCase.plaintiffAddress}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Bị đơn</p>
            <p className="text-sm font-semibold text-gray-900">{legalCase.defendant}</p>
            <p className="text-xs text-gray-600">{legalCase.defendantAddress}</p>
          </div>
        </div>
      </div>

      {/* Legal Relationship */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-blue-600 mb-1">Quan hệ pháp luật</p>
        <p className="text-sm font-semibold text-blue-900 mb-1">
          {legalCase.legalRelationship.legalRelationshipName}
        </p>
        <p className="text-xs text-blue-700">
          {legalCase.legalRelationship.legalRelationshipGroup.legalRelationshipGroupName}
        </p>
      </div>

      {/* Judge Assignment */}
      {legalCase.judge ? (
        <div className="bg-green-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-green-600 font-medium">Thẩm phán được phân công</p>
          </div>
          <p className="text-sm font-semibold text-green-900">{legalCase.judge.judgeName}</p>
          {legalCase.assignmentDate && (
            <p className="text-xs text-green-700">
              Phân công: {formatDateTime(legalCase.assignmentDate)}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-orange-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-orange-600 font-medium">Chưa phân công thẩm phán</p>
          </div>
        </div>
      )}

      {/* Storage Date */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Lưu trữ: {formatDateTime(legalCase.storageDate)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
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
