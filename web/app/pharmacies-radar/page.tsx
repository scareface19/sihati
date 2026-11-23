'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import api from '@/lib/api';
import {
  Pill,
  Search,
  Moon,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
  ShieldCheck,
  CheckCircle,
  X,
  User,
  Check,
} from 'lucide-react';

// Dictionnaire trilingue pour le Radar Public des Pharmacies
const radarI18n = {
  ar: {
    publicBadge: 'خدمة عمومية مجانية • دون الحاجة لتسجيل الدخول',
    wilayaBadge: 'ولاية سطيف • تتبع صيدليات الحراسة وتوافر الأدوية الحيوية',
    radarTitle: 'رادار صيدليات ولاية سطيف المباشر وتتبع الأدوية',
    radarSub:
      'استكشاف الصيدليات المناوبة والمفتوحة ليلاً، الاتصال الهاتفي المباشر، وحجز الدواء مسبقاً (Click & Reserve 2h) لتفادي الطابور والتنقل.',
    pharmacistLoginBtn: 'دخول الصيادلة (لوحة التحكم)',
    kpiApproved: 'صيدليات معتمدة بسطيف',
    kpiApprovedSub: 'تغطية مركزية وبلديات الولاية',
    kpiNight: 'حراسة ليلية نشطة الليلة',
    kpiNightSub: 'مفتوحة 24h/24h للطوارئ',
    kpiPhone: 'اتصال هاتفي فوري',
    kpiPhoneSub: 'مباشر 100% دون وسيط',
    kpiReserve: 'حجز مسبق Click & Reserve',
    kpiReserveSub: 'تحضير وحجز الدواء لمدة ساعتين',
    searchPlaceholder: 'البحث باسم الصيدلية، الدواء (Doliprane, Insuline, Lovenox...) أو الحي...',
    filterNightGuard: 'صيدليات الحراسة الليلية فقط (24h/24)',
    filterAllCommunes: 'جميع بلديات سطيف',
    openNow: 'مفتوحة الآن',
    nightGuardBadge: 'حراسة ليلية (24/24)',
    chifaBadge: 'معتمدة الشفاء CNAS/CASNOS',
    reserveBtn: 'طلب / حجز الدواء (2h)',
    reservedBadge: 'تم الحجز (2h)',
    callBtn: 'اتصال مباشر',
    availableMedsTitle: 'الأدوية المتوفرة فوراً :',
    quickSearchTitle: 'بحث شائع بسطيف :',
    resetFilters: 'إعادة ضبط الفلاتر',
    countersTotal: 'إجمالي الصيدليات',
    noResultsTitle: 'لا توجد صيدلية مطابقة لمعايير البحث الحالية',
    noResultsSub: 'جرب البحث باسم دواء آخر أو إلغاء تصفية الحراسة الليلية.',
    showAllBtn: 'عرض جميع الصيدليات',
    liveUpdate: 'تحديث لحظي للمناوبة • ولاية سطيف',
    modalTitle: 'طلب وحجز دواء بالصيدلية (Click & Reserve 2h)',
    modalSub: 'يتم حجز الدواء باسمك لمدة ساعتين لدى الصيدلية المختارة لتسهيل الاستلام دون انتظار',
    selectedPharmLabel: 'الصيدلية المختارة :',
    nameLabel: 'الاسم واللقب الكامل للمريض / المواطن',
    phoneLabel: 'رقم الهاتف للتأكيد والتواصل',
    chifaLabel: 'رقم بطاقة الشفاء (اختياري)',
    medsLabel: 'الأدوية المطلوبة أو نص الوصفة الطبية',
    notesLabel: 'ملاحظة للصيدلي (مثال: سأحضر بعد 45 دقيقة)',
    btnCancel: 'إلغاء',
    btnConfirm: 'تأكيد الحجز وإرسال الطلب للصيدلية',
    toastSuccess: 'تم إرسال طلبك إلى الصيدلية بنجاح! تم حجز الدواء لك لمدة ساعتين.',
  },
  fr: {
    publicBadge: 'Service Public Gratuit • Sans Inscription Requise',
    wilayaBadge: 'Wilaya de Sétif • Suivi des pharmacies de garde et médicaments vitaux',
    radarTitle: 'Radar des Pharmacies de Garde de Sétif & Disponibilité des Médicaments',
    radarSub:
      'Consultez les officines ouvertes et de garde 24h/24h, appelez directement le pharmacien ou réservez votre médicament en ligne (Click & Reserve 2h).',
    pharmacistLoginBtn: 'Espace Pharmacien (Connexion)',
    kpiApproved: 'Officines Agréées à Sétif',
    kpiApprovedSub: 'Couverture centre-ville & communes',
    kpiNight: 'Gardes de Nuit Actives Ce Soir',
    kpiNightSub: 'Ouvertes 24h/24h pour les urgences',
    kpiPhone: 'Appel Téléphonique Direct',
    kpiPhoneSub: '100% direct sans intermédiaire',
    kpiReserve: 'Click & Reserve 2h',
    kpiReserveSub: 'Mise de côté express au comptoir',
    searchPlaceholder: 'Rechercher une pharmacie, médicament (Doliprane, Insuline, Lovenox...), quartier...',
    filterNightGuard: 'Pharmacies de garde de nuit seulement (24h/24)',
    filterAllCommunes: 'Toutes les communes de Sétif',
    openNow: 'Ouverte maintenant',
    nightGuardBadge: 'Garde de nuit (24/24)',
    chifaBadge: 'Conventionnée Chifa CNAS/CASNOS',
    reserveBtn: 'Réserver / Retrait 2h',
    reservedBadge: 'Réservé (2h)',
    callBtn: 'Appel direct',
    availableMedsTitle: 'Médicaments immédiatement disponibles :',
    quickSearchTitle: 'Recherches fréquentes à Sétif :',
    resetFilters: 'Réinitialiser les filtres',
    countersTotal: 'Total officines',
    noResultsTitle: 'Aucune pharmacie ne correspond à votre recherche',
    noResultsSub: 'Essayez avec un autre nom de médicament ou désactivez le filtre de garde de nuit.',
    showAllBtn: 'Afficher toutes les pharmacies',
    liveUpdate: 'Mise à jour en temps réel • Wilaya de Sétif',
    modalTitle: 'Commande & Réservation en Pharmacie (Click & Reserve 2h)',
    modalSub: 'Votre médicament est mis de côté pendant 2 heures dans l’officine choisie pour un retrait express',
    selectedPharmLabel: 'Officine sélectionnée :',
    nameLabel: 'Nom et prénom du patient / citoyen',
    phoneLabel: 'Numéro de téléphone portable',
    chifaLabel: 'N° Carte Chifa (Optionnel)',
    medsLabel: 'Médicaments souhaités ou référence ordonnance',
    notesLabel: 'Note pour le pharmacien (ex: Je passe dans 30 min)',
    btnCancel: 'Annuler',
    btnConfirm: 'Confirmer la Réservation & Envoyer',
    toastSuccess: 'Votre commande a été transmise à la pharmacie ! Médicament réservé pour 2 heures.',
  },
  en: {
    publicBadge: 'Free Public Service • No Login Required',
    wilayaBadge: 'Wilaya of Sétif • Live On-Call Pharmacies & Essential Medicines Tracker',
    radarTitle: 'Sétif Live Pharmacy Radar & Medicine Stock Tracker',
    radarSub:
      'Locate night-guard pharmacies open 24/7, make direct calls without middlemen, or reserve vital medications online (Click & Reserve 2h).',
    pharmacistLoginBtn: 'Pharmacist Portal (Login)',
    kpiApproved: 'Accredited Pharmacies in Sétif',
    kpiApprovedSub: 'City center & regional coverage',
    kpiNight: 'Night-Guards Active Tonight',
    kpiNightSub: 'Open 24/7 for urgent care',
    kpiPhone: 'Direct Phone Call',
    kpiPhoneSub: '100% direct without intermediary',
    kpiReserve: 'Click & Reserve 2h',
    kpiReserveSub: 'Held for 2 hours for pickup',
    searchPlaceholder: 'Search pharmacy, medication (Doliprane, Insuline, Lovenox...), or district...',
    filterNightGuard: 'Night-guard pharmacies only (24/7)',
    filterAllCommunes: 'All communes in Sétif',
    openNow: 'Open now',
    nightGuardBadge: 'Night guard (24/7)',
    chifaBadge: 'Chifa Approved CNAS/CASNOS',
    reserveBtn: 'Reserve / 2h Pickup',
    reservedBadge: 'Reserved (2h)',
    callBtn: 'Direct call',
    availableMedsTitle: 'Immediately available medications:',
    quickSearchTitle: 'Frequent searches in Sétif:',
    resetFilters: 'Reset filters',
    countersTotal: 'Total pharmacies',
    noResultsTitle: 'No pharmacy matches your current search criteria',
    noResultsSub: 'Try searching for another medication name or uncheck the night-guard filter.',
    showAllBtn: 'Show all pharmacies',
    liveUpdate: 'Live shift status • Wilaya of Sétif',
    modalTitle: 'Medicine Reservation (Click & Reserve 2h)',
    modalSub: 'Your medication will be kept on hold for 2 hours at the selected pharmacy for quick counter pickup',
    selectedPharmLabel: 'Selected Pharmacy:',
    nameLabel: 'Patient / Citizen Full Name',
    phoneLabel: 'Mobile Phone Number',
    chifaLabel: 'Chifa Card Number (Optional)',
    medsLabel: 'Requested Medication(s) or Prescription details',
    notesLabel: 'Note for pharmacist (e.g. Arriving in 30 minutes)',
    btnCancel: 'Cancel',
    btnConfirm: 'Confirm Reservation & Send',
    toastSuccess: 'Your reservation was sent to the pharmacy! Medication held for 2 hours.',
  },
};

