"use client";
import React, { useState, useEffect } from 'react';
import { Pill, Lock, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResetPasswordPageProps {
  onBackToLogin: () => void;
}

export default function ResetPasswordPage({ onBackToLogin }: ResetPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Extract URL queries from hash (since we use hash router, queries are after '?')
  useEffect(() => {
    const parseUrlParams = () => {
      const hash = window.location.hash;
      const queryIndex = hash.indexOf('?');
      if (queryIndex !== -1) {
        const queryStr = hash.substring(queryIndex + 1);
        const params = new URLSearchParams(queryStr);
        setEmail(params.get('email') || '');
        setToken(params.get('token') || '');
      }
    };
    
    parseUrlParams();
    // Handle hash change
    window.addEventListener('hashchange', parseUrlParams);
    return () => window.removeEventListener('hashchange', parseUrlParams);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!email || !token) {
      setError('Invalid or incomplete security token. Please request a new link.');
      return;
    }
    if (!newPassword) {
      setError('A new security password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update security password. Token might be invalid or expired.');
      } else {
        setSuccess('Security password updated successfully! Your single-use token has been consumed.');
      }
    } catch (err) {
      setError('Network communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 flex flex-col items-center justify-center p-6 relative">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="p-3 bg-teal-500/10 rounded-xl inline-block border border-teal-500/20 mb-4">
            <Lock className="h-8 w-8 text-teal-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight uppercase">Update Password</h2>
          <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">Enterprise Credential Override</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-xs text-rose-800 mb-6 flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-4 text-xs text-teal-850 flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong className="block text-slate-950 mb-1">Success!</strong>
                <span className="leading-relaxed">{success}</span>
              </div>
            </div>

            <button
              onClick={onBackToLogin}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Proceed to Login Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {(!email || !token) ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-4 text-xs text-amber-800 flex items-start space-x-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-1">Missing Security Token</strong>
                  <span>No valid password reset parameters were detected in the URL. Please return to the login screen and request a fresh recovery link.</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[10px] text-slate-600 font-mono space-y-1">
                <div>Email Context: <code className="text-teal-600 font-bold">{email}</code></div>
                <div>Single-Use Token: <code className="text-teal-600 font-bold">{token.substring(0, 12)}...</code></div>
                <div className="text-[9px] text-slate-500 uppercase font-bold pt-1">Status: Active & Expires in 15 mins</div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">New Corporate Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  disabled={!email || !token}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono transition disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  disabled={!email || !token}
                  placeholder="Must match exactly"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono transition disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !token}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>{loading ? 'Committing update...' : 'Commit New Password'}</span>
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-[10px] text-teal-600 hover:text-teal-700 font-mono font-semibold"
              >
                Return to Entry Authenticator
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
