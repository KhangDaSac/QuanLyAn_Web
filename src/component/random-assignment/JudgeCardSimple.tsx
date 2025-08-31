import { type JudgeResponse } from "../../types/response/judge/JudgeResponse";

interface JudgeCardSimpleProps {
  judge: JudgeResponse;
}

const JudgeCardSimple = ({ judge }: JudgeCardSimpleProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-2">
        {judge.fullName}
      </h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p>Email: {judge.email}</p>
        <p>Số án hiện tại: {judge.numberOfLegalCases}</p>
        <p>Số án tối đa: {judge.maxNumberOfLegalCase === -1 ? 'Không giới hạn' : judge.maxNumberOfLegalCase}</p>
      </div>
    </div>
  );
};

export default JudgeCardSimple;
