import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { ShieldCheck, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, error, clearError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formValidationErr, setFormValidationErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationErr(null);
    clearError();

    // Validations
    if (!email || !password) {
      setFormValidationErr("Please fill in all required fields.");
      return;
    }

    if (isRegistering) {
      if (!name) {
        setFormValidationErr("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setFormValidationErr("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setFormValidationErr("Passwords do not match.");
        return;
      }

      await registerWithEmail(name, email, password);
    } else {
      await loginWithEmail(email, password);
    }
  };

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setFormValidationErr(null);
    clearError();
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-slate-200 transition-all">
        <div>
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-sm">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-800">
            {isRegistering ? "Create Personnel Account" : "Asset Management System"}
          </h2>
          <p className="mt-2 text-center text-xs text-slate-400 font-semibold">
            {isRegistering 
              ? "Register company personnel to track assets" 
              : "Sign in with Google or company credentials"}
          </p>
        </div>

        {/* Action Error Banner */}
        {(error || formValidationErr) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 font-medium">
              {formValidationErr || error}
            </div>
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    id="reg-name"
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Personnel Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  id="auth-email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  id="auth-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    id="reg-confirm-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              id="auth-submit-btn"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md cursor-pointer"
            >
              {isRegistering ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">Or continue with</span>
          </div>
        </div>

        {/* Live Google Sign-In Integration */}
        <div>
          <button
            onClick={loginWithGoogle}
            id="google-signin-btn"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.133C18.336 1.8 15.54 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.977 0-.742-.08-1.303-.177-1.718H12.24z"
              />
            </svg>
            Google Company Account
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleToggleMode}
            id="toggle-auth-mode-btn"
            className="text-sm font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            {isRegistering 
              ? "Already have an account? Sign In" 
              : "Need a personnel account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
