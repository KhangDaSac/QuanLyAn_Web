import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TypeOfDecisionService } from "../services/TypeOfDecisionService";
import { HandleTypeOfDecisionService } from "../services/HandleTypeOfDecisionService";
import { TypeOfLegalCaseService } from "../services/TypeOfLegalCaseService";
import type TypeOfDecisionResponse from "../types/response/type-of-decision/TypeOfDecisionResponse";
import type HandleTypeOfDecisionResponse from "../types/response/handle-type-of-decision/HandleTypeOfDecisionResponse";
import type TypeOfDecisionRequest from "../types/request/type-of-decision/TypeOfDecisionRequest";
import type { HandleTypeOfDecisionRequest } from "../types/request/handle-type-of-decision/HandleTypeOfDecisionRequest";
import type { Option } from "../component/basic-component/ComboboxSearch";
import { ToastContainer, useToast } from "../component/basic-component/Toast";
import TypeOfDecisionForm from "../component/type-of-decision-manager/TypeOfDecisionForm";
import ComboboxSearchForm from "../component/basic-component/ComboboxSearchForm";
import ConfirmModal from "../component/basic-component/ConfirmModal";
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

// Helper function to get enum key from value
const getStatusKey = (statusValue: string): string => {
  const entry = Object.entries(StatusOfLegalCase).find(([_, value]) => value === statusValue);
  return entry ? entry[0] : statusValue;
};

