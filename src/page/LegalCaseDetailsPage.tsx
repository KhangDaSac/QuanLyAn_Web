import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LegalCaseService } from "../services/LegalCaseService";
import { DecisionService } from "../services/DecisionService";
import { LegalRelationshipService } from "../services/LegalRelationshipService";
import type { LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import type { Option } from "../component/basic-component/ComboboxSearch";
import JudgeAssignmentModal from "../component/legal-case-manager/JudgeAssignmentModal";
import LegalCaseForm from "../component/legal-case-manager/LegalCaseForm";
import ConfirmModal from "../component/basic-component/ConfirmModal";
import { ToastContainer, useToast } from "../component/basic-component/Toast";
import type { AssignAssignmentRequest } from "../types/request/legal-case/AssignAssignmentRequest";
import type { LegalCaseRequest } from "../types/request/legal-case/LegalCaseRequest";
import type DecisionRequest from "../types/request/decision/DecisionRequest";
import { LegalCaseStatus } from "../types/enum/LegalCaseStatus";
import { LitigantType } from "../types/enum/LitigantType";
import DecisionForm from "../component/decision-manager/DecisionForm";
import { useAuth } from "../context/authContext/useAuth";
import { Permission } from "../utils/authUtils";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getStatusText = (status: string) => {
  // Nếu status đã là tiếng Việt thì trả về luôn
  if (Object.values(LegalCaseStatus).includes(status as LegalCaseStatus)) {
    return status;
  }
  // Nếu status là key tiếng Anh thì chuyển sang tiếng Việt
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

const LegalCaseDetailsPage = () => {
  const { legalCaseId } = useParams<{ legalCaseId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuth();


  const [legalCase, setLegalCase] = useState<LegalCaseResponse | null>(null);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [legalRelationships, setLegalRelationships] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [decisionsLoading, setDecisionsLoading] = useState(false);
  const [showAllPlaintiffs, setShowAllPlaintiffs] = useState(false);
  const [showAllDefendants, setShowAllDefendants] = useState(false);

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRemoveAssignmentModal, setShowRemoveAssignmentModal] = useState(false);
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [showEditDecisionForm, setShowEditDecisionForm] = useState(false);
  const [showDeleteDecisionModal, setShowDeleteDecisionModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [decisionFormLoading, setDecisionFormLoading] = useState(false);

  useEffect(() => {
    if (legalCaseId) {
      fetchLegalCase();
      fetchDecisions();
      fetchLegalRelationships();
    }
  }, [legalCaseId]);

  const fetchLegalCase = async () => {
    if (!legalCaseId) return;

    setLoading(true);
    try {
      const response = await LegalCaseService.getById(legalCaseId);
      if (response.success && response.data) {
        setLegalCase(response.data);
      } else {
        toast.error("Lỗi", "Không thể tải thông tin vụ án");
        navigate("/legal-case");
      }
    } catch (error) {
      console.error("Error fetching legal case:", error);
      toast.error("Lỗi", "Không thể tải thông tin vụ án");
      navigate("/legal-case");
    } finally {
      setLoading(false);
    }
  };

  const fetchDecisions = async () => {
    if (!legalCaseId) return;

    setDecisionsLoading(true);
    try {
      const response = await DecisionService.getByLegalCase(legalCaseId);
      if (response.success && response.data) {
        setDecisions(response.data);
      }
    } catch (error) {
      console.error("Error fetching decisions:", error);
      toast.error("Lỗi", "Không thể tải danh sách quyết định");
    } finally {
      setDecisionsLoading(false);
    }
  };

  const fetchLegalRelationships = async () => {
    try {
      const response = await LegalRelationshipService.getAll();
      if (response.success && response.data) {
        const options: Option[] = response.data.map((item) => ({
          value: item.legalRelationshipId,
          label: item.legalRelationshipName,
        }));
        setLegalRelationships(options);
      }
    } catch (error) {
      console.error("Error fetching legal relationships:", error);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const handleAssign = () => {
    setShowAssignmentModal(true);
  };

  const handleRemoveAssignmentClick = () => {
    setShowRemoveAssignmentModal(true);
  };

  const confirmRemoveAssignment = async () => {
    if (!legalCase) return;

    setAssignmentLoading(true);
    try {
      const response = await LegalCaseService.removeAssignment(legalCase.legalCaseId);

      if (response.success) {
        toast.success(
          "Xóa phân công thành công",
          `Đã xóa phân công thẩm phán khỏi án "${legalCase.acceptanceNumber}"`
        );
        setShowRemoveAssignmentModal(false);
        await fetchLegalCase(); // Reload data
      } else {
        toast.error(
          "Xóa phân công thất bại",
          response.error || "Có lỗi xảy ra khi xóa phân công thẩm phán"
        );
      }
    } catch (error) {
      console.error("Error removing assignment:", error);
      toast.error(
        "Xóa phân công thất bại",
        "Có lỗi xảy ra khi xóa phân công thẩm phán"
      );
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleAddDecision = () => {
    setSelectedDecision(null);
    setShowDecisionForm(true);
  };

  const handleEditDecision = (decision: any) => {
    setSelectedDecision(decision);
    setShowEditDecisionForm(true);
  };

  const handleDeleteDecisionClick = (decision: any) => {
    setSelectedDecision(decision);
    setShowDeleteDecisionModal(true);
  };

  const confirmDeleteDecision = async () => {
    if (!selectedDecision) return;

    try {
      const response = await DecisionService.delete(selectedDecision.decisionId);
      
      if (response.success) {
        toast.success(
          "Xóa quyết định thành công",
          `Đã xóa quyết định số "${selectedDecision.number}"`
        );
        setShowDeleteDecisionModal(false);
        setSelectedDecision(null);
        await fetchDecisions();
      } else {
        toast.error(
          "Xóa quyết định thất bại",
          response.error || "Có lỗi xảy ra khi xóa quyết định"
        );
      }
    } catch (error) {
      console.error("Error deleting decision:", error);
      toast.error(
        "Xóa quyết định thất bại",
        "Có lỗi xảy ra khi xóa quyết định"
      );
    }
  };

  const handleDecisionSubmit = async (data: DecisionRequest) => {
    if (!legalCase) return;

    setDecisionFormLoading(true);
    try {
      const response = await DecisionService.create(data);

      if (response.success) {
        toast.success(
          "Thêm quyết định thành công",
          `Đã thêm quyết định số "${data.number}"`
        );
        setShowDecisionForm(false);
        await fetchDecisions();
      } else {
        toast.error(
          "Thêm quyết định thất bại",
          response.error || "Có lỗi xảy ra khi thêm quyết định"
        );
      }
    } catch (error) {
      console.error("Error creating decision:", error);
      toast.error(
        "Thêm quyết định thất bại",
        "Có lỗi xảy ra khi thêm quyết định"
      );
    } finally {
      setDecisionFormLoading(false);
    }
  };

  const handleEditDecisionSubmit = async (data: DecisionRequest) => {
    if (!selectedDecision) return;

    setDecisionFormLoading(true);
    try {
      const response = await DecisionService.update(selectedDecision.decisionId, data);

      if (response.success) {
        toast.success(
          "Cập nhật quyết định thành công",
          `Đã cập nhật quyết định số "${data.number}"`
        );
        setShowEditDecisionForm(false);
        setSelectedDecision(null);
        await fetchDecisions();
      } else {
        toast.error(
          "Cập nhật quyết định thất bại",
          response.error || "Có lỗi xảy ra khi cập nhật quyết định"
        );
      }
    } catch (error) {
      console.error("Error updating decision:", error);
      toast.error(
        "Cập nhật quyết định thất bại",
        "Có lỗi xảy ra khi cập nhật quyết định"
      );
    } finally {
      setDecisionFormLoading(false);
    }
  };

  const handleAssignSubmit = async (judgeId: string) => {
    if (!legalCase) return;

    setAssignmentLoading(true);
    try {
      const request: AssignAssignmentRequest = {
        legalCaseId: legalCase.legalCaseId,
        judgeId: judgeId,
      };

      const response = await LegalCaseService.assignAssignment(request);

      if (response.success) {
        toast.success(
          "Phân công thành công",
          `Đã phân công thẩm phán cho án "${legalCase.acceptanceNumber}"`
        );
        setShowAssignmentModal(false);
        await fetchLegalCase(); // Reload data
      } else {
        toast.error(
          "Phân công thất bại",
          response.error || "Có lỗi xảy ra khi phân công thẩm phán"
        );
      }
    } catch (error) {
      console.error("Error assigning judge:", error);
      toast.error(
        "Phân công thất bại",
        "Có lỗi xảy ra khi phân công thẩm phán"
      );
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleFormSubmit = async (data: LegalCaseRequest) => {
    if (!legalCase) return;

    try {
      setFormLoading(true);
      await LegalCaseService.update(
        legalCase.legalCaseId,
        data as LegalCaseRequest
      );
      toast.success("Cập nhật thành công", "Án đã được cập nhật thành công!");
      setShowEditForm(false);
      await fetchLegalCase(); // Reload data
    } catch (error) {
      console.error("Error updating legal case:", error);
      toast.error(
        "Có lỗi xảy ra",
        "Không thể cập nhật thông tin án. Vui lòng thử lại!"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!legalCase) return;

    try {
      await LegalCaseService.delete(legalCase.legalCaseId);
      toast.success("Xóa thành công", "Án đã được xóa khỏi hệ thống!");
      navigate("/legal-case");
    } catch (error) {
      console.error("Error deleting legal case:", error);
      toast.error(
        "Xóa thất bại",
        "Có lỗi xảy ra khi xóa án. Vui lòng thử lại!"
      );
    }
    setShowConfirmModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!legalCase) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy vụ án
        </h3>
        <p className="text-gray-600">Vụ án không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/legal-case")}
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
              Chi tiết vụ án
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Số thụ lý: {legalCase.acceptanceNumber}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {auth?.hasPermission(Permission.CREATE_LEGAL_CASE) && (
            <button
              onClick={handleAddDecision}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
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
              Thêm quyết định
            </button>
          )}
          {auth?.hasPermission(Permission.ASSIGN_LEGAL_CASE) && (
            <>
              {!legalCase?.judge ? (
                <button
                  onClick={handleAssign}
                  disabled={assignmentLoading}
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  {assignmentLoading ? 'Đang xử lý...' : 'Phân công'}
                </button>
              ) : (
                <button
                  onClick={handleRemoveAssignmentClick}
                  disabled={assignmentLoading}
                  className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 text-sm font-medium rounded-lg bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM21 12h-6"
                    />
                  </svg>
                  {assignmentLoading ? 'Đang xử lý...' : 'Xóa phân công'}
                </button>
              )}
            </>
          )}
          {auth?.hasPermission(Permission.EDIT_LEGAL_CASE) && (
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
          )}
          {auth?.hasPermission(Permission.DELETE_LEGAL_CASE) && (
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
          )}
        </div>
      </div>

      {/* Main Card - Similar to LegalCaseCard Layout */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
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
                                      legalCase.legalRelationship.legalCaseType
                                        .codeName === "HS"
                                        ? "bg-red-50 text-red-600 border border-red-300"
                                        : legalCase.legalRelationship
                                            .legalCaseType.codeName === "DS"
                                        ? "bg-blue-50 text-blue-600 border border-blue-300"
                                        : legalCase.legalRelationship
                                            .legalCaseType.codeName === "HN"
                                        ? "bg-pink-50 text-pink-600 border border-pink-300"
                                        : legalCase.legalRelationship
                                            .legalCaseType.codeName === "LD"
                                        ? "bg-purple-50 text-purple-600 border border-purple-300"
                                        : legalCase.legalRelationship
                                            .legalCaseType.codeName === "KT"
                                        ? "bg-orange-50 text-orange-600 border border-orange-300"
                                        : legalCase.legalRelationship
                                            .legalCaseType.codeName === "HC"
                                        ? "bg-green-50 text-green-600 border border-green-300"
                                        : legalCase.legalRelationship
                                            .legalCaseType.codeName === "PS"
                                        ? "bg-yellow-50 text-yellow-600 border border-yellow-300"
                                        : legalCase.legalRelationship
                                            .legalCaseType.codeName === "BP"
                                        ? "bg-stone-50 text-stone-600 border border-stone-300"
                                        : ""
                                    }
                                    `}>
                  {legalCase.legalRelationship.legalCaseType.legalCaseTypeName}
                </span>
              </div>
            </div>

            {/* Parties - Horizontal on larger screens */}
            <div className="mb-4">
                        {legalCase.litigants && legalCase.litigants.length > 0 ? (
                          <>
                            {(() => {
                              const plaintiffs = legalCase.litigants.filter(
                                (l) =>
                                  l.litigantType == ("PLAINTIFF" as LitigantType) ||
                                  l.litigantType == ("ACCUSED" as LitigantType)
                              );
                              const defendants = legalCase.litigants.filter(
                                (l) => l.litigantType == ("DEFENDANT" as LitigantType)
                              );
            
                              return (
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Cột trái: Nguyên đơn / Bị cáo */}
                                  <div className="space-y-3">
                                    {(showAllPlaintiffs
                                      ? plaintiffs
                                      : plaintiffs.slice(0, 2)
                                    ).map((litigant, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start space-x-3">
                                        <div
                                          className={`w-17 h-17 rounded-lg flex items-center justify-center flex-shrink-0
                                          ${
                                            legalCase.legalRelationship.legalCaseType.codeName === "HS"
                                              ? "bg-red-100"
                                              : "bg-blue-100"
                                          }`}>
                                          <svg
                                            className={`w-10 h-10 ${
                                              legalCase.legalRelationship.legalCaseType
                                                .codeName === "HS"
                                                ? "text-red-600"
                                                : "text-blue-600"
                                            }`}
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
                                            {legalCase.legalRelationship.legalCaseType
                                              .codeName === "HS"
                                              ? "Bị cáo"
                                              : "Nguyên đơn"}
                                          </p>
                                          <p className="text-base font-semibold text-gray-900">
                                            {litigant.name +
                                              (litigant.yearOfBirth
                                                ? " - " + litigant.yearOfBirth
                                                : "")}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {litigant.address}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {plaintiffs.length > 2 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowAllPlaintiffs(!showAllPlaintiffs);
                                        }}
                                        className="w-full text-sm text-orange-600 font-semibold flex items-center justify-center gap-2 py-2 bg-orange-50 rounded-lg border border-orange-200">
                                        {showAllPlaintiffs ? (
                                          <>
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24">
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 15l7-7 7 7"
                                              />
                                            </svg>
                                            Thu gọn
                                          </>
                                        ) : (
                                          <>
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24">
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                            Xem thêm {plaintiffs.length - 2} người
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
            
                                  {/* Cột phải: Bị đơn */}
                                  <div className="space-y-3">
                                    {(showAllDefendants
                                      ? defendants
                                      : defendants.slice(0, 2)
                                    ).map((litigant, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start space-x-3">
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
                                          <p className="text-sm text-gray-500 mb-1">
                                            Bị đơn
                                          </p>
                                          <p className="text-base font-semibold text-gray-900">
                                            {litigant.name +
                                              (litigant.yearOfBirth
                                                ? " - " + litigant.yearOfBirth
                                                : "")}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {litigant.address}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {defendants.length > 2 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowAllDefendants(!showAllDefendants);
                                        }}
                                        className="w-full text-sm text-rose-600 font-semibold flex items-center justify-center gap-2 py-2 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors">
                                        {showAllDefendants ? (
                                          <>
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24">
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 15l7-7 7 7"
                                              />
                                            </svg>
                                            Thu gọn
                                          </>
                                        ) : (
                                          <>
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24">
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                              />
                                            </svg>
                                            Xem thêm {defendants.length - 2} người
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            Chưa có thông tin đương sự
                          </div>
                        )}
                      </div>

            {/* Legal Relationship */}
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-600 mb-1">
                {legalCase.legalRelationship.legalCaseType.codeName === "HS"
                  ? "Tội"
                  : "Quan hệ pháp luật"}
              </p>
              <p className="text-md font-semibold text-blue-900 mb-1">
                {legalCase.legalRelationship.legalRelationshipName}
              </p>
              <p className="text-sm text-blue-700">
                {
                  legalCase.legalRelationship.legalRelationshipGroup
                    .legalRelationshipGroupName
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Storage Info */}
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
                    {legalCase.storageDate
                      ? formatDate(legalCase.storageDate.split(" ")[0])
                      : "Chưa nhập kho"}
                  </p>
                </div>
              </div>

              {/* Batch Info */}
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
                    <p className="text-sm text-gray-700">
                      Không có đợt nhập án
                    </p>
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

            {/* Status */}
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

            {/* Judge Assignment */}
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

            {/* Mediator */}
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
      </div>

      {/* Decisions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách quyết định
        </h3>
        {decisionsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : decisions.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500">Chưa có quyết định nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {decisions.map((decision) => (
              <div
                key={decision.decisionId}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      Quyết định {decision.number}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    {auth?.hasPermission(Permission.EDIT_LEGAL_CASE) && (
                      <button
                        onClick={() => handleEditDecision(decision)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-yellow-600 bg-yellow-50 border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors">
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
                    )}
                    {auth?.hasPermission(Permission.DELETE_LEGAL_CASE) && (
                      <button
                        onClick={() => handleDeleteDecisionClick(decision)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors">
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
                    )}
                    <div className="text-sm text-gray-900 font-mono">
                      {decision.decisionId}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Thông tin cơ bản */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Số quyết định:
                      </span>
                      <span className="text-base text-gray-900 font-semibold">
                        {decision.number}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Ngày ban hành:
                      </span>
                      <span className="text-base text-gray-900">
                        {formatDate(decision.releaseDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Ngày thêm vào hệ thống:
                      </span>
                      <span className="text-base text-gray-900">
                        {formatDate(decision.addedDate)}
                      </span>
                    </div>
                  </div>

                  {/* Thông tin loại quyết định */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Mã loại quyết định:
                      </span>
                      <span className="text-base text-gray-900 font-mono">
                        {decision.decisionType.decisionTypeId}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Tên loại quyết định:
                      </span>
                      <span className="text-base text-gray-900">
                        {decision.decisionType.decisionTypeName}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Loại vụ án:
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {decision.decisionType.legalCaseType.codeName}
                        </span>
                        <span className="text-base text-gray-900">
                          {
                            decision.decisionType.legalCaseType
                              .legalCaseTypeName
                          }
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Tòa án ban hành:
                      </span>
                      <span className="text-base text-gray-900">
                        {decision.decisionType.courtIssued === "CURRENT_COURT"
                          ? "Tòa án hiện tại"
                          : "Tòa án cấp trên"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 block">
                        Quyết định cuối cùng:
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          decision.decisionType.theEndDecision
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {decision.decisionType.theEndDecision
                          ? "Có"
                          : "Không"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                {decision.note && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800 block mb-1">
                      Ghi chú:
                    </span>
                    <p className="text-sm text-yellow-700">{decision.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <JudgeAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onAssign={handleAssignSubmit}
        legalCase={legalCase}
        isLoading={assignmentLoading}
      />

      <LegalCaseForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleFormSubmit}
        legalCase={legalCase}
        legalRelationships={legalRelationships}
        isLoading={formLoading}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa án"
        message={`Bạn có chắc chắn muốn xóa án "${legalCase.acceptanceNumber}"? Hành động này không thể hoàn tác.`}
        type="danger"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      <ConfirmModal
        isOpen={showRemoveAssignmentModal}
        onClose={() => setShowRemoveAssignmentModal(false)}
        onConfirm={confirmRemoveAssignment}
        title="Xác nhận xóa phân công"
        message={`Bạn có chắc chắn muốn xóa phân công thẩm phán "${legalCase.judge?.fullName}" khỏi án "${legalCase.acceptanceNumber}"?`}
        type="danger"
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
      />

      <ConfirmModal
        isOpen={showDeleteDecisionModal}
        onClose={() => setShowDeleteDecisionModal(false)}
        onConfirm={confirmDeleteDecision}
        title="Xác nhận xóa quyết định"
        message={`Bạn có chắc chắn muốn xóa quyết định số "${selectedDecision?.number}"? Hành động này không thể hoàn tác.`}
        type="danger"
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
      />

      {/* Decision Form - Add */}
      <DecisionForm
        isOpen={showDecisionForm}
        onClose={() => {
          setShowDecisionForm(false);
          setSelectedDecision(null);
        }}
        onSubmit={handleDecisionSubmit}
        legalCaseId={legalCase.legalCaseId}
        isLoading={decisionFormLoading}
        legalCaseTypeId={legalCase.legalRelationship.legalCaseType.legalCaseTypeId}
      />

      {/* Decision Form - Edit */}
      <DecisionForm
        isOpen={showEditDecisionForm}
        onClose={() => {
          setShowEditDecisionForm(false);
          setSelectedDecision(null);
        }}
        onSubmit={handleEditDecisionSubmit}
        legalCaseId={legalCase.legalCaseId}
        isLoading={decisionFormLoading}
        legalCaseTypeId={legalCase.legalRelationship.legalCaseType.legalCaseTypeId}
        decision={selectedDecision}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default LegalCaseDetailsPage;
