import type { AccountResponse } from '../../types/response/auth/AccountResponse';
import { Role } from '../../types/enum/Role';
import { StatusOfAccount } from '../../types/enum/StatusOfAccount';
import { StatusOfOfficer } from '../../types/enum/StatusOfOfficer';

interface AccountCardProps {
  account: AccountResponse;
  onEdit: (account: AccountResponse) => void;
  onDelete: (accountId: string) => void;
  onToggleStatus: (accountId: string) => void;
}

const AccountCard = ({ account, onEdit, onDelete, onToggleStatus }: AccountCardProps) => {
  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'bg-red-100 text-red-800';
      case Role.MANAGER:
        return 'bg-blue-100 text-blue-800';
      case Role.JUDGE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 min-h-[28rem] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {account.username ? account.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-bold text-gray-900 mb-1"
              title={account.username}
            >
              {account.username}
            </h3>
            <p className="text-sm text-gray-500">@{account.username}</p>
          </div>
        </div>
      </div>

      {/* Content - Account Information */}
      <div className="space-y-3 mb-4 flex-1">
        {/* Email */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-blue-600 font-medium">Email tài khoản</p>
          </div>
          <p 
            className="text-sm font-semibold text-blue-900 break-all"
            title={account.email}
          >
            {account.email}
          </p>
        </div>
        
        {/* Role */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs text-purple-600 font-medium">Vai trò</p>
          </div>
          <span className={`inline-flex items-center py-1 rounded-full text-sm font-medium ${getRoleColor(account.role)}`}>
            {account.role}
          </span>
        </div>

        {/* Officer Information */}
        {account.officerResponse && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-xs text-green-600 font-medium">Thông tin cán bộ</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-green-900">
                {account.officerResponse.fullName}
              </p>
              <p className="text-xs text-green-700">
                ID: {account.officerResponse.officerId}
              </p>
              {account.officerResponse.email && account.officerResponse.email !== account.email && (
                <p className="text-xs text-green-700 break-all">
                  Email CB: {account.officerResponse.email}
                </p>
              )}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                account.officerResponse.statusOfOfficer === StatusOfOfficer.WORKING ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {account.officerResponse.statusOfOfficer}
              </span>
            </div>
          </div>
        )}

        {/* Status of account */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="text-xs text-gray-600 font-medium">Trạng thái</p>
          </div>
          <p className="text-xs font-medium text-gray-700 break-all">
            {account.statusOfAccount === StatusOfAccount.ACTIVE ? 'Đang hoạt động' : 'Bị khóa'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-100 mt-auto">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => onEdit(account)}
            className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Chỉnh sửa</span>
          </button>

          <button
            onClick={() => onToggleStatus(account.accountId)}
            className={`flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 ${
              account.statusOfAccount === StatusOfAccount.ACTIVE
                ? 'border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100'
                : 'border-green-300 text-green-600 bg-green-50 hover:bg-green-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={account.statusOfAccount === StatusOfAccount.ACTIVE ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
            </svg>
            <span>{account.statusOfAccount === StatusOfAccount.ACTIVE ? 'Vô hiệu hóa' : 'Kích hoạt'}</span>
          </button>
        </div>

        <button
          onClick={() => onDelete(account.accountId)}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Xóa tài khoản</span>
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
