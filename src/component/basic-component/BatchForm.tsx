import { useState, useEffect } from 'react';
import type { BatchResponse } from '../../types/response/batch/BatchResponse';
import ComboboxSearchForm from './ComboboxSearchForm';
import type { Option } from './ComboboxSearch';
import { BatchService } from '../../services/BatchService';

interface BatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchId: string, file: File) => void;
  file: File | null;
  loading?: boolean;
}

const BatchForm = ({ isOpen, onClose, onSubmit, file, loading = false }: BatchFormProps) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [batchOptions, setBatchOptions] = useState<Option[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const [errors, setErrors] = useState<{
    batchId?: string;
  }>({});

  // Fetch batch options when form opens
  useEffect(() => {
    if (isOpen) {
      fetchBatches();
    }
  }, [isOpen]);

  const fetchBatches = async () => {
    setLoadingBatches(true);
    try {
      const response = await BatchService.getAll()
      if (response.success && response.data) {
        const options: Option[] = response.data.map((batch: BatchResponse) => ({
          value: batch.batchId,
          label: `${batch.batchName} - ${batch.batchId}`
        }));
        setBatchOptions(options);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoadingBatches(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!selectedBatchId.trim()) {
      newErrors.batchId = 'Vui lòng chọn đợt nhập án';
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
      onSubmit(selectedBatchId, file);
    }
  };

  const handleClose = () => {
    setSelectedBatchId('');
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
            {/* Batch Selection */}
            <div>
              <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-1">
                Chọn đợt nhập án <span className="text-red-500">*</span>
              </label>
              {loadingBatches ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm text-gray-500">Đang tải danh sách đợt nhập...</span>
                </div>
              ) : (
                <ComboboxSearchForm
                  options={batchOptions}
                  value={selectedBatchId}
                  onChange={setSelectedBatchId}
                  placeholder="-- Chọn đợt nhập án --"
                  className={`w-full ${
                    errors.batchId 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              )}
              {errors.batchId && (
                <p className="text-red-500 text-xs mt-1">{errors.batchId}</p>
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
                disabled={loading || !file || !selectedBatchId.trim()}
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
