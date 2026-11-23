'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/lib/auth';
import {
  Calendar,
  Clock,
  Check,
  X,
  User,
  Phone,
  ArrowRight,
} from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <AuthGuard allowedRoles={['DOCTOR', 'ADMIN', 'PATIENT']}>
      <AppointmentsContent />
    </AuthGuard>
  );
}

function AppointmentsContent() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'محمد أمين بن علي',
      phone: '0555123456',
      time: '10:00 صباحاً',
      date: 'اليوم',
      reason: 'متابعة ضغط الدم والتحاليل الدورية',
      status: 'CONFIRMED',
    },
    {
      id: 2,
      patientName: 'ياسمين بوراس',
      phone: '0661998877',
      time: '11:00 صباحاً',
      date: 'اليوم',
      reason: 'فحص سريري عام وصداع نصفي',
      status: 'CONFIRMED',
    },
    {
      id: 3,
      patientName: 'كريم بلحاج',
      phone: '0770112233',
      time: '14:30 بعد الزوال',
      date: 'غداً',
      reason: 'استشارة قلبية وإرهاق تنفسي',
      status: 'PENDING',
    },
  ]);

  const confirmAppt = (id: number) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: 'CONFIRMED' } : a)),
    );
  };

  const cancelAppt = (id: number) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)),
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <span>جدول المواعيد والاستشارات الطبية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">عيادة الدكتور محمد علي - سطيف</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة للوحة التحكم</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{appt.patientName}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      appt.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : appt.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {appt.status === 'CONFIRMED' ? 'مؤكد' : appt.status === 'PENDING' ? 'قيد التأكيد' : 'ملغى'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{appt.date} على الساعة {appt.time} • السبب: {appt.reason}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>هاتف: {appt.phone}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {appt.status === 'PENDING' && (
                  <button
                    onClick={() => confirmAppt(appt.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تأكيد</span>
                  </button>
                )}
                {appt.status !== 'CANCELLED' && (
                  <button
                    onClick={() => cancelAppt(appt.id)}
                    className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>إلغاء</span>
                  </button>
                )}
                <Link
                  href={`/patients/1`}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>الملف</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
