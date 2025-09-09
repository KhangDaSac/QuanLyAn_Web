import type { AccountResponse } from '../../types/response/auth/AccountResponse';
import { Role } from '../../types/enum/Role';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 h-80 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 min-h-[4rem]">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {account.displayName ? account.displayName.charAt(0).toUpperCase() : account.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-bold text-gray-900 mb-1 line-clamp-1"
              title={account.displayName || account.username}
            >
              {account.displayName || account.username}
            </h3>
            <p className="text-sm text-gray-500 truncate">@{account.username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4 flex-1 overflow-hidden">
        <div className="bg-blue-50 rounded-lg p-3 h-14 flex flex-col justify-center">
          <p className="text-xs text-blue-600 mb-1 font-medium">Email</p>
          <p 
            className="text-sm font-semibold text-blue-900 line-clamp-1"
            title={account.email}
          >
            {account.email}
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 h-14 flex flex-col justify-center">
          <p className="text-xs text-purple-600 mb-1 font-medium">Vai trò</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(account.role)}`}>
            {account.role}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 h-14 flex flex-col justify-center">
          <p className="text-xs text-gray-600 mb-1 font-medium">Ngày tạo</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatDate(account.createdAt)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 h-14 flex flex-col justify-center">
          <p className="text-xs text-green-600 mb-1 font-medium">Trạng thái</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {account.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
        <button
          onClick={() => onEdit(account)}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex-1 justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Sửa</span>
        </button>

        <button
          onClick={() => onToggleStatus(account.accountId)}
          className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 flex-1 justify-center ${
            account.isActive 
              ? 'border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100'
              : 'border-green-300 text-green-600 bg-green-50 hover:bg-green-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={account.isActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
          </svg>
          <span>{account.isActive ? 'Vô hiệu' : 'Kích hoạt'}</span>
        </button>

        <button
          onClick={() => onDelete(account.accountId)}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
