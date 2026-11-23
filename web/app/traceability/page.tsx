'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import api from '@/lib/api';
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  Thermometer,
  Truck,
  Building2,
  CheckCircle2,
  QrCode,
  FileCheck,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  Send,
  RefreshCw,
  XCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  ExternalLink,
  Snowflake,
  Lock,
  Pill,
  FileText,
  BadgeAlert,
  Flame,
} from 'lucide-react';

interface TimelineStep {
  step: string;
  location: string;
  date: string;
  actor: string;
  status: string;
  temperatureObserved?: number;
}

interface DrugTraceabilityItem {
  id: number;
  cipCode: string;
  brandName: string;
  dci: string;
  dosage: string;
  form: string;
  batchNumber: string;
  serialNumber: string;
  manufacturer: string;
  manufacturingCountry: string;
  manufacturingDate: string;
  expiryDate: string;
  coldChainRequired: boolean;
  temperatureMin: number;
  temperatureMax: number;
  currentTemperature: number;
  currentStage: string;
  currentLocation: string;
  status: 'CONFORME' | 'RECALLED' | 'QUARANTINE' | 'DISPENSED' | 'EXPIRED';
  recallReason?: string;
  recallLevel?: string;
  verificationHash: string;
  timeline: TimelineStep[];
  updatedAt: string;
}

