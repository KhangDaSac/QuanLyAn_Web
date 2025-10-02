import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import type { AccountResponse } from "../types/response/auth/AccountResponse";
import type AccountRequest from "../types/request/auth/AccountRequest";
import type { AccountSearchRequest } from "../types/request/auth/AccountSearchRequest";
import { StatusOfAccount } from "../types/enum/StatusOfAccount";
import AccountCard from "../component/account-manager/AccountCard";
import AccountForm from "../component/account-manager/AccountForm";
import Pagination from "../component/basic-component/Pagination";
import ConfirmModal from "../component/basic-component/ConfirmModal";
import ComboboxSearch, {
  type Option,
} from "../component/basic-component/ComboboxSearch";
import { Role } from "../types/enum/Role";
import { ToastContainer, useToast } from "../component/basic-component/Toast";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [accountSearch, setAccountSearch] = useState<AccountSearchRequest>({
    accountId: null,
    email: null,
    fullName: null,
    role: null,
    statusOfAccount: null,
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
    isFirst: true,
    isLast: false,
  });
  const [sortBy, setSortBy] = useState<string>("accountId");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountResponse | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirm modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [targetAccountId, setTargetAccountId] = useState<string>("");
  const [targetAccountName, setTargetAccountName] = useState<string>("");
  const [targetAccountActive, setTargetAccountActive] =
    useState<boolean>(false);
  const toast = useToast();

  const statusOptions: Option[] = [
    ...Object.entries(StatusOfAccount).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  ];

  const roles: Option[] = [
    ...Object.entries(Role).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  ];

  const pageSizeOptions: Option[] = [
    { value: "5", label: "5 bản ghi" },
    { value: "10", label: "10 bản ghi" },
    { value: "20", label: "20 bản ghi" },
    { value: "50", label: "50 bản ghi" },
  ];

  const sortByOptions: Option[] = [
    { value: "accountId", label: "Mã tài khoản" },
    { value: "email", label: "Email" },
    { value: "role", label: "Quyền" },
    { value: "statusOfAccount", label: "Trạng thái" },
  ];

  useEffect(() => {
    loadAccounts();
  }, [pagination.page, pagination.size, sortBy]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await AccountService.search(
        accountSearch,
        pagination.page,
        pagination.size,
        sortBy
      );

      // const response = await AccountService.getAllAccounts()

      if (response.success && response.data) {
        setAccounts(response.data.content);
        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
          isFirst: response.data.isFirst,
          isLast: response.data.isLast,
        });
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setPagination((prev) => ({ ...prev, page: 0 }));
    await loadAccounts();
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, page: 0, size }));
  };

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleReset = () => {
    setAccountSearch({
      accountId: null,
      email: null,
      fullName: null,
      role: null,
      statusOfAccount: null,
    });
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleEditAccount = (account: AccountResponse) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: AccountRequest) => {
    try {
      setIsSubmitting(true);
      let response;

      if (editingAccount) {
        // Update existing account - data là AccountUpdateRequest
        response = await AccountService.updateAccount(
          editingAccount.accountId,
          data as AccountRequest
        );
      } else {
        // Create new account - data là AccountRequest
        response = await AccountService.createAccount(data as AccountRequest);
      }

      if (response.success) {
        toast.success("Thành công", "Lưu tài khoản thành công");
        setShowForm(false);
        setEditingAccount(null);
        await loadAccounts();
      } else {
        toast.error("Lỗi", response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi lưu tài khoản");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (accountId: string, accountName: string) => {
    setTargetAccountId(accountId);
    setTargetAccountName(accountName);
    setShowDeleteModal(true);
  };

  const resetSearch = () => {
    handleReset();
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await AccountService.deleteAccount(targetAccountId);
      if (response.success) {
        toast.success("Thành công", "Xóa tài khoản thành công");
        await loadAccounts();
      } else {
        toast.error("Lỗi", response.message || "Không thể xóa tài khoản");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi xóa tài khoản");
    } finally {
      setShowDeleteModal(false);
      setTargetAccountId("");
      setTargetAccountName("");
    }
  };

  const handleToggleStatusClick = (
    accountId: string,
    accountName: string,
    isActive: boolean
  ) => {
    setTargetAccountId(accountId);
    setTargetAccountName(accountName);
    setTargetAccountActive(isActive);
    setShowToggleModal(true);
  };

  const handleToggleStatusConfirm = async () => {
    try {
      let response;

      if (targetAccountActive) {
        response = await AccountService.blockAccount(targetAccountId);
      } else {
        response = await AccountService.activeAccount(targetAccountId);
      }

      if (response.success) {
        const action = targetAccountActive ? "khóa" : "kích hoạt";
        toast.success("Thành công", `Đã ${action} tài khoản thành công`);
        await loadAccounts();
      } else {
        toast.error(
          "Lỗi",
          response.message || "Không thể thay đổi trạng thái tài khoản"
        );
      }
    } catch (error) {
      console.error("Error toggling account status:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi thay đổi trạng thái tài khoản");
    } finally {
      setShowToggleModal(false);
      setTargetAccountId("");
      setTargetAccountName("");
      setTargetAccountActive(false);
    }
  };

  // No need for client-side filtering anymore since we use server-side pagination
  // const filteredAccounts = accounts;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý tài khoản
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý tài khoản người dùng trong hệ thống
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Danh sách tài khoản
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý các tài khoản trong hệ thống ({pagination.totalElements}{" "}
              tài khoản)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                showFilters
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}>
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
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-medium rounded-lg">
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
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bộ lọc tìm kiếm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email/Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={accountSearch.email || ""}
                  onChange={(e) =>
                    setAccountSearch((prev) => ({
                      ...prev,
                      email: e.target.value || null,
                    }))
                  }
                  placeholder="Nhập email hoặc tên đăng nhập"
                  className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={accountSearch.fullName || ""}
                  onChange={(e) =>
                    setAccountSearch((prev) => ({
                      ...prev,
                      fullName: e.target.value || null,
                    }))
                  }
                  placeholder="Nhập họ tên"
                  className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quyền
                </label>
                <ComboboxSearch
                  options={roles}
                  value={accountSearch.role || ""}
                  onChange={(value) =>
                    setAccountSearch((prev) => ({
                      ...prev,
                      role: (value as Role) || null,
                    }))
                  }
                  placeholder="Chọn quyền"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <ComboboxSearch
                  options={statusOptions}
                  value={accountSearch.statusOfAccount || ""}
                  onChange={(value) =>
                    setAccountSearch((prev) => ({
                      ...prev,
                      statusOfAccount: (value as StatusOfAccount) || null,
                    }))
                  }
                  placeholder="Chọn trạng thái"
                />
              </div>
              <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
                <button
                  onClick={handleSearch}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Tìm kiếm
                </button>
                <button
                  onClick={resetSearch}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Component */}
        {!loading && accounts?.length > 0 && (
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

        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy tài khoản
            </h3>
            <p className="text-gray-500">
              Không có tài khoản nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {accounts.map((account) => (
              <AccountCard
                key={account.accountId}
                account={account}
                onEdit={handleEditAccount}
                onDelete={(id) =>
                  handleDeleteClick(id, account.username || account.email)
                }
                onToggleStatus={(id) =>
                  handleToggleStatusClick(
                    id,
                    account.username || account.email,
                    account.statusOfAccount.toString() === "ACTIVE"
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Account Form Modal */}
      <AccountForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAccount(null);
        }}
        onSubmit={handleFormSubmit}
        account={editingAccount}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xác nhận xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${targetAccountName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteModal(false);
          setTargetAccountId("");
          setTargetAccountName("");
        }}
        type="danger"
      />

      {/* Toggle Status Confirmation Modal */}
      <ConfirmModal
        isOpen={showToggleModal}
        title={`Xác nhận ${targetAccountActive ? "Khóa" : "Mở khóa"} tài khoản`}
        message={`Bạn có chắc chắn muốn ${
          targetAccountActive ? "Khóa" : "Mở khóa"
        } tài khoản "${targetAccountName}"?`}
        confirmText={targetAccountActive ? "Khóa" : "Mở khóa"}
        cancelText="Hủy"
        onConfirm={handleToggleStatusConfirm}
        onClose={() => {
          setShowToggleModal(false);
          setTargetAccountId("");
          setTargetAccountName("");
          setTargetAccountActive(false);
        }}
        type={targetAccountActive ? "warning" : "success"}
      />

      {/* Simple Toast */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default AccountManagement;
