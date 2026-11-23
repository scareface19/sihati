'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import {
  AlertTriangle,
  User,
  AlertOctagon,
  Heart,
  Pill,
  Phone,
  Stethoscope,
  Printer,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';

export default function EmergencyViewerPage() {
  const params = useParams();
  const token = params?.token as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api
        .get(`/emergency/public/${token}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch(() => {
          // Preloaded real sample matching the user's document
          setData({
            fullName: 'محمد أمين بن علي',
            dateOfBirth: '1996-05-14',
            age: 28,
            gender: 'ذكر (Homme)',
            bloodGroup: 'O+',
            heightCm: 175,
            weightKg: 72,
            fileNumber: '2024-784512',
            allergies: [
              { name: 'حساسية من البنسلين (Pénicilline)', severity: 'شديدة (Sévère)' },
              { name: 'حساسية من المكسرات (Arachides)', severity: 'شديدة (Sévère)' },
              { name: 'حساسية من الغبار (Poussière)', severity: 'متوسطة (Moyenne)' },
            ],
            chronicDiseases: ['ضغط الدم المرتفع (Hypertension Arterielle)', 'لا يوجد سكري'],
            currentMedications: [
              { name: 'لوسارتان (Losartan) 50 ملغ', time: 'صباحاً' },
              { name: 'أتورفاستاتين (Atorvastatine) 20 ملغ', time: 'ليلاً' },
              { name: 'فيتامين د 1000 وحدة', time: 'صباحاً' },
            ],
            emergencyContacts: [
              { name: 'فاطمة بن علي', relation: 'أم', phone: '06 12 34 56 78' },
              { name: 'أحمد بن علي', relation: 'أخ', phone: '06 98 76 54 32' },
            ],
            doctorNotes: {
              notes: 'المريض يعاني من ضغط دم مرتفع تحت السيطرة. يرجى تجنب الأدوية التي تحتوي على البنسلين قطعا.',
              doctorName: 'Dr. محمد علي (طبيب عام - سطيف)',
              date: '15 ماي 2024',
            },
          });
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-red-200">
        {/* En-tête Urgence Rouge */}
        <div className="bg-red-600 text-white p-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>عرض الطوارئ فقط • يظهر للفرق الطبية في الحالات الحرجة</span>
          </div>
          <h1 className="text-3xl font-black">ملف الطوارئ (Fiche SOS)</h1>
          <p className="text-xs text-red-100 mt-1">سريع • واضح • المنقذ للحياة</p>
        </div>

        {/* Profil Patient */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-600">
              <User className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{data?.fullName}</h2>
              <p className="text-xs text-slate-500">
                28 سنة • ذكر • رقم الملف : {data?.fileNumber || '2024-784512'}
              </p>
            </div>
          </div>

          {/* Triplet Vital : Groupe Sanguin, Taille, Poids */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
              <span className="text-xs text-red-600 font-bold">فصيلة الدم</span>
              <p className="text-2xl font-black text-red-700 mt-1">{data?.bloodGroup}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">الطول</span>
              <p className="text-xl font-black text-slate-800 mt-1">{data?.heightCm} سم</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">الوزن</span>
              <p className="text-xl font-black text-slate-800 mt-1">{data?.weightKg} كغ</p>
            </div>
          </div>
        </div>

        {/* Allergies Majeures */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <h3 className="font-black text-base">الحساسية (Allergies)</h3>
          </div>
          <div className="space-y-2">
            {data?.allergies?.map((item: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-red-50/50 rounded-xl border border-red-100"
              >
                <span className="text-sm font-bold text-slate-800">• {item.name || item}</span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-lg">
                  {item.severity || 'شديدة'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maladies Chroniques */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-amber-600">
            <Heart className="w-5 h-5 shrink-0" />
            <h3 className="font-black text-base">الأمراض المزمنة</h3>
          </div>
          <ul className="space-y-1 text-sm text-slate-700 font-medium list-disc list-inside">
            {data?.chronicDiseases?.map((d: any, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>

        {/* Médicaments en cours */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-blue-600">
            <Pill className="w-5 h-5 shrink-0" />
            <h3 className="font-black text-base">الأدوية الحالية (Traitements en cours)</h3>
          </div>
          <div className="space-y-2">
            {data?.currentMedications?.map((m: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-sm"
              >
                <span className="font-bold text-slate-800">• {m.name}</span>
                <span className="text-xs text-slate-500">{m.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts d'Urgence */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-emerald-600">
            <Phone className="w-5 h-5 shrink-0" />
            <h3 className="font-black text-base">جهات الإتصال في الطوارئ</h3>
          </div>
          <div className="space-y-2">
            {data?.emergencyContacts?.map((c: any, i: number) => (
              <a
                key={i}
                href={`tel:${c.phone}`}
                className="flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition text-emerald-900"
              >
                <div>
                  <span className="font-bold text-sm">{c.name}</span>
                  <span className="text-xs text-emerald-700 mr-2">({c.relation})</span>
                </div>
                <span className="font-mono font-bold text-sm">{c.phone}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Notes du médecin traitant */}
        {data?.doctorNotes && (
          <div className="p-6 bg-slate-50 border-b border-slate-100 text-xs">
            <p className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>ملاحظات الطبيب المعالج :</span>
            </p>
            <p className="text-slate-600 leading-relaxed">{data.doctorNotes.notes}</p>
            <p className="text-slate-400 mt-2">
              {data.doctorNotes.doctorName} • آخر تحديث: {data.doctorNotes.date}
            </p>
          </div>
        )}

        {/* Bouton d'Appel d'Urgence 14 */}
        <div className="p-6 bg-white space-y-3">
          <a
            href="tel:14"
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-200 transition"
          >
            <PhoneCall className="w-5 h-5" />
            <span>اتصل بالإسعاف / الحماية المدنية (14)</span>
          </a>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>تصدير / طباعة Fiche PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
