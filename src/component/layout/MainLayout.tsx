import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext/useAuth";

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  className?: string;
}

const MainLayout = ({
  children,
  showNavbar = true,
  className = "",
}: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    logout();
  };

  const menuItems = [
    {
      name: "Trang chủ",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      href: "/",
    },
    {
      name: "PC án ngẫu nhiên",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      href: "/random-assignment",
    },
    {
      name: "Quản lý án",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      href: "/legal-case",
    },
    {
      name: "Quản lý thông tin án",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      href: "/legal-case-data",
    },
    {
      name: "Quản lý loại quyết định",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      href: "/decision-type",
    },
    {
      name: "Quản lý nhân viên",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      href: "/officer-management",
    },
    {
      name: "Quản lý tài khoản",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      href: "/account-management",
    },
    {
      name: "Báo cáo, thống kê",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      href: "/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-red-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="m-4 mb-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="bg-gradient-to-r from-red-200 to-red-100 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  LW
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Thẩm phán</p>
                <p className="text-xs text-gray-800">Nguyễn Văn A</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-2 ">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 box-border
          ${
            isActive
              ? "border-red-600 bg-red-50 text-red-600"
              : "border-transparent text-gray-700 hover:bg-blue-100"
          }`}>
                <span
                  className={`w-5 h-5 ${
                    isActive ? "text-red-600" : "text-gray-700"
                  }`}>
                  {React.cloneElement(item.icon, {
                    className: `w-5 h-5 ${
                      isActive ? "text-red-600" : "text-gray-700"
                    }`,
                  })}
                </span>
                <span
                  className={`font-medium ${
                    isActive ? "text-red-600" : "text-gray-700"
                  }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="border-0 mt-3 w-full flex items-center justify-center space-x-2 px-3 py-3 text-sm text-white bg-red-600 rounded-lg hover:bg-red-600 transition-colors duration-200"
            onClick={handleLogout}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Header */}
        {showNavbar && (
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-red-700">Quản lý án</h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <svg
                    className="w-8 h-8"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    viewBox="-5.0 -10.0 110.0 135.0">
                    <path
                      d="m50 84.176h-9.168c2.9141 8.8125 15.422 8.8125 18.336 0zm-8.9023-70.832c1.2461-11.941 11.887-12.461 15.84-6.2344 1.0742 1.6953 1.7148 3.8555 1.9648 6.2344 13.863 3.9844 23.75 16.859 23.75 31.617v21.805c0 1.6289 6.3477 3.668 6.3477 9.9766 0 4.4727-3.3516 7.4375-7.9023 7.4375h-15.738c-2.375 12.121-17.465 17.004-26.414 8.0547-2.1602-2.1602-3.6953-4.9453-4.3047-8.0547h-15.738c-4.543 0-7.8906-2.9375-7.8906-7.4375l-0.011719-0.003907c0-6.2969 6.3477-8.3477 6.3477-9.9766v-21.801c0-14.758 9.8867-27.633 23.75-31.617zm11.543-1.1445c-1.0195-4.0234-4.2656-4.0234-5.2852 0 1.7656-0.14062 3.5234-0.14062 5.2852 0zm-33.738 65.977h62.199c1.7188 0 2.25-0.8125 1.7383-2.4375-0.5625-1.793-6.1875-3.9102-6.1875-8.9766v-21.801c0-23.656-28.602-35.98-45.473-18.984-4.832 4.8672-7.832 11.586-7.832 18.984v21.805c0 5.6406-6.3477 6.8008-6.3477 9.9766h-0.011719c0 1.1719 0.79688 1.4336 1.9141 1.4336z"
                      fill-rule="evenodd"
                    />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${className}`}>
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default MainLayout;
