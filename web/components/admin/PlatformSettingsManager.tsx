'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import {
  PlatformSettings,
  defaultPlatformSettings,
  getPlatformSettings,
  updatePlatformSettings,
} from '@/lib/platform-settings';
import {
  printPrescriptionPdf,
  printMedicalRecordPdf,
  printLabReportPdf,
} from '@/lib/pdf-generator';
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Printer,
  CheckCircle2,
  Save,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function PlatformSettingsManager() {
  const { language, dir } = useLanguage();
  const [settings, setSettings] = useState<PlatformSettings>(defaultPlatformSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getPlatformSettings();
      setSettings(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessToast(null);
    setErrorToast(null);

    try {
      const updated = await updatePlatformSettings(settings);
      setSettings(updated);
      setSuccessToast(
        dir === 'rtl'
          ? 'تم حفظ وتحديث هوية المؤسسة بنجاح! جميع المطبوعات والوثائق PDF أصبحت تحمل هذه البيانات فوراً.'
          : 'Paramètres institutionnels enregistrés avec succès ! Tous les documents PDF intègrent désormais ces coordonnées.'
      );
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setErrorToast(err?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Tests directs d'ouverture de PDF dans un nouvel onglet avec les données saisies
  const testPrescriptionPdf = async () => {
    const dummyPrescription = {
      id: 'ORD-2026-SETIF-849201',
      date: new Date().toLocaleDateString(),
      doctor: settings.directorName || 'Dr. Mohamed ALI',
      patientName: 'محمد أمين بن علي (Mohamed Amine BENALI)',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
    await printPrescriptionPdf(dummyPrescription, settings);
  };

  const testMedicalRecordPdf = async () => {
    const dummyPatient = {
      name: 'محمد أمين بن علي (Mohamed Amine BENALI)',
      dateOfBirth: '14/05/1996',
      age: 28,
      bloodGroup: 'O+',
      wilaya: 'ولاية سطيف',
      phone: '0555 12 34 56',
      fileNumber: 'EHR-2024-SETIF-784512',
      chifaNumber: '1996 0519 2800 4512',
      allergies: [
        { name: 'Pénicilline (بنسلين)', severity: 'Choc anaphylactique' },
        { name: 'Arachides (فول سوداني)', severity: 'Œdème de Quincke' },
      ],
      chronicDiseases: [{ name: 'Hypertension Artérielle (HTA)', status: 'Équilibré sous traitement' }],
    };
    await printMedicalRecordPdf(dummyPatient, settings);
  };

  const testLabReportPdf = async () => {
    const dummyPatient = {
      name: 'محمد أمين بن علي (Mohamed Amine BENALI)',
      fileNumber: 'EHR-2024-SETIF-784512',
      age: 28,
    };
    await printLabReportPdf([], dummyPatient, settings);
  };

  return (
    <div className="space-y-8" dir={dir}>
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-sm flex items-center gap-3 shadow-md animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 font-bold text-sm flex items-center gap-3 shadow-md">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* En-tête de section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>
              {dir === 'rtl' ? 'بيانات المطبوعات والوثائق الرسمية' : 'Identité des Documents & Impressions'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {dir === 'rtl'
              ? 'تخصيص هوية المنصة وبيانات الاتصال للوثائق الرسمية (PDF)'
              : 'Configuration Institutionnelle des Documents & En-têtes PDF'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {dir === 'rtl'
              ? 'حدد الاسم الرسمي، العنوان، أرقام الهاتف، الفاكس، والبريد الإلكتروني. تظهر هذه المعلومات بصورة تلقائية في ترويسة وتذييل جميع الوصفات الطبية، كشوفات التحاليل، والتقارير المطبوعة.'
              : 'Définissez le nom officiel, l’adresse, le téléphone, le fax, l’email et le site web. Ces coordonnées sont intégrées automatiquement sur chaque ordonnance, bilan de laboratoire et dossier médical généré.'}
          </p>
        </div>

        {/* Boutons d'essais rapides PDF */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={testPrescriptionPdf}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            title="Tester la génération de l'ordonnance dans un nouvel onglet"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>{dir === 'rtl' ? 'تجربة: وصفة طبية (PDF)' : 'Test: Ordonnance'}</span>
            <ExternalLink className="w-3 h-3 text-emerald-500" />
          </button>

          <button
            type="button"
            onClick={testMedicalRecordPdf}
            className="px-3.5 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            title="Tester la génération du dossier médical dans un nouvel onglet"
          >
            <FileText className="w-4 h-4 text-cyan-600" />
            <span>{dir === 'rtl' ? 'تجربة: ملف طبي (PDF)' : 'Test: Dossier 360°'}</span>
            <ExternalLink className="w-3 h-3 text-cyan-500" />
          </button>
        </div>
      </div>

      {/* Formulaire de configuration */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>{dir === 'rtl' ? 'البيانات المؤسساتية والقانونية' : 'Coordonnées Officielles'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Nom en Arabe */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'الاسم الرسمي للمؤسسة / المنصة (بالعربية)' : 'Nom officiel en Arabe'}
            </label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Nom en Français */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'الاسم الرسمي (بالفرنسية)' : 'Nom officiel en Français (En-tête PDF)'}
            </label>
            <input
              type="text"
              required
              value={settings.nameFr}
              onChange={(e) => setSettings({ ...settings, nameFr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Sous-titre Institutionnel */}
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'الترويسة الرسمية الحكومية' : 'En-tête républicain ministériel'}
            </label>
            <input
              type="text"
              required
              value={settings.subTitle}
              onChange={(e) => setSettings({ ...settings, subTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Adresse Physique Complète */}
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'العنوان الجغرافي الكامل (الشارع، البلدية، الولاية)' : 'Adresse géographique complète'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
            </div>
          </div>

          {/* Téléphone Standard */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'رقم الهاتف الثابت (Standard)' : 'Téléphone standard'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
            </div>
          </div>

          {/* Ligne d'Urgence 24/7 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'خط الطوارئ والاستعجالات 24/7' : 'Numéro d’urgence 24/7'}
            </label>
            <input
              type="text"
              required
              value={settings.emergencyPhone}
              onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 text-rose-700 font-bold"
            />
          </div>

          {/* Numéro de Fax */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'رقم الفاكس الرسمي (Fax)' : 'Numéro de Fax'}
            </label>
            <input
              type="text"
              value={settings.fax}
              onChange={(e) => setSettings({ ...settings, fax: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Email Officiel */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'البريد الإلكتروني المؤسساتي' : 'Adresse Email officielle'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
            </div>
          </div>

          {/* Site Web */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'الموقع الإلكتروني الرسمي' : 'Site Web officiel'}
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
              />
              <Globe className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
            </div>
          </div>

          {/* Nom du Directeur / Signataire */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'اسم المدير / الطبيب المسؤول' : 'Nom du Directeur / Praticien responsable'}
            </label>
            <input
              type="text"
              required
              value={settings.directorName}
              onChange={(e) => setSettings({ ...settings, directorName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* N° d'Agrément DSP */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'رقم الاعتماد الوزاري (DSP / Agrément)' : 'N° d’Agrément Ministériel / DSP'}
            </label>
            <input
              type="text"
              required
              value={settings.agreementNumber}
              onChange={(e) => setSettings({ ...settings, agreementNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Mention Légale de Conformité */}
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1.5">
              {dir === 'rtl' ? 'الإشعار القانوني ومطابقة حماية المعطيات (تذييل كل PDF)' : 'Mention légale (Pied de page)'}
            </label>
            <textarea
              rows={2}
              required
              value={settings.legalNotice}
              onChange={(e) => setSettings({ ...settings, legalNotice: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 text-xs"
            />
          </div>
        </div>

        {/* Bouton de Sauvegarde */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {dir === 'rtl'
              ? 'تنعكس التعديلات لحظياً في نظام إنشاء الوثائق بصيغة jsPDF.'
              : 'Les modifications s’appliquent en temps réel sur les nouveaux documents émis.'}
          </p>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'جاري الحفظ...' : dir === 'rtl' ? 'حفظ هوية المؤسسة' : 'Enregistrer les Modifications'}</span>
          </button>
        </div>
      </form>

      {/* Aperçu en direct de l'en-tête officiel imprimé */}
      <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{dir === 'rtl' ? 'معاينة ترويسة الوثائق الرسمية في الواقع' : 'Aperçu en Direct de l’En-tête Imprimé'}</span>
        </h4>

        <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm space-y-3 font-sans">
          <div className="text-center text-[11px] font-bold text-slate-600">
            REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE
            <br />
            <span className="font-normal text-[10px]">{settings.subTitle}</span>
          </div>

          <div className="h-0.5 bg-emerald-600 w-full" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
            <div>
              <div className="font-black text-slate-900 text-base">{settings.nameFr}</div>
              <div className="text-slate-600 mt-0.5">{settings.address}</div>
              <div className="text-slate-500 text-[11px] font-mono">
                Tel : {settings.phone} | Fax : {settings.fax} | Urgences : {settings.emergencyPhone}
              </div>
              <div className="text-slate-500 text-[11px] font-mono">
                Email : {settings.email} | Web : {settings.website}
              </div>
            </div>

            <div className="text-start sm:text-end shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
              <span className="font-bold text-slate-700 block">Agrément N° :</span>
              <span className="font-mono text-emerald-800 font-bold">{settings.agreementNumber}</span>
              <span className="text-[10px] text-slate-500 block mt-1">{settings.directorName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
