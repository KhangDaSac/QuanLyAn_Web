import { useState, useEffect } from "react";
import type { AccountResponse } from "../../types/response/auth/AccountResponse";
import type { CreateAccountRequest } from "../../types/request/auth/CreateAccountRequest";
import type { UpdateAccountRequest } from "../../types/request/auth/UpdateAccountRequest";
import { Role } from "../../types/enum/Role";
import ComboboxSearchForm, {
  type Option,
} from "../basic-component/ComboboxSearchForm";

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountRequest | UpdateAccountRequest) => void;
  account?: AccountResponse | null;
  isLoading?: boolean;
}

const AccountForm = ({
  isOpen,
  onClose,
  onSubmit,
  account,
  isLoading = false,
}: AccountFormProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: Role.JUDGE.toString(),
  });

  const roles: Option[] = [
    { value: "", label: "Tất cả vai trò" },
    ...Object.entries(Role).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ngăn cuộn trang khi modal mở
  useEffect(() => {
    if (isOpen) {
      // Lưu trạng thái scroll hiện tại
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Khôi phục trạng thái scroll
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (account) {
      setFormData({
        username: account.username,
        password: "",
        email: account.email,
        role: account.role.toString(),
      });
    } else {
      setFormData({
        username: "",
        password: "",
        email: "",
        role: Role.JUDGE.toString(),
      });
    }
    setErrors({});
  }, [account]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!account && !formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (!account && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.role) {
      newErrors.role = "Vai trò là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (account) {
      // Update existing account
      const updateData: UpdateAccountRequest = {
        accountId: account.accountId,
        email: formData.email,
        role: formData.role,
      };
      onSubmit(updateData);
    } else {
      // Create new account
      const createData: CreateAccountRequest = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: formData.role,
      };
      onSubmit(createData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
      style={{
        margin: 0,
        padding: "1rem",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
      }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] relative z-[10000] mx-auto overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {account ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={!!account}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } ${account ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password - chỉ hiện khi thêm mới */}
            {!account && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <ComboboxSearchForm
                options={roles}
                value={formData.role}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
                placeholder="Chọn quyền"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Đang xử lý...
                  </span>
                ) : account ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