// Helper function to get enum value from key
const getStatusValue = (statusKey: string): string => {
  return (StatusOfLegalCase as any)[statusKey] || statusKey;
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
  const [typeOfLegalCaseOptions, setTypeOfLegalCaseOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [handlesLoading, setHandlesLoading] = useState(false);

  // Modal states
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Handle type of decision edit/delete states
  const [selectedHandle, setSelectedHandle] = useState<HandleTypeOfDecisionResponse | null>(null);
  const [showHandleEditForm, setShowHandleEditForm] = useState(false);
  const [showHandleConfirmModal, setShowHandleConfirmModal] = useState(false);
  const [showHandleCreateForm, setShowHandleCreateForm] = useState(false);
  const [handleFormLoading, setHandleFormLoading] = useState(false);

  // Form state for ComboboxSearchForm
  const [selectedPreStatus, setSelectedPreStatus] = useState<string>('');
  const [selectedPostStatus, setSelectedPostStatus] = useState<string>('');
  const [extensionPeriod, setExtensionPeriod] = useState<number>(0);

  // Store original values for comparison
  const [originalPreStatus, setOriginalPreStatus] = useState<string>('');
  const [originalPostStatus, setOriginalPostStatus] = useState<string>('');
  const [originalExtensionPeriod, setOriginalExtensionPeriod] = useState<number>(0);

  // Create status options for ComboboxSearchForm
  const statusOptions: Option[] = Object.entries(StatusOfLegalCase).map(([key, value]) => ({
    value: key, // Use enum key as value
    label: value // Use enum value as label
  }));

  useEffect(() => {
    if (typeOfDecisionId) {
      fetchTypeOfDecisionDetails();
      fetchHandleTypeOfDecisions();
      fetchTypeOfLegalCaseOptions();
    } else {
      navigate("/decision-type");
    }
  }, [typeOfDecisionId]);

  // Effect to update form when selectedHandle changes
  useEffect(() => {
    if (selectedHandle && showHandleEditForm) {
      // Convert enum values to keys for ComboboxSearchForm
      const preStatusKey = getStatusKey(selectedHandle.preStatus);
      const postStatusKey = getStatusKey(selectedHandle.postStatus);
      
      setSelectedPreStatus(preStatusKey);
      setSelectedPostStatus(postStatusKey);
      setExtensionPeriod(selectedHandle.extensionPeriod);
      
      // Store original values for comparison
      setOriginalPreStatus(preStatusKey);
      setOriginalPostStatus(postStatusKey);
      setOriginalExtensionPeriod(selectedHandle.extensionPeriod);
    }
  }, [selectedHandle, showHandleEditForm]);

  const fetchTypeOfDecisionDetails = async () => {
    if (!typeOfDecisionId) return;

    setLoading(true);
    try {
      const response = await TypeOfDecisionService.getById(typeOfDecisionId);
      
      if (response.success && response.data) {
        setTypeOfDecision(response.data);
      } else {
        const allResponse = await TypeOfDecisionService.getAll();
        
        if (allResponse.success && allResponse.data) {
          const foundTypeOfDecision = allResponse.data.find(
            item => item.typeOfDecisionId === typeOfDecisionId
          );
          
          if (foundTypeOfDecision) {
            setTypeOfDecision(foundTypeOfDecision);
          } else {
            toast.error("Lỗi", "Không thể tải thông tin loại quyết định");
            navigate("/decision-type");
          }
        } else {
          toast.error("Lỗi", "Không thể tải thông tin loại quyết định");
          navigate("/decision-type");
        }
      }
    } catch (error) {
      console.error("Error fetching type of decision details:", error);
      toast.error("Lỗi", "Không thể tải thông tin loại quyết định");
      navigate("/decision-type");
    } finally {
      setLoading(false);
    }
  };

  const fetchTypeOfLegalCaseOptions = async () => {
    try {
      const response = await TypeOfLegalCaseService.getAll();
      if (response.success && response.data) {
        const options: Option[] = response.data.map((item) => ({
          value: item.typeOfLegalCaseId,
          label: item.typeOfLegalCaseName,
        }));
        setTypeOfLegalCaseOptions(options);
      }
    } catch (error) {
      console.error("Error fetching type of legal case options:", error);
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

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const handleFormSubmit = async (data: TypeOfDecisionRequest) => {
    if (!typeOfDecision) return;

    try {
      setFormLoading(true);
      await TypeOfDecisionService.update(typeOfDecision.typeOfDecisionId, data as TypeOfDecisionRequest);
      toast.success("Cập nhật thành công", "Loại quyết định đã được cập nhật thành công!");
      setShowEditForm(false);
      await fetchTypeOfDecisionDetails();
    } catch (error) {
      console.error("Error updating type of decision:", error);
      toast.error("Có lỗi xảy ra", "Không thể cập nhật thông tin loại quyết định. Vui lòng thử lại!");
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!typeOfDecision) return;

    try {
      await TypeOfDecisionService.delete(typeOfDecision.typeOfDecisionId);
      toast.success("Xóa thành công", "Loại quyết định đã được xóa khỏi hệ thống!");
      navigate("/decision-type");
    } catch (error) {
      console.error("Error deleting type of decision:", error);
      toast.error("Xóa thất bại", "Có lỗi xảy ra khi xóa loại quyết định. Vui lòng thử lại!");
    }
    setShowConfirmModal(false);
  };

  // Handle type of decision functions
  const handleEditHandle = (handle: HandleTypeOfDecisionResponse) => {
    setSelectedHandle(handle);
    setShowHandleEditForm(true);
    // Form values will be set by useEffect
  };

  const resetHandleForm = () => {
    setSelectedPreStatus('');
    setSelectedPostStatus('');
    setExtensionPeriod(0);
  };

  const handleDeleteHandle = (handle: HandleTypeOfDecisionResponse) => {
    setSelectedHandle(handle);
    setShowHandleConfirmModal(true);
  };

    const handleHandleFormSubmit = async (data: any) => {
    if (!selectedHandle || !typeOfDecision) return;

    // Validation: preStatus and postStatus should be different
    if (data.preStatus === data.postStatus) {
      toast.error("Lỗi", "Trạng thái trước và sau phải khác nhau!");
      return;
    }

    try {
      setHandleFormLoading(true);
      
      // Create request with only changed fields, null for unchanged fields
      const request: Partial<HandleTypeOfDecisionRequest> = {};
      
      if (selectedHandle.typeOfDecision.typeOfDecisionId !== data.typeOfDecisionId) {
        request.typeOfDecisionId = data.typeOfDecisionId;
      }
      if (selectedHandle.preStatus !== data.preStatus) {
        request.preStatus = data.preStatus;
      }
      if (selectedHandle.postStatus !== data.postStatus) {
        request.postStatus = data.postStatus;
      }
      if (selectedHandle.extensionPeriod !== data.extensionPeriod) {
        request.extensionPeriod = data.extensionPeriod;
      }

      await HandleTypeOfDecisionService.update(
        typeOfDecision.typeOfDecisionId,
        selectedHandle.preStatus,
        request as HandleTypeOfDecisionRequest
      );
      
      toast.success("Cập nhật thành công", "Xử lý loại quyết định đã được cập nhật!");
      setShowHandleEditForm(false);
      setSelectedHandle(null);
      resetHandleForm();
      await fetchHandleTypeOfDecisions();
    } catch (error) {
      console.error("Error updating handle type of decision:", error);
      toast.error("Có lỗi xảy ra", "Không thể cập nhật thông tin xử lý. Vui lòng thử lại!");
    } finally {
      setHandleFormLoading(false);
    }
  };

  const confirmDeleteHandle = async () => {
    if (!selectedHandle || !typeOfDecision) return;

    try {
      await HandleTypeOfDecisionService.delete(
        typeOfDecision.typeOfDecisionId,
        selectedHandle.preStatus
      );
      toast.success("Xóa thành công", "Xử lý loại quyết định đã được xóa!");
      setShowHandleConfirmModal(false);
      setSelectedHandle(null);
      await fetchHandleTypeOfDecisions();
    } catch (error) {
      console.error("Error deleting handle type of decision:", error);
      toast.error("Xóa thất bại", "Có lỗi xảy ra khi xóa xử lý. Vui lòng thử lại!");
    }
  };

  const handleCreateHandle = async (data: any) => {
    if (!typeOfDecision) return;

    // Validation: preStatus and postStatus should be different
    if (data.preStatus === data.postStatus) {
      toast.error("Lỗi", "Trạng thái trước và sau phải khác nhau!");
      return;
    }

    try {
      setHandleFormLoading(true);
      
      const request: HandleTypeOfDecisionRequest = {
        typeOfDecisionId: typeOfDecision.typeOfDecisionId,
        preStatus: data.preStatus,
        postStatus: data.postStatus,
        extensionPeriod: data.extensionPeriod,
      };

      await HandleTypeOfDecisionService.create(request);
      
      toast.success("Thêm thành công", "Xử lý loại quyết định đã được thêm!");
      setShowHandleCreateForm(false);
      resetHandleForm();
      await fetchHandleTypeOfDecisions();
    } catch (error) {
      console.error("Error creating handle type of decision:", error);
      toast.error("Có lỗi xảy ra", "Không thể thêm xử lý mới. Vui lòng thử lại!");
    } finally {
      setHandleFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!typeOfDecision) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy loại quyết định
        </h3>
        <p className="text-gray-600">Loại quyết định không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/decision-type")}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white">
            <svg
              className="w-8 h-8 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
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
              Mã: {typeOfDecision.typeOfDecisionId}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              resetHandleForm();
              setShowHandleCreateForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm xử lý
          </button>
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-yellow-600 text-yellow-600 text-sm font-medium rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
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
            Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
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
            Xóa
          </button>
        </div>
      </div>

      {/* Main Card - Similar to LegalCaseDetailsPage Layout */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
        {/* Horizontal Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
          {/* Left Section - Main Info */}
          <div className="flex-1 space-y-3 lg:space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {typeOfDecision.typeOfDecisionName}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {typeOfDecision.typeOfDecisionId}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`
                    text-md px-5 py-1 rounded-full font-medium
                    ${getTypeOfLegalCaseColor(typeOfDecision.typeOfLegalCase.codeName)}
                  `}>
                  {typeOfDecision.typeOfLegalCase.typeOfLegalCaseName}
                </span>
              </div>
            </div>

            {/* Type of Legal Case Details */}
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-600 mb-1">Loại vụ án</p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {typeOfDecision.typeOfLegalCase.codeName}
                </span>
                <p className="text-md font-semibold text-blue-900">
                  {typeOfDecision.typeOfLegalCase.typeOfLegalCaseName}
                </p>
              </div>
            </div>

            {/* Court Issued & End Decision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">Tòa ban hành</p>
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getCourtIssuedColor(typeOfDecision.courtIssued).bg} ${getCourtIssuedColor(typeOfDecision.courtIssued).text} ${getCourtIssuedColor(typeOfDecision.courtIssued).border}`}>
                  {getCourtIssuedText(typeOfDecision.courtIssued)}
                </span>
              </div>

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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">Quyết định cuối</p>
                </div>
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

      {/* Handle Type of Decisions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách xử lý loại quyết định
          </h3>
        </div>
        {handlesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : handleTypeOfDecisions.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500">Chưa có xử lý nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {handleTypeOfDecisions.map((handle, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Pre Status */}
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-1">
                      Trạng thái trước:
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(handle.preStatus)}`}>
                      {getStatusText(handle.preStatus)}
                    </span>
                  </div>

                  {/* Post Status */}
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-1">
                      Trạng thái sau:
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(handle.postStatus)}`}>
                      {getStatusText(handle.postStatus)}
                    </span>
                  </div>

                  {/* Extension Period */}
                  <div>
                    <span className="text-sm font-medium text-gray-600 block mb-1">
                      Thời gian gia hạn:
                    </span>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-base text-gray-900 font-semibold">
                        {handle.extensionPeriod} tháng
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Flow Visualization */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(handle.preStatus)}`}>
                      {getStatusText(handle.preStatus)}
                    </span>
                    
                    <div className="flex items-center flex-1 mx-4">
                      <div className="flex-1 h-0.5 bg-gray-300"></div>
                      <svg
                        className="w-5 h-5 text-gray-400 mx-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
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
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(handle.postStatus)}`}>
                      {getStatusText(handle.postStatus)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditHandle(handle)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
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
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteHandle(handle)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
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
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TypeOfDecisionForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleFormSubmit}
        typeOfDecision={typeOfDecision}
        typeOfLegalCaseOptions={typeOfLegalCaseOptions}
        isLoading={formLoading}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa loại quyết định"
        message={`Bạn có chắc chắn muốn xóa loại quyết định "${typeOfDecision.typeOfDecisionName}"? Hành động này không thể hoàn tác.`}
        type="danger"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      {/* Handle Edit Modal */}
      {showHandleEditForm && selectedHandle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sửa xử lý loại quyết định
                </h3>
                <button
                  onClick={() => {
                    setShowHandleEditForm(false);
                    setSelectedHandle(null);
                    resetHandleForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!selectedPreStatus || !selectedPostStatus) {
                  toast.error('Lỗi', 'Vui lòng chọn đầy đủ trạng thái trước và sau');
                  return;
                }
                
                // Only send changed fields
                const data: any = {
                  typeOfDecisionId: selectedHandle.typeOfDecision.typeOfDecisionId,
                };
                
                // Check if preStatus changed
                if (selectedPreStatus !== originalPreStatus) {
                  data.preStatus = getStatusValue(selectedPreStatus) as StatusOfLegalCase;
                } else {
                  data.preStatus = null;
                }
                
                // Check if postStatus changed
                if (selectedPostStatus !== originalPostStatus) {
                  data.postStatus = getStatusValue(selectedPostStatus) as StatusOfLegalCase;
                } else {
                  data.postStatus = null;
                }
                
                // Check if extensionPeriod changed
                if (extensionPeriod !== originalExtensionPeriod) {
                  data.extensionPeriod = extensionPeriod;
                } else {
                  data.extensionPeriod = null;
                }
                
                console.log('Update data:', data); // Debug log
                handleHandleFormSubmit(data);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái trước
                  </label>
                  <ComboboxSearchForm
                    options={statusOptions}
                    value={selectedPreStatus}
                    onChange={setSelectedPreStatus}
                    placeholder="Chọn trạng thái trước"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái sau
                  </label>
                  <ComboboxSearchForm
                    options={statusOptions}
                    value={selectedPostStatus}
                    onChange={setSelectedPostStatus}
                    placeholder="Chọn trạng thái sau"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian gia hạn (tháng)
                  </label>
                  <input
                    type="number"
                    value={extensionPeriod}
                    onChange={(e) => setExtensionPeriod(parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={handleFormLoading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {handleFormLoading ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowHandleEditForm(false);
                      setSelectedHandle(null);
                      resetHandleForm();
                    }}
                    disabled={handleFormLoading}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Handle Create Modal */}
      {showHandleCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thêm xử lý loại quyết định
                </h3>
                <button
                  onClick={() => {
                    setShowHandleCreateForm(false);
                    resetHandleForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!selectedPreStatus || !selectedPostStatus) {
                  toast.error('Lỗi', 'Vui lòng chọn đầy đủ trạng thái trước và sau');
                  return;
                }
                const data = {
                  preStatus: getStatusValue(selectedPreStatus) as StatusOfLegalCase,
                  postStatus: getStatusValue(selectedPostStatus) as StatusOfLegalCase,
                  extensionPeriod: extensionPeriod
                };
                console.log('Create data:', data); // Debug log
                handleCreateHandle(data);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái trước <span className="text-red-500">*</span>
                  </label>
                  <ComboboxSearchForm
                    options={statusOptions}
                    value={selectedPreStatus}
                    onChange={setSelectedPreStatus}
                    placeholder="-- Chọn trạng thái trước --"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái sau <span className="text-red-500">*</span>
                  </label>
                  <ComboboxSearchForm
                    options={statusOptions}
                    value={selectedPostStatus}
                    onChange={setSelectedPostStatus}
                    placeholder="-- Chọn trạng thái sau --"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian gia hạn (tháng) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={extensionPeriod}
                    onChange={(e) => setExtensionPeriod(parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="Nhập số tháng gia hạn"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={handleFormLoading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {handleFormLoading ? "Đang thêm..." : "Thêm mới"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowHandleCreateForm(false);
                      resetHandleForm();
                    }}
                    disabled={handleFormLoading}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Handle Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showHandleConfirmModal}
        onClose={() => {
          setShowHandleConfirmModal(false);
          setSelectedHandle(null);
        }}
        onConfirm={confirmDeleteHandle}
        title="Xác nhận xóa xử lý"
        message={selectedHandle ? `Bạn có chắc chắn muốn xóa xử lý từ "${getStatusText(selectedHandle.preStatus)}" thành "${getStatusText(selectedHandle.postStatus)}"? Hành động này không thể hoàn tác.` : ''}
        type="danger"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default TypeOfDecisionDetailsPage;