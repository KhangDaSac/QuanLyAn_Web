import React from "react";

type Props = {
  appName?: string;
  lastUpdated?: string;
  contactEmail?: string;
  contactPhone?: string;
};

const DEFAULT_TEXT = `ĐIỀU KHOẢN SỬ DỤNG VÀ CHÍNH SÁCH BẢO MẬT
Ứng dụng quản lý án [Tên ứng dụng]
Cập nhật lần cuối: [Ngày/Tháng/Năm]

I. ĐIỀU KHOẢN SỬ DỤNG

1. Giới thiệu
Chào mừng bạn đến với Ứng dụng quản lý án [Tên ứng dụng] ("Ứng dụng", "Chúng tôi"). Khi sử dụng Ứng dụng này, bạn đồng ý tuân thủ các Điều khoản Sử dụng dưới đây theo quy định pháp luật Việt Nam, bao gồm nhưng không giới hạn ở Bộ luật Dân sự, Luật An ninh mạng, Luật Bảo vệ dữ liệu cá nhân 2023.

2. Đối tượng người dùng
Ứng dụng dành cho các cơ quan, tổ chức và cá nhân được pháp luật cho phép tiếp cận và quản lý hồ sơ vụ án. Người dùng phải từ đủ 18 tuổi hoặc có sự chấp thuận của tổ chức hợp pháp.

3. Tài khoản và bảo mật
- Người dùng phải cung cấp thông tin chính xác, đầy đủ khi đăng ký.
- Người dùng tự chịu trách nhiệm bảo mật thông tin đăng nhập.
- Mọi hành vi phát sinh từ tài khoản được coi là do chính chủ tài khoản thực hiện.

4. Quyền và trách nhiệm người dùng
Người dùng KHÔNG được:
- Xâm nhập trái phép hệ thống, phát tán mã độc, hoặc làm gián đoạn dịch vụ.
- Sử dụng dữ liệu trái quy định pháp luật.
Người dùng CÓ quyền:
- Truy cập, cập nhật, quản lý hồ sơ vụ án theo đúng phân quyền.

5. Quyền và trách nhiệm nhà cung cấp
- Cung cấp dịch vụ theo đúng cam kết.
- Bảo đảm an ninh thông tin theo Luật An ninh mạng, Luật Bảo vệ dữ liệu cá nhân.
- Có quyền tạm ngưng hoặc chấm dứt dịch vụ khi phát hiện vi phạm.

6. Sở hữu trí tuệ
Toàn bộ mã nguồn, thiết kế, cơ sở dữ liệu thuộc sở hữu của [Tên công ty/đơn vị]. Người dùng không được sao chép, phân phối hoặc khai thác khi chưa có sự đồng ý.

7. Giới hạn trách nhiệm
Chúng tôi không chịu trách nhiệm với thiệt hại do người dùng sử dụng sai mục đích hoặc vi phạm pháp luật.

8. Thay đổi Điều khoản
Chúng tôi có quyền thay đổi Điều khoản và sẽ thông báo trước khi áp dụng.

9. Liên hệ
Email: [Email liên hệ]
Hotline: [Số điện thoại]

II. CHÍNH SÁCH BẢO MẬT

1. Phạm vi áp dụng
Chính sách này áp dụng với tất cả người dùng Ứng dụng và tuân thủ Luật Bảo vệ dữ liệu cá nhân, Luật An ninh mạng và các văn bản pháp luật liên quan.

2. Thông tin thu thập
- Thông tin cá nhân: Họ tên, email, số điện thoại, chức vụ, cơ quan công tác.
- Thông tin hồ sơ vụ án: Hồ sơ pháp lý, tài liệu, lịch xử.
- Dữ liệu hệ thống: Địa chỉ IP, nhật ký truy cập, loại thiết bị.

3. Mục đích sử dụng
- Cung cấp dịch vụ và hỗ trợ vận hành hệ thống.
- Đảm bảo bảo mật thông tin, phân quyền truy cập.
- Thực hiện nghĩa vụ theo yêu cầu cơ quan nhà nước có thẩm quyền.

4. Chia sẻ dữ liệu
- Không bán dữ liệu người dùng.
- Chỉ chia sẻ dữ liệu với cơ quan pháp luật hoặc đối tác kỹ thuật được ủy quyền, có ký cam kết bảo mật.

5. Lưu trữ và bảo mật dữ liệu
- Dữ liệu được lưu trữ trong lãnh thổ Việt Nam theo Luật An ninh mạng.
- Áp dụng mã hóa, tường lửa, phân quyền truy cập.
- Người dùng có quyền yêu cầu chỉnh sửa hoặc xóa thông tin.

6. Quyền của người dùng
Người dùng có quyền:
- Yêu cầu cung cấp thông tin cá nhân đang được xử lý.
- Rút lại sự đồng ý xử lý dữ liệu.
- Khiếu nại nếu có vi phạm.

7. Cookie và công nghệ theo dõi
Ứng dụng có thể sử dụng cookie để tối ưu trải nghiệm và phân tích hành vi sử dụng.

8. Thay đổi Chính sách
Chúng tôi sẽ thông báo trước khi áp dụng chính sách mới.

9. Liên hệ
Email: [Email liên hệ]
Hotline: [Số điện thoại]
`;

