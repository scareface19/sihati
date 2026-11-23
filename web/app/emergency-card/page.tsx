'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  RefreshCw,
  Printer,
  Link2,
  Check,
  AlertTriangle,
  Radio,
  Heart,
  OctagonAlert,
  QrCode,
  Lightbulb,
  User,
  ShieldAlert,
} from 'lucide-react';

export default function DigitalEmergencyCardPage() {
  const { dir } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const patient = {
    fullNameAr: 'محمد أمين بن علي',
    fullNameFr: 'BENALI Mohamed Amine',
    dateOfBirth: '14 Mai 1996 (14/05/1996)',
    gender: 'ذكر / Masculin',
    bloodGroup: 'O+',
    rhesus: 'Positif (+)',
    wilaya: 'Sétif (سطيف)',
    commune: 'Sétif Centre (حي 1014 مسكن)',
    nationalId: 'DZ-SETIF-1996-784512',
    cardNumber: '9845 2026 7845 1209',
    expiryDate: '12/2030',
    qrToken: 'sihati-sos-token-2024-784512',
    allergies: [
      { name: 'Pénicilline (بنسلين)', severity: 'شديدة جداً / SÉVÈRE' },
      { name: 'Arachides (مكسرات)', severity: 'شديدة / SÉVÈRE' },
    ],
    chronicDiseases: [
      'ارتفاع ضغط الدم الشرياني (Hypertension Artérielle)',
      'لا يوجد سكري (Non Diabétique)',
    ],
    activeMedications: [
      'SARTEG 80mg (Valsartan) - 1 comp/jour le matin',
      'Vitamine D 1000 UI - 1 gélule/jour',
    ],
    emergencyContacts: [
      { name: 'فاطمة بن علي (Mère / الأم)', phone: '06 12 34 56 78' },
      { name: 'أحمد بن علي (Frère / الأخ)', phone: '06 98 76 54 32' },
    ],
    doctor: 'Dr. محمد علي (Médecin Traitant - Sétif)',
    doctorPhone: '0661 23 45 67',
  };

  const handlePrint = () => {
    window.print();
  };

  const copySosLink = () => {
    const url = `${window.location.origin}/emergency/${patient.qrToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8" dir={dir}>
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto no-print">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-3 border border-red-200">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>البطاقة الصحية الرقمية للطوارئ • Loi 18-07</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          بطاقة الطوارئ الصحية الذكية (Carte Vitale d'Urgence)
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          بطاقة إلكترونية رسمية تحاكي البطاقة البيومترية الحقيقية، تحتوي على كافة المعطيات الحيوية المنقذة للحياة وتسهل التدخل السريع لفرق الحماية المدنية (14) والمسعفين.
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isFlipped ? 'عرض وجه البطاقة (Recto)' : 'قلب البطاقة للخلف (Verso)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة البطاقة بحجم المحفظة</span>
          </button>

          <button
            onClick={copySosLink}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-slate-600" />}
            <span>{copied ? 'تم نسخ رابط SOS' : 'نسخ رابط بطاقة الطوارئ'}</span>
          </button>
        </div>
      </div>

      {/* 3D Smart Card Container */}
      <div className="flex justify-center items-center py-4">
        <div
          className="relative w-full max-w-[560px] h-[345px] sm:h-[355px] cursor-pointer transition-transform duration-700 select-none"
          style={{ perspective: '1200px' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`w-full h-full relative transition-all duration-700 shadow-2xl rounded-3xl`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* ========================================================= */}
            {/* FACE 1 : RECTO (FACE AVANT DE LA CARTE RÉELLE)           */}
            {/* ========================================================= */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden p-6 sm:p-7 flex flex-col justify-between border-2 border-emerald-400/40 shadow-2xl text-white"
              style={{
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 45%, #047857 75%, #0f172a 100%)',
              }}
            >
              {/* Filigrane et Motifs Guillochis de Sécurité Algérienne */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              ></div>

              <div className="absolute right-0 top-0 bottom-0 w-72 bg-gradient-to-l from-emerald-400/10 to-transparent pointer-events-none"></div>

              {/* Ligne 1 : En-tête Officiel de l'État Algérien */}
              <div className="relative z-10 flex justify-between items-start border-b border-white/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xl font-black shadow-inner">
                    🇩🇿
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-emerald-100 tracking-wider">
                      الجمهورية الجزائرية الديمقراطية الشعبية
                    </p>
                    <p className="text-[9px] font-semibold text-white/80">
                      RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE
                    </p>
                    <p className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mt-0.5">
                      وزارة الصحة • بطاقة الطوارئ الصحية الذكية (SIHATI SOS)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/40 border border-white/20 text-emerald-200">
                    NFC • RFID
                  </span>
                  <div className="text-[10px] text-white/80 font-bold mt-1">EMERGENCY SMART CARD</div>
                </div>
              </div>

              {/* Ligne 2 : Puce EMV Dorée + Sans Contact + Groupe Sanguin Géant */}
              <div className="relative z-10 flex justify-between items-center my-1">
                {/* Puce Électronique Dorée à Microprocesseur */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-9 rounded-lg border border-amber-300 shadow-md relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)',
                    }}
                  >
                    {/* Dessin des micro-lignes de contact de la puce */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-900/40"></div>
                    <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-900/40"></div>
                    <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-900/40"></div>
                    <div className="w-4 h-4 rounded-full border border-amber-900/30 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  </div>

                  {/* Logo Sans Contact (Radio wave) */}
                  <Radio className="w-5 h-5 text-white/80" />
                </div>

                {/* Badge Groupe Sanguin Vital */}
                <div className="flex items-center gap-2 bg-red-600/90 border-2 border-white/60 px-4 py-1.5 rounded-2xl shadow-lg shadow-red-900/50">
                  <span className="text-xs font-bold text-red-100 uppercase">فصيلة الدم</span>
                  <span className="text-2xl font-black text-white tracking-wider">{patient.bloodGroup}</span>
                </div>
              </div>

              {/* Ligne 3 : Photo Patient + Identité Complète */}
              <div className="relative z-10 flex items-center gap-4 my-1">
                {/* Avatar du titulaire avec cadre biométrique */}
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white/10 border-2 border-white/40 overflow-hidden relative shadow-lg flex-shrink-0 flex items-center justify-center">
                  <User className="w-10 h-10 text-white/80" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-mono text-center py-0.5 text-white">
                    SETIF-2024
                  </div>
                </div>

                {/* Informations d'identité */}
                <div className="flex-1 space-y-0.5">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                    {patient.fullNameAr}
                  </h2>
                  <p className="text-xs font-bold text-emerald-200 tracking-wider">
                    {patient.fullNameFr}
                  </p>
                  <p className="text-[11px] text-white/90">
                    Né le : <strong className="text-white">{patient.dateOfBirth}</strong> • {patient.gender}
                  </p>
                  <p className="text-[10px] text-white/80">
                    Wilaya : <strong className="text-emerald-200">{patient.wilaya}</strong> • {patient.commune}
                  </p>
                </div>
              </div>

              {/* Ligne 4 : Alertes Majeures Résumées (Allergies + HTA) */}
              <div className="relative z-10 flex gap-2">
                <div className="flex-1 bg-red-950/70 border border-red-500/50 px-2.5 py-1 rounded-xl text-[10px] text-red-200 flex items-center gap-1.5 font-bold">
                  <OctagonAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>حساسية بنسلين (Pénicilline)</span>
                </div>
                <div className="flex-1 bg-amber-950/70 border border-amber-500/50 px-2.5 py-1 rounded-xl text-[10px] text-amber-200 flex items-center gap-1.5 font-bold">
                  <Heart className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>ضغط دم مرتفع (HTA)</span>
                </div>
              </div>

              {/* Ligne 5 : Numéro de Carte en Relief + Date d'Expiration */}
              <div className="relative z-10 flex justify-between items-end pt-2 border-t border-white/20 text-xs">
                <div>
                  <span className="text-[8px] text-white/60 uppercase tracking-widest block">Numéro d'immatriculation</span>
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-emerald-100">
                    {patient.cardNumber}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[8px] text-white/60 uppercase tracking-widest block">Expire Fin</span>
                  <span className="font-mono text-xs font-bold text-white">{patient.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* FACE 2 : VERSO (FACE ARRIÈRE DE LA CARTE RÉELLE)          */}
            {/* ========================================================= */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden p-5 sm:p-6 flex flex-col justify-between border-2 border-slate-300 shadow-2xl text-slate-900"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
              }}
            >
              {/* Bande Magnétique Noire Réaliste */}
              <div className="-mx-6 -mt-6 h-11 bg-slate-900 flex items-center justify-between px-6 text-[8px] text-slate-400 font-mono tracking-widest select-none">
                <span>SIHATI HEALTH TRACK DATA // ENCRYPTED 256-BIT</span>
                <span>SECURITY CHIP 8.0</span>
              </div>

              {/* Contacts d'Urgence et Protection Civile 14 */}
              <div className="grid grid-cols-12 gap-3 my-2 items-center text-xs">
                {/* Colonne Gauche : Données Médicales & Contacts */}
                <div className="col-span-8 space-y-2">
                  {/* Protection Civile Sétif 14 */}
                  <div className="p-2 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-red-900 block flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>الإسعاف والحماية المدنية (Protection Civile) :</span>
                      </span>
                      <span className="text-[11px] text-red-700">اتصال فوري ومجاني من أي هاتف</span>
                    </div>
                    <span className="text-xl font-black text-red-700 bg-white px-2 py-0.5 rounded-lg border border-red-300">
                      14
                    </span>
                  </div>

                  {/* Contacts Famille */}
                  <div className="p-2 bg-slate-100 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 block">أقارب المريض للحالات الحرجة (Famille) :</span>
                    {patient.emergencyContacts.map((c, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <strong className="text-slate-800">{c.name}</strong>
                        <span className="font-mono text-emerald-800 font-bold">{c.phone}</span>
                      </div>
                    ))}
                  </div>

                  {/* Médecin Traitant */}
                  <div className="text-[10px] text-slate-600 flex justify-between">
                    <span>الطبيب المعالج : {patient.doctor}</span>
                    <span className="font-mono font-bold text-slate-800">{patient.doctorPhone}</span>
                  </div>
                </div>

                {/* Colonne Droite : Vrai QR Code pour Secouriste */}
                <div className="col-span-4 flex flex-col items-center justify-center p-2 bg-white rounded-2xl border border-slate-300 shadow-sm">
                  <div className="w-20 h-20 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center text-center p-1">
                    <QrCode className="w-8 h-8 text-white" />
                    <span className="text-[7px] font-mono tracking-tighter uppercase mt-0.5">SCAN ME</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-600 text-center mt-1">
                    مسح لفرق الإسعاف (14)
                  </span>
                  <span className="text-[7px] text-emerald-700 font-mono">Dossier Validé</span>
                </div>
              </div>

              {/* Ligne Inférieure : Zone de Lecture Optique MRZ */}
              <div className="bg-slate-200/80 rounded-xl p-2 font-mono text-[9px] sm:text-[10px] tracking-wider text-slate-700 leading-tight select-all border border-slate-300">
                <p>IDDZA78451209&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;9605148M3012314DZA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;8</p>
                <p>BENALI&lt;&lt;MOHAMED&lt;AMINE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explication & Instructions Pédagogiques */}
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 no-print">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              كيف تنقذ هذه البطاقة الرقمية حياة المريض في الحالات الحرجة ؟
            </h3>
            <p className="text-xs text-slate-500">مزايا البطاقة الذكية المطورة وفق مستند المشروع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <h4 className="font-bold text-emerald-900">1. الوصول الفوري دون فتح قفل الهاتف</h4>
            <p className="text-emerald-800 leading-relaxed">
              يمكن حفظ البطاقة كصورة لشاشة القفل أو مسح رمز QR مباشرة من طرف أعوان الحماية المدنية (14) دون الحاجة لكلمة سر.
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-1">
            <h4 className="font-bold text-red-900">2. تجنب الأخطاء الدوائية القاتلة</h4>
            <p className="text-red-800 leading-relaxed">
              إبراز فصيلة الدم والحساسية الشديدة من البنسلين يمنع حقن المريض بأدوية قد تؤدي لصدمة حساسية خطيرة (Choc Anaphylactique).
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
            <h4 className="font-bold text-blue-900">3. الاتصال التلقائي بالعائلة</h4>
            <p className="text-blue-800 leading-relaxed">
              توفير أرقام الأقارب المباشرين (الأم والأخ) يتيح لفرق الإسعاف إخطار العائلة فور وقوع أي حادث مروري أو إغماء.
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
            <h4 className="font-bold text-purple-900">4. شريحة رقمية مشفرة (Loi 18-07)</h4>
            <p className="text-purple-800 leading-relaxed">
              تشفير البيانات الطبية مع إتاحة المعطيات الاستعجالية فقط للمسعفين، حفاظاً على السرية التامة للمريض.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href={`/emergency/${patient.qrToken}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold transition shadow-lg shadow-red-200"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>فتح شاشة الاستغاثة الحية للمسعفين (Vue SOS Secouriste 14)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
