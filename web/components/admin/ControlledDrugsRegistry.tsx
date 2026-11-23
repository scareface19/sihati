'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useLanguage } from '@/lib/i18n';
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Pill,
  User,
  Building2,
  Calendar,
  Clock,
  Download,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Flame,
  FileText,
  BadgeAlert,
  Eye,
  Check,
} from 'lucide-react';

export interface ControlledDrugDispensation {
  id: string;
  patientName: string;
  patientChifa: string;
  patientNin: string;
  patientPhone: string;
  patientAge: number;
  patientWilaya: string;
  drugName: string;
  dci: string;
  category: 'PSYCHOTROPE' | 'STUPEFIANT' | 'COLD_CHAIN';
  batchNumber: string;
  serialNumber: string;
  quantityDispensed: number;
  prescribingDoctor: string;
  doctorSpecialty: string;
  doctorRegistrationNumber: string;
  prescriptionHash: string;
  prescriptionDate: string;
  dispensingPharmacy: string;
  pharmacistName: string;
  dispensationDate: string;
  anomalyAlert: boolean;
  anomalyReason?: string;
  status: 'VERIFIED' | 'SUSPECT' | 'UNDER_INVESTIGATION';
}

export default function ControlledDrugsRegistry() {
  const { language, dir } = useLanguage();
  const isRTL = dir === 'rtl';

  const [dispensations, setDispensations] = useState<ControlledDrugDispensation[]>([]);
  const [stats, setStats] = useState({
    totalDispensations: 6,
    alertCount: 2,
    uniquePatients: 6,
    uniquePharmacies: 4,
    complianceRate: 67,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PSYCHOTROPE' | 'STUPEFIANT' | 'COLD_CHAIN' | 'ALERTS'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      let url = '/traceability/controlled-dispensations';
      const params: string[] = [];

      if (searchQuery.trim()) {
        params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }

      if (selectedCategory === 'ALERTS') {
        params.push('alertOnly=true');
      } else if (selectedCategory !== 'ALL') {
        params.push(`category=${selectedCategory}`);
      }

      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const [resData, resStats] = await Promise.all([
        api.get(url),
        api.get('/traceability/controlled-dispensations/stats'),
      ]);

      if (resData.data) setDispensations(resData.data);
      if (resStats.data) setStats(resStats.data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await api.put(`/traceability/controlled-dispensations/${id}/status`, {
        status: 'VERIFIED',
        notes: 'تم فحص ومراجعة الملف من طرف مفتشية الصيدلة بالمديرية وتأكيد سلامة الحالة',
      });
      setToastMessage('✅ تم تثبيت مراجعة التفتيش وتأكيد مطابقة الملف');
      setTimeout(() => setToastMessage(null), 3500);
      loadData();
    } catch (err: any) {
      alert('Erreur: ' + (err.message || 'Impossible de mettre à jour'));
    }
  };

  const handleExportAudit = () => {
    const jsonStr = JSON.stringify(dispensations, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rapport_Surveillance_Psychotropes_DSP_Setif_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setToastMessage('📥 تم تصدير تقرير التفتيش الصيدلاني بنجاح (Loi 04-18 / ANPDP)');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 start-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-600 text-sm font-bold animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-rose-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>الرقابة المشددة على الأدوية والمؤثرات العقلية • قانون 04-18 ومرسوم 21-196</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              سجل مراقبة مشتريات المؤثرات العقلية والمرضى (Controlled Drugs Registry)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              فضاء خاص بالمشرف العام ومديرية الصحة لمتابعة هويات كافة المواطنين الذين قاموا بصرف واقتناء أدوية مصنفة كمؤثرات عقلية أو مسكنات مركزية (ليريكا، ترامادول، مورفين)، مع الرصد الآلي لحالات التحايل والتردد على عدة صيدليات (Nomadisme Médical).
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportAudit}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/20 transition flex items-center justify-center gap-2 self-start md:self-auto shrink-0 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>تصدير تقرير التفتيش (DSP / ANPDP)</span>
          </button>
        </div>

        {/* 4 KPIs Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.totalDispensations}</div>
            <div className="text-xs text-slate-300 font-bold mt-1">إجمالي عمليات الصرف المسجلة</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">{stats.uniquePatients}</div>
            <div className="text-xs text-slate-300 font-bold mt-1">مرضى تحت المتابعة بالولاية</div>
          </div>

          <div className="bg-rose-500/20 backdrop-blur-md rounded-2xl p-4 border border-rose-500/40">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-300 font-mono">{stats.alertCount}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            </div>
            <div className="text-xs text-rose-200 font-bold mt-1">حالات اشتباه وتردد صيدلاني 🚨</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">{stats.uniquePharmacies}</div>
            <div className="text-xs text-slate-300 font-bold mt-1">صيدليات مصرحة بسطيف</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث باسم المريض، رقم بطاقة الشفاء، رقم التعريف الوطني NIN، رقم الحصة، أو الطبيب..."
              className="w-full ps-11 pe-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>بحث وتصفية</span>
          </button>
        </form>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>تصنيف المواد :</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            كافة العمليات ({stats.totalDispensations})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('ALERTS')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              selectedCategory === 'ALERTS'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span>🚨 إشعارات الاشتباه والتردد ({stats.alertCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('PSYCHOTROPE')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              selectedCategory === 'PSYCHOTROPE'
                ? 'bg-purple-700 text-white'
                : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            المؤثرات العقلية (Lyrica / جدول ب)
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('STUPEFIANT')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              selectedCategory === 'STUPEFIANT'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            المسكنات الأفيونية والمخدرات (Tramadol / Morphine)
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('COLD_CHAIN')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              selectedCategory === 'COLD_CHAIN'
                ? 'bg-cyan-700 text-white'
                : 'bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100'
            }`}
          >
            سلسلة التبريد (Insuline)
          </button>
        </div>
      </div>

      {/* Main Table: Controlled Dispensations List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-rose-600" />
              <span>سجل صرف الأدوية المقيدة والمؤثرات العقلية (Loi 04-18)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              بيانات محينة وموثقة بموجب القانون الجزائري لحماية المعطيات الصحية 18-07 ونظام بطاقة الشفاء
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {dispensations.length} عملية مسجلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/70">
                <th className="py-3.5 px-4 text-start">المريض المقتني (Patient)</th>
                <th className="py-3.5 px-4 text-start">المادة الحساسة المصروفة (Drug)</th>
                <th className="py-3.5 px-4 text-start">الطبيب الواصف (Prescription)</th>
                <th className="py-3.5 px-4 text-start">الصيدلية وتاريخ الصرف</th>
                <th className="py-3.5 px-4 text-start">حالة المطابقة والرقابة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dispensations.length > 0 ? (
                dispensations.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition ${
                      item.anomalyAlert ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-sm">{item.patientName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                        <div>
                          الشفاء : <span className="font-mono font-bold text-emerald-800">{item.patientChifa}</span>
                        </div>
                        <div>
                          التعريف NIN : <span className="font-mono text-slate-600">{item.patientNin}</span>
                        </div>
                        <div>
                          {item.patientAge} سنة • {item.patientWilaya} • هاتف : {item.patientPhone}
                        </div>
                      </div>
                    </td>

                    {/* Drug */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900">{item.drugName}</div>
                      <div className="text-[11px] text-slate-500">{item.dci}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          حصة : {item.batchNumber}
                        </span>
                        <span className="font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                          الكمية : {item.quantityDispensed} علبة
                        </span>
                        <span className="font-mono text-slate-400">SN: {item.serialNumber}</span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.prescribingDoctor}</div>
                      <div className="text-[11px] text-slate-500">{item.doctorSpecialty}</div>
                      <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                        <div>عمادة الأطباء : {item.doctorRegistrationNumber}</div>
                        <div>تاريخ الوصفة : {item.prescriptionDate}</div>
                        <div className="font-mono text-[9px] text-slate-500">
                          الرمز : {item.prescriptionHash.slice(0, 18)}...
                        </div>
                      </div>
                    </td>

                    {/* Pharmacy & Dispensation Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.dispensingPharmacy}</div>
                      <div className="text-[11px] text-slate-500">{item.pharmacistName}</div>
                      <div className="text-[11px] font-mono font-bold text-slate-700 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(item.dispensationDate).toLocaleString('fr-FR')}</span>
                      </div>
                    </td>

                    {/* Status & Alerts */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {item.anomalyAlert ? (
                        <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-xl space-y-1">
                          <div className="flex items-center gap-1.5 text-rose-900 font-black text-xs">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>اشتباه تردد صيدلاني (Nomadisme)</span>
                          </div>
                          <p className="text-[10px] text-rose-800 leading-relaxed font-semibold">
                            {item.anomalyReason}
                          </p>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>صرف نظامي ومطابق للمدة القانونية (30 يوماً)</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <Link
                          href="/patients/1"
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 w-full justify-center"
                        >
                          <Eye className="w-3 h-3" />
                          <span>الملف 360°</span>
                        </Link>

                        {item.anomalyAlert && (
                          <button
                            type="button"
                            onClick={() => handleResolveAlert(item.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 w-full justify-center shadow-xs"
                            title="تأكيد التحقيق وإزالة علامة الشك"
                          >
                            <Check className="w-3 h-3" />
                            <span>تسوية التفتيش</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                    لا توجد أي نتائج مطابقة للبحث المحدد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
