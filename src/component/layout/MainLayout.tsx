import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      {/* Header/Navbar */}
      {showNavbar && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-primary-100 shadow-sm">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-xl font-bold text-primary-800 hidden sm:block">
                  Quản Lý Ăn
                </span>
              </div>

              {/* Navigation Links - Desktop */}
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="/"
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Trang Chủ
                </a>
                <a
                  href="/menu"
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Thực Đơn
                </a>
                <a
                  href="/orders"
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Đơn Hàng
                </a>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Giới Thiệu
                </a>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                <button className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
                  Đăng Nhập
                </button>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-sm hover:shadow-md">
                  Đăng Ký
                </button>
                
                {/* Mobile menu button */}
                <button className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-primary-100 py-4 space-y-3">
              <a
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium"
              >
                Trang Chủ
              </a>
              <a
                href="/menu"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium"
              >
                Thực Đơn
              </a>
              <a
                href="/orders"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium"
              >
                Đơn Hàng
              </a>
              <a
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium"
              >
                Giới Thiệu
              </a>
              <button className="w-full text-left px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium sm:hidden">
                Đăng Nhập
              </button>
            </div>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-gradient-to-r from-primary-800 to-primary-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Q</span>
                  </div>
                  <span className="text-xl font-bold">Quản Lý Ăn</span>
                </div>
                <p className="text-primary-200 text-sm leading-relaxed">
                  Hệ thống quản lý nhà hàng hiện đại, giúp bạn quản lý thực đơn, đơn hàng một cách hiệu quả và professional.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Liên Kết Nhanh</h3>
                <div className="space-y-2">
                  <a href="/" className="block text-primary-200 hover:text-white transition-colors duration-200 text-sm">
                    Trang Chủ
                  </a>
                  <a href="/menu" className="block text-primary-200 hover:text-white transition-colors duration-200 text-sm">
                    Thực Đơn
                  </a>
                  <a href="/orders" className="block text-primary-200 hover:text-white transition-colors duration-200 text-sm">
                    Đơn Hàng
                  </a>
                  <a href="/about" className="block text-primary-200 hover:text-white transition-colors duration-200 text-sm">
                    Giới Thiệu
                  </a>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Liên Hệ</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-primary-200 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+84 123 456 789</span>
                  </p>
                  <p className="text-primary-200 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@quanlyan.vn</span>
                  </p>
                  <p className="text-primary-200 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>123 Nguyễn Văn A, Q1, TP.HCM</span>
                  </p>
                </div>
              </div>

              {/* Social */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theo Dõi Chúng Tôi</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-primary-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-primary-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-primary-200 text-sm">
                © 2025 Quản Lý Ăn. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="/privacy" className="text-primary-200 hover:text-white text-sm transition-colors duration-200">
                  Chính Sách Bảo Mật
                </a>
                <a href="/terms" className="text-primary-200 hover:text-white text-sm transition-colors duration-200">
                  Điều Khoản Sử Dụng
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
