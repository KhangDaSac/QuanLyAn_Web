import { useState, useEffect } from 'react';
import LegalCaseCard from '../component/legal-case-manager/LegalCaseCard';
import { LegalCaseManagerService } from '../services/LegalCaseManagerService';

interface LegalRelationshipGroup {
  legalRelationshipGroupId: string;
  legalRelationshipGroupName: string;
  description: string;
}

interface TypeOfLegalCase {
  typeOfLegalCaseId: string;
  typeOfLegalCaseName: string;
  codeName: string;
}

interface LegalRelationship {
  legalRelationshipId: string;
  legalRelationshipName: string;
  typeOfLegalCase: TypeOfLegalCase;
  legalRelationshipGroup: LegalRelationshipGroup;
}

interface JudgeResponse {
  judgeId: string;
  judgeName: string;
  email: string;
  phone: string;
}

interface LegalCase {
  legalCaseId: string;
  acceptanceNumber: string;
  acceptanceDate: string;
  expiredDate: string;
  plaintiff: string;
  plaintiffAddress: string;
  defendant: string;
  defendantAddress: string;
  legalRelationship: LegalRelationship;
  storageDate: string;
  assignment: string | null;
  assignmentDate: string | null;
  statusOfLegalCase: string;
  judge: JudgeResponse | null;
}

interface SearchFilters {
  acceptanceNumber: string;
  startAcceptanceDate: string;
  endAcceptanceDate: string;
  plaintiff: string;
  plaintiffAddress: string;
  defendant: string;
  defendantAddress: string;
  typeOfLegalCaseId: string;
  legalRelationshipId: string;
  legalRelationshipGroupId: string;
  statusOfLegalCase: string;
  judgeName: string;
  storageDate: string;
}

const LegalCaseManager = () => {
  const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    acceptanceNumber: '',
    startAcceptanceDate: '',
    endAcceptanceDate: '',
    plaintiff: '',
    plaintiffAddress: '',
    defendant: '',
    defendantAddress: '',
    typeOfLegalCaseId: '',
    legalRelationshipId: '',
    legalRelationshipGroupId: '',
    statusOfLegalCase: '',
    judgeName: '',
    storageDate: ''
  });

  useEffect(() => {
    fetchLegalCases();
  }, []);

  const fetchLegalCases = async () => {
    setLoading(true);
    try {
      setLegalCases((await LegalCaseManagerService.top50()).data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching legal cases:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Lọc dữ liệu mock theo filter
      const filteredData = legalCases.filter(legalCase => {
        return (
          (!searchFilters.acceptanceNumber || legalCase.acceptanceNumber.includes(searchFilters.acceptanceNumber)) &&
          (!searchFilters.plaintiff || legalCase.plaintiff.toLowerCase().includes(searchFilters.plaintiff.toLowerCase())) &&
          (!searchFilters.defendant || legalCase.defendant.toLowerCase().includes(searchFilters.defendant.toLowerCase())) &&
          (!searchFilters.statusOfLegalCase || legalCase.statusOfLegalCase === searchFilters.statusOfLegalCase)
        );
      });

      setTimeout(() => {
        setLegalCases(filteredData);
        setLoading(false);
      }, 500);
      
      // Uncomment khi có API thật
      // const response = await fetch('/api/legal-case/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(searchFilters)
      // });
      // const result: ApiResponse<LegalCase[]> = await response.json();
      // if (result.success) {
      //   setLegalCases(result.data);
      // }
    } catch (error) {
      console.error('Error searching legal cases:', error);
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchFilters({
      acceptanceNumber: '',
      startAcceptanceDate: '',
      endAcceptanceDate: '',
      plaintiff: '',
      plaintiffAddress: '',
      defendant: '',
      defendantAddress: '',
      typeOfLegalCaseId: '',
      legalRelationshipId: '',
      legalRelationshipGroupId: '',
      statusOfLegalCase: '',
      judgeName: '',
      storageDate: ''
    });
    fetchLegalCases();
  };

  const handleEdit = (legalCase: LegalCase) => {
    console.log('Edit legal case:', legalCase);
    // Implement edit functionality
  };

  const handleDelete = (legalCaseId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa án này?')) {
      setLegalCases(prev => prev.filter(lc => lc.legalCaseId !== legalCaseId));
      console.log('Delete legal case:', legalCaseId);
      // Implement delete API call
    }
  };

  const handleAssign = (legalCase: LegalCase) => {
    console.log('Assign legal case:', legalCase);
    // Implement assign functionality
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản Lý Án</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Quản lý và theo dõi các vụ án trong hệ thống</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              showFilters 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span className="hidden sm:inline">Bộ lọc</span>
              <span className="sm:hidden">Lọc</span>
            </span>
          </button>
          <button className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200">
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Thêm án mới</span>
              <span className="sm:hidden">Thêm</span>
            </span>
          </button>
        </div>
      </div>

      {/* Search Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Số thụ lý */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số thụ lý</label>
              <input
                type="text"
                value={searchFilters.acceptanceNumber}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, acceptanceNumber: e.target.value }))}
                placeholder="Nhập số thụ lý"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Ngày thụ lý từ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày thụ lý từ</label>
              <input
                type="date"
                value={searchFilters.startAcceptanceDate}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, startAcceptanceDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Ngày thụ lý đến */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày thụ lý đến</label>
              <input
                type="date"
                value={searchFilters.endAcceptanceDate}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, endAcceptanceDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Nguyên đơn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nguyên đơn</label>
              <input
                type="text"
                value={searchFilters.plaintiff}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, plaintiff: e.target.value }))}
                placeholder="Tên nguyên đơn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Địa chỉ nguyên đơn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ nguyên đơn</label>
              <input
                type="text"
                value={searchFilters.plaintiffAddress}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, plaintiffAddress: e.target.value }))}
                placeholder="Địa chỉ nguyên đơn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Bị đơn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bị đơn</label>
              <input
                type="text"
                value={searchFilters.defendant}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, defendant: e.target.value }))}
                placeholder="Tên bị đơn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Địa chỉ bị đơn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ bị đơn</label>
              <input
                type="text"
                value={searchFilters.defendantAddress}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, defendantAddress: e.target.value }))}
                placeholder="Địa chỉ bị đơn"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={searchFilters.statusOfLegalCase}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, statusOfLegalCase: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="WAITING_FOR_ASSIGNMENT">Chờ phân công</option>
                <option value="ASSIGNED">Đã phân công</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>

            {/* Tên thẩm phán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên thẩm phán</label>
              <input
                type="text"
                value={searchFilters.judgeName}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, judgeName: e.target.value }))}
                placeholder="Tên thẩm phán"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 md:px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Tìm kiếm</span>
              </span>
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 md:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Tổng số án</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{legalCases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Chờ phân công</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {legalCases.filter(lc => lc.statusOfLegalCase === 'WAITING_FOR_ASSIGNMENT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Đã phân công</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {legalCases.filter(lc => lc.judge !== null).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm text-gray-600">Quá hạn</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {legalCases.filter(lc => new Date(lc.expiredDate) < new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Cases List */}
      {loading ? (
        <div className="flex items-center justify-center py-8 md:py-12">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-sm md:text-base text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {legalCases.map((legalCase) => (
            <LegalCaseCard
              key={legalCase.legalCaseId}
              legalCase={legalCase}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAssign={handleAssign}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && legalCases.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Không có án nào</h3>
          <p className="text-sm md:text-base text-gray-600 px-4">Hiện tại chưa có án nào trong hệ thống hoặc không có kết quả tìm kiếm phù hợp.</p>
        </div>
      )}
    </div>
  );
};

export default LegalCaseManager;
