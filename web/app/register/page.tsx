'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useLanguage } from '@/lib/i18n';
import {
  User,
  Stethoscope,
  Pill,
  CreditCard,
  Building2,
  Moon,
  AlertCircle,
  CheckCircle2,
  FileText,
  FolderOpen,
  Activity,
  Sparkles,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { dir, language } = useLanguage();

  // Mode: Patient (Citoyen), Médecin, ou Pharmacien
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR' | 'PHARMACY'>('PATIENT');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    wilaya: 'Sétif (سطيف)',
    commune: 'Sétif Centre (سطيف وسط)',
    // Patient Vital Data
    dateOfBirth: '1998-05-14',
    gender: 'M',
    bloodGroup: 'O+',
    allergies: 'Pénicilline (بنسلين)',
    chronicDiseases: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    // Doctor Data
    licenseNumber: '',
    specialty: 'طبيب عام (Médecine Générale)',
    clinicAddress: '',
    // Pharmacy Data
    pharmacyName: '',
    pharmacyLicense: '',
    pharmacyAddress: '',
    pharmacyPhone: '',
    isNightGuard: false,
  });

  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);

  const communesSetif = [
    'Sétif Centre (سطيف وسط)',
    'El Eulma (العلمة)',
    'Ain Oulmene (عين ولمان)',
    'Ain Azel (عين أزال)',
    'Ain Arnat (عين أرنات)',
    'Bougaa (بوقاعة)',
    'Amoucha (عموشة)',
    'Beni Aziz (بني عزيز)',
    'Salah Bey (صالح باي)',
  ];

  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError(language === 'ar' ? 'يرجى كتابة الاسم واللقب' : 'Veuillez saisir votre nom et prénom');
      return false;
    }
    if (!formData.phone || formData.phone.length < 9) {
      setError(language === 'ar' ? 'يرجى إدخال رقم هاتف محمول صحيح (05/06/07)' : 'Veuillez saisir un numéro de mobile algérien valide');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل' : 'Le mot de passe doit comporter au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Les mots de passe ne correspondent pas');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      if (role === 'PHARMACY' && !formData.pharmacyName) {
        setFormData((prev) => ({
          ...prev,
          pharmacyName: prev.pharmacyName || `Pharmacie ${prev.lastName} (${prev.commune.split(' ')[0]})`,
        }));
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError(
        language === 'ar'
          ? 'يرجى الموافقة على شروط معالجة البيانات الصحية وفق القانون 18-07'
          : 'Veuillez accepter les conditions selon la Loi 18-07'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone.trim(),
        email: formData.email.trim() ? formData.email.trim() : undefined,
        password: formData.password,
        role: role,
        wilaya: formData.wilaya,
        commune: formData.commune,
      };

      if (role === 'PATIENT') {
        payload.dateOfBirth = formData.dateOfBirth;
        payload.gender = formData.gender;
        payload.bloodGroup = formData.bloodGroup;
        payload.allergies = formData.allergies;
        payload.chronicDiseases = formData.chronicDiseases;
      } else if (role === 'DOCTOR') {
        payload.licenseNumber = formData.licenseNumber || `DOC-SETIF-${Date.now().toString().slice(-4)}`;
        payload.specialty = formData.specialty;
        payload.clinicAddress = formData.clinicAddress || `${formData.commune}, ${formData.wilaya}`;
      } else if (role === 'PHARMACY') {
        payload.pharmacyName = formData.pharmacyName || `صيدلية ${formData.lastName}`;
        payload.pharmacyLicense = formData.pharmacyLicense || `PHARM-SETIF-${Date.now().toString().slice(-5)}`;
        payload.pharmacyAddress = formData.pharmacyAddress || `${formData.commune}, سطيف`;
        payload.isNightGuard = formData.isNightGuard;
      }

      const res = await api.post('/auth/register', payload);

      if (res.data?.accessToken) {
        localStorage.setItem('sihati_token', res.data.accessToken);
        localStorage.setItem('sihati_user', JSON.stringify(res.data.user));
        setCreatedUser(res.data.user);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (language === 'ar'
            ? 'حدث خطأ أثناء التسجيل، قد يكون رقم الهاتف أو البريد مستخدماً بالفعل'
            : 'Erreur lors de l’inscription. Le numéro ou email est peut-être déjà utilisé.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-2xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>🇩🇿 منظومة صحتي الرقمية • ولاية سطيف</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {role === 'PHARMACY'
              ? (language === 'ar' ? 'تسجيل صيدلية معتمدة (Officine)' : 'Inscription Pharmacie d’Officine')
              : role === 'DOCTOR'
              ? (language === 'ar' ? 'تسجيل طبيب ممارس (Médecin)' : 'Inscription Médecin Praticien')
              : (language === 'ar' ? 'إنشاء حساب مواطن / مريض جديد' : 'Création de Compte Citoyen / Patient')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {role === 'PHARMACY'
              ? (language === 'ar'
                ? 'انضم لشبكة صيدليات ولاية سطيف، ربط المخزون الحيوي، صرف الوصفات الرقمية وتفعيل الحراسة الليلية.'
                : 'Rejoignez le réseau des officines de Sétif, connectez vos stocks et délivrez les e-ordonnances sécurisées.')
              : (language === 'ar'
                ? 'احصل على ملفك الطبي الإلكتروني الموحد وبطاقتك الصحية الرقمية 3D في دقيقتين وفق القانون 18-07.'
                : 'Obtenez votre Dossier Médical Électronique et votre Carte de Santé Numérique 3D en 2 minutes (Loi 18-07).')}
          </p>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-100 mb-8">
          {!success && (
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <div
                  className={`p-2.5 rounded-2xl border transition ${
                    step >= 1 ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="block text-sm">1</span>
                  <span>{language === 'ar' ? 'الهوية والحساب' : 'Identité'}</span>
                </div>
                <div
                  className={`p-2.5 rounded-2xl border transition ${
                    step >= 2 ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="block text-sm">2</span>
                  <span>
                    {role === 'PATIENT'
                      ? (language === 'ar' ? 'بيانات الطوارئ 3D' : 'Constantes 3D')
                      : role === 'DOCTOR'
                      ? (language === 'ar' ? 'البيانات المهنية' : 'Agrément Médical')
                      : (language === 'ar' ? 'بيانات الصيدلية' : 'Agrément Officine')}
                  </span>
                </div>
                <div
                  className={`p-2.5 rounded-2xl border transition ${
                    step >= 3 ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="block text-sm">3</span>
                  <span>{language === 'ar' ? 'التأكيد والتفعيل' : 'Validation'}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Screen */}
          {success ? (
            <div className="py-8 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">
                  {role === 'PHARMACY'
                    ? (language === 'ar' ? 'تم تفعيل حساب الصيدلية بنجاح !' : 'Officine Enregistrée avec Succès !')
                    : (language === 'ar' ? 'مرحباً بك في منظومة صحّتي !' : 'Bienvenue sur SIHATI !')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {role === 'PHARMACY'
                    ? (language === 'ar'
                      ? `تم ربط حساب صيدلية ${formData.pharmacyName || formData.lastName} بصفة رسمية في شبكة سطيف. يمكنك الآن إدارة المخزون ورادار الحراسة وصرف الوصفات.`
                      : `Votre officine ${formData.pharmacyName || formData.lastName} est active. Vous pouvez gérer le radar de garde et délivrer les ordonnances.`)
                    : (language === 'ar'
                      ? `تم إنشاء حسابكم الطبي بنجاح للمواطن: ${createdUser?.firstName} ${createdUser?.lastName} وتوليد بطاقة الطوارئ الرقمية 3D الخاصة بكم.`
                      : `Votre compte médical a été créé avec succès pour ${createdUser?.firstName} ${createdUser?.lastName}. Votre Carte 3D est désormais active.`)}
                </p>
              </div>

              {/* Dynamic Badge / Card Preview based on role */}
              {role === 'PHARMACY' ? (
                <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl text-left border-2 border-emerald-400/40 space-y-3" dir="ltr">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-[10px] font-bold text-emerald-300">RÉPUBLIQUE ALGÉRIENNE • ORDRE DES PHARMACIENS</span>
                    <span className="text-sm">🇩🇿</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                      <Pill className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 text-xs font-black rounded-xl shadow ${formData.isNightGuard ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'}`}>
                      {formData.isNightGuard ? 'GARDE DE NUIT ACTIVE' : 'OFFICINE CONVENTIONNÉE'}
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-base text-white">{formData.pharmacyName || `Pharmacie Dr. ${formData.lastName}`}</p>
                    <p className="text-xs text-emerald-200">Titulaire: Dr. {formData.firstName} {formData.lastName}</p>
                    <p className="text-[10px] text-slate-300 font-mono mt-0.5">{formData.commune}, Sétif • Agrément DSP-SETIF</p>
                  </div>
                  <div className="pt-2 border-t border-white/20 flex justify-between text-[10px] text-emerald-200">
                    <span>Délivrance Sécurisée CHIFA / CNAS</span>
                    <span className="text-emerald-400 font-bold">Connecté au Radar</span>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-800 to-teal-950 p-6 rounded-3xl text-white shadow-xl text-left border-2 border-emerald-400/40 space-y-3" dir="ltr">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-[10px] font-bold text-emerald-200">RÉPUBLIQUE ALGÉRIENNE • CARTE SOS</span>
                    <span className="text-sm">🇩🇿</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-7 rounded bg-amber-400 border border-amber-600"></div>
                    <span className="px-3 py-1 bg-red-600 text-white font-black text-lg rounded-xl shadow">
                      {formData.bloodGroup}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{formData.firstName} {formData.lastName}</p>
                    <p className="text-[10px] text-emerald-200 font-mono">DZ-SETIF-{new Date().getFullYear()}-00{createdUser?.id || '89'}</p>
                  </div>
                  <div className="pt-2 border-t border-white/20 flex justify-between text-[9px] text-white/80">
                    <span>Allergie: {formData.allergies || 'Aucune'}</span>
                    <span className="text-emerald-300 font-bold">Liaison 14 Active</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {role === 'PHARMACY' ? (
                  <>
                    <Link
                      href="/pharmacies"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                    >
                      <Pill className="w-4 h-4" />
                      <span>{language === 'ar' ? 'فتح رادار صيدليتي ومخزون الأدوية' : 'Accéder au Radar Officine'}</span>
                    </Link>
                    <Link
                      href="/prescriptions/new"
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{language === 'ar' ? 'صرف وتأكيد الوصفات الطبية' : 'Délivrance Ordonnances'}</span>
                    </Link>
                  </>
                ) : role === 'DOCTOR' ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                    >
                      <Activity className="w-4 h-4" />
                      <span>{language === 'ar' ? 'لوحة تحكم الطبيب' : 'Tableau de bord'}</span>
                    </Link>
                    <Link
                      href="/prescriptions/new"
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تحرير وصفة طبية ذكية' : 'Nouvelle Prescription'}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/emergency-card"
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'ar' ? 'استعراض بطاقتي الصحية 3D' : 'Consulter ma Carte 3D'}</span>
                    </Link>
                    <Link
                      href="/patients/1"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>{language === 'ar' ? 'دخول ملفي الطبي الشامل' : 'Ouvrir mon Dossier Médical'}</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Civil & Account Info */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Account Type Selector (3 ROLES) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      {language === 'ar' ? 'نوع الحساب المراد إنشاؤه :' : 'Type de compte à créer :'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('PATIENT')}
                        className={`p-3.5 rounded-2xl border text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
                          role === 'PATIENT'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span>{language === 'ar' ? 'مواطن / مريض' : 'Citoyen / Patient'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('DOCTOR')}
                        className={`p-3.5 rounded-2xl border text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
                          role === 'DOCTOR'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Stethoscope className="w-4 h-4" />
                        <span>{language === 'ar' ? 'طبيب ممارس' : 'Médecin Praticien'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('PHARMACY')}
                        className={`p-3.5 rounded-2xl border text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
                          role === 'PHARMACY'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Pill className="w-4 h-4" />
                        <span>{language === 'ar' ? 'صيدلي معتمد' : 'Pharmacien Officine'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {role === 'PHARMACY'
                          ? (language === 'ar' ? 'الاسم الشخصي للصيدلي (Prénom) *' : 'Prénom du Pharmacien *')
                          : (language === 'ar' ? 'الاسم الشخصي (Prénom) *' : 'Prénom *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="محمد أمين / Amine"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {role === 'PHARMACY'
                          ? (language === 'ar' ? 'اللقب العائلي للصيدلي (Nom) *' : 'Nom du Pharmacien *')
                          : (language === 'ar' ? 'اللقب العائلي (Nom de Famille) *' : 'Nom de famille *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="بن علي / BENALI"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'رقم الهاتف المحمول (الجزائر) *' : 'N° Téléphone mobile *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0555 12 34 56"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                        dir="ltr"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {language === 'ar' ? 'يُستخدم كمعرف للدخول واستقبال رموز التأكيد (OTP)' : 'Identifiant de connexion & alertes'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Adresse Email (Optionnelle)'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={role === 'PHARMACY' ? 'contact@pharmacie-setif.dz' : 'citoyen@email.dz'}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'الولاية (Wilaya)' : 'Wilaya'}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.wilaya}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-bold cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {role === 'PHARMACY'
                          ? (language === 'ar' ? 'بلدية تواجد الصيدلية (Commune)' : 'Commune de l’officine')
                          : (language === 'ar' ? 'بلدية الإقامة (Commune)' : 'Commune de résidence')}
                      </label>
                      <select
                        value={formData.commune}
                        onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {communesSetif.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'كلمة المرور (Mot de passe) *' : 'Mot de passe *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirmer mot de passe *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <Link href="/login" className="text-xs text-slate-500 hover:text-emerald-700 font-bold">
                      {language === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول ←' : 'Déjà un compte ? Se connecter →'}
                    </Link>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      {role === 'PHARMACY'
                        ? (language === 'ar' ? 'المتابعة لبيانات الصيدلية ←' : 'Suivant (Agrément Officine) →')
                        : role === 'DOCTOR'
                        ? (language === 'ar' ? 'المتابعة للاعتماد الطبي ←' : 'Suivant (Agrément) →')
                        : (language === 'ar' ? 'المتابعة للبيانات الحيوية ←' : 'Suivant (Constantes 3D) →')}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Vital Health Data (Patient) / Doctor Data / Pharmacy Data */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  {role === 'PATIENT' ? (
                    <>
                      <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs space-y-1">
                        <strong className="text-emerald-950 font-bold flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-700" />
                          <span>بيانات توليد البطاقة الصحية الذكية 3D (SOS Smart Card)</span>
                        </strong>
                        <p>
                          {language === 'ar'
                            ? 'هذه المعلومات الحيوية ضرورية لطواقم الإسعاف والحماية المدنية (14) عند التدخل السريع.'
                            : 'Ces informations vitales sont transmises aux équipes de la Protection Civile (14) en cas d’urgence vitale.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'ar' ? 'فصيلة الدم (Groupe Sanguin) *' : 'Groupe Sanguin *'}
                          </label>
                          <select
                            value={formData.bloodGroup}
                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-red-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            {bloodGroups.map((bg) => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'ar' ? 'تاريخ الميلاد *' : 'Date de Naissance *'}
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'ar' ? 'الجنس (Sexe) *' : 'Sexe *'}
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="M">{language === 'ar' ? 'ذكر (Masculin)' : 'Masculin'}</option>
                            <option value="F">{language === 'ar' ? 'أنثى (Féminin)' : 'Féminin'}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ar' ? 'الحساسية القاتلة أو الدوائية (Allergies Sévères)' : 'Allergies sévères connues'}
                        </label>
                        <input
                          type="text"
                          value={formData.allergies}
                          onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                          placeholder="مثال: البنسلين (Pénicilline)، مكسرات، أسبرين..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ar' ? 'الأمراض المزمنة إن وجدت (Maladies Chroniques)' : 'Pathologies chroniques'}
                        </label>
                        <input
                          type="text"
                          value={formData.chronicDiseases}
                          onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })}
                          placeholder="مثال: ضغط الدم، السكري، الربو (Asthme)..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'ar' ? 'قريب للاتصال به في الطوارئ (Contact Urgence)' : 'Proche à contacter (Nom & Lien)'}
                          </label>
                          <input
                            type="text"
                            value={formData.emergencyContactName}
                            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                            placeholder="الأم / الزوج / الأخ..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'ar' ? 'رقم هاتف القريب للطوارئ' : 'N° Téléphone du proche'}
                          </label>
                          <input
                            type="tel"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                            placeholder="0661 XX XX XX"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </>
                  ) : role === 'DOCTOR' ? (
                    /* DOCTOR CREDENTIALS */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ar' ? 'رقم الاعتماد لدى عمادة الأطباء (N° Ordre des Médecins) *' : 'N° Agrément Conseil de l’Ordre *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          placeholder="DOC-SETIF-2025-XXXX"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ar' ? 'التخصص الطبي (Spécialité) *' : 'Spécialité Médicale *'}
                        </label>
                        <select
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="طبيب عام (Médecine Générale)">طبيب عام (Médecine Générale)</option>
                          <option value="أمراض القلب (Cardiologie)">أمراض القلب (Cardiologie)</option>
                          <option value="طب الأطفال (Pédiatrie)">طب الأطفال (Pédiatrie)</option>
                          <option value="الغدد والسكري (Endocrinologie)">الغدد والسكري (Endocrinologie)</option>
                          <option value="أمراض الرئة والربو (Pneumologie)">أمراض الرئة والربو (Pneumologie)</option>
                          <option value="طب العيون (Ophtalmologie)">طب العيون (Ophtalmologie)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ar' ? 'عنوان العيادة الطبية (Adresse Cabinet / Clinique)' : 'Adresse de consultation'}
                        </label>
                        <input
                          type="text"
                          value={formData.clinicAddress}
                          onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                          placeholder="حي 1014 مسكن، سطيف"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    /* PHARMACY CREDENTIALS */
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs space-y-1">
                        <strong className="text-emerald-950 font-bold flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-emerald-700" />
                          <span>اعتماد الصيدلية والربط بالرادار الولائي بسطيف</span>
                        </strong>
                        <p>
                          {language === 'ar'
                            ? 'يتم إدراج صيدليتكم تلقائياً في خريطة رادار صحتي لتمكين المواطنين والأطباء من البحث عن مخزون الأدوية الحيوية.'
                            : 'Votre officine sera indexée sur le radar Sihati pour faciliter la localisation des médicaments vitaux par les patients.'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ar' ? 'اسم الصيدلية التجاري (Nom de l’Officine) *' : 'Nom commercial de l’officine *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.pharmacyName}
                          onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                          placeholder={language === 'ar' ? 'مثال: صيدلية الهضاب / صيدلية النور' : 'Ex: Pharmacie Centrale / El Hidhab'}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'ar' ? 'رقم رخصة الاعتماد (N° d’Agrément DSP) *' : 'N° Agrément DSP / Ministère *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.pharmacyLicense}
                            onChange={(e) => setFormData({ ...formData, pharmacyLicense: e.target.value })}
                            placeholder="PHARM-SETIF-2024-0089"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {language === 'ar' ? 'هاتف الصيدلية الثابت / المباشر' : 'Tél. direct de l’officine'}
                          </label>
                          <input
                            type="tel"
                            value={formData.pharmacyPhone}
                            onChange={(e) => setFormData({ ...formData, pharmacyPhone: e.target.value })}
                            placeholder="036 84 12 55"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {language === 'ar' ? 'العنوان الدقيق للصيدلية (Adresse d’officine) *' : 'Adresse précise de l’officine *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.pharmacyAddress}
                          onChange={(e) => setFormData({ ...formData, pharmacyAddress: e.target.value })}
                          placeholder="شارع 8 ماي 1945، بالقرب من عين الفوارة، سطيف"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      {/* Night Guard Checkbox */}
                      <label className="flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={formData.isNightGuard}
                          onChange={(e) => setFormData({ ...formData, isNightGuard: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Moon className="w-3.5 h-3.5 text-amber-500" />
                            <span>{language === 'ar' ? 'خدمة الحراسة والمناوبة الليلية (Service de Garde de Nuit)' : 'Service de garde de nuit'}</span>
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {language === 'ar'
                              ? 'إظهار الصيدلية كصيدلية مناوبة ومفتوحة ليلاً للمواطنين في رادار الطوارئ.'
                              : 'Afficher l’officine active en nocturne sur le radar d’urgences de la Wilaya.'}
                          </span>
                        </div>
                      </label>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                    >
                      {language === 'ar' ? '← العودة للمعلومات الشخصية' : '← Précédent'}
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      {language === 'ar' ? 'مراجعة وتأكيد الحساب ←' : 'Vérifier & Valider →'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Summary & Final Submission */}
              {step === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {role === 'PHARMACY'
                        ? (language === 'ar' ? 'ملخص بيانات تسجيل الصيدلية :' : 'Récapitulatif Officine :')
                        : role === 'DOCTOR'
                        ? (language === 'ar' ? 'ملخص بيانات اعتماد الطبيب :' : 'Récapitulatif Médecin :')
                        : (language === 'ar' ? 'ملخص الحساب الطبي الجديد :' : 'Récapitulatif Citoyen :')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div><strong>الاسم واللقب :</strong> Dr. {formData.firstName} {formData.lastName}</div>
                      <div><strong>الهاتف :</strong> {formData.phone}</div>
                      <div>
                        <strong>الصفة :</strong>{' '}
                        {role === 'PHARMACY'
                          ? 'صيدلي معتمد (Pharmacien d’Officine)'
                          : role === 'DOCTOR'
                          ? 'طبيب ممارس (Médecin)'
                          : 'مواطن / مريض'}
                      </div>
                      <div><strong>البلدية والولاية :</strong> {formData.commune}, {formData.wilaya}</div>

                      {role === 'PHARMACY' && (
                        <>
                          <div><strong>اسم الصيدلية :</strong> {formData.pharmacyName || `صيدلية ${formData.lastName}`}</div>
                          <div><strong>رقم الاعتماد :</strong> {formData.pharmacyLicense || 'PHARM-SETIF-AUTO'}</div>
                          <div className="col-span-2">
                            <strong>الحراسة الليلية :</strong>{' '}
                            <span className={formData.isNightGuard ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                              {formData.isNightGuard ? '🌙 نعم (صيدلية مناوبة ليلية معتمدة)' : 'توقيت نهاري عادي'}
                            </span>
                          </div>
                        </>
                      )}

                      {role === 'DOCTOR' && (
                        <>
                          <div><strong>التخصص :</strong> {formData.specialty}</div>
                          <div><strong>رقم العمادة :</strong> {formData.licenseNumber}</div>
                        </>
                      )}

                      {role === 'PATIENT' && (
                        <>
                          <div><strong>فصيلة الدم :</strong> <span className="font-black text-red-600">{formData.bloodGroup}</span></div>
                          <div><strong>الحساسية :</strong> {formData.allergies || 'لا توجد'}</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Regulatory Consent (Loi 18-07) */}
                  <label className="flex items-start gap-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      {language === 'ar'
                        ? 'أوافق صراحة على إنشاء الحساب المهني/الصحي ومعالجة البيانات وفق أحكام القانون الجزائري رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي وقواعد أخلاقيات مهنة الصيدلة والطب.'
                        : 'Je consens expressément à la création de ce compte et au traitement des données conformément à la Loi algérienne 18-07 relative à la protection des données à caractère personnel.'}
                    </span>
                  </label>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                    >
                      {language === 'ar' ? '← تعديل البيانات' : '← Modifier'}
                    </button>

                    <button
                      type="submit"
                      disabled={loading || !acceptTerms}
                      className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-100" />
                      <span>
                        {loading
                          ? (language === 'ar' ? 'جاري إنشاء الحساب والتفعيل...' : 'Création en cours...')
                          : role === 'PHARMACY'
                          ? (language === 'ar' ? 'تأكيد تسجيل الصيدلية والربط بالرادار' : 'Valider & Activer mon Officine')
                          : role === 'DOCTOR'
                          ? (language === 'ar' ? 'تأكيد التسجيل الطبي' : 'Valider Inscription Médecin')
                          : (language === 'ar' ? 'تأكيد التسجيل وتوليد البطاقة 3D' : 'Valider & Générer ma Carte 3D')}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