export default function TermsPrivacyPage({
  appName = "Quản lý án",
  lastUpdated = "20/09/2025",
  contactEmail = "daophuckhang090@gmail.com",
  contactPhone = "0375503100",
}: Props) {
  const textContent = React.useMemo(() => {
    return DEFAULT_TEXT
      .replace(/\[Tên ứng dụng\]/g, appName)
      .replace(/\[Ngày\/Tháng\/Năm\]/g, lastUpdated)
      .replace(/\[Email liên hệ\]/g, contactEmail)
      .replace(/\[Số điện thoại\]/g, contactPhone);
  }, [appName, lastUpdated, contactEmail, contactPhone]);

  function handleDownload() {
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Dieu_Khoan_Chinh_Sach_${appName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;
    newWindow.document.write(`<pre style=\"white-space: pre-wrap; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;\">${escapeHtml(
      textContent
    )}</pre>`);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{appName}</h1>
                <p className="text-lg text-gray-600">Điều khoản sử dụng & Chính sách bảo mật</p>
                <p className="text-sm text-gray-500 mt-1">Cập nhật lần cuối: {lastUpdated}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tải về (TXT)
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                In tài liệu
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Mục lục
              </h2>
              <nav className="space-y-3">
                <a 
                  href="#terms" 
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Điều khoản sử dụng
                </a>
                <a 
                  href="#privacy" 
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính sách bảo mật
                </a>
                <a 
                  href="#contact" 
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Thông tin liên hệ
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Terms Section */}
            <section id="terms" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">I. Điều khoản sử dụng</h2>
              </div>

              <div className="prose max-w-none">
                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Giới thiệu</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Chào mừng bạn đến với <strong className="text-red-600">{appName}</strong> ("Ứng dụng", "Chúng tôi"). Khi
                      sử dụng Ứng dụng này, bạn đồng ý tuân thủ các Điều khoản Sử dụng theo quy định pháp
                      luật Việt Nam, bao gồm nhưng không giới hạn ở Bộ luật Dân sự, Luật An ninh mạng, Luật
                      Bảo vệ dữ liệu cá nhân 2023.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Đối tượng người dùng</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Ứng dụng dành cho các cơ quan, tổ chức và cá nhân được pháp luật cho phép tiếp cận và
                      quản lý hồ sơ vụ án. Người dùng phải từ đủ 18 tuổi hoặc có sự chấp thuận của tổ chức
                      hợp pháp.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Tài khoản và bảo mật</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        Người dùng phải cung cấp thông tin chính xác, đầy đủ khi đăng ký.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        Người dùng tự chịu trách nhiệm bảo mật thông tin đăng nhập.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        Mọi hành vi phát sinh từ tài khoản được coi là do chính chủ tài khoản thực hiện.
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Quyền và trách nhiệm người dùng</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">Người dùng KHÔNG được:</h4>
                        <ul className="space-y-1 text-red-700 text-sm">
                          <li>• Xâm nhập trái phép hệ thống</li>
                          <li>• Phát tán mã độc</li>
                          <li>• Làm gián đoạn dịch vụ</li>
                          <li>• Sử dụng dữ liệu trái quy định</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Người dùng CÓ quyền:</h4>
                        <ul className="space-y-1 text-green-700 text-sm">
                          <li>• Truy cập hệ thống theo phân quyền</li>
                          <li>• Cập nhật thông tin cá nhân</li>
                          <li>• Quản lý hồ sơ vụ án</li>
                          <li>• Báo cáo sự cố bảo mật</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Quyền và trách nhiệm nhà cung cấp</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700">Cung cấp dịch vụ theo cam kết</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700">Bảo đảm an ninh thông tin</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700">Quyền tạm ngưng dịch vụ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Section */}
            <section id="privacy" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">II. Chính sách bảo mật</h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Phạm vi áp dụng</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Chính sách này áp dụng với tất cả người dùng Ứng dụng và tuân thủ Luật Bảo vệ dữ liệu
                    cá nhân, Luật An ninh mạng và các văn bản pháp luật liên quan.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Thông tin thu thập</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Thông tin cá nhân</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Họ tên</li>
                        <li>• Email</li>
                        <li>• Số điện thoại</li>
                        <li>• Chức vụ</li>
                        <li>• Cơ quan công tác</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Thông tin vụ án</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Hồ sơ pháp lý</li>
                        <li>• Tài liệu</li>
                        <li>• Lịch sử xử lý</li>
                        <li>• Quyết định</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Dữ liệu hệ thống</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Địa chỉ IP</li>
                        <li>• Nhật ký truy cập</li>
                        <li>• Loại thiết bị</li>
                        <li>• Trình duyệt</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Cam kết bảo mật</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">✅ Chúng tôi cam kết:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Không bán dữ liệu người dùng</li>
                        <li>• Mã hóa dữ liệu nhạy cảm</li>
                        <li>• Lưu trữ trong lãnh thổ Việt Nam</li>
                        <li>• Tuân thủ luật pháp Việt Nam</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">🔒 Biện pháp bảo mật:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Tường lửa và phân quyền</li>
                        <li>• Mã hóa SSL/TLS</li>
                        <li>• Backup định kỳ</li>
                        <li>• Giám sát 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">III. Thông tin liên hệ</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Mọi thắc mắc về Điều khoản và Chính sách vui lòng liên hệ với chúng tôi qua:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a href={`mailto:${contactEmail}`} className="text-green-600 font-medium hover:underline">
                          {contactEmail}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Hotline</p>
                        <a href={`tel:${contactPhone}`} className="text-blue-600 font-medium hover:underline">
                          {contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">⚠️ Lưu ý quan trọng</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Tài liệu này có hiệu lực từ ngày {lastUpdated}</li>
                    <li>• Mọi thay đổi sẽ được thông báo trước</li>
                    <li>• Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các điều khoản</li>
                    <li>• Tài liệu tuân thủ pháp luật Việt Nam</li>
                  </ul>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <footer className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} <span className="font-medium text-red-600">{appName}</span>. 
              Bản quyền nội dung thuộc về nhà cung cấp.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Tài liệu này được tạo tự động và tuân thủ các quy định pháp luật Việt Nam
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
