import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        await register(name, email, phone, password);
      }
    } catch (err) {
      setErrorMsg((err as Error).message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClient = async () => {
    setEmail('radhika@example.com');
    setPassword('client123');
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await login('radhika@example.com', 'client123');
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setEmail('admin@meghnajewellery.com');
    setPassword('admin123');
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await login('admin@meghnajewellery.com', 'admin123');
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-[#D9D0C1] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 p-1.5 text-[#6D6253] hover:text-[#1E1B18] rounded hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-white border-b border-[#E8E0D2] text-center">
          <div className="w-10 h-10 bg-[#F4EFE6] rounded-full flex items-center justify-center text-[#98702B] mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1E1B18]">
            {authModalMode === 'login' ? 'Patron Sign In' : 'Create Heirloom Account'}
          </h3>
          <p className="text-xs text-[#7A6E5E] mt-1">
            {authModalMode === 'login'
              ? 'Access saved wishlist, track orders & exclusive bridal offers'
              : 'Join the Meghna Jewellery patronage for bespoke privileges'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex border border-[#DDD5C7] rounded p-0.5 mt-5 bg-[#FAF8F5]">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                authModalMode === 'login' ? 'bg-[#1E1B18] text-white' : 'text-[#685E50] hover:text-[#1E1B18]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                authModalMode === 'register' ? 'bg-[#1E1B18] text-white' : 'text-[#685E50] hover:text-[#1E1B18]'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {errorMsg}
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-[#52493D] mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                />
                <UserIcon className="w-3.5 h-3.5 text-[#9E907B] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#52493D] mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
              />
              <Mail className="w-3.5 h-3.5 text-[#9E907B] absolute left-3 top-2.5" />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-[#52493D] mb-1">Phone / WhatsApp Number</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98400 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                />
                <Phone className="w-3.5 h-3.5 text-[#9E907B] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#52493D] mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
              />
              <Lock className="w-3.5 h-3.5 text-[#9E907B] absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#9E907B] hover:text-[#1E1B18]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#383129] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : authModalMode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick Demo Logins for instant testing */}
          <div className="pt-3 border-t border-[#E8E0D2] space-y-2">
            <span className="block text-[11px] text-center text-[#8C7D6B] font-medium">Quick One-Click Demo Access:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleDemoClient}
                className="py-1.5 px-2 bg-white border border-[#DDD5C7] hover:border-[#98702B] rounded text-[11px] text-[#4A433A] font-medium transition-colors cursor-pointer"
              >
                Demo Client Login
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-1.5 px-2 bg-[#F4EFE6] border border-[#CDBEA6] hover:border-[#98702B] rounded text-[11px] text-[#8B6523] font-semibold transition-colors cursor-pointer"
              >
                Demo Admin Vault
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
