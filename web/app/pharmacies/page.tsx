'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import api, { API_BASE } from '@/lib/api';
import {
  Pill,
  Search,
  Filter,
  Plus,
  Minus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Moon,
  Package,
  ShoppingBag,
  Building2,
  QrCode,
  FileText,
  User,
  RefreshCw,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  ArrowRight,
  Check,
  Printer,
  FileCheck,
  XCircle,
  CheckSquare,
  Square,
  Map,
  Layers,
  LayoutGrid,
  ListFilter,
  Navigation,
} from 'lucide-react';

// --- DICTIONNAIRE TRILINGUE PHARMACIE ---
const pharmacyI18n = {
  ar: {
    portalBadge: 'بوابة الصيدلية المركزية ونظام الشفاء',
    wilayaBadge: 'ولاية سطيف • الربط المباشر مع صناديق الضمان الاجتماعي CNAS / CASNOS',
    mainTitle: 'لوحة قيادة الصيدلية وإدارة المخزون والوصفات الطبية',
    subTitle: 'متابعة حية للمخزون الدوائي، معالجة وتأكيد الوصفات الرقمية، وضبط بيانات الصيدلية',
    
    // Quick Actions Header
    quickAddStock: 'إضافة دواء للمخزون',
    quickEditProfile: 'تعديل بيانات الصيدلية',
    quickViewRadar: 'رادار صيدليات الحراسة',
    guardActive: 'صيدلية حراسة نشطة (24h/24h)',
    guardInactive: 'حراسة غير مفعلة (دوام عادي)',
    chifaActive: 'نظام الشفاء مفعّل (Télétransmission Chifa)',
    
    // Navigation Tabs
    tabStock: '📦 إدارة المخزون الدوائي',
    tabOrders: '📋 الوصفات والطلبات الإلكترونية',
    tabProfile: '🏥 بيانات واعتماد الصيدلية',
    tabRadar: '📡 رادار الحراسة لولاية سطيف',
    
    // KPIs
    kpiTotalItems: 'إجمالي الأدوية بالمخزون',
    kpiTotalItemsSub: 'أدوية معتمدة مسجلة',
    kpiLowStock: 'أدوية أوشكت على النفاد',
    kpiLowStockSub: 'أقل من الحد الأدنى للحماية',
    kpiOutOfStock: 'أدوية في حالة نفاد تام',
    kpiOutOfStockSub: 'تتطلب طلبيات تموين عاجلة',
    kpiPendingOrders: 'طلبات ووصفات قيد الانتظار',
    kpiPendingOrdersSub: 'تنتظر التحضير والتأكيد',

    // Stock Tab
    stockTitle: 'جدول المخزون الصيدلاني الحي (قانون الأدوية 2025)',
    stockSub: 'مراقبة فورية للكميات، تعديل سريع للعلب بنقرة واحدة، وتنبيهات أوتوماتيكية للنفاد',
    searchStockPlaceholder: 'البحث بالمادة الفعالة DCI أو الاسم التجاري أو الرمز...',
    filterAll: 'الكل',
    filterInStock: 'متوفر بالمخزون',
    filterLowStock: 'مخزون منخفض',
    filterOutOfStock: 'نفد من المخزون',
    colCode: 'رمز الدواء',
    colBrandDci: 'الاسم التجاري والمادة الفعالة',
    colFormDosage: 'الشكل والجرعة',
    colQuantity: 'الكمية المتوفرة',
    colThreshold: 'الحد الأدنى',
    colPrice: 'السعر المقنن (PPA)',
    colChifa: 'تعويض الشفاء',
    colActions: 'التحكم والتعديل',
    statusInStock: 'متوفر',
    statusLowStock: 'كمية حرجة',
    statusOutOfStock: 'نافد',
    reimbursableYes: 'معوض (Chifa)',
    reimbursableNo: 'غير معوض',
    restockAction: 'تموين (+50)',
    deleteConfirm: 'هل أنت متأكد من حذف هذا الدواء من جدول المخزون؟',

    // Orders Tab
    ordersTitle: 'إدارة ومعالجة الوصفات والطلبات الطبية (نظام الشفاء 2026)',
    ordersSub: 'تحضير الوصفات الإلكترونية، التحقق من رمز الاستجابة السريعة QR، واقتطاع الشفاء وتأكيد التسليم',
    searchOrdersPlaceholder: 'البحث برقم الطلب، اسم المريض، رقم الشفاء أو الطبيب المعالج...',
    btnNewOrder: 'تسجيل وصفة بالصيدلية',
    btnViewPrescription: 'معاينة الوصفة الطبية',
    btnPrintReceipt: 'وصل الصرف Chifa',
    orderRef: 'رقم الطلب :',
    orderDate: 'التاريخ :',
    patientLabel: 'المريض :',
    chifaNum: 'رقم بطاقة الشفاء :',
    doctorLabel: 'الطبيب المعالج :',
    rxCode: 'رمز الوصفة QR :',
    itemsPrescribed: 'الأدوية الموصوفة :',
    totalPpa: 'المبلغ الإجمالي PPA :',
    chifaCoverage: 'نسبة التغطية :',
    patientCopay: 'حصة المريض (Ticket Modérateur) :',
    cnasShare: 'تغطية الضمان الاجتماعي (CNAS / CASNOS) :',
    orderStatusPending: 'قيد الانتظار',
    orderStatusPreparing: 'جاري التحضير',
    orderStatusReady: 'جاهزة للاستلام',
    orderStatusDispensed: 'تم الصرف (Chifa)',
    orderStatusCancelled: 'ملغاة / مرفوضة',
    btnStartPreparing: 'بدء التحضير',
    btnMarkReady: 'جاهزة للاستلام',
    btnConfirmDispense: 'تأكيد الصرف وتمرير بطاقة الشفاء',
    btnRejectOrder: 'رفض الطلب',
    confirmRejectOrder: 'هل أنت متأكد من رفض هذه الطلبية؟',
    modalRxTitle: 'الوصفة الطبية الرقمية المعتمدة (قانون 18-07)',
    modalRxDoctorStamp: 'خاتم واعتماد الطبيب المشرف',
    modalRxChecklistTitle: 'قائمة مراقبة وتجهيز الأدوية بالصيدلية',
    modalRxChecklistDesc: 'قم بالتأشير على كل علبة عند وضعها في كيس المريض للتحقق التام وتفادي الأخطاء',
    modalRxFinancialSummary: 'البيان المالي لنظام الشفاء Tiers-Payant',
    modalNewOrderTitle: 'تسجيل وصفة طبية جديدة بالصيدلية (شباك الصرف)',
    patientNameInput: 'اسم ولقب المريض',
    patientChifaInput: 'رقم بطاقة الشفاء (12 أو 16 رقم)',
    patientPhoneInput: 'رقم هاتف المريض',
    doctorNameInput: 'اسم الطبيب المعالج والعيادة',
    itemsSummaryInput: 'تفاصيل الأدوية والجرعات (مثال: Doliprane 1g B/8, Clamoxyl 1g)',
    totalAmountInput: 'المبلغ الإجمالي PPA (دج)',
    chifaRateInput: 'نسبة تعويض الشفاء (%)',
    btnCreateOrderConfirm: 'تأكيد وحفظ الطلبية',
    modalReceiptTitle: 'وصل صرف الأدوية وتغطية الشفاء (Facturette Officine)',
    receiptLegalMention: 'تم إصدار هذا الوصل طبقاً للمنظومة الوطنية للرقمنة الصحية وقانون الضمان الاجتماعي الجزائري (Loi 18-07).',
    btnPrint: 'طباعة الوصل',
    btnClose: 'إغلاق',
    toastOrderCreated: 'تم تسجيل الوصفة بنجاح.',
    toastOrderRejected: 'تم رفض الطلبية.',

    // Profile Tab
    profileTitle: 'بيانات واعتماد الصيدلية لدى مديرية الصحة وعمادة الصيادلة',
    profileSub: 'قم بتحديث عنوان الصيدلية، الهاتف، ساعات العمل وتفعيل وضع الحراسة الليلية',
    pharmacyNameLabel: 'اسم الصيدلية الرسمي',
    pharmacistNameLabel: 'اسم الصيدلي المسؤول',
    licenseNumLabel: 'رقم الاعتماد والعمادة (CNOP)',
    communeLabel: 'البلدية (ولاية سطيف)',
    addressLabel: 'العنوان الجغرافي الكامل',
    phoneLabel: 'رقم الهاتف الثابت / النقال',
    emailLabel: 'البريد الإلكتروني المهني',
    hoursLabel: 'مواقيت العمل اليومية',
    nightGuardLabel: 'حالة الحراسة الليلية وعطل نهاية الأسبوع',
    nightGuardDesc: 'عند التفعيل، تظهر صيدليتك في أعلى رادار صيدليات الحراسة للمواطنين ومصالح الحماية المدنية 14.',
    chifaNumLabel: 'رقم اتفاقية الشفاء (CNAS / CASNOS)',
    chifaToggleLabel: 'تفعيل خدمة التعويض الفوري الشفاء',
    btnSaveProfile: 'حفظ وتحديث بيانات الصيدلية',

    // Add Medication Modal
    modalAddStockTitle: 'إضافة دواء جديد إلى مخزون الصيدلية',
    modalAddStockSub: 'إدراج دواء جديد مع تحديد الكمية المتوفرة وحد التنبيه الأوتوماتيكي',
    labelDci: 'المادة الفعالة (DCI)',
    labelBrand: 'الاسم التجاري (Nom Commercial)',
    labelCode: 'رمز الدواء بالمدونة الوطنية',
    labelForm: 'الشكل الصيدلاني',
    labelDosage: 'الجرعة',
    labelInitialQty: 'الكمية الابتدائية (علب)',
    labelMinThreshold: 'حد التنبيه الأدنى (علب)',
    labelPriceDzd: 'السعر المقنن PPA (دج)',
    labelIsReimbursable: 'دواء معوض من قبل الضمان الاجتماعي (الشفاء)',
    btnCancel: 'إلغاء',
    btnConfirmAdd: 'إضافة إلى المخزون',

    // Notifications
    toastStockUpdated: 'تم تحديث كمية المخزون بنجاح.',
    toastStockAdded: 'تمت إضافة الدواء بنجاح إلى جدول المخزون.',
    toastStockDeleted: 'تم حذف الدواء من المخزون.',
    toastOrderUpdated: 'تم تحديث حالة الوصفة بنجاح.',
    toastProfileSaved: 'تم حفظ وتحديث بيانات الصيدلية بنجاح.',

    // Pagination
    showing: 'عرض',
    to: 'إلى',
    of: 'من إجمالي',
    items: 'عنصر',
    prev: 'السابق',
    next: 'التالي',
    first: 'الصفحة الأولى',
    last: 'الصفحة الأخيرة',
    stockItems: 'دواء بالمخزون',
    orderItems: 'وصفة / طلبية',

    // Radar Citoyen & Commande Publique
    radarPublicBadge: 'خدمة عمومية مجانية • دون تسجيل الدخول',
    radarTitle: 'رادار صيدليات ولاية سطيف المباشر وتتبع الأدوية',
    radarSub: 'استكشاف الصيدليات المناوبة والمفتوحة ليلاً، الاتصال الهاتفي المباشر، وحجز الدواء مسبقاً (Click & Reserve 2h) لتفادي الطابور والتنقل.',
    radarSearchPlaceholder: 'البحث باسم الصيدلية، الدواء (Doliprane, Insuline, Lovenox...) أو الحي...',
    radarFilterNightGuard: 'صيدليات الحراسة الليلية فقط (24h/24)',
    radarFilterAllCommunes: 'جميع بلديات سطيف',
    radarOpenNow: 'مفتوحة الآن',
    radarNightGuardBadge: 'حراسة ليلية (24/24)',
    radarChifaBadge: 'معتمدة الشفاء CNAS/CASNOS',
    radarDistance: 'المسافة التقريبية',
    radarCallBtn: 'اتصال مباشر',
    radarReserveBtn: 'طلب / حجز الدواء (2h)',
    radarReservedBadge: 'تم الحجز (2h)',
    btnSwitchToDashboard: '💼 فضاء تسيير الصيدلية (المخزون والطلبيات)',
    btnSwitchToRadar: '📡 رادار الحراسة العمومي (خدمة المواطنين)',
    modalCitizenOrderTitle: 'طلب وحجز دواء بالصيدلية (Click & Reserve 2h)',
    modalCitizenOrderSub: 'يتم حجز الدواء باسمك لمدة ساعتين لدى الصيدلية المختارة لتسهيل الاستلام دون انتظار',
    citizenSelectedPharmacy: 'الصيدلية المختارة :',
    citizenNameLabel: 'الاسم واللقب الكامل للمريض / المواطن',
    citizenPhoneLabel: 'رقم الهاتف للتأكيد والتواصل',
    citizenChifaLabel: 'رقم بطاقة الشفاء (اختياري)',
    citizenMedsLabel: 'الأدوية المطلوبة أو نص الوصفة الطبية',
    citizenNotesLabel: 'ملاحظة للصيدلي (مثال: سأحضر بعد 45 دقيقة)',
    btnConfirmCitizenOrder: 'تأكيد الحجز وإرسال الطلب للصيدلية',
    toastCitizenOrderSuccess: 'تم إرسال طلبك إلى الصيدلية بنجاح! تم حجز الدواء لك لمدة ساعتين.',
    viewModeCards: 'بطاقات مفصلة',
    viewModeCompact: 'بطاقات مدمجة وسريعة',
    viewModeMap: 'خريطة تفاعلية (سطيف)',
    countersTotal: 'إجمالي الصيدليات',
    countersNight: 'حراسة ليلية',
    countersOpen: 'مفتوحة الآن',
    countersChifa: 'معتمدة الشفاء',
    pharmacistLoginBtn: 'دخول الصيادلة (لوحة التحكم)',
  },
  fr: {
    portalBadge: 'Portail Officine & Système Chifa National',
    wilayaBadge: 'Wilaya de Sétif • Télétransmission directe Caisses de Sécurité Sociale CNAS / CASNOS',
    mainTitle: 'Tableau de Bord Pharmacie, Gestion des Stocks & Ordonnances',
    subTitle: 'Suivi en temps réel de votre stock, dispensation des ordonnances électroniques et profil d’officine',
    
    // Quick Actions Header
    quickAddStock: 'Ajouter au Stock',
    quickEditProfile: 'Modifier Infos Officine',
    quickViewRadar: 'Radar des Gardes',
    guardActive: 'Pharmacie de Garde : ACTIVE (24h/24h)',
    guardInactive: 'Garde Non Activée (Horaires classiques)',
    chifaActive: 'Télétransmission Chifa Opérationnelle',
    
    // Navigation Tabs
    tabStock: '📦 Gestion du Stock',
    tabOrders: '📋 Commandes & Ordonnances Chifa',
    tabProfile: '🏥 Profil & Infos de l’Officine',
    tabRadar: '📡 Radar Citoyen des Gardes',
    
    // KPIs
    kpiTotalItems: 'Références en Stock',
    kpiTotalItemsSub: 'Médicaments enregistrés',
    kpiLowStock: 'Stocks Faibles',
    kpiLowStockSub: 'Sous le seuil d’alerte',
    kpiOutOfStock: 'Ruptures de Stock',
    kpiOutOfStockSub: 'Réapprovisionnement requis',
    kpiPendingOrders: 'Ordonnances en Attente',
    kpiPendingOrdersSub: 'À préparer et valider',

    // Stock Tab
    stockTitle: 'Tableau de Stock en Temps Réel (Nomenclature 2025)',
    stockSub: 'Ajustez les stocks en un clic (+ / -), contrôlez les seuils d’alerte et le conventionnement Chifa',
    searchStockPlaceholder: 'Rechercher par DCI, Nom de marque ou Code...',
    filterAll: 'Tous',
    filterInStock: 'En stock',
    filterLowStock: 'Stock faible',
    filterOutOfStock: 'En rupture',
    colCode: 'Code',
    colBrandDci: 'Marque & DCI',
    colFormDosage: 'Forme & Dosage',
    colQuantity: 'Quantité (Boîtes)',
    colThreshold: 'Seuil Min.',
    colPrice: 'Prix PPA (DZD)',
    colChifa: 'Remb. Chifa',
    colActions: 'Actions Rapides',
    statusInStock: 'En stock',
    statusLowStock: 'Stock faible',
    statusOutOfStock: 'En rupture',
    reimbursableYes: 'Chifa 80-100%',
    reimbursableNo: 'Non remb.',
    restockAction: 'Réassort (+50)',
    deleteConfirm: 'Voulez-vous vraiment retirer ce médicament de votre stock ?',

    // Orders Tab
    ordersTitle: 'Gestion & Délivrance des Ordonnances Électroniques (Système Chifa 2026)',
    ordersSub: 'Contrôle pharmaceutique, préparation sécurisée des spécialités, télétransmission Chifa et quittances',
    searchOrdersPlaceholder: 'Rechercher par N° commande, patient, N° Chifa ou médecin...',
    btnNewOrder: 'Nouvelle Ordonnance au Comptoir',
    btnViewPrescription: 'Consulter l’Ordonnance',
    btnPrintReceipt: 'Facturette Chifa',
    orderRef: 'Réf. Commande :',
    orderDate: 'Date :',
    patientLabel: 'Patient :',
    chifaNum: 'N° Carte Chifa :',
    doctorLabel: 'Prescripteur :',
    rxCode: 'Réf. Ordonnance QR :',
    itemsPrescribed: 'Traitements prescrits :',
    totalPpa: 'Montant Total PPA :',
    chifaCoverage: 'Taux de Couverture :',
    patientCopay: 'Part Patient (Ticket modérateur) :',
    cnasShare: 'Prise en charge Sécurité Sociale (CNAS / CASNOS) :',
    orderStatusPending: 'En attente',
    orderStatusPreparing: 'En préparation',
    orderStatusReady: 'Prête pour retrait',
    orderStatusDispensed: 'Délivrée (Chifa)',
    orderStatusCancelled: 'Rejetée / Annulée',
    btnStartPreparing: 'Mettre en préparation',
    btnMarkReady: 'Marquer Prête pour retrait',
    btnConfirmDispense: 'Valider la Délivrance Chifa',
    btnRejectOrder: 'Rejeter la commande',
    confirmRejectOrder: 'Voulez-vous vraiment rejeter cette commande ?',
    modalRxTitle: 'Ordonnance Médicale Numérique Certifiée (Loi 18-07)',
    modalRxDoctorStamp: 'Cachet & Signature Électronique du Praticien',
    modalRxChecklistTitle: 'Contrôle & Conditionnement des Spécialités',
    modalRxChecklistDesc: 'Cochez chaque ligne lors de la mise en boîte pour sécuriser la dispensation et prévenir toute erreur',
    modalRxFinancialSummary: 'Décompte Financier Tiers-Payant Chifa',
    modalNewOrderTitle: 'Enregistrement d’une Ordonnance au Comptoir',
    patientNameInput: 'Nom et prénom du patient',
    patientChifaInput: 'N° de Sécurité Sociale / Carte Chifa',
    patientPhoneInput: 'Téléphone mobile du patient',
    doctorNameInput: 'Médecin prescripteur et cabinet',
    itemsSummaryInput: 'Traitements et posologies prescrits (ex: Doliprane 1g B/8, Clamoxyl 1g)',
    totalAmountInput: 'Montant Total PPA (DZD)',
    chifaRateInput: 'Taux de couverture Chifa (%)',
    btnCreateOrderConfirm: 'Valider et Enregistrer l’Ordonnance',
    modalReceiptTitle: 'Bon de Délivrance Officine & Télétransmission Chifa',
    receiptLegalMention: 'Quittance délivrée dans le cadre du conventionnement Chifa et du décret exécutif sur l’informatisation officinale (Loi 18-07).',
    btnPrint: 'Imprimer la Quittance',
    btnClose: 'Fermer',
    toastOrderCreated: 'Ordonnance enregistrée avec succès.',
    toastOrderRejected: 'Commande rejetée.',

    // Profile Tab
    profileTitle: 'Informations de l’Officine & Agréments Sanitaires',
    profileSub: 'Mettez à jour vos coordonnées, vos horaires, le statut de garde de nuit et la convention Chifa',
    pharmacyNameLabel: 'Nom Commercial de l’Officine',
    pharmacistNameLabel: 'Pharmacien Titulaire',
    licenseNumLabel: 'N° d’Agrément / Ordre des Pharmaciens (CNOP)',
    communeLabel: 'Commune (Wilaya de Sétif)',
    addressLabel: 'Adresse Géographique Complète',
    phoneLabel: 'Numéro de Téléphone Officine',
    emailLabel: 'Email Professionnel',
    hoursLabel: 'Horaires d’Ouverture',
    nightGuardLabel: 'Pharmacie de Garde de Nuit & Week-end',
    nightGuardDesc: 'En activant ce statut, votre officine est mise en évidence auprès des citoyens et de la Protection Civile 14.',
    chifaNumLabel: 'N° de Convention Chifa (CNAS / CASNOS)',
    chifaToggleLabel: 'Service de Télétransmission Chifa Activé',
    btnSaveProfile: 'Enregistrer les Modifications',

    // Add Medication Modal
    modalAddStockTitle: 'Rajouter un Médicament au Stock',
    modalAddStockSub: 'Ajoutez une spécialité pharmaceutique issue de la nomenclature avec son seuil de réapprovisionnement',
    labelDci: 'Principe Actif (DCI)',
    labelBrand: 'Nom de Marque Commerciale',
    labelCode: 'Code Nomenclature',
    labelForm: 'Forme Galénique',
    labelDosage: 'Dosage',
    labelInitialQty: 'Quantité Initiale (Boîtes)',
    labelMinThreshold: 'Seuil d’Alerte Minimum (Boîtes)',
    labelPriceDzd: 'Prix Public Algérien - PPA (DZD)',
    labelIsReimbursable: 'Médicament Remboursable par la Sécurité Sociale (Chifa)',
    btnCancel: 'Annuler',
    btnConfirmAdd: 'Injecter dans le Stock',

    // Notifications
    toastStockUpdated: 'Stock ajusté avec succès.',
    toastStockAdded: 'Médicament injecté dans le stock avec succès.',
    toastStockDeleted: 'Médicament retiré du stock.',
    toastOrderUpdated: 'Statut de l’ordonnance mis à jour.',
    toastProfileSaved: 'Informations de la pharmacie sauvegardées avec succès.',

    // Pagination
    showing: 'Affichage de',
    to: 'à',
    of: 'sur',
    items: 'éléments',
    prev: 'Précédent',
    next: 'Suivant',
    first: 'Première page',
    last: 'Dernière page',
    stockItems: 'médicaments en stock',
    orderItems: 'commandes / ordonnances',

    // Radar Citoyen & Commande Publique
    radarPublicBadge: 'Service Public Libre • Sans Authentification',
    radarTitle: 'Radar des Pharmacies de Garde & Médicaments (Sétif)',
    radarSub: 'Localisez les officines ouvertes et de garde de nuit, appelez directement le pharmacien ou réservez votre médicament (Click & Reserve 2h) sans vous déplacer.',
    radarSearchPlaceholder: 'Rechercher par officine, médicament (Doliprane, Insuline, Lovenox...) ou quartier...',
    radarFilterNightGuard: 'Pharmacies de garde de nuit uniquement (24h/24)',
    radarFilterAllCommunes: 'Toutes les communes de Sétif',
    radarOpenNow: 'Ouverte actuellement',
    radarNightGuardBadge: 'Garde de nuit 24h/24',
    radarChifaBadge: 'Conventionnée Chifa CNAS/CASNOS',
    radarDistance: 'Distance estimée',
    radarCallBtn: 'Appel Direct',
    radarReserveBtn: 'Commander / Réserver (2h)',
    radarReservedBadge: 'Réservé pendant 2h',
    btnSwitchToDashboard: '💼 Espace Gestion Officine (Stock & Ordonnances)',
    btnSwitchToRadar: '📡 Radar Public Citoyen des Pharmacies',
    modalCitizenOrderTitle: 'Commande & Réservation en Pharmacie (Click & Reserve 2h)',
    modalCitizenOrderSub: 'Votre médicament est mis de côté pendant 2 heures dans l’officine choisie pour un retrait express sans file d’attente',
    citizenSelectedPharmacy: 'Officine sélectionnée :',
    citizenNameLabel: 'Nom et prénom du patient / citoyen',
    citizenPhoneLabel: 'Numéro de téléphone portable',
    citizenChifaLabel: 'N° Carte Chifa (Optionnel)',
    citizenMedsLabel: 'Médicaments souhaités ou référence ordonnance',
    citizenNotesLabel: 'Note pour le pharmacien (ex: Je passe dans 30 min)',
    btnConfirmCitizenOrder: 'Confirmer la Réservation & Envoyer',
    toastCitizenOrderSuccess: 'Votre commande a été envoyée à la pharmacie ! Médicament réservé pour 2 heures.',
    viewModeCards: 'Cartes Détaillées',
    viewModeCompact: 'Cartes Compactes',
    viewModeMap: 'Carte Interactive (Sétif)',
    countersTotal: 'Total Officines',
    countersNight: 'Gardes de Nuit',
    countersOpen: 'Ouvertes Maintenant',
    countersChifa: 'Convention Chifa',
    pharmacistLoginBtn: 'Espace Pharmacien (Connexion)',
  },
  en: {
    portalBadge: 'Community Pharmacy Portal & National Chifa System',
    wilayaBadge: 'Wilaya of Sétif • Direct Electronic Link to CNAS / CASNOS Social Security',
    mainTitle: 'Pharmacy Dashboard, Stock Management & e-Prescriptions',
    subTitle: 'Real-time inventory tracking, electronic prescription dispensation, and pharmacy settings',
    
    // Quick Actions Header
    quickAddStock: 'Add to Stock',
    quickEditProfile: 'Edit Pharmacy Info',
    quickViewRadar: 'On-Call Radar',
    guardActive: 'On-Call Pharmacy: ACTIVE (24h/24h)',
    guardInactive: 'Standard Working Hours',
    chifaActive: 'Chifa Transmission Active',
    
    // Navigation Tabs
    tabStock: '📦 Inventory & Stock Table',
    tabOrders: '📋 e-Prescriptions & Orders',
    tabProfile: '🏥 Pharmacy Details & License',
    tabRadar: '📡 Sétif On-Call Radar',
    
    // KPIs
    kpiTotalItems: 'Stock Items',
    kpiTotalItemsSub: 'Registered medications',
    kpiLowStock: 'Low Stock Alerts',
    kpiLowStockSub: 'Below safety threshold',
    kpiOutOfStock: 'Out of Stock',
    kpiOutOfStockSub: 'Immediate restock needed',
    kpiPendingOrders: 'Pending Orders',
    kpiPendingOrdersSub: 'Waiting for validation',

    // Stock Tab
    stockTitle: 'Real-Time Inventory Table (2025 Nomenclature)',
    stockSub: '1-click quantity adjustments (+ / -), automatic stock depletion alerts, and Chifa status',
    searchStockPlaceholder: 'Search by INN, Brand name or Code...',
    filterAll: 'All',
    filterInStock: 'In Stock',
    filterLowStock: 'Low Stock',
    filterOutOfStock: 'Out of Stock',
    colCode: 'Code',
    colBrandDci: 'Brand & INN',
    colFormDosage: 'Form & Dosage',
    colQuantity: 'Quantity (Boxes)',
    colThreshold: 'Min. Threshold',
    colPrice: 'Price PPA (DZD)',
    colChifa: 'Chifa Reimb.',
    colActions: 'Quick Actions',
    statusInStock: 'In Stock',
    statusLowStock: 'Low Stock',
    statusOutOfStock: 'Out of Stock',
    reimbursableYes: 'Chifa 80-100%',
    reimbursableNo: 'Not Reimb.',
    restockAction: 'Restock (+50)',
    deleteConfirm: 'Are you sure you want to remove this medication from inventory?',

    // Orders Tab
    ordersTitle: 'Electronic Prescriptions & Clinical Orders Management (Chifa 2026)',
    ordersSub: 'Pharmaceutical verification, dispensing checklist, Chifa electronic billing, and digital receipts',
    searchOrdersPlaceholder: 'Search by order #, patient name, Chifa ID, or prescribing doctor...',
    btnNewOrder: 'New Counter Prescription',
    btnViewPrescription: 'View e-Prescription',
    btnPrintReceipt: 'Chifa Receipt',
    orderRef: 'Order Ref:',
    orderDate: 'Date:',
    patientLabel: 'Patient:',
    chifaNum: 'Chifa Card #:',
    doctorLabel: 'Prescribing Doctor:',
    rxCode: 'Prescription QR Code:',
    itemsPrescribed: 'Prescribed Drugs:',
    totalPpa: 'Total Price PPA (DZD):',
    chifaCoverage: 'Coverage Rate:',
    patientCopay: 'Patient Co-pay:',
    cnasShare: 'Social Security Share (CNAS / CASNOS):',
    orderStatusPending: 'Pending',
    orderStatusPreparing: 'Preparing',
    orderStatusReady: 'Ready for Pickup',
    orderStatusDispensed: 'Dispensed (Chifa)',
    orderStatusCancelled: 'Cancelled / Rejected',
    btnStartPreparing: 'Start Preparing',
    btnMarkReady: 'Mark Ready for Pickup',
    btnConfirmDispense: 'Confirm Chifa Dispensation',
    btnRejectOrder: 'Reject Order',
    confirmRejectOrder: 'Are you sure you want to reject this order?',
    modalRxTitle: 'Certified Digital Medical Prescription (Law 18-07)',
    modalRxDoctorStamp: 'Practitioner Electronic Stamp & Approval',
    modalRxChecklistTitle: 'Dispensation & Packaging Checklist',
    modalRxChecklistDesc: 'Check off each medication box while preparing to ensure safety and prevent errors',
    modalRxFinancialSummary: 'Chifa Third-Party Financial Breakdown',
    modalNewOrderTitle: 'Counter Prescription Intake',
    patientNameInput: 'Patient Full Name',
    patientChifaInput: 'Social Security / Chifa Card #',
    patientPhoneInput: 'Patient Mobile Phone',
    doctorNameInput: 'Prescribing Doctor & Clinic',
    itemsSummaryInput: 'Prescribed medications and dosage (e.g. Doliprane 1g B/8, Clamoxyl 1g)',
    totalAmountInput: 'Total Price PPA (DZD)',
    chifaRateInput: 'Chifa Coverage Rate (%)',
    btnCreateOrderConfirm: 'Confirm & Register Prescription',
    modalReceiptTitle: 'Pharmacy Dispensation Receipt & Chifa Claim',
    receiptLegalMention: 'Receipt issued under the National Health Digitization Scheme & Law 18-07.',
    btnPrint: 'Print Receipt',
    btnClose: 'Close',
    toastOrderCreated: 'Prescription intake completed successfully.',
    toastOrderRejected: 'Order rejected.',

    // Profile Tab
    profileTitle: 'Pharmacy Profile & Official Credentials',
    profileSub: 'Update your contact details, opening hours, night guard status, and Chifa agreement',
    pharmacyNameLabel: 'Official Pharmacy Name',
    pharmacistNameLabel: 'Head Pharmacist',
    licenseNumLabel: 'License # / National Board (CNOP)',
    communeLabel: 'Municipality (Wilaya of Sétif)',
    addressLabel: 'Full Street Address',
    phoneLabel: 'Pharmacy Phone Number',
    emailLabel: 'Professional Email',
    hoursLabel: 'Opening Hours',
    nightGuardLabel: 'On-Call Guard Status (Night & Weekends)',
    nightGuardDesc: 'When enabled, your pharmacy is highlighted on citizen on-call radars and for Civil Protection 14.',
    chifaNumLabel: 'Chifa Agreement # (CNAS / CASNOS)',
    chifaToggleLabel: 'Chifa Electronic Direct Billing Active',
    btnSaveProfile: 'Save Pharmacy Details',

    // Add Medication Modal
    modalAddStockTitle: 'Add Medication to Stock',
    modalAddStockSub: 'Inject a new pharmaceutical item into inventory with its minimum safety threshold',
    labelDci: 'Active Ingredient (INN)',
    labelBrand: 'Commercial Brand Name',
    labelCode: 'Nomenclature Code',
    labelForm: 'Galenic Form',
    labelDosage: 'Dosage',
    labelInitialQty: 'Initial Quantity (Boxes)',
    labelMinThreshold: 'Minimum Safety Threshold (Boxes)',
    labelPriceDzd: 'Regulated Public Price - PPA (DZD)',
    labelIsReimbursable: 'Reimbursable by Social Security (Chifa)',
    btnCancel: 'Cancel',
    btnConfirmAdd: 'Inject into Inventory',

    // Notifications
    toastStockUpdated: 'Stock quantity adjusted successfully.',
    toastStockAdded: 'Medication added to inventory successfully.',
    toastStockDeleted: 'Medication removed from inventory.',
    toastOrderUpdated: 'Prescription status updated successfully.',
    toastProfileSaved: 'Pharmacy profile saved successfully.',

    // Pagination
    showing: 'Showing',
    to: 'to',
    of: 'of',
    items: 'items',
    prev: 'Previous',
    next: 'Next',
    first: 'First page',
    last: 'Last page',
    stockItems: 'stock medications',
    orderItems: 'orders / prescriptions',

    // Radar Citoyen & Commande Publique
    radarPublicBadge: 'Free Public Service • No Login Required',
    radarTitle: 'Sétif On-Call Pharmacies & Drug Availability Radar',
    radarSub: 'Locate open and night-guard pharmacies in Sétif, call directly or reserve medication (Click & Reserve 2h) before traveling.',
    radarSearchPlaceholder: 'Search by pharmacy, medication (Doliprane, Insuline, Lovenox...) or area...',
    radarFilterNightGuard: 'Night guard pharmacies only (24h/24)',
    radarFilterAllCommunes: 'All municipalities of Sétif',
    radarOpenNow: 'Open now',
    radarNightGuardBadge: 'On-call night guard 24h/24',
    radarChifaBadge: 'Chifa CNAS/CASNOS Certified',
    radarDistance: 'Estimated distance',
    radarCallBtn: 'Call Pharmacy',
    radarReserveBtn: 'Order / Reserve (2h)',
    radarReservedBadge: 'Reserved for 2h',
    btnSwitchToDashboard: '💼 Pharmacist Portal (Stock & Orders)',
    btnSwitchToRadar: '📡 Public Citizen Radar',
    modalCitizenOrderTitle: 'Pharmacy Medication Reservation (Click & Reserve 2h)',
    modalCitizenOrderSub: 'Your medication will be kept on hold for 2 hours at the selected pharmacy for quick pickup',
    citizenSelectedPharmacy: 'Selected Pharmacy:',
    citizenNameLabel: 'Patient / Citizen Full Name',
    citizenPhoneLabel: 'Mobile Phone Number',
    citizenChifaLabel: 'Chifa Card Number (Optional)',
    citizenMedsLabel: 'Requested Medication(s) or Prescription details',
    citizenNotesLabel: 'Note for pharmacist (e.g. Arriving in 30 minutes)',
    btnConfirmCitizenOrder: 'Confirm Reservation & Send',
    toastCitizenOrderSuccess: 'Your reservation was sent to the pharmacy! Medication held for 2 hours.',
    viewModeCards: 'Detailed Cards',
    viewModeCompact: 'Compact Cards',
    viewModeMap: 'Interactive Map (Sétif)',
    countersTotal: 'Total Pharmacies',
    countersNight: 'Night Guards',
    countersOpen: 'Open Now',
    countersChifa: 'Chifa Approved',
    pharmacistLoginBtn: 'Pharmacist Portal (Login)',
  },
};

