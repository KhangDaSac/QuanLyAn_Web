import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TypeOfDecisionService } from "../services/TypeOfDecisionService";
import { HandleTypeOfDecisionService } from "../services/HandleTypeOfDecisionService";
import type TypeOfDecisionResponse from "../types/response/type-of-decision/TypeOfDecisionResponse";
import type HandleTypeOfDecisionResponse from "../types/response/handle-type-of-decision/HandleTypeOfDecisionResponse";
import { ToastContainer, useToast } from "../component/basic-component/Toast";
import { CourtIssued } from "../types/enum/CourtIssued";
import { StatusOfLegalCase } from "../types/enum/StatusOfLegalCase";

const getCourtIssuedText = (status: string) => {
  if (Object.values(CourtIssued).includes(status as CourtIssued)) {
    return status;
  }
  return (CourtIssued as any)[status] || status;
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
      return "bg-green-50 text-green-600 border border-green-300";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-300";
  }
};

const getStatusText = (status: string) => {
  if (Object.values(StatusOfLegalCase).includes(status as StatusOfLegalCase)) {
    return status;
  }
  return (StatusOfLegalCase as any)[status] || status;
};

const getStatusColor = (status: string) => {
  const statusText = getStatusText(status);

  switch (statusText) {
    case "Tạm đình chỉ":
      return "bg-gray-50 text-gray-600 border border-gray-300";
    case "Quá hạn":
      return "bg-red-50 text-red-600 border border-red-300";
    case "Án hủy":
      return "bg-purple-50 text-purple-600 border border-purple-300";
    case "Án sửa":
      return "bg-blue-50 text-blue-600 border border-blue-300";
    case "Chờ được phân công":
      return "bg-orange-50 text-orange-600 border border-orange-300";
    case "Đang giải quyết":
      return "bg-yellow-50 text-yellow-600 border border-yellow-300";
    case "Đã được giải quyết":
      return "bg-green-50 text-green-600 border border-green-300";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-300";
  }
};

const TypeOfDecisionDetailsPage = () => {
  const { typeOfDecisionId } = useParams<{ typeOfDecisionId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [typeOfDecision, setTypeOfDecision] = useState<TypeOfDecisionResponse | null>(null);
  const [handleTypeOfDecisions, setHandleTypeOfDecisions] = useState<HandleTypeOfDecisionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [handlesLoading, setHandlesLoading] = useState(false);

  useEffect(() => {
    if (typeOfDecisionId) {
      fetchTypeOfDecisionDetails();
      fetchHandleTypeOfDecisions();
    }
  }, [typeOfDecisionId]);

  const fetchTypeOfDecisionDetails = async () => {
    if (!typeOfDecisionId) return;

    console.log('Fetching details for typeOfDecisionId:', typeOfDecisionId);
    setLoading(true);
    try {
      const response = await TypeOfDecisionService.getById(typeOfDecisionId);
      console.log('API Response:', response);
      if (response.success && response.data) {
        setTypeOfDecision(response.data);
      } else {
        console.error('API Error:', response);
        toast.error("Lỗi", "Không thể tải thông tin loại quyết định");
        navigate("/decision-type");
      }
    } catch (error) {
      console.error("Error fetching type of decision details:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi tải thông tin loại quyết định");
      navigate("/decision-type");
    } finally {
      setLoading(false);
    }
  };

  const fetchHandleTypeOfDecisions = async () => {
    if (!typeOfDecisionId) return;

    setHandlesLoading(true);
    try {
      const response = await HandleTypeOfDecisionService.getByTypeOfDecision(typeOfDecisionId);
      if (response.success && response.data) {
        setHandleTypeOfDecisions(response.data);
      }
    } catch (error) {
      console.error("Error fetching handle type of decisions:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi tải danh sách xử lý loại quyết định");
    } finally {
      setHandlesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!typeOfDecision) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy loại quyết định
          </h3>
          <p className="text-gray-600 mb-4">
            Loại quyết định không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/decision-type")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const courtIssuedColors = getCourtIssuedColor(typeOfDecision.courtIssued);

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/decision-type")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Chi tiết loại quyết định
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Thông tin chi tiết và xử lý loại quyết định
            </p>
          </div>
        </div>
      </div>

      {/* Type of Decision Info */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin loại quyết định
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên loại quyết định
                </label>
                <p className="text-base text-gray-900 font-medium">
                  {typeOfDecision.typeOfDecisionName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại vụ án
                </label>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeOfLegalCaseColor(
                      typeOfDecision.typeOfLegalCase.codeName
                    )}`}
                  >
                    {typeOfDecision.typeOfLegalCase.codeName}
                  </span>
                  <span className="text-gray-700">
                    {typeOfDecision.typeOfLegalCase.typeOfLegalCaseName}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tòa ban hành
                </label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${courtIssuedColors.bg} ${courtIssuedColors.text} ${courtIssuedColors.border}`}
                >
                  {getCourtIssuedText(typeOfDecision.courtIssued)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quyết định cuối
                </label>
                <div className="flex items-center">
                  {typeOfDecision.theEndDecision ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-300">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Có
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-300">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Không
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Handle Type of Decisions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách xử lý loại quyết định
            </h2>
            <span className="text-sm text-gray-600">
              {handleTypeOfDecisions.length} xử lý
            </span>
          </div>
        </div>

        <div className="p-6">
          {handlesLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : handleTypeOfDecisions.length > 0 ? (
            <div className="space-y-4">
              {handleTypeOfDecisions.map((handle, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pre Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái trước
                      </label>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          handle.preStatus
                        )}`}
                      >
                        {getStatusText(handle.preStatus)}
                      </span>
                    </div>

                    {/* Post Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái sau
                      </label>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          handle.postStatus
                        )}`}
                      >
                        {getStatusText(handle.postStatus)}
                      </span>
                    </div>

                    {/* Extension Period */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian gia hạn
                      </label>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-blue-500 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-900 font-medium">
                          {handle.extensionPeriod} ngày
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Flow Visualization */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          handle.preStatus
                        )}`}
                      >
                        {getStatusText(handle.preStatus)}
                      </span>
                      
                      <div className="flex items-center flex-1 mx-4">
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                        <svg
                          className="w-5 h-5 text-gray-400 mx-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          handle.postStatus
                        )}`}
                      >
                        {getStatusText(handle.postStatus)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Chưa có xử lý nào
              </h3>
              <p className="text-gray-600">
                Loại quyết định này chưa có cấu hình xử lý nào.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default TypeOfDecisionDetailsPage;