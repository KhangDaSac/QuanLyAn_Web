import type { AccountResponse } from "../../types/response/auth/AccountResponse";
import { Role } from "../../types/enum/Role";
import { StatusOfAccount } from "../../types/enum/StatusOfAccount";
import { StatusOfOfficer } from "../../types/enum/StatusOfOfficer";

interface AccountCardProps {
  account: AccountResponse;
  onEdit: (account: AccountResponse) => void;
  onDelete: (accountId: string) => void;
  onToggleStatus: (accountId: string) => void;
}

const AccountCard = ({
  account,
  onEdit,
  onDelete,
  onToggleStatus,
}: AccountCardProps) => {
  // Debug log để kiểm tra giá trị statusOfAccount từ API
  console.log(account);

  // Helper function để kiểm tra trạng thái active
  const isActiveStatus = (status: any) => {
    // Kiểm tra tất cả các dạng có thể có từ API
    return (
      status === StatusOfAccount.ACTIVE ||
      status === "ACTIVE" ||
      status === "active" ||
      status === "Đang hoạt động" ||
      status === true ||
      status === 1
    );
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-100 text-red-800";
      case Role.MANAGER:
        return "bg-blue-100 text-blue-800";
      case Role.JUDGE:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('vi-VN', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 mb-3">
      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        {/* Left Section - Avatar + Account Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {account.username ? account.username.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Account Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3
                className="text-lg font-bold text-gray-900 truncate"
                title={account.username}>
                {account.username}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                  account.role
                )}`}>
                {account.role}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isActiveStatus(account.statusOfAccount)
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                {isActiveStatus(account.statusOfAccount)
                  ? "Hoạt động"
                  : "Bị khóa"}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate" title={account.email}>
              {account.email}
            </p>
          </div>
        </div>

        {/* Middle Section - Officer Info */}
        {account.officer && (
          <div className="flex items-center space-x-4 flex-1 min-w-0 px-4">
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
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
                <p
                  className="text-sm font-semibold text-green-900 truncate"
                  title={account.officer.fullName}>
                  {account.officer.fullName}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    account.officer.statusOfOfficer === StatusOfOfficer.WORKING
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}>
                  {account.officer.statusOfOfficer}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>ID: {account.officer.officerId}</span>
                {account.officer.email &&
                  account.officer.email !== account.email && (
                    <span className="truncate" title={account.officer.email}>
                      Email: {account.officer.email}
                    </span>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          <button
            onClick={() => onEdit(account)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200">
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
            <span>Sửa</span>
          </button>

          <button
            onClick={() => onToggleStatus(account.accountId)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 border ${
              isActiveStatus(account.statusOfAccount)
                ? "text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200"
                : "text-green-600 bg-green-50 hover:bg-green-100 border-green-200"
            }`}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isActiveStatus(account.statusOfAccount)
                    ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                    : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              />
            </svg>
            <span>
              {isActiveStatus(account.statusOfAccount) ? "Khóa" : "Mở khóa"}
            </span>
          </button>

          <button
            onClick={() => onDelete(account.accountId)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200">
            <svg
              className="w-4 h-4"
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
            <span>Xóa</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        {/* Top Row - Account Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {account.username
                ? account.username.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-base font-bold text-gray-900 truncate"
                  title={account.username}>
                  {account.username}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                    account.role
                  )}`}>
                  {account.role}
                </span>
              </div>
              <p
                className="text-sm text-gray-600 truncate"
                title={account.email}>
                {account.email}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
              isActiveStatus(account.statusOfAccount)
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
            {isActiveStatus(account.statusOfAccount) ? "Hoạt động" : "Bị khóa"}
          </span>
        </div>

        {/* Middle Row - Officer Info (if exists) */}
        {account.officer && (
          <div className="mb-3 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
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
                <p
                  className="text-sm font-semibold text-green-900 truncate"
                  title={account.officer.fullName}>
                  {account.officer.fullName}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  account.officer.statusOfOfficer === StatusOfOfficer.WORKING
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                {account.officer.statusOfOfficer}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-600">
              ID: {account.officer.officerId}
            </div>
          </div>
        )}

        {/* Bottom Row - Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onEdit(account)}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200">
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
            <span>Sửa</span>
          </button>

          <button
            onClick={() => onToggleStatus(account.accountId)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 border ${
              isActiveStatus(account.statusOfAccount)
                ? "text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200"
                : "text-green-600 bg-green-50 hover:bg-green-100 border-green-200"
            }`}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isActiveStatus(account.statusOfAccount)
                    ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                    : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              />
            </svg>
            <span>
              {isActiveStatus(account.statusOfAccount) ? "Khóa" : "Mở khóa"}
            </span>
          </button>

          <button
            onClick={() => onDelete(account.accountId)}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200">
            <svg
              className="w-4 h-4"
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
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