const traceabilityI18n = {
  ar: {
    heroBadge: 'المنظومة الوطنية لتتبع وتأمين المواد الحساسة والمؤثرات العقلية • وزارة الإنتاج الصيدلاني و ANPP',
    heroTitle: 'نظام تتبع الأدوية الحساسة والمؤثرات العقلية وسلسلة التبريد (Track & Trace)',
    heroSub:
      'منظومة رقمية مشددة وفقاً للقانون 04-18 والمرسوم التنفيذي 21-196 لمراقبة مسار المؤثرات العقلية (Psychotropes)، المواد المخدرة، الأنسولين الحساس للتبريد، والتصدي للتداول غير المشروع أو الحصص المغشوشة.',
    statTotal: 'حصص حساسة تحت التتبع المشدد',
    statCompliant: 'نسبة المطابقة الصيدلانية',
    statCold: 'أدوية سلسلة التبريد المراقبة (2°C-8°C)',
    statRecalls: 'إشعارات سحب رسمية نشطة',
    searchPlaceholder: 'أدخل رقم الحصة (Lot)، الرقم التسلسلي (SN) أو رمز CIP / اسم الدواء المقنن...',
    searchBtn: 'تحقق من أصالة ومسار الدفعة',
    demoPresets: 'عينات فحص فورية للمواد الحساسة والمؤثرات العقلية :',
    presetLyrica: '🔴 ليريكا 150 ملغ (مؤثر عقلي مراقب - قانون 04-18)',
    presetTramadol: '🔴 ترامادول صيدال 50 ملغ (مسكن أفيوني - جدول ب)',
    presetLantus: '🧊 لانتوس سولوستار (أنسولين مبرد 4.8°C)',
    presetAugmentin: '🚨 أوجمنتين GSK (سحب حصة رسمي ANPP)',
    presetTareg: '💊 تاريغ 80 ميرينال (مصروف عبر الشفاء)',
    presetDoliprane: '🟢 دوليبران 1000 صيدال (دواء عام عادي)',
    statusConforme: 'منتج أصلي معتمد ومطابق للمعايير الصيدلانية',
    statusRecalled: 'تحذير عاجل : حصة مسحوبة رسمياً من السوق بقرار وزاري',
    statusQuarantine: 'تحت الحجر التحليلي والمراقبة المشددة',
    statusDispensed: 'تم صرف الدواء للمريض بالصيدلية عبر بطاقة الشفاء والوصفة المؤمنة',
    verifyHash: 'بصمة التحقق الرقمية المشفرة (SHA-256) :',
    coldChainTitle: 'مراقبة سلسلة التبريد بالاستشعار الفوري (Cold Chain IoT)',
    coldChainSafe: 'درجة الحرارة مطابقة بدقة للمجال القانوني [2°C - 8°C]',
    coldChainAlert: 'تنبيه : اختلال في درجة حرارة الحفظ !',
    supplyChainLifeCycle: 'المسار اللوجستي ودورة الحياة الرقابية (من المصنع إلى المريض)',
    reportIssueBtn: '🚨 إبلاغ عن يقظة دوائية أو اشتباه تزييف',
    recallsSectionTitle: 'السجل الوطني لإشعارات سحب الحصص الرسمية (ANPP / DSP)',
    recallsSectionSub: 'المتابعة المباشرة للسلطات الصحية وتنبيهات الإيقاف الفوري للصرف بالصيدليات',
    reportModalTitle: 'إيداع إشعار يقظة دوائية / اشتباه تزييف أو تداول مشبوه',
    reportModalSub:
      'يتم إرسال هذا الإشعار فورياً ومباشرة إلى مفتشية الصيدلة بمديرية الصحة والسكان (DSP) ونقابة الصيادلة.',
    fullNameLabel: 'الاسم واللقب أو المؤسسة المبلّغة',
    phoneLabel: 'رقم الهاتف للتواصل',
    issueTypeLabel: 'طبيعة البلاغ الصحي',
    issueAdverse: 'أعراض جانبية غير متوقعة أو خطيرة',
    issueCounterfeit: 'اشتباه في تزوير العلبة أو القرص أو الوصفة',
    issueColdChain: 'كسر في سلسلة التبريد (أنسولين أو لقاح دافئ)',
    issueQuality: 'خلل في المظهر الخارجي أو المحلول أو التغليف',
    descLabel: 'التفاصيل الدقيقة للملاحظة أو الحادثة',
    submitReport: 'إرسال البلاغ الفوري',
    cancel: 'إلغاء',
    reportSuccess: 'تم تسجيل البلاغ بنجاح وتوجيهه إلى المفتشية الصيدلانية !',

    // Section Explicative Réglementaire (Loi 04-18 vs Médicaments Ordinaires)
    whyTitle: 'لماذا تقتصر التتبع الصارم على المواد الحساسة والمؤثرات العقلية (Drugs) وليس كافة الأدوية العادية ؟',
    whySubtitle: 'التأطير القانوني والتقني للسياسة الوطنية لليقظة الدوائية وفقاً للتشريع الجزائري',
    point1Title: '1. تطبيق القانون 04-18 والمرسوم التنفيذي 21-196 (المؤثرات العقلية والمسكنات المركزية)',
    point1Desc:
      'تفرض الدولة الجزائرية مساراً تسلسلياً رقمياً مشدداً على المواد ذات التأثير النفسي والعقلي (مثل البريغابالين، الترامادول، المورفين، والمهدئات) لمنع تحويلها، تزوير الوصفات، أو تداولها في السوق الموازية. كل علبة تحمل رقماً تسلسلياً فريداً مسجلاً في السجل الرقمي بالصيدلية.',
    point2Title: '2. ضمان حيوية الأدوية البيولوجية وسلسلة التبريد (2°C - 8°C)',
    point2Desc:
      'الأنسولين، اللقاحات، وأدوية السرطان البيولوجية تفقد فاعليتها وتتحول إلى مواد سامة أو عديمة الجدوى عند أي انقطاع حراري. لذلك تُزود شاحنات وثلاجات الصيدليات بمستشعرات IoT لاسلكية تسجل الحرارة كل دقيقة.',
    point3Title: '3. إدارة إشعارات السحب الفوري (Pharmacovigilance & Recall)',
    point3Desc:
      'في حال صدور قرار من الوكالة الوطنية للمواد الصيدلانية (ANPP) بسحب حصة معينة، يُصدر النظام أمراً إلكترونياً فورياً يمنع قراءة باركود الدواء في جميع برمجيات الشفاء عبر صيدليات الوطن لمنع بيعه تماماً.',
    point4Title: '4. لماذا لا تشمل المنظومة الأدوية البسيطة الشائعة (مثل الباراسيتامول العادي) ؟',
    point4Desc:
      'الأدوية البسيطة الشائعة (مسكنات عادية، مطهرات، فيتامينات) لا تشكل خطراً إدمانياً ولا حساسية حرارية حرجة. فرض التتبع التسلسلي الفردي والرقابة المشددة عليها يرفع التكاليف اللوجستية دون أي فائدة صحية مضافة، في حين يركز النظام طاقته وموارده الرقابية على حماية المجتمع من الأدوية الخطرة والحساسة.',

    // Labels de données
    batchNumberLabel: 'رقم الحصة (Numéro de Lot)',
    serialNumberLabel: 'الرقم التسلسلي الفريد (Serial Number)',
    manufacturerLabel: 'المصنع المعتمد',
    currentLocationLabel: 'الموقع والحالة الراهنة',
    mfgDateLabel: 'تاريخ الإنتاج',
    expDateLabel: 'تاريخ نهاية الصلاحية',
    gs1Label: 'الترميز التسلسلي الموحد GS1-Datamatrix',
    tempSensorActive: 'مستشعر IOT لاسلكي متصل 24/7',
    tempRangeLabel: 'المجال الحراري القانوني المسموح :',
    ambientStandard: 'حفظ في درجة حرارة الغرفة العادية',
    ambientDesc: 'المجال : 15°C إلى 25°C (بعيداً عن الرطوبة وأشعة الشمس المباشرة)',
    recallReasonLabel: 'سبب السحب الرسمي :',
    colMed: 'اسم الدواء والجرعة',
    colLot: 'رقم الحصة',
    colMfr: 'المصنع',
    colLevel: 'مستوى الخطورة',
    colReason: 'سبب قرار السحب (ANPP)',
    colAction: 'الإجراء',
    examineBtn: 'فحص الحصة',
    noRecalls: 'لا توجد أي إشعارات سحب نشطة حالياً. كافة الحصص المتداولة مطابقة.',
  },
  fr: {
    heroBadge: 'Système National de Sérialisation & Traçabilité des Produits Sensibles & Psychotropes • ANPP',
    heroTitle: 'Traçabilité des Substances Contrôlées, Psychotropes & Chaîne du Froid',
    heroSub:
      'Dispositif réglementaire strict conformément à la Loi 04-18 et au Décret 21-196 pour le suivi des substances psychotropes, stupéfiants, insulines sous chaîne du froid et gestion immédiate des retraits de lots.',
    statTotal: 'Lots sensibles sous surveillance active',
    statCompliant: 'Taux de conformité nationale',
    statCold: 'Lots chaîne du froid télémétrés (2°C-8°C)',
    statRecalls: 'Rappels de lots actifs',
    searchPlaceholder: 'Saisissez le N° de Lot, N° de Série (SN), Code CIP ou Nom du médicament contrôlé...',
    searchBtn: 'Vérifier l’authenticité et le parcours',
    demoPresets: 'Tests rapides de substances contrôlées & chaîne du froid :',
    presetLyrica: '🔴 Lyrica 150 mg (Psychotrope contrôlé - Loi 04-18)',
    presetTramadol: '🔴 Tramadol SAIDAL 50 mg (Opioïde Tableau B)',
    presetLantus: '🧊 Lantus SoloStar (Insuline chaîne du froid 4.8°C)',
    presetAugmentin: '🚨 Augmentin GSK (Rappel de lot officiel ANPP)',
    presetTareg: '💊 Tareg 80 Merinal (Délivré sous Chifa)',
    presetDoliprane: '🟢 Doliprane 1000 SAIDAL (Médicament courant)',
    statusConforme: 'PRODUIT CONFORME & AUTHENTIQUE',
    statusRecalled: 'ALERTE : LOT FAISANT L’OBJET D’UN RETRAIT OFFICIEL',
    statusQuarantine: 'LOT PLACÉ EN QUARANTAINE ANALYTIQUE',
    statusDispensed: 'MÉDICAMENT DÉLIVRÉ AU COMPTOIR (CHIFA & ORDONNANCE SÉCURISÉE)',
    verifyHash: 'Empreinte Cryptographique de Traçabilité (SHA-256) :',
    coldChainTitle: 'Télémétrie en Temps Réel de la Chaîne du Froid (IoT)',
    coldChainSafe: 'Température conforme aux spécifications réglementaires [2°C - 8°C]',
    coldChainAlert: 'Alerte rupture thermique détectée !',
    supplyChainLifeCycle: 'Cycle de Vie & Traçabilité Logistique Nationale (Usine au Patient)',
    reportIssueBtn: '🚨 Signaler une anomalie ou suspicion de contrefaçon',
    recallsSectionTitle: 'Registre Officiel des Rappels de Lots (ANPP / DSP)',
    recallsSectionSub: 'Surveillance continue ANPP et alertes de blocage immédiat de délivrance',
    reportModalTitle: 'Déclaration de Pharmacovigilance & Alerte Qualité',
    reportModalSub:
      'Ce signalement est immédiatement notifié aux inspecteurs de la DSP et diffusé en temps réel aux officines.',
    fullNameLabel: 'Nom & Prénom / Établissement',
    phoneLabel: 'Numéro de téléphone',
    issueTypeLabel: 'Nature du signalement',
    issueAdverse: 'Effet indésirable inattendu ou grave',
    issueCounterfeit: 'Suspicion de contrefaçon ou falsification',
    issueColdChain: 'Rupture de chaîne du froid constatée',
    issueQuality: 'Défaut physique, coloration ou emballage',
    descLabel: 'Description détaillée de l’incident',
    submitReport: 'Transmettre le signalement',
    cancel: 'Annuler',
    reportSuccess: 'Signalement transmis avec succès aux autorités sanitaires !',

    // Section Explicative
    whyTitle: 'Pourquoi la traçabilité renforcée s’applique aux substances contrôlées (Drugs) et non à tous les médicaments ordinaires ?',
    whySubtitle: 'Cadre réglementaire et technique de la pharmacovigilance en Algérie',
    point1Title: '1. Application stricte de la Loi 04-18 et du Décret 21-196 (Psychotropes & Stupéfiants)',
    point1Desc:
      'La législation impose un suivi unitaire strict des molécules à fort potentiel de dépendance ou de détournement (Prégabaline, Tramadol, Morphine, Benzodiazépines). Chaque boîte possède un identifiant sérialisé consigné sur les registres spéciaux d’officine.',
    point2Title: '2. Préservation vitale de la chaîne du froid (2°C - 8°C)',
    point2Desc:
      'Les insulines et vaccins perdent leur intégrité thérapeutique en cas d’excursion thermique. Les capteurs IoT installés dans les véhicules et frigos d’officine alertent en temps réel en cas de rupture.',
    point3Title: '3. Blocage instantané lors des rappels de lots (ANPP)',
    point3Desc:
      'En cas d’alerte sanitaire officielle, le code CIP/Lot est immédiatement bloqué dans le réseau d’officines pour empêcher physiquement toute délivrance au patient.',
    point4Title: '4. Pourquoi les médicaments anodins ne sont-ils pas soumis à cette traçabilité lourde ?',
    point4Desc:
      'Les médicaments courants (antiseptiques, pansements, vitamines, paracétamol simple) ne présentent aucun risque d’accoutumance ni de toxicité critique. Imposer une sérialisation unitaire alourdirait inutilement les coûts sans bénéfice de santé publique, tandis que cibler les « drugs » sensibles garantit une sécurité optimale.',

    batchNumberLabel: 'Numéro de Lot (Batch)',
    serialNumberLabel: 'Numéro de Série Unique (SN)',
    manufacturerLabel: 'Fabricant Titulaire',
    currentLocationLabel: 'Localisation Actuelle',
    mfgDateLabel: 'Date de Fabrication',
    expDateLabel: 'Date de Péremption',
    gs1Label: 'Marquage Unitaire National GS1',
    tempSensorActive: 'CAPTEUR IOT ACTIF 24/7',
    tempRangeLabel: 'Plage réglementaire :',
    ambientStandard: 'Conservation Ambiante Standard',
    ambientDesc: 'Plage : 15°C - 25°C (À l’abri de l’humidité et du soleil)',
    recallReasonLabel: 'Motif du retrait :',
    colMed: 'Médicament',
    colLot: 'Numéro de Lot',
    colMfr: 'Fabricant',
    colLevel: 'Gravité',
    colReason: 'Motif du Retrait',
    colAction: 'Action',
    examineBtn: 'Examiner',
    noRecalls: 'Aucun rappel de lot actif enregistré actuellement.',
  },
  en: {
    heroBadge: 'National Serialization & Traceability for Controlled Substances • ANPP Algeria',
    heroTitle: 'Controlled Drugs & Cold-Chain Traceability System (Track & Trace)',
    heroSub:
      'Strict regulatory tracking system under Law 04-18 and Decree 21-196 monitoring psychotropic drugs, narcotics, cold-chain insulin, and real-time national batch recalls.',
    statTotal: 'Monitored Critical Batches',
    statCompliant: 'National Compliance Rate',
    statCold: 'Cold-Chain Batches Tracked (2°C-8°C)',
    statRecalls: 'Active Batch Recalls',
    searchPlaceholder: 'Enter Batch number, Serial (SN), CIP Code or Controlled Drug name...',
    searchBtn: 'Verify Product Authenticity',
    demoPresets: 'Quick test presets for controlled drugs & cold chain:',
    presetLyrica: '🔴 Lyrica 150mg (Controlled Psychotropic - Law 04-18)',
    presetTramadol: '🔴 Tramadol SAIDAL 50mg (Schedule B Opioid)',
    presetLantus: '🧊 Lantus SoloStar (Cold chain 4.8°C)',
    presetAugmentin: '🚨 Augmentin GSK (Official ANPP Recall)',
    presetTareg: '💊 Tareg 80 Merinal (Dispensed on Chifa)',
    presetDoliprane: '🟢 Doliprane 1000 SAIDAL (Standard Analgesic)',
    statusConforme: 'GENUINE & COMPLIANT PRODUCT',
    statusRecalled: 'WARNING: BATCH SUBJECT TO OFFICIAL RECALL',
    statusQuarantine: 'BATCH IN QUALITY QUARANTINE',
    statusDispensed: 'DISPENSED TO PATIENT (CHIFA & SECURE RX)',
    verifyHash: 'Cryptographic Integrity Fingerprint (SHA-256):',
    coldChainTitle: 'Real-time Cold Chain Sensor Telemetry (IoT)',
    coldChainSafe: 'Temperature within strict pharmaceutical specs [2°C - 8°C]',
    coldChainAlert: 'Thermal excursion alert detected!',
    supplyChainLifeCycle: 'National Supply Chain Life Cycle & Audit Trail',
    reportIssueBtn: '🚨 Report Anomaly or Counterfeit Suspicion',
    recallsSectionTitle: 'Official National Batch Recall Notices (ANPP)',
    recallsSectionSub: 'Continuous ANPP safety surveillance and instant pharmacy block alerts',
    reportModalTitle: 'Pharmacovigilance Incident & Counterfeit Report',
    reportModalSub:
      'This report is dispatched in real-time to health authorities (DSP) and pharmacies via live event broadcast.',
    fullNameLabel: 'Full Name / Organization',
    phoneLabel: 'Phone Number',
    issueTypeLabel: 'Issue Type',
    issueAdverse: 'Severe or unexpected adverse drug reaction',
    issueCounterfeit: 'Suspected counterfeit or falsified batch',
    issueColdChain: 'Cold chain break / temperature violation',
    issueQuality: 'Physical defect, color alteration, or tampering',
    descLabel: 'Detailed Incident Description',
    submitReport: 'Submit Pharmacovigilance Report',
    cancel: 'Cancel',
    reportSuccess: 'Incident ticket created and dispatched to health inspectors!',

    whyTitle: 'Why is strict track & trace enforced for controlled drugs and not for all common medications?',
    whySubtitle: 'Algerian pharmacovigilance regulatory and operational framework',
    point1Title: '1. Enforcement of Law 04-18 and Decree 21-196 (Psychotropics & Narcotics)',
    point1Desc:
      'Algerian law requires unit-level serialization and registry tracking for habit-forming substances (Pregabalin, Tramadol, Morphine, Benzodiazepines) to combat diversion, illicit trafficking, and forged prescriptions.',
    point2Title: '2. Cold-Chain Integrity for Biologics (2°C - 8°C)',
    point2Desc:
      'Insulin and vaccines degrade rapidly when subjected to temperature excursions. Continuous IoT telemetry protects patient safety from manufacturing to pharmacy storage.',
    point3Title: '3. Rapid National Recall Enforcement (ANPP)',
    point3Desc:
      'When quality deviations occur, the system locks the batch nationwide, preventing dispensing at any pharmacy terminal.',
    point4Title: '4. Why common over-the-counter drugs do not require this heavy system',
    point4Desc:
      'Common medicines (antiseptics, vitamins, simple paracetamol) have no addiction potential or extreme thermal fragility. Imposing unit-level IoT serialization would escalate logistics costs without health benefits.',

    batchNumberLabel: 'Batch Number (Lot)',
    serialNumberLabel: 'Unique Serial Number (SN)',
    manufacturerLabel: 'Licensed Manufacturer',
    currentLocationLabel: 'Current Status & Location',
    mfgDateLabel: 'Manufacturing Date',
    expDateLabel: 'Expiry Date',
    gs1Label: 'National GS1 Datamatrix Marking',
    tempSensorActive: 'ACTIVE 24/7 IOT SENSOR',
    tempRangeLabel: 'Authorized range:',
    ambientStandard: 'Standard Ambient Storage',
    ambientDesc: 'Range: 15°C - 25°C (Protected from moisture and direct sunlight)',
    recallReasonLabel: 'Official recall reason:',
    colMed: 'Medication',
    colLot: 'Batch No.',
    colMfr: 'Manufacturer',
    colLevel: 'Severity',
    colReason: 'Recall Reason',
    colAction: 'Action',
    examineBtn: 'Examine',
    noRecalls: 'No active batch recalls recorded currently.',
  },
};

