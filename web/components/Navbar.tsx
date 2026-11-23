'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationCenter from './NotificationCenter';
import {
  Activity,
  Shield,
  FileText,
  User,
  Calendar,
  Users,
  MapPin,
  Pill,
  AlertTriangle,
  LogIn,
  UserPlus,
  LogOut,
  CreditCard,
  Stethoscope,
  Plus,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { t, dir } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" dir={dir}>
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-md shadow-emerald-200 group-hover:scale-105 transition">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{t.brand.name}</span>
              <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">{t.brand.enName}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">{t.brand.tagline}</p>
          </div>
        </Link>

        {/* ========================================================= */}
        {/* NAVIGATION DYNAMIQUE SELON L'ÉTAT D'AUTHENTIFICATION     */}
        {/* ========================================================= */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-700">
          {isAuthenticated && user ? (
            /* MENU APRÈS AUTHENTIFICATION (SELON LE RÔLE) */
            <>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 font-bold transition flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>لوحة الإدارة (Admin)</span>
                </Link>
              )}

              {(user.role === 'DOCTOR' || user.role === 'ADMIN') && (
                <>
                  <Link href="/dashboard" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.nav.dashboard}</span>
                  </Link>
                  <Link
                    href="/prescriptions/new"
                    className="hover:text-emerald-700 transition text-emerald-700 font-extrabold flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.nav.prescriptions}</span>
                  </Link>
                  <Link href="/patients" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.nav.patients}</span>
                  </Link>
                  <Link href="/appointments" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.nav.appointments}</span>
                  </Link>
                  <Link href="/peer-community" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.nav.community}</span>
                  </Link>
                  <Link href="/pharmacies-radar" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.nav.pharmacies}</span>
                  </Link>
                  <Link href="/traceability" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{dir === 'rtl' ? 'تتبع الأدوية' : 'Traçabilité'}</span>
                  </Link>
                </>
              )}

              {user.role === 'PHARMACY' && (
                <>
                  <Link
                    href="/pharmacies"
                    className="text-emerald-700 font-extrabold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
                  >
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{dir === 'rtl' ? 'رادار صيدليتي والمخزون' : 'Mon Officine & Stocks'}</span>
                  </Link>
                  <Link href="/prescriptions/new" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dir === 'rtl' ? 'صرف الوصفات' : 'Délivrance Ordonnances'}</span>
                  </Link>
                  <Link href="/emergency/sihati-sos-token-2024-784512" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    <span>{dir === 'rtl' ? 'مسح طوارئ SOS' : 'Scanner SOS'}</span>
                  </Link>
                  <Link href="/traceability" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{dir === 'rtl' ? 'سلسلة التبريد وتتبع الدفعة' : 'Traçabilité & Froid'}</span>
                  </Link>
                </>
              )}

              {user.role === 'PATIENT' && (
                <>
                  <Link href="/patients/1" className="hover:text-emerald-700 transition text-emerald-700 font-extrabold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{dir === 'rtl' ? 'ملفي الطبي الموحد' : 'Mon Dossier Médical'}</span>
                  </Link>
                  <Link href="/emergency-card" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dir === 'rtl' ? 'بطاقتي الصحية الرقمية 3D' : 'Ma Carte 3D'}</span>
                  </Link>
                  <Link href="/appointments" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dir === 'rtl' ? 'مواعيدي' : 'Rendez-vous'}</span>
                  </Link>
                  <Link href="/pharmacies-radar" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.nav.pharmacies}</span>
                  </Link>
                  <Link href="/traceability" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{dir === 'rtl' ? 'فحص أصالة الدواء' : 'Vérifier mon Médicament'}</span>
                  </Link>
                </>
              )}
            </>
          ) : (
            /* MENU PUBLIC AVANT AUTHENTIFICATION (PLATEFORME PROFESSIONNELLE VITRINE) */
            <>
              <Link href="/" className="hover:text-emerald-700 transition">
                {t.nav.home}
              </Link>
              <Link
                href="/pharmacies-radar"
                className="text-emerald-700 font-bold hover:text-emerald-800 transition flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
              >
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.nav.pharmacies}</span>
              </Link>
              <Link
                href="/traceability"
                className="text-cyan-800 font-bold hover:text-cyan-900 transition flex items-center gap-1.5 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                <span>{dir === 'rtl' ? 'تتبع وأصالة الأدوية' : 'Traçabilité des Médicaments'}</span>
              </Link>
              <Link href="/#services" className="hover:text-emerald-700 transition">
                {t.nav.services}
              </Link>
              <Link href="/#about" className="hover:text-emerald-700 transition">
                {t.nav.about}
              </Link>
              <Link href="/emergency-card" className="hover:text-emerald-700 transition flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.nav.emergencyCard}</span>
              </Link>
              <Link href="/#contact" className="hover:text-emerald-700 transition">
                {t.nav.contact}
              </Link>
            </>
          )}
        </nav>

        {/* Language Switcher + Notification Center + User Profile + Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <NotificationCenter />

          {isAuthenticated && user ? (
            /* Utilisateur connecté : badge rôle + bouton déconnexion */
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 hidden md:inline-flex items-center gap-1.5">
                {user.role === 'DOCTOR' ? (
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                ) : user.role === 'ADMIN' ? (
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                ) : user.role === 'PHARMACY' ? (
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                ) : (
                  <User className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>
                  {user.role === 'DOCTOR'
                    ? 'Dr. '
                    : user.role === 'ADMIN'
                    ? 'Admin: '
                    : user.role === 'PHARMACY'
                    ? 'Officine: '
                    : ''}
                  {user.firstName}
                </span>
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl text-xs font-bold transition border border-slate-200 flex items-center gap-1.5"
                title={t.nav.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.nav.logout}</span>
              </button>
            </div>
          ) : (
            /* Utilisateur non connecté : boutons de connexion et d'inscription */
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.nav.login}</span>
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                <span>{t.nav.register}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
