'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api, { API_BASE } from '@/lib/api';
import { AuthGuard, useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import {
  printMedicalRecordPdf,
  printPrescriptionPdf,
  printLabReportPdf,
} from '@/lib/pdf-generator';
import {
  User,
  Heart,
  Activity,
  FileText,
  Calendar,
  Shield,
  AlertTriangle,
  Pill,
  Phone,
  MapPin,
  Printer,
  CheckCircle,
  Clock,
  Folder,
  Image,
  Leaf,
  ZoomIn,
  CreditCard,
  Lock,
  ExternalLink,
  Sparkles,
  Stethoscope,
  Check,
  X,
  ShieldCheck,
  Droplet,
  Scale,
  Thermometer,
  FileCheck,
  Info,
  TrendingUp,
  QrCode,
} from 'lucide-react';

// Dictionnaire de traduction trilingue professionnel
const patientI18n = {
  ar: {
    portalBadge: 'الفضاء الطبي الموحد للمريض • رعاية 360°',
    lawBadge: 'حماية المعطيات الصحية قانون 18-07 - ANPDP',
    activeConsent: 'الوصول مفعل بتفويض المريض',
    chifaCoverage: 'تغطية بطاقة الشفاء: 80% (مؤمن اجتماعي CNAS)',
    fileNumberLabel: 'رقم الملف الطبي الوطني:',
    chifaNumberLabel: 'رقم بطاقة الشفاء:',
    bornOn: 'تاريخ الميلاد:',
    ageLabel: 'سنة',
    wilayaLabel: 'الولاية:',
    phoneLabel: 'الهاتف الشخصي:',
    criticalAllergies: 'حساسيات حرجة مسجلة',
    chronicDiseases: 'أمراض مزمنة تحت المتابعة',
    btnEmergencyCard: 'بطاقتي الصحية الرقمية 3D',
    btnSosToken: 'مسح كود الطوارئ SOS',
    btnPrint: 'طباعة التقرير الطبي',
    btnBookAppt: 'حجز موعد طبي',

    // KPIs
    kpiBp: 'ضغط الدم الشرياني (TA)',
    kpiBpSub: 'الهدف العلاجي: < 130/80',
    kpiBpStatus: 'مستقر ومثالي',
    kpiPulse: 'معدل النبضات',
    kpiPulseSub: 'إيقاع جيبي منتظم',
    kpiGlucose: 'نسبة السكر على الريق',
    kpiGlucoseSub: 'طبيعي ومراقب',
    kpiBmi: 'الوزن ومؤشر الكتلة',
    kpiBmiSub: 'مؤشر كتلة طبيعي',

    // Tabs
    tabVitals: 'الملف الطبي والمؤشرات الحيوية',
    tabPrescriptions: 'الوصفات والأدوية النشطة',
    tabLabImaging: 'التحاليل المخبرية والأشعة HD',
    tabAppointments: 'المواعيد والاستشارات',
    tabSelfMed: 'العلاج الذاتي والمكملات',
    tabPrivacy: 'الخصوصية وتراخيص الوصول (18-07)',

    // Vitals Section
    vitalsHistoryTitle: 'تطور القياسات السريرية والمؤشرات الحيوية',
    vitalsHistorySub: 'متابعة دورية منتظمة بمدينة سطيف والعيادات المعتمدة',
    dateCol: 'تاريخ القياس',
    bpCol: 'الضغط (انقباضي / انبساطي)',
    pulseCol: 'النبض (BPM)',
    glucoseCol: 'السكري (g/L)',
    weightCol: 'الوزن (kg)',
    statusCol: 'التقييم السريري',
    normalTag: 'طبيعي ومثالي',
    heightLabel: 'الطول',
    weightLabel: 'الوزن',
    bmiLabel: 'مؤشر الكتلة (IMC)',
    pulseLabel: 'النبض',

    // Timeline
    timelineTitle: 'المسار الزمني للرعاية والزيارات الطبية',
    timelineSub: 'أحدث الاستشارات والفحوصات في ولاية سطيف',

    // Prescriptions Section
    activeMedsTitle: 'الأدوية الحالية الموصوفة وجدول الجرعات',
    activeMedsSub: 'أدوية قيد الاستعمال موثقة ومعتمدة من الطبيب المعالج',
    medNameCol: 'اسم الدواء والجرعة',
    medFrequencyCol: 'الجرعة ومواعيد التناول',
    medDocCol: 'الطبيب الموصي',
    medObservanceCol: 'مؤشر الالتزام',
    goodObservance: 'التزام ممتاز (100%)',
    orderAtPharmacy: 'طلب وحجز في صيدلية الحراسة (2h)',
    viewRxBtn: 'عرض تفاصيل الوصفة',
    prescriptionsListTitle: 'الأرشيف الإلكتروني للوصفات الطبية (Chifa)',
    rxHashLabel: 'البصمة الرقمية SHA-256:',
    rxDoctorLabel: 'الطبيب المعالج:',
    rxDateLabel: 'تاريخ التحرير:',
    rxStatusDelivered: 'تم الصرف بالصيدلية',
    rxStatusPending: 'صالحة للصرف الفوري',

    // Lab & Imaging
    labResultsTitle: 'نتائج التحاليل البيولوجية المخبرية',
    labResultsSub: 'مخبر التحاليل الطبية المعتمد - سطيف',
    analyteCol: 'الفحص البيولوجي',
    resultCol: 'النتيجة المقاسة',
    refCol: 'القيم المرجعية',
    interpretationCol: 'التقييم المخبري',
    normalResult: 'ضمن الحدود الطبيعية',
    imagingTitle: 'أشعة التصوير الطبي عالي الدقة (HD Viewer)',
    imagingSub: 'تقارير الأشعة السينية والإيكوغرافي مع فاحص طبي تفاعلي',
    zoomBtn: 'تكبير 100%',
    negativeDicom: 'مرشح DICOM سلبي',
    resolutionTag: 'دقة عالية: 2048 x 2048 بكسل (غير مضغوط)',

    // Appointments
    upcomingApptsTitle: 'المواعيد الطبية القادمة',
    noUpcoming: 'لا توجد مواعيد معلقة حالياً',
    pastApptsTitle: 'سجل الاستشارات والفحوصات السابقة',
    confirmedStatus: 'موعد مؤكد ومحجوز',
    completedStatus: 'استشارة مكتملة',
    cancelBtn: 'إلغاء الموعد',
    calendarBtn: 'إضافة للتقويم',

    // Self Med
    selfMedTitle: 'العلاج الذاتي والمكملات الغذائية المصرح بها',
    selfMedSub: 'فيتامينات، مكملات وأعشاب يتم تناولها بمعرفة الفريق الطبي دون تعارض مع الأدوية',
    lifestyleTitle: 'التوصيات الوقائية ونمط الحياة الصحي',
    lifestyle1: 'نظام غذائي قليل الصوديوم (حمية قليلة الملح) لحماية الشرايين.',
    lifestyle2: 'المشي اليومي المنتظم لمدة 30 إلى 45 دقيقة يومياً.',
    lifestyle3: 'شرب 1.5 إلى 2 لتر من الماء يومياً وتفادي الضغوط النفسية.',

    // Privacy & Consent
    privacyTitle: 'إدارة الموافقات وتراخيص الوصول (قانون 18-07)',
    privacySub: 'التحكم الكامل في الجهات الطبية والصحية المسموح لها بالاطلاع على ملفك الطبي',
    doctorAccessTitle: 'الأطباء والعيادات المصرح لها',
    pharmacyAccessTitle: 'الصيدليات والمخابر المصرح لها',
    revokeBtn: 'إلغاء الترخيص',
    grantBtn: 'منح ترخيص جديد',
    activeBadge: 'ترخيص نشط',
    otpModalTitle: 'الموافقة الصريحة للولوج إلى الملف الطبي',
    otpModalDesc:
      'وفقاً للقانون الجزائري رقم 18-07 المتعلق بحماية البيانات الشخصية والصحية، يتطلب فتح الملف الطبي كود التحقق السري المؤقت (OTP) المرسل إلى هاتف المريض.',
    otpTestHint: 'رمز التحقق التجريبي السريع المستلم:',
    unlockBtn: 'تأكيد الرمز وفتح الملف الطبي (لمدة ساعتين)',
    cancelOtp: 'إلغاء',
  },
  fr: {
    portalBadge: 'Espace Santé & Dossier Médical Partagé 360°',
    lawBadge: 'Protection Données de Santé Loi 18-07 - ANPDP',
    activeConsent: 'Accès Actif (Consentement Patient Explicite)',
    chifaCoverage: 'Couverture Chifa : 80% (Assuré Social CNAS)',
    fileNumberLabel: 'N° Dossier National :',
    chifaNumberLabel: 'N° Carte Chifa :',
    bornOn: 'Né le :',
    ageLabel: 'ans',
    wilayaLabel: 'Wilaya :',
    phoneLabel: 'Téléphone :',
    criticalAllergies: 'Allergies Critiques Déclarées',
    chronicDiseases: 'Affections Longue Durée (ALD)',
    btnEmergencyCard: 'Ma Carte 3D Numérique',
    btnSosToken: 'Scanner QR SOS',
    btnPrint: 'Imprimer Dossier Médical',
    btnBookAppt: 'Nouveau Rendez-vous',

    kpiBp: 'Tension Artérielle (TA)',
    kpiBpSub: 'Objectif : < 130/80 mmHg',
    kpiBpStatus: 'Parfaitement Contrôlée',
    kpiPulse: 'Fréquence Cardiaque',
    kpiPulseSub: 'Rythme sinusal régulier',
    kpiGlucose: 'Glycémie à Jeun',
    kpiGlucoseSub: 'Contrôle à jeun stable',
    kpiBmi: 'Poids & Indice Corporel',
    kpiBmiSub: 'Poids d’équilibre optimal',

    tabVitals: 'Constantes & Historique Clinique',
    tabPrescriptions: 'Ordonnances & Traitements Actifs',
    tabLabImaging: 'Analyses & Imagerie HD',
    tabAppointments: 'Mes Rendez-vous Médicaux',
    tabSelfMed: 'Automédication & Bien-être',
    tabPrivacy: 'Consentements & Loi 18-07',

    vitalsHistoryTitle: 'Historique des Constantes & Paramètres Vitaux',
    vitalsHistorySub: 'Suivi régulier au cabinet médical et bilans à Sétif',
    dateCol: 'Date de Mesure',
    bpCol: 'Tension (Syst / Diast)',
    pulseCol: 'Pouls (BPM)',
    glucoseCol: 'Glycémie (g/L)',
    weightCol: 'Poids (kg)',
    statusCol: 'Statut Médical',
    normalTag: 'Normal / Stable',
    heightLabel: 'Taille',
    weightLabel: 'Poids',
    bmiLabel: 'Indice IMC',
    pulseLabel: 'Pouls',

    timelineTitle: 'Parcours de Soins Chronologique',
    timelineSub: 'Historique des actes médicaux et consultations à Sétif',

    activeMedsTitle: 'Traitements en Cours & Posologie',
    activeMedsSub: 'Médicaments prescrits et observés au quotidien',
    medNameCol: 'Médicament & Dosage',
    medFrequencyCol: 'Posologie & Horaires',
    medDocCol: 'Médecin Prescripteur',
    medObservanceCol: 'Observance Thérapeutique',
    goodObservance: 'Excellente (100%)',
    orderAtPharmacy: 'Click & Reserve en Pharmacie de Garde (2h)',
    viewRxBtn: 'Voir l’Ordonnance',
    prescriptionsListTitle: 'Historique des Ordonnances Électroniques',
    rxHashLabel: 'Empreinte Sécurisée SHA-256 :',
    rxDoctorLabel: 'Médecin :',
    rxDateLabel: 'Date :',
    rxStatusDelivered: 'Délivrée en Officine',
    rxStatusPending: 'Active & Valide',

    labResultsTitle: 'Résultats des Examens Biologiques',
    labResultsSub: 'Laboratoire d’Analyses Médicales El Baraka - Sétif',
    analyteCol: 'Analyse Biologique',
    resultCol: 'Valeur Mesurée',
    refCol: 'Valeurs de Référence',
    interpretationCol: 'Interprétation',
    normalResult: 'Valeur Normale',
    imagingTitle: 'Imagerie Médicale Haute Définition (Viewer DICOM)',
    imagingSub: 'Clichés radiologiques et échographies intégrés',
    zoomBtn: 'Zoom 100%',
    negativeDicom: 'Filtre Négatif DICOM',
    resolutionTag: 'Résolution : 2048 x 2048 px (Non compressé)',

    upcomingApptsTitle: 'Rendez-vous à Venir',
    noUpcoming: 'Aucun rendez-vous en attente',
    pastApptsTitle: 'Historique des Consultations',
    confirmedStatus: 'Confirmé au Cabinet',
    completedStatus: 'Consultation Effectuée',
    cancelBtn: 'Annuler',
    calendarBtn: 'Ajouter au Calendrier',

    selfMedTitle: 'Automédication & Produits de Santé Déclarés',
    selfMedSub: 'Compléments alimentaires et phytothérapie suivis par l’équipe soignante',
    lifestyleTitle: 'Recommandations & Hygiène de Vie',
    lifestyle1: 'Régime hyposodé (pauvre en sel) pour préserver le système cardiovasculaire.',
    lifestyle2: 'Activité physique modérée (marche quotidienne de 30 à 45 minutes).',
    lifestyle3: 'Hydratation régulière (1,5 L d’eau) et limitation des sources de stress.',

    privacyTitle: 'Gestion des Consentements & Loi 18-07 (ANPDP)',
    privacySub: 'Contrôlez quels professionnels de santé ont accès à votre dossier médical partagé',
    doctorAccessTitle: 'Médecins & Cabinets Autorisés',
    pharmacyAccessTitle: 'Pharmacies & Laboratoires Autorisés',
    revokeBtn: 'Révoquer l’Accès',
    grantBtn: 'Autoriser un Nouveau Praticien',
    activeBadge: 'Autorisation Active',
    otpModalTitle: 'Consentement Médical Explicite Requis',
    otpModalDesc:
      'Conformément à la Loi Algérienne 18-07 sur la protection des données de santé à caractère personnel, l’accès nécessite le code OTP temporaire généré pour le patient.',
    otpTestHint: 'Code OTP de démonstration reçu :',
    unlockBtn: 'Déverrouiller le Dossier (2 heures)',
    cancelOtp: 'Annuler',
  },
  en: {
    portalBadge: 'Unified Patient Health Portal • 360° EHR',
    lawBadge: 'Health Data Protection Law 18-07 - ANPDP',
    activeConsent: 'Active Access (Explicit Patient Consent)',
    chifaCoverage: 'Chifa Insurance Coverage: 80% (CNAS Insured)',
    fileNumberLabel: 'National EHR ID:',
    chifaNumberLabel: 'Chifa Card ID:',
    bornOn: 'Born on:',
    ageLabel: 'years old',
    wilayaLabel: 'Wilaya:',
    phoneLabel: 'Phone:',
    criticalAllergies: 'Recorded Critical Allergies',
    chronicDiseases: 'Chronic Health Conditions',
    btnEmergencyCard: '3D Digital Health Card',
    btnSosToken: 'Scan SOS QR Code',
    btnPrint: 'Print Medical Record',
    btnBookAppt: 'Book Appointment',

    kpiBp: 'Blood Pressure (BP)',
    kpiBpSub: 'Target: < 130/80 mmHg',
    kpiBpStatus: 'Optimally Controlled',
    kpiPulse: 'Pulse Rate',
    kpiPulseSub: 'Regular sinus rhythm',
    kpiGlucose: 'Fasting Blood Sugar',
    kpiGlucoseSub: 'Normal fasting level',
    kpiBmi: 'Weight & Body Mass',
    kpiBmiSub: 'Healthy BMI range',

    tabVitals: 'Vitals & Clinical Trends',
    tabPrescriptions: 'Prescriptions & Active Meds',
    tabLabImaging: 'Lab Tests & HD Imaging',
    tabAppointments: 'Appointments & Consultations',
    tabSelfMed: 'Self-Care & Supplements',
    tabPrivacy: 'Privacy & Law 18-07 Consents',

    vitalsHistoryTitle: 'Clinical Parameters & Vital Trends',
    vitalsHistorySub: 'Regular monitoring at Sétif medical practices and clinics',
    dateCol: 'Measurement Date',
    bpCol: 'Blood Pressure (Sys/Dia)',
    pulseCol: 'Pulse (BPM)',
    glucoseCol: 'Glucose (g/L)',
    weightCol: 'Weight (kg)',
    statusCol: 'Clinical Status',
    normalTag: 'Normal / Stable',
    heightLabel: 'Height',
    weightLabel: 'Weight',
    bmiLabel: 'BMI Score',
    pulseLabel: 'Pulse',

    timelineTitle: 'Chronological Care Pathway',
    timelineSub: 'Recent clinical consultations and examinations in Sétif',

    activeMedsTitle: 'Current Medications & Dosage Schedule',
    activeMedsSub: 'Doctor-prescribed daily treatments and adherence',
    medNameCol: 'Medication & Dose',
    medFrequencyCol: 'Dosage & Schedule',
    medDocCol: 'Prescribing Doctor',
    medObservanceCol: 'Adherence',
    goodObservance: 'Optimal (100%)',
    orderAtPharmacy: 'Click & Reserve at Night Guard Pharmacy (2h)',
    viewRxBtn: 'View Prescription',
    prescriptionsListTitle: 'Electronic Prescription Archive (Chifa)',
    rxHashLabel: 'Secure SHA-256 Hash:',
    rxDoctorLabel: 'Doctor:',
    rxDateLabel: 'Date:',
    rxStatusDelivered: 'Dispensed at Pharmacy',
    rxStatusPending: 'Active & Ready for Dispensing',

    labResultsTitle: 'Laboratory Blood & Bio Results',
    labResultsSub: 'El Baraka Certified Medical Laboratory - Sétif',
    analyteCol: 'Biological Test',
    resultCol: 'Measured Value',
    refCol: 'Reference Range',
    interpretationCol: 'Clinical Assessment',
    normalResult: 'Normal Range',
    imagingTitle: 'High-Definition Medical Imaging (DICOM Viewer)',
    imagingSub: 'Chest X-rays and echocardiograms with interactive viewer',
    zoomBtn: 'Zoom 100%',
    negativeDicom: 'Negative DICOM Filter',
    resolutionTag: 'Resolution: 2048 x 2048 px (Uncompressed)',

    upcomingApptsTitle: 'Upcoming Appointments',
    noUpcoming: 'No pending appointments',
    pastApptsTitle: 'Consultation History',
    confirmedStatus: 'Confirmed at Clinic',
    completedStatus: 'Completed Consultation',
    cancelBtn: 'Cancel',
    calendarBtn: 'Add to Calendar',

    selfMedTitle: 'Declared Supplements & OTC Products',
    selfMedSub: 'Vitamins and phytotherapy supervised by your healthcare team',
    lifestyleTitle: 'Lifestyle & Preventive Guidelines',
    lifestyle1: 'Low-sodium diet to protect cardiovascular health.',
    lifestyle2: 'Moderate daily exercise (30 to 45 min walk).',
    lifestyle3: 'Stay hydrated (1.5 L daily) and manage stress levels.',

    privacyTitle: 'Consent Management & Law 18-07 (ANPDP)',
    privacySub: 'Full control over which healthcare providers can access your health record',
    doctorAccessTitle: 'Authorized Doctors & Clinics',
    pharmacyAccessTitle: 'Authorized Pharmacies & Labs',
    revokeBtn: 'Revoke Access',
    grantBtn: 'Grant New Access',
    activeBadge: 'Active Consent',
    otpModalTitle: 'Explicit Medical Consent Required',
    otpModalDesc:
      'In accordance with Algerian Law 18-07 on health data protection, viewing the complete medical record requires the temporary OTP code sent to the patient.',
    otpTestHint: 'Instant Demo OTP code received:',
    unlockBtn: 'Unlock Medical Record (2 hours)',
    cancelOtp: 'Cancel',
  },
};

export default function AdvancedPatientRecordPage() {
  return (
    <AuthGuard allowedRoles={['DOCTOR', 'ADMIN', 'PATIENT']}>
      <PatientRecordContent />
    </AuthGuard>
  );
}

function PatientRecordContent() {
  const params = useParams();
  const patientId = (params?.id as string) || '1';

  const { user } = useAuth();
  const { language, dir } = useLanguage();
  const t = patientI18n[language as keyof typeof patientI18n] || patientI18n.ar;

  const [hasAccess, setHasAccess] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('842915');
  const [activeTab, setActiveTab] = useState<'vitals' | 'prescriptions' | 'labImaging' | 'appointments' | 'selfMed' | 'privacy'>('vitals');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Données médicales complètes du patient
  const patient = {
    id: 1,
    name: dir === 'rtl' ? 'محمد أمين بن علي' : 'Mohamed Amine BENALI',
    fullNameEn: 'Mohamed Amine BENALI',
    age: 28,
    dateOfBirth: '14/05/1996',
    gender: dir === 'rtl' ? 'ذكر' : 'Masculin',
    bloodGroup: 'O+',
    weight: 72,
    height: 175,
    bmi: 23.5,
    wilaya: dir === 'rtl' ? 'سطيف (19)' : 'Sétif (19)',
    address: dir === 'rtl' ? 'حي 1000 مسكن، سطيف' : 'Cité 1000 Logements, Sétif',
    phone: '0555 12 34 56',
    fileNumber: 'EHR-2024-SETIF-784512',
    chifaNumber: '1996 0519 2800 4512',
    allergies: [
      {
        name: dir === 'rtl' ? 'بنسلين (Pénicilline)' : 'Pénicilline',
        severity: dir === 'rtl' ? 'حرجة جداً / صدمة تحسسية' : 'Critique / Choc anaphylactique',
        date: '2019',
      },
      {
        name: dir === 'rtl' ? 'الفول السوداني والمكسرات (Arachides)' : 'Arachides & Noix',
        severity: dir === 'rtl' ? 'شديدة (œdème)' : 'Sévère (Œdème de Quincke)',
        date: '2021',
      },
    ],
    chronicDiseases: [
      {
        name: dir === 'rtl' ? 'ارتفاع ضغط الدم الشرياني الأولي (HTA)' : 'Hypertension Artérielle Essentielle (HTA)',
        since: '2023',
        status: dir === 'rtl' ? 'مستقر ومثالي بالعلاج' : 'Parfaitement stabilisé',
      },
    ],
    vitalsHistory: [
      { date: '15/05/2024', bp: '135/85', pulse: 76, glucose: '0.98', weight: 72.5 },
      { date: '20/06/2024', bp: '130/82', pulse: 74, glucose: '0.95', weight: 72.0 },
      { date: '12/08/2024', bp: '128/80', pulse: 72, glucose: '0.94', weight: 71.8 },
      { date: '29/09/2026', bp: '124/78', pulse: 70, glucose: '0.92', weight: 72.0 },
    ],
    timeline: [
      {
        date: '29/09/2026',
        title: dir === 'rtl' ? 'استشارة متابعة ضغط الدم ومراقبة دورية' : 'Consultation de suivi HTA & Contrôle',
        doctor: dir === 'rtl' ? 'د. محمد علي (طبيب عام - سطيف)' : 'Dr. Mohamed ALI (Médecin Généraliste - Sétif)',
        notes:
          dir === 'rtl'
            ? 'الضغط مستقر تماماً 124/78 تحت دواء فالسارتان 80 ملغ. التحاليل الكلوية سليمة والتوصية بالاستمرار في الحمية وممارسة الرياضة.'
            : 'Tension bien stabilisée sous Valsartan 80mg. Bilan rénal et ionogramme normaux. Poursuite des règles hygiéno-diététiques.',
      },
      {
        date: '10/08/2026',
        title: dir === 'rtl' ? 'تحليل بيولوجي شامل (NFS، وظائف الكلى، الدهون)' : 'Bilan Biologique Complet (NFS, Urée, Créat, Lipides)',
        doctor: dir === 'rtl' ? 'مخبر البركة للتحاليل الطبية (سطيف)' : 'Laboratoire d’Analyses Médicales El Baraka (Sétif)',
        notes:
          dir === 'rtl'
            ? 'تصفية الكرياتينين ممتازة (105 مل/دقيقة)، الكوليسترول الكلي 1.85 غ/ل، السكر التراكمي في الحدود الطبيعية.'
            : 'Clairance normale (105 ml/min). Cholestérol total 1.85 g/L, Glycémie 0.94 g/L.',
      },
      {
        date: '15/05/2026',
        title: dir === 'rtl' ? 'فحص القلب والأشعة: إيكو دوبلر وتخطيط ECG' : 'Bilan d’imagerie : Échographie Cardiaque & ECG',
        doctor: dir === 'rtl' ? 'د. سارة أحمد (أخصائية أمراض القلب - العلمة)' : 'Dr. Sara AHMED (Cardiologue - El Eulma)',
        notes:
          dir === 'rtl'
            ? 'وظيفة البطين الأيسر طبيعية (FE 65%). لا يوجد تضخم في عضلة القلب، الشرايين التاجية سليمة.'
            : 'Fonction ventriculaire gauche normale (FE 65%). Pas d’hypertrophie ventriculaire. Tracé ECG régulier.',
      },
    ],
    activePrescriptions: [
      {
        id: 1,
        drug: 'SARTEG (Valsartan) 80 mg',
        form: dir === 'rtl' ? 'أقراص مغلفة' : 'Comprimés pelliculés',
        dosage: dir === 'rtl' ? 'قرص واحد صباحاً مع وجبة الإفطار' : '1 comprimé le matin au petit-déjeuner',
        duration: dir === 'rtl' ? 'علاج مستمر (3 أشهر قابلة للتجديد)' : 'Traitement continu (3 mois renouvelable)',
        doctor: 'Dr. Mohamed ALI',
        observance: 100,
      },
      {
        id: 2,
        drug: 'KARDEGIC 75 mg',
        form: dir === 'rtl' ? 'أكياس مسحوق للشرب' : 'Sachets pour suspension',
        dosage: dir === 'rtl' ? 'كيس واحد يومياً بعد الغداء' : '1 sachet par jour après le déjeuner',
        duration: dir === 'rtl' ? '3 أشهر' : '3 mois',
        doctor: 'Dr. Sara AHMED',
        observance: 95,
      },
      {
        id: 3,
        drug: 'Vitamine D3 200 000 UI',
        form: dir === 'rtl' ? 'أمبولة للشرب' : 'Ampoule buvable',
        dosage: dir === 'rtl' ? 'أمبولة واحدة كل شهرين' : '1 ampoule tous les 2 mois',
        duration: dir === 'rtl' ? 'سنة واحدة' : '1 an',
        doctor: 'Dr. Mohamed ALI',
        observance: 100,
      },
    ],
    prescriptionsArchive: [
      {
        id: 'ORD-2026-SETIF-849201',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        date: '29/09/2026',
        doctor: 'Dr. Mohamed ALI (Sétif)',
        items: 'SARTEG 80mg, KARDEGIC 75mg',
        status: 'PENDING',
      },
      {
        id: 'ORD-2026-SETIF-614728',
        hash: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
        date: '15/05/2026',
        doctor: 'Dr. Sara AHMED (El Eulma)',
        items: 'ECG, Bilan lipidique, Valsartan 80mg',
        status: 'DELIVERED',
      },
    ],
    labResults: [
      { test: 'Hémoglobine (NFS)', value: '14.8 g/dL', ref: '13.5 - 17.5 g/dL', status: 'OK' },
      { test: 'Plaquettes sanguines', value: '245 000 /mm³', ref: '150 000 - 400 000', status: 'OK' },
      { test: 'Glycémie à jeun', value: '0.92 g/L', ref: '0.70 - 1.10 g/L', status: 'OK' },
      { test: 'Créatinine sérique', value: '8.4 mg/L', ref: '7.0 - 12.0 mg/L', status: 'OK' },
      { test: 'Clairance rénale (MDRD)', value: '105 mL/min', ref: '> 90 mL/min', status: 'OK' },
      { test: 'Cholestérol Total', value: '1.85 g/L', ref: '< 2.00 g/L', status: 'OK' },
      { test: 'Triglycérides', value: '1.15 g/L', ref: '< 1.50 g/L', status: 'OK' },
    ],
    appointments: [
      {
        id: 1,
        doctor: 'Dr. Mohamed ALI',
        specialty: dir === 'rtl' ? 'الطب العام والمتابعة الدورية' : 'Médecine Générale & Suivi',
        clinic: dir === 'rtl' ? 'عيادة الأمل، شارع 8 ماي 1945، سطيف' : 'Cabinet El Amal, Av. 8 Mai 1945, Sétif',
        date: '15/10/2026',
        time: '10:30',
        status: 'CONFIRMED',
      },
      {
        id: 2,
        doctor: 'Dr. Sara AHMED',
        specialty: dir === 'rtl' ? 'أمراض القلب والشرايين' : 'Cardiologie & Échographie',
        clinic: dir === 'rtl' ? 'المركز الطبي النور، العلمة، سطيف' : 'Centre Médical En-Nour, El Eulma',
        date: '20/11/2026',
        time: '14:00',
        status: 'CONFIRMED',
      },
    ],
    selfMedications: [
      {
        product: dir === 'rtl' ? 'فيتامين C مع الزنك 1000 ملغ' : 'Vitamine C + Zinc 1000mg',
        type: dir === 'rtl' ? 'مكمل غذائي مناعي' : 'Complément alimentaire',
        reason: dir === 'rtl' ? 'الوقاية من الإرهاق الموسمي ونزلات البرد' : 'Prévention de la fatigue',
        frequency: dir === 'rtl' ? 'قرص فوار واحد صباحاً' : '1 comprimé effervescent le matin',
      },
      {
        product: dir === 'rtl' ? 'مستخلص البابونج والزنجبيل الطبيعي' : 'Infusion Camomille & Gingembre',
        type: dir === 'rtl' ? 'طب الأعشاب الطبيعي' : 'Phytothérapie traditionnelle',
        reason: dir === 'rtl' ? 'تحسين الهضم والاسترخاء الليلي' : 'Digestion & Sommeil',
        frequency: dir === 'rtl' ? 'كوب دافئ مساءً قبل النوم' : '1 tasse le soir avant le coucher',
      },
    ],
    authorizedPractitioners: [
      {
        id: 1,
        name: 'Dr. Mohamed ALI',
        role: dir === 'rtl' ? 'طبيب عام معالج - سطيف' : 'Médecin Généraliste - Sétif',
        grantedAt: '12/01/2024',
        type: 'DOCTOR',
      },
      {
        id: 2,
        name: 'Dr. Sara AHMED',
        role: dir === 'rtl' ? 'طبيبة قلب - العلمة' : 'Cardiologue - El Eulma',
        grantedAt: '15/05/2026',
        type: 'DOCTOR',
      },
      {
        id: 3,
        name: 'Pharmacie Centrale El Hidhab (Sétif)',
        role: dir === 'rtl' ? 'صيدلية حراسة معتمدة Chifa' : 'Officine Agréée Chifa',
        grantedAt: '20/06/2026',
        type: 'PHARMACY',
      },
    ],
  };

  useEffect(() => {
    // Vérification du consentement
    api
      .get(`/consents/check?patientId=${patientId}`)
      .then((res) => {
        if (res.data?.hasConsent) {
          setHasAccess(true);
        }
      })
      .catch(() => {
        setHasAccess(true);
      });

    // Connexion SSE Temps Réel pour le suivi des commandes et alertes santé
    let es: EventSource | null = null;
    try {
      es = new EventSource(`${API_BASE}/notifications/stream?role=PATIENT`);
      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'ORDER_STATUS_CHANGED') {
            showToast(
              dir === 'rtl'
                ? `🔔 تحديث حالة طلبيتك بالصيدلية: ${parsed.data?.status || 'جاهزة للاستلام'}`
                : `🔔 Statut de votre commande actualisé : ${parsed.data?.status || 'Prête'}`
            );
          }
        } catch (e) {
          // parse error
        }
      };
    } catch (e) {
      // offline
    }

    return () => {
      if (es) es.close();
    };
  }, [patientId, dir]);

  const unlockWithOtp = () => {
    setHasAccess(true);
    setShowOtpModal(false);
    showToast(dir === 'rtl' ? 'تم تأكيد الرمز بنجاح وفتح الملف الطبي' : 'Accès déverrouillé avec succès');
  };

  const handlePrint = async () => {
    try {
      showToast(dir === 'rtl' ? 'جاري إنشاء وطباعة التقرير الطبي PDF...' : 'Génération du rapport PDF en cours...');
      await printMedicalRecordPdf(patient);
    } catch (e: any) {
      console.error(e);
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans" dir={dir}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 animate-slide-up text-sm font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal OTP de Consentement Patient (Loi 18-07) */}
      {showOtpModal && !hasAccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md w-full shadow-2xl text-center animate-scale-up">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">{t.otpModalTitle}</h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">{t.otpModalDesc}</p>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-mono mb-4">
              {t.otpTestHint} <strong>842915</strong>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full text-center font-mono text-2xl tracking-widest py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex gap-3">
              <button
                onClick={unlockWithOtp}
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-sm transition"
              >
                {t.unlockBtn}
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
              >
                {t.cancelOtp}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 0. NAVIGATION RETOUR À LA LISTE DES ÉTUDIANTS / PATIENTS            */}
      {/* ===================================================================== */}
      <div className="bg-emerald-900 text-white py-2.5 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <Link
            href="/patients"
            className="flex items-center gap-2 font-bold hover:text-emerald-200 transition bg-emerald-800/90 hover:bg-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-xs"
          >
            <span>{dir === 'rtl' ? '← العودة إلى قائمة وسجل الطلبة' : '← Retour à la liste des étudiants & patients'}</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-emerald-300 hidden sm:inline">
              {dir === 'rtl' ? `أنت تستعرض حالياً الملف الطبي المفصل للطالب #${patientId}` : `Consultation du dossier médical individuel (Étudiant #${patientId})`}
            </span>
            <Link
              href="/patients"
              className="text-xs bg-white text-emerald-900 font-extrabold px-3 py-1 rounded-lg hover:bg-emerald-50 transition"
            >
              {dir === 'rtl' ? 'استعراض كل الطلبة' : 'Voir la liste complète'}
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. TOP HEADER - IDENTITÉ DU PATIENT ÉPURÉE, AÉRÉE & ERGONOMIQUE      */}
      {/* ===================================================================== */}
      <header className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          {/* Ligne 1 : Nom, Groupe Sanguin, Badges Officiels et Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Côté Droit (RTL) : Avatar Groupe Sanguin & Identité */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md shadow-emerald-200 border-2 border-emerald-100">
                  {patient.bloodGroup}
                </div>
                <div
                  className="absolute -bottom-1 -end-1 bg-rose-600 text-white p-1 rounded-full border-2 border-white shadow-xs"
                  title="Groupe Sanguin O+"
                >
                  <Droplet className="w-3 h-3 fill-current" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-emerald-100/80 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>{t.portalBadge}</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[11px] font-semibold rounded-lg border border-purple-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>{t.lawBadge}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold">
                    {t.chifaCoverage}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{patient.name}</span>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </h1>
              </div>
            </div>

            {/* Côté Gauche (RTL) : Groupe d'Actions Rapides */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/appointments"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.btnBookAppt}</span>
              </Link>
              <Link
                href="/emergency-card"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>{t.btnEmergencyCard}</span>
              </Link>
              <Link
                href="/emergency/sihati-sos-token-2024-784512"
                target="_blank"
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <QrCode className="w-4 h-4 text-rose-600" />
                <span>{t.btnSosToken}</span>
              </Link>
              <button
                onClick={handlePrint}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-2xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>{t.btnPrint}</span>
              </button>
            </div>
          </div>

          {/* Ligne 2 : Fiche d'Informations d'État Civil & Sécurité Sociale (Aérée) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 text-xs">
            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500 font-medium">{t.bornOn}</div>
              <div className="font-bold text-slate-800">
                {patient.dateOfBirth} <span className="text-slate-500 font-normal">({patient.age} {t.ageLabel})</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500 font-medium">{t.wilayaLabel}</div>
              <div className="font-bold text-slate-800">{patient.wilaya} (سطيف المركز)</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500 font-medium">{t.phoneLabel}</div>
              <div className="font-bold font-mono text-slate-800">{patient.phone}</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500 font-medium">{t.fileNumberLabel}</div>
              <div className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                {patient.fileNumber}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] text-slate-500 font-medium">{t.chifaNumberLabel}</div>
              <div className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                {patient.chifaNumber}
              </div>
            </div>
          </div>

          {/* Ligne 3 : Bandeau des Alertes Médicales Critiques & Pathologies Chroniques */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-500 me-2 shrink-0">
              {dir === 'rtl' ? '⚠️ تنبيهات سريرية :' : '⚠️ Alertes Cliniques :'}
            </span>

            {patient.allergies.map((a, i) => (
              <span
                key={i}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5 shadow-2xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>
                  {dir === 'rtl' ? 'حساسية حرجة:' : 'Allergie :'} {a.name} ({a.severity})
                </span>
              </span>
            ))}

            {patient.chronicDiseases.map((c, i) => (
              <span
                key={i}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs"
              >
                <Heart className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {c.name} ({c.status})
                </span>
              </span>
            ))}
          </div>

          {/* ================================================================= */}
          {/* Ligne 4 : 4 GRANDES CARTES KPIS DES CONSTANTES VITALES ÉPURÉES    */}
          {/* ================================================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {/* TA */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>{t.kpiBp}</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                124/78 <span className="text-xs font-bold text-slate-400">mmHg</span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] text-emerald-700 font-bold">{t.kpiBpStatus}</span>
              </div>
            </div>

            {/* Pouls */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-cyan-300 transition space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>{t.kpiPulse}</span>
                <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                70 <span className="text-xs font-bold text-slate-400">bpm</span>
              </div>
              <div className="text-[11px] text-cyan-700 font-semibold pt-0.5">{t.kpiPulseSub}</div>
            </div>

            {/* Glycémie */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>{t.kpiGlucose}</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                0.92 <span className="text-xs font-bold text-slate-400">g/L</span>
              </div>
              <div className="text-[11px] text-amber-700 font-semibold pt-0.5">{t.kpiGlucoseSub}</div>
            </div>

            {/* Poids / IMC */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-300 transition space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>{t.kpiBmi}</span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                72 <span className="text-xs font-bold text-slate-400">kg</span>
                <span className="text-xs font-bold text-teal-700 ms-1.5">(IMC 23.5)</span>
              </div>
              <div className="text-[11px] text-teal-700 font-semibold pt-0.5">{t.kpiBmiSub}</div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* Ligne 5 : ONGLET DE NAVIGATION FLUIDE (SANS SCROLLBAR GRISE)       */}
          {/* ================================================================= */}
          <nav
            aria-label="Navigation des dossiers"
            className="flex gap-2 border-b border-slate-200 pt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <button
              onClick={() => setActiveTab('vitals')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'vitals'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t.tabVitals}</span>
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'prescriptions'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>{t.tabPrescriptions}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                {patient.activePrescriptions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('labImaging')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'labImaging'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>{t.tabLabImaging}</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'appointments'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t.tabAppointments}</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold">
                {patient.appointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('selfMed')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'selfMed'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>{t.tabSelfMed}</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{t.tabPrivacy}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENU PRINCIPAL PAR ONGLET */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- ONGLET 1 : CONSTANTES VITALES ET TIMELINE --- */}
        {activeTab === 'vitals' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Évolution Clinique & Graphique */}
            <div className="xl:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span>{t.vitalsHistoryTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.vitalsHistorySub}</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono font-black text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200" dir="ltr">
                    124/78 mmHg
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                    {t.kpiBpStatus}
                  </span>
                </div>
              </div>

              {/* Tableau Clinique des Mesures */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 text-start">{t.dateCol}</th>
                      <th className="py-3.5 px-4 text-start">{t.bpCol}</th>
                      <th className="py-3.5 px-4 text-start">{t.pulseCol}</th>
                      <th className="py-3.5 px-4 text-start">{t.glucoseCol}</th>
                      <th className="py-3.5 px-4 text-start">{t.weightCol}</th>
                      <th className="py-3.5 px-4 text-start">{t.statusCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {patient.vitalsHistory.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-600" dir="ltr">{v.date}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900" dir="ltr">{v.bp} mmHg</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700" dir="ltr">{v.pulse} bpm</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700" dir="ltr">{v.glucose} g/L</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700" dir="ltr">{v.weight} kg</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 inline-block">
                            {t.normalTag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rappel des 4 constantes actuelles */}
              <div className="grid grid-cols-4 gap-3 text-center pt-2">
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">{t.heightLabel}</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 font-mono" dir="ltr">{patient.height} cm</span>
                </div>
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">{t.weightLabel}</span>
                  <span className="text-base sm:text-lg font-black text-slate-900 font-mono" dir="ltr">{patient.weight} kg</span>
                </div>
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">{t.bmiLabel}</span>
                  <span className="text-base sm:text-lg font-black text-emerald-700 font-mono" dir="ltr">{patient.bmi}</span>
                </div>
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">{t.pulseLabel}</span>
                  <span className="text-base sm:text-lg font-black text-cyan-700 font-mono" dir="ltr">70 bpm</span>
                </div>
              </div>
            </div>

            {/* Timeline Chronologique du Parcours de Soins */}
            <div className="xl:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>{t.timelineTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t.timelineSub}</p>
              </div>

              <div className="relative border-s-2 border-emerald-200 ms-3 space-y-6 ps-5 pt-2">
                {patient.timeline.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -start-[27px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow"></div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {evt.date}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{evt.doctor}</p>
                    <p className="text-xs text-slate-700 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
                      {evt.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- ONGLET 2 : ORDONNANCES & MÉDICAMENTS --- */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-8">
            {/* Traitements en cours */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-emerald-600" />
                    <span>{t.activeMedsTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.activeMedsSub}</p>
                </div>
                <Link
                  href="/pharmacies-radar"
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs flex items-center gap-2 transition"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{t.orderAtPharmacy}</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {patient.activePrescriptions.map((med) => (
                  <div key={med.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {med.form}
                        </span>
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {t.goodObservance}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{med.drug}</h4>
                      <p className="text-xs text-slate-600 mt-2 font-medium">
                        <strong>{dir === 'rtl' ? 'الجرعة:' : 'Posologie :'}</strong> {med.dosage}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        <strong>{dir === 'rtl' ? 'المدة:' : 'Durée :'}</strong> {med.duration}
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        <strong>{dir === 'rtl' ? 'الطبيب:' : 'Médecin :'}</strong> {med.doctor}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200 flex gap-2">
                      <Link
                        href={`/pharmacies-radar?search=${encodeURIComponent(med.drug.split(' ')[0])}`}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition shadow-2xs"
                      >
                        {dir === 'rtl' ? 'حجز بالصيدلية' : 'Réserver'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archive des ordonnances électroniques */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>{t.prescriptionsListTitle}</span>
                </h3>
              </div>

              <div className="space-y-3">
                {patient.prescriptionsArchive.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                          {rx.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            rx.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {rx.status === 'PENDING' ? t.rxStatusPending : t.rxStatusDelivered}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-bold mt-1">
                        {t.rxDoctorLabel} <span className="font-medium text-slate-600">{rx.doctor}</span> • {t.rxDateLabel}{' '}
                        <span className="font-mono text-slate-600">{rx.date}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {dir === 'rtl' ? 'الأدوية:' : 'Médicaments :'} {rx.items}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 mt-1 truncate max-w-md">
                        {t.rxHashLabel} {rx.hash}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => printPrescriptionPdf({ ...rx, patientName: patient.name })}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        title={dir === 'rtl' ? 'فتح وطباعة الوصفة في تبويب جديد' : 'Ouvrir et imprimer dans un nouvel onglet'}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{dir === 'rtl' ? 'طباعة الوصفة (PDF)' : 'Imprimer (PDF)'}</span>
                      </button>
                      <Link
                        href={`/prescriptions/new?patientId=${patient.id}`}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.viewRxBtn}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- ONGLET 3 : ANALYSES BIOLOGIQUES ET IMAGERIE HD --- */}
        {activeTab === 'labImaging' && (
          <div className="space-y-8">
            {/* Résultats Biologiques */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span>{t.labResultsTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.labResultsSub}</p>
                </div>
                <button
                  onClick={() => printLabReportPdf(patient.labResults, patient)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{dir === 'rtl' ? 'طباعة التقرير البيولوجي (PDF)' : 'Imprimer Bilan (PDF)'}</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-start">{t.analyteCol}</th>
                      <th className="py-3 px-4 text-start">{t.resultCol}</th>
                      <th className="py-3 px-4 text-start">{t.refCol}</th>
                      <th className="py-3 px-4 text-start">{t.interpretationCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patient.labResults.map((lab, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{lab.test}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{lab.value}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{lab.ref}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{t.normalResult}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Imagerie Médicale HD */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Image className="w-5 h-5 text-emerald-600" />
                    <span>{t.imagingTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.imagingSub}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{t.zoomBtn}</span>
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
                    {t.negativeDicom}
                  </span>
                </div>
              </div>

              {/* Écran Viewer Médical Simulé */}
              <div className="bg-slate-900 rounded-3xl p-8 border-2 border-slate-800 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                    <Image className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {dir === 'rtl' ? 'صورة أشعة الصدر السينية (Thorax Face)' : 'Radiographie Pulmonaire de Face (Thorax)'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {dir === 'rtl'
                      ? 'تم الإجراء بتاريخ 15 ماي 2026 • مستشفى سطيف الجامعي CHU • مؤشر القلب طبيعي'
                      : 'Réalisée le 15 Mai 2026 • CHU Sétif • Index Cardiaque Normal'}
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] text-slate-300 font-mono">
                  {t.resolutionTag}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ONGLET 4 : RENDEZ-VOUS MÉDICAUX --- */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>{t.upcomingApptsTitle}</span>
                  </h3>
                </div>
                <Link
                  href="/appointments"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.btnBookAppt}</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.appointments.map((appt) => (
                  <div key={appt.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {t.confirmedStatus}
                        </span>
                        <h4 className="font-black text-slate-900 text-base mt-2">{appt.doctor}</h4>
                        <p className="text-xs text-slate-600 font-medium">{appt.specialty}</p>
                      </div>
                      <div className="text-end">
                        <span className="text-xs font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-slate-200 block">
                          {appt.date}
                        </span>
                        <span className="text-xs font-bold text-slate-500 block mt-1">{appt.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{appt.clinic}</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => showToast(dir === 'rtl' ? 'تمت إضافة الموعد إلى التقويم' : 'Rendez-vous ajouté')}
                        className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition text-center"
                      >
                        {t.calendarBtn}
                      </button>
                      <button
                        onClick={() => showToast(dir === 'rtl' ? 'تم إلغاء الموعد' : 'Rendez-vous annulé')}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition text-center"
                      >
                        {t.cancelBtn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- ONGLET 5 : AUTOMÉDICATION & HYGIÈNE DE VIE --- */}
        {activeTab === 'selfMed' && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-teal-600" />
                  <span>{t.selfMedTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t.selfMedSub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.selfMedications.map((item, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.product}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>{dir === 'rtl' ? 'السبب:' : 'Motif :'}</strong> {item.reason}
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">
                      <strong>{dir === 'rtl' ? 'التكرار:' : 'Fréquence :'}</strong> {item.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommandations & Hygiène de vie */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>{t.lifestyleTitle}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                  <span className="text-xl mb-2 block">🥗</span>
                  <p className="text-xs text-emerald-950 font-bold leading-relaxed">{t.lifestyle1}</p>
                </div>
                <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200">
                  <span className="text-xl mb-2 block">🚶</span>
                  <p className="text-xs text-teal-950 font-bold leading-relaxed">{t.lifestyle2}</p>
                </div>
                <div className="p-4 bg-cyan-50/70 rounded-2xl border border-cyan-200">
                  <span className="text-xl mb-2 block">💧</span>
                  <p className="text-xs text-cyan-950 font-bold leading-relaxed">{t.lifestyle3}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ONGLET 6 : CONFIDENTIALITÉ & GESTION DES CONSENTEMENTS (LOI 18-07) --- */}
        {activeTab === 'privacy' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>{t.privacyTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{t.privacySub}</p>
            </div>

            <div className="space-y-4">
              {patient.authorizedPractitioners.map((practitioner) => (
                <div
                  key={practitioner.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      {practitioner.type === 'DOCTOR' ? (
                        <Stethoscope className="w-5 h-5" />
                      ) : (
                        <Pill className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{practitioner.name}</h4>
                      <p className="text-xs text-slate-500">{practitioner.role}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dir === 'rtl' ? 'تاريخ المنح:' : 'Accordé le :'} {practitioner.grantedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200">
                      {t.activeBadge}
                    </span>
                    <button
                      onClick={() =>
                        showToast(
                          dir === 'rtl'
                            ? `تم إيقاف الترخيص الطبي لـ ${practitioner.name}`
                            : `Accès révoqué pour ${practitioner.name}`
                        )
                      }
                      className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-700 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-bold transition"
                    >
                      {t.revokeBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
