import { type LegalCaseResponse } from "../../types/response/legal-case/LegalCaseResponse";

interface AssignedCaseCardProps {
  legalCase: LegalCaseResponse;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const AssignedCaseCard = ({ legalCase }: AssignedCaseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:border-gray-300 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Số thụ lý: {legalCase.acceptanceNumber}
          </h3>
          <p className="text-sm text-gray-500">ID: {legalCase.legalCaseId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Đã phân công
          </div>
        </div>
      </div>

      {/* Thông tin bên liên quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-17 h-17 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-1">
              {legalCase.legalRelationship.typeOfLegalCase.codeName == "HS"
                ? "Bị cáo"
                : "Nguyên đơn"}
            </p>
            <p className="text-base font-semibold text-gray-900 truncate">
              {legalCase.plaintiff}
            </p>
            <p className="text-sm text-gray-600 truncate">
              {legalCase.plaintiffAddress}
            </p>
          </div>
        </div>

        {legalCase.legalRelationship.typeOfLegalCase.codeName != "HS" && (
          <div className="flex items-start space-x-3">
            <div className="w-17 h-17 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-1">Bị đơn</p>
              <p className="text-base font-semibold text-gray-900 truncate">
                {legalCase.defendant}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {legalCase.defendantAddress}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quan hệ pháp luật */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-600 mb-1">
          {legalCase.legalRelationship.typeOfLegalCase.codeName == "HS"
            ? "Tội"
            : "Quan hệ pháp luật"}
        </p>
        <p className="text-base font-semibold text-blue-900 mb-1">
          {legalCase.legalRelationship.legalRelationshipName}
        </p>
        <p className="text-sm text-blue-700 truncate">
          {
            legalCase.legalRelationship.legalRelationshipGroup
              .legalRelationshipGroupName
          }
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        {/* Thông tin thẩm phán được phân công */}
        <div className="bg-purple-50 rounded-lg p-3 mb-4 flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <p className="text-sm text-purple-600 font-medium">Thẩm phán</p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-purple-900">
              {legalCase.judge?.fullName}
            </p>
            <p className="text-sm text-purple-700">
              ID: {legalCase.judge?.officerId}
            </p>
          </div>
        </div>

        {/* Thông tin Mediator */}
        <div className="bg-green-50 rounded-lg p-3 mb-4 flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-sm text-green-600 font-medium">Hòa giải viên</p>
          </div>
          {legalCase.mediator ? (
            <div className="space-y-1">
              <p className="text-base font-semibold text-green-900">
                {legalCase.mediator.fullName}
              </p>
              <p className="text-sm text-green-700">
                ID: {legalCase.mediator.officerId}
              </p>
              <p className="text-sm text-green-700">
                Email: {legalCase.mediator.email}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="text-sm text-gray-600 italic">
                Không có hòa giải viên
              </p>
            </div>
          )}
        </div>
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
          <p className="text-sm text-gray-500 mb-1">Ngày nhập kho</p>
          <p className="text-base font-semibold text-blue-600">
            {legalCase.storageDate != null
              ? formatDate(legalCase.storageDate)
              : "Chưa nhập kho"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignedCaseCard;
