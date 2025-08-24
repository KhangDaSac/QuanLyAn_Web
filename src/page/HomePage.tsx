import { useAuth } from '../context/authContext/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Chào mừng đến với <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Quản Lý Ăn
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-slide-up">
            Hệ thống quản lý nhà hàng hiện đại, giúp bạn quản lý thực đơn, đơn hàng và khách hàng một cách hiệu quả nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl">
              Khám Phá Ngay
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-200">
              Xem Demo
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những tính năng mạnh mẽ giúp bạn quản lý nhà hàng một cách chuyên nghiệp và hiệu quả
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quản Lý Thực Đơn</h3>
            <p className="text-gray-600 leading-relaxed">
              Tạo và quản lý thực đơn một cách dễ dàng với giao diện trực quan, hỗ trợ hình ảnh và mô tả chi tiết
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Theo Dõi Đơn Hàng</h3>
            <p className="text-gray-600 leading-relaxed">
              Theo dõi đơn hàng real-time từ lúc nhận đến khi hoàn thành, tối ưu hóa quy trình phục vụ
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Báo Cáo Chi Tiết</h3>
            <p className="text-gray-600 leading-relaxed">
              Phân tích doanh thu, theo dõi xu hướng và tạo báo cáo chi tiết để đưa ra quyết định kinh doanh tốt hơn
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quản Lý Khách Hàng</h3>
            <p className="text-gray-600 leading-relaxed">
              Lưu trữ thông tin khách hàng, theo dõi lịch sử đơn hàng và xây dựng chương trình khuyến mãi phù hợp
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsive Design</h3>
            <p className="text-gray-600 leading-relaxed">
              Giao diện thân thiện trên mọi thiết bị: máy tính, tablet, điện thoại, đảm bảo trải nghiệm tối ưu
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Bảo Mật Cao</h3>
            <p className="text-gray-600 leading-relaxed">
              Hệ thống bảo mật đa lớp với JWT authentication, mã hóa dữ liệu và kiểm soát truy cập nghiêm ngặt
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Được Tin Tưởng Bởi Nhiều Nhà Hàng
          </h2>
          <p className="text-lg text-gray-600">
            Hệ thống đã được sử dụng bởi hàng trăm nhà hàng trên toàn quốc
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary-600">500+</div>
            <div className="text-gray-600 font-medium">Nhà Hàng</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-secondary-600">10K+</div>
            <div className="text-gray-600 font-medium">Đơn Hàng/Ngày</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-accent-600">99%</div>
            <div className="text-gray-600 font-medium">Uptime</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-orange-500">24/7</div>
            <div className="text-gray-600 font-medium">Hỗ Trợ</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Sẵn Sàng Bắt Đầu?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Hãy bắt đầu hành trình số hóa nhà hàng của bạn ngay hôm nay. Dùng thử miễn phí 30 ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Dùng Thử Miễn Phí
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-primary-500 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200">
              Liên Hệ Tư Vấn
            </button>
          </div>
        </div>
      </section>

      {/* User Info Section - Only show if user is logged in */}
      {user && (
        <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{user.username?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Chào mừng trở lại, {user.username}!</h3>
              <p className="text-gray-600">Bạn đã đăng nhập thành công vào hệ thống</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-semibold text-gray-900">Thông tin tài khoản</span>
              </div>
              <p className="text-gray-600">Email: {user.email}</p>
            </div>
            
            <div className="bg-secondary-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-semibold text-gray-900">Phiên đăng nhập</span>
              </div>
              <p className="text-gray-600">Bảo mật với JWT Authentication</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
