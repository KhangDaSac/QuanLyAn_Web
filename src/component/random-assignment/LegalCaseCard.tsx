import { type LegalCaseResponse } from "../../types/response/legal-case/LegalCaseResponse";
import { StatusOfLegalCase } from "../../types/enum/StatusOfLegalCase";

interface LegalCaseCardProps {
  legalCase: LegalCaseResponse;
  onEdit?: (legalCase: LegalCaseResponse) => void;
  onDelete?: (legalCaseId: string) => void;
  onAssign?: (legalCase: LegalCaseResponse) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getStatusText = (status: string) => {
  // Nếu status đã là tiếng Việt thì trả về luôn
  if (Object.values(StatusOfLegalCase).includes(status as any)) {
    return status;
  }
  // Nếu status là key tiếng Anh thì chuyển sang tiếng Việt
  return StatusOfLegalCase[status as keyof typeof StatusOfLegalCase] || status;
};

const getStatusColor = (status: string) => {
  const statusText = getStatusText(status);

  switch (statusText) {
    case 'Tạm đình chỉ':
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        icon: 'text-gray-600'
      };
    case 'Quá hạn':
      return {
        bg: 'bg-red-50',
        text: 'text-red-600',
        icon: 'text-red-600'
      };
    case 'Án hủy':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        icon: 'text-purple-600'
      };
    case 'Án sửa':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        icon: 'text-blue-600'
      };
    case 'Chờ được phân công':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        icon: 'text-orange-600'
      };
    case 'Đang giải quyết':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        icon: 'text-yellow-600'
      };
    case 'Đã được giải quyết':
      return {
        bg: 'bg-green-50',
        text: 'text-green-600',
        icon: 'text-green-600'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        icon: 'text-gray-600'
      };
  }
};

