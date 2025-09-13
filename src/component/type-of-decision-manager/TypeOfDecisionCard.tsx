import type TypeOfDecisionResponse from "../../types/response/type-of-decision/TypeOfDecisionResponse";
import { CourtIssued } from "../../types/enum/CourtIssued";

interface TypeOfDecisionCardProps {
  typeOfDecision: TypeOfDecisionResponse;
  onEdit?: (typeOfDecision: TypeOfDecisionResponse) => void;
  onDelete?: (typeOfDecision: TypeOfDecisionResponse) => void;
}

const getCourtIssuedText = (courtIssued: CourtIssued) => {
  switch (courtIssued) {
    case CourtIssued.CURRENT_COURT:
      return 'Tòa án hiện tại';
    case CourtIssued.SUPERIOR_COURT:
      return 'Tòa án cấp trên';
    default:
      return 'Không xác định';
  }
};

const getCourtIssuedColor = (courtIssued: CourtIssued) => {
  switch (courtIssued) {
    case CourtIssued.CURRENT_COURT:
      return {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-300",
      };
    case CourtIssued.SUPERIOR_COURT:
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-300",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-300",
      };
  }
};

const getTypeOfLegalCaseColor = (codeName: string) => {
  switch (codeName) {
    case "HS":
      return "bg-red-50 text-red-600 border border-red-300";
    case "DS":
      return "bg-blue-50 text-blue-600 border border-blue-300";
    case "HN":
      return "bg-pink-50 text-pink-600 border border-pink-300";
    case "LD":
      return "bg-purple-50 text-purple-600 border border-purple-300";
    case "KT":
      return "bg-orange-50 text-orange-600 border border-orange-300";
    case "HC":
      return "bg-green-50 text-green-600 border border-green-300";
    case "PS":
      return "bg-yellow-50 text-yellow-600 border border-yellow-300";
    case "BP":
      return "bg-stone-50 text-stone-600 border border-stone-300";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-300";
  }
};

const TypeOfDecisionCard = ({ typeOfDecision, onEdit, onDelete }: TypeOfDecisionCardProps) => {
  const courtColor = getCourtIssuedColor(typeOfDecision.courtIssued);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            {typeOfDecision.typeOfDecisionName}
          </h3>
          <p className="text-sm text-gray-500">
            ID: {typeOfDecision.typeOfDecisionId}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${getTypeOfLegalCaseColor(
              typeOfDecision.typeOfLegalCase.codeName
            )}`}
          >
            {typeOfDecision.typeOfLegalCase.typeOfLegalCaseName}
          </span>
        </div>
      </div>

      {/* Court Level */}
      <div className={`${courtColor.bg} rounded-lg p-3 mb-4`}>
        <div className="flex items-center space-x-2">
          <svg
            className={`w-4 h-4 ${courtColor.text}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 8h10M7 12h4m1 8l-1-6m1 6h2m-2 0h-2m2 0l-1-6"
            />
          </svg>
          <p className={`text-md ${courtColor.text} font-medium`}>
            Cấp tòa: {getCourtIssuedText(typeOfDecision.courtIssued)}
          </p>
        </div>
      </div>

      {/* Decision Type Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-gray-600 font-medium">Thông tin quyết định</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Loại án:</span>{" "}
            {typeOfDecision.typeOfLegalCase.typeOfLegalCaseName}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Quyết định kết thúc:</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                typeOfDecision.theEndDecision
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {typeOfDecision.theEndDecision ? (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Có
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Không
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit?.(typeOfDecision)}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium border border-yellow-300 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Chỉnh sửa</span>
        </button>
        <button
          onClick={() => onDelete?.(typeOfDecision)}
          className="flex items-center space-x-1 px-4 py-2 text-sm font-medium border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
};

export default TypeOfDecisionCard;