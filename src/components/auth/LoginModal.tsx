import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  LogIn,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email định danh trường cấp.');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setErrorMessage('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin đăng nhập.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSubmitted(true);
    setTimeout(() => {
      setResetSubmitted(false);
      setShowForgotPassword(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-6 relative">
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              setErrorMessage('');
              setShowForgotPassword(false);
            }}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">
                Cổng Dịch Vụ CNTT Định Danh
              </span>
              <h3 className="text-xl font-bold mt-1">Đăng Nhập Hệ Thống</h3>
              <p className="text-xs text-blue-100">
                Sử dụng tài khoản email trường Đại học để gửi yêu cầu & quản lý
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {showForgotPassword ? (
            /* Forgot Password Screen */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Khôi phục mật khẩu tài khoản</h4>
                <p className="text-xs text-slate-500">
                  Nhập địa chỉ email định danh (@hnmu.edu.vn) để nhận mã xác thực OTP
                </p>
              </div>

              {resetSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-1 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="font-bold">Đã gửi mã xác nhận OTP!</div>
                  <p>Vui lòng kiểm tra hộp thư đến hoặc hòm thư Spam để đặt lại mật khẩu mới.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email trường của bạn:</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="masv@hnmu.edu.vn hoặc ten.ho@hnmu.edu.vn"
                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="w-1/2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                    >
                      Gửi liên kết OTP
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            /* Main Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email định danh trường cấp:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ten.ho@hnmu.edu.vn hoặc masv@hnmu.edu.vn"
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu:</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotPassword(true);
                    }}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Vào Hệ Thống</span>
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500">
                  Bảo mật thông tin: Vui lòng sử dụng đúng email và mật khẩu được cấp. Tuyệt đối không chia sẻ mật khẩu cho người khác.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-[11px] text-slate-500 text-center">
          Tài khoản được đồng bộ trực tiếp từ hệ thống SSO & Cổng Đào Tạo Trường Đại Học.
        </div>
      </div>
    </div>
  );
};