const LegalCaseCard = ({ legalCase, onEdit, onDelete, onAssign }: LegalCaseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4 hover:shadow-xl transition-all duration-300">
      {/* Single Row Layout - Tất cả thông tin trên 1 hàng */}
      <div className="flex items-center justify-between space-x-6">
        
        {/* Thông tin cơ bản */}
        <div className="flex items-center space-x-6">
          {/* Số thụ lý - Font lớn hơn */}
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
              {legalCase.acceptanceNumber}
            </h3>
            <p className="text-lg text-gray-500">ID: {legalCase.legalCaseId}</p>
          </div>

          {/* Loại án - Font lớn hơn */}
          <div className="min-w-0">
            <span className={`
              text-xl px-6 py-3 rounded-full font-semibold whitespace-nowrap
              ${legalCase.legalRelationship.typeOfLegalCase.codeName == 'HS' ? 'bg-red-200 text-red-600'
                : legalCase.legalRelationship.typeOfLegalCase.codeName == 'DS' ? 'bg-blue-200 text-blue-600'
                  : legalCase.legalRelationship.typeOfLegalCase.codeName == 'HN' ? 'bg-pink-200 text-pink-600'
                    : legalCase.legalRelationship.typeOfLegalCase.codeName == 'LD' ? 'bg-purple-200 text-purple-600'
                      : legalCase.legalRelationship.typeOfLegalCase.codeName == 'KT' ? 'bg-orange-200 text-orange-600'
                        : legalCase.legalRelationship.typeOfLegalCase.codeName == 'HC' ? 'bg-green-200 text-green-600'
                          : legalCase.legalRelationship.typeOfLegalCase.codeName == 'PS' ? 'bg-yellow-200 text-yellow-600'
                            : legalCase.legalRelationship.typeOfLegalCase.codeName == 'BP' ? 'bg-stone-200 text-stone-600'
                              : 'bg-gray-200 text-gray-600'
              }
            `}>
              {legalCase.legalRelationship.typeOfLegalCase.typeOfLegalCaseName}
            </span>
          </div>

          {/* Thông tin bên liên quan - Font lớn hơn */}
          <div className="flex items-center space-x-4">
            <div className="text-center min-w-0">
              <p className="text-lg text-gray-500 whitespace-nowrap">
                {legalCase.legalRelationship.typeOfLegalCase.codeName == 'HS' ? 'Bị cáo' : 'Nguyên đơn'}
              </p>
              <p className="text-xl font-semibold text-gray-900 truncate max-w-32">
                {legalCase.plaintiff}
              </p>
            </div>
            
            {legalCase.legalRelationship.typeOfLegalCase.codeName != 'HS' && (
              <div className="text-center min-w-0">
                <p className="text-lg text-gray-500 whitespace-nowrap">Bị đơn</p>
                <p className="text-xl font-semibold text-gray-900 truncate max-w-32">
                  {legalCase.defendant}
                </p>
              </div>
            )}
          </div>

          {/* Quan hệ pháp luật - Font lớn hơn */}
          <div className="bg-blue-50 rounded-lg px-4 py-3 min-w-0">
            <p className="text-lg text-blue-600 whitespace-nowrap">
              {legalCase.legalRelationship.typeOfLegalCase.codeName == 'HS' ? 'Tội' : 'QHPL'}
            </p>
            <p className="text-xl font-semibold text-blue-900 truncate max-w-40">
              {legalCase.legalRelationship.legalRelationshipName}
            </p>
          </div>
        </div>

        {/* Ngày tháng và trạng thái */}
        <div className="flex items-center space-x-6">
          {/* Ngày thụ lý - Font lớn hơn */}
          <div className="text-center min-w-0">
            <p className="text-lg text-gray-500 whitespace-nowrap">Ngày thụ lý</p>
            <p className="text-xl font-semibold text-gray-900 whitespace-nowrap">
              {formatDate(legalCase.acceptanceDate)}
            </p>
          </div>
          
          {/* Ngày hết hạn - Font lớn hơn */}
          <div className="text-center min-w-0">
            <p className="text-lg text-gray-500 whitespace-nowrap">Ngày hết hạn</p>
            <p className="text-xl font-semibold text-red-600 whitespace-nowrap">
              {legalCase.expiredDate != null ? formatDate(legalCase.expiredDate) : "Chưa có"}
            </p>
          </div>

          {/* Trạng thái - Font lớn hơn */}
          <div className={`${getStatusColor(legalCase.statusOfLegalCase).bg} rounded-lg px-4 py-3 min-w-0`}>
            <div className="flex items-center space-x-2">
              <svg className={`w-6 h-6 ${getStatusColor(legalCase.statusOfLegalCase).icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`text-xl ${getStatusColor(legalCase.statusOfLegalCase).text} font-semibold whitespace-nowrap`}>
                {getStatusText(legalCase.statusOfLegalCase)}
              </p>
            </div>
          </div>

          {/* Thẩm phán (nếu có) - Font lớn hơn */}
          {legalCase.judge && (
            <div className="bg-green-50 rounded-lg px-4 py-3 min-w-0">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-lg text-green-600 font-medium whitespace-nowrap">Thẩm phán</p>
                  <p className="text-xl font-semibold text-green-900 truncate max-w-32">
                    {legalCase.judge.fullName}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions - Font lớn hơn */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit?.(legalCase)}
            className="flex items-center space-x-2 px-5 py-3 text-xl font-semibold border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Sửa</span>
          </button>

          <button
            onClick={() => onDelete?.(legalCase.legalCaseId)}
            className="flex items-center space-x-2 px-5 py-3 text-xl font-semibold border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Xóa</span>
          </button>

          {!legalCase.judge && (
            <button
              onClick={() => onAssign?.(legalCase)}
              className="flex items-center space-x-2 px-5 py-3 text-xl font-semibold border border-green-300 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span>Phân công</span>
            </button>
          )}

          <button
            onClick={() => onDelete?.(legalCase.legalCaseId)}
            className="flex items-center space-x-2 px-5 py-3 text-xl font-semibold border border-purple-300 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Thêm QĐ/TB</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalCaseCard;
