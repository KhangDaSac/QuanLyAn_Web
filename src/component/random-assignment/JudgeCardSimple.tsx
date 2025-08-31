import { type JudgeResponse } from "../../types/response/judge/JudgeResponse";

interface JudgeCardSimpleProps {
  judge: JudgeResponse;
}

const JudgeCardSimple = ({ judge }: JudgeCardSimpleProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
      {/* Header với tên thẩm phán */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-15 h-15 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xl">
            {judge.fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {judge.fullName}
          </h3>
          <p className="text-sm text-gray-500">ID: {judge.judgeId}</p>
        </div>
      </div>

      {/* Email */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium text-blue-900 truncate">{judge.email}</p>
        </div>
      </div>

      {/* Thống kê án */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {/* Số án tối đa */}
        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">
            {judge.maxNumberOfLegalCase === -1 ? '∞' : judge.maxNumberOfLegalCase}
          </p>
          <p className="text-xs text-blue-700 font-medium leading-tight">Số án tối đa</p>
        </div>
        
        {/* Án hiện tại */}
        <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">
            {judge.numberOfLegalCases}
          </p>
          <p className="text-xs text-green-700 font-medium leading-tight">Án hiện tại</p>
        </div>
        
        {/* Án tạm đình chỉ */}
        <div className="bg-orange-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 mb-1">
            {judge.numberOfTemporarySuspension}
          </p>
          <p className="text-xs text-orange-700 font-medium leading-tight">Án tạm đình chỉ</p>
        </div>
        
        {/* Án quá hạn */}
        <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 mb-1">
            {judge.numberOfOverdue}
          </p>
          <p className="text-xs text-red-700 font-medium leading-tight">Án quá hạn</p>
        </div>
        
        {/* Án hủy và sửa */}
        <div className="bg-purple-50 rounded-lg p-2 sm:p-3 text-center col-span-2 sm:col-span-1">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mb-1">
            {judge.numberOfCanceledAndEdited}
          </p>
          <p className="text-xs text-purple-700 font-medium leading-tight">Án hủy và sửa</p>
        </div>
      </div>

      {/* Chỉ số tải */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tỷ lệ công việc</span>
          <span className="text-sm font-semibold text-gray-900">
            {judge.maxNumberOfLegalCase === -1 
              ? `${judge.numberOfLegalCases} án`
              : `${judge.numberOfLegalCases}/${judge.maxNumberOfLegalCase}`
            }
          </span>
        </div>
        {judge.maxNumberOfLegalCase !== -1 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                (judge.numberOfLegalCases / judge.maxNumberOfLegalCase) >= 0.8 
                  ? 'bg-gradient-to-r from-red-400 to-red-600'
                  : (judge.numberOfLegalCases / judge.maxNumberOfLegalCase) >= 0.6
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  : 'bg-gradient-to-r from-green-400 to-green-600'
              }`}
              style={{
                width: `${Math.min((judge.numberOfLegalCases / judge.maxNumberOfLegalCase) * 100, 100)}%`
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeCardSimple;
