
import { useAuth } from '../context/authContext/useAuth';

const HomePage = () => {
  const { user } = useAuth();

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
