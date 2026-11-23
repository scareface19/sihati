'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  CreditCard,
  FileText,
  FolderOpen,
  MapPin,
  AlertTriangle,
  Folder,
  Leaf,
  Users,
  Stethoscope,
  ShieldCheck,
  GraduationCap,
  Mail,
  Phone,
  Check,
  Send,
  Sparkles,
  Activity,
  Pill,
} from 'lucide-react';

export default function HomePage() {
  const { t, dir, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'emergency'>('patient');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', role: 'PATIENT', message: '' });

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen text-slate-900" dir={dir}>
      {/* ========================================================= */}
      {/* 1. HERO SECTION MAJESTUEUSE                               */}
      {/* ========================================================= */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-teal-50/30 to-slate-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 scroll-mt-24">
        {/* Subtle decorative background circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-200/20 via-teal-200/20 to-cyan-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          {/* Top National Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{t.home.badge}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {t.home.title1} <br />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
              {t.home.title2}
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            {t.home.description}
          </p>

          {/* Main Action Buttons (CTAs) */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
            <Link
              href="/emergency-card"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{t.home.ctaCard3d}</span>
            </Link>

            <Link
              href="/prescriptions/new"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>{t.home.ctaPrescription}</span>
            </Link>

            <Link
              href="/patients/1"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-300 shadow-sm text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <FolderOpen className="w-4 h-4 text-slate-600" />
              <span>{t.home.ctaPatient}</span>
            </Link>

            <Link
              href="/pharmacies-radar"
              className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-300 shadow-sm text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>{t.home.ctaPharmacies}</span>
            </Link>

            <Link
              href="/traceability"
              className="px-5 py-3.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-2xl shadow-sm text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-200" />
              <span>{language === 'ar' ? 'تتبع وأصالة الأدوية' : 'Traçabilité & Authenticité'}</span>
            </Link>
          </div>

          {/* Live Trust Banner / Key Numbers */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl font-black text-emerald-700">{t.home.statMedsNum}</span>
              <p className="text-xs font-bold text-slate-600 mt-1">{t.home.statMedsLabel}</p>
              <span className="text-[10px] text-slate-400">{t.home.statMedsSub}</span>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl font-black text-cyan-700">{t.home.statSpecsNum}</span>
              <p className="text-xs font-bold text-slate-600 mt-1">{t.home.statSpecsLabel}</p>
              <span className="text-[10px] text-slate-400">{t.home.statSpecsSub}</span>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl font-black text-purple-700">{t.home.statLabsNum}</span>
              <p className="text-xs font-bold text-slate-600 mt-1">{t.home.statLabsLabel}</p>
              <span className="text-[10px] text-slate-400">{t.home.statLabsSub}</span>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl font-black text-red-600">{t.home.statSosNum}</span>
              <p className="text-xs font-bold text-slate-600 mt-1">{t.home.statSosLabel}</p>
              <span className="text-[10px] text-slate-400">{t.home.statSosSub}</span>
            </div>
          </div>

          {/* Academic Recognition Credits */}
          <div className="pt-8 border-t border-slate-200/80 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-700">{t.home.creditsStudentsLabel}</span> {t.home.creditsStudentsVal}
            </div>
            <div className="hidden sm:inline">•</div>
            <div>
              <span className="font-bold text-slate-700">{t.home.creditsSupervisorsLabel}</span> {t.home.creditsSupervisorsVal}
            </div>
            <div className="hidden sm:inline">•</div>
            <div>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {t.home.creditsPilotVal}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. VITRINE DE LA CARTE DE SANTÉ NUMÉRIQUE (3D PREVIEW)     */}
      {/* ========================================================= */}
      <section id="card" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-bold border border-red-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>{t.home.card3dBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.home.card3dTitle}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.home.card3dDesc}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/emergency-card"
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t.home.card3dBtnCard}</span>
              </Link>
              <Link
                href="/emergency/sihati-sos-token-2024-784512"
                target="_blank"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 flex items-center gap-2 transition"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{t.home.card3dBtnSos}</span>
              </Link>
            </div>
          </div>

          {/* Visual Mini Card Render */}
          <div className="w-full max-w-sm bg-gradient-to-br from-emerald-800 to-teal-950 p-6 rounded-3xl border-2 border-emerald-400/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/20 pb-3">
              <div>
                <p className="text-[10px] font-bold text-emerald-200">{t.home.cardMockupRepublic}</p>
                <p className="text-[8px] text-white/70">{t.home.cardMockupMinistry}</p>
              </div>
              <span className="text-xs">🇩🇿</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-300 to-yellow-500 border border-amber-600 shadow"></div>
              <div className="px-3 py-1 bg-red-600 text-white font-black text-lg rounded-xl shadow">
                O+
              </div>
            </div>

            <div>
              <p className="font-bold text-white text-sm">{t.home.cardMockupName}</p>
              <p className="text-[10px] text-emerald-200 font-mono">{t.home.cardMockupId}</p>
            </div>

            <div className="pt-2 border-t border-white/20 flex justify-between text-[9px] text-white/80 font-mono">
              <span>{t.home.cardMockupAllergy}</span>
              <span className="text-emerald-300 font-bold">{t.home.cardMockupLiaison}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. LES 3 ESPACES DU SYSTÈME (PATIENT, MÉDECIN, PHARMACIE)  */}
      {/* ========================================================= */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t.home.spacesBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {t.home.spacesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t.home.spacesDesc}
          </p>

          {/* Tabs Selector */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('patient')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'patient'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{t.home.tabPatient}</span>
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'doctor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{t.home.tabDoctor}</span>
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'emergency'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.home.tabEmergency}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Espace Patient */}
        {activeTab === 'patient' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Folder className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.patientCard1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.patientCard1Desc}
              </p>
              <Link href="/patients/1" className="text-xs text-emerald-700 font-bold mt-4 inline-block hover:underline">
                {t.home.patientCard1Link}
              </Link>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.patientCard2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.patientCard2Desc}
              </p>
              <Link href="/patients/1" className="text-xs text-emerald-700 font-bold mt-4 inline-block hover:underline">
                {t.home.patientCard2Link}
              </Link>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.patientCard3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.patientCard3Desc}
              </p>
              <span className="text-xs text-slate-400 font-semibold mt-4 block">{t.home.patientCard3Sub}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Espace Médecin */}
        {activeTab === 'doctor' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.doctorCard1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.doctorCard1Desc}
              </p>
              <Link href="/dashboard" className="text-xs text-emerald-700 font-bold mt-4 inline-block hover:underline">
                {t.home.doctorCard1Link}
              </Link>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.doctorCard2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.doctorCard2Desc}
              </p>
              <Link href="/prescriptions/new" className="text-xs text-emerald-700 font-bold mt-4 inline-block hover:underline">
                {t.home.doctorCard2Link}
              </Link>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.doctorCard3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.doctorCard3Desc}
              </p>
              <Link href="/peer-community" className="text-xs text-emerald-700 font-bold mt-4 inline-block hover:underline">
                {t.home.doctorCard3Link}
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Espace Urgences & Pharmacies */}
        {activeTab === 'emergency' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.emergencyCard1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.emergencyCard1Desc}
              </p>
              <Link href="/pharmacies-radar" className="text-xs text-emerald-700 font-bold mt-4 inline-block hover:underline">
                {t.home.emergencyCard1Link}
              </Link>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.emergencyCard2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.emergencyCard2Desc}
              </p>
              <Link href="/emergency/sihati-sos-token-2024-784512" target="_blank" className="text-xs text-red-700 font-bold mt-4 inline-block hover:underline">
                {t.home.emergencyCard2Link}
              </Link>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{t.home.emergencyCard3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.emergencyCard3Desc}
              </p>
              <Link href="/admin" className="text-xs text-purple-700 font-bold mt-4 inline-block hover:underline">
                {t.home.emergencyCard3Link}
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 4. SECTION FAQ & PROBLÈMES RÉSOLUS EN ALGÉRIE             */}
      {/* ========================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              {t.home.faqBadge}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              {t.home.faqTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base">
                {t.home.faq1Prob}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.home.faq1ProbDesc}
              </p>
              <p className="text-emerald-800 font-bold pt-1">
                {t.home.faq1Sol}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base">
                {t.home.faq2Prob}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.home.faq2ProbDesc}
              </p>
              <p className="text-emerald-800 font-bold pt-1">
                {t.home.faq2Sol}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base">
                {t.home.faq3Prob}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.home.faq3ProbDesc}
              </p>
              <p className="text-emerald-800 font-bold pt-1">
                {t.home.faq3Sol}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-base">
                {t.home.faq4Prob}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.home.faq4ProbDesc}
              </p>
              <p className="text-emerald-800 font-bold pt-1">
                {t.home.faq4Sol}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SECTION À PROPOS DE NOUS (#about)                      */}
      {/* ========================================================= */}
      <section id="about" className="py-20 bg-slate-100/70 border-t border-slate-200 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
              {t.home.aboutBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              {t.home.aboutTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {t.home.aboutDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Équipe & Genèse */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.home.aboutCard1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.aboutCard1Desc}
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <p>
                  <strong className="text-slate-900">{t.home.aboutStudentsLabel}</strong>
                  <br />{t.home.aboutStudentsVal}
                </p>
                <p>
                  <strong className="text-slate-900">{t.home.aboutSupervisorsLabel}</strong>
                  <br />{t.home.aboutSupervisorsVal}
                </p>
              </div>
            </div>

            {/* Card 2: Sécurité & Loi 18-07 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.home.aboutCard2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.aboutCard2Desc}
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.home.aboutSec1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.home.aboutSec2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.home.aboutSec3}</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Phase Pilote Sétif */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.home.aboutCard3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.home.aboutCard3Desc}
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <p>
                  <strong className="text-slate-900">{t.home.aboutHospitalLabel}</strong> {t.home.aboutHospitalVal}
                </p>
                <p>
                  <strong className="text-slate-900">{t.home.aboutPharmLabel}</strong> {t.home.aboutPharmVal}
                </p>
                <p>
                  <strong className="text-slate-900">{t.home.aboutSosLabel}</strong> {t.home.aboutSosVal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SECTION CONTACT (#contact)                             */}
      {/* ========================================================= */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
              {t.home.contactBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              {t.home.contactTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {t.home.contactDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Info Column (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{t.home.contactDirectTitle}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  {t.home.contactDirectDesc}
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-white">{t.home.contactAddrLabel}</strong>
                    <span className="text-slate-300">{t.home.contactAddrVal}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-white">{t.home.contactEmailLabel}</strong>
                    <span className="text-emerald-300 font-mono">{t.home.contactEmailVal1}</span>
                    <br />
                    <span className="text-slate-400 font-mono">{t.home.contactEmailVal2}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-white">{t.home.contactPhoneLabel}</strong>
                    <span className="text-slate-300 font-mono" dir="ltr">{t.home.contactPhoneVal}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Hotline Numbers */}
              <div className="pt-6 border-t border-slate-700/80">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">
                  {t.home.emergencyHotlineTitle}
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl">
                    <span className="text-xl font-black text-red-400">14</span>
                    <p className="text-[10px] text-slate-300 mt-0.5">{t.home.hotlineCivile}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-2xl">
                    <span className="text-xl font-black text-blue-400">1021</span>
                    <p className="text-[10px] text-slate-300 mt-0.5">{t.home.hotlineSamu}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl">
                    <span className="text-xl font-black text-emerald-400">1548</span>
                    <p className="text-[10px] text-slate-300 mt-0.5">{t.home.hotlinePolice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{t.home.formSuccessTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {t.home.formSuccessDesc}
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: '', phone: '', email: '', role: 'PATIENT', message: '' });
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    {t.home.formNewBtn}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.home.formNameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder={t.home.formNamePlaceholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.home.formPhoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="0550 XX XX XX"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.home.formEmailLabel}
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="exemple@email.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.home.formRoleLabel}
                      </label>
                      <select
                        value={contactForm.role}
                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="PATIENT">{t.home.formRolePatient}</option>
                        <option value="DOCTOR">{t.home.formRoleDoctor}</option>
                        <option value="PHARMACIST">{t.home.formRolePharm}</option>
                        <option value="CLINIC">{t.home.formRoleClinic}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.home.formMsgLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={t.home.formMsgPlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.home.formSubmitBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. BANNIÈRE FINALE D'ENGAGEMENT                           */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">{t.home.ctaBannerTitle}</h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            {t.home.ctaBannerDesc}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-8 py-3.5 bg-white text-emerald-800 font-extrabold rounded-2xl text-xs sm:text-sm shadow hover:bg-emerald-50 transition"
            >
              {t.home.ctaLoginBtn}
            </Link>
            <Link
              href="/emergency-card"
              className="px-8 py-3.5 bg-slate-900/60 hover:bg-slate-900 text-white font-extrabold rounded-2xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>{t.home.ctaCardBtn}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FOOTER INSTITUTIONNEL COMPLET (PIED DE PAGE)           */}
      {/* ========================================================= */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: Logo & Présentation */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇩🇿</span>
                <span className="text-xl font-black tracking-tight text-white">
                  صحّتي <span className="text-emerald-400">SIHATI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.home.footerTagline}
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold">
                {t.home.footerPilot}
              </div>
            </div>

            {/* Col 2: Services Proposés */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.home.footerServicesTitle}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/#services" className="hover:text-emerald-400 transition">
                    {t.home.patientCard1Title}
                  </Link>
                </li>
                <li>
                  <Link href="/emergency-card" className="hover:text-emerald-400 transition">
                    {t.home.ctaCard3d}
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-emerald-400 transition">
                    {t.nav.prescriptions}
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-emerald-400 transition">
                    {t.home.emergencyCard1Title}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Liens Rapides & À Propos */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.home.footerLinksTitle}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/" className="hover:text-emerald-400 transition">
                    {t.nav.home}
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="hover:text-emerald-400 transition">
                    {t.nav.about}
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-emerald-400 transition">
                    {t.nav.contact}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 transition">
                    {t.nav.login}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Conformité & Urgences */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.home.footerLegalTitle}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.home.footerLegalDesc}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="px-2 py-1 bg-red-900/50 text-red-300 rounded-lg border border-red-700/50 font-bold">
                  {t.home.footerCivile}
                </span>
                <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-lg border border-blue-700/50 font-bold">
                  {t.home.footerSamu}
                </span>
              </div>
            </div>
          </div>

          {/* Copyright & Academic Credits */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} {t.home.footerCopyright}</p>
            <p className="text-[11px] text-slate-400">
              {t.home.footerCredits}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
