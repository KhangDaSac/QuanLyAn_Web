import { type LegalCaseResponse } from "../../types/response/legal-case/LegalCaseResponse";

interface LegalCaseCardSimpleProps {
  legalCase: LegalCaseResponse;
  isSelected: boolean;
  onSelect: (caseId: string) => void;
}

const LegalCaseCardSimple = ({ legalCase, isSelected, onSelect }: LegalCaseCardSimpleProps) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-red-500 bg-red-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(legalCase.legalCaseId)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm">
          {legalCase.acceptanceNumber}
        </h3>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(legalCase.legalCaseId)}
          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Nguyên đơn: {legalCase.plaintiff}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        Bị đơn: {legalCase.defendant}
      </p>
      <div className="text-xs text-gray-500">
        <p>Ngày tiếp nhận: {new Date(legalCase.acceptanceDate).toLocaleDateString('vi-VN')}</p>
        <p>Quan hệ pháp luật: {legalCase.legalRelationship.legalRelationshipName}</p>
      </div>
    </div>
  );
};

export default LegalCaseCardSimple;
