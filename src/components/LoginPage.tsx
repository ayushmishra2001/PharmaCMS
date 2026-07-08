"use client";
import React, { useState } from 'react';
import { Pill, Mail, Lock, ShieldCheck, ArrowRight, KeyRound, Smartphone, AlertCircle, Info, Inbox, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types';
import { getImgSrc, getImgAlt, getImgTitle } from '../lib/imageUtils';

interface LoginPageProps {
  settings: SiteSettings;
  onLoginSuccess: (user: { id: string; email: string; name: string; role: any }) => void;
  onBackToPublic: () => void;
}

export default function LoginPage({ settings, onLoginSuccess, onBackToPublic }: LoginPageProps) {
  const [mode, setMode] = useState<'password' | 'otp' | 'forgot'>('password');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Simulation feedback (For seamless testing inside the sandbox iframe)
  const [simulatedMail, setSimulatedMail] = useState<{ email: string; link: string } | null>(null);
  const [simulatedSms, setSimulatedSms] = useState<{ email: string; otp: string } | null>(null);

  // Email Validation Helper
  const handleEmailValidation = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // 1. Password Login Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email address is required.');
      return;
    }
    if (!handleEmailValidation(trimmedEmail)) {
      setError('Please enter a valid institutional email address.');
      return;
    }
    if (!password) {
      setError('Security password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        setSuccess('Authentication successful! Directing to secure portal...');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      }
    } catch (err) {
      setError('Network communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Request OTP Code
  const handleRequestOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSimulatedSms(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please provide an email address first.');
      return;
    }
    if (!handleEmailValidation(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to generate OTP for this email.');
      } else {
        setSuccess('One-Time Password has been generated.');
        setSimulatedSms({ email: trimmedEmail, otp: data.simulatedOtp });
      }
    } catch (err) {
      setError('Failed to reach authentication servers.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP Submit
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !handleEmailValidation(trimmedEmail)) {
      setError('A valid email address is required.');
      return;
    }
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      setError('Please enter a valid 6-digit numeric OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, otp }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid or expired OTP. Please request a new code.');
      } else {
        setSuccess('OTP verification successful! Logging you in...');
        setSimulatedSms(null);
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      }
    } catch (err) {
      setError('Communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Request Forgot Password Reset Link
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSimulatedMail(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please provide your corporate email address.');
      return;
    }
    if (!handleEmailValidation(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to initiate password reset.');
      } else {
        setSuccess('Password reset token generated.');
        setSimulatedMail({ email: trimmedEmail, link: data.resetLink });
      }
    } catch (err) {
      setError('Communication with security systems failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToPublic}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold font-mono flex items-center space-x-1.5 transition duration-150 cursor-pointer"
        >
          <span>← Back to Public Website</span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative">
          {settings.logoUrl ? (
            <div className="flex justify-center mb-4">
              <img
                src={getImgSrc(settings.logoUrl, 'medium')}
                alt={getImgAlt(settings.logoUrl, settings.companyName || 'Pharma Brand')}
                title={getImgTitle(settings.logoUrl, settings.companyName || 'Pharma Brand')}
                className="h-12 max-w-[200px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="p-3 bg-teal-500/10 rounded-xl inline-block border border-teal-500/20 mb-4">
              <Pill className="h-8 w-8 text-teal-500 animate-pulse" />
            </div>
          )}
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight uppercase">
            {settings.companyName || 'Pharmaceutical Enterprise'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">
            {mode === 'password' && 'Enterprise Portal Authenticator'}
            {mode === 'otp' && 'OTP Secure Authorization'}
            {mode === 'forgot' && 'Credential Recovery Console'}
          </p>
        </div>

        {/* Global error or success messages */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-xs text-rose-800 mb-6 flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-xs text-teal-800 mb-6 flex items-start space-x-2 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        {/* MODE: PASSWORD LOGIN */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5 relative">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Institutional Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Security Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setMode('forgot');
                  }}
                  className="text-[10px] text-teal-600 hover:text-teal-700 font-mono font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>{loading ? 'Validating...' : 'Authorize Secure Entry'}</span>
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">Alternative Entry:</span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setMode('otp');
                }}
                className="text-[10px] font-bold text-teal-600 hover:text-teal-700 font-mono flex items-center space-x-1"
              >
                <Smartphone className="h-3 w-3" />
                <span>Sign in using OTP</span>
              </button>
            </div>


          </form>
        )}

        {/* MODE: SECURE OTP LOGIN */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Institutional Email</label>
              <div className="relative flex space-x-2">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="bg-slate-50 hover:bg-slate-100 text-teal-600 hover:text-teal-700 font-mono text-[10px] font-bold px-3 py-2.5 rounded-lg border border-slate-200 shrink-0 transition cursor-pointer"
                >
                  Send OTP
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">6-Digit One-Time Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !otp}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Verify & Enter'}</span>
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setMode('password');
                }}
                className="text-[10px] text-teal-600 hover:text-teal-700 font-mono font-semibold"
              >
                Back to Standard Password Login
              </button>
            </div>
          </form>
        )}

        {/* MODE: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-sans">
              <div className="font-bold text-slate-800 uppercase tracking-wider mb-1 text-[9px] font-mono flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
                <span>One-Time secure recovery</span>
              </div>
              Enter your registered corporate email. We will generate an encrypted reset link that enforces strict one-time-use security and automatically expires in 15 minutes.
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Registered Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>{loading ? 'Generating link...' : 'Generate Recovery Link'}</span>
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setMode('password');
                }}
                className="text-[10px] text-teal-600 hover:text-teal-700 font-mono font-semibold"
              >
                Back to Login Page
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
