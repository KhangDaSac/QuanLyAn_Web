import { type LegalCaseResponse } from "../../types/response/legal-case/LegalCaseResponse";
import { LegalCaseStatus } from "../../types/enum/LegalCaseStatus";

interface LegalCaseCardProps {
  legalCase: LegalCaseResponse;
  onEdit?: (legalCase: LegalCaseResponse) => void;
  onDelete?: (legalCaseId: string) => void;
  onAssign?: (legalCase: LegalCaseResponse) => void;
  onViewDetails?: (legalCase: LegalCaseResponse) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getStatusText = (status: string) => {
  if (Object.values(LegalCaseStatus).includes(status as LegalCaseStatus)) {
    return status;
  }
  return (LegalCaseStatus as any)[status] || status;
};

const getStatusColor = (status: string) => {
  const statusText = getStatusText(status);

  switch (statusText) {
    case "Tạm đình chỉ":
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        icon: "text-gray-600",
      };
    case "Quá hạn":
      return {
        bg: "bg-red-50",
        text: "text-red-600",
        icon: "text-red-600",
      };
    case "Án hủy":
      return {
        bg: "bg-purple-50",
        text: "text-purple-600",
        icon: "text-purple-600",
      };
    case "Án sửa":
      return {
        bg: "bg-blue-50",
        text: "text-blue-600",
        icon: "text-blue-600",
      };
    case "Chờ được phân công":
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        icon: "text-orange-600",
      };
    case "Đang giải quyết":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        icon: "text-yellow-600",
      };
    case "Đã được giải quyết":
      return {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: "text-green-600",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        icon: "text-gray-600",
      };
  }
};

const LegalCaseCard = ({ legalCase, onViewDetails }: LegalCaseCardProps) => {
  console.log("Rendering LegalCaseCard for case ID:", legalCase.plaintiff);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
      {/* Horizontal Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
        {/* Left Section - Main Info */}
        <div className="flex-1 space-y-3 lg:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Số thụ lý: {legalCase.acceptanceNumber}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {legalCase.legalCaseId}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`
              text-md px-5 py-1 rounded-full font-medium
                ${
                  legalCase.legalRelationship.legalCaseType.codeName == "HS"
                    ? "bg-red-50 text-red-600 border border-red-300"
                    : legalCase.legalRelationship.legalCaseType.codeName ==
                      "DS"
                    ? "bg-blue-50 text-blue-600 border border-blue-300"
                    : legalCase.legalRelationship.legalCaseType.codeName ==
                      "HN"
                    ? "bg-pink-50 text-pink-600 border border-pink-300"
                    : legalCase.legalRelationship.legalCaseType.codeName ==
                      "LD"
                    ? "bg-purple-50 text-purple-600 border border-purple-300"
                    : legalCase.legalRelationship.legalCaseType.codeName ==
                      "KT"
                    ? "bg-orange-50 text-orange-600 border border-orange-300"
                    : legalCase.legalRelationship.legalCaseType.codeName ==
                      "HC"
                    ? "bg-green-50 text-green-600 border border-green-300"
                    : legalCase.legalRelationship.legalCaseType.codeName ==
                      "PS"
                    ? "bg-yellow-50 text-yellow-600 border border-yellow-300"
                    : legalCase.legalRelationship.legalCaseType.codeName ==
                      "BP"
                    ? "bg-stone-50 text-stone-600 border border-stone-300"
                    : ""
                }
                `}>
                {
                  legalCase.legalRelationship.legalCaseType
                    .legalCaseTypeName
                }
              </span>
            </div>
          </div>

          {/* Parties - Horizontal on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-3">
              <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-12 h-12 text-blue-600"
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
                  {legalCase.legalRelationship.legalCaseType.codeName == "HS"
                    ? "Bị cáo"
                    : "Nguyên đơn"}
                </p>
                <p className="text-md font-semibold text-gray-900 whitespace-pre-line ">
                  {legalCase.plaintiff}
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {legalCase.plaintiffAddress}
                </p>
              </div>
            </div>

            {legalCase.legalRelationship.legalCaseType.codeName != "HS" && (
              <div className="flex items-start space-x-3">
                <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-red-600"
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
                  <p className="text-md font-semibold text-gray-900 whitespace-pre-line">
                    {legalCase.defendant}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {legalCase.defendantAddress}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Legal Relationship */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600 mb-1">
              {legalCase.legalRelationship.legalCaseType.codeName == "HS"
                ? "Tội"
                : "Quan hệ pháp luật"}
            </p>
            <p className="text-md font-semibold text-blue-900 mb-1">
              {legalCase.legalRelationship.legalRelationshipName}
            </p>
            <p className="text-sm text-blue-700 truncate">
              {
                legalCase.legalRelationship.legalRelationshipGroup
                  .legalRelationshipGroupName
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 font-medium">
                  Thông tin lưu trữ
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Ngày lưu trữ:</span>{" "}
                  {formatDate(legalCase.storageDate.split(" ")[0])}
                </p>
              </div>
            </div>
            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 font-medium">
                  Thông tin đợt nhập án
                </p>
              </div>
              <div className="space-y-1">
                {legalCase.batch ? (
                  <>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Mã đợt nhập:</span>{" "}
                      {legalCase.batch.batchId}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Tên đợt nhập:</span>{" "}
                      {legalCase.batch.batchName}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-700">Không có đợt nhập án</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Dates & Status */}
        <div className="lg:w-72 space-y-3">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500 mb-1">Ngày thụ lý</p>
              <p className="text-md font-semibold text-gray-900">
                {formatDate(legalCase.acceptanceDate)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500 mb-1">Ngày hết hạn</p>
              <p className="text-md font-semibold text-red-600">
                {legalCase.expiredDate != null
                  ? formatDate(legalCase.expiredDate)
                  : "Chưa có"}
              </p>
            </div>
          </div>

          {/* Judge Assignment */}
          <div
            className={`${
              getStatusColor(legalCase.legalCaseStatus).bg
            } rounded-lg p-3`}>
            <div className="flex items-center space-x-2">
              <svg
                className={`w-4 h-4 ${
                  getStatusColor(legalCase.legalCaseStatus).icon
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p
                className={`text-md ${
                  getStatusColor(legalCase.legalCaseStatus).text
                } font-medium`}>
                {getStatusText(legalCase.legalCaseStatus)}
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-green-600 font-medium">Thẩm phán</p>
            </div>
            {legalCase.judge ? (
              <div className="space-y-1">
                <p className="text-base font-semibold text-green-900">
                  {legalCase.judge.fullName}
                </p>
                <p className="text-sm text-green-700">
                  {formatDate(legalCase?.assignmentDate || "")}
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
                  Không có thẩm phán
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-600 font-medium">
                Hòa giải viên
              </p>
            </div>

            {legalCase.mediator ? (
              <div className="space-y-1">
                <p className="text-base font-semibold text-blue-900">
                  {legalCase.mediator.fullName}
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
      </div>

      {/* Actions - Always at bottom */}
      <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails?.(legalCase)}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="text-sm">Xem chi tiết</span>
        </button>
      </div>
    </div>
  );
};

export default LegalCaseCard;
