import { type LegalCaseResponse } from "../../types/response/legal-case/LegalCaseResponse";

interface LegalCaseCardSimpleProps {
  legalCase: LegalCaseResponse;
  isSelected: boolean;
  onSelect: (caseId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const LegalCaseCardSimple = ({ legalCase, isSelected, onSelect }: LegalCaseCardSimpleProps) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border cursor-pointer transition-all duration-300 hover:shadow-xl ${
        isSelected
          ? 'border-red-500 bg-red-50'
          : 'border-gray-200 hover:border-gray-300'
      } p-4 md:p-6`}
      onClick={() => onSelect(legalCase.legalCaseId)}
    >
      {/* Header với checkbox */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Số thụ lý: {legalCase.acceptanceNumber}
          </h3>
          <p className="text-sm text-gray-500">ID: {legalCase.legalCaseId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(legalCase.legalCaseId)}
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Thông tin bên liên quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-1">
              {legalCase.legalRelationship.typeOfLegalCase.codeName == 'HS' ? 'Bị cáo' : 'Nguyên đơn'}
            </p>
            <p className="text-base font-semibold text-gray-900 truncate">{legalCase.plaintiff}</p>
            <p className="text-sm text-gray-600 truncate">{legalCase.plaintiffAddress}</p>
          </div>
        </div>

        {legalCase.legalRelationship.typeOfLegalCase.codeName != 'HS' && (
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-1">Bị đơn</p>
              <p className="text-base font-semibold text-gray-900 truncate">{legalCase.defendant}</p>
              <p className="text-sm text-gray-600 truncate">{legalCase.defendantAddress}</p>
            </div>
          </div>
        )}
      </div>

      {/* Quan hệ pháp luật */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-600 mb-1">
          {legalCase.legalRelationship.typeOfLegalCase.codeName == 'HS' ? 'Tội' : 'Quan hệ pháp luật'}
        </p>
        <p className="text-base font-semibold text-blue-900 mb-1">
          {legalCase.legalRelationship.legalRelationshipName}
        </p>
        <p className="text-sm text-blue-700 truncate">
          {legalCase.legalRelationship.legalRelationshipGroup.legalRelationshipGroupName}
        </p>
      </div>

      {/* Ngày tháng */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Ngày thụ lý</p>
          <p className="text-base font-semibold text-gray-900">
            {formatDate(legalCase.acceptanceDate)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Ngày hết hạn</p>
          <p className="text-base font-semibold text-red-600">
            {legalCase.expiredDate != null ? formatDate(legalCase.expiredDate) : "Chưa có"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalCaseCardSimple;
