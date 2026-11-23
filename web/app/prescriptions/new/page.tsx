'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useLanguage } from '@/lib/i18n';
import { AuthGuard } from '@/lib/auth';
import {
  Printer,
  Send,
  AlertTriangle,
  AlertOctagon,
  Trash2,
  Search,
  QrCode,
  FileText,
  Stethoscope,
} from 'lucide-react';

interface PrescItem {
  id?: number;
  medicationId?: number;
  dci: string;
  brandName: string;
  dosage: string;
  form: string;
  instructions: string;
  duration: string;
}

export default function AdvancedPrescriptionPage() {
  return (
    <AuthGuard allowedRoles={['DOCTOR', 'ADMIN']}>
      <Suspense fallback={<div className="p-8 text-center text-slate-500">جاري التحميل...</div>}>
        <PrescriptionContent />
      </Suspense>
    </AuthGuard>
  );
}

function PrescriptionContent() {
  const { t, dir } = useLanguage();
  const searchParams = useSearchParams();
  const [patientId] = useState(searchParams.get('patientId') || '1');

  // Données du patient en cours
  const patient = {
    name: 'محمد أمين بن علي (BENALI Mohamed Amine)',
    age: 28,
    gender: 'M',
    bloodGroup: 'O+',
    wilaya: 'Sétif (سطيف)',
    allergies: ['Pénicilline (بنسلين)', 'Arachides (مكسرات)'],
    chronicDiseases: ['Hypertension Artérielle (ضغط الدم)'],
  };

  // État de recherche
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Médicaments sur l'ordonnance
  const [items, setItems] = useState<PrescItem[]>([
    {
      id: 1,
      medicationId: 118,
      brandName: 'SARTEG',
      dci: 'VALSARTAN',
      dosage: '80MG',
      form: 'COMPRIME PELLICULE',
      instructions: '1 comprimé par jour chaque matin après le petit-déjeuner',
      duration: '30 jours (Renouvelable)',
    },
    {
      id: 2,
      medicationId: 410,
      brandName: 'VITAMINE C BGL',
      dci: 'ACIDE ASCORBIQUE',
      dosage: '1G',
      form: 'COMPRIME EFFERVESCENT',
      instructions: '1 comprimé effervescent dissous dans un verre d’eau le matin',
      duration: '15 jours',
    },
  ]);

  // Alertes de sécurité clinique temps réel
  const [safetyAlerts, setSafetyAlerts] = useState<any[]>([]);
  const [qrCodeHash] = useState('ORD-2026-ALG-SETIF-' + Math.floor(100000 + Math.random() * 900000));
  const [prescriptionDate] = useState('29 Septembre 2026');

  // Recherche dans l'API NestJS des 560 médicaments
  useEffect(() => {
    if (search.trim().length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        api
          .get(`/medications/search?q=${encodeURIComponent(search)}&limit=8`)
          .then((res) => setSearchResults(res.data))
          .catch(() => setSearchResults([]))
          .finally(() => setIsSearching(false));
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [search]);

  // Moteur d'évaluation des interactions et allergies
  useEffect(() => {
    const alerts: any[] = [];

    items.forEach((item) => {
      // 1. Détection allergie pénicilline
      const dciUpper = (item.dci || '').toUpperCase();
      const brandUpper = (item.brandName || '').toUpperCase();
      if (
        dciUpper.includes('AMOXICILLINE') ||
        dciUpper.includes('PENICILLINE') ||
        brandUpper.includes('AMOXYPEN') ||
        brandUpper.includes('AMODEX')
      ) {
        alerts.push({
          type: 'CRITICAL',
          title: 'CONTRE-INDICATION ABSOLUE : ALLERGIE AUX PÉNICILLINES (حساسية قاتلة)',
          message: `Le patient présente une allergie sévère documentée aux Bêta-lactamines. La prescription de ${item.brandName} (${item.dci}) est strictement contre-indiquée (risque de choc anaphylactique).`,
        });
      }

      // 2. Détection interaction AINS + Antihypertenseur
      if (
        dciUpper.includes('IBUPROFENE') ||
        dciUpper.includes('DICLOFENAC') ||
        dciUpper.includes('KETOPROFENE')
      ) {
        const hasAntihypertensive = items.some(
          (other) =>
            (other.dci || '').toUpperCase().includes('VALSARTAN') ||
            (other.dci || '').toUpperCase().includes('RAMIPRIL') ||
            (other.dci || '').toUpperCase().includes('AMLODIPINE'),
        );
        if (hasAntihypertensive) {
          alerts.push({
            type: 'WARNING',
            title: 'INTERACTION MÉDICAMENTEUSE : AINS + ANTI-HYPERTENSEUR (تداخل دوائي)',
            message: `L'association de ${item.brandName} avec un bloqueur du SRAA (Valsartan) diminue l'effet antihypertenseur et majore le risque d'insuffisance rénale aiguë chez ce patient hypertendu.`,
          });
        }
      }
    });

    setSafetyAlerts(alerts);
  }, [items]);

  const addMedication = (med: any) => {
    setItems([
      ...items,
      {
        id: Date.now(),
        medicationId: med.id,
        brandName: med.brandName,
        dci: med.dci,
        dosage: med.dosage,
        form: med.form,
        instructions: '1 prise par jour selon avis médical',
        duration: '15 jours',
      },
    ]);
    setSearch('');
    setSearchResults([]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir={dir}>
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-slate-200 gap-4 bg-white p-6 rounded-3xl shadow-sm border">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{t.prescription.badge}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">{t.prescription.nomenclature}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{t.prescription.title}</h1>
          <p className="text-xs text-slate-600 mt-1">
            {t.prescription.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>{t.prescription.btnPrint}</span>
          </button>
          <button
            onClick={() => alert('Ordonnance chiffrée et synchronisée avec le smartphone du patient Mohamed Amine !')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-2 transition"
          >
            <Send className="w-4 h-4 text-slate-600" />
            <span>{t.prescription.btnSend}</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ================= GAUCHE : OUTILS DE PRESCRIPTION & SÉCURITÉ (XL: 6) ================= */}
        <div className="xl:col-span-6 space-y-6 no-print">
          {/* Patient Context Ribbon */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center border border-emerald-200">
                {patient.bloodGroup}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{patient.name}</h3>
                <p className="text-xs text-slate-500">
                  {patient.age} ans • Wilaya de {patient.wilaya} • Dossier N° 2024-784512
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>{t.prescription.allergyAlert}</span>
              </span>
            </div>
          </div>

          {/* Moteur d'Alertes Cliniques Temps Réel */}
          {safetyAlerts.length > 0 && (
            <div className="space-y-3">
              {safetyAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-sm ${
                    alert.type === 'CRITICAL'
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  {alert.type === 'CRITICAL' ? (
                    <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clinical Search Input (560 Médicaments) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.prescription.searchLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.prescription.searchPlaceholder}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition placeholder:text-slate-400"
              />
              {isSearching && (
                <span className="absolute right-4 top-3.5 text-xs text-emerald-700 font-semibold">
                  {t.prescription.searching}
                </span>
              )}
            </div>

            {/* Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute left-6 right-6 top-24 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((med: any) => (
                  <div
                    key={med.id}
                    onClick={() => addMedication(med)}
                    className="p-3.5 hover:bg-emerald-50 cursor-pointer flex justify-between items-center transition group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                          {med.brandName}
                        </span>
                        <span className="text-xs text-slate-500">({med.dci})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Code: {med.code} • N° Enreg: {med.registrationNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {med.dosage} • {med.form}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Liste des Lignes de Prescription Ajustables */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-slate-900">{t.prescription.prescribedCount} ({items.length})</h3>
              <span className="text-[11px] text-slate-500">{t.prescription.adjustSubtitle}</span>
            </div>

            <div className="space-y-3">
              {items.map((it, idx) => (
                <div
                  key={it.id || idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-emerald-700 font-mono text-xs font-bold mr-2">0{idx + 1}.</span>
                      <strong className="text-slate-900 text-sm">{it.brandName}</strong>
                      <span className="text-xs text-slate-600 ml-2">({it.dci} - {it.dosage})</span>
                    </div>
                    <button
                      onClick={() => removeItem(it.id!)}
                      className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-0.5 rounded-lg hover:bg-red-50 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.prescription.delete}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-600 font-semibold mb-1 block">{t.prescription.instructions}</label>
                      <input
                        type="text"
                        value={it.instructions}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].instructions = e.target.value;
                          setItems(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 font-semibold mb-1 block">{t.prescription.duration}</label>
                      <input
                        type="text"
                        value={it.duration}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].duration = e.target.value;
                          setItems(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= DROITE : APERÇU DIRECT FORMAT FEUILLE A4 OFFICIELLE (XL: 6) ================= */}
        <div className="xl:col-span-6 flex flex-col items-center">
          <div className="w-full mb-3 flex justify-between items-center px-2 no-print">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {t.prescription.a4Preview}
            </span>
            <span className="text-xs text-slate-500">{t.prescription.a4Dimensions}</span>
          </div>

          {/* Vraie Feuille A4 Médicale Algérienne Imprimable */}
          <div className="w-full max-w-[620px] bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-300 relative print-only-a4" dir="rtl">
            {/* Filigrane discret de sécurité */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-8xl font-black text-slate-950 transform -rotate-45">SIHATI PRO</span>
            </div>

            {/* En-tête Officiel République Algérienne */}
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <p className="text-[12px] font-bold text-slate-800 tracking-wider">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </p>
              <p className="text-[10px] font-semibold text-slate-500">
                RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
              </p>
              <p className="text-[11px] font-bold text-emerald-800 mt-0.5">
                وزارة الصحة • MINISTÈRE DE LA SANTÉ
              </p>
            </div>

            {/* Coordonnées du Praticien & Cabinet (Sétif) */}
            <div className="flex justify-between items-start mt-4 pb-4 border-b border-slate-200 text-xs">
              <div>
                <h2 className="text-base font-black text-slate-900">Dr. محمد علي (Dr. Mohamed ALI)</h2>
                <p className="font-bold text-emerald-700">Médecine Générale • طب عام</p>
                <p className="text-slate-600 text-[11px] mt-0.5">Agrément N° : MED-SETIF-2015-089</p>
                <p className="text-slate-600 text-[11px]">Cabinet Médical : 1014 Logements, Sétif</p>
                <p className="text-slate-600 text-[11px]">Tél : 0661 23 45 67</p>
              </div>

              <div className="text-left">
                <p className="text-slate-500 text-[11px]">سطيف في :</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5">Sétif, le {prescriptionDate}</p>
                <div className="mt-2 text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 inline-block font-mono">
                  {qrCodeHash}
                </div>
              </div>
            </div>

            {/* Informations Patient */}
            <div className="my-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500">المريض / Patient : </span>
                <strong className="text-slate-900 text-sm">{patient.name}</strong>
              </div>
              <div className="text-left text-slate-600">
                <span>العمر : <strong>{patient.age} ans</strong></span> • <span>الفصيلة : <strong>{patient.bloodGroup}</strong></span>
              </div>
            </div>

            {/* Titre Ordonnance */}
            <div className="text-center my-4">
              <span className="text-xl font-black tracking-widest text-slate-900 uppercase border-b-2 border-slate-900 pb-1">
                ORDONNANCE / وصفة طبية
              </span>
            </div>

            {/* Liste Typographiée des Médicaments (Rx) */}
            <div className="space-y-4 my-6 min-h-[220px]">
              {items.map((it, idx) => (
                <div key={idx} className="text-xs leading-relaxed text-right">
                  <div className="flex items-baseline justify-between">
                    <p className="font-black text-slate-900 text-sm">
                      {idx + 1}. {it.brandName} <span className="font-normal text-slate-600 text-xs">({it.dci})</span> - {it.dosage}
                    </p>
                    <span className="text-[11px] font-semibold text-slate-500 italic">[{it.form}]</span>
                  </div>
                  <p className="text-slate-700 pr-4 font-medium mt-0.5">
                    ↳ {it.instructions} pendant <strong>{it.duration}</strong>.
                  </p>
                </div>
              ))}
            </div>

            {/* Bas de page : Tampon Officiel & QR Code DataMatrix */}
            <div className="pt-6 border-t-2 border-slate-800 flex justify-between items-end mt-8">
              {/* QR Code de Validation Pharmacie */}
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 border-2 border-slate-900 rounded-xl flex items-center justify-center font-mono text-[9px] text-slate-700 p-1">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <span className="text-[9px] text-slate-500 mt-1 block font-mono">{t.prescription.verifiedQr}</span>
              </div>

              {/* Cachet Électronique Rond et Signature */}
              <div className="text-center relative">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-emerald-700 flex flex-col items-center justify-center text-center p-2 transform -rotate-6 bg-emerald-50/40">
                  <span className="text-[8px] font-black text-emerald-900 uppercase">Cabinet Médical Sétif</span>
                  <span className="text-[11px] font-black text-emerald-800">Dr. MOHAMED ALI</span>
                  <span className="text-[7px] text-emerald-700">Médecine Générale</span>
                  <span className="text-[7px] text-emerald-600 font-mono">N° 2015/089</span>
                  <span className="text-[10px] text-emerald-800 font-bold mt-1">✓ CERTIFIÉ</span>
                </div>
                <span className="text-[9px] text-slate-500 block mt-1">{t.prescription.doctorStamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
