
import { useAuth } from '../context/authContext/useAuth';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Phân công án ngẫu nhiên",
      description: "Quản trị viên, quản lý phân công án cho các thẩm phán",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h6v3h-6v-3zm0-6h3v3h-3v-3zm3 0h3v3h-3v-3z" />
        </svg>
      ),
      href: ""
    },
    {
      title: "Quản lý án",
      description: "Giúp quản trị viên, quản lý, quản lý hồ sơ các vụ án",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      href: ""
    },
    {
      title: "Quản lý thẩm phám",
      description: "Giúp quản trị viên, quản lý, quản lý thông tin các thẩm phám",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: ""
    },
    {
      title: "Quản lý tài khoản",
      description: "Giúp quản trị viên, quản lý các tài khoản",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      href: ""
    },
    {
      title: "Quản lý loại vụ án, quan hệ pháp luật, nhóm quan hệ pháp luật",
      description: "Giúp quản trị viên quản lý loại vụ án, quan hệ pháp luật, nhóm quan hệ pháp luật",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: ""
    },
    {
      title: "Báo cáo, thống kê",
      description: "Giúp quản trị viên, quản lý thống kê các hồ sơ vụ án",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: ""
    },
  ]

  return (
    <div className="space-y-12">

      {user && (
        <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{user.username?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Chào mừng trở lại, {user.username}!</h3>
              <p className="text-gray-600">Bạn đã đăng nhập thành công vào hệ thống</p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default HomePage;
