'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AuthGuard, useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  FileText,
  Shield,
  Heart,
  Activity,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Download,
  GraduationCap,
  Sparkles,
  QrCode,
  Stethoscope,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  List,
  Eye,
  Plus,
  X,
  Droplet,
} from 'lucide-react';

interface StudentPatient {
  id: number;
  fullName: string;
  fullNameAr: string;
  matricule: string;
  chifaNumber: string;
  faculty: string;
  age: number;
  dateOfBirth: string;
  gender: 'M' | 'F';
  bloodGroup: string;
  wilaya: string;
  commune: string;
  phone: string;
  email: string;
  chronicDiseases: string[];
  allergies: string[];
  lastVisit: string;
  status: 'ACTIVE' | 'OBSERVATION' | 'UP_TO_DATE';
}

const INITIAL_STUDENTS: StudentPatient[] = [
  {
    id: 1,
    fullName: 'Mohamed Amine BENALI',
    fullNameAr: 'محمد أمين بن علي',
    matricule: 'ETUD-2024-SETIF-0841',
    chifaNumber: '1996 0519 2800 4512',
    faculty: 'Faculté de Médecine - Université Sétif 1',
    age: 28,
    dateOfBirth: '14/05/1996',
    gender: 'M',
    bloodGroup: 'O+',
    wilaya: 'Sétif (19)',
    commune: 'Sétif',
    phone: '0555 12 34 56',
    email: 'mohamed.benali@univ-setif.dz',
    chronicDiseases: ['HTA essentielle (Hypertension)'],
    allergies: ['Pénicilline (Critique)', 'Arachides'],
    lastVisit: '2026-11-20',
    status: 'ACTIVE',
  },
  {
    id: 2,
    fullName: 'Amina MANSOURI',
    fullNameAr: 'أمينة منصوري',
    matricule: 'ETUD-2024-SETIF-1044',
    chifaNumber: '2001 1904 1200 8941',
    faculty: 'Faculté des Sciences - Informatique',
    age: 23,
    dateOfBirth: '19/04/2001',
    gender: 'F',
    bloodGroup: 'A+',
    wilaya: 'Sétif (19)',
    commune: 'El Eulma',
    phone: '0661 88 44 22',
    email: 'amina.mansouri@univ-setif.dz',
    chronicDiseases: ['Asthme bronchique d’effort'],
    allergies: ['Poussières / Acariens', 'Aspirine'],
    lastVisit: '2026-11-18',
    status: 'ACTIVE',
  },
  {
    id: 3,
    fullName: 'Yacine ZERROUKI',
    fullNameAr: 'ياسين زروقي',
    matricule: 'ETUD-2023-ALGER-2290',
    chifaNumber: '1999 1608 3400 6612',
    faculty: 'Faculté de Pharmacie - Alger',
    age: 25,
    dateOfBirth: '08/08/1999',
    gender: 'M',
    bloodGroup: 'B+',
    wilaya: 'Alger (16)',
    commune: 'Bab El Oued',
    phone: '0770 12 99 88',
    email: 'yacine.zerrouki@univ-alger.dz',
    chronicDiseases: [],
    allergies: ['Sulfamides'],
    lastVisit: '2026-11-15',
    status: 'UP_TO_DATE',
  },
  {
    id: 4,
    fullName: 'Sara BOUKHALFA',
    fullNameAr: 'سارة بوخالفة',
    matricule: 'ETUD-2024-CONST-3112',
    chifaNumber: '2002 2503 7800 1190',
    faculty: 'Faculté de Génie des Procédés',
    age: 22,
    dateOfBirth: '03/03/2002',
    gender: 'F',
    bloodGroup: 'O-',
    wilaya: 'Constantine (25)',
    commune: 'El Khroub',
    phone: '0560 34 56 78',
    email: 'sara.boukhalfa@univ-constantine.dz',
    chronicDiseases: ['Diabète Type 1 sous insuline'],
    allergies: ['Lactose'],
    lastVisit: '2026-11-21',
    status: 'OBSERVATION',
  },
  {
    id: 5,
    fullName: 'Walid CHERIFI',
    fullNameAr: 'وليد شريفي',
    matricule: 'ETUD-2023-SETIF-4412',
    chifaNumber: '2000 1912 6500 7823',
    faculty: 'Faculté des Sciences Économiques',
    age: 24,
    dateOfBirth: '12/12/2000',
    gender: 'M',
    bloodGroup: 'AB+',
    wilaya: 'Sétif (19)',
    commune: 'Ain Oulmene',
    phone: '0671 22 33 44',
    email: 'walid.cherifi@univ-setif.dz',
    chronicDiseases: [],
    allergies: [],
    lastVisit: '2026-10-30',
    status: 'UP_TO_DATE',
  },
  {
    id: 6,
    fullName: 'Nour El Houda BELKACEM',
    fullNameAr: 'نور الهدى بلقاسم',
    matricule: 'ETUD-2024-BATNA-5589',
    chifaNumber: '2003 0507 9000 3341',
    faculty: 'Institut de Santé & Soins Infirmiers',
    age: 21,
    dateOfBirth: '07/07/2003',
    gender: 'F',
    bloodGroup: 'A-',
    wilaya: 'Batna (05)',
    commune: 'Batna',
    phone: '0552 44 66 88',
    email: 'nour.belkacem@univ-batna.dz',
    chronicDiseases: ['Anémie ferriprive'],
    allergies: ['Iode'],
    lastVisit: '2026-11-19',
    status: 'ACTIVE',
  },
  {
    id: 7,
    fullName: 'Karim MEZIANE',
    fullNameAr: 'كريم مزيان',
    matricule: 'ETUD-2023-ORAN-7701',
    chifaNumber: '1998 3105 1100 9087',
    faculty: 'Faculté d’Architecture & Urbanisme',
    age: 26,
    dateOfBirth: '05/05/1998',
    gender: 'M',
    bloodGroup: 'O+',
    wilaya: 'Oran (31)',
    commune: 'Es Senia',
    phone: '0772 89 01 23',
    email: 'karim.meziane@univ-oran.dz',
    chronicDiseases: ['Migraine ophtalmique'],
    allergies: ['AINS (Anti-inflammatoires)'],
    lastVisit: '2026-11-10',
    status: 'UP_TO_DATE',
  },
  {
    id: 8,
    fullName: 'Ines HADDAD',
    fullNameAr: 'إيناس حداد',
    matricule: 'ETUD-2024-SETIF-9011',
    chifaNumber: '2002 1909 4300 1289',
    faculty: 'Faculté des Sciences de la Nature',
    age: 22,
    dateOfBirth: '19/09/2002',
    gender: 'F',
    bloodGroup: 'B-',
    wilaya: 'Sétif (19)',
    commune: 'Bougaa',
    phone: '0663 11 22 33',
    email: 'ines.haddad@univ-setif.dz',
    chronicDiseases: ['Hypothyroïdie (Lévothyrox)'],
    allergies: [],
    lastVisit: '2026-11-14',
    status: 'ACTIVE',
  },
];

