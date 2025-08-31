import { type TypeOfLegalCaseResponse } from '../../types/response/type-of-legal-case/TypeOfLegalCaseResponse';

interface TypeOfLegalCaseCardProps {
  typeOfLegalCase: TypeOfLegalCaseResponse;
  onEdit: (item: TypeOfLegalCaseResponse) => void;
  onDelete: (id: string) => void;
}

const TypeOfLegalCaseCard = ({ typeOfLegalCase, onEdit, onDelete }: TypeOfLegalCaseCardProps) => {

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {typeOfLegalCase.typeOfLegalCaseName}
          </h3>
          <p className="text-sm text-gray-500">ID: {typeOfLegalCase.typeOfLegalCaseId}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-1">Mã loại vụ án</p>
          <p className="text-base font-semibold text-gray-900">{typeOfLegalCase.codeName}</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-blue-600 mb-1">Tên loại vụ án</p>
          <p className="text-base font-semibold text-blue-900">{typeOfLegalCase.typeOfLegalCaseName}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(typeOfLegalCase)}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Sửa</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm(`Bạn có chắc chắn muốn xóa loại vụ án "${typeOfLegalCase.typeOfLegalCaseName}"?`)) {
              onDelete(typeOfLegalCase.typeOfLegalCaseId);
            }
          }}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
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

export default TypeOfLegalCaseCard;
