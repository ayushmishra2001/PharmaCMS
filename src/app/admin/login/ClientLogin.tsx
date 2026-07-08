'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/LoginPage';
import ResetPasswordPage from '@/components/ResetPasswordPage';

export default function ClientLogin() {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'reset'>('login');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings-public')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
      
    const handleHash = () => {
      if (window.location.hash === '#/reset-password') {
        setView('reset');
      } else {
        setView('login');
      }
    };
    
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-teal-400">Loading...</div>;
  }

  if (view === 'reset') {
    return <ResetPasswordPage onBackToLogin={() => setView('login')} />;
  }

  return (
    <LoginPage
      settings={settings || { companyName: '   Pharma' }}
      onLoginSuccess={() => {
        router.push('/admin');
        router.refresh();
      }}
      onBackToPublic={() => {
        router.push('/');
      }}
    />
  );
}
