import { useState, useEffect } from 'react';
import type { AccountResponse } from '../../types/response/auth/AccountResponse';
import type { CreateAccountRequest } from '../../types/request/auth/CreateAccountRequest';
import type { UpdateAccountRequest } from '../../types/request/auth/UpdateAccountRequest';
import { Role } from '../../types/enum/Role';

interface AccountFormProps {
  account?: AccountResponse | null;
  onSubmit: (data: CreateAccountRequest | UpdateAccountRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const AccountForm = ({ account, onSubmit, onCancel, isLoading }: AccountFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: Role.JUDGE.toString(),
    displayName: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (account) {
      setFormData({
        username: account.username,
        password: '',
        email: account.email,
        role: account.role.toString(),
        displayName: account.displayName || '',
        isActive: account.isActive
      });
    } else {
      setFormData({
        username: '',
        password: '',
        email: '',
        role: Role.JUDGE.toString(),
        displayName: '',
        isActive: true
      });
    }
  }, [account]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!account && !formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (!account && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.role) {
      newErrors.role = 'Vai trò là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (account) {
        // Update existing account
        const updateData: UpdateAccountRequest = {
          accountId: account.accountId,
          email: formData.email,
          role: formData.role,
          displayName: formData.displayName || undefined,
          isActive: formData.isActive
        };
        await onSubmit(updateData);
      } else {
        // Create new account
        const createData: CreateAccountRequest = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
          displayName: formData.displayName || undefined
        };
        await onSubmit(createData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {account ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập *
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                disabled={!!account} // Disable editing username for existing accounts
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } ${account ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password - only for new accounts */}
            {!account && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Tên hiển thị
              </label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Nhập tên hiển thị (tùy chọn)"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn vai trò</option>
                <option value={Role.JUDGE.toString()}>{Role.JUDGE}</option>
                <option value={Role.MANAGER.toString()}>{Role.MANAGER}</option>
                <option value={Role.ADMIN.toString()}>{Role.ADMIN}</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Active Status - only for editing */}
            {account && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Tài khoản đang hoạt động
                </label>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Đang xử lý...' : (account ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
