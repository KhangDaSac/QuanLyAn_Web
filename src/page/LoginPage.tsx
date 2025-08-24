import { useState } from 'react';
import { Button, Label, TextInput, Alert, Card, Spinner } from 'flowbite-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext/useAuth';
import { HiInformationCircle, HiEye, HiEyeOff, HiLockClosed, HiUser } from 'react-icons/hi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(username.trim(), password);
      if (success) {
        navigate('/');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không chính x��c');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('fetch')) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setError('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const currentLoading = isLoading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Company Logo/Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <HiLockClosed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hệ thống quản lý
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Đăng nhập để tiếp tục
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <Label htmlFor="username" className="mb-2 block text-sm font-medium">
                Tên đăng nhập
              </Label>
              <div className="relative">
                <TextInput
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={currentLoading}
                  icon={HiUser}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="mb-2 block text-sm font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={currentLoading}
                  icon={HiLockClosed}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={currentLoading}
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert color="failure" icon={HiInformationCircle} className="text-sm">
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              disabled={currentLoading}
              size="lg"
            >
              {currentLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner aria-label="Đang đăng nhập..." size="sm" className="mr-3" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                API Server: {import.meta.env.VITE_API_BASE_URL}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Phiên bản: v1.0.0 | © 2025 Hệ thống quản lý
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Security Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Kết nối được bảo mật bằng JWT Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
