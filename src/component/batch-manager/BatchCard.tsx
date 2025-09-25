import type { BatchResponse } from '../../types/response/batch/BatchResponse';
import { useAuth } from '../../context/authContext/useAuth';
import { Permission } from '../../utils/authUtils';

interface BatchCardProps {
  batch: BatchResponse;
  onEdit: (batch: BatchResponse) => void;
  onDelete: (batchId: string) => void;
}

const BatchCard = ({ batch, onEdit, onDelete }: BatchCardProps) => {
  const auth = useAuth();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {batch.batchName}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {batch.batchId}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2" />
                </svg>
                Ngày tạo: {formatDate(batch.storageDate)}
              </div>
            </div>
          </div>

          {/* Actions */}
        {auth?.hasPermission(Permission.MANAGE_CASE_DATA) && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => onEdit(batch)}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium border border-blue-300 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm">Chỉnh sửa</span>
            </button>
            
            <button
              onClick={() => onDelete(batch.batchId)}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium border border-red-300 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm">Xóa</span>
            </button>
          </div>
        )}
        </div>

        {/* Notes Section */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="text-sm text-gray-600 font-medium">Ghi chú</p>
          </div>
          <p className="text-sm text-gray-700">
            {batch.note || 'Không có ghi chú'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;