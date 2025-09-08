import { useState, useEffect } from 'react';
import { useToast, ToastContainer } from '../component/basic-component/Toast';
import { AuthService } from '../services/AuthService';
import type ForgotPasswordRequest from '../types/request/auth/ForgotPasswordRequest';
import type VerifyOtpRequest from '../types/request/auth/VerifyOtpRequest';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

const ForgotPasswordPage = ({ onBackToLogin }: ForgotPasswordPageProps) => {
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendCooldown, setResendCooldown] = useState(0);

  const toast = useToast();

  // Countdown cho resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Reset errors khi user nhập
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Xử lý gửi email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Call API thật
      const forgotPasswordData: ForgotPasswordRequest = { email };
      const result = await AuthService.forgotPassword(forgotPasswordData);

      if (result.success) {
        toast.success('Thành công', result.message || "");
        setStep('otp');
        setResendCooldown(60); 
      } else {
        toast.error('Lỗi', result.message || "");
      }
    } catch (error) {
      toast.error('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác thực OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!otp.trim()) {
      newErrors.otp = 'Mã OTP là bắt buộc';
    } else if (otp.length !== 6) {
      newErrors.otp = 'Mã OTP phải có 6 số';
    } else if (!/^\d+$/.test(otp)) {
      newErrors.otp = 'Mã OTP chỉ được chứa số';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Call API thật
      const verifyOtpData: VerifyOtpRequest = { email, otp };
      const result = await AuthService.verifyOtp(verifyOtpData);

      if (result.success) {
        toast.success('Thành công', result.message || "");
        setStep('success');
      } else {
        toast.error('Lỗi', result.message || "");
      }
    } catch (error) {
      toast.error('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi lại OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      const resendData: ForgotPasswordRequest = { email };
      const result = await AuthService.forgotPassword(resendData);

      if (result.success) {
        toast.success('Thành công', result.message || "");
        setResendCooldown(60); // Reset cooldown
      } else {
        toast.error('Lỗi', result.message || "");
      }
    } catch (error) {
      toast.error('Lỗi', 'Có lỗi xảy ra khi gửi lại OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m0 0a2 2 0 002-2zm-7-2a2 2 0 012 2m0 0a2 2 0 01-2 2m0 0a2 2 0 00-2-2m0 0a2 2 0 012-2m0 0a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'email' && 'Quên mật khẩu'}
            {step === 'otp' && 'Xác thực OTP'}
            {step === 'success' && 'Thành công'}
          </h1>
          <p className="text-gray-600">
            {step === 'email' && 'Nhập email để nhận mã xác thực'}
            {step === 'otp' && 'Nhập mã OTP được gửi đến email của bạn'}
            {step === 'success' && 'Yêu cầu của bạn đã được xử lý thành công'}
          </p>
        </div>

        {/* Step 1: Nhập Email */}
        {step === 'email' && (
          <form onSubmit={handleSendEmail} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập địa chỉ email của bạn"
                disabled={isLoading}
                autoFocus
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                'Gửi mã xác thực'
              )}
            </button>
          </form>
        )}

        {/* Step 2: Nhập OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Mã OTP đã được gửi đến: <strong>{email}</strong>
              </p>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Mã OTP <span className="text-red-500">*</span>
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  // Chỉ cho phép nhập số và tối đa 6 ký tự
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  clearError('otp');
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors text-center text-xl tracking-widest ${
                  errors.otp ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="000000"
                maxLength={6}
                disabled={isLoading}
                autoFocus
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xác thực...
                </span>
              ) : (
                'Xác thực OTP'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading || resendCooldown > 0}
                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `Gửi lại sau ${resendCooldown}s` 
                  : 'Không nhận được mã? Gửi lại'
                }
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Thành công */}
        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác thực thành công!
              </h3>
              <p className="text-gray-600">
                Mã OTP đã được xác thực thành công. Bạn có thể đặt lại mật khẩu mới.
              </p>
            </div>

            <button
              onClick={onBackToLogin}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}

        {/* Back button cho step email và otp */}
        {(step === 'email' || step === 'otp') && (
          <div className="mt-6 text-center">
            <button
              onClick={step === 'email' ? onBackToLogin : () => setStep('email')}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              ← {step === 'email' ? 'Quay lại đăng nhập' : 'Quay lại nhập email'}
            </button>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default ForgotPasswordPage;
