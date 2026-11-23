import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ChifaCardScreen() {
  const router = useRouter();

  const patient = {
    name: 'محمد أمين بن علي',
    nameFr: 'Mohamed Amine BENALI',
    bloodGroup: 'O+',
    chifaNumber: '1996 0519 2800 4512',
    fileNumber: 'EHR-2024-SETIF-784512',
    dateOfBirth: '14/05/1996',
    wilaya: 'سطيف (19)',
    coverageRate: '80%',
    status: 'مؤمن اجتماعي نشط (CNAS)',
    emergencyContact: '0555 12 34 56 (الأخ)',
    allergies: 'بنسلين (Pénicilline)',
    chronic: 'ارتفاع ضغط الدم (HTA)',
  };

  const handleShareCard = async () => {
    try {
      await Share.share({
        message: `بطاقة صحتي الرقمية - المريض: ${patient.nameFr}\nرقم الملف الطبي: ${patient.fileNumber}\nفصيلة الدم: ${patient.bloodGroup}\nالحساسيات: ${patient.allergies}\nطوارئ: ${patient.emergencyContact}`,
        title: 'بطاقة صحتي الرقمية (SIHATI)',
      });
    } catch (e) {}
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      {/* Top Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-slate-800">
        <View>
          <Text className="text-xl font-black text-white">بطاقتي الصحية الرقمية 3D</Text>
          <Text className="text-xs text-emerald-400">بطاقة الشفاء والملف الطبي الموحد</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-xl bg-slate-800 items-center justify-center border border-slate-700"
        >
          <Text className="text-white font-bold">✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Physical Smart Card Simulation (Gradient Emerald / Gold) */}
        <View className="bg-emerald-800 rounded-3xl p-6 border-2 border-emerald-500 shadow-2xl mb-6 relative overflow-hidden">
          {/* Background watermark */}
          <View className="absolute -right-10 -bottom-10 opacity-10">
            <Text className="text-9xl text-white font-black">🇩🇿</Text>
          </View>

          {/* Top of Card */}
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </Text>
              <Text className="text-sm font-black text-white mt-0.5">
                بطاقة الشفاء الرقمية • منصة صحّتي
              </Text>
            </View>
            <View className="w-12 h-10 rounded-lg bg-amber-400/90 border border-amber-300 items-center justify-center shadow">
              {/* Smart Card Chip */}
              <View className="w-8 h-6 border border-amber-600 rounded-sm flex-row flex-wrap justify-between p-0.5 opacity-80">
                <View className="w-3 h-2 border-b border-r border-amber-600" />
                <View className="w-3 h-2 border-b border-amber-600" />
                <View className="w-3 h-2 border-r border-amber-600" />
                <View className="w-3 h-2" />
              </View>
            </View>
          </View>

          {/* Card Number */}
          <Text className="text-xs text-emerald-300 font-semibold mb-1">
            رقم بطاقة الشفاء الإلكترونية :
          </Text>
          <Text className="text-xl font-mono font-black text-white tracking-widest mb-6">
            {patient.chifaNumber}
          </Text>

          {/* Bottom of Card */}
          <View className="flex-row justify-between items-end border-t border-emerald-700/60 pt-4">
            <View>
              <Text className="text-[10px] text-emerald-300 font-bold uppercase">الاسم واللقب</Text>
              <Text className="text-base font-black text-white">{patient.name}</Text>
              <Text className="text-xs text-emerald-200 font-semibold">{patient.nameFr}</Text>
            </View>

            <View className="items-end">
              <Text className="text-[10px] text-emerald-300 font-bold uppercase">فصيلة الدم</Text>
              <View className="bg-red-600 px-3 py-1 rounded-xl mt-0.5 border border-red-400">
                <Text className="text-white font-black text-sm">{patient.bloodGroup}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* QR Code Quick Scan for Emergency & Doctors */}
        <View className="bg-slate-800 p-5 rounded-3xl border border-slate-700 items-center mb-6">
          <Text className="text-sm font-black text-white mb-1">رمز الاستجابة السريعة (QR Code)</Text>
          <Text className="text-xs text-slate-400 text-center mb-4">
            امسح الرمز بواسطة الصيدلي، الطبيب، أو فرق الطوارئ للوصول للملف الطبي فوراً
          </Text>

          {/* QR visual placeholder */}
          <View className="w-48 h-48 bg-white rounded-2xl p-4 items-center justify-center border-4 border-emerald-500 shadow-lg">
            <Text className="text-6xl">📱</Text>
            <Text className="text-[11px] font-mono font-bold text-slate-800 mt-2">
              SIHATI-EHR-784512
            </Text>
            <Text className="text-[9px] text-slate-500 font-bold">Loi 18-07 - ANPDP</Text>
          </View>

          <View className="mt-4 flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Text className="text-xs text-emerald-400 font-bold">مفعل ومؤمن بشهادة رقمية</Text>
          </View>
        </View>

        {/* Detailed Medical ID Data */}
        <View className="bg-slate-800 p-5 rounded-3xl border border-slate-700 mb-6 space-y-3">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            المعطيات الطبية المدمجة
          </Text>

          <View className="flex-row justify-between py-2 border-b border-slate-700">
            <Text className="text-xs text-slate-400">رقم الملف الوطني :</Text>
            <Text className="text-xs font-mono font-bold text-white">{patient.fileNumber}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-700">
            <Text className="text-xs text-slate-400">نسبة التغطية الاجتماعية :</Text>
            <Text className="text-xs font-bold text-emerald-400">{patient.coverageRate} (CNAS)</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-700">
            <Text className="text-xs text-slate-400">الحساسيات المسجلة :</Text>
            <Text className="text-xs font-bold text-red-400">{patient.allergies}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-slate-700">
            <Text className="text-xs text-slate-400">أمراض مزمنة :</Text>
            <Text className="text-xs font-bold text-amber-400">{patient.chronic}</Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-xs text-slate-400">هاتف الطوارئ المرافق :</Text>
            <Text className="text-xs font-bold text-white">{patient.emergencyContact}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity
            onPress={handleShareCard}
            className="flex-1 py-3.5 bg-emerald-600 rounded-2xl items-center justify-center flex-row gap-2"
          >
            <Text className="text-base">📤</Text>
            <Text className="text-white text-xs font-bold">مشاركة البطاقة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/emergency-sos')}
            className="py-3.5 px-5 bg-red-600 rounded-2xl items-center justify-center flex-row gap-1.5"
          >
            <Text className="text-base">🚨</Text>
            <Text className="text-white text-xs font-bold">طوارئ SOS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
