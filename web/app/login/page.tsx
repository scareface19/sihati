'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  Plus,
  Lock,
  LogIn,
  Sparkles,
  Stethoscope,
  Shield,
  User,
  Pill,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { login } = useAuth();

  const [phoneOrEmail, setPhoneOrEmail] = useState('dr.ali@sihati.dz');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [activeRoleLoading, setActiveRoleLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showRedirectNotice, setShowRedirectNotice] = useState(!!redirectUrl);

  const getRedirectForRole = (role: string, targetRedirect?: string | null) => {
    // Si redirectUrl correspond au rôle, on l'utilise
    if (targetRedirect) {
      if (role === 'DOCTOR' && (targetRedirect.startsWith('/dashboard') || targetRedirect.startsWith('/prescriptions'))) {
        return targetRedirect;
      }
      if (role === 'PHARMACY' && targetRedirect.startsWith('/pharmacies')) {
        return targetRedirect;
      }
      if (role === 'ADMIN') {
        return targetRedirect;
      }
      if (role === 'PATIENT' && (targetRedirect.startsWith('/patients') || targetRedirect.startsWith('/emergency-card') || targetRedirect.startsWith('/appointments'))) {
        return targetRedirect;
      }
    }

    // Sinon, redirection vers l'espace par défaut du rôle
    if (role === 'ADMIN') return '/admin';
    if (role === 'DOCTOR') return '/dashboard';
    if (role === 'PHARMACY') return '/pharmacies';
    return '/patients/1';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(phoneOrEmail, password);
      const destination = getRedirectForRole(loggedUser.role, redirectUrl);
      router.push(destination);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Identifiants incorrects ou serveur indisponible');
    } finally {
      setLoading(false);
    }
  };

  // Connexion instantanée 1-clic pour les comptes démo
  const handleQuickDemoLogin = async (email: string, roleName: string) => {
    setPhoneOrEmail(email);
    setPassword('password123');
    setShowRedirectNotice(false);
    setError('');
    setActiveRoleLoading(roleName);

    try {
      const loggedUser = await login(email, 'password123');
      const destination = getRedirectForRole(loggedUser.role, null);
      router.push(destination);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur de connexion');
      setActiveRoleLoading(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-emerald-200">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">تسجيل الدخول / Connexion</h2>
          <p className="text-sm text-slate-500 mt-1">بوابة الأطباء والإدارة والصيادلة والمرضى لمنصة صحّتي</p>
        </div>

        {showRedirectNotice && redirectUrl && (
          <div className="mb-4 p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>يتطلب الوصول إلى هذه الصفحة تسجيل الدخول المسبق لحماية المعطيات الصحية.</span>
            </div>
            <button
              onClick={() => setShowRedirectNotice(false)}
              className="text-amber-700 hover:text-amber-900 p-1"
              title="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              البريد أو رقم الهاتف / Email ou Téléphone
            </label>
            <input
              type="text"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              كلمة المرور / Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!activeRoleLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{loading ? 'جاري التحقق...' : 'دخول المنصة / Se Connecter'}</span>
          </button>

          <div className="pt-3 text-center border-t border-slate-100">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ليس لديك حساب؟ إنشاء حساب جديد مجاناً (مواطن / طبيب / صيدلي) ←</span>
            </Link>
          </div>
        </form>

        {/* Grille des 4 comptes de démonstration - Strictement Même Taille */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-slate-700 block">
              حسابات تجريبية حقيقية بنقرة واحدة (1-Clic Démo)
            </span>
            <span className="text-[11px] text-slate-400">
              اضغط على أي صفة لتسجيل الدخول الفوري واستعراض واجهتها الخاصة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. DOCTOR */}
            <button
              onClick={() => handleQuickDemoLogin('dr.ali@sihati.dz', 'DOCTOR')}
              type="button"
              disabled={!!activeRoleLoading}
              className="h-24 w-full p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 hover:border-emerald-300 hover:shadow-md disabled:opacity-60 group"
            >
              {activeRoleLoading === 'DOCTOR' ? (
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
                  <Stethoscope className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs font-bold text-slate-900 leading-tight">طبيب</span>
              <span className="text-[10px] text-emerald-700 font-semibold truncate max-w-full">Dr. Mohamed Ali</span>
            </button>

            {/* 2. PHARMACY */}
            <button
              onClick={() => handleQuickDemoLogin('pharmacie@sihati.dz', 'PHARMACY')}
              type="button"
              disabled={!!activeRoleLoading}
              className="h-24 w-full p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all bg-teal-50/50 hover:bg-teal-100/70 border-teal-200 hover:border-teal-300 hover:shadow-md disabled:opacity-60 group"
            >
              {activeRoleLoading === 'PHARMACY' ? (
                <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition">
                  <Pill className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs font-bold text-slate-900 leading-tight">صيدلي</span>
              <span className="text-[10px] text-teal-700 font-semibold truncate max-w-full">Dr. Belmaaza</span>
            </button>

            {/* 3. ADMIN */}
            <button
              onClick={() => handleQuickDemoLogin('admin@sihati.dz', 'ADMIN')}
              type="button"
              disabled={!!activeRoleLoading}
              className="h-24 w-full p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all bg-purple-50/50 hover:bg-purple-100/70 border-purple-200 hover:border-purple-300 hover:shadow-md disabled:opacity-60 group"
            >
              {activeRoleLoading === 'ADMIN' ? (
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
                  <Shield className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs font-bold text-slate-900 leading-tight">مشرف</span>
              <span className="text-[10px] text-purple-700 font-semibold truncate max-w-full">Admin National</span>
            </button>

            {/* 4. PATIENT */}
            <button
              onClick={() => handleQuickDemoLogin('patient@sihati.dz', 'PATIENT')}
              type="button"
              disabled={!!activeRoleLoading}
              className="h-24 w-full p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all bg-blue-50/50 hover:bg-blue-100/70 border-blue-200 hover:border-blue-300 hover:shadow-md disabled:opacity-60 group"
            >
              {activeRoleLoading === 'PATIENT' ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
                  <User className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs font-bold text-slate-900 leading-tight">مريض</span>
              <span className="text-[10px] text-blue-700 font-semibold truncate max-w-full">Mohamed Amine</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-3 font-mono">
            Mot de passe commun : password123 (Base MySQL active)
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
