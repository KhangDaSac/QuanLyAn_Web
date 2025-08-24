import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackToHome?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = 'Chào mừng trở lại',
  subtitle = 'Đăng nhập vào tài khoản của bạn',
  showBackToHome = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Back to Home Button */}
          {showBackToHome && (
            <div className="mb-8">
              <a
                href="/"
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Về trang chủ</span>
              </a>
            </div>
          )}

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center space-x-6 text-sm">
              <a href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                Điều khoản sử dụng
              </a>
              <a href="/help" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                Trợ giúp
              </a>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 Quản Lý Ăn. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration/Image */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-16 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="max-w-lg">
            <h3 className="text-3xl font-bold mb-6">
              Hệ thống quản lý nhà hàng hiện đại
            </h3>
            <p className="text-lg mb-8 text-white/90 leading-relaxed">
              Quản lý thực đơn, đơn hàng, khách hàng một cách hiệu quả với giao diện thân thiện và tính năng đầy đủ.
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Quản lý thực đơn thông minh</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Theo dõi đơn hàng real-time</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Báo cáo chi tiết và phân tích</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">Giao diện responsive, dễ sử dụng</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">NV</span>
              </div>
              <div>
                <p className="font-medium">Nguyễn Văn A</p>
                <p className="text-xs text-white/70">Chủ nhà hàng ABC</p>
              </div>
            </div>
            <p className="text-sm text-white/90 italic">
              "Hệ thống này đã giúp nhà hàng của tôi tăng hiệu quả vận hành lên 40% và cải thiện trải nghiệm khách hàng đáng kể."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
