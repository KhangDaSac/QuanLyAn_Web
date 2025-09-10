import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import type { AccountResponse } from "../types/response/auth/AccountResponse";
import type { CreateAccountRequest } from "../types/request/auth/CreateAccountRequest";
import type { UpdateAccountRequest } from "../types/request/auth/UpdateAccountRequest";
import AccountCard from "../component/account-manager/AccountCard";
import AccountForm from "../component/account-manager/AccountForm";
import ConfirmModal from "../component/basic-component/ConfirmModal";
import ComboboxSearch, {
  type Option,
} from "../component/basic-component/ComboboxSearch";
import { Role } from "../types/enum/Role";
import { ToastContainer, useToast } from "../component/basic-component/Toast";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<{ email: string }>({
    email: "",
  });
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

  const roles: Option[] = [
    { value: "", label: "Tất cả vai trò" },
    ...Object.entries(Role).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  ];

  const [rolesFilters, setRolesFilters] = useState({
    roleId: "",
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSearch = async () => {
    // setLoading(true);
    // try {
    //   const { data } = await LegalCaseService.search(legalCaseSearch);
    //   if (data) {
    //     setLegalCases(data);
    //   }
    //   console.log(data);
    // } catch (error) {
    //   console.error('Error searching legal cases:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const response = await AccountService.getAllAccounts();
      if (response.success && response.data) {
        setAccounts(response.data);
      } else {
        toast.error("Lỗi", "Không thể tải danh sách tài khoản");
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast.error("Lỗi", "lỗi khi tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEditAccount = (account: AccountResponse) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleFormSubmit = async (
    data: CreateAccountRequest | UpdateAccountRequest
  ) => {
    try {
      setIsSubmitting(true);
      let response;

      if ("accountId" in data) {
        // Update existing account
        response = await AccountService.updateAccount(data);
      } else {
        // Create new account
        response = await AccountService.createAccount(data);
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
    setSearchCriteria({ email: "" });
    setRolesFilters({ roleId: "" });
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
      const response = await AccountService.toggleAccountStatus(
        targetAccountId
      );
      if (response.success) {
        toast.success("Thành công", "Thay đổi trạng thái tài khoản thành công");
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

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.displayName &&
        account.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      !selectedRole || account.role.toString() === selectedRole;

    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" && account.isActive) ||
      (selectedStatus === "inactive" && !account.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

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
              Quản lý các tài khoản trong hệ thống
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

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bộ lọc tìm kiếm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  value={searchCriteria.email || ""}
                  onChange={(e) =>
                    setSearchCriteria((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Nhập email"
                  className="w-full px-3 py-2 border outline-none border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quyền
                </label>
                <ComboboxSearch
                  options={roles}
                  value={rolesFilters.roleId || ""}
                  onChange={(value) =>
                    setSearchCriteria((prev) => ({ ...prev, role: value }))
                  }
                  placeholder="Chọn quyền"
                />
              </div>
              <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                <button
                  onClick={handleSearch}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Tìm kiếm
                </button>
                <button
                  onClick={resetSearch}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Tổng tài khoản
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts.filter((acc) => acc.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Không hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts.filter((acc) => !acc.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Thẩm phán</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    accounts.filter(
                      (acc) => acc.role.toString() === "Thẩm phán"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        {filteredAccounts.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.accountId}
                account={account}
                onEdit={handleEditAccount}
                onDelete={(id) =>
                  handleDeleteClick(id, account.displayName || account.username)
                }
                onToggleStatus={(id) =>
                  handleToggleStatusClick(
                    id,
                    account.displayName || account.username,
                    account.isActive
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
        isLoading={isSubmitting}
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
        title={`Xác nhận ${
          targetAccountActive ? "vô hiệu hóa" : "kích hoạt"
        } tài khoản`}
        message={`Bạn có chắc chắn muốn ${
          targetAccountActive ? "vô hiệu hóa" : "kích hoạt"
        } tài khoản "${targetAccountName}"?`}
        confirmText={targetAccountActive ? "Vô hiệu hóa" : "Kích hoạt"}
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
