import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPECIALTIES = [
  { name: 'الطب العام', icon: '🩺', count: 3 },
  { name: 'أمراض القلب', icon: '❤️', count: 1 },
  { name: 'السكري والغدد', icon: '🩸', count: 0 },
  { name: 'أمراض الصدر', icon: '🫁', count: 0 },
  { name: 'أمراض الكلى', icon: '💧', count: 0 },
  { name: 'الجهاز الهضمي', icon: '🔬', count: 0 },
  { name: 'الأمراض الجلدية', icon: '🧴', count: 1 },
  { name: 'طب الأطفال', icon: '👶', count: 0 },
  { name: 'النساء والتوليد', icon: '🤰', count: 0 },
  { name: 'طب الأعصاب', icon: '🧠', count: 0 },
  { name: 'العظام والمفاصل', icon: '🦴', count: 0 },
  { name: 'طب العيون', icon: '👁️', count: 0 },
  { name: 'الأنف والأذن والحنجرة', icon: '👂', count: 0 },
  { name: 'طب الأسنان', icon: '🦷', count: 2 },
  { name: 'الأورام', icon: '🎗️', count: 0 },
];

export default function MedicalRecordScreen() {
  const [activeTab, setActiveTab] = useState<'profile' | 'specialties' | 'documents'>('profile');

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <Text className="text-xl font-black text-slate-900">الملف الصحي الموحد</Text>
        <Text className="text-xs text-slate-400">جميع معلوماتك الصحية في مكان واحد وآمن</Text>

        {/* Tab Selector */}
        <View className="flex-row mt-3 bg-slate-100 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'profile' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'profile' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              البيانات الحيوية
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('specialties')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'specialties' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'specialties' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              التخصصات الـ 15
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('documents')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'documents' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'documents' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              التحاليل والأشعة
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' && (
          <View className="space-y-4">
            {/* Card Vital Stats */}
            <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <Text className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                القياسات الحيوية الأساسية
              </Text>
              <View className="flex-row justify-around text-center">
                <View>
                  <Text className="text-2xl font-black text-red-600">O+</Text>
                  <Text className="text-xs text-slate-500 mt-1">فصيلة الدم</Text>
                </View>
                <View className="w-[1px] bg-slate-100" />
                <View>
                  <Text className="text-2xl font-black text-slate-800">175</Text>
                  <Text className="text-xs text-slate-500 mt-1">الطول (سم)</Text>
                </View>
                <View className="w-[1px] bg-slate-100" />
                <View>
                  <Text className="text-2xl font-black text-slate-800">72</Text>
                  <Text className="text-xs text-slate-500 mt-1">الوزن (كغ)</Text>
                </View>
              </View>
            </View>

            {/* Allergies Warning */}
            <View className="bg-red-50 p-5 rounded-3xl border border-red-200">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-lg">⚠️</Text>
                <Text className="text-sm font-black text-red-800">الحساسية المسجلة (Allergies)</Text>
              </View>
              <Text className="text-xs text-red-700 font-semibold mb-1">• حساسية البنسلين (شديدة)</Text>
              <Text className="text-xs text-red-700 font-semibold mb-1">• حساسية المكسرات (شديدة)</Text>
              <Text className="text-xs text-red-700 font-semibold">• حساسية الغبار (متوسطة)</Text>
            </View>

            {/* Chronic Diseases */}
            <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-lg">🩺</Text>
                <Text className="text-sm font-black text-slate-900">الأمراض المزمنة</Text>
              </View>
              <Text className="text-xs text-slate-700 font-medium leading-relaxed">
                • ارتفاع ضغط الدم الشرياني (تحت المراقبة والمتابعة بانتظام)
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'specialties' && (
          <View className="space-y-3 mb-6">
            <Text className="text-xs text-slate-400 font-bold mb-1">
              اختر التخصص لمشاهدة الاستشارات والوصفات الخاصة به :
            </Text>
            {SPECIALTIES.map((spec, i) => (
              <TouchableOpacity
                key={i}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{spec.icon}</Text>
                  <View>
                    <Text className="text-sm font-bold text-slate-900">{spec.name}</Text>
                    <Text className="text-xs text-slate-400">{spec.count} استشارات سابقة</Text>
                  </View>
                </View>
                <Text className="text-slate-300 font-bold text-base">→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'documents' && (
          <View className="space-y-3 mb-6">
            <TouchableOpacity className="border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-6 rounded-3xl items-center justify-center">
              <Text className="text-3xl mb-1">📷</Text>
              <Text className="text-sm font-bold text-emerald-800">إضافة نتيجة تحليل أو صورة أشعة</Text>
              <Text className="text-xs text-emerald-600 mt-0.5">التقط صورة بالهاتف أو ارفع ملف PDF</Text>
            </TouchableOpacity>

            <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🧪</Text>
                <View>
                  <Text className="text-sm font-bold text-slate-900">تحليل الدم الشامل (NFS)</Text>
                  <Text className="text-xs text-slate-400">مخبر البركة، سطيف • 10 ماي 2024</Text>
                </View>
              </View>
              <Text className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                عرض PDF
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
