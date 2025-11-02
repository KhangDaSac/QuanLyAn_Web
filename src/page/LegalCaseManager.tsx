import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LegalCaseCard from "../component/legal-case-manager/LegalCaseCard";
import LegalCaseForm from "../component/legal-case-manager/LegalCaseForm";
import JudgeAssignmentModal from "../component/legal-case-manager/JudgeAssignmentModal";
import ConfirmModal from "../component/basic-component/ConfirmModal";
import BatchForm from "../component/basic-component/BatchForm";
import Pagination from "../component/basic-component/Pagination";
import { ToastContainer, useToast } from "../component/basic-component/Toast";
import { LegalCaseService } from "../services/LegalCaseService";
import { JudgeService } from "../services/JudgeService";
import { LegalCaseTypeService } from "../services/LegalCaseTypeService";
import { BatchService } from "../services/BatchService";
import type { LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import type { LegalCaseSearchRequest } from "../types/request/legal-case/LegalCaseSearchRequest";
import type { LegalCaseRequest } from "../types/request/legal-case/LegalCaseRequest";
import type { AssignAssignmentRequest } from "../types/request/legal-case/AssignAssignmentRequest";
import ComboboxSearch, {
  type Option,
} from "../component/basic-component/ComboboxSearch";
import { LegalRelationshipService } from "../services/LegalRelationshipService";
import { LegalRelationshipGroupService } from "../services/LegalRelationshipGroupService";
import * as XLSX from "xlsx-js-style";
import type { LegalCasesRequest } from "../types/request/legal-case/LegalCasesRequest";
import { LegalCaseStatus } from "../types/enum/LegalCaseStatus";
import { useAuth } from "../context/authContext/useAuth";
import { Permission } from "../utils/authUtils";

const LegalCaseManager = () => {
  // Helper function to clean search criteria
  const cleanSearchCriteria = (
    criteria: LegalCaseSearchRequest
  ): LegalCaseSearchRequest => {
    return {
      acceptanceNumber: criteria.acceptanceNumber?.trim() || null,
      startAcceptanceDate: criteria.startAcceptanceDate || null,
      endAcceptanceDate: criteria.endAcceptanceDate || null,
      legalCaseTypeId: criteria.legalCaseTypeId || null,
      legalRelationshipId: criteria.legalRelationshipId || null,
      legalRelationshipGroupId: criteria.legalRelationshipGroupId || null,
      litigantName: criteria.litigantName?.trim() || null,
      litigantYearOfBirth: criteria.litigantYearOfBirth?.trim() || null,
      litigantAddress: criteria.litigantAddress?.trim() || null,
      legalCaseStatus: criteria.legalCaseStatus || null,
      judgeId: criteria.judgeId || null,
      batchId: criteria.batchId || null,
      startStorageDate: criteria.startStorageDate
        ? `${criteria.startStorageDate} 00:00:00`
        : null,
      endStorageDate: criteria.endStorageDate
        ? `${criteria.endStorageDate} 00:00:00`
        : null,
    };
  };

  const auth = useAuth();
  const navigate = useNavigate();
  const [legalCases, setLegalCases] = useState<LegalCaseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    isFirst: true,
    isLast: false,
  });

  // Separate state for sort criteria
  const [sortBy, setSortBy] = useState("acceptanceDate");

  const [legalCaseSearch, setLegalCaseSearch] =
    useState<LegalCaseSearchRequest>({
      acceptanceNumber: null,
      startAcceptanceDate: null,
      endAcceptanceDate: null,
      legalCaseTypeId: null,
      legalRelationshipId: null,
      legalRelationshipGroupId: null,
      litigantName: null,
      litigantYearOfBirth: null,
      litigantAddress: null,
      legalCaseStatus: null,
      judgeId: null,
      batchId: null,
      startStorageDate: null,
      endStorageDate: null,
    });

  // Page size options
  const pageSizeOptions: Option[] = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  // Sort by options
  const sortByOptions: Option[] = [
    { value: "acceptanceDate", label: "Ngày thụ lý" },
    { value: "acceptanceNumber", label: "Số thụ lý" },
    { value: "storageDate", label: "Ngày lưu trữ" },
  ];

  const [statusOfLegalCaseFilters, setStatusOfLegalCaseFilters] = useState({
    statusOfLegalCase: "",
  });

  const statusOfLegalCases: Option[] = [
    { value: "", label: "Tất cả trạng thái" },
    ...Object.entries(LegalCaseStatus).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  ];

  const [typeOfLegalCaseFilters, setTypeOfLegalCaseFilters] = useState({
    typeOfLegalCaseId: "",
  });

  const [typeOfLegalCases, setTypeOfLegalCases] = useState<Option[]>([
    { value: "", label: "Tất cả loại án" },
  ]);

  const [legalRelationshipFilters, setLegalRelationshipFilters] = useState({
    legalRelationshipId: "",
  });
  const [legalRelationships, setLegalRelationships] = useState<Option[]>([
    { value: "", label: "Tất cả quan hệ pháp luật" },
  ]);

  const [legalRelationshipGroupFilters, setLegalRelationshipGroupFilters] =
    useState({
      legalRelationshipGroupId: "",
    });

  const [legalRelationshipGroups, setLegalRelationshipGroups] = useState<
    Option[]
  >([{ value: "", label: "Tất cả nhóm quan hệ pháp luật" }]);

  // Batch filters state
  const [batchFilters, setBatchFilters] = useState({
    batchId: "",
  });
  const [batches, setBatches] = useState<Option[]>([
    { value: "", label: "Tất cả đợt nhập" },
  ]);

  // Judge filters state
  const [judgeFilters, setJudgeFilters] = useState({
    judgeId: "",
  });
  const [judges, setJudges] = useState<Option[]>([
    { value: "", label: "Tất cả thẩm phán" },
  ]);

  // States for form modal
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<LegalCaseResponse | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);

  // States for judge assignment modal
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assigningCase, setAssigningCase] = useState<LegalCaseResponse | null>(
    null
  );
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  // Import Excel
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showBatchForm, setShowBatchForm] = useState(false);

  // Export Excel
  const [exportLoading, setExportLoading] = useState(false);

  // Toast và Confirm Modal
  const toast = useToast();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "warning" | "danger" | "info" | "success";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: () => {},
  });

  useEffect(() => {
    // Only run on initial mount, not when handleSearch changes
    const initialSearch = async () => {
      setLoading(true);
      try {
        const { data } = await LegalCaseService.search(
          legalCaseSearch,
          pagination.page,
          pagination.size,
          sortBy
        );
        if (data) {
          setLegalCases(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement, // Fallback nếu backend chưa có totalElements
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
        console.log("Initial search response:", data);
      } catch (error) {
        console.error("Error searching legal cases:", error);
      } finally {
        setLoading(false);
      }
    };

    initialSearch();
    fetchTypeOfLegalCases();
    fetchLegalRelationships();
    fetchLegalRelationshipGroups();
    fetchBatches();
    fetchJudges();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (pagination.hasPrevious) {
            handlePageChange(pagination.page - 1);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (pagination.hasNext) {
            handlePageChange(pagination.page + 1);
          }
          break;
        case "Home":
          event.preventDefault();
          if (!pagination.isFirst) {
            handlePageChange(0);
          }
          break;
        case "End":
          event.preventDefault();
          if (!pagination.isLast) {
            handlePageChange(pagination.totalPages - 1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    pagination.page,
    pagination.hasNext,
    pagination.hasPrevious,
    pagination.isFirst,
    pagination.isLast,
    pagination.totalElements,
    pagination.size,
  ]);

  const fetchLegalCases = async () => {
    // This function is no longer needed as we use handleSearch
    await handleSearch();
  };

  const fetchTypeOfLegalCases = async () => {
    setLoading(true);
    try {
      const { data } = await LegalCaseTypeService.getAll();
      if (data) {
        setTypeOfLegalCases([
          ...typeOfLegalCases,
          ...data.map(
            (item): Option => ({
              value: item.legalCaseTypeId,
              label: item.legalCaseTypeName,
            })
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching legal cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLegalRelationships = async () => {
    setLoading(true);
    try {
      const { data } = await LegalRelationshipService.getAll();
      if (data) {
        setLegalRelationships([
          ...legalRelationships,
          ...data.map(
            (item): Option => ({
              value: item.legalRelationshipId,
              label: item.legalRelationshipName,
            })
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching legal cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLegalRelationshipGroups = async () => {
    setLoading(true);
    try {
      const { data } = await LegalRelationshipGroupService.getAll();
      if (data) {
        setLegalRelationshipGroups([
          ...legalRelationshipGroups,
          ...data.map(
            (item): Option => ({
              value: item.legalRelationshipGroupId,
              label: item.legalRelationshipGroupName,
            })
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching legal cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await BatchService.getAll();
      const content = response.data;
      if (content) {
        setBatches([
          ...batches,
          ...content.map(
            (item): Option => ({
              value: item.batchId,
              label: item.batchId + " - " + item.batchName,
            })
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJudges = async () => {
    setLoading(true);
    try {
      const response = await JudgeService.getAll();
      if (response.success && response.data) {
        setJudges([
          ...judges,
          ...response.data.map(
            (item): Option => ({
              value: item.officerId,
              label: item.fullName,
            })
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching judges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const cleanedCriteria = cleanSearchCriteria(legalCaseSearch);
      const { data } = await LegalCaseService.search(
        cleanedCriteria,
        0,
        pagination.size,
        sortBy
      );
      if (data) {
        setLegalCases(data.content);
        setPagination({
          page: data.number,
          size: data.size,
          totalElements: data.totalElements || data.numberOfElement, // Fallback nếu backend chưa có totalElements
          totalPages:
            data.totalPages ||
            Math.ceil((data.totalElements || data.numberOfElement) / data.size),
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious,
          isFirst: data.isFirst,
          isLast: data.isLast,
        });
      }
      console.log("Search response:", data); // Debug log
    } catch (error) {
      console.error("Error searching legal cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    const clearedSearch = {
      acceptanceNumber: null,
      startAcceptanceDate: null,
      endAcceptanceDate: null,
      legalCaseTypeId: null,
      legalRelationshipId: null,
      legalRelationshipGroupId: null,
      litigantName: null,
      litigantYearOfBirth: null,
      litigantAddress: null,
      legalCaseStatus: null,
      judgeId: null,
      batchId: null,
      startStorageDate: null,
      endStorageDate: null,
    };
    setLegalCaseSearch(clearedSearch);

    // Reset all filter states
    setStatusOfLegalCaseFilters({ statusOfLegalCase: "" });
    setTypeOfLegalCaseFilters({ typeOfLegalCaseId: "" });
    setLegalRelationshipFilters({ legalRelationshipId: "" });
    setLegalRelationshipGroupFilters({ legalRelationshipGroupId: "" });
    setBatchFilters({ batchId: "" });
    setJudgeFilters({ judgeId: "" });

    // Reset pagination to first page but keep size and sortBy
    setPagination((prev) => ({ ...prev, page: 0 }));
    // Perform search with cleared filters
    const searchWithCleared = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(clearedSearch);
        const { data } = await LegalCaseService.search(
          cleanedCriteria,
          0,
          pagination.size,
          sortBy
        );
        if (data) {
          setLegalCases(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement, // Fallback nếu backend chưa có totalElements
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal cases:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithCleared();
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    const searchWithNewPage = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(legalCaseSearch);
        const { data } = await LegalCaseService.search(
          cleanedCriteria,
          page,
          pagination.size,
          sortBy
        );
        if (data) {
          setLegalCases(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement,
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal cases:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewPage();
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, page: 0, size }));
    // Perform search with new page size
    const searchWithNewSize = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(legalCaseSearch);
        const { data } = await LegalCaseService.search(
          cleanedCriteria,
          0,
          size,
          sortBy
        );
        if (data) {
          setLegalCases(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement, // Fallback nếu backend chưa có totalElements
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal cases:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewSize();
  };

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPagination((prev) => ({ ...prev, page: 0 }));
    const searchWithNewSort = async () => {
      setLoading(true);
      try {
        const cleanedCriteria = cleanSearchCriteria(legalCaseSearch);
        const { data } = await LegalCaseService.search(
          cleanedCriteria,
          0,
          pagination.size,
          newSortBy
        );
        if (data) {
          setLegalCases(data.content);
          setPagination({
            page: data.number,
            size: data.size,
            totalElements: data.totalElements || data.numberOfElement, // Fallback nếu backend chưa có totalElements
            totalPages:
              data.totalPages ||
              Math.ceil(
                (data.totalElements || data.numberOfElement) / data.size
              ),
            hasNext: data.hasNext,
            hasPrevious: data.hasPrevious,
            isFirst: data.isFirst,
            isLast: data.isLast,
          });
        }
      } catch (error) {
        console.error("Error searching legal cases:", error);
      } finally {
        setLoading(false);
      }
    };
    searchWithNewSort();
  };

  /*
  const handleEdit = (legalCase: LegalCaseResponse) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận chỉnh sửa',
      message: `Bạn có muốn chỉnh sửa án "${legalCase.acceptanceNumber}"?`,
      type: 'danger',
      onConfirm: () => confirmEdit(legalCase),
    });
  };

  const confirmEdit = (legalCase: LegalCaseResponse) => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
    setEditingCase(legalCase);
    setShowForm(true);
    toast.info('Bắt đầu chỉnh sửa', `Đang mở form chỉnh sửa án "${legalCase.acceptanceNumber}"`);
  };

  const handleDelete = async (legalCaseId: string) => {
    const legalCase = legalCases.find(lc => lc.legalCaseId === legalCaseId);
    if (!legalCase) return;

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa án',
      message: `Bạn có chắc chắn muốn xóa án "${legalCase.acceptanceNumber}"? Hành động này không thể hoàn tác.`,
      type: 'danger',
      onConfirm: () => confirmDelete(legalCaseId),
    });
  };

  const confirmDelete = async (legalCaseId: string) => {
    try {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
      setLoading(true);
      await LegalCaseService.delete(legalCaseId);
      setLegalCases(prev => prev.filter(lc => lc.legalCaseId !== legalCaseId));
      toast.success('Xóa thành công', 'Án đã được xóa khỏi hệ thống!');
    } catch (error) {
      console.error('Error deleting legal case:', error);
      toast.error('Xóa thất bại', 'Có lỗi xảy ra khi xóa án. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = (legalCase: LegalCaseResponse) => {
    setAssigningCase(legalCase);
    setShowAssignmentModal(true);
    toast.info('Phân công thẩm phán', `Đang mở form phân công cho án "${legalCase.acceptanceNumber}"`);
  };
  */

  const handleViewDetails = (legalCase: LegalCaseResponse) => {
    navigate(`/legal-case-details/${legalCase.legalCaseId}`);
  };

  const handleAssignSubmit = async (judgeId: string) => {
    if (!assigningCase) return;

    setAssignmentLoading(true);
    try {
      const request: AssignAssignmentRequest = {
        legalCaseId: assigningCase.legalCaseId,
        judgeId: judgeId,
      };

      const response = await LegalCaseService.assignAssignment(request);

      if (response.success) {
        toast.success(
          "Phân công thành công",
          `Đã phân công thẩm phán cho án "${assigningCase.acceptanceNumber}"`
        );
        setShowAssignmentModal(false);
        setAssigningCase(null);
        // Reload data to show updated assignment
        await handleSearch();
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
    try {
      setFormLoading(true);

      if (editingCase) {
        // Cập nhật án
        await LegalCaseService.update(
          editingCase.legalCaseId,
          data as LegalCaseRequest
        );
        toast.success("Cập nhật thành công", "Án đã được cập nhật thành công!");
      } else {
        // Thêm án mới
        await LegalCaseService.create(data as LegalCaseRequest);
        toast.success(
          "Thêm mới thành công",
          "Án mới đã được thêm vào hệ thống!"
        );
      }

      // Load lại danh sách án sau khi thêm/sửa thành công
      await fetchLegalCases();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving legal case:", error);
      toast.error(
        "Có lỗi xảy ra",
        "Không thể lưu thông tin án. Vui lòng thử lại!"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  const handleAddNew = () => {
    setEditingCase(null);
    setShowForm(true);
  };

  const handleImportExcel = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = async () => {
    try {
      // Kiểm tra xem file có tồn tại không
      const response = await fetch("/Mẫu_Import_Vụ_Án.xlsx", {
        method: "HEAD",
      });

      if (!response.ok) {
        // Nếu file không tồn tại, tạo file mẫu động
        createAndDownloadTemplate();
        return;
      }

      // Tạo link để download file mẫu từ thư mục public
      const link = document.createElement("a");
      link.href = "/Mẫu_Import_Vụ_Án.xlsx";
      link.download = "Mẫu_Import_Vụ_Án.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hiển thị toast thông báo
      toast.success(
        "Tải xuống thành công",
        "File mẫu import đã được tải về máy của bạn"
      );
    } catch (error) {
      console.error("Error downloading template:", error);
      // Fallback: tạo file mẫu động
      createAndDownloadTemplate();
    }
  };

  const createAndDownloadTemplate = () => {
    try {
      // Tạo workbook mới
      const wb = XLSX.utils.book_new();

      // Tạo dữ liệu mẫu
      const sampleData = [
        {
          "Số vụ án": "VV001/2024",
          "Ngày thụ lý": "2024-01-01",
          "Nguyên đơn": "Nguyễn Văn A",
          "Địa chỉ nguyên đơn": "123 Nguyễn Trãi, Hà Nội",
          "Bị đơn": "Trần Thị B",
          "Địa chỉ bị đơn": "456 Lê Lợi, TP.HCM",
          "Loại vụ án": "DS01",
          "Quan hệ pháp luật": "QL001",
          "Nhóm quan hệ pháp luật": "NQL001",
          "Trạng thái": "Chờ được phân công",
          "Thẩm phán": "",
          "Hòa giải viên": "",
          "Ghi chú": "Đây là dữ liệu mẫu",
        },
        {
          "Số vụ án": "VV002/2024",
          "Ngày thụ lý": "2024-01-02",
          "Nguyên đơn": "Phạm Văn C",
          "Địa chỉ nguyên đơn": "789 Trường Chinh, Đà Nẵng",
          "Bị đơn": "Lê Thị D",
          "Địa chỉ bị đơn": "321 Hai Bà Trưng, Huế",
          "Loại vụ án": "HS02",
          "Quan hệ pháp luật": "QL002",
          "Nhóm quan hệ pháp luật": "NQL002",
          "Trạng thái": "Đang giải quyết",
          "Thẩm phán": "Thẩm phán Nguyễn E",
          "Hòa giải viên": "",
          "Ghi chú": "",
        },
      ];

      // Tạo worksheet
      const ws = XLSX.utils.json_to_sheet(sampleData);

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách vụ án");

      // Tạo buffer và download
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Mẫu_Import_Vụ_Án.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(link.href);

      toast.success(
        "Tạo mẫu thành công",
        "File mẫu import đã được tạo và tải về máy của bạn"
      );
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Lỗi", "Không thể tạo file mẫu. Vui lòng thử lại sau.");
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "application/json", // .json
      "text/plain", // .txt (có thể chứa JSON)
    ];

    const fileExtension = file.name.toLowerCase().split(".").pop();
    const isExcelFile = ["xlsx", "xls"].includes(fileExtension || "");

    if (!allowedTypes.includes(file.type) && !isExcelFile) {
      toast.error(
        "File không hợp lệ",
        "Vui lòng chọn file Excel (.xlsx, .xls) hoặc JSON (.json)"
      );
      return;
    }

    // Lưu file và hiển thị BatchForm
    setSelectedFile(file);
    setShowBatchForm(true);
  };

  const handleBatchSubmit = async (batchId: String, file: File) => {
    try {
      setShowBatchForm(false);
      setImportLoading(true);

      // Đọc file Excel
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
      const worksheet = workbook.Sheets[sheetName];

      // Chuyển sheet thành JSON, bỏ qua dòng tiêu đề (header)
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      }); // Lấy mảng mảng

      // Bỏ dòng đầu tiên (tiêu đề)
      jsonData.shift();

      // Mảng để lưu các lỗi validation
      const validationErrors: string[] = [];
      const validLegalCases: LegalCaseRequest[] = [];

      // Helper function để parse thông tin đương sự từ format "Tên;Năm sinh;Địa chỉ"
      const parseLitigants = (
        cellValue: any,
        litigantType: string,
        rowNumber: number
      ): any[] => {
        if (!cellValue) return [];

        const litigants: any[] = [];
        const lines = cellValue.toString().split("\n"); // Tách các dòng

        lines.forEach((line, lineIndex) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;

          const parts = trimmedLine.split(";");

          if (parts.length !== 3) {
            validationErrors.push(
              `Dòng ${rowNumber}: ${litigantType} có định dạng không đúng (cần: Tên;Năm sinh;Địa chỉ). Giá trị: "${trimmedLine}"`
            );
            return;
          }

          const [name, yearOfBirth, address] = parts.map((p) => p.trim());

          // Validation
          if (!name) {
            validationErrors.push(
              `Dòng ${rowNumber}: ${litigantType} thiếu tên`
            );
            return;
          }

          // Validate năm sinh nếu có
          if (yearOfBirth) {
            const year = parseInt(yearOfBirth, 10);
            if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
              validationErrors.push(
                `Dòng ${rowNumber}: ${litigantType} có năm sinh không hợp lệ (${yearOfBirth})`
              );
              return;
            }
          }

          litigants.push({
            name,
            yearOfBirth: yearOfBirth || null,
            address: address || null,
            litigantType,
            ordinal: lineIndex + 1,
          });
        });

        return litigants;
      };

      // Chuyển dữ liệu thành LegalCasesRequest
      jsonData.forEach((row, index) => {
        const rowNumber = index + 2; // +2 vì bỏ header và index bắt đầu từ 0

        // Bỏ qua các dòng trống
        if (!row || row.length === 0 || !row[1]) {
          return;
        }

        const acceptanceNumber = row[1]?.toString().trim() || null;

        // Xử lý ngày với validation
        const dateResult = excelDateToISO(row[2], rowNumber);
        const acceptanceDate = dateResult.date || null;

        // Thêm lỗi ngày nếu có
        if (dateResult.error) {
          validationErrors.push(dateResult.error);
        }

        // Parse các loại đương sự
        const accusedLitigants = parseLitigants(row[3], "ACCUSED", rowNumber);
        const plaintiffLitigants = parseLitigants(
          row[4],
          "PLAINTIFF",
          rowNumber
        );
        const defendantLitigants = parseLitigants(
          row[5],
          "DEFENDANT",
          rowNumber
        );

        // Gộp tất cả đương sự
        const allLitigants = [
          ...accusedLitigants,
          ...plaintiffLitigants,
          ...defendantLitigants,
        ];

        const note = row[6]?.toString().trim() || null;
        const legalRelationshipId = row[7]?.toString().trim() || null;
        const judgeId = row[8]?.toString().trim() || null;
        const mediatorId = row[9]?.toString().trim() || null;

        // Validation dữ liệu bắt buộc
        if (!acceptanceNumber) {
          validationErrors.push(`Dòng ${rowNumber}: Thiếu số thụ lý`);
        }
        if (!acceptanceDate && !dateResult.error) {
          validationErrors.push(`Dòng ${rowNumber}: Thiếu ngày thụ lý`);
        }
        if (allLitigants.length === 0) {
          validationErrors.push(
            `Dòng ${rowNumber}: Phải có ít nhất một đương sự (Bị cáo/Nguyên đơn/Bị đơn)`
          );
        }
        if (!legalRelationshipId) {
          validationErrors.push(
            `Dòng ${rowNumber}: Thiếu mã quan hệ pháp luật`
          );
        }

        // Chỉ thêm vào danh sách hợp lệ nếu không có lỗi nghiêm trọng và có đủ dữ liệu bắt buộc
        if (
          acceptanceNumber &&
          acceptanceDate &&
          allLitigants.length > 0 &&
          legalRelationshipId &&
          !dateResult.error
        ) {
          validLegalCases.push({
            acceptanceNumber,
            acceptanceDate,
            note,
            legalRelationshipId,
            litigants: allLitigants,
            judgeId: judgeId || null,
            mediatorId: mediatorId || null,
            batchId: batchId as string,
          });
        }
      });

      // Nếu có lỗi validation, hiển thị tất cả lỗi
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.slice(0, 5).join("\n"); // Hiển thị tối đa 5 lỗi đầu tiên
        const additionalErrors =
          validationErrors.length > 5
            ? `\n... và ${validationErrors.length - 5} lỗi khác`
            : "";

        toast.error("Dữ liệu không hợp lệ", errorMessage + additionalErrors);
        return;
      }

      // Nếu không có dữ liệu hợp lệ nào
      if (validLegalCases.length === 0) {
        toast.error("Nhập án thất bại", "Không có dữ liệu hợp lệ để nhập");
        return;
      }

      const legalCasesRequest: LegalCasesRequest = {
        legalCases: validLegalCases,
        batchId: batchId,
      };

      const response = await LegalCaseService.importFromExcel(
        legalCasesRequest
      );

      if (response.success) {
        toast.success(
          "Nhập án thành công",
          `Đã nhập ${validLegalCases.length} vụ án thành công!`
        );
        await fetchLegalCases(); // Reload dữ liệu
      } else {
        toast.error(
          "Nhập án thất bại",
          response.error ?? "Có lỗi xảy ra khi nhập án"
        );
      }
    } catch (error) {
      console.error("Error importing file:", error);
      toast.error("Nhập án thất bại", "Có lỗi xảy ra khi nhập án");
    } finally {
      setImportLoading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCloseBatchForm = () => {
    setShowBatchForm(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function isoToDMY(isoDate: string): string {
    if (!isoDate) return "";

    const parts = isoDate.split("-");
    if (parts.length !== 3) return isoDate;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      const cleanedCriteria = cleanSearchCriteria(legalCaseSearch);
      const { data } = await LegalCaseService.search(
        cleanedCriteria,
        0,
        pagination.totalElements || 10000,
        sortBy
      );

      if (!data || !data.content || data.content.length === 0) {
        toast.error("Xuất Excel thất bại", "Không có dữ liệu để xuất");
        return;
      }

      const allLegalCases = data.content;
      const workbook = XLSX.utils.book_new();

      const headers = [
        "STT",
        "Số thụ lý",
        "Ngày thụ lý",
        "Bị cáo",
        "Nguyên đơn",
        "Bị đơn",
        "Ghi chú",
        "Quan hệ pháp luật",
        "Thẩm phán",
        "Hòa giải viên",
        "Mã đợt nhập",
      ];

      const formatLitigantsByType = (litigants, type) => {
        const filtered = litigants.filter((l) => l.litigantType === type);
        if (filtered.length === 0) return "";
        return filtered
          .map((l) => {
            const name = l.name || "";
            const year = l.yearOfBirth || "";
            const address = l.address || "";
            return `${name};${year};${address}`;
          })
          .join("\n");
      };

      const rows = allLegalCases.map((legalCase, index) => {
        const litigants = legalCase.litigants || [];
        return [
          index + 1,
          legalCase.acceptanceNumber || "",
          isoToDMY(legalCase.acceptanceDate) || "",
          formatLitigantsByType(litigants, "ACCUSED"),
          formatLitigantsByType(litigants, "PLAINTIFF"),
          formatLitigantsByType(litigants, "DEFENDANT"),
          legalCase.note || "",
          legalCase.legalRelationship?.legalRelationshipName || "",
          legalCase.judge?.fullName || "",
          legalCase.mediator?.fullName || "",
          legalCase.batch?.batchId || "",
        ];
      });

      const data_array = [headers, ...rows];
      const worksheet = XLSX.utils.aoa_to_sheet(data_array);

      // 🧩 Tự động điều chỉnh độ rộng cột
      // 🧩 Tự động điều chỉnh độ rộng cột dựa trên nội dung dài nhất
      const colWidths = headers.map((header, i) => {
        // Tìm chiều dài tối đa trong cột này (bao gồm cả xuống dòng)
        const maxLength = Math.max(
          header.length,
          ...rows.map((r) => {
            const val = r[i] ? r[i].toString() : "";
            // Với mỗi dòng có thể chứa nhiều dòng con (do xuống dòng)
            const lines = val.split(/\r?\n/);
            // Lấy chiều dài dòng dài nhất
            return Math.max(...lines.map((line) => line.length));
          })
        );

        // Nhân hệ số để vừa khít (≈ 1.2–1.5)
        const adjustedWidth = Math.min(Math.ceil(maxLength * 1.2) + 2, 80); // Giới hạn 80 ký tự

        return { wch: adjustedWidth };
      });

      worksheet["!cols"] = colWidths;

      // 🧩 Tự động điều chỉnh chiều cao hàng
      const rowHeights = data_array.map((row) => {
        const maxLines = Math.max(
          ...row.map((cell) => (cell ? cell.toString().split("\n").length : 1))
        );
        return { hpt: Math.min(20 * maxLines, 200) }; // 15pt mỗi dòng, tối đa 200pt
      });
      worksheet["!rows"] = rowHeights;

      // 🧩 Bật wrap text cho mọi ô
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          if (!cell) continue;
          if (!cell.s) cell.s = {};
          cell.s.alignment = {
            ...(cell.s.alignment || {}),
            wrapText: true,
            vertical: "top",
            horizontal: "left",
          };
          cell.s.font = {
            name: "Times New Roman",
            sz: 13,
          };
        }
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách vụ án");

      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[-:T]/g, "");
      const fileName = `danh_sach_vu_an_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      toast.success(
        "Xuất Excel thành công",
        `File "${fileName}" đã được tải về với ${allLegalCases.length} bản ghi!`
      );
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Xuất Excel thất bại", "Có lỗi xảy ra khi xuất file Excel");
    } finally {
      setExportLoading(false);
    }
  };

  const excelDateToISO = (
    excelValue: any,
    rowIndex?: number
  ): { date: string; error?: string } => {
    if (excelValue === null || excelValue === undefined || excelValue === "") {
      return { date: "" };
    }

    // -----------------------
    // Trường hợp Excel lưu ngày dạng số (serial)
    // -----------------------
    if (typeof excelValue === "number") {
      try {
        const dateObj = XLSX.SSF.parse_date_code(excelValue);
        if (!dateObj) {
          return {
            date: "",
            error: `Dòng ${rowIndex}: Không thể đọc định dạng ngày số`,
          };
        }

        // Tạo Date chỉ dựa trên năm, tháng, ngày (ignore timezone)
        const jsDate = new Date(dateObj.y, dateObj.m - 1, dateObj.d);

        // Lấy yyyy-MM-dd theo local (không dùng toISOString() để tránh lệch ngày)
        const isoDate = `${jsDate.getFullYear()}-${String(
          jsDate.getMonth() + 1
        ).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;

        return { date: isoDate };
      } catch (error) {
        return { date: "", error: `Dòng ${rowIndex}: Lỗi xử lý ngày số` };
      }
    }

    // -----------------------
    // Trường hợp Excel lưu chuỗi dạng "dd/MM/yyyy", "dd-MM-yyyy", "dd.MM.yyyy"
    // -----------------------
    if (typeof excelValue === "string") {
      const cleanValue = excelValue.trim(); // loại bỏ khoảng trắng đầu/cuối

      // Regex kiểm tra định dạng dd/MM/yyyy, dd-MM-yyyy, dd.MM.yyyy
      const datePattern = /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/;
      const match = cleanValue.match(datePattern);

      if (!match) {
        return {
          date: "",
          error: `Dòng ${rowIndex}: Ngày phải có định dạng dd/MM/yyyy (ví dụ: 15/03/2024)`,
        };
      }

      const [, dayStr, monthStr, yearStr] = match;
      const dayNum = parseInt(dayStr, 10);
      const monthNum = parseInt(monthStr, 10);
      const yearNum = parseInt(yearStr, 10);

      // Validate day, month, year
      if (dayNum < 1 || dayNum > 31) {
        return {
          date: "",
          error: `Dòng ${rowIndex}: Ngày không hợp lệ (${dayNum})`,
        };
      }

      if (monthNum < 1 || monthNum > 12) {
        return {
          date: "",
          error: `Dòng ${rowIndex}: Tháng không hợp lệ (${monthNum})`,
        };
      }

      if (yearNum < 1900 || yearNum > 2100) {
        return {
          date: "",
          error: `Dòng ${rowIndex}: Năm không hợp lệ (${yearNum})`,
        };
      }

      // Kiểm tra ngày tồn tại thực tế
      const testDate = new Date(yearNum, monthNum - 1, dayNum);
      if (
        testDate.getFullYear() !== yearNum ||
        testDate.getMonth() !== monthNum - 1 ||
        testDate.getDate() !== dayNum
      ) {
        return {
          date: "",
          error: `Dòng ${rowIndex}: Ngày không tồn tại (${dayNum}/${monthNum}/${yearNum})`,
        };
      }

      return {
        date: `${yearNum}-${String(monthNum).padStart(2, "0")}-${String(
          dayNum
        ).padStart(2, "0")}`,
      };
    }

    // -----------------------
    // Các loại dữ liệu khác
    // -----------------------
    return {
      date: "",
      error: `Dòng ${rowIndex}: Định dạng ngày không được hỗ trợ`,
    };
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Quản lý án
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Quản lý và theo dõi các vụ án trong hệ thống
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            Bộ lọc
          </button>
          {auth?.hasPermission(Permission.CREATE_LEGAL_CASE) && (
            <button
              onClick={handleAddNew}
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
              Thêm
            </button>
          )}
          {auth?.hasPermission(Permission.CREATE_LEGAL_CASE) && (
            <button
              onClick={handleDownloadTemplate}
              title="Tải xuống file Excel mẫu để xem định dạng import"
              className="inline-flex items-center px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Tải mẫu Excel
            </button>
          )}
          {auth?.hasPermission(Permission.CREATE_LEGAL_CASE) && (
            <button
              onClick={handleImportExcel}
              disabled={importLoading}
              title="Nhập dữ liệu vụ án từ file Excel (Tải mẫu trước để xem định dạng)"
              className="inline-flex items-center px-4 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {importLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang import...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Nhập từ tệp Excel
                </>
              )}
            </button>
          )}
          {auth?.hasPermission(Permission.VIEW_LEGAL_CASE) && (
            <button
              onClick={handleExportExcel}
              disabled={exportLoading}
              className="inline-flex items-center px-4 py-2 border border-green-300 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {exportLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xuất...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Xuất file Excel
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bộ lọc tìm kiếm
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Số thụ lý */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số thụ lý
              </label>
              <input
                type="text"
                value={legalCaseSearch?.acceptanceNumber ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    acceptanceNumber: e.target.value || null,
                  }))
                }
                placeholder="Nhập số thụ lý"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Ngày thụ lý từ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày thụ lý từ
              </label>
              <input
                type="date"
                value={legalCaseSearch?.startAcceptanceDate ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    startAcceptanceDate: e.target.value || null,
                  }))
                }
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Ngày thụ lý đến */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày thụ lý đến
              </label>
              <input
                type="date"
                value={legalCaseSearch?.endAcceptanceDate ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    endAcceptanceDate: e.target.value || null,
                  }))
                }
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Tên đương sự */}
            <div>
              <label className="block text-sm outline-none font-medium text-gray-700 mb-2">
                Tên đương sự
              </label>
              <input
                type="text"
                value={legalCaseSearch?.litigantName ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    litigantName: e.target.value || null,
                  }))
                }
                placeholder="Nhập tên đương sự"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Năm sinh đương sự */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm sinh đương sự
              </label>
              <input
                type="text"
                value={legalCaseSearch?.litigantYearOfBirth ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    litigantYearOfBirth: e.target.value || null,
                  }))
                }
                placeholder="Nhập năm sinh"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Địa chỉ đương sự */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ đương sự
              </label>
              <input
                type="text"
                value={legalCaseSearch?.litigantAddress ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    litigantAddress: e.target.value || null,
                  }))
                }
                placeholder="Nhập địa chỉ đương sự"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại vụ án
              </label>
              <ComboboxSearch
                options={typeOfLegalCases}
                value={typeOfLegalCaseFilters.typeOfLegalCaseId}
                onChange={(val) => {
                  setTypeOfLegalCaseFilters((prev) => ({
                    ...prev,
                    typeOfLegalCaseId: val,
                  }));
                  setLegalCaseSearch({
                    ...legalCaseSearch,
                    legalCaseTypeId: val != "" ? val : null,
                  });
                }}
                placeholder="Chọn trạng quan hệ pháp luật"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quan hệ pháp luật
              </label>
              <ComboboxSearch
                options={legalRelationships}
                value={legalRelationshipFilters.legalRelationshipId}
                onChange={(val) => {
                  setLegalRelationshipFilters((prev) => ({
                    ...prev,
                    legalRelationshipId: val,
                  }));
                  setLegalCaseSearch({
                    ...legalCaseSearch,
                    legalRelationshipId: val != "" ? val : null,
                  });
                }}
                placeholder="Chọn trạng quan hệ pháp luật"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm quan hệ pháp luật
              </label>
              <ComboboxSearch
                options={legalRelationshipGroups}
                value={legalRelationshipGroupFilters.legalRelationshipGroupId}
                onChange={(val) => {
                  setLegalRelationshipGroupFilters((prev) => ({
                    ...prev,
                    legalRelationshipGroupId: val,
                  }));
                  setLegalCaseSearch({
                    ...legalCaseSearch,
                    legalRelationshipGroupId: val != "" ? val : null,
                  });
                }}
                placeholder="Chọn trạng quan hệ pháp luật"
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái án
              </label>
              <ComboboxSearch
                options={statusOfLegalCases}
                value={statusOfLegalCaseFilters.statusOfLegalCase}
                onChange={(val) => {
                  setStatusOfLegalCaseFilters((prev) => ({
                    ...prev,
                    statusOfLegalCase: val,
                  }));
                  setLegalCaseSearch({
                    ...legalCaseSearch,
                    legalCaseStatus:
                      val != "" ? (val as LegalCaseStatus) : null,
                  });
                }}
                placeholder="Chọn trạng thái"
              />
            </div>

            {/* Thẩm phán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thẩm phán
              </label>
              <ComboboxSearch
                options={judges}
                value={judgeFilters.judgeId}
                onChange={(val) => {
                  setJudgeFilters((prev) => ({
                    ...prev,
                    judgeId: val,
                  }));
                  setLegalCaseSearch({
                    ...legalCaseSearch,
                    judgeId: val != "" ? val : null,
                  });
                }}
                placeholder="Chọn thẩm phán"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã đợt nhập
              </label>
              <ComboboxSearch
                options={batches}
                value={batchFilters.batchId}
                onChange={(val) => {
                  setBatchFilters((prev) => ({
                    ...prev,
                    batchId: val,
                  }));
                  setLegalCaseSearch({
                    ...legalCaseSearch,
                    batchId: val != "" ? val : null,
                  });
                }}
                placeholder="Chọn đợt nhập"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày nhập án từ
              </label>
              <input
                type="date"
                value={legalCaseSearch?.startStorageDate ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    startStorageDate: e.target.value || null,
                  }))
                }
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />

              {/* <input
                  type="date"
                  value={legalCaseSearch?.endStorageDate ?? ""}
                  onChange={(e) =>
                    setLegalCaseSearch((prev) => ({
                      ...prev,
                      endStorageDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
                /> */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày nhập án đến
              </label>
              <input
                type="date"
                value={legalCaseSearch?.endStorageDate ?? ""}
                onChange={(e) =>
                  setLegalCaseSearch((prev) => ({
                    ...prev,
                    endStorageDate: e.target.value || null,
                  }))
                }
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 md:px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50">
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Tìm kiếm</span>
              </span>
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 md:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Pagination Component */}
      {!loading && legalCases.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.size}
          hasNext={pagination.hasNext}
          hasPrevious={pagination.hasPrevious}
          isFirst={pagination.isFirst}
          isLast={pagination.isLast}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortByChange}
          pageSizeOptions={pageSizeOptions}
          sortOptions={sortByOptions}
          currentSort={sortBy}
          showPageInfo={true}
          showPageSizeSelector={true}
          showSortSelector={true}
          className="mb-6"
        />
      )}

      {/* Legal Cases List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {legalCases.map((legalCase) => (
            <LegalCaseCard
              key={legalCase.legalCaseId}
              legalCase={legalCase}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && legalCases.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <svg
            className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4"
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
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            Không có án nào
          </h3>
          <p className="text-sm md:text-base text-gray-600 px-4">
            Hiện tại chưa có án nào trong hệ thống hoặc không có kết quả tìm
            kiếm phù hợp.
          </p>
        </div>
      )}

      {/* Form Modal */}
      <LegalCaseForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        legalCase={editingCase}
        legalRelationships={legalRelationships}
        isLoading={formLoading}
      />

      {/* Judge Assignment Modal */}
      <JudgeAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setAssigningCase(null);
        }}
        onAssign={handleAssignSubmit}
        legalCase={assigningCase}
        isLoading={assignmentLoading}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />

      {/* Batch Form */}
      <BatchForm
        isOpen={showBatchForm}
        onClose={handleCloseBatchForm}
        onSubmit={handleBatchSubmit}
        file={selectedFile}
        loading={importLoading}
      />

      {/* Hidden File Input for File Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.json,.txt"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default LegalCaseManager;
