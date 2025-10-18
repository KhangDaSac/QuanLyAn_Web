import { type LegalRelationshipResponse } from "../../types/response/legal-relationship/LegalRelationshipResponse";

interface LegalRelationshipCardProps {
  relationship: LegalRelationshipResponse;
  onEdit: (item: LegalRelationshipResponse) => void;
  onDelete: (id: string) => void;
}

const LegalRelationshipCard = ({
  relationship,
  onEdit,
  onDelete,
}: LegalRelationshipCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 h-112 flex flex-col">
      {/* Header - Fixed height */}
      <div className="flex justify-between items-start mb-4 min-h-[5rem]">
        <div className="flex-1 pr-2 flex flex-col justify-between h-full">
          <h3
            className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight"
            title={relationship.legalRelationshipName}>
            {relationship.legalRelationshipName}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            ID: {relationship.legalRelationshipId}
          </p>
        </div>
      </div>

      {/* Content - Flexible height with fixed structure */}
      <div className="space-y-3 mb-6 flex-1 overflow-hidden">
        <div className="bg-blue-50 rounded-lg p-3 h-16 flex flex-col justify-center">
          <p className="text-xs text-blue-600 mb-1 font-medium">
            Tên quan hệ pháp luật
          </p>
          <p
            className="text-sm font-semibold text-blue-900 line-clamp-1"
            title={relationship.legalRelationshipName}>
            {relationship.legalRelationshipName}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 h-16 flex flex-col justify-center">
          <p className="text-xs text-green-600 mb-1 font-medium">Loại vụ án</p>
          <p
            className="text-sm font-semibold text-green-900 line-clamp-1"
            title={`${relationship.legalCaseType.legalCaseTypeName} (${relationship.legalCaseType.codeName})`}>
            {relationship.legalCaseType.legalCaseTypeName} (
            {relationship.legalCaseType.codeName})
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 h-16 flex flex-col justify-center">
          <p className="text-xs text-purple-600 mb-1 font-medium">
            Nhóm quan hệ pháp luật
          </p>
          <p
            className="text-sm font-semibold text-purple-900 line-clamp-1"
            title={
              relationship.legalRelationshipGroup.legalRelationshipGroupName
            }>
            {relationship.legalRelationshipGroup.legalRelationshipGroupName}
          </p>
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
        <button
          onClick={() => onEdit(relationship)}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex-1 justify-center">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Sửa</span>
        </button>

        <button
          onClick={() => onDelete(relationship.legalRelationshipId)}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex-1 justify-center">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
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

export default LegalRelationshipCard;
