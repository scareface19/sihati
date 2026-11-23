'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { AuthGuard } from '@/lib/auth';
import {
  FileText,
  MapPin,
  Clock,
  Lock,
  Calculator,
  Stethoscope,
  Activity,
  Users,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function AdvancedDashboardPage() {
  return (
    <AuthGuard allowedRoles={['DOCTOR', 'ADMIN']}>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { t, dir } = useLanguage();
  const [patientIdInput, setPatientIdInput] = useState('1');

  // Calculateur clinique rapide
  const [calcWeight, setCalcWeight] = useState('72');
  const [calcHeight, setCalcHeight] = useState('175');
  const [calcAge, setCalcAge] = useState('28');

  // File d'attente du jour avec Triage Clinique
  const queue = [
    {
      id: 1,
      patientId: 1,
      name: 'محمد أمين بن علي (Mohamed Amine BENALI)',
      age: 28,
      gender: 'M',
      time: '10:00',
      reason: 'متابعة ضغط الدم والتحاليل الدورية (Suivi HTA)',
      triage: 'ROUTINE',
      bloodGroup: 'O+',
      status: 'EN_ATTENTE',
    },
    {
      id: 2,
      patientId: 2,
      name: 'ياسمين بوراس (Yasmine BOURAS)',
      age: 34,
      gender: 'F',
      time: '10:30',
      reason: 'ألم صدري حاد وإرهاق تنفسي (Douleur thoracique)',
      triage: 'URGENT',
      bloodGroup: 'A+',
      status: 'EN_ATTENTE',
    },
    {
      id: 3,
      patientId: 3,
      name: 'الحاج بلقاسم مسعودي (Belkacem MESSAOUDI)',
      age: 68,
      gender: 'M',
      time: '11:15',
      reason: 'فحص مفاصل الركبة ومراجعة الأدوية (Gonalgie & Rx)',
      triage: 'ROUTINE',
      bloodGroup: 'B+',
      status: 'EN_ATTENTE',
    },
  ];

  // Calcul de l'IMC
  const heightM = parseFloat(calcHeight) / 100;
  const imc = (parseFloat(calcWeight) / (heightM * heightM)).toFixed(1);

  return (
    <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir={dir}>
      {/* Top Banner Doctor Station */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-slate-200 gap-4 bg-white p-6 rounded-3xl shadow-sm border">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.dashboard.badge}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">{t.dashboard.order}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-normal">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/prescriptions/new"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition"
          >
            <FileText className="w-4 h-4" />
            <span>{t.dashboard.btnPrescription}</span>
          </Link>
          <Link
            href="/pharmacies"
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold rounded-2xl text-xs transition flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{t.dashboard.btnPharmacies}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.dashboard.statPatientsToday}</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-4xl font-extrabold text-slate-900">12</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {t.dashboard.statWaiting}
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2">{t.dashboard.statAvgWait}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.dashboard.statPrescriptions}</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-4xl font-extrabold text-emerald-700">48</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {t.dashboard.statQrValid}
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2">{t.dashboard.statPrescDesc}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.dashboard.statAlerts}</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-4xl font-extrabold text-amber-600">7</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              Sécurité Thérapeutique
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2">{t.dashboard.statAlertsDesc}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.dashboard.statSos}</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-4xl font-extrabold text-red-600">14</span>
            <span className="text-xs font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
              Protection Civile
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-2">{t.dashboard.statSosDesc}</p>
        </div>
      </div>

      {/* Main Grid : Waiting Room Triage Queue + Patient Lookup + Clinical Calculator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left : Live Queue with Triage Coding (XL: 8) */}
        <div className="xl:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.dashboard.queueTitle}</h2>
              <p className="text-xs text-slate-500">{t.dashboard.queueSubtitle}</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t.dashboard.activePatients}
            </span>
          </div>

          <div className="space-y-4">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-100/60 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-sm flex items-center justify-center">
                    {item.bloodGroup}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          item.triage === 'URGENT'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {item.triage === 'URGENT' ? t.dashboard.urgent : t.dashboard.routine}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <span>{item.age} ans</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.time}</span>
                      <span>•</span>
                      <span>{item.reason}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link
                    href={`/patients/${item.patientId}`}
                    className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    {t.dashboard.openRecord}
                  </Link>
                  <Link
                    href={`/prescriptions/new?patientId=${item.patientId}`}
                    className="flex-1 md:flex-initial px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    {t.dashboard.writeRx}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right : Patient Instant Unlock & Clinical Calculator (XL: 4) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Patient Quick Unlock with Consent */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2 text-emerald-600">
              <Lock className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">{t.dashboard.unlockTitle}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {t.dashboard.unlockDesc}
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-700 font-semibold mb-1 block">
                  {t.dashboard.inputPlaceholder}
                </label>
                <input
                  type="text"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <Link
                href={`/patients/${patientIdInput || 1}`}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs block text-center shadow-sm transition"
              >
                {t.dashboard.btnUnlock}
              </Link>
            </div>
          </div>

          {/* Quick Clinical Calculator (Outil Pratique Médecin) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-cyan-700">
              <Calculator className="w-5 h-5 text-cyan-700" />
              <h3 className="font-bold text-slate-900 text-sm">{t.dashboard.calcTitle}</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="text-[10px] text-slate-600 block mb-0.5">{t.dashboard.weight}</label>
                <input
                  type="text"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-center text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 block mb-0.5">{t.dashboard.height}</label>
                <input
                  type="text"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-center text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 block mb-0.5">{t.dashboard.age}</label>
                <input
                  type="text"
                  value={calcAge}
                  onChange={(e) => setCalcAge(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-center text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-600">{t.dashboard.imc}</span>
                <p className="font-extrabold text-slate-900 text-base mt-0.5">{imc} kg/m²</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-1 rounded">
                {t.dashboard.imcNormal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