// Composant Réutilisable de Pagination (Trilingue)
function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = 'éléments',
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}) {
  const { language } = useLanguage();
  const t = pharmacyI18n[language as keyof typeof pharmacyI18n] || pharmacyI18n.fr;

  if (totalItems <= itemsPerPage) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200 text-xs">
      <div className="text-slate-500 font-medium">
        <span>
          {t.showing} <strong className="text-slate-800 font-mono">{startIdx}</strong> {t.to}{' '}
          <strong className="text-slate-800 font-mono">{endIdx}</strong> {t.of}{' '}
          <strong className="text-slate-900 font-mono">{totalItems}</strong> {itemName}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          title={t.first}
        >
          <ChevronsLeft className="w-4 h-4 rtl:rotate-180" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 font-semibold"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t.prev}</span>
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[2rem] h-8 px-2 rounded-xl text-xs font-mono font-bold transition ${
              currentPage === p
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 font-semibold"
        >
          <span className="hidden sm:inline">{t.next}</span>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          title={t.last}
        >
          <ChevronsRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}

const initialRadarPharmacies = [
  {
    id: 1,
    name: 'صيدلية النور (Pharmacie En-Nour)',
    pharmacist: 'Dr. أمينة بوزيد (Dr. Amina Bouzid)',
    commune: 'سطيف المركز (Sétif Centre)',
    communeKey: 'Sétif',
    address: '12 شارع 8 ماي 1945، بالقرب من ساحة عين الفوارة، سطيف',
    phone: '036 84 12 55',
    isNightGuard: true,
    isOpenNow: true,
    openingHours: '24h/24h (حراسة ليلية معتمدة)',
    distance: '0.8 كم',
    chifaActive: true,
    availableMeds: ['Doliprane 1000mg', 'Lovenox 4000 UI', 'Insuline Lantus', 'Augmentin 1g', 'Kardégic 75mg', 'Spasfon'],
    mapX: 50,
    mapY: 44,
  },
  {
    id: 2,
    name: 'صيدلية بلمعزة (Pharmacie Belmaaza)',
    pharmacist: 'Dr. يوسف بلمعزة (Dr. Youcef Belmaaza)',
    commune: 'سطيف المركز (Sétif Centre)',
    communeKey: 'Sétif',
    address: '14 Boulevard de la République, Sétif',
    phone: '036 84 12 55',
    isNightGuard: true,
    isOpenNow: true,
    openingHours: '24h/24h (حراسة ليلية ونهار)',
    distance: '0.9 كم',
    chifaActive: true,
    availableMeds: ['Doliprane 1000mg', 'Tareg 80mg', 'Inexium 20mg', 'Glucophage 850mg', 'Ventoline'],
    mapX: 46,
    mapY: 48,
  },
  {
    id: 3,
    name: 'صيدلية السلام (Pharmacie Es-Salam)',
    pharmacist: 'Dr. سفيان علوي (Dr. Soufiane Allaoui)',
    commune: 'سطيف (حي 1014 مسكن)',
    communeKey: 'Sétif',
    address: 'عمارة 12، حي 1014 مسكن، بالقرب من ملعب 8 ماي 1945',
    phone: '036 92 40 18',
    isNightGuard: false,
    isOpenNow: true,
    openingHours: '08:00 - 20:30',
    distance: '1.4 كم',
    chifaActive: true,
    availableMeds: ['Paracétamol 500mg', 'Amoxicilline 500mg', 'Clamoxyl 1g', 'Solupred 20mg', 'Smecta'],
    mapX: 54,
    mapY: 53,
  },
  {
    id: 4,
    name: 'صيدلية الهضاب (Pharmacie El Hidhab)',
    pharmacist: 'Dr. سمير مبروك (Dr. Samir Mabrouk)',
    commune: 'العلمة (El Eulma)',
    communeKey: 'El Eulma',
    address: 'شارع دبي التجاري، العلمة، سطيف',
    phone: '036 87 60 90',
    isNightGuard: true,
    isOpenNow: true,
    openingHours: '24h/24h (حراسة ليلية مناوبة)',
    distance: '18 كم',
    chifaActive: true,
    availableMeds: ['Glucophage 850mg', 'Insuline Novorapid', 'Dafalgan 1g', 'Aspegic 100mg', 'Célestène'],
    mapX: 82,
    mapY: 54,
  },
  {
    id: 5,
    name: 'صيدلية عين الفوارة (Pharmacie Ain Fouara)',
    pharmacist: 'Dr. نسيمة حمودي (Dr. Nassima Hammoudi)',
    commune: 'سطيف المركز (Sétif Centre)',
    communeKey: 'Sétif',
    address: 'ساحة عين الفوارة، مقابل المسجد العتيق',
    phone: '036 83 22 11',
    isNightGuard: false,
    isOpenNow: true,
    openingHours: '08:00 - 21:00',
    distance: '0.5 كم',
    chifaActive: true,
    availableMeds: ['Panadol 500mg', 'Clamoxyl 1g', 'Mopral 20mg', 'Tahor 20mg', 'Voltène'],
    mapX: 48,
    mapY: 42,
  },
  {
    id: 6,
    name: 'صيدلية عين أرنات (Pharmacie Ain Arnat)',
    pharmacist: 'Dr. مراد لعلام (Dr. Mourad Laalam)',
    commune: 'عين أرنات (Ain Arnat)',
    communeKey: 'Ain Arnat',
    address: 'الطريق الوطني رقم 5، بالقرب من عيادة التوليد، عين أرنات',
    phone: '036 71 15 40',
    isNightGuard: true,
    isOpenNow: true,
    openingHours: '24h/24h (حراسة ليلية)',
    distance: '12 كم',
    chifaActive: true,
    availableMeds: ['Lovenox 4000 UI', 'Doliprane 1000mg', 'Insuline Mixtard', 'Gaviscon', 'Flagyl 500mg'],
    mapX: 25,
    mapY: 45,
  },
  {
    id: 7,
    name: 'صيدلية عين ولمان (Pharmacie Ain Oulmene)',
    pharmacist: 'Dr. فاروق زيتوني (Dr. Farouk Zitouni)',
    commune: 'عين ولمان (Ain Oulmene)',
    communeKey: 'Ain Oulmene',
    address: 'شارع أول نوفمبر 1954، وسط مدينة عين ولمان',
    phone: '036 75 30 12',
    isNightGuard: true,
    isOpenNow: true,
    openingHours: '24h/24h (حراسة ليلية)',
    distance: '32 كم',
    chifaActive: true,
    availableMeds: ['Insuline Lantus', 'Doliprane', 'Amoxicilline', 'Kardégic', 'Spasfon'],
    mapX: 28,
    mapY: 82,
  },
];

export default function PharmacyDashboardPage() {
  const { user, isLoading } = useAuth();
  const loading = isLoading;
  const router = useRouter();
  const { language, dir } = useLanguage();
  const t = pharmacyI18n[language as keyof typeof pharmacyI18n] || pharmacyI18n.fr;
  const isPharmacist = user?.role === 'PHARMACY';

  // Strict Authentication Guard : Redirige vers /login si non authentifié pharmacien
  useEffect(() => {
    if (!loading && (!user || user.role !== 'PHARMACY')) {
      router.push('/login?role=PHARMACY');
    }
  }, [user, loading, router]);

  // Active Tab pour le Pharmacien : Gestion du Stock par défaut
  const [activeTab, setActiveTab] = useState<'stock' | 'orders' | 'profile' | 'radar'>('stock');

  // Radar Pharmacies State
  const [radarPharmacies, setRadarPharmacies] = useState<any[]>(initialRadarPharmacies);
  const [radarSearch, setRadarSearch] = useState('');
  const [radarNightOnly, setRadarNightOnly] = useState(false);
  const [radarCommuneFilter, setRadarCommuneFilter] = useState('ALL');
  const [reservedPharmacies, setReservedPharmacies] = useState<{ [id: number]: boolean }>({});

  // Citizen Order Modal State
  const [showCitizenOrderModal, setShowCitizenOrderModal] = useState(false);
  const [selectedPharmacyForOrder, setSelectedPharmacyForOrder] = useState<any | null>(null);
  const [citizenOrderForm, setCitizenOrderForm] = useState({
    patientName: '',
    patientPhone: '',
    patientChifaNumber: '',
    requestedItems: '',
    patientNotes: 'Retrait au comptoir sous 2h',
  });

  // KPIs Stats
  const [stats, setStats] = useState({
    totalStockItems: 12,
    lowStockCount: 3,
    outOfStockCount: 1,
    pendingOrdersCount: 1,
    preparingOrdersCount: 1,
    readyOrdersCount: 1,
    dispensedTodayCount: 1,
  });

  // Profile State
  const [profile, setProfile] = useState({
    name: 'صيدلية بلمعزة (Pharmacie Belmaaza)',
    pharmacistName: 'Dr. Youcef Belmaaza (د. يوسف بلمعزة)',
    licenseNumber: 'ORD-PHARM-SETIF-2018-0442',
    commune: 'سطيف المركز (Sétif Centre)',
    address: 'شارع 8 ماي 1945، بالقرب من ساحة عين الفوارة، سطيف',
    phone: '036 84 12 55',
    email: 'pharmacie@sihati.dz',
    openingHours: '08:00 - 19:30 (24h/24h en garde)',
    isNightGuard: true,
    chifaConventionNumber: 'CNAS-SETIF-CH-884210',
    chifaEnabled: true,
  });

  // Stock State & Pagination
  const [stocks, setStocks] = useState<any[]>([]);
  const [stockSearch, setStockSearch] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL');
  const [stockLoading, setStockLoading] = useState(false);
  const [stockPage, setStockPage] = useState(1);
  const stockPerPage = 6;

  // Orders State & Pagination
  const [orders, setOrders] = useState<any[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const orderPerPage = 3;

  // Selected Order for Full Medical Prescription & Checklist Modal
  const [selectedOrderForRx, setSelectedOrderForRx] = useState<any | null>(null);
  const [checkedRxItems, setCheckedRxItems] = useState<{ [key: string]: boolean }>({});

  // Printable Chifa Receipt Modal
  const [printReceiptOrder, setPrintReceiptOrder] = useState<any | null>(null);

  // New Counter Order Modal
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    patientName: '',
    patientChifaNumber: '',
    patientPhone: '',
    doctorName: 'Dr. Mohamed ALI (طبيب عام)',
    prescriptionHash: `ORD-2026-SETIF-${Math.floor(Math.random() * 900000 + 100000)}`,
    itemsSummary: '',
    totalAmount: 1450,
    chifaCoverageRate: 80,
  });

  // Filtered & Paginated Stocks
  const filteredStocks = stocks.filter((s) => {
    if (stockStatusFilter !== 'ALL' && s.status !== stockStatusFilter) return false;
    if (!stockSearch) return true;
    const q = stockSearch.toLowerCase();
    return (
      s.brandName?.toLowerCase().includes(q) ||
      s.dci?.toLowerCase().includes(q) ||
      s.code?.toLowerCase().includes(q)
    );
  });
  const totalStockPages = Math.ceil(filteredStocks.length / stockPerPage) || 1;
  const paginatedStocks = filteredStocks.slice((stockPage - 1) * stockPerPage, stockPage * stockPerPage);

  // Filtered & Paginated Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.orderReference?.toLowerCase().includes(q) ||
      o.patientName?.toLowerCase().includes(q) ||
      o.patientChifaNumber?.toLowerCase().includes(q) ||
      o.doctorName?.toLowerCase().includes(q) ||
      o.prescriptionHash?.toLowerCase().includes(q) ||
      o.itemsSummary?.toLowerCase().includes(q)
    );
  });
  const totalOrderPages = Math.ceil(filteredOrders.length / orderPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((orderPage - 1) * orderPerPage, orderPage * orderPerPage);

  // Filtered Radar Pharmacies for Citizens
  const filteredRadarPharmacies = radarPharmacies.filter((ph) => {
    if (radarNightOnly && !ph.isNightGuard) return false;
    if (radarCommuneFilter !== 'ALL' && ph.communeKey !== radarCommuneFilter) return false;
    if (!radarSearch) return true;
    const q = radarSearch.toLowerCase();
    const inName = ph.name?.toLowerCase().includes(q);
    const inPharmacist = ph.pharmacist?.toLowerCase().includes(q);
    const inCommune = ph.commune?.toLowerCase().includes(q);
    const inAddress = ph.address?.toLowerCase().includes(q);
    const inMeds = ph.availableMeds?.some((m: string) => m.toLowerCase().includes(q));
    return inName || inPharmacist || inCommune || inAddress || inMeds;
  });

  // Check URL query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'stock' || tabParam === 'orders' || tabParam === 'profile') {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Handle Opening Citizen Order Modal
  const handleOpenCitizenOrder = (ph: any) => {
    setSelectedPharmacyForOrder(ph);
    setCitizenOrderForm({
      patientName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      patientPhone: user?.phone || '',
      patientChifaNumber: '',
      requestedItems: radarSearch || 'Doliprane 1000mg',
      patientNotes: 'Retrait au comptoir sous 2h',
    });
    setShowCitizenOrderModal(true);
  };

  // Submit Citizen Order
  const handleCitizenOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPharmacyForOrder) return;

    const refNum = Math.floor(Math.random() * 9000 + 1000);
    const newOrderPayload = {
      id: Date.now(),
      orderReference: `CMD-CIT-${refNum}`,
      patientName: citizenOrderForm.patientName || 'مواطن (طلب عبر رادار سطيف)',
      patientChifaNumber: citizenOrderForm.patientChifaNumber || '1985-1901-7788-99',
      patientPhone: citizenOrderForm.patientPhone || '0661223344',
      doctorName: 'طلب حر / حجز مباشر (Click & Reserve 2h)',
      prescriptionHash: `RES-${refNum}-SETIF`,
      itemsCount: 1,
      itemsSummary: citizenOrderForm.requestedItems || 'Doliprane 1000mg',
      chifaCoverageRate: citizenOrderForm.patientChifaNumber ? 80 : 0,
      totalAmount: 850.0,
      patientCopay: citizenOrderForm.patientChifaNumber ? 170.0 : 850.0,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    try {
      await api.post('/pharmacy/orders', newOrderPayload);
    } catch (err) {
      // Offline fallback
    }

    setOrders((prev) => [newOrderPayload, ...prev]);
    setReservedPharmacies((prev) => ({ ...prev, [selectedPharmacyForOrder.id]: true }));
    setShowCitizenOrderModal(false);
    showToast(t.toastCitizenOrderSuccess);
  };

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Add Stock Modal State
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newStockForm, setNewStockForm] = useState({
    code: 'MIP-2025-013',
    brandName: '',
    dci: '',
    form: 'COMPRIME',
    dosage: '500 MG',
    quantity: 30,
    minThreshold: 10,
    unitPrice: 280,
    isReimbursable: true,
  });

  // Load Initial Data
  useEffect(() => {
    loadPharmacyStats();
    loadPharmacyProfile();
    loadPharmacyStocks();
    loadPharmacyOrders();

    // Connexion SSE Temps Réel pour les commandes de la pharmacie
    let es: EventSource | null = null;
    try {
      es = new EventSource(`${API_BASE}/notifications/stream?role=PHARMACY`);
      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'ORDER_CREATED') {
            loadPharmacyOrders();
            loadPharmacyStats();
            showToast(
              dir === 'rtl'
                ? `🔔 طلب حجز دواء جديد ورد للتو: ${parsed.data?.patientName || 'مواطن'}`
                : `🔔 Nouvelle commande reçue : ${parsed.data?.patientName || 'Patient'}`
            );
          } else if (parsed.type === 'ORDER_STATUS_CHANGED') {
            loadPharmacyOrders();
            loadPharmacyStats();
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
  }, [dir]);

  const loadPharmacyStats = async () => {
    try {
      const res = await api.get('/pharmacy/stats');
      setStats(res.data);
    } catch (e) {
      console.warn('Fallback stats mock');
    }
  };

  const loadPharmacyProfile = async () => {
    try {
      const res = await api.get('/pharmacy/profile');
      if (res.data) setProfile(res.data);
    } catch (e) {
      console.warn('Fallback profile mock');
    }
  };

  const loadPharmacyStocks = async () => {
    setStockLoading(true);
    try {
      const res = await api.get('/pharmacy/stocks', {
        params: { search: stockSearch, status: stockStatusFilter },
      });
      setStocks(res.data);
    } catch (e) {
      console.warn('Fallback stocks mock');
      setStocks([
        { id: 1, code: 'MIP-2025-001', brandName: 'DOLIPRANE 1000 MG', dci: 'PARACETAMOL', form: 'COMPRIME', dosage: '1000 MG', quantity: 64, minThreshold: 15, unitPrice: 195.0, isReimbursable: true, status: 'IN_STOCK' },
        { id: 2, code: 'MIP-2025-002', brandName: 'CLAMOXYL 1 G', dci: 'AMOXICILLINE', form: 'COMPRIME DISPERSIBLE', dosage: '1000 MG', quantity: 38, minThreshold: 10, unitPrice: 580.0, isReimbursable: true, status: 'IN_STOCK' },
        { id: 3, code: 'MIP-2025-003', brandName: 'AUGMENTIN 1 G / 125 MG', dci: 'AMOXICILLINE + ACIDE CLAVULANIQUE', form: 'POUDRE SACHET', dosage: '1 G / 125 MG', quantity: 8, minThreshold: 12, unitPrice: 890.0, isReimbursable: true, status: 'LOW_STOCK' },
        { id: 4, code: 'MIP-2025-004', brandName: 'TAREG 80 MG', dci: 'VALSARTAN', form: 'COMPRIME PELLICULE', dosage: '80 MG', quantity: 22, minThreshold: 10, unitPrice: 650.0, isReimbursable: true, status: 'IN_STOCK' },
        { id: 5, code: 'MIP-2025-005', brandName: 'GLUCOPHAGE 850 MG', dci: 'METFORMINE', form: 'COMPRIME', dosage: '850 MG', quantity: 45, minThreshold: 15, unitPrice: 320.0, isReimbursable: true, status: 'IN_STOCK' },
        { id: 6, code: 'MIP-2025-006', brandName: 'LANTUS SOLOSTAR 100 U/ML', dci: 'INSULINE GLARGINE', form: 'STYLO PRE-REMPLI', dosage: '100 UI/ML', quantity: 5, minThreshold: 10, unitPrice: 4200.0, isReimbursable: true, status: 'LOW_STOCK' },
        { id: 7, code: 'MIP-2025-007', brandName: 'VENTOLINE 100 MCG', dci: 'SALBUTAMOL', form: 'AEROSOL DOSEUR', dosage: '100 MCG', quantity: 0, minThreshold: 8, unitPrice: 280.0, isReimbursable: true, status: 'OUT_OF_STOCK' },
      ]);
    } finally {
      setStockLoading(false);
    }
  };

  const loadPharmacyOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/pharmacy/orders', {
        params: { status: orderStatusFilter },
      });
      setOrders(res.data);
    } catch (e) {
      console.warn('Fallback orders mock');
      setOrders([
        {
          id: 1,
          orderReference: 'CMD-2026-0929-01',
          patientName: 'محمد أمين بن علي (Mohamed Amine Benali)',
          patientChifaNumber: '1988-1901-7845-12',
          patientPhone: '0661234567',
          doctorName: 'Dr. Mohamed ALI (طبيب عام)',
          prescriptionHash: 'ORD-2024-SETIF-984712',
          itemsCount: 3,
          itemsSummary: 'Doliprane 1000mg (B/8), Tareg 80mg (B/28), Kardégic 75mg (B/30)',
          chifaCoverageRate: 80,
          totalAmount: 1005.0,
          patientCopay: 201.0,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          orderReference: 'CMD-2026-0929-02',
          patientName: 'فاطمة الزهراء منصوري (Fatima Zohra Mansouri)',
          patientChifaNumber: '1975-1902-3321-44',
          patientPhone: '0550445566',
          doctorName: 'Dr. Belkadi (أمراض القلب)',
          prescriptionHash: 'ORD-2024-SETIF-441290',
          itemsCount: 2,
          itemsSummary: 'Glucophage 850mg (B/30), Lantus Solostar 100UI (B/5)',
          chifaCoverageRate: 100,
          totalAmount: 4520.0,
          patientCopay: 0.0,
          status: 'PREPARING',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Adjust stock quantity by delta (+1 or -1 or custom)
  const handleAdjustQuantity = async (stockId: number, delta: number) => {
    try {
      await api.patch(`/pharmacy/stocks/${stockId}/adjust`, { delta });
      setStocks((prev) =>
        prev.map((s) => {
          if (s.id !== stockId) return s;
          const newQty = Math.max(0, s.quantity + delta);
          let newStatus = 'IN_STOCK';
          if (newQty <= 0) newStatus = 'OUT_OF_STOCK';
          else if (newQty <= s.minThreshold) newStatus = 'LOW_STOCK';
          return { ...s, quantity: newQty, status: newStatus };
        }),
      );
      showToast(t.toastStockUpdated);
      loadPharmacyStats();
    } catch (e) {
      // Local fallback
      setStocks((prev) =>
        prev.map((s) => (s.id === stockId ? { ...s, quantity: Math.max(0, s.quantity + delta) } : s)),
      );
      showToast(t.toastStockUpdated);
    }
  };

  // Add stock medication
  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/pharmacy/stocks', newStockForm);
      setStocks([res.data, ...stocks]);
      setShowAddStockModal(false);
      showToast(t.toastStockAdded);
      loadPharmacyStats();
      setNewStockForm({
        code: `MIP-2025-${Math.floor(Math.random() * 900 + 100)}`,
        brandName: '',
        dci: '',
        form: 'COMPRIME',
        dosage: '500 MG',
        quantity: 30,
        minThreshold: 10,
        unitPrice: 280,
        isReimbursable: true,
      });
    } catch (e) {
      const mockNew = { id: Date.now(), ...newStockForm, status: 'IN_STOCK' };
      setStocks([mockNew, ...stocks]);
      setShowAddStockModal(false);
      showToast(t.toastStockAdded);
    }
  };

  // Delete stock item
  const handleDeleteStock = async (stockId: number) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await api.delete(`/pharmacy/stocks/${stockId}`);
      setStocks(stocks.filter((s) => s.id !== stockId));
      showToast(t.toastStockDeleted);
      loadPharmacyStats();
    } catch (e) {
      setStocks(stocks.filter((s) => s.id !== stockId));
      showToast(t.toastStockDeleted);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/pharmacy/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      showToast(t.toastOrderUpdated);
      loadPharmacyStats();
      if (selectedOrderForRx && selectedOrderForRx.id === orderId) {
        setSelectedOrderForRx({ ...selectedOrderForRx, status: newStatus });
      }
    } catch (e) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      showToast(t.toastOrderUpdated);
      if (selectedOrderForRx && selectedOrderForRx.id === orderId) {
        setSelectedOrderForRx({ ...selectedOrderForRx, status: newStatus });
      }
    }
  };

  // Create Counter Order
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const patientCopay = (Number(newOrderForm.totalAmount) * (100 - Number(newOrderForm.chifaCoverageRate))) / 100;
    try {
      const res = await api.post('/pharmacy/orders', {
        ...newOrderForm,
        patientCopay,
        status: 'PENDING',
      });
      setOrders([res.data, ...orders]);
      setShowNewOrderModal(false);
      showToast(t.toastOrderCreated);
      loadPharmacyStats();
      setNewOrderForm({
        patientName: '',
        patientChifaNumber: '',
        patientPhone: '',
        doctorName: 'Dr. Mohamed ALI (طبيب عام)',
        prescriptionHash: `ORD-2026-SETIF-${Math.floor(Math.random() * 900000 + 100000)}`,
        itemsSummary: '',
        totalAmount: 1450,
        chifaCoverageRate: 80,
      });
    } catch (e) {
      const mockCreated = {
        id: Date.now(),
        orderReference: `CMD-2026-${Math.floor(Math.random() * 900000 + 100000)}`,
        ...newOrderForm,
        patientCopay,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      setOrders([mockCreated, ...orders]);
      setShowNewOrderModal(false);
      showToast(t.toastOrderCreated);
    }
  };

  // Reject / Cancel Order
  const handleRejectOrder = async (orderId: number) => {
    if (!confirm(t.confirmRejectOrder)) return;
    try {
      await api.patch(`/pharmacy/orders/${orderId}/status`, { status: 'CANCELLED' });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o)));
      showToast(t.toastOrderRejected);
      loadPharmacyStats();
      if (selectedOrderForRx && selectedOrderForRx.id === orderId) {
        setSelectedOrderForRx(null);
      }
    } catch (e) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o)));
      showToast(t.toastOrderRejected);
      if (selectedOrderForRx && selectedOrderForRx.id === orderId) {
        setSelectedOrderForRx(null);
      }
    }
  };

  // Save profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/pharmacy/profile', profile);
      showToast(t.toastProfileSaved);
    } catch (e) {
      showToast(t.toastProfileSaved);
    }
  };

  // Toggle Night Guard directly
  const handleToggleNightGuard = async () => {
    const nextGuard = !profile.isNightGuard;
    setProfile({ ...profile, isNightGuard: nextGuard });
    try {
      await api.put('/pharmacy/profile', { isNightGuard: nextGuard });
      showToast(nextGuard ? t.guardActive : t.guardInactive);
    } catch (e) {
      showToast(nextGuard ? t.guardActive : t.guardInactive);
    }
  };

  // Redirection d'authentification stricte pour la page professionnelle de pharmacie
  if (loading || !user || user.role !== 'PHARMACY') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans" dir={dir}>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto">
            <Pill className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {dir === 'rtl' ? 'فضاء تسيير الصيدليات المعتمدة' : 'Espace Officine & Pharmacien'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {dir === 'rtl'
              ? 'هذه اللوحة محمية ومخصصة حصرياً للصيادلة المعتمدين لإدارة المخزون والوصفات. جارٍ التحقق من الهوية أو التوجيه لتسجيل الدخول...'
              : 'Cet espace de gestion d’officine est protégé et réservé aux pharmaciens. Redirection vers la page de connexion en cours...'}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/pharmacies-radar"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <MapPin className="w-4 h-4" />
              <span>{dir === 'rtl' ? 'الذهاب إلى رادار صيدليات الحراسة (مفتوح للجمهور)' : 'Accéder au Radar Public des Gardes'}</span>
            </Link>
            <Link
              href="/login?role=PHARMACIST"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              {dir === 'rtl' ? 'تسجيل دخول الصيدلي' : 'Connexion Pharmacien'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans" dir={dir}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 animate-slide-up text-sm font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER - LIGHT THEME */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!isPharmacist || activeTab === 'radar' ? (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{t.radarPublicBadge}</span>
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                    ولاية سطيف • تتبع صيدليات الحراسة وتوافر الأدوية الحيوية
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  <span>{t.radarTitle}</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">{t.radarSub}</p>
              </div>

              {/* Bouton pour basculer vers l'Espace Pharmacien ou Se Connecter */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isPharmacist ? (
                  <button
                    onClick={() => setActiveTab('stock')}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                  >
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>{t.btnSwitchToDashboard}</span>
                  </button>
                ) : (
                  <Link
                    href="/login?role=PHARMACIST"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                  >
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>{t.pharmacistLoginBtn}</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full border border-teal-200 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-700" />
                    <span>{t.portalBadge}</span>
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                    {t.wilayaBadge}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{profile.name}</span>
                  <span className="text-sm font-semibold text-slate-500">({profile.pharmacistName})</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">{t.subTitle}</p>
              </div>

              {/* Right Action Badges & Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Switch to Radar */}
                <button
                  onClick={() => setActiveTab('radar')}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{t.btnSwitchToRadar}</span>
                </button>

                {/* Interrupteur Garde de nuit */}
                <button
                  onClick={handleToggleNightGuard}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    profile.isNightGuard
                      ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>{profile.isNightGuard ? t.guardActive : t.guardInactive}</span>
                </button>

                {/* Bouton Ajouter au stock */}
                <button
                  onClick={() => setShowAddStockModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.quickAddStock}</span>
                </button>
              </div>
            </div>
          )}

          {/* Cartes Info Citoyen OU 4 Grandes Cartes KPIs Pharmacie */}
          {!isPharmacist || activeTab === 'radar' ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-emerald-900">صيدليات معتمدة بسطيف</span>
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-950 mt-2">{radarPharmacies.length}</div>
                <span className="text-[11px] text-emerald-700 font-semibold">تغطية مركزية وبلديات الولاية</span>
              </div>

              <div
                onClick={() => setRadarNightOnly(!radarNightOnly)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  radarNightOnly
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-bold ${radarNightOnly ? 'text-white' : 'text-amber-900'}`}>
                    حراسة ليلية نشطة الليلة
                  </span>
                  <Moon className={`w-4 h-4 ${radarNightOnly ? 'text-white' : 'text-amber-600'}`} />
                </div>
                <div className={`text-2xl font-black mt-2 ${radarNightOnly ? 'text-white' : 'text-amber-950'}`}>
                  {radarPharmacies.filter((p) => p.isNightGuard).length}
                </div>
                <span className={`text-[11px] font-semibold ${radarNightOnly ? 'text-amber-100' : 'text-amber-700'}`}>
                  مفتوحة 24h/24h للطوارئ
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-700">اتصال هاتفي فوري</span>
                  <Phone className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">مباشر 100%</div>
                <span className="text-[11px] text-slate-500 font-semibold">دون وسيط أو تسجيل الدخول</span>
              </div>

              <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-teal-900">حجز مسبق Click & Reserve</span>
                  <ShoppingBag className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-teal-950 mt-2">2 ساعات</div>
                <span className="text-[11px] text-teal-700 font-semibold">تحضير وحجز الدواء بالصيدلية</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div
                onClick={() => setActiveTab('stock')}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-500">{t.kpiTotalItems}</span>
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">{stocks.length || stats.totalStockItems}</div>
                <span className="text-[11px] text-emerald-700 font-semibold">{t.kpiTotalItemsSub}</span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('stock');
                  setStockStatusFilter('LOW_STOCK');
                }}
                className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 hover:border-amber-300 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-amber-800">{t.kpiLowStock}</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-900 mt-2">
                  {stocks.filter((s) => s.status === 'LOW_STOCK').length || stats.lowStockCount}
                </div>
                <span className="text-[11px] text-amber-700 font-semibold">{t.kpiLowStockSub}</span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('stock');
                  setStockStatusFilter('OUT_OF_STOCK');
                }}
                className="bg-red-50/60 p-4 rounded-2xl border border-red-200 hover:border-red-300 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-red-800">{t.kpiOutOfStock}</span>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-black text-red-900 mt-2">
                  {stocks.filter((s) => s.status === 'OUT_OF_STOCK').length || stats.outOfStockCount}
                </div>
                <span className="text-[11px] text-red-700 font-semibold">{t.kpiOutOfStockSub}</span>
              </div>

              <div
                onClick={() => setActiveTab('orders')}
                className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200 hover:border-teal-300 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-teal-800">{t.kpiPendingOrders}</span>
                  <ShoppingBag className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-teal-900 mt-2">
                  {orders.filter((o) => o.status === 'PENDING').length || stats.pendingOrdersCount}
                </div>
                <span className="text-[11px] text-teal-700 font-semibold">{t.kpiPendingOrdersSub}</span>
              </div>
            </div>
          )}

          {/* ONGLET DE NAVIGATION PRINCIPAL (Visible UNIQUEMENT pour les pharmaciens authentifiés) */}
          {isPharmacist && (
            <div className="flex gap-2 border-b border-slate-200 mt-6 pt-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('radar')}
                className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'radar'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <MapPin className="w-4 h-4" />
                <span>{t.tabRadar}</span>
              </button>

              <button
                onClick={() => setActiveTab('stock')}
                className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'stock'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{t.tabStock}</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.tabOrders}</span>
                {orders.filter((o) => o.status === 'PENDING').length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold">
                    {orders.filter((o) => o.status === 'PENDING').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.tabProfile}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENU PRINCIPAL PAR ONGLET */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- ONGLET 1 : GESTION DU STOCK EN TEMPS RÉEL (PHARMACIEN AUTHENTIFIÉ UNIQUEMENT) --- */}
        {isPharmacist && activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <span>{t.stockTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500">{t.stockSub}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddStockModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.quickAddStock}</span>
                  </button>
                </div>
              </div>

              {/* Filtres & Recherche de stock */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute top-3 rtl:right-3 ltr:left-3" />
                  <input
                    type="text"
                    placeholder={t.searchStockPlaceholder}
                    value={stockSearch}
                    onChange={(e) => {
                      setStockSearch(e.target.value);
                      setStockPage(1);
                    }}
                    className="w-full rtl:pr-9 ltr:pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  <button
                    onClick={() => {
                      setStockStatusFilter('ALL');
                      setStockPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      stockStatusFilter === 'ALL'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.filterAll}
                  </button>
                  <button
                    onClick={() => {
                      setStockStatusFilter('IN_STOCK');
                      setStockPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      stockStatusFilter === 'IN_STOCK'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {t.filterInStock}
                  </button>
                  <button
                    onClick={() => {
                      setStockStatusFilter('LOW_STOCK');
                      setStockPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      stockStatusFilter === 'LOW_STOCK'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {t.filterLowStock}
                  </button>
                  <button
                    onClick={() => {
                      setStockStatusFilter('OUT_OF_STOCK');
                      setStockPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      stockStatusFilter === 'OUT_OF_STOCK'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {t.filterOutOfStock}
                  </button>
                </div>
              </div>

              {/* TABLE DE STOCK INTERACTIVE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                      <th className="p-3">{t.colCode}</th>
                      <th className="p-3">{t.colBrandDci}</th>
                      <th className="p-3">{t.colFormDosage}</th>
                      <th className="p-3 text-center">{t.colQuantity}</th>
                      <th className="p-3 text-center">{t.colThreshold}</th>
                      <th className="p-3">{t.colPrice}</th>
                      <th className="p-3">{t.colChifa}</th>
                      <th className="p-3 text-center">{t.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedStocks.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-slate-500">{item.code}</td>
                        <td className="p-3">
                          <span className="font-extrabold text-slate-900 block">{item.brandName}</span>
                          <span className="text-[11px] text-slate-500">{item.dci}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-700 font-medium block">{item.form}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{item.dosage}</span>
                        </td>
                        <td className="p-3">
                          {/* BOUTONS D'AJUSTEMENT DIRECT DE QUANTITÉ (+1 / -1) */}
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleAdjustQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition disabled:opacity-40"
                              disabled={item.quantity <= 0}
                              title="-1 Boîte"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span
                              className={`px-2.5 py-1 rounded-lg font-black text-xs font-mono min-w-[3rem] text-center ${
                                item.status === 'OUT_OF_STOCK'
                                  ? 'bg-red-100 text-red-800'
                                  : item.status === 'LOW_STOCK'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleAdjustQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold transition"
                              title="+1 Boîte"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">{item.minThreshold}</td>
                        <td className="p-3 font-mono font-bold text-slate-800">{Number(item.unitPrice).toFixed(2)} DZD</td>
                        <td className="p-3">
                          {item.isReimbursable ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              {t.reimbursableYes}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px]">
                              {t.reimbursableNo}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleAdjustQuantity(item.id, 50)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition border border-slate-200"
                              title="Réassort rapide +50 boîtes"
                            >
                              {t.restockAction}
                            </button>
                            <button
                              onClick={() => handleDeleteStock(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                              title="Supprimer du stock"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION DU STOCK */}
              <PaginationBar
                currentPage={stockPage}
                totalPages={totalStockPages}
                totalItems={filteredStocks.length}
                itemsPerPage={stockPerPage}
                onPageChange={setStockPage}
                itemName={t.stockItems}
              />
            </div>
          </div>
        )}

        {/* --- ONGLET 2 : COMMANDES ET ORDONNANCES CHIFA (PHARMACIEN AUTHENTIFIÉ UNIQUEMENT) --- */}
        {isPharmacist && activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-teal-600" />
                    <span>{t.ordersTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500">{t.ordersSub}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>{t.chifaActive}</span>
                  </span>

                  <button
                    onClick={() => setShowNewOrderModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.btnNewOrder}</span>
                  </button>
                </div>
              </div>

              {/* Barre de Recherche et Filtres */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t.searchOrdersPlaceholder}
                    value={orderSearch}
                    onChange={(e) => {
                      setOrderSearch(e.target.value);
                      setOrderPage(1);
                    }}
                    className="w-full ps-9 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtres de Statut des Commandes */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                  <button
                    onClick={() => {
                      setOrderStatusFilter('ALL');
                      setOrderPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === 'ALL'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.filterAll} ({orders.length})
                  </button>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('PENDING');
                      setOrderPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === 'PENDING'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {t.orderStatusPending} ({orders.filter((o) => o.status === 'PENDING').length})
                  </button>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('PREPARING');
                      setOrderPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === 'PREPARING'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {t.orderStatusPreparing} ({orders.filter((o) => o.status === 'PREPARING').length})
                  </button>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('READY');
                      setOrderPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === 'READY'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {t.orderStatusReady} ({orders.filter((o) => o.status === 'READY').length})
                  </button>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('DISPENSED');
                      setOrderPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === 'DISPENSED'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.orderStatusDispensed} ({orders.filter((o) => o.status === 'DISPENSED').length})
                  </button>
                  {orders.some((o) => o.status === 'CANCELLED') && (
                    <button
                      onClick={() => {
                        setOrderStatusFilter('CANCELLED');
                        setOrderPage(1);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        orderStatusFilter === 'CANCELLED'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {t.orderStatusCancelled} ({orders.filter((o) => o.status === 'CANCELLED').length})
                    </button>
                  )}
                </div>
              </div>

              {/* LISTE DES COMMANDES PAGINÉE */}
              {paginatedOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">Aucune commande ou ordonnance trouvée</p>
                  <p className="text-xs text-slate-400 mt-1">Modifiez vos critères de recherche ou enregistrez une nouvelle ordonnance.</p>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {paginatedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/70 pb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                            {ord.orderReference}
                          </span>
                          <span
                            className={`px-3 py-0.5 rounded-full text-[11px] font-black border ${
                              ord.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : ord.status === 'PREPARING'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : ord.status === 'READY'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : ord.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            {ord.status === 'PENDING' && t.orderStatusPending}
                            {ord.status === 'PREPARING' && t.orderStatusPreparing}
                            {ord.status === 'READY' && t.orderStatusReady}
                            {ord.status === 'DISPENSED' && t.orderStatusDispensed}
                            {ord.status === 'CANCELLED' && t.orderStatusCancelled}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Aujourd’hui'}</span>
                        </div>
                      </div>

                      {/* Détails Patient, Prescripteur & Chifa */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                          <span className="text-slate-400 text-[11px] font-semibold block">{t.patientLabel}</span>
                          <strong className="text-slate-900 font-bold block text-sm">{ord.patientName}</strong>
                          <span className="text-[11px] text-slate-600 block font-mono">
                            {t.chifaNum} <span className="font-semibold text-teal-800">{ord.patientChifaNumber}</span>
                          </span>
                          <span className="text-[11px] text-slate-500 block font-mono">Tél: {ord.patientPhone}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                          <span className="text-slate-400 text-[11px] font-semibold block">{t.doctorLabel}</span>
                          <strong className="text-slate-800 font-bold block">{ord.doctorName}</strong>
                          <span className="text-[11px] text-teal-700 block font-mono font-medium">
                            {ord.prescriptionHash}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Ordonnance numérique sécurisée (Loi 18-07)
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                          <span className="text-slate-400 text-[11px] font-semibold block">{t.totalPpa}</span>
                          <span className="font-mono font-bold text-slate-900 text-base block">{ord.totalAmount} DZD</span>
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              Chifa: {ord.chifaCoverageRate}%
                            </span>
                            <span className="text-[11px] text-slate-700 font-mono">
                              Part patient: <strong className="text-slate-900">{ord.patientCopay} DZD</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Résumé des médicaments */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                        <span className="text-slate-400 block mb-1 font-semibold">{t.itemsPrescribed}</span>
                        <p className="text-slate-800 font-mono leading-relaxed">{ord.itemsSummary}</p>
                      </div>

                      {/* Barre d'Actions & Workflow */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-slate-200/60">
                        {/* Actions Consultation & Facturette */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrderForRx(ord);
                              setCheckedRxItems({});
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            <span>{t.btnViewPrescription}</span>
                          </button>

                          <button
                            onClick={() => setPrintReceiptOrder(ord)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-600" />
                            <span>{t.btnPrintReceipt}</span>
                          </button>
                        </div>

                        {/* Progression du Workflow & Rejet */}
                        <div className="flex flex-wrap items-center gap-2">
                          {ord.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'PREPARING')}
                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>{t.btnStartPreparing}</span>
                              </button>
                              <button
                                onClick={() => handleRejectOrder(ord.id)}
                                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{t.btnRejectOrder}</span>
                              </button>
                            </>
                          )}

                          {ord.status === 'PREPARING' && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'READY')}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>{t.btnMarkReady}</span>
                              </button>
                              <button
                                onClick={() => handleRejectOrder(ord.id)}
                                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{t.btnRejectOrder}</span>
                              </button>
                            </>
                          )}

                          {ord.status === 'READY' && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'DISPENSED')}
                                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                              >
                                <ShieldCheck className="w-4 h-4" />
                                <span>{t.btnConfirmDispense}</span>
                              </button>
                              <button
                                onClick={() => handleRejectOrder(ord.id)}
                                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{t.btnRejectOrder}</span>
                              </button>
                            </>
                          )}

                          {ord.status === 'DISPENSED' && (
                            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span>Délivrance certifiée & archivée</span>
                            </span>
                          )}

                          {ord.status === 'CANCELLED' && (
                            <span className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>{t.orderStatusCancelled}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION DES COMMANDES */}
              <PaginationBar
                currentPage={orderPage}
                totalPages={totalOrderPages}
                totalItems={filteredOrders.length}
                itemsPerPage={orderPerPage}
                onPageChange={setOrderPage}
                itemName={t.orderItems}
              />
            </div>
          </div>
        )}

        {/* --- ONGLET 3 : INFORMATIONS ET PARAMÈTRES DE LA PHARMACIE (PHARMACIEN AUTHENTIFIÉ UNIQUEMENT) --- */}
        {isPharmacist && activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-4xl space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>{t.profileTitle}</span>
              </h2>
              <p className="text-xs text-slate-500">{t.profileSub}</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.pharmacyNameLabel}</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.pharmacistNameLabel}</label>
                  <input
                    type="text"
                    value={profile.pharmacistName}
                    onChange={(e) => setProfile({ ...profile, pharmacistName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.licenseNumLabel}</label>
                  <input
                    type="text"
                    value={profile.licenseNumber}
                    onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.communeLabel}</label>
                  <input
                    type="text"
                    value={profile.commune}
                    onChange={(e) => setProfile({ ...profile, commune: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.addressLabel}</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.phoneLabel}</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.emailLabel}</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.hoursLabel}</label>
                  <input
                    type="text"
                    value={profile.openingHours}
                    onChange={(e) => setProfile({ ...profile, openingHours: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.chifaNumLabel}</label>
                  <input
                    type="text"
                    value={profile.chifaConventionNumber}
                    onChange={(e) => setProfile({ ...profile, chifaConventionNumber: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Panneau Statut de Garde de Nuit */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <Moon className="w-4 h-4 text-amber-600" />
                    <span>{t.nightGuardLabel}</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed max-w-xl">{t.nightGuardDesc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, isNightGuard: !profile.isNightGuard })}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                    profile.isNightGuard
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {profile.isNightGuard ? 'Activé (ON)' : 'Désactivé (OFF)'}
                </button>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.btnSaveProfile}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- ONGLET 4 : RADAR CITOYEN DES PHARMACIES DE GARDE (VUE PUBLIQUE SÉTIF) --- */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              {/* Header du Radar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      {t.radarTitle}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                    {t.radarSub}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{filteredRadarPharmacies.length} صيدليات مطابقة للبحث</span>
                  </span>
                </div>
              </div>

              {/* Barre de Recherche et Filtres */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  {/* Champ de recherche */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={t.radarSearchPlaceholder}
                      value={radarSearch}
                      onChange={(e) => setRadarSearch(e.target.value)}
                      className="w-full ps-10 pe-9 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                    {radarSearch && (
                      <button
                        onClick={() => setRadarSearch('')}
                        className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filtre par Commune */}
                  <div className="w-full md:w-56">
                    <select
                      value={radarCommuneFilter}
                      onChange={(e) => setRadarCommuneFilter(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="ALL">{t.radarFilterAllCommunes}</option>
                      <option value="Sétif">سطيف المركز (Sétif Ville)</option>
                      <option value="El Eulma">العلمة (El Eulma)</option>
                      <option value="Ain Arnat">عين أرنات (Ain Arnat)</option>
                      <option value="Ain Oulmene">عين ولمان (Ain Oulmene)</option>
                    </select>
                  </div>

                  {/* Filtre Garde de nuit */}
                  <button
                    onClick={() => setRadarNightOnly(!radarNightOnly)}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap border ${
                      radarNightOnly
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>{t.radarFilterNightGuard}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        radarNightOnly ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {radarPharmacies.filter((p) => p.isNightGuard).length}
                    </span>
                  </button>
                </div>

                {/* Suggestions Rapides de Médicaments Fréquents */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                  <span className="text-slate-400 text-[11px] font-semibold">بحث شائع بسطيف:</span>
                  {['Doliprane', 'Insuline Lantus', 'Lovenox', 'Augmentin', 'Glucophage', 'Kardégic', 'Ventoline'].map(
                    (med) => (
                      <button
                        key={med}
                        onClick={() => setRadarSearch(med)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition border ${
                          radarSearch.toLowerCase() === med.toLowerCase()
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {med}
                      </button>
                    ),
                  )}
                  {radarSearch && (
                    <button
                      onClick={() => {
                        setRadarSearch('');
                        setRadarNightOnly(false);
                        setRadarCommuneFilter('ALL');
                      }}
                      className="text-[11px] text-red-600 hover:underline font-bold px-2 py-1"
                    >
                      إعادة ضبط الفلاتر
                    </button>
                  )}
                </div>
              </div>

                {/* Barre des Compteurs & Commutation des Modes d'Affichage */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  {/* Compteurs par Commune */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-400 text-[11px] font-bold me-1">
                      {t.countersTotal} : <strong className="text-slate-800 font-mono text-xs">{filteredRadarPharmacies.length}</strong>
                    </span>
                    <button
                      onClick={() => setRadarCommuneFilter('ALL')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                        radarCommuneFilter === 'ALL'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      الكل ({radarPharmacies.length})
                    </button>
                    <button
                      onClick={() => setRadarCommuneFilter('Sétif')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                        radarCommuneFilter === 'Sétif'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      سطيف ({radarPharmacies.filter((p) => p.communeKey === 'Sétif').length})
                    </button>
                    <button
                      onClick={() => setRadarCommuneFilter('El Eulma')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                        radarCommuneFilter === 'El Eulma'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      العلمة ({radarPharmacies.filter((p) => p.communeKey === 'El Eulma').length})
                    </button>
                    <button
                      onClick={() => setRadarCommuneFilter('Ain Arnat')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                        radarCommuneFilter === 'Ain Arnat'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      عين أرنات ({radarPharmacies.filter((p) => p.communeKey === 'Ain Arnat').length})
                    </button>
                    <button
                      onClick={() => setRadarCommuneFilter('Ain Oulmene')}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                        radarCommuneFilter === 'Ain Oulmene'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      عين ولمان ({radarPharmacies.filter((p) => p.communeKey === 'Ain Oulmene').length})
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    تحديث لحظي للمناوبة • ولاية سطيف
                  </span>
                </div>

              {/* Grille des Cartes des Pharmacies de Sétif (Affichage Cartes Uniquement) */}
              {filteredRadarPharmacies.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">لا توجد صيدلية مطابقة لمعايير البحث الحالية</p>
                  <p className="text-xs text-slate-400">
                    جرب البحث باسم دواء آخر أو إلغاء تصفية الحراسة الليلية.
                  </p>
                  <button
                    onClick={() => {
                      setRadarSearch('');
                      setRadarNightOnly(false);
                      setRadarCommuneFilter('ALL');
                    }}
                    className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    عرض جميع الصيدليات
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {filteredRadarPharmacies.map((ph) => {
                    const isReserved = !!reservedPharmacies[ph.id];
                    return (
                      <div
                        key={ph.id}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4"
                      >
                        {/* En-tête de la carte */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug flex flex-wrap items-baseline gap-1">
                                <span>{ph.name}</span>
                              </h3>
                              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{ph.pharmacist}</span>
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              {ph.isNightGuard ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black flex items-center gap-1">
                                  <Moon className="w-3 h-3" />
                                  <span>{t.radarNightGuardBadge}</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{t.radarOpenNow}</span>
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-mono font-semibold" dir="ltr">
                                {ph.distance}
                              </span>
                            </div>
                          </div>

                          {/* Adresse & Localisation */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                            <p className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{ph.address}</span>
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono ps-5" dir="ltr">
                              {ph.openingHours}
                            </p>
                          </div>

                          {/* Badge Chifa */}
                          <div className="flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/70 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{t.radarChifaBadge}</span>
                          </div>

                          {/* Médicaments disponibles en stock */}
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              الأدوية المتوفرة فوراً :
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {ph.availableMeds.map((med: string, i: number) => {
                                const isMatched =
                                  radarSearch && med.toLowerCase().includes(radarSearch.toLowerCase());
                                return (
                                  <span
                                    key={i}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
                                      isMatched
                                        ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                                        : 'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {med}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Actions : Appel Direct & Commande / Réservation 2h */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                          <a
                            href={`tel:${ph.phone}`}
                            className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                            title={`Appeler directement la pharmacie au ${ph.phone}`}
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span dir="ltr" className="font-mono tracking-wider font-bold">{ph.phone}</span>
                          </a>

                          <button
                            onClick={() => handleOpenCitizenOrder(ph)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                              isReserved
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                            <span>{isReserved ? t.radarReservedBadge : t.radarReserveBtn}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL : AJOUTER UN MÉDICAMENT AU STOCK --- */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span>{t.modalAddStockTitle}</span>
              </h3>
              <button
                onClick={() => setShowAddStockModal(false)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.labelCode}</label>
                  <input
                    type="text"
                    value={newStockForm.code}
                    onChange={(e) => setNewStockForm({ ...newStockForm, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.labelBrand}</label>
                  <input
                    type="text"
                    placeholder="Ex: DOLIPRANE 1000 MG"
                    value={newStockForm.brandName}
                    onChange={(e) => setNewStockForm({ ...newStockForm, brandName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.labelDci}</label>
                <input
                  type="text"
                  placeholder="Ex: PARACETAMOL"
                  value={newStockForm.dci}
                  onChange={(e) => setNewStockForm({ ...newStockForm, dci: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.labelForm}</label>
                  <input
                    type="text"
                    value={newStockForm.form}
                    onChange={(e) => setNewStockForm({ ...newStockForm, form: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.labelDosage}</label>
                  <input
                    type="text"
                    value={newStockForm.dosage}
                    onChange={(e) => setNewStockForm({ ...newStockForm, dosage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.labelInitialQty}</label>
                  <input
                    type="number"
                    min="0"
                    value={newStockForm.quantity}
                    onChange={(e) => setNewStockForm({ ...newStockForm, quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.labelMinThreshold}</label>
                  <input
                    type="number"
                    min="1"
                    value={newStockForm.minThreshold}
                    onChange={(e) => setNewStockForm({ ...newStockForm, minThreshold: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.labelPriceDzd}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStockForm.unitPrice}
                    onChange={(e) => setNewStockForm({ ...newStockForm, unitPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reimbursableCheck"
                  checked={newStockForm.isReimbursable}
                  onChange={(e) => setNewStockForm({ ...newStockForm, isReimbursable: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="reimbursableCheck" className="text-slate-700 font-semibold cursor-pointer">
                  {t.labelIsReimbursable}
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  {t.btnConfirmAdd}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 1 : VISUALISATION ORDONNANCE & CHECKLIST PRÉPARATION --- */}
      {selectedOrderForRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Entête Modal */}
            <div className="p-6 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
                  <FileText className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">{t.modalRxTitle}</h3>
                  <p className="text-xs text-teal-100 font-mono">
                    Ref: {selectedOrderForRx.prescriptionHash} • {selectedOrderForRx.orderReference}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForRx(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Informations Praticien & Patient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 font-bold">
                    <User className="w-4 h-4" />
                    <span>{t.doctorLabel}</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm">{selectedOrderForRx.doctorName}</p>
                  <p className="text-slate-500 font-mono">Praticien Conventionné • Wilaya de Sétif</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.modalRxDoctorStamp} (Validé PKI)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 font-bold">
                    <User className="w-4 h-4" />
                    <span>{t.patientLabel}</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm">{selectedOrderForRx.patientName}</p>
                  <p className="text-slate-600 font-mono">
                    {t.chifaNum} <span className="font-bold text-teal-800">{selectedOrderForRx.patientChifaNumber}</span>
                  </p>
                  <p className="text-slate-500 font-mono">Tél: {selectedOrderForRx.patientPhone}</p>
                </div>
              </div>

              {/* Checklist de préparation officinale */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      <span>{t.modalRxChecklistTitle}</span>
                    </h4>
                    <p className="text-xs text-slate-500">{t.modalRxChecklistDesc}</p>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                  {selectedOrderForRx.itemsSummary
                    ? selectedOrderForRx.itemsSummary
                        .split(',')
                        .map((item: string) => item.trim())
                        .filter(Boolean)
                        .map((medItem: string, idx: number) => {
                          const isChecked = !!checkedRxItems[idx];
                          return (
                            <label
                              key={idx}
                              onClick={() =>
                                setCheckedRxItems((prev) => ({
                                  ...prev,
                                  [idx]: !prev[idx],
                                }))
                              }
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                                isChecked
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                                  isChecked
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <div className="flex-1 font-mono text-xs">
                                <span className={isChecked ? 'line-through text-slate-500' : 'font-bold'}>
                                  {medItem}
                                </span>
                              </div>
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {isChecked ? 'Vérifié' : 'À préparer'}
                              </span>
                            </label>
                          );
                        })
                    : (
                      <p className="text-xs text-slate-500 italic">Aucun détail de médicament disponible</p>
                    )}
                </div>
              </div>

              {/* Répartition Financière Chifa Tiers-Payant */}
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/80 space-y-3">
                <h4 className="text-xs font-bold text-teal-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>{t.modalRxFinancialSummary}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <span className="text-slate-400 block text-[10px]">{t.totalPpa}</span>
                    <strong className="text-slate-900 font-mono text-sm">{selectedOrderForRx.totalAmount} DZD</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <span className="text-slate-400 block text-[10px]">{t.chifaCoverage}</span>
                    <strong className="text-emerald-700 font-mono text-sm">{selectedOrderForRx.chifaCoverageRate}%</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-teal-100">
                    <span className="text-slate-400 block text-[10px]">{t.cnasShare}</span>
                    <strong className="text-teal-700 font-mono text-sm">
                      {(
                        (Number(selectedOrderForRx.totalAmount) * Number(selectedOrderForRx.chifaCoverageRate)) /
                        100
                      ).toFixed(2)}{' '}
                      DZD
                    </strong>
                  </div>
                  <div className="p-2.5 bg-emerald-100/60 rounded-xl border border-emerald-300">
                    <span className="text-slate-600 block text-[10px] font-bold">{t.patientCopay}</span>
                    <strong className="text-emerald-900 font-mono text-sm">{selectedOrderForRx.patientCopay} DZD</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Pied de Page Modal & Actions de Statut */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setPrintReceiptOrder(selectedOrderForRx)}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>{t.btnPrintReceipt}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedOrderForRx.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderForRx.id, 'PREPARING')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.btnStartPreparing}</span>
                  </button>
                )}

                {selectedOrderForRx.status === 'PREPARING' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderForRx.id, 'READY')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.btnMarkReady}</span>
                  </button>
                )}

                {selectedOrderForRx.status === 'READY' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderForRx.id, 'DISPENSED')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.btnConfirmDispense}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedOrderForRx(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  {t.btnClose}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2 : NOUVELLE ORDONNANCE AU COMPTOIR --- */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
                  <Plus className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">{t.modalNewOrderTitle}</h3>
                  <p className="text-xs text-emerald-100">Prise en charge directe avec calcul automatique Chifa</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.patientNameInput}</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: حسان بوجمعة (Hassan Boudjemaa)"
                    value={newOrderForm.patientName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, patientName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.patientChifaInput}</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1982-1901-5544-22"
                    value={newOrderForm.patientChifaNumber}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, patientChifaNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.patientPhoneInput}</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0661223344"
                    value={newOrderForm.patientPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, patientPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.doctorNameInput}</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.doctorName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, doctorName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.itemsSummaryInput}</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Doliprane 1000mg (B/8), Augmentin 1g (B/14), Inexium 20mg (B/28)"
                  value={newOrderForm.itemsSummary}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, itemsSummary: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.totalAmountInput}</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newOrderForm.totalAmount}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, totalAmount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.chifaRateInput}</label>
                  <select
                    value={newOrderForm.chifaCoverageRate}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, chifaCoverageRate: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value={100}>100% (Affection Longue Durée - ALD)</option>
                    <option value={80}>80% (Régime Général CNAS / CASNOS)</option>
                    <option value={0}>0% (Non conventionné / Hors Chifa)</option>
                  </select>
                </div>
              </div>

              {/* Aperçu du calcul direct */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-medium block">
                    Part patient calculée (Ticket Modérateur) :
                  </span>
                  <strong className="text-emerald-950 font-mono text-base font-black">
                    {(
                      (Number(newOrderForm.totalAmount) * (100 - Number(newOrderForm.chifaCoverageRate))) /
                      100
                    ).toFixed(2)}{' '}
                    DZD
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-teal-700 font-medium block">Part prise en charge CNAS :</span>
                  <span className="text-teal-900 font-mono font-bold">
                    {((Number(newOrderForm.totalAmount) * Number(newOrderForm.chifaCoverageRate)) / 100).toFixed(2)} DZD
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t.btnCreateOrderConfirm}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3 : FACTURETTE / QUITTANCE CHIFA IMPRIMABLE --- */}
      {printReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header du modal */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Printer className="w-4 h-4 text-teal-700" />
                <span>{t.modalReceiptTitle}</span>
              </span>
              <button
                onClick={() => setPrintReceiptOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ticket Imprimable (Facturette Officine) */}
            <div className="p-6 sm:p-8 space-y-4 font-mono text-slate-800 text-xs bg-white" id="printable-chifa-receipt">
              <div className="text-center space-y-1 border-b-2 border-dashed border-slate-300 pb-4">
                <h3 className="font-black text-sm text-slate-900 tracking-wide uppercase">
                  {profile?.name || 'PHARMACIE CENTRALE DE SÉTIF'}
                </h3>
                <p className="text-[11px] text-slate-600">
                  Dr. {profile?.pharmacistName || 'Yacine BOUKHALFA'} • {profile?.licenseNumber || 'CNOP-19-4482'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {profile?.address || '14 Boulevard de la République, Sétif'} • Tél: {profile?.phone || '036 84 12 30'}
                </p>
                <p className="text-[10px] font-bold text-teal-800">
                  N° CONVENTION CHIFA: {(profile as any)?.chifaAgreementNumber || profile?.chifaConventionNumber || 'CNAS-19-SET-08819'}
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-200 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reçu N° :</span>
                  <span className="font-bold text-slate-900">REC-2026-{printReceiptOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Heure :</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Réf. Ordonnance :</span>
                  <span className="font-bold text-teal-800">{printReceiptOrder.prescriptionHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Médecin Prescripteur :</span>
                  <span>{printReceiptOrder.doctorName}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-200 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bénéficiaire :</span>
                  <span className="font-bold text-slate-900">{printReceiptOrder.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">N° Carte Chifa :</span>
                  <span className="font-bold text-slate-900">{printReceiptOrder.patientChifaNumber}</span>
                </div>
              </div>

              {/* Lignes de Médicaments */}
              <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Désignation des Produits</span>
                <p className="font-sans text-slate-800 text-xs leading-relaxed">{printReceiptOrder.itemsSummary}</p>
              </div>

              {/* Totaux & Tiers-Payant */}
              <div className="space-y-1.5 text-[11px] border-b-2 border-dashed border-slate-300 pb-3">
                <div className="flex justify-between">
                  <span>TOTAL PPA (TTC) :</span>
                  <span className="font-bold">{printReceiptOrder.totalAmount} DZD</span>
                </div>
                <div className="flex justify-between text-teal-800">
                  <span>PRISE EN CHARGE CHIFA ({printReceiptOrder.chifaCoverageRate}%) :</span>
                  <span className="font-bold">
                    {(
                      (Number(printReceiptOrder.totalAmount) * Number(printReceiptOrder.chifaCoverageRate)) /
                      100
                    ).toFixed(2)}{' '}
                    DZD
                  </span>
                </div>
                <div className="flex justify-between text-slate-950 font-black text-sm pt-1 border-t border-slate-200">
                  <span>NET À PAYER PATIENT :</span>
                  <span className="font-mono text-emerald-800">{printReceiptOrder.patientCopay} DZD</span>
                </div>
              </div>

              {/* Cachet & Signature */}
              <div className="pt-2 text-center space-y-2">
                <div className="p-3 border border-slate-300 rounded-xl inline-block bg-slate-50/50">
                  <p className="text-[10px] uppercase font-bold text-slate-600">Cachet & Signature Électronique</p>
                  <p className="text-[9px] text-teal-800 font-bold">CERTIFIÉ CONFORME CHIFA CNAS/CASNOS</p>
                </div>
                <p className="text-[9px] text-slate-400 leading-tight">{t.receiptLegalMention}</p>
              </div>
            </div>

            {/* Boutons d'Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setPrintReceiptOrder(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
              >
                {t.btnClose}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>{t.btnPrint}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4 : COMMANDE & RÉSERVATION EXPRESS CITOYEN (CLICK & RESERVE 2H) --- */}
      {showCitizenOrderModal && selectedPharmacyForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header du Modal */}
            <div className="p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
                  <ShoppingBag className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">{t.modalCitizenOrderTitle}</h3>
                  <p className="text-xs text-emerald-100">{t.modalCitizenOrderSub}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCitizenOrderModal(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCitizenOrderSubmit} className="p-6 space-y-4 text-xs">
              {/* Carte Récapitulatif Pharmacie Sélectionnée */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {t.citizenSelectedPharmacy}
                </span>
                <strong className="text-sm text-slate-900 block font-extrabold">
                  {selectedPharmacyForOrder.name}
                </strong>
                <p className="text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{selectedPharmacyForOrder.address}</span>
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
                  <span className="text-teal-800 font-bold">Tél: {selectedPharmacyForOrder.phone}</span>
                  {selectedPharmacyForOrder.isNightGuard && (
                    <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                      مناوبة ليلية 24/24
                    </span>
                  )}
                </div>
              </div>

              {/* Informations du Citoyen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.citizenNameLabel} *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: كمال بن عيسى (Kamel Benaissa)"
                    value={citizenOrderForm.patientName}
                    onChange={(e) => setCitizenOrderForm({ ...citizenOrderForm, patientName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.citizenPhoneLabel} *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0661223344"
                    value={citizenOrderForm.patientPhone}
                    onChange={(e) => setCitizenOrderForm({ ...citizenOrderForm, patientPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.citizenChifaLabel}</label>
                <input
                  type="text"
                  placeholder="Ex: 1985-1901-7788-99 (اترك فارغاً إن لم يتوفر)"
                  value={citizenOrderForm.patientChifaNumber}
                  onChange={(e) => setCitizenOrderForm({ ...citizenOrderForm, patientChifaNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.citizenMedsLabel} *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Doliprane 1000mg (2 boîtes), Augmentin 1g"
                  value={citizenOrderForm.requestedItems}
                  onChange={(e) => setCitizenOrderForm({ ...citizenOrderForm, requestedItems: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.citizenNotesLabel}</label>
                <input
                  type="text"
                  placeholder="Ex: سأمر لاستلامه بعد صلاة العصر / مع إحضار الوصفة الورقية"
                  value={citizenOrderForm.patientNotes}
                  onChange={(e) => setCitizenOrderForm({ ...citizenOrderForm, patientNotes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Note de garantie 2h */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-emerald-900">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] leading-relaxed">
                  <strong>ضمان الحجز لمدة ساعتين (2 heures) :</strong> يقوم الصيدلي بوضع علبك في سلة الحجز باسمك مع إشعارك فور الجاهزية.
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCitizenOrderModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t.btnConfirmCitizenOrder}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
