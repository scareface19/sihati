'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/lib/auth';
import {
  Lock,
  Plus,
  MessageSquare,
  ThumbsUp,
  Users,
} from 'lucide-react';

export default function PeerCommunityPage() {
  return (
    <AuthGuard allowedRoles={['DOCTOR', 'ADMIN']}>
      <PeerCommunityContent />
    </AuthGuard>
  );
}

function PeerCommunityContent() {
  const [cases, setCases] = useState([
    {
      id: 1,
      title: 'حالة سريرية: ارتفاع ضغط شرياني مقاوم لدى شاب 26 سنة بدون سوابق عائلية',
      specialty: 'أمراض القلب والشرايين',
      author: 'Dr. سارة أحمد (سطيف)',
      date: 'منذ 3 ساعات',
      description:
        'مريض ذكر، 26 سنة، غير مدخن، ضغط الدم 160/100 رغم حمية خالية من الملح واستعمال مثبطات الكالسيوم. وظائف الكلى طبيعية. نرجو إبداء الرأي حول الفحوصات الهرمونية التكميلية المقترحة.',
      responsesCount: 5,
      likes: 12,
    },
    {
      id: 2,
      title: 'استفسار دوائي: التداخل بين مشتقات مضادات التخثر الحديثة ومضادات الالتهاب',
      specialty: 'الطب العام والصيدلة السريرية',
      author: 'Dr. محمد علي (سطيف)',
      date: 'أمس',
      description:
        'بخصوص بروتوكول وصف Rivaroxaban مع مسكنات الآلام المفصلية، ما هي الجرعات الأكثر أماناً لتجنب النزيف المعدي ؟',
      responsesCount: 8,
      likes: 19,
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>فضاء خاص بالأطباء المعتمدين فقط</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>مجتمع الأطباء • تبادل الحالات السريرية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مناقشة الحالات المعقدة بعد حجب هوية المريض تماماً لضمان السرية الطبية
          </p>
        </div>

        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow shadow-emerald-200 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>نشر حالة سريرية (Anonymisée)</span>
        </button>
      </div>

      <div className="space-y-6">
        {cases.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {c.specialty}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  بواسطة {c.author} • {c.date}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 my-4">
              {c.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.responsesCount} إجابات ومناقشات</span>
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.likes} إعجاب بالنقاش</span>
                </span>
              </div>
              <button className="text-emerald-600 font-bold hover:underline">
                المشاركة برأي طبي...
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
