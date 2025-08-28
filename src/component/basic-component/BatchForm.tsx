import { useState } from 'react';
import type { BatchRequest } from '../../types/request/batch/BatchRequest';

interface BatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchData: BatchRequest, file: File) => void;
  file: File | null;
  loading?: boolean;
}

const BatchForm = ({ isOpen, onClose, onSubmit, file, loading = false }: BatchFormProps) => {
  const [batchData, setBatchData] = useState<BatchRequest>({
    batchName: '',
    note: ''
  });

  const [errors, setErrors] = useState<{
    batchName?: string;
    note?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!batchData.batchName.trim()) {
      newErrors.batchName = 'Tên batch là bắt buộc';
    } else if (batchData.batchName.trim().length < 3) {
      newErrors.batchName = 'Tên batch phải có ít nhất 3 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      return;
    }

    if (validateForm()) {
      onSubmit(batchData, file);
    }
  };

  const handleClose = () => {
    setBatchData({ batchName: '', note: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thông tin đợt nhập án</h2>
              <p className="text-md text-gray-600 mt-1">
                File: <span className="font-medium">{file?.name}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Batch Name */}
            <div>
              <label htmlFor="batchName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đợt nhập án <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="batchName"
                value={batchData.batchName}
                onChange={(e) => setBatchData(prev => ({ ...prev, batchName: e.target.value }))}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:opacity-50 ${
                  errors.batchName 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Tên đợt nhập"
              />
              {errors.batchName && (
                <p className="text-red-500 text-xs mt-1">{errors.batchName}</p>
              )}
            </div>

            {/* Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                id="note"
                value={batchData.note}
                onChange={(e) => setBatchData(prev => ({ ...prev, note: e.target.value }))}
                disabled={loading}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:opacity-50 resize-none ${
                  errors.note 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Ghi chú"
              />
              {errors.note && (
                <p className="text-red-500 text-xs mt-1">{errors.note}</p>
              )}
            </div>

            {/* File Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-md font-medium text-gray-700 mb-2">Thông tin file:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Tên file:</strong> {file?.name}</p>
                <p><strong>Kích thước:</strong> {file ? Math.round(file.size / 1024) : 0} KB</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || !file}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang import...
                  </>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BatchForm;