export default function TraceabilityPage() {
  const { language, dir } = useLanguage();
  const currentLang = language || 'ar';
  const isRTL = dir === 'rtl' || currentLang === 'ar';
  const t = traceabilityI18n[currentLang as 'ar' | 'fr' | 'en'] || traceabilityI18n.ar;

  const [searchQuery, setSearchQuery] = useState('LOT-2026-PSY-9011');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentDrug, setCurrentDrug] = useState<DrugTraceabilityItem | null>(null);
  const [activeRecalls, setActiveRecalls] = useState<DrugTraceabilityItem[]>([]);
  const [stats, setStats] = useState({
    totalBatches: 6,
    conformBatches: 5,
    recalledBatches: 1,
    coldChainCount: 1,
    complianceRate: 83,
  });

  // Modal Report state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    batchNumber: '',
    reporterName: '',
    reporterPhone: '',
    issueType: 'Suspicion de contrefaçon',
    description: '',
  });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccessAlert, setReportSuccessAlert] = useState<string | null>(null);

  // Load initial drug & recalls & stats
  useEffect(() => {
    fetchStats();
    fetchRecalls();
    handleSearch('LOT-2026-PSY-9011');
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/traceability/stats');
      if (res.data) setStats(res.data);
    } catch {
      // Fallback defaults
    }
  };

  const fetchRecalls = async () => {
    try {
      const res = await api.get('/traceability/recalls');
      if (res.data) setActiveRecalls(res.data);
    } catch {
      // Fallback
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(`/traceability/verify?query=${encodeURIComponent(query.trim())}`);
      setCurrentDrug(res.data);
      setSearchQuery(query);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          (currentLang === 'ar'
            ? 'لم يتم العثور على أي دفعة دوائية مطابقة لهذا الرمز. يرجى التحقق من الرقم المكتوب على العلبة.'
            : 'Aucun produit correspondant trouvé pour cet identifiant. Vérifiez le numéro figurant sur le conditionnement.')
      );
      setCurrentDrug(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (lotCode: string) => {
    setSearchQuery(lotCode);
    handleSearch(lotCode);
  };

  const handleOpenReportModal = () => {
    setReportForm({
      batchNumber: currentDrug?.batchNumber || searchQuery,
      reporterName: '',
      reporterPhone: '',
      issueType: 'Suspicion de contrefaçon',
      description: '',
    });
    setReportSuccessAlert(null);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.batchNumber || !reportForm.description) return;
    setReportSubmitting(true);
    try {
      const res = await api.post('/traceability/report', reportForm);
      setReportSuccessAlert(
        res.data?.incidentTicket ? `${t.reportSuccess} (رقم التذكرة: ${res.data.incidentTicket})` : t.reportSuccess
      );
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccessAlert(null);
      }, 3000);
    } catch (err: any) {
      alert('Erreur: ' + (err.response?.data?.message || err.message));
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 font-sans`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Banner / Hero */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl leading-relaxed mb-8">
            {t.heroSub}
          </p>

          {/* KPI Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.totalBatches}</div>
              <div className="text-xs sm:text-sm text-emerald-200 font-bold mt-1">{t.statTotal}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">{stats.complianceRate}%</div>
              <div className="text-xs sm:text-sm text-emerald-200 font-bold mt-1">{t.statCompliant}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">{stats.coldChainCount}</span>
                <Snowflake className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
              <div className="text-xs sm:text-sm text-emerald-200 font-bold mt-1">{t.statCold}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-rose-300 font-mono">{stats.recalledBatches}</div>
              <div className="text-xs sm:text-sm text-rose-200 font-bold mt-1">{t.statRecalls}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search & Scanner Box */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400`}>
                <QrCode className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-900 bg-slate-50`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{t.searchBtn}</span>
            </button>
          </form>

          {/* Quick Demo Presets */}
          <div className="mt-5">
            <div className="text-xs font-bold text-slate-500 mb-2">{t.demoPresets}</div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => handlePresetClick('LOT-2026-PSY-9011')}
                className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 hover:bg-rose-100 font-bold transition flex items-center gap-1.5"
              >
                <span>{t.presetLyrica}</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('LOT-2026-STUP-4401')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold transition flex items-center gap-1.5"
              >
                <span>{t.presetTramadol}</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('LOT-2026-COLD-1142')}
                className="px-3.5 py-2 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-900 hover:bg-cyan-100 font-bold transition flex items-center gap-1.5"
              >
                <span>{t.presetLantus}</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('LOT-2025-RECALL-991')}
                className="px-3.5 py-2 rounded-xl bg-red-100 border border-red-400 text-red-950 hover:bg-red-200 font-bold transition flex items-center gap-1.5"
              >
                <span>{t.presetAugmentin}</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('LOT-2026-VAL-4819')}
                className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 hover:bg-purple-100 font-bold transition"
              >
                <span>{t.presetTareg}</span>
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('LOT-2026-DZ-8492')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 font-medium transition"
              >
                <span>{t.presetDoliprane}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION EXPLICATIVE RÉGLEMENTAIRE (POURQUOI LES DRUGS ET NON TOUS LES MÉDICAMENTS) */}
        <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{t.whyTitle}</h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">{t.whySubtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="font-black text-emerald-300 text-sm sm:text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.point1Title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{t.point1Desc}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="font-black text-cyan-300 text-sm sm:text-base flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t.point2Title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{t.point2Desc}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="font-black text-rose-300 text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{t.point3Title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{t.point3Desc}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="font-black text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.point4Title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{t.point4Desc}</p>
            </div>
          </div>
        </section>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <p className="text-sm font-bold">{errorMsg}</p>
          </div>
        )}

        {/* Drug Verification Result Card */}
        {currentDrug && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Status Header Bar */}
              <div
                className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 ${
                  currentDrug.status === 'RECALLED'
                    ? 'bg-rose-700 text-white'
                    : currentDrug.status === 'CONFORME'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-700 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {currentDrug.status === 'RECALLED' ? (
                    <AlertTriangle className="w-8 h-8 text-white animate-bounce shrink-0" />
                  ) : (
                    <ShieldCheck className="w-8 h-8 text-white shrink-0" />
                  )}
                  <div>
                    <div className="text-[11px] uppercase font-black tracking-wider opacity-90">
                      {currentDrug.status === 'RECALLED'
                        ? 'إشعار سحب صحي رسمي (ALERTE OFFICIELLE DE RETRAIT)'
                        : 'شهادة أصالة ومطابقة صيدلانية رسمية'}
                    </div>
                    <div className="text-lg sm:text-xl font-black">
                      {currentDrug.status === 'RECALLED' ? t.statusRecalled : t.statusConforme}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenReportModal}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold backdrop-blur-sm transition flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.reportIssueBtn}</span>
                  </button>
                </div>
              </div>

              {/* Product Identity & Details */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Core Identity */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                        <span>الرمز الوطني : {currentDrug.cipCode}</span>
                        <span>•</span>
                        <span>{currentDrug.manufacturingCountry}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {currentDrug.brandName}
                      </h2>
                      <p className="text-sm font-semibold text-slate-600 mt-1">
                        المادة الفعالة DCI : <strong className="text-slate-900">{currentDrug.dci}</strong> • الجرعة :{' '}
                        <strong className="text-slate-900">{currentDrug.dosage}</strong> • الشكل :{' '}
                        <strong className="text-slate-900">{currentDrug.form}</strong>
                      </p>
                    </div>

                    {/* Serialization Data Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                      <div>
                        <div className="text-xs text-slate-500 font-bold">{t.batchNumberLabel}</div>
                        <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                          {currentDrug.batchNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold">{t.serialNumberLabel}</div>
                        <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                          {currentDrug.serialNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold">{t.manufacturerLabel}</div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">
                          {currentDrug.manufacturer}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold">{t.currentLocationLabel}</div>
                        <div className="text-sm font-bold text-emerald-800 mt-0.5">
                          {currentDrug.currentLocation}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold">{t.mfgDateLabel}</div>
                        <div className="text-sm font-semibold text-slate-700 mt-0.5">
                          {new Date(currentDrug.manufacturingDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold">{t.expDateLabel}</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">
                          {new Date(currentDrug.expiryDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    {/* Recall banner if recalled */}
                    {currentDrug.status === 'RECALLED' && (
                      <div className="bg-rose-50 border-r-4 border-rose-600 p-4 rounded-l-2xl">
                        <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>{t.recallReasonLabel} {currentDrug.recallReason}</span>
                        </div>
                        <p className="text-xs text-rose-800 mt-1 font-medium">
                          مستوى الخطورة : <strong className="font-black">{currentDrug.recallLevel || 'المستوى 2'}</strong>. تعليمات : يُمنع منعاً باتاً صرف أو استعمال هذا الدواء. يجب على كافة الصيدليات عزله في منطقة الحجر فوراً وإعادته للموزع.
                        </p>
                      </div>
                    )}

                    {/* Verification Hash */}
                    <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
                      <div className="text-xs font-bold text-slate-600 mb-1">{t.verifyHash}</div>
                      <div className="font-mono text-xs text-slate-800 break-all select-all font-bold">
                        {currentDrug.verificationHash}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Cold Chain & Sensor Telemetry */}
                  <div className="space-y-4">
                    {currentDrug.coldChainRequired ? (
                      <div className="bg-gradient-to-br from-cyan-50 to-sky-100 rounded-3xl p-5 border border-cyan-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-cyan-950 font-black text-sm">
                            <Snowflake className="w-5 h-5 text-cyan-600" />
                            <span>{t.coldChainTitle}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-700 text-white">
                            {t.tempSensorActive}
                          </span>
                        </div>

                        {/* Dial display */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm text-center border border-cyan-200 my-4">
                          <div className="text-3xl font-black text-cyan-900 font-mono">
                            +{Number(currentDrug.currentTemperature).toFixed(1)}°C
                          </div>
                          <div className="text-xs font-bold text-slate-500 mt-1">
                            {t.tempRangeLabel} {currentDrug.temperatureMin}°C - {currentDrug.temperatureMax}°C
                          </div>
                        </div>

                        <div className="text-xs text-cyan-950 font-bold flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{t.coldChainSafe}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-center">
                        <div className="text-slate-400 mb-2">
                          <Thermometer className="w-8 h-8 mx-auto" />
                        </div>
                        <div className="text-sm font-bold text-slate-800">{t.ambientStandard}</div>
                        <div className="text-xs text-slate-500 mt-1">{t.ambientDesc}</div>
                      </div>
                    )}

                    {/* QR Code preview */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                      <div className="w-32 h-32 mx-auto bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-2 shadow-inner">
                        <QrCode className="w-20 h-20 text-white" />
                        <span className="text-[9px] font-mono tracking-tighter text-emerald-300 mt-1">
                          GS1-DATAMATRIX
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-2">
                        {t.gs1Label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        (01){currentDrug.cipCode}(10){currentDrug.batchNumber}(21){currentDrug.serialNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supply Chain Timeline */}
                <div className="mt-10 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <span>{t.supplyChainLifeCycle}</span>
                  </h3>

                  <div className={`relative ${isRTL ? 'border-r-2 mr-4' : 'border-l-2 ml-4'} border-emerald-500 space-y-6`}>
                    {currentDrug.timeline &&
                      currentDrug.timeline.map((step, idx) => (
                        <div key={idx} className={`relative ${isRTL ? 'pr-6' : 'pl-6'}`}>
                          {/* Dot */}
                          <div
                            className={`absolute ${isRTL ? '-right-[9px]' : '-left-[9px]'} top-1 w-4 h-4 rounded-full border-2 border-white ${
                              step.status === 'RECALLED'
                                ? 'bg-rose-600'
                                : step.status === 'CONFORME' || step.status === 'DISPENSED'
                                ? 'bg-emerald-600'
                                : 'bg-blue-600'
                            }`}
                          />

                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 transition">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h4 className="text-sm font-black text-slate-900">{step.step}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">{step.date}</span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                    step.status === 'RECALLED'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {step.status === 'CONFORME'
                                    ? 'مطابق'
                                    : step.status === 'DISPENSED'
                                    ? 'تم الصرف بالشفاء'
                                    : step.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600">
                              <strong className="text-slate-800">الموقع :</strong> {step.location} •{' '}
                              <strong className="text-slate-800">المسؤول / الهيئة :</strong> {step.actor}
                            </p>
                            {step.temperatureObserved !== undefined && (
                              <div className="text-[11px] text-cyan-800 font-bold mt-1.5 flex items-center gap-1">
                                <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                                <span>درجة الحرارة المسجلة بمستشعر التبريد : +{step.temperatureObserved}°C</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official Recalls Table Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{t.recallsSectionTitle}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {t.recallsSectionSub}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50">
                  <th className="py-3 px-4 text-start">{t.colMed}</th>
                  <th className="py-3 px-4 text-start">{t.colLot}</th>
                  <th className="py-3 px-4 text-start">{t.colMfr}</th>
                  <th className="py-3 px-4 text-start">{t.colLevel}</th>
                  <th className="py-3 px-4 text-start">{t.colReason}</th>
                  <th className="py-3 px-4 text-start">{t.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeRecalls.length > 0 ? (
                  activeRecalls.map((recall) => (
                    <tr key={recall.id} className="hover:bg-rose-50/50 transition">
                      <td className="py-3 px-4 font-black text-slate-900">{recall.brandName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-700">
                        {recall.batchNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{recall.manufacturer}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                          {recall.recallLevel || 'المستوى 2'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{recall.recallReason}</td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handlePresetClick(recall.batchNumber)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline flex items-center gap-1"
                        >
                          <span>{t.examineBtn}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-medium">
                      {t.noRecalls}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Pharmacovigilance Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-rose-700 font-black text-lg">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>{t.reportModalTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">{t.reportModalSub}</p>

            {reportSuccessAlert ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 text-center font-bold text-sm">
                ✅ {reportSuccessAlert}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.batchNumberLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={reportForm.batchNumber}
                    onChange={(e) => setReportForm({ ...reportForm, batchNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.fullNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={reportForm.reporterName}
                    onChange={(e) => setReportForm({ ...reportForm, reporterName: e.target.value })}
                    placeholder="د. يوسف بلمعزة / صيدلية المركز"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    required
                    value={reportForm.reporterPhone}
                    onChange={(e) => setReportForm({ ...reportForm, reporterPhone: e.target.value })}
                    placeholder="0555 XX XX XX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.issueTypeLabel}</label>
                  <select
                    value={reportForm.issueType}
                    onChange={(e) => setReportForm({ ...reportForm, issueType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Suspicion de contrefaçon">{t.issueCounterfeit}</option>
                    <option value="Effet indésirable inattendu">{t.issueAdverse}</option>
                    <option value="Rupture de chaîne du froid">{t.issueColdChain}</option>
                    <option value="Défaut de qualité / emballage">{t.issueQuality}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.descLabel}</label>
                  <textarea
                    rows={3}
                    required
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    placeholder="حدد طبيعة الخلل أو الأعراض أو الشك في العلبة..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 font-bold"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {reportSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{t.submitReport}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
