import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
  const [waterGlasses, setWaterGlasses] = useState(5);

  const familyMembers = [
    { name: 'محمد أمين (أنت)', age: '28 سنة', relation: 'رب الأسرة', icon: '👨' },
    { name: 'فاطمة (الزوجة)', age: '26 سنة', relation: 'أم', icon: '👩' },
    { name: 'يوسف', age: '4 سنوات', relation: 'ابن • تلقيحات', icon: '👦' },
    { name: 'مريم', age: '1 سنة', relation: 'ابنة • رضيعة', icon: '👧' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <Text className="text-xl font-black text-slate-900">حساب عائلي وعادات صحية</Text>
        <Text className="text-xs text-slate-400">متابعة صحة العائلة والوقاية اليومية</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Family Account Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-black text-slate-900">إدارة أفراد العائلة (حساب عائلي)</Text>
            <TouchableOpacity className="px-2.5 py-1 bg-emerald-100 rounded-lg">
              <Text className="text-xs font-bold text-emerald-800">+ إضافة فرد</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
            {familyMembers.map((m, i) => (
              <View
                key={i}
                className="w-36 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm items-center mr-3"
              >
                <Text className="text-3xl mb-2">{m.icon}</Text>
                <Text className="font-bold text-slate-900 text-xs text-center">{m.name}</Text>
                <Text className="text-[10px] text-slate-500 text-center mt-0.5">{m.age}</Text>
                <Text className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold mt-2">
                  {m.relation}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Healthy Habits Tracker */}
        <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <Text className="text-base font-black text-slate-900 mb-1">العادات الصحية اليومية (Habitudes)</Text>
          <Text className="text-xs text-slate-400 mb-4">الوقاية خير من العلاج • تقدم اليوم: 75%</Text>

          {/* Water Tracker */}
          <View className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-sm font-bold text-slate-900">💧 شرب الماء</Text>
              <Text className="text-xs text-blue-800 mt-0.5">{waterGlasses} من 8 أكواب يومياً</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => setWaterGlasses(Math.min(8, waterGlasses + 1))}
                className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center"
              >
                <Text className="text-white font-bold text-lg">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Walking Tracker */}
          <View className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-sm font-bold text-slate-900">🚶‍♂️ المشي والنشاط</Text>
              <Text className="text-xs text-emerald-800 mt-0.5">35 دقيقة من 30 دقيقة مستهدفة</Text>
            </View>
            <Text className="text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-1 rounded-lg">
              مكتمل ✓
            </Text>
          </View>

          {/* Sleep Score */}
          <View className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 flex-row justify-between items-center">
            <View>
              <Text className="text-sm font-bold text-slate-900">🌙 النوم المنتظم</Text>
              <Text className="text-xs text-purple-800 mt-0.5">7.5 ساعات الليلة الماضية</Text>
            </View>
            <Text className="text-purple-700 font-bold text-xs">ممتاز</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