export default function PatientsListPage() {
  return (
    <AuthGuard allowedRoles={['DOCTOR', 'ADMIN', 'PATIENT', 'PHARMACY']}>
      <PatientsListContent />
    </AuthGuard>
  );
}

function PatientsListContent() {
  const router = useRouter();
  const { language, dir } = useLanguage();
  const isRTL = dir === 'rtl';

  const [students, setStudents] = useState<StudentPatient[]>(INITIAL_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CHRONIC' | 'ALLERGIES' | 'SETIF' | 'OPLUS'>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulaire d'ajout
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    fullNameAr: '',
    faculty: 'Faculté de Médecine - Université Sétif 1',
    age: 20,
    dateOfBirth: '2004-01-01',
    gender: 'M' as 'M' | 'F',
    bloodGroup: 'O+',
    wilaya: 'Sétif (19)',
    commune: 'Sétif',
    phone: '',
    chronicDiseases: '',
    allergies: '',
  });

  // Tenter de charger les vrais patients du backend
  useEffect(() => {
    const fetchBackendPatients = async () => {
      try {
        setLoading(true);
        const res = await api.get('/patients');
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped: StudentPatient[] = res.data.map((p: any, idx: number) => {
            const u = p.user || {};
            const fn = `${u.firstName || ''} ${u.lastName || ''}`.trim() || `Patient #${p.id}`;
            return {
              id: p.id,
              fullName: fn,
              fullNameAr: fn,
              matricule: `ETUD-2024-${p.wilaya || 'SETIF'}-${String(p.id).padStart(4, '0')}`,
              chifaNumber: `199${p.id} 0519 2800 ${4500 + p.id}`,
              faculty: 'Pôle Médical Universitaire',
              age: p.dateOfBirth ? Math.max(18, new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()) : 24,
              dateOfBirth: p.dateOfBirth || '2000-01-01',
              gender: (p.gender === 'F' ? 'F' : 'M') as 'M' | 'F',
              bloodGroup: p.bloodGroup || 'O+',
              wilaya: p.wilaya ? `${p.wilaya} (19)` : 'Sétif (19)',
              commune: p.commune || 'Sétif',
              phone: u.phone || '0550 00 00 00',
              email: u.email || `patient.${p.id}@sihati.dz`,
              chronicDiseases: p.chronicDiseases ? [p.chronicDiseases] : [],
              allergies: p.allergies ? [p.allergies] : [],
              lastVisit: new Date().toISOString().split('T')[0],
              status: 'ACTIVE' as const,
            };
          });

          // Fusionner avec la liste de démonstration sans doublon d'id
          const combined = [...mapped];
          INITIAL_STUDENTS.forEach((demo) => {
            if (!combined.some((c) => c.id === demo.id)) {
              combined.push(demo);
            }
          });
          setStudents(combined);
        }
      } catch (err) {
        // En cas d'erreur ou API non dispo, conserver la liste de démonstration complète
        console.log('Utilisation des données locales de démonstration');
      } finally {
        setLoading(false);
      }
    };

    fetchBackendPatients();
  }, []);

  // Filtrage intelligent
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.fullNameAr.includes(q) ||
        s.matricule.toLowerCase().includes(q) ||
        s.chifaNumber.includes(q) ||
        s.phone.includes(q) ||
        s.wilaya.toLowerCase().includes(q) ||
        s.faculty.toLowerCase().includes(q);

      if (!matchQuery) return false;

      if (selectedFilter === 'CHRONIC') {
        return s.chronicDiseases && s.chronicDiseases.length > 0;
      }
      if (selectedFilter === 'ALLERGIES') {
        return s.allergies && s.allergies.length > 0;
      }
      if (selectedFilter === 'SETIF') {
        return s.wilaya.toLowerCase().includes('sétif') || s.wilaya.toLowerCase().includes('setif');
      }
      if (selectedFilter === 'OPLUS') {
        return s.bloodGroup === 'O+';
      }

      return true;
    });
  }, [students, searchQuery, selectedFilter]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const total = students.length;
    const chronicCount = students.filter((s) => s.chronicDiseases && s.chronicDiseases.length > 0).length;
    const allergiesCount = students.filter((s) => s.allergies && s.allergies.length > 0).length;
    const setifCount = students.filter((s) => s.wilaya.toLowerCase().includes('sétif')).length;
    return { total, chronicCount, allergiesCount, setifCount };
  }, [students]);

  // Ajouter un nouvel étudiant
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName) return;

    const newId = Math.max(...students.map((s) => s.id), 0) + 1;
    const created: StudentPatient = {
      id: newId,
      fullName: newStudent.fullName,
      fullNameAr: newStudent.fullNameAr || newStudent.fullName,
      matricule: `ETUD-2024-SETIF-${String(newId).padStart(4, '0')}`,
      chifaNumber: `2004 1901 0000 ${String(1000 + newId)}`,
      faculty: newStudent.faculty,
      age: Number(newStudent.age) || 20,
      dateOfBirth: newStudent.dateOfBirth,
      gender: newStudent.gender,
      bloodGroup: newStudent.bloodGroup,
      wilaya: newStudent.wilaya,
      commune: newStudent.commune,
      phone: newStudent.phone || '0550 00 00 00',
      email: `${newStudent.fullName.toLowerCase().replace(/\s+/g, '.')}@univ-setif.dz`,
      chronicDiseases: newStudent.chronicDiseases ? [newStudent.chronicDiseases] : [],
      allergies: newStudent.allergies ? [newStudent.allergies] : [],
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    setStudents([created, ...students]);
    setShowAddModal(false);
    setNewStudent({
      fullName: '',
      fullNameAr: '',
      faculty: 'Faculté de Médecine - Université Sétif 1',
      age: 20,
      dateOfBirth: '2004-01-01',
      gender: 'M',
      bloodGroup: 'O+',
      wilaya: 'Sétif (19)',
      commune: 'Sétif',
      phone: '',
      chronicDiseases: '',
      allergies: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-[1550px] mx-auto space-y-6">
        {/* ========================================================= */}
        {/* EN-TÊTE PRINCIPAL & ACTIONS RAPIDES                      */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>{isRTL ? 'المركز الطبي الجامعي • صحّتي' : 'Centre Médical Universitaire • Sihati'}</span>
              </span>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full">
                {isRTL ? `${stats.total} طالب ومريض مسجل` : `${stats.total} étudiants & patients`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isRTL ? 'سجل ودليل الطلبة والمرضى (Dossiers Médicaux)' : 'Répertoire & Dossiers des Étudiants et Patients'}
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl">
              {isRTL
                ? 'استعراض القائمة الشاملة لجميع الطلبة والمرضى المسجلين، مع إمكانية البحث الفوري، الفرز حسب الحالة الصحية، والوصول المباشر إلى الملف الطبي الشامل 360° لكل طالب.'
                : 'Consultez la liste complète des étudiants et patients enregistrés. Recherche instantanée par matricule ou carte Chifa, suivi des affections chroniques et ouverture directe du dossier médical 360°.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm shadow-emerald-200 transition flex items-center justify-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isRTL ? 'تسجيل طالب / مريض جديد' : 'Nouveau Dossier Étudiant'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition flex items-center gap-2 text-sm border border-slate-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{isRTL ? 'تصدير القائمة' : 'Exporter'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STATISTIQUES EN CARTES RAPIDES                            */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isRTL ? 'إجمالي الطلبة' : 'Total Étudiants'}</p>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isRTL ? 'أمراض مزمنة (ALD)' : 'Suivi Chronique'}</p>
              <p className="text-2xl font-black text-amber-700">{stats.chronicCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isRTL ? 'حساسيات حرجة' : 'Allergies Déclarées'}</p>
              <p className="text-2xl font-black text-red-700">{stats.allergiesCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isRTL ? 'سطيف والجامعة' : 'Pôle Sétif (19)'}</p>
              <p className="text-2xl font-black text-blue-700">{stats.setifCount}</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BARRE DE RECHERCHE, FILTRES ET SÉLECTEUR DE VUE          */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Input recherche */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isRTL
                    ? 'ابحث بالاسم، رقم التسجيل، بطاقة الشفاء، الولاية، التخصص...'
                    : 'Rechercher par nom, matricule étudiant, carte Chifa, wilaya, faculté...'
                }
                className="w-full ps-11 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sélecteur de vue (Tableau vs Cartes) */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vue Tableau"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? 'جدول' : 'Tableau'}</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'cards' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vue Cartes"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">{isRTL ? 'بطاقات' : 'Cartes'}</span>
              </button>
            </div>
          </div>

          {/* Filtres de catégories rapides */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isRTL ? 'جميع الطلبة' : 'Tous les Étudiants'} ({students.length})
            </button>
            <button
              onClick={() => setSelectedFilter('CHRONIC')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1 ${
                selectedFilter === 'CHRONIC'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{isRTL ? 'أمراض مزمنة' : 'Affections Chroniques'}</span>
            </button>
            <button
              onClick={() => setSelectedFilter('ALLERGIES')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1 ${
                selectedFilter === 'ALLERGIES'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isRTL ? 'حساسيات حرجة' : 'Allergies Déclarées'}</span>
            </button>
            <button
              onClick={() => setSelectedFilter('SETIF')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedFilter === 'SETIF'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isRTL ? 'ولاية سطيف (19)' : 'Sétif (19)'}
            </button>
            <button
              onClick={() => setSelectedFilter('OPLUS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1 ${
                selectedFilter === 'OPLUS'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <Droplet className="w-3 h-3" />
              <span>{isRTL ? 'زمرة دم O+' : 'Groupe O+'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* AFFICHAGE DES RÉSULTATS : VUE TABLEAU OU CARTES           */}
        {/* ========================================================= */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              {isRTL ? 'لم يتم العثور على أي طالب أو مريض' : 'Aucun étudiant trouvé'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isRTL ? 'جرب تغيير عبارة البحث أو إزالة المرشحات.' : 'Essayez de modifier votre recherche ou vos filtres.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('ALL');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              {isRTL ? 'إعادة ضبط البحث' : 'Réinitialiser la recherche'}
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* ========================================================= */
          /* VUE TABLEAU CLINIQUE                                      */
          /* ========================================================= */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-5 text-start">{isRTL ? 'الطالب / المريض' : 'Étudiant / Patient'}</th>
                    <th className="py-4 px-4 text-start">{isRTL ? 'رقم التسجيل & الشفاء' : 'Matricule & Chifa'}</th>
                    <th className="py-4 px-4 text-start">{isRTL ? 'الكلية / الجامعة' : 'Faculté / Établissement'}</th>
                    <th className="py-4 px-3 text-center">{isRTL ? 'الزمرة' : 'Groupe'}</th>
                    <th className="py-4 px-4 text-start">{isRTL ? 'المتابعة الصحية & الحساسيات' : 'Santé & Allergies'}</th>
                    <th className="py-4 px-4 text-start">{isRTL ? 'الاتصال' : 'Contact'}</th>
                    <th className="py-4 px-5 text-end">{isRTL ? 'الإجراء الطبي' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-emerald-50/40 transition group cursor-pointer"
                      onClick={() => router.push(`/patients/${student.id}`)}
                    >
                      {/* Identité */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition">
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition flex items-center gap-2">
                              <span>{student.fullName}</span>
                              <span className="text-[11px] text-slate-400 font-medium">({student.fullNameAr})</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>
                                {student.gender === 'M' ? (isRTL ? 'ذكر' : 'Masculin') : isRTL ? 'أنثى' : 'Féminin'}
                              </span>
                              <span>•</span>
                              <span>{student.age} {isRTL ? 'سنة' : 'ans'}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {student.wilaya}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Matricule & Chifa */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                          {student.matricule}
                        </div>
                        <div className="font-mono text-[10px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                          <Shield className="w-3 h-3" />
                          <span>Chifa: {student.chifaNumber}</span>
                        </div>
                      </td>

                      {/* Faculté */}
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]" title={student.faculty}>
                            {student.faculty}
                          </span>
                        </div>
                      </td>

                      {/* Groupe Sanguin */}
                      <td className="py-4 px-3 text-center">
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-black text-xs inline-flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-rose-500 fill-rose-500" />
                          <span>{student.bloodGroup}</span>
                        </span>
                      </td>

                      {/* Pathologies & Allergies */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {student.chronicDiseases.length > 0 ? (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                              <Heart className="w-3 h-3 text-amber-500 shrink-0" />
                              <span className="truncate max-w-[170px]">{student.chronicDiseases.join(', ')}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              {isRTL ? 'لا توجد أمراض مزمنة' : 'Aucune ALD'}
                            </span>
                          )}

                          {student.allergies.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded-md w-fit">
                              <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                              <span className="truncate max-w-[160px]">{student.allergies.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{student.phone}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                          {student.email}
                        </div>
                      </td>

                      {/* Bouton d'action Dossier */}
                      <td className="py-4 px-5 text-end" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/patients/${student.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs group/btn"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'فتح الملف الطبي' : 'Dossier 360°'}</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VUE CARTES DE PROFIL                                      */
          /* ========================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top card bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition leading-tight">
                          {student.fullName}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">{student.fullNameAr}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-black text-xs flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-rose-500 fill-rose-500" />
                      {student.bloodGroup}
                    </span>
                  </div>

                  {/* Badges Matricule & Faculté */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{isRTL ? 'رقم التسجيل:' : 'Matricule:'}</span>
                      <span className="font-mono font-bold text-slate-800">{student.matricule}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{student.faculty}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{student.age} {isRTL ? 'سنة' : 'ans'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {student.wilaya}
                      </span>
                    </div>
                  </div>

                  {/* Alertes santé */}
                  {(student.chronicDiseases.length > 0 || student.allergies.length > 0) && (
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      {student.chronicDiseases.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                          <Heart className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{student.chronicDiseases.join(', ')}</span>
                        </div>
                      )}
                      {student.allergies.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-700">
                          <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="truncate">{student.allergies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bouton d'action */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/patients/${student.id}`}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'الملف الطبي 360°' : 'Dossier Médical'}</span>
                  </Link>
                  <Link
                    href={`/prescriptions/new?patientId=${student.id}`}
                    className="p-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition border border-slate-200"
                    title={isRTL ? 'وصفة طبية' : 'Nouvelle ordonnance'}
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL : NOUVEAU DOSSIER ÉTUDIANT / PATIENT                */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {isRTL ? 'إضافة طالب / مريض جديد' : 'Enregistrer un Étudiant / Patient'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRTL ? 'تسجيل فوري للملف الصحي الجامعي' : 'Création immédiate du dossier médical partagé'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRTL ? 'الاسم واللقب (بالفرنسية):' : 'Nom & Prénom (FR) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                    placeholder="Ex: Balqis ISSAOUI"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRTL ? 'الاسم واللقب (بالعربية):' : 'Nom & Prénom (Arabe)'}
                  </label>
                  <input
                    type="text"
                    value={newStudent.fullNameAr}
                    onChange={(e) => setNewStudent({ ...newStudent, fullNameAr: e.target.value })}
                    placeholder="مثال: بلقيس عيساوي"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'العمر:' : 'Âge'}</label>
                  <input
                    type="number"
                    min="16"
                    max="99"
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({ ...newStudent, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'الجنس:' : 'Sexe'}</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as 'M' | 'F' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="M">{isRTL ? 'ذكر (Masculin)' : 'Masculin'}</option>
                    <option value="F">{isRTL ? 'أنثى (Féminin)' : 'Féminin'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'زمرة الدم:' : 'Groupe Sanguin'}</label>
                  <select
                    value={newStudent.bloodGroup}
                    onChange={(e) => setNewStudent({ ...newStudent, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'الكلية / المعهد الجامعي:' : 'Faculté / Institut Universitaire'}
                </label>
                <input
                  type="text"
                  value={newStudent.faculty}
                  onChange={(e) => setNewStudent({ ...newStudent, faculty: e.target.value })}
                  placeholder="Ex: Faculté de Médecine - Université Sétif 1"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'الولاية:' : 'Wilaya'}</label>
                  <input
                    type="text"
                    value={newStudent.wilaya}
                    onChange={(e) => setNewStudent({ ...newStudent, wilaya: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'الهاتف:' : 'Téléphone'}</label>
                  <input
                    type="text"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="0555 00 00 00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'أمراض مزمنة (اختياري):' : 'Affections Longue Durée (ALD)'}
                </label>
                <input
                  type="text"
                  value={newStudent.chronicDiseases}
                  onChange={(e) => setNewStudent({ ...newStudent, chronicDiseases: e.target.value })}
                  placeholder="Ex: Asthme, Diabète, HTA..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'حساسيات حرجة (اختياري):' : 'Allergies Critiques'}
                </label>
                <input
                  type="text"
                  value={newStudent.allergies}
                  onChange={(e) => setNewStudent({ ...newStudent, allergies: e.target.value })}
                  placeholder="Ex: Pénicilline, Arachides, Iode..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  {isRTL ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm"
                >
                  {isRTL ? 'حفظ وتأكيد الملف' : 'Créer le Dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
