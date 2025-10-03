import { useState, useEffect } from "react";
import { AuthService } from "../services/AuthService";
import type { AccountResponse } from "../types/response/auth/AccountResponse";
import type ChangePasswordRequest from "../types/request/auth/ChangePasswordRequest";
import { useToast, ToastContainer } from "../component/basic-component/Toast";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Toast hook
  const { toasts, removeToast, success, error: showError } = useToast();

  // Edit profile form states
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
  });

  // Change password form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Form validation states
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string;
  }>({});

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await AuthService.getMyInfo();
      if (response.status === 200 && response.data) {
        setUserInfo(response.data);
        setEditForm({
          username: response.data.username,
          email: response.data.email,
        });
      } else {
        showError("Thông báo", "Không thể tải thông tin người dùng");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      showError("Có lỗi xảy ra", "Có lỗi xảy ra khi tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Validate edit form
  const validateEditForm = () => {
    const errors: { [key: string]: string } = {};

    if (!editForm.username.trim()) {
      errors.username = "Tên đăng nhập không được để trống";
    }

    if (!editForm.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = "Email không hợp lệ";
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors: { [key: string]: string } = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (!passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = "Xác nhận mật khẩu không khớp";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit profile
  const handleEditProfile = async () => {
    if (!validateEditForm()) return;
    if (!userInfo) return;

    try {
      setLoading(true);
      
      // Create update request with only changed fields
      const updateRequest = {
        username: editForm.username !== userInfo.username ? editForm.username : null,
        email: editForm.email !== userInfo.email ? editForm.email : null,
        password: null, // Password is always null for profile updates
        role: null, // Role cannot be changed in profile
        statusOfAccount: null, // Status cannot be changed in profile
      };

      const response = await AuthService.updateAccount(
        userInfo.accountId,
        updateRequest
      );

      if (response.status === 200) {
        success("Thành công", "Cập nhật thông tin thành công");
        setIsEditing(false);
        fetchUserInfo(); // Reload user info
      } else {
        showError(
          "Có lỗi xảy ra",
          response.message || "Có lỗi xảy ra khi cập nhật thông tin"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Có lỗi xảy ra", "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    try {
      setLoading(true);
      const changePasswordRequest: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      };

      const response = await AuthService.changePassword(changePasswordRequest);

      if (response.status === 200) {
        success("Thành công", "Đổi mật khẩu thành công");
        setIsChangingPassword(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        showError(
          "Có lỗi xảy ra",
          response.message || "Có lỗi xảy ra khi đổi mật khẩu"
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showError("Có lỗi xảy ra", "Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    if (userInfo) {
      setEditForm({
        username: userInfo.username,
        email: userInfo.email,
      });
    }
    setIsEditing(false);
    setEditErrors({});
  };

  // Handle cancel changing password
  const handleCancelChangePassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsChangingPassword(false);
    setPasswordErrors({});
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "MANAGER":
        return "Quản lý";
      case "JUDGE":
        return "Thẩm phán";
      default:
        return role;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "BANNED":
        return "Bị cấm";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-600 border border-green-300";
      case "INACTIVE":
        return "bg-yellow-50 text-yellow-600 border border-yellow-300";
      case "BANNED":
        return "bg-red-50 text-red-600 border border-red-300";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-300";
    }
  };

  if (loading && !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="text-lg text-gray-600">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-8">
        <div className="mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thông tin cá nhân
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin tài khoản và mật khẩu của bạn
            </p>
          </div>

          <div className="space-y-6">
            {/* Thông tin tài khoản */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Thông tin tài khoản
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <svg
                      className="w-4 h-4"
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
                    <span className="text-sm">Chỉnh sửa</span>
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên đăng nhập
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{userInfo?.username}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{userInfo?.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vai trò
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">
                        {getRoleText(userInfo?.role || "")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(
                          userInfo?.statusOfAccount || ""
                        )}`}>
                        {getStatusText(userInfo?.statusOfAccount || "")}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên đăng nhập <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          editErrors.username
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập tên đăng nhập"
                      />
                      {editErrors.username && (
                        <p className="mt-1 text-sm text-red-600">
                          {editErrors.username}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          editErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập email"
                      />
                      {editErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {editErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleEditProfile}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Đổi mật khẩu */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Bảo mật tài khoản
                </h2>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="inline-flex items-center px-4 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                    Đổi mật khẩu
                  </button>
                )}
              </div>

              {!isChangingPassword ? (
                <div className="text-gray-600">
                  <p>Nhấp vào "Đổi mật khẩu" để cập nhật mật khẩu của bạn</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        passwordErrors.currentPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          passwordErrors.newPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Nhập mật khẩu mới"
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmNewPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmNewPassword: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          passwordErrors.confirmNewPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Xác nhận mật khẩu mới"
                      />
                      {passwordErrors.confirmNewPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.confirmNewPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
                      {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                    </button>
                    <button
                      onClick={handleCancelChangePassword}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ProfilePage;
