import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DoctorsSearchScreen() {
  const [selectedWilaya, setSelectedWilaya] = useState('سطيف (Sétif)');
  const [selectedCommune, setSelectedCommune] = useState('الكل');
  const [query, setQuery] = useState('');

  const doctors = [
    {
      id: 1,
      name: 'Dr. محمد علي',
      specialty: 'طبيب عام (Médecine Générale)',
      rating: '4.8',
      commune: 'سطيف (حي 1014 مسكن)',
      fee: '1500 دج',
      availability: 'متاح اليوم',
    },
    {
      id: 2,
      name: 'Dr. سارة أحمد',
      specialty: 'أخصائية قلب (Cardiologie)',
      rating: '4.7',
      commune: 'العلمة (شارع 1 نوفمبر)',
      fee: '2500 دج',
      availability: 'غداً 10:00',
    },
    {
      id: 3,
      name: 'Dr. ياسر محمود',
      specialty: 'أخصائي أطفال (Pédiatrie)',
      rating: '4.9',
      commune: 'عين ولمان',
      fee: '2000 دج',
      availability: 'متاح اليوم',
    },
  ];

  const handleBook = (doctorName: string) => {
    Alert.alert(
      'تأكيد حجز الموعد',
      `تم إرسال طلب حجز موعد لدى ${doctorName}. ستصلك رسالة تأكيد عبر التطبيق.`,
      [{ text: 'حسناً' }],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <Text className="text-xl font-black text-slate-900">البحث عن طبيب وحجز موعد</Text>
        <Text className="text-xs text-slate-400">شبكة الأطباء والعيادات المعتمدة في ولاية سطيف</Text>

        {/* Search input */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث باسم الطبيب، العيادة أو التخصص..."
          className="mt-3 px-4 py-2.5 bg-slate-100 rounded-xl text-xs"
        />

        {/* Filter Pills */}
        <View className="flex-row gap-2 mt-3">
          <View className="px-3 py-1.5 bg-emerald-100 rounded-xl">
            <Text className="text-xs font-bold text-emerald-800">📍 ولاية: سطيف</Text>
          </View>
          <View className="px-3 py-1.5 bg-slate-100 rounded-xl">
            <Text className="text-xs font-bold text-slate-700">بلدية: العلمة / سطيف</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <View className="space-y-4 mb-6">
          {doctors.map((doc) => (
            <View
              key={doc.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center">
                    <Text className="text-2xl">👨‍⚕️</Text>
                  </View>
                  <div>
                    <Text className="font-bold text-slate-900 text-sm">{doc.name}</Text>
                    <Text className="text-xs text-emerald-700 font-semibold">{doc.specialty}</Text>
                  </div>
                </View>
                <View className="bg-amber-50 px-2 py-1 rounded-lg flex-row items-center gap-1">
                  <Text className="text-xs">⭐</Text>
                  <Text className="text-xs font-bold text-amber-700">{doc.rating}</Text>
                </View>
              </View>

              <View className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3 space-y-1">
                <Text className="text-xs text-slate-600">📍 العنوان : {doc.commune}</Text>
                <Text className="text-xs text-slate-600">💵 سعر الاستشارة : {doc.fee}</Text>
                <Text className="text-xs text-emerald-600 font-bold">⏱️ أقرب موعد : {doc.availability}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleBook(doc.name)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl items-center shadow-sm"
              >
                <Text className="text-white text-xs font-bold">حجز موعد الآن</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