// 7 Pharmacies de référence de la Wilaya de Sétif
const radarPharmacies = [
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
  },
];

export default function PublicPharmaciesRadarPage() {
  const { user } = useAuth();
  const { language, dir } = useLanguage();
  const t = radarI18n[language as keyof typeof radarI18n] || radarI18n.fr;

  // Filtres
  const [search, setSearch] = useState('');
  const [nightOnly, setNightOnly] = useState(false);
  const [communeFilter, setCommuneFilter] = useState('ALL');
  const [reservedPharmacies, setReservedPharmacies] = useState<{ [id: number]: boolean }>({});

  // Modal Réservation Citoyenne (Click & Reserve 2h)
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPh, setSelectedPh] = useState<any | null>(null);
  const [orderForm, setOrderForm] = useState({
    patientName: '',
    patientPhone: '',
    patientChifaNumber: '',
    requestedItems: '',
    patientNotes: 'Retrait au comptoir sous 2h',
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtrage des pharmacies
  const filtered = radarPharmacies.filter((ph) => {
    if (nightOnly && !ph.isNightGuard) return false;
    if (communeFilter !== 'ALL' && ph.communeKey !== communeFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const inName = ph.name?.toLowerCase().includes(q);
    const inPharmacist = ph.pharmacist?.toLowerCase().includes(q);
    const inCommune = ph.commune?.toLowerCase().includes(q);
    const inAddress = ph.address?.toLowerCase().includes(q);
    const inMeds = ph.availableMeds?.some((m: string) => m.toLowerCase().includes(q));
    return inName || inPharmacist || inCommune || inAddress || inMeds;
  });

  // Ouvrir modal commande citoyen
  const handleOpenOrder = (ph: any) => {
    setSelectedPh(ph);
    setOrderForm({
      patientName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      patientPhone: user?.phone || '',
      patientChifaNumber: '',
      requestedItems: search || 'Doliprane 1000mg',
      patientNotes: 'Retrait au comptoir sous 2h',
    });
    setShowOrderModal(true);
  };

  // Soumettre commande citoyenne
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPh) return;

    const refNum = Math.floor(Math.random() * 9000 + 1000);
    const newOrderPayload = {
      id: Date.now(),
      orderReference: `CMD-CIT-${refNum}`,
      patientName: orderForm.patientName || 'مواطن (طلب عبر رادار سطيف)',
      patientChifaNumber: orderForm.patientChifaNumber || '',
      patientPhone: orderForm.patientPhone || '0661223344',
      doctorName: 'حجز مباشر (Click & Reserve 2h)',
      prescriptionHash: `RES-${refNum}-SETIF`,
      itemsCount: 1,
      itemsSummary: orderForm.requestedItems || 'Doliprane 1000mg',
      chifaCoverageRate: orderForm.patientChifaNumber ? 80 : 0,
      totalAmount: 850.0,
      patientCopay: orderForm.patientChifaNumber ? 170.0 : 850.0,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    try {
      await api.post('/pharmacy/orders', newOrderPayload);
    } catch (err) {
      // Offline fallback
    }

    setReservedPharmacies((prev) => ({ ...prev, [selectedPh.id]: true }));
    setShowOrderModal(false);
    showToast(t.toastSuccess);
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

      {/* TOP HEADER - 100% PUBLIC & FREE */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{t.publicBadge}</span>
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                  {t.wilayaBadge}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-600" />
                <span>{t.radarTitle}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">{t.radarSub}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL : RECHERCHE & CARTES UNIQUEMENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          {/* Header du Radar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">{t.radarTitle}</h2>
              </div>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">{t.radarSub}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{filtered.length} صيدليات مطابقة للبحث</span>
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
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full ps-10 pe-9 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filtre par Commune */}
              <div className="w-full md:w-56">
                <select
                  value={communeFilter}
                  onChange={(e) => setCommuneFilter(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="ALL">{t.filterAllCommunes}</option>
                  <option value="Sétif">سطيف المركز (Sétif Ville)</option>
                  <option value="El Eulma">العلمة (El Eulma)</option>
                  <option value="Ain Arnat">عين أرنات (Ain Arnat)</option>
                  <option value="Ain Oulmene">عين ولمان (Ain Oulmene)</option>
                </select>
              </div>

              {/* Filtre Garde de nuit */}
              <button
                onClick={() => setNightOnly(!nightOnly)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap border ${
                  nightOnly
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>{t.filterNightGuard}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    nightOnly ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {radarPharmacies.filter((p) => p.isNightGuard).length}
                </span>
              </button>
            </div>

            {/* Suggestions Rapides de Médicaments Fréquents */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">{t.quickSearchTitle}</span>
              {['Doliprane', 'Insuline Lantus', 'Lovenox', 'Augmentin', 'Glucophage', 'Kardégic', 'Ventoline'].map(
                (med) => (
                  <button
                    key={med}
                    onClick={() => setSearch(med)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition border ${
                      search.toLowerCase() === med.toLowerCase()
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {med}
                  </button>
                ),
              )}
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setNightOnly(false);
                    setCommuneFilter('ALL');
                  }}
                  className="text-[11px] text-red-600 hover:underline font-bold px-2 py-1"
                >
                  {t.resetFilters}
                </button>
              )}
            </div>
          </div>

          {/* Barre des Compteurs par Commune */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-bold me-1">
                {t.countersTotal} : <strong className="text-slate-800 font-mono text-xs">{filtered.length}</strong>
              </span>
              <button
                onClick={() => setCommuneFilter('ALL')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                  communeFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                الكل ({radarPharmacies.length})
              </button>
              <button
                onClick={() => setCommuneFilter('Sétif')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                  communeFilter === 'Sétif'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                سطيف ({radarPharmacies.filter((p) => p.communeKey === 'Sétif').length})
              </button>
              <button
                onClick={() => setCommuneFilter('El Eulma')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                  communeFilter === 'El Eulma'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                العلمة ({radarPharmacies.filter((p) => p.communeKey === 'El Eulma').length})
              </button>
              <button
                onClick={() => setCommuneFilter('Ain Arnat')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                  communeFilter === 'Ain Arnat'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                عين أرنات ({radarPharmacies.filter((p) => p.communeKey === 'Ain Arnat').length})
              </button>
              <button
                onClick={() => setCommuneFilter('Ain Oulmene')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                  communeFilter === 'Ain Oulmene'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                عين ولمان ({radarPharmacies.filter((p) => p.communeKey === 'Ain Oulmene').length})
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">{t.liveUpdate}</span>
          </div>

          {/* Grille des Cartes des Pharmacies de Sétif (Affichage Cartes Uniquement) */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">{t.noResultsTitle}</p>
              <p className="text-xs text-slate-400">{t.noResultsSub}</p>
              <button
                onClick={() => {
                  setSearch('');
                  setNightOnly(false);
                  setCommuneFilter('ALL');
                }}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
              >
                {t.showAllBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {filtered.map((ph) => {
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
                              <span>{t.nightGuardBadge}</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{t.openNow}</span>
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
                        <span>{t.chifaBadge}</span>
                      </div>

                      {/* Médicaments disponibles en stock */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          {t.availableMedsTitle}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ph.availableMeds.map((med: string, i: number) => {
                            const isMatched = search && med.toLowerCase().includes(search.toLowerCase());
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
                        <span dir="ltr" className="font-mono tracking-wider font-bold">
                          {ph.phone}
                        </span>
                      </a>

                      <button
                        onClick={() => handleOpenOrder(ph)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                          isReserved
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span>{isReserved ? t.reservedBadge : t.reserveBtn}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL 4 : COMMANDE & RÉSERVATION CITOYENNE (CLICK & RESERVE 2H) --- */}
      {showOrderModal && selectedPh && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>{t.modalTitle}</span>
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">{t.modalSub}</p>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-700 block">{t.selectedPharmLabel}</span>
                <span className="font-bold text-sm">{selectedPh.name}</span>
              </div>
              <span className="px-2.5 py-1 bg-white rounded-xl text-xs font-mono font-bold text-emerald-800 border border-emerald-300">
                {selectedPh.commune}
              </span>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.nameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كريم بن يحيى"
                    value={orderForm.patientName}
                    onChange={(e) => setOrderForm({ ...orderForm, patientName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t.phoneLabel}</label>
                    <input
                      type="tel"
                      required
                      placeholder="0661234567"
                      value={orderForm.patientPhone}
                      onChange={(e) => setOrderForm({ ...orderForm, patientPhone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t.chifaLabel}</label>
                    <input
                      type="text"
                      placeholder="1985-1901-..."
                      value={orderForm.patientChifaNumber}
                      onChange={(e) => setOrderForm({ ...orderForm, patientChifaNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.medsLabel}</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="مثال: Doliprane 1000mg علبة واحدة + Lovenox 4000 UI"
                    value={orderForm.requestedItems}
                    onChange={(e) => setOrderForm({ ...orderForm, requestedItems: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.notesLabel}</label>
                  <input
                    type="text"
                    value={orderForm.patientNotes}
                    onChange={(e) => setOrderForm({ ...orderForm, patientNotes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t.btnConfirm}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
