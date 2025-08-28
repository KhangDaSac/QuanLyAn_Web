

interface ExcelFormatGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExcelFormatGuide = ({ isOpen, onClose }: ExcelFormatGuideProps) => {
  if (!isOpen) return null;

  const downloadTemplate = () => {
    // Tạo template Excel đơn giản
    const csvContent = `STT,Số thụ lý,Ngày thụ lý,Nguyên đơn,Địa chỉ nguyên đơn,Bị đơn,Địa chỉ bị đơn,Mã quan hệ pháp luật
1,28A,2025-08-22,Nguyễn Văn A,Hà Nội,Nguyễn Văn B,TP.HCM,HC004
2,29B,2025-08-23,Trần Thị C,Đà Nẵng,,,,DS001`;

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_an.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJsonTemplate = () => {
    // Tạo template JSON
    const jsonTemplate = {
      legalCases: [
        {
          acceptanceNumber: "28654",
          acceptanceDate: "2025-08-22",
          plaintiff: "Nguyễn Văn C",
          plaintiffAddress: "Hà Nội",
          defendant: "Nguyễn Văn D",
          defendantAddress: "TP.HCM",
          legalRelationshipId: "HC004"
        },
        {
          acceptanceNumber: "28655",
          acceptanceDate: "2025-08-23",
          plaintiff: "Trần Thị E",
          plaintiffAddress: "Đà Nẵng",
          defendant: "",
          defendantAddress: "",
          legalRelationshipId: "DS001"
        }
      ],
      batch: {
        batchName: "Đợt nhập 2025",
        note: "Anh Chinh nhập"
      }
    };

    const jsonContent = JSON.stringify(jsonTemplate, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_an.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Hướng dẫn định dạng File Import</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Định dạng JSON */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Định dạng JSON (Khuyến nghị)</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">File JSON phải có cấu trúc như sau:</p>
                <div className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{`{
  "legalCases": [
    {
      "acceptanceNumber": "28654",
      "acceptanceDate": "2025-08-22",
      "plaintiff": "Nguyễn Văn C",
      "plaintiffAddress": "Hà Nội",
      "defendant": "Nguyễn Văn D",
      "defendantAddress": "TP.HCM",
      "legalRelationshipId": "HC004"
    },
    {
      "acceptanceNumber": "28655",
      "acceptanceDate": "2025-08-23",
      "plaintiff": "Trần Thị E",
      "plaintiffAddress": "Đà Nẵng",
      "defendant": "",
      "defendantAddress": "",
      "legalRelationshipId": "DS001"
    }
  ],
  "batch": {
    "batchName": "Đợt nhập 2025",
    "note": "Anh Chinh nhập"
  }
}`}</pre>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p><strong>Lưu ý:</strong></p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Trường <code>defendant</code> và <code>defendantAddress</code> có thể để trống</li>
                    <li>Ngày phải có định dạng YYYY-MM-DD</li>
                    <li>Thông tin <code>batch</code> sẽ được nhập qua form khi import file Excel</li>
                    <li>File lưu với extension .json</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Cấu trúc file Excel */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Định dạng Excel (Tương thích)</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">File Excel cần có các cột theo thứ tự sau:</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Cột</th>
                        <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Tên cột</th>
                        <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Kiểu dữ liệu</th>
                        <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Bắt buộc</th>
                        <th className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700">Ví dụ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">A</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">STT</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Số</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Không</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">1, 2, 3...</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">B</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Số thụ lý</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Văn bản</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm text-red-600">Có</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">28A, 29B</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">C</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Ngày thụ lý</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Ngày (YYYY-MM-DD)</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm text-red-600">Có</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">2025-08-22</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">D</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Nguyên đơn</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Văn bản</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm text-red-600">Có</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Nguyễn Văn A</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">E</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Địa chỉ nguyên đơn</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Văn bản</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm text-red-600">Có</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Hà Nội</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">F</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Bị đơn</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Văn bản</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Không</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Nguyễn Văn B</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">G</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Địa chỉ bị đơn</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Văn bản</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Không</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">TP.HCM</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2 text-sm">H</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Mã quan hệ pháp luật</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Văn bản</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm text-red-600">Có</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">HC004, DS001</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Lưu ý quan trọng</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Dòng đầu tiên (dòng 1) là tiêu đề cột, dữ liệu bắt đầu từ dòng 2</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Ngày phải có định dạng YYYY-MM-DD (ví dụ: 2025-08-22)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Mã quan hệ pháp luật phải tồn tại trong hệ thống</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Các cột bắt buộc không được để trống</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>File Excel sẽ yêu cầu nhập thông tin Batch (tên batch và ghi chú) trước khi import</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>File chấp nhận định dạng .xlsx, .xls (Excel) hoặc .json (JSON)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>Khuyến nghị sử dụng định dạng JSON để dễ dàng kiểm soát dữ liệu</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Download template */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Tải file mẫu</h3>
              <p className="text-sm text-gray-600 mb-3">
                Bạn có thể tải file mẫu để tham khảo định dạng chính xác:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={downloadJsonTemplate}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tải file mẫu JSON (Khuyến nghị)
                </button>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tải file mẫu CSV
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelFormatGuide;
