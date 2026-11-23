import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AppointmentsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <Text className="text-xl font-black text-slate-900">المواعيد الطبية</Text>
        <Text className="text-xs text-slate-400">تتبع وحجز المواعيد لدى الأطباء والمخابر</Text>

        <View className="flex-row mt-3 bg-slate-100 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setFilter('upcoming')}
            className={`flex-1 py-2 rounded-lg items-center ${
              filter === 'upcoming' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                filter === 'upcoming' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              المواعيد القادمة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('past')}
            className={`flex-1 py-2 rounded-lg items-center ${
              filter === 'past' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                filter === 'past' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              الزيارات السابقة
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Book appointment button */}
        <TouchableOpacity
          onPress={() => router.push('/doctors-search')}
          className="bg-emerald-600 p-4 rounded-2xl mb-5 flex-row items-center justify-center gap-2 shadow-sm"
        >
          <Text className="text-white text-lg font-bold">+</Text>
          <Text className="text-white text-sm font-bold">حجز موعد جديد عند طبيب</Text>
        </TouchableOpacity>

        {filter === 'upcoming' ? (
          <View className="space-y-4">
            <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center">
                    <Text className="text-2xl">👨‍⚕️</Text>
                  </View>
                  <div>
                    <Text className="font-bold text-slate-900 text-sm">Dr. محمد علي</Text>
                    <Text className="text-xs text-slate-500">طبيب عام • سطيف</Text>
                  </div>
                </View>
                <Text className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  مؤكد
                </Text>
              </View>

              <View className="bg-slate-50 p-3 rounded-2xl border border-slate-100 my-2">
                <Text className="text-xs text-slate-700 font-semibold">
                  📅 بعد يومين • 10:00 صباحاً
                </Text>
                <Text className="text-[11px] text-slate-500 mt-0.5">
                  السبب : متابعة ضغط الدم ومراجعة التحاليل الجديدة
                </Text>
              </View>

              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity className="flex-1 py-2.5 bg-slate-100 rounded-xl items-center">
                  <Text className="text-xs font-bold text-slate-700">تعديل الموعد</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2.5 px-4 bg-red-50 rounded-xl items-center">
                  <Text className="text-xs font-bold text-red-600">إلغاء</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View className="space-y-3">
            <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm opacity-80">
              <Text className="font-bold text-slate-800 text-sm">Dr. سارة أحمد (أخصائية قلب)</Text>
              <Text className="text-xs text-slate-400 mt-0.5">25 ماي 2024 • فحص تخطيط القلب ECG</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
