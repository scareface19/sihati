'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard, useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import api from '@/lib/api';
import {
  Shield,
  CheckCircle,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Check,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Pill,
  Phone,
  Stethoscope,
  Activity,
  Download,
  X,
  RefreshCw,
  ExternalLink,
  Users,
  UserCheck,
  UserX,
  Layers,
  Radio,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Printer,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import PlatformSettingsManager from '../../components/admin/PlatformSettingsManager';
import ControlledDrugsRegistry from '../../components/admin/ControlledDrugsRegistry';

// Dictionnaire Trilingue Complet pour la Page d'Administration (Arabe, Français, Anglais)
const adminI18n = {
  ar: {
    portalBadge: 'بوابة المشرف العام والرقابة',
    legalBadge: 'ولاية سطيف • مطابقة القانون 18-07 (حماية المعطيات الصحية)',
    mainTitle: 'مركز إدارة المنصة الصحية الرقمية واللوائح الوطنية',
    addMed: 'إضافة دواء جديد',
    addRadio: 'إضافة فحص أشعة',
    addAccount: 'تفعيل / إنشاء حساب',
    // Navigation
    navTitle: 'أقسام الإدارة والرقابة',
    navOverview: 'نظرة عامة ومؤشرات',
    navAccounts: 'تأكيد الحسابات',
    navMeds: 'الأدوية 2025',
    navRadiology: 'الأشعة والفحوصات',
    navAudit: 'سجل التدقيق والتتبع المركزي (قانون 18-07 - ANPDP)',
    navSettings: 'هوية المؤسسة والطباعة (PDF)',
    navControlledDrugs: 'سجل المؤثرات العقلية والرقابة (Drugs)',
    anpdpTitle: 'حماية المعطيات الصحية (ANPDP)',
    anpdpDesc: 'كافة عمليات الإضافة والتعديل والحذف وتأكيد الحسابات موثقة ومحمية بموجب القانون الجزائري 18-07.',
    version: 'منصة صحّتي v2.5.0 • ولاية سطيف',
    // KPIs
    kpiAccounts: 'حسابات المستخدمين',
    kpiAccountsSub: 'أطباء، مواطنون وصيادلة',
    kpiMeds: 'الأدوية المسجلة 2025',
    kpiMedsSub: 'وزارة الصناعة الصيدلانية',
    kpiRadio: 'فحوصات الأشعة والتصوير',
    kpiRadioSub: 'أشعة، سكانير، رنين مغناطيسي',
    kpiAudit: 'التدقيق والحماية (18-07)',
    kpiAuditSub: 'تتبع فوري وإشعارات SOS',
    systemOperational: 'النظام يعمل بكفاءة 100%',
    // Direct Actions
    directActionsTitle: 'المهام الأساسية للمشرف العام',
    actionMedTitle: 'إضافة وتحديث الأدوية',
    actionMedDesc: 'إدراج أدوية جديدة برقم التسجيل، المادة الفعالة DCI والشكل الصيدلاني.',
    actionRadioTitle: 'إضافة فحوصات الأشعة',
    actionRadioDesc: 'إدراج فحوصات الأشعة (سكانير، رنين مغناطيسي، إيكوغرافيا) مع التحضيرات المطلوبة.',
    actionAccountTitle: 'تأكيد وتفعيل الحسابات',
    actionAccountDesc: 'تأكيد وتفعيل حسابات الأطباء، الصيادلة والمواطنين أو تجميدها عند الحاجة.',
    openValidation: 'فتح فضاء التأكيد',
    // Accounts Section
    accountsTitle: 'تأكيد وإدارة الحسابات (أطباء، مواطنون، صيادلة)',
    accountsSub: 'مراجعة بيانات التسجيل، التفعيل الفوري أو التجميد وتتبع الأدوار',
    searchAccountsPlaceholder: 'البحث بالاسم، الهاتف أو البريد...',
    allRoles: 'جميع الأدوار',
    roleDoctors: 'الأطباء (طبيب)',
    rolePatients: 'المواطنون / المرضى',
    rolePharmacies: 'الصيدليات المعتمدة',
    roleAdmins: 'هيئة الإشراف والإدارة',
    accountsCount: 'حسابات مسجلة',
    activeCount: 'حسابات مفعلة',
    verifiedActive: 'مفعل ومؤكد',
    suspendedPending: 'مجمد / قيد الانتظار',
    suspendAccount: 'تجميد الحساب',
    validateAccount: 'تأكيد وتفعيل',
    deletePermanent: 'حذف الحساب نهائياً',
    // Meds Section
    medsTitle: 'المدونة الوطنية للأدوية 2025 (560 دواء معتمد)',
    medsSub: 'إدراج، تعديل أو سحب الأدوية الرسمية الصادرة عن وزارة الصناعة الصيدلانية',
    searchMedsPlaceholder: 'البحث بالمادة الفعالة DCI أو الاسم التجاري (مثل: Paracétamol, Dolyc, Artiz)...',
    refresh: 'تحديث',
    colCode: 'الرمز',
    colDci: 'المادة الفعالة (DCI)',
    colBrand: 'الاسم التجاري',
    colForm: 'الشكل',
    colDosage: 'الجرعة',
    colCond: 'التعبئة',
    colActions: 'الإجراءات',
    modify: 'تعديل',
    removeCatalog: 'سحب من المدونة',
    // Radiology Section
    radioTitle: 'الدليل الرسمي لفحوصات الأشعة والتصوير الطبي (40 فحص)',
    radioSub: 'إدراج وتعديل فحوصات الراديو، السكانير، الرنين المغناطيسي والإيكوغرافيا',
    searchRadioPlaceholder: 'البحث باسم الفحص (مثل: صدر، دوبلر، سكانير، رنين)...',
    allCategories: 'جميع الفئات',
    catRadio: 'أشعة عادية (15)',
    catEcho: 'إيكوغرافيا ودوبلر (7)',
    catScanner: 'سكانير TDM (4)',
    catMri: 'رنين مغناطيسي IRM (4)',
    catCardio: 'استكشافات قلبية (4)',
    catEndo: 'تنظير باطني (2)',
    prepRequired: 'التحضير المطلوب للمريض :',
    // Audit Section
    auditTitle: 'سجل التدقيق والتتبع المركزي (قانون 18-07 - السلطة الوطنية ANPDP)',
    auditSub: 'تسجيل فوري وغير قابل للتعديل لكافة عمليات فتح الملفات الطبية، استشارات الطوارئ والوصفات',
    exportAnpdp: 'تصدير تقرير السلطة الوطنية ANPDP',
    author: 'المشرف :',
    role: 'الدور :',
    sosTitle: 'تتبع نداءات الاستغاثة SOS (الحماية المدنية سطيف 14)',
    sosSub: 'الوحدة المركزية 14 - ولاية سطيف',
    sosActiveBadge: '1 نداء استغاثة نشط',
    sosSignal: 'نداء استغاثة رقم',
    sosTimeAgo: 'منذ 15 دقيقة',
    sosPatient: 'المريض :',
    sosBlood: 'فصيلة الدم :',
    sosAllergy: 'الحساسية القاتلة :',
    sosPosition: 'الموقع الجغرافي :',
    sosUnitEnRoute: 'وحدة الحماية المدنية في طريقها للموقع',
    sosViewQr: 'معاينة البطاقة الصحية الرقمية QR',
    // Modals
    modalMedTitle: 'إضافة دواء جديد إلى المدونة الرسمية 2025',
    modalMedEditTitle: 'تعديل بيانات الدواء',
    codeLabel: 'رمز الدواء بالمدونة',
    regNumLabel: 'رقم التسجيل الوزاري',
    dciLabel: 'المادة الفعالة DCI',
    brandLabel: 'الاسم التجاري للمنتج',
    formLabel: 'الشكل الصيدلاني',
    dosageLabel: 'الجرعة',
    condLabel: 'التعبئة / العلبة',
    cancel: 'إلغاء',
    save: 'حفظ وتأكيد',
    modalRadioTitle: 'إضافة فحص أشعة إلى الدليل الرسمي',
    modalRadioEditTitle: 'تعديل بيانات فحص الأشعة',
    examNameLabel: 'اسم الفحص أو نوع الأشعة',
    categoryLabel: 'الفئة الطبية',
    modalityLabel: 'التقنية المعتمدة (XRAY, CT, MRI, ECG...)',
    prepLabel: 'التحضيرات الطبية المطلوبة للمريض',
    modalAccountTitle: 'إنشاء وتأكيد حساب مستخدم جديد',
    accountRoleLabel: 'نوع الحساب (الصفة)',
    firstNameLabel: 'الاسم',
    lastNameLabel: 'اللقب',
    phoneLabel: 'رقم الهاتف النقال',
    emailLabel: 'البريد الإلكتروني',
    specialtyLabel: 'التخصص الطبي',
    communeLabel: 'البلدية (ولاية سطيف)',
    orderNumLabel: 'رقم التسجيل في عمادة الأطباء (CNOM)',
    feeLabel: 'سعر الاستشارة الطبية (دج)',
    // Pagination
    showing: 'عرض',
    to: 'إلى',
    of: 'من إجمالي',
    items: 'عنصر',
    prev: 'السابق',
    next: 'التالي',
    first: 'الصفحة الأولى',
    last: 'الصفحة الأخيرة',
    // SOS & Alerts
    bloodGroupAPlus: 'فصيلة الدم A+',
    penicillin: 'بنسلين (Pénicilline)',
    setifCenterLocation: 'وسط مدينة سطيف (36.1911° N, 5.4137° E)',
    toastExportSuccess: 'تم استخراج وتصدير تقرير المطابقة للسلطة الوطنية ANPDP بنجاح.',
    toastUserActivated: 'تم تأكيد وتفعيل الحساب بنجاح.',
    toastUserSuspended: 'تم تجميد الحساب بنجاح.',
    toastUserDeleted: 'تم حذف الحساب بنجاح.',
    confirmDeleteUser: 'هل أنت متأكد من حذف هذا الحساب نهائياً؟',
    toastMedAdded: 'تمت إضافة الدواء بنجاح إلى المدونة الوطنية 2025.',
    toastMedUpdated: 'تم تعديل بيانات الدواء بنجاح.',
    toastMedDeleted: 'تم سحب الدواء من المدونة الرسمية.',
    confirmDeleteMed: 'هل أنت متأكد من سحب هذا الدواء من المدونة؟',
    toastExamAdded: 'تمت إضافة فحص الأشعة بنجاح إلى الدليل.',
    toastExamUpdated: 'تم تعديل فحص الأشعة بنجاح.',
    toastExamDeleted: 'تم حذف فحص الأشعة من الدليل.',
    confirmDeleteExam: 'هل أنت متأكد من حذف هذا الفحص من الدليل الرسمي؟',
  },
  fr: {
    portalBadge: 'Portail Super-Admin & Régulation',
    legalBadge: 'Wilaya de Sétif • Conformité Loi 18-07 (Protection des Données de Santé)',
    mainTitle: 'Centre d’Administration & Gestion des Référentiels Nationaux',
    addMed: 'Rajouter un Médicament',
    addRadio: 'Rajouter une Radiologie',
    addAccount: 'Valider / Créer Compte',
    // Navigation
    navTitle: 'Navigation Superviseur',
    navOverview: 'Vue d\'Ensemble & KPIs',
    navAccounts: 'Validation Comptes',
    navMeds: 'Nomenclature 2025',
    navRadiology: 'Radiologies & Examens',
    navAudit: 'Journal d\'Audit Centralisé (Loi 18-07 - ANPDP)',
    navSettings: 'Identité & Documents Imprimés (PDF)',
    navControlledDrugs: 'Surveillance Psychotropes & Stupéfiants (Loi 04-18)',
    anpdpTitle: 'Protection des Données (ANPDP)',
    anpdpDesc: 'Toutes les opérations d’injection, de modification, de suppression et de validation sont tracées et chiffrées selon la législation algérienne (Loi 18-07).',
    version: 'Plateforme SIHATI v2.5.0 • Wilaya de Sétif',
    // KPIs
    kpiAccounts: 'Comptes Utilisateurs',
    kpiAccountsSub: 'Médecins, Citoyens & Pharmacies',
    kpiMeds: 'Nomenclature 2025',
    kpiMedsSub: 'Médicaments Officiels MIP',
    kpiRadio: 'Examens & Radiologie',
    kpiRadioSub: 'Radios, Scanners, IRM, Doppler',
    kpiAudit: 'Audit & Sécurité (18-07)',
    kpiAuditSub: 'Traçabilité & Alertes SOS',
    systemOperational: 'Système 100% Opérationnel',
    // Direct Actions
    directActionsTitle: 'Actions Directes de l’Administrateur',
    actionMedTitle: 'Rajouter des Médicaments',
    actionMedDesc: 'Injectez de nouvelles spécialités pharmaceutiques dans la nomenclature 2025.',
    actionRadioTitle: 'Rajouter des Radiologies',
    actionRadioDesc: 'Injectez des examens d’imagerie (Radio, Scanner, IRM, Échographie) avec consignes.',
    actionAccountTitle: 'Valider les Comptes',
    actionAccountDesc: 'Validez et activez les comptes des médecins, citoyens et pharmaciens.',
    openValidation: 'Ouvrir l’Espace Validation',
    // Accounts Section
    accountsTitle: 'Validation & Gestion des Comptes (Médecins, Citoyens, Pharmacies)',
    accountsSub: 'Contrôle des accès, validation d’agréments CNOM et activation / suspension en temps réel',
    searchAccountsPlaceholder: 'Rechercher par nom, téléphone, email...',
    allRoles: 'Tous les rôles',
    roleDoctors: 'Médecins (طبيب)',
    rolePatients: 'Citoyens / Patients',
    rolePharmacies: 'Pharmacies d\'officine',
    roleAdmins: 'Administrateurs Système',
    accountsCount: 'comptes filtrés',
    activeCount: 'actifs',
    verifiedActive: 'Validé & Actif',
    suspendedPending: 'Suspendu / En attente',
    suspendAccount: 'Suspendre le Compte',
    validateAccount: 'Valider & Activer',
    deletePermanent: 'Supprimer définitivement',
    // Meds Section
    medsTitle: 'Nomenclature Pharmaceutique Nationale 2025 (560 Médicaments)',
    medsSub: 'Rajoutez, modifiez ou retirez des spécialités pharmaceutiques du catalogue officiel',
    searchMedsPlaceholder: 'Rechercher par DCI (ex: Paracétamol) ou Marque (ex: Dolyc, Artiz)...',
    refresh: 'Actualiser',
    colCode: 'Code',
    colDci: 'DCI (Principe Actif)',
    colBrand: 'Nom de Marque',
    colForm: 'Forme',
    colDosage: 'Dosage',
    colCond: 'Cond.',
    colActions: 'Actions',
    modify: 'Modifier',
    removeCatalog: 'Retirer de la nomenclature',
    // Radiology Section
    radioTitle: 'Catalogue Officiel des Examens Médicaux & Radiologies (40 Actes)',
    radioSub: 'Rajoutez, modifiez ou organisez les examens d’imagerie (Radiographies, Scanners, IRM, Échographies)',
    searchRadioPlaceholder: 'Rechercher par nom (ex: Thorax, Doppler, IRM, Coloscopie)...',
    allCategories: 'Toutes les catégories',
    catRadio: 'Radiologie Conventionnelle (15)',
    catEcho: 'Échographies & Doppler (7)',
    catScanner: 'Tomodensitométrie - Scanner (4)',
    catMri: 'IRM Résonance Magnétique (4)',
    catCardio: 'Exploration Cardiologique (4)',
    catEndo: 'Endoscopies Digestives (2)',
    prepRequired: 'Préparation requise :',
    // Audit Section
    auditTitle: 'Journal d\'Audit Centralisé (Loi 18-07 - ANPDP)',
    auditSub: 'Traçabilité certifiée et inaltérable des accès, déverrouillages de dossiers OTP et ordonnances',
    exportAnpdp: 'Exporter Rapport ANPDP',
    author: 'Auteur :',
    role: 'Rôle :',
    sosTitle: 'Flux d\'Urgence SOS (Protection Civile Sétif 14)',
    sosSub: 'Centre 14 de Sétif',
    sosActiveBadge: '1 Alerte SOS Active',
    sosSignal: 'Signal SOS #',
    sosTimeAgo: 'Il y a 15 min',
    sosPatient: 'Patient :',
    sosBlood: 'Groupe sanguin :',
    sosAllergy: 'Allergie létale :',
    sosPosition: 'Position GPS :',
    sosUnitEnRoute: 'Unité 14 en cours d’intervention',
    sosViewQr: 'Voir Carte Santé Numérique QR',
    // Modals
    modalMedTitle: 'Rajouter un Médicament (Nomenclature 2025)',
    modalMedEditTitle: 'Modifier le Médicament',
    codeLabel: 'Code Nomenclature',
    regNumLabel: 'N° d\'Enregistrement Ministériel',
    dciLabel: 'DCI (Principe Actif)',
    brandLabel: 'Nom de Marque Commerciale',
    formLabel: 'Forme Galénique',
    dosageLabel: 'Dosage',
    condLabel: 'Conditionnement',
    cancel: 'Annuler',
    save: 'Enregistrer et Injecter',
    modalRadioTitle: 'Rajouter une Radiologie / Examen Médical',
    modalRadioEditTitle: 'Modifier l’Examen Médical',
    examNameLabel: 'Nom de l’Examen ou Radiologie',
    categoryLabel: 'Catégorie Médicale',
    modalityLabel: 'Modalité Technique (XRAY, CT, MRI, ECG...)',
    prepLabel: 'Préparation requise pour le patient',
    modalAccountTitle: 'Injecter & Valider un Compte (Médecin, Citoyen, Pharmacie)',
    accountRoleLabel: 'Type de Compte (Rôle)',
    firstNameLabel: 'Prénom',
    lastNameLabel: 'Nom',
    phoneLabel: 'Téléphone Mobile',
    emailLabel: 'Email',
    specialtyLabel: 'Spécialité Médicale',
    communeLabel: 'Commune (Wilaya de Sétif)',
    orderNumLabel: 'N° Inscription Ordre (CNOM)',
    feeLabel: 'Tarif de Consultation (DZD)',
    // Pagination
    showing: 'Affichage de',
    to: 'à',
    of: 'sur',
    items: 'éléments',
    prev: 'Précédent',
    next: 'Suivant',
    first: 'Première page',
    last: 'Dernière page',
    // SOS & Alerts
    bloodGroupAPlus: 'Groupe sanguin A+',
    penicillin: 'Pénicilline',
    setifCenterLocation: 'Sétif Centre (36.1911° N, 5.4137° E)',
    toastExportSuccess: 'Export du rapport certifié ANPDP généré avec succès.',
    toastUserActivated: 'Compte validé et activé avec succès.',
    toastUserSuspended: 'Compte suspendu / désactivé avec succès.',
    toastUserDeleted: 'Compte utilisateur supprimé avec succès.',
    confirmDeleteUser: 'Êtes-vous sûr de vouloir supprimer définitivement ce compte ?',
    toastMedAdded: 'Médicament injecté avec succès dans la nomenclature 2025.',
    toastMedUpdated: 'Médicament mis à jour avec succès.',
    toastMedDeleted: 'Médicament retiré de la nomenclature.',
    confirmDeleteMed: 'Êtes-vous sûr de retirer ce médicament de la nomenclature ?',
    toastExamAdded: 'Examen / Radiologie injecté avec succès.',
    toastExamUpdated: 'Examen / Radiologie mis à jour avec succès.',
    toastExamDeleted: 'Examen supprimé du catalogue.',
    confirmDeleteExam: 'Êtes-vous sûr de supprimer cet examen ?',
  },
  en: {
    portalBadge: 'Super-Admin & Regulation Portal',
    legalBadge: 'Wilaya of Sétif • Law 18-07 Compliance (Health Data Protection)',
    mainTitle: 'Digital Health Administration & National Reference Hub',
    addMed: 'Add Medication',
    addRadio: 'Add Radiology Exam',
    addAccount: 'Validate / Create Account',
    // Navigation
    navTitle: 'Supervisor Navigation',
    navOverview: 'Overview & KPIs',
    navAccounts: 'Account Validation',
    navMeds: '2025 Nomenclature',
    navRadiology: 'Radiology & Exams',
    navAudit: 'Centralized Audit Trail (Law 18-07 - ANPDP)',
    navSettings: 'Institution Branding & PDF Documents',
    navControlledDrugs: 'Controlled Drugs Surveillance (Law 04-18)',
    anpdpTitle: 'Data Protection (ANPDP)',
    anpdpDesc: 'All injection, modification, deletion, and account verification operations are logged and encrypted under Algerian Law 18-07.',
    version: 'SIHATI Platform v2.5.0 • Wilaya of Sétif',
    // KPIs
    kpiAccounts: 'User Accounts',
    kpiAccountsSub: 'Doctors, Citizens & Pharmacies',
    kpiMeds: '2025 Nomenclature',
    kpiMedsSub: 'Official MIP Medications',
    kpiRadio: 'Examinations & Radiology',
    kpiRadioSub: 'X-Rays, Scans, MRI, Doppler',
    kpiAudit: 'Audit & Security (18-07)',
    kpiAuditSub: 'Traceability & SOS Alerts',
    systemOperational: 'System 100% Operational',
    // Direct Actions
    directActionsTitle: 'Administrator Primary Actions',
    actionMedTitle: 'Add Medications',
    actionMedDesc: 'Inject new pharmaceutical specialties into the 2025 nomenclature.',
    actionRadioTitle: 'Add Radiology Exams',
    actionRadioDesc: 'Inject imaging procedures (X-ray, CT, MRI, Ultrasound) with instructions.',
    actionAccountTitle: 'Validate Accounts',
    actionAccountDesc: 'Validate and activate accounts for doctors, citizens and pharmacists.',
    openValidation: 'Open Validation Space',
    // Accounts Section
    accountsTitle: 'Account Validation & Management (Doctors, Citizens, Pharmacies)',
    accountsSub: 'Credential review, CNOM approval validation, and real-time activation / suspension',
    searchAccountsPlaceholder: 'Search by name, phone, email...',
    allRoles: 'All roles',
    roleDoctors: 'Doctors (طبيب)',
    rolePatients: 'Citizens / Patients',
    rolePharmacies: 'Pharmacies',
    roleAdmins: 'System Administrators',
    accountsCount: 'filtered accounts',
    activeCount: 'active',
    verifiedActive: 'Verified & Active',
    suspendedPending: 'Suspended / Pending',
    suspendAccount: 'Suspend Account',
    validateAccount: 'Validate & Activate',
    deletePermanent: 'Delete Permanently',
    // Meds Section
    medsTitle: 'National Pharmaceutical Nomenclature 2025 (560 Medications)',
    medsSub: 'Add, update or withdraw official specialties from the national catalogue',
    searchMedsPlaceholder: 'Search by INN (e.g. Paracetamol) or Brand (e.g. Dolyc, Artiz)...',
    refresh: 'Refresh',
    colCode: 'Code',
    colDci: 'INN (Active Ingredient)',
    colBrand: 'Brand Name',
    colForm: 'Form',
    colDosage: 'Dosage',
    colCond: 'Pkg.',
    colActions: 'Actions',
    modify: 'Edit',
    removeCatalog: 'Withdraw from nomenclature',
    // Radiology Section
    radioTitle: 'Official Medical Examinations & Radiology Catalogue (40 Procedures)',
    radioSub: 'Add, update or organize imaging exams (X-Rays, CT Scans, MRI, Ultrasounds)',
    searchRadioPlaceholder: 'Search by name (e.g. Chest, Doppler, MRI, Colonoscopy)...',
    allCategories: 'All categories',
    catRadio: 'Conventional Radiology (15)',
    catEcho: 'Ultrasound & Doppler (7)',
    catScanner: 'CT Scanner (4)',
    catMri: 'Magnetic Resonance Imaging (4)',
    catCardio: 'Cardiological Exploration (4)',
    catEndo: 'Endoscopy (2)',
    prepRequired: 'Required preparation:',
    // Audit Section
    auditTitle: 'Centralized Audit Trail (Law 18-07 - ANPDP)',
    auditSub: 'Certified immutable audit logs of medical records access, OTP unlocks and prescriptions',
    exportAnpdp: 'Export ANPDP Report',
    author: 'Author:',
    role: 'Role:',
    sosTitle: 'Emergency SOS Feed (Civil Protection Sétif 14)',
    sosSub: 'Central Unit 14 - Sétif',
    sosActiveBadge: '1 Active SOS Alert',
    sosSignal: 'SOS Signal #',
    sosTimeAgo: '15 min ago',
    sosPatient: 'Patient:',
    sosBlood: 'Blood type:',
    sosAllergy: 'Fatal allergy:',
    sosPosition: 'GPS Coordinates:',
    sosUnitEnRoute: 'Unit 14 dispatch in progress',
    sosViewQr: 'View Digital Health Card QR',
    // Modals
    modalMedTitle: 'Add Medication (2025 Nomenclature)',
    modalMedEditTitle: 'Edit Medication',
    codeLabel: 'Nomenclature Code',
    regNumLabel: 'Ministry Registration Number',
    dciLabel: 'INN (Active Ingredient)',
    brandLabel: 'Commercial Brand Name',
    formLabel: 'Pharmaceutical Form',
    dosageLabel: 'Dosage',
    condLabel: 'Packaging',
    cancel: 'Cancel',
    save: 'Save and Inject',
    modalRadioTitle: 'Add Radiology / Medical Exam',
    modalRadioEditTitle: 'Edit Medical Examination',
    examNameLabel: 'Examination or Radiology Name',
    categoryLabel: 'Medical Category',
    modalityLabel: 'Technical Modality (XRAY, CT, MRI, ECG...)',
    prepLabel: 'Required preparation for patient',
    modalAccountTitle: 'Inject & Validate Account (Doctor, Citizen, Pharmacy)',
    accountRoleLabel: 'Account Role',
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    phoneLabel: 'Mobile Phone',
    emailLabel: 'Email',
    specialtyLabel: 'Medical Specialty',
    communeLabel: 'Municipality (Wilaya of Sétif)',
    orderNumLabel: 'Medical Board License (CNOM)',
    feeLabel: 'Consultation Fee (DZD)',
    // Pagination
    showing: 'Showing',
    to: 'to',
    of: 'of',
    items: 'items',
    prev: 'Previous',
    next: 'Next',
    first: 'First page',
    last: 'Last page',
    // SOS & Alerts
    bloodGroupAPlus: 'Blood type A+',
    penicillin: 'Penicillin',
    setifCenterLocation: 'Sétif Center (36.1911° N, 5.4137° E)',
    toastExportSuccess: 'Certified ANPDP compliance audit report exported successfully.',
    toastUserActivated: 'Account validated and activated successfully.',
    toastUserSuspended: 'Account suspended / deactivated successfully.',
    toastUserDeleted: 'User account deleted successfully.',
    confirmDeleteUser: 'Are you sure you want to permanently delete this account?',
    toastMedAdded: 'Medication injected successfully into the 2025 nomenclature.',
    toastMedUpdated: 'Medication updated successfully.',
    toastMedDeleted: 'Medication withdrawn from nomenclature.',
    confirmDeleteMed: 'Are you sure you want to withdraw this medication from the nomenclature?',
    toastExamAdded: 'Radiology / Medical examination added successfully.',
    toastExamUpdated: 'Radiology examination updated successfully.',
    toastExamDeleted: 'Examination deleted from catalog.',
    confirmDeleteExam: 'Are you sure you want to delete this examination?',
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
  const t = adminI18n[language as keyof typeof adminI18n] || adminI18n.fr;

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
            className={`min-w-[32px] h-8 rounded-xl text-xs font-bold transition ${
              p === currentPage
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
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

function AdminPortalLight() {
  const { user } = useAuth();
  const { dir, language } = useLanguage();
  const t = adminI18n[language as keyof typeof adminI18n] || adminI18n.fr;

  // Navigation dans le layout Admin
  const [currentSection, setCurrentSection] = useState<'overview' | 'accounts' | 'medications' | 'radiology' | 'audit' | 'settings' | 'controlled-drugs'>('overview');

  // Données Utilisateurs & Rôles
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'DOCTOR' | 'PATIENT' | 'PHARMACY' | 'ADMIN'>('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 8;

  // Données Médicaments (560)
  const [medications, setMedications] = useState<any[]>([]);
  const [medSearch, setMedSearch] = useState('Paracétamol');
  const [medLoading, setMedLoading] = useState(false);
  const [medPage, setMedPage] = useState(1);
  const medPerPage = 12;

  // Données Radiologies & Examens (40)
  const [examinations, setExaminations] = useState<any[]>([]);
  const [examLoading, setExamLoading] = useState(true);
  const [examCategoryFilter, setExamCategoryFilter] = useState<string>('ALL');
  const [examSearch, setExamSearch] = useState('');
  const [examPage, setExamPage] = useState(1);
  const examPerPage = 8;

  // Journal d'Audit
  const [auditPage, setAuditPage] = useState(1);
  const auditPerPage = 5;

  // Modals d'Ajout & Modification
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [editingMed, setEditingMed] = useState<any | null>(null);
  const [medForm, setMedForm] = useState({
    code: '',
    dci: '',
    brandName: '',
    form: 'COMPRIME',
    dosage: '',
    packaging: 'B/30',
    registrationNumber: '',
  });

  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState<any | null>(null);
  const [examForm, setExamForm] = useState({
    name: '',
    category: 'Radiologie Conventionnelle',
    modality: 'XRAY',
    preparation: 'Aucune',
  });

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    role: 'DOCTOR',
    specialty: 'أمراض القلب (Cardiologie)',
    commune: 'Sétif',
    licenseNumber: '',
    consultationFee: 2000,
    isActive: true,
  });

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Journal d'Audit temps réel certifié (Loi 18-07 - ANPDP)
  const initialAuditLogs = [
    {
      id: 1,
      timestamp: { ar: 'اليوم 10:42', fr: 'Aujourd’hui 10:42', en: 'Today 10:42' },
      action: { ar: 'تأكيد حساب طبيب', fr: 'Validation Compte Médecin', en: 'Doctor Account Validation' },
      user: 'Super-Admin',
      role: 'ADMIN',
      details: {
        ar: 'تأكيد الاعتماد وتفعيل حساب الدكتور بلقاضي (أمراض القلب).',
        fr: 'Validation de l’agrément et activation du compte pour Dr. Belkhodja (Cardiologie).',
        en: 'License approval and account activation for Dr. Belkhodja (Cardiology).',
      },
      severity: 'INFO',
    },
    {
      id: 2,
      timestamp: { ar: 'اليوم 10:14', fr: 'Aujourd’hui 10:14', en: 'Today 10:14' },
      action: { ar: 'فتح ملف مريض برمز OTP', fr: 'Déverrouillage Dossier Patient (Loi 18-07)', en: 'Patient File Unlock (Law 18-07)' },
      user: 'Dr. Mohamed ALI',
      role: 'DOCTOR',
      details: {
        ar: 'الاطلاع على الملف الطبي رقم #2024-784512 بعد إدخال رمز المواطن (842915).',
        fr: 'Consultation du dossier #2024-784512 validée par OTP citoyen (842915).',
        en: 'Medical record #2024-784512 access verified via citizen OTP (842915).',
      },
      severity: 'INFO',
    },
    {
      id: 3,
      timestamp: { ar: 'اليوم 09:45', fr: 'Aujourd’hui 09:45', en: 'Today 09:45' },
      action: { ar: 'تدخل نظام السلامة الدوائية (DDI)', fr: 'Intervention Sécurité Thérapeutique (DDI)', en: 'Therapeutic Safety Intervention (DDI)' },
      user: 'Moteur DDI SIHATI',
      role: 'SYSTEM',
      details: {
        ar: 'حجب تلقائي لوصف البنسلين للمريض محمد أمين لوجود حساسية خطيرة مسجلة.',
        fr: 'Blocage automatique de prescription pénicilline pour Mohamed Amine (Allergie connue).',
        en: 'Automated prescription block for Penicillin for Mohamed Amine (Known critical allergy).',
      },
      severity: 'WARNING',
    },
    {
      id: 4,
      timestamp: { ar: 'أمس 22:30', fr: 'Hier 22:30', en: 'Yesterday 22:30' },
      action: { ar: 'انطلاق نداء استغاثة SOS', fr: 'Alerte SOS Déclenchée (Protection Civile)', en: 'Emergency SOS Triggered (Civil Protection)' },
      user: 'Mohamed Amine Benali',
      role: 'PATIENT',
      details: {
        ar: 'إرسال إشارة استغاثة جغرافية مباشرة إلى الوحدة 14 للحماية المدنية بسطيف.',
        fr: 'Signal de détresse géolocalisé transmis au centre 14 de Sétif.',
        en: 'Geolocated emergency distress signal sent directly to Sétif Unit 14.',
      },
      severity: 'CRITICAL',
    },
    {
      id: 5,
      timestamp: { ar: 'أمس 18:20', fr: 'Hier 18:20', en: 'Yesterday 18:20' },
      action: { ar: 'تحديث المدونة الصيدلانية', fr: 'Mise à jour Nomenclature Médicament', en: 'Medication Nomenclature Update' },
      user: 'Super-Admin',
      role: 'ADMIN',
      details: {
        ar: 'مراجعة حالة التعويض لـ Doliprane 2,4% شراب.',
        fr: 'Vérification du statut remboursable pour Doliprane 2,4% solution buvable.',
        en: 'Reimbursement status verification for Doliprane 2.4% oral suspension.',
      },
      severity: 'INFO',
    },
    {
      id: 6,
      timestamp: { ar: 'أمس 14:10', fr: 'Hier 14:10', en: 'Yesterday 14:10' },
      action: { ar: 'تأكيد اعتماد صيدلية', fr: 'Agrément Officine Validé', en: 'Pharmacy Accreditation Validated' },
      user: 'Super-Admin',
      role: 'ADMIN',
      details: {
        ar: 'تفعيل صيدلية الدكتور يوسف بلمعزة مع الربط بنظام الشفاء.',
        fr: 'Activation de l’officine Dr. Youcef Belmaaza avec conventionnement Chifa.',
        en: 'Activation of Dr. Youcef Belmaaza pharmacy with Chifa social integration.',
      },
      severity: 'INFO',
    },
  ];

  const [auditLogs, setAuditLogs] = useState<any[]>(initialAuditLogs);

  const getLogString = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[language] || val.fr || val.ar || val.en || '';
  };

  useEffect(() => {
    fetchUsers();
    fetchMedications('Paracétamol');
    fetchExaminations();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/auth/admin/users');
      setUsersList(res.data);
    } catch (e) {
      console.error('Erreur chargement utilisateurs:', e);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchMedications = async (q: string) => {
    setMedLoading(true);
    try {
      const res = await api.get(`/medications/search?q=${encodeURIComponent(q)}&limit=100`);
      setMedications(res.data);
      setMedPage(1);
    } catch (e) {
      console.error('Erreur chargement médicaments:', e);
    } finally {
      setMedLoading(false);
    }
  };

  const fetchExaminations = async () => {
    setExamLoading(true);
    try {
      const res = await api.get('/examinations');
      setExaminations(res.data);
    } catch (e) {
      console.error('Erreur chargement examens:', e);
    } finally {
      setExamLoading(false);
    }
  };

  // Actions Gestion Utilisateurs
  const handleToggleUserActive = async (userId: number, currentActive: boolean) => {
    try {
      await api.patch(`/auth/admin/users/${userId}/toggle`, { isActive: !currentActive });
      setUsersList(usersList.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u)));
      showToast(!currentActive ? t.toastUserActivated : t.toastUserSuspended);
      setAuditLogs([
        {
          id: Date.now(),
          timestamp: { ar: 'الآن', fr: 'À l’instant', en: 'Just now' },
          action: {
            ar: !currentActive ? 'تأكيد وتفعيل الحساب' : 'تجميد الحساب',
            fr: !currentActive ? 'Validation & Activation Compte' : 'Suspension de Compte',
            en: !currentActive ? 'Account Validation & Activation' : 'Account Suspension',
          },
          user: `${user?.firstName || 'Admin'} ${user?.lastName || ''}`,
          role: 'ADMIN',
          details: {
            ar: `تحديث حالة المستخدم ID #${userId} إلى ${!currentActive ? 'مفعل' : 'مجمد'}.`,
            fr: `Mise à jour du statut utilisateur ID #${userId} vers ${!currentActive ? 'Validé' : 'Suspendu'}.`,
            en: `Updated user ID #${userId} status to ${!currentActive ? 'Active' : 'Suspended'}.`,
          },
          severity: !currentActive ? 'INFO' : 'WARNING',
        },
        ...auditLogs,
      ]);
    } catch (e) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء تعديل الحساب' : 'Erreur lors de la mise à jour du compte.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm(t.confirmDeleteUser)) return;
    try {
      await api.delete(`/auth/admin/users/${userId}`);
      setUsersList(usersList.filter((u) => u.id !== userId));
      showToast(t.toastUserDeleted);
    } catch (e) {
      showToast(language === 'ar' ? 'فشل حذف الحساب' : 'Erreur lors de la suppression.');
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userForm.role === 'DOCTOR') {
        await api.post('/doctors', {
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          phone: userForm.phone,
          email: userForm.email,
          specialty: userForm.specialty,
          commune: userForm.commune,
          clinicAddress: `Cabinet Médical, ${userForm.commune}, Sétif`,
          licenseNumber: userForm.licenseNumber || `ORD-SETIF-${Date.now().toString().slice(-4)}`,
          consultationFee: userForm.consultationFee,
          isVerified: true,
        });
        showToast(language === 'ar' ? 'تم تسجيل وتأكيد حساب الطبيب بنجاح' : 'Nouveau praticien injecté et validé.');
      } else {
        await api.post('/auth/admin/users', userForm);
        showToast(language === 'ar' ? `تم إنشاء حساب ${userForm.role} وتفعيله` : `Nouveau compte (${userForm.role}) créé et activé.`);
      }
      setShowAddUserModal(false);
      fetchUsers();
    } catch (e: any) {
      showToast(e?.response?.data?.message || (language === 'ar' ? 'خطأ أثناء إنشاء الحساب' : 'Erreur lors de la création du compte.'));
    }
  };

  // Actions Médicaments
  const handleSaveMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMed) {
        await api.put(`/medications/${editingMed.id}`, medForm);
        showToast(t.toastMedUpdated);
      } else {
        await api.post('/medications', medForm);
        showToast(t.toastMedAdded);
      }
      setShowAddMedModal(false);
      setEditingMed(null);
      fetchMedications(medSearch || 'a');
    } catch (e) {
      showToast(language === 'ar' ? 'خطأ أثناء حفظ الدواء' : 'Erreur lors de l’enregistrement du médicament.');
    }
  };

  const handleDeleteMedication = async (id: number) => {
    if (!confirm(t.confirmDeleteMed)) return;
    try {
      await api.delete(`/medications/${id}`);
      setMedications(medications.filter((m) => m.id !== id));
      showToast(t.toastMedDeleted);
    } catch (e) {
      showToast(language === 'ar' ? 'خطأ أثناء سحب الدواء' : 'Erreur lors du retrait du médicament.');
    }
  };

  const openEditMed = (m: any) => {
    setEditingMed(m);
    setMedForm({
      code: m.code || '',
      dci: m.dci || '',
      brandName: m.brandName || '',
      form: m.form || 'COMPRIME',
      dosage: m.dosage || '',
      packaging: m.packaging || 'B/30',
      registrationNumber: m.registrationNumber || '',
    });
    setShowAddMedModal(true);
  };

  // Actions Examens
  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await api.put(`/examinations/${editingExam.id}`, examForm);
        showToast(t.toastExamUpdated);
      } else {
        await api.post('/examinations', examForm);
        showToast(t.toastExamAdded);
      }
      setShowAddExamModal(false);
      setEditingExam(null);
      fetchExaminations();
    } catch (e) {
      showToast(language === 'ar' ? 'خطأ أثناء حفظ فحص الأشعة' : 'Erreur lors de l’enregistrement de l’examen.');
    }
  };

  const handleDeleteExam = async (id: number) => {
    if (!confirm(t.confirmDeleteExam)) return;
    try {
      await api.delete(`/examinations/${id}`);
      setExaminations(examinations.filter((ex) => ex.id !== id));
      showToast(t.toastExamDeleted);
    } catch (e) {
      showToast(language === 'ar' ? 'خطأ أثناء حذف الفحص' : 'Erreur lors de la suppression.');
    }
  };

  const openEditExam = (ex: any) => {
    setEditingExam(ex);
    setExamForm({
      name: ex.name,
      category: ex.category,
      modality: ex.modality,
      preparation: ex.preparation,
    });
    setShowAddExamModal(true);
  };

  // Filtrage et Pagination Utilisateurs
  const filteredUsers = usersList.filter((u) => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const q = userSearchQuery.toLowerCase();

    const matchesQuery = fullName.includes(q) || phone.includes(q) || email.includes(q);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const totalUsersPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

  // Pagination Médicaments
  const totalMedPages = Math.ceil(medications.length / medPerPage) || 1;
  const paginatedMeds = medications.slice((medPage - 1) * medPerPage, medPage * medPerPage);

  // Filtrage et Pagination Examens / Radiologies
  const filteredExams = examinations.filter((ex) => {
    const matchesCat = examCategoryFilter === 'ALL' || ex.category.includes(examCategoryFilter);
    const matchesSearch = ex.name.toLowerCase().includes(examSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalExamPages = Math.ceil(filteredExams.length / examPerPage) || 1;
  const paginatedExams = filteredExams.slice((examPage - 1) * examPerPage, examPage * examPerPage);

  // Pagination Audit Logs
  const totalAuditPages = Math.ceil(auditLogs.length / auditPerPage) || 1;
  const paginatedAudits = auditLogs.slice((auditPage - 1) * auditPerPage, auditPage * auditPerPage);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" dir={dir}>
      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SOUS-BARRE D'ACTION ADMIN UNIQUE (ÉPURÉE, THÈME CLAIR, SANS DOUBLON DE HEADER) */}
      <section className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 shadow-xs">
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>{t.portalBadge}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {t.legalBadge}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.mainTitle}
            </h1>
          </div>

          {/* 3 Boutons d'Action Rapide en Thème Clair */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditingMed(null);
                setMedForm({
                  code: '',
                  dci: '',
                  brandName: '',
                  form: 'COMPRIME',
                  dosage: '',
                  packaging: 'B/30',
                  registrationNumber: '',
                });
                setShowAddMedModal(true);
              }}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-cyan-200"
            >
              <Pill className="w-4 h-4" />
              <span>{t.addMed}</span>
            </button>

            <button
              onClick={() => {
                setEditingExam(null);
                setExamForm({
                  name: '',
                  category: 'Radiologie Conventionnelle',
                  modality: 'XRAY',
                  preparation: 'Aucune',
                });
                setShowAddExamModal(true);
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-purple-200"
            >
              <Radio className="w-4 h-4" />
              <span>{t.addRadio}</span>
            </button>

            <button
              onClick={() => {
                setUserForm({
                  firstName: '',
                  lastName: '',
                  phone: '',
                  email: '',
                  role: 'DOCTOR',
                  specialty: 'أمراض القلب (Cardiologie)',
                  commune: 'Sétif Centre',
                  licenseNumber: `ORD-SETIF-${Date.now().toString().slice(-4)}`,
                  consultationFee: 2000,
                  isActive: true,
                });
                setShowAddUserModal(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-emerald-200"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.addAccount}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CORPS PRINCIPAL : SIDEBAR LIGHT + CONTENU LIGHT */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 gap-8 items-start">
        {/* SIDEBAR NAVIGATION LIGHT */}
        <aside className="w-64 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm shrink-0 space-y-6 hidden lg:block sticky top-24">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3">
              {t.navTitle}
            </span>
            <nav className="mt-2 space-y-1.5">
              <button
                onClick={() => setCurrentSection('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  currentSection === 'overview'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t.navOverview}</span>
              </button>

              <button
                onClick={() => setCurrentSection('accounts')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  currentSection === 'accounts'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4" />
                  <span>{t.navAccounts}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                  {usersList.length}
                </span>
              </button>

              <button
                onClick={() => setCurrentSection('medications')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  currentSection === 'medications'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Pill className="w-4 h-4" />
                  <span>{t.navMeds}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-mono font-bold">
                  560
                </span>
              </button>

              <button
                onClick={() => setCurrentSection('radiology')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  currentSection === 'radiology'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4" />
                  <span>{t.navRadiology}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono font-bold">
                  {examinations.length}
                </span>
              </button>

              <button
                onClick={() => setCurrentSection('audit')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  currentSection === 'audit'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.navAudit}</span>
              </button>

              <button
                onClick={() => setCurrentSection('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  currentSection === 'settings'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>{t.navSettings}</span>
              </button>

              <button
                onClick={() => setCurrentSection('controlled-drugs')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  currentSection === 'controlled-drugs'
                    ? 'bg-rose-700 text-white shadow-md shadow-rose-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>{t.navControlledDrugs}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold font-mono">
                  2 🚨
                </span>
              </button>
            </nav>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>{t.anpdpTitle}</span>
            </div>
            <p className="text-emerald-700 text-[11px] leading-relaxed">
              {t.anpdpDesc}
            </p>
          </div>
        </aside>

        {/* ZONE DE CONTENU PRINCIPALE */}
        <main className="flex-1 space-y-6 w-full">
          {/* BARRE D'ONGLETS POUR MOBILE */}
          <div className="lg:hidden bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto gap-2">
            <button
              onClick={() => setCurrentSection('overview')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                currentSection === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              {t.navOverview}
            </button>
            <button
              onClick={() => setCurrentSection('accounts')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                currentSection === 'accounts' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              {t.navAccounts} ({usersList.length})
            </button>
            <button
              onClick={() => setCurrentSection('medications')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                currentSection === 'medications' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              {t.navMeds} (560)
            </button>
            <button
              onClick={() => setCurrentSection('radiology')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                currentSection === 'radiology' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              {t.navRadiology} ({examinations.length})
            </button>
            <button
              onClick={() => setCurrentSection('audit')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                currentSection === 'audit' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              {t.navAudit}
            </button>
            <button
              onClick={() => setCurrentSection('settings')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                currentSection === 'settings' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              {t.navSettings}
            </button>
            <button
              onClick={() => setCurrentSection('controlled-drugs')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                currentSection === 'controlled-drugs' ? 'bg-rose-700 text-white' : 'text-rose-700 bg-rose-50'
              }`}
            >
              <span>{t.navControlledDrugs}</span>
              <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded-full font-bold">2 🚨</span>
            </button>
          </div>

          {/* SECTION 1 : VUE D'ENSEMBLE (LIGHT) */}
          {currentSection === 'overview' && (
            <div className="space-y-6">
              {/* 4 Grandes Cartes Métriques (Light) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setCurrentSection('accounts')}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition shadow-xs group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t.kpiAccounts}
                    </span>
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-3">{usersList.length}</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{t.kpiAccountsSub}</span>
                    <span className="text-emerald-700 font-bold">&rarr;</span>
                  </p>
                </div>

                <div
                  onClick={() => setCurrentSection('medications')}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition shadow-xs group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t.kpiMeds}
                    </span>
                    <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-2xl group-hover:bg-cyan-600 group-hover:text-white transition">
                      <Pill className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-cyan-700 mt-3">560</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{t.kpiMedsSub}</span>
                    <span className="text-cyan-700 font-bold">&rarr;</span>
                  </p>
                </div>

                <div
                  onClick={() => setCurrentSection('radiology')}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition shadow-xs group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t.kpiRadio}
                    </span>
                    <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition">
                      <Radio className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-purple-700 mt-3">{examinations.length}</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{t.kpiRadioSub}</span>
                    <span className="text-purple-700 font-bold">&rarr;</span>
                  </p>
                </div>

                <div
                  onClick={() => setCurrentSection('audit')}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition shadow-xs group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t.kpiAudit}
                    </span>
                    <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-3">100%</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{t.kpiAuditSub}</span>
                    <span className="text-amber-700 font-bold">&rarr;</span>
                  </p>
                </div>
              </div>

              {/* Blocs d'accès direct */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>{t.directActionsTitle}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                        <Pill className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {t.actionMedTitle}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.actionMedDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMed(null);
                        setShowAddMedModal(true);
                      }}
                      className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.addMed}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Radio className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {t.actionRadioTitle}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.actionRadioDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingExam(null);
                        setShowAddExamModal(true);
                      }}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-purple-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.addRadio}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {t.actionAccountTitle}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.actionAccountDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentSection('accounts')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.openValidation}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2 : VALIDATION DES COMPTES */}
          {currentSection === 'accounts' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    <span>{t.accountsTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.accountsSub}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setUserForm({
                      firstName: '',
                      lastName: '',
                      phone: '',
                      email: '',
                      role: 'DOCTOR',
                      specialty: 'أمراض القلب (Cardiologie)',
                      commune: 'Sétif Centre',
                      licenseNumber: `ORD-SETIF-${Date.now().toString().slice(-4)}`,
                      consultationFee: 2000,
                      isActive: true,
                    });
                    setShowAddUserModal(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition shadow-sm shadow-emerald-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addAccount}</span>
                </button>
              </div>

              {/* Filtres par Rôle & Recherche */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setUserPage(1);
                    }}
                    placeholder={t.searchAccountsPlaceholder}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <select
                    value={roleFilter}
                    onChange={(e: any) => {
                      setRoleFilter(e.target.value);
                      setUserPage(1);
                    }}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 outline-none"
                  >
                    <option value="ALL">{t.allRoles} ({usersList.length})</option>
                    <option value="DOCTOR">{t.roleDoctors}</option>
                    <option value="PATIENT">{t.rolePatients}</option>
                    <option value="PHARMACY">{t.rolePharmacies}</option>
                    <option value="ADMIN">{t.roleAdmins}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{filteredUsers.length}</span> {t.accountsCount} •{' '}
                  <span className="text-emerald-700 font-bold">
                    {filteredUsers.filter((u) => u.isActive).length} {t.activeCount}
                  </span>
                </div>
              </div>

              {/* Liste paginée des comptes */}
              <div className="space-y-3">
                {usersLoading ? (
                  <div className="py-12 text-center text-xs text-slate-500 font-mono">
                    Chargement...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    Aucun résultat.
                  </div>
                ) : (
                  paginatedUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              u.role === 'DOCTOR'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : u.role === 'PHARMACY'
                                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                                : u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}
                          >
                            {u.role}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">
                            {u.firstName} {u.lastName}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              u.isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {u.isActive ? <Check className="w-3 h-3 text-emerald-700" /> : <X className="w-3 h-3 text-amber-700" />}
                            <span>{u.isActive ? t.verifiedActive : t.suspendedPending}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 flex items-center gap-3">
                          <span className="font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {u.phone}
                          </span>
                          {u.email && <span>• {u.email}</span>}
                          <span className="text-[11px] text-slate-400 font-mono">ID: #{u.id}</span>
                        </p>
                      </div>

                      {/* Actions Valider / Suspendre */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => handleToggleUserActive(u.id, u.isActive)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            u.isActive
                              ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>{t.suspendAccount}</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{t.validateAccount}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-red-600 hover:text-red-700 bg-red-50 border border-red-200 rounded-xl transition"
                          title={t.deletePermanent}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* PAGINATION COMPTES */}
              <PaginationBar
                currentPage={userPage}
                totalPages={totalUsersPages}
                totalItems={filteredUsers.length}
                itemsPerPage={usersPerPage}
                onPageChange={setUserPage}
                itemName={t.accountsCount}
              />
            </div>
          )}

          {/* SECTION 3 : NOMENCLATURE MÉDICAMENTS 2025 */}
          {currentSection === 'medications' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-cyan-600" />
                    <span>{t.medsTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.medsSub}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingMed(null);
                    setMedForm({
                      code: '',
                      dci: '',
                      brandName: '',
                      form: 'COMPRIME',
                      dosage: '',
                      packaging: 'B/30',
                      registrationNumber: '',
                    });
                    setShowAddMedModal(true);
                  }}
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition shadow-sm shadow-cyan-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addMed}</span>
                </button>
              </div>

              {/* Recherche instantanée */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={medSearch}
                    onChange={(e) => {
                      setMedSearch(e.target.value);
                      fetchMedications(e.target.value);
                    }}
                    placeholder={t.searchMedsPlaceholder}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <button
                  onClick={() => fetchMedications(medSearch)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.refresh}</span>
                </button>
              </div>

              {/* Tableau Médicaments */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{t.colCode}</th>
                      <th className="py-3 px-4">{t.colDci}</th>
                      <th className="py-3 px-4">{t.colBrand}</th>
                      <th className="py-3 px-4">{t.colForm}</th>
                      <th className="py-3 px-4">{t.colDosage}</th>
                      <th className="py-3 px-4">{t.colCond}</th>
                      <th className="py-3 px-4 text-right">{t.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {medLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                          Recherche...
                        </td>
                      </tr>
                    ) : (
                      paginatedMeds.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-cyan-800">{m.code}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900">{m.dci}</td>
                          <td className="py-3 px-4 font-bold text-emerald-700">{m.brandName}</td>
                          <td className="py-3 px-4 text-slate-600">{m.form}</td>
                          <td className="py-3 px-4 font-mono text-slate-800">{m.dosage}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{m.packaging}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => openEditMed(m)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-lg transition"
                                title={t.modify}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMedication(m.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 border border-red-200 rounded-lg transition"
                                title={t.removeCatalog}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION MÉDICAMENTS */}
              <PaginationBar
                currentPage={medPage}
                totalPages={totalMedPages}
                totalItems={medications.length}
                itemsPerPage={medPerPage}
                onPageChange={setMedPage}
                itemName={t.kpiMeds}
              />
            </div>
          )}

          {/* SECTION 4 : RADIOLOGIES & EXAMENS */}
          {currentSection === 'radiology' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-purple-600" />
                    <span>{t.radioTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.radioSub}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingExam(null);
                    setExamForm({
                      name: '',
                      category: 'Radiologie Conventionnelle',
                      modality: 'XRAY',
                      preparation: 'Aucune',
                    });
                    setShowAddExamModal(true);
                  }}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition shadow-sm shadow-purple-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addRadio}</span>
                </button>
              </div>

              {/* Filtres Examens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={examSearch}
                    onChange={(e) => {
                      setExamSearch(e.target.value);
                      setExamPage(1);
                    }}
                    placeholder={t.searchRadioPlaceholder}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <select
                    value={examCategoryFilter}
                    onChange={(e) => {
                      setExamCategoryFilter(e.target.value);
                      setExamPage(1);
                    }}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 outline-none"
                  >
                    <option value="ALL">{t.allCategories} ({examinations.length})</option>
                    <option value="Radiologie Conventionnelle">{t.catRadio}</option>
                    <option value="Échographie">{t.catEcho}</option>
                    <option value="Scanner">{t.catScanner}</option>
                    <option value="IRM">{t.catMri}</option>
                    <option value="Exploration Cardiologique">{t.catCardio}</option>
                    <option value="Endoscopie">{t.catEndo}</option>
                  </select>
                </div>
              </div>

              {/* Grille des examens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examLoading ? (
                  <div className="col-span-2 py-8 text-center text-xs text-slate-500 font-mono">
                    Chargement...
                  </div>
                ) : filteredExams.length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-xs text-slate-500">
                    Aucun résultat.
                  </div>
                ) : (
                  paginatedExams.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center font-mono">
                            #{ex.id}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{ex.name}</h4>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {ex.category}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-500">{t.prepRequired} {ex.preparation}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditExam(ex)}
                          className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition"
                          title={t.modify}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(ex.id)}
                          className="p-2 text-red-500 hover:text-red-700 bg-red-50 border border-red-200 rounded-xl transition"
                          title={t.removeCatalog}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* PAGINATION RADIOLOGIES */}
              <PaginationBar
                currentPage={examPage}
                totalPages={totalExamPages}
                totalItems={filteredExams.length}
                itemsPerPage={examPerPage}
                onPageChange={setExamPage}
                itemName={t.kpiRadio}
              />
            </div>
          )}

          {/* SECTION 5 : AUDIT SÉCURITÉ LOI 18-07 & URGENCES SOS (CENTRALISÉ) */}
          {currentSection === 'audit' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Journal d'Audit Traçable */}
              <div className="xl:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-purple-700" />
                      <span>{t.auditTitle}</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      {t.auditSub}
                    </p>
                  </div>
                  <button
                    onClick={() => showToast(t.toastExportSuccess)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.exportAnpdp}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {paginatedAudits.map((log) => (
                    <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          {log.severity === 'CRITICAL' ? (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          ) : log.severity === 'WARNING' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                          )}
                          <span>{getLogString(log.action)}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{getLogString(log.timestamp)}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{getLogString(log.details)}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {t.author} {log.user}
                        </span>
                        <span className="text-[10px] font-mono text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {t.role} {log.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION AUDIT */}
                <PaginationBar
                  currentPage={auditPage}
                  totalPages={totalAuditPages}
                  totalItems={auditLogs.length}
                  itemsPerPage={auditPerPage}
                  onPageChange={setAuditPage}
                  itemName={t.navAudit}
                />
              </div>

              {/* Flux SOS Protection Civile Sétif */}
              <div className="xl:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>{t.sosTitle}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">{t.sosSub}</p>
                  </div>
                  <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                    {t.sosActiveBadge}
                  </span>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center font-bold text-red-900">
                    <span>{t.sosSignal}2026-0929</span>
                    <span className="text-[10px] font-mono text-red-700">{t.sosTimeAgo}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {t.sosPatient} <strong className="text-slate-900">Mohamed Amine Benali</strong> ({t.bloodGroupAPlus})<br />
                    {t.sosAllergy} <strong className="text-red-700">{t.penicillin}</strong><br />
                    {t.sosPosition} {t.setifCenterLocation}
                  </p>
                  <div className="pt-2 flex justify-between items-center border-t border-red-200">
                    <span className="text-[10px] text-emerald-700 font-bold">{t.sosUnitEnRoute}</span>
                    <Link
                      href="/emergency-card"
                      className="text-[11px] font-bold text-red-800 hover:text-red-950 underline flex items-center gap-1"
                    >
                      <span>{t.sosViewQr}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6 : CONFIGURATION DE LA PLATEFORME & ENTÊTE D'IMPRESSION PDF */}
          {currentSection === 'settings' && (
            <PlatformSettingsManager />
          )}

          {/* SECTION 7 : SURVEILLANCE DES ACHATS DE DRUGS ET PSYCHOTROPES (LOI 04-18) */}
          {currentSection === 'controlled-drugs' && (
            <ControlledDrugsRegistry />
          )}
        </main>
      </div>

      {/* --- MODAL 1 : RAJOUTER UN MÉDICAMENT --- */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Pill className="w-5 h-5 text-cyan-600" />
                <span>{editingMed ? t.modalMedEditTitle : t.modalMedTitle}</span>
              </h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedication} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.codeLabel}</label>
                  <input
                    type="text"
                    required
                    value={medForm.code}
                    onChange={(e) => setMedForm({ ...medForm, code: e.target.value })}
                    placeholder="ex: 03 B 005"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.regNumLabel}</label>
                  <input
                    type="text"
                    required
                    value={medForm.registrationNumber}
                    onChange={(e) => setMedForm({ ...medForm, registrationNumber: e.target.value })}
                    placeholder="ex: 268/03 B 005/06/21"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.dciLabel}</label>
                <input
                  type="text"
                  required
                  value={medForm.dci}
                  onChange={(e) => setMedForm({ ...medForm, dci: e.target.value })}
                  placeholder="ex: PARACETAMOL, AMOXICILLINE, LORATADINE"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.brandLabel}</label>
                <input
                  type="text"
                  required
                  value={medForm.brandName}
                  onChange={(e) => setMedForm({ ...medForm, brandName: e.target.value })}
                  placeholder="ex: DOLYC, ARTIZ, HISTAGAN"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.formLabel}</label>
                  <input
                    type="text"
                    required
                    value={medForm.form}
                    onChange={(e) => setMedForm({ ...medForm, form: e.target.value })}
                    placeholder="COMPRIME, GELULE"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.dosageLabel}</label>
                  <input
                    type="text"
                    required
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                    placeholder="500MG, 1G"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.condLabel}</label>
                  <input
                    type="text"
                    required
                    value={medForm.packaging}
                    onChange={(e) => setMedForm({ ...medForm, packaging: e.target.value })}
                    placeholder="B/20, B/30"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2 : RAJOUTER UNE RADIOLOGIE --- */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-600" />
                <span>{editingExam ? t.modalRadioEditTitle : t.modalRadioTitle}</span>
              </h3>
              <button onClick={() => setShowAddExamModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.examNameLabel}</label>
                <input
                  type="text"
                  required
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  placeholder="ex: Radiographie du thorax, Échographie Doppler, Scanner abdominal"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.categoryLabel}</label>
                  <select
                    value={examForm.category}
                    onChange={(e) => setExamForm({ ...examForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="Radiologie Conventionnelle">Radiologie Conventionnelle</option>
                    <option value="Échographie">Échographie & Doppler</option>
                    <option value="Tomodensitométrie (Scanner)">Tomodensitométrie (Scanner)</option>
                    <option value="Imagerie par Résonance Magnétique">IRM Résonance Magnétique</option>
                    <option value="Exploration Cardiologique">Exploration Cardiologique</option>
                    <option value="Endoscopie Médicale">Endoscopie Médicale</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.modalityLabel}</label>
                  <input
                    type="text"
                    required
                    value={examForm.modality}
                    onChange={(e) => setExamForm({ ...examForm, modality: e.target.value })}
                    placeholder="XRAY, ULTRASOUND, CT, MRI, ECG"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.prepLabel}</label>
                <input
                  type="text"
                  value={examForm.preparation}
                  onChange={(e) => setExamForm({ ...examForm, preparation: e.target.value })}
                  placeholder="ex: À jeun depuis 6h, Vessie pleine..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3 : VALIDER / CRÉER UN COMPTE --- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>{t.modalAccountTitle}</span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.accountRoleLabel}</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  <option value="DOCTOR">{t.roleDoctors}</option>
                  <option value="PATIENT">{t.rolePatients}</option>
                  <option value="PHARMACY">{t.rolePharmacies}</option>
                  <option value="ADMIN">{t.roleAdmins}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.firstNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                    placeholder="ex: Mohamed"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.lastNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                    placeholder="ex: Belkacem"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.phoneLabel}</label>
                  <input
                    type="text"
                    required
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.emailLabel}</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="nom@sihati.dz"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Champs spécifiques au médecin */}
              {userForm.role === 'DOCTOR' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t.specialtyLabel}</label>
                    <select
                      value={userForm.specialty}
                      onChange={(e) => setUserForm({ ...userForm, specialty: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    >
                      <option value="أمراض القلب (Cardiologie)">أمراض القلب (Cardiologie)</option>
                      <option value="أمراض النساء والتوليد (Gynécologie)">أمراض النساء والتوليد (Gynécologie)</option>
                      <option value="طب الأطفال (Pédiatrie)">طب الأطفال (Pédiatrie)</option>
                      <option value="أمراض الجلد (Dermatologie)">أمراض الجلد (Dermatologie)</option>
                      <option value="أنف وأذن وحنجرة (ORL)">أنف وأذن وحنجرة (ORL)</option>
                      <option value="طب العيون (Ophtalmologie)">طب العيون (Ophtalmologie)</option>
                      <option value="أمراض صدرية (Pneumologie)">أمراض صدرية (Pneumologie)</option>
                      <option value="أمراض المسالك البولية (Urologie)">أمراض المسالك البولية (Urologie)</option>
                      <option value="الطب العام (Médecine Générale)">الطب العام (Médecine Générale)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">{t.communeLabel}</label>
                      <input
                        type="text"
                        value={userForm.commune}
                        onChange={(e) => setUserForm({ ...userForm, commune: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">{t.orderNumLabel}</label>
                      <input
                        type="text"
                        value={userForm.licenseNumber}
                        onChange={(e) => setUserForm({ ...userForm, licenseNumber: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <AdminPortalLight />
    </AuthGuard>
  );
}
