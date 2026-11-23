import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();

  const handleSOS = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'زر الطوارئ SOS',
      'هل ترغب في تفعيل حالة الطوارئ وإرسال موقعك وملفك الطبي لفرق الإسعاف (14) وجهات الاتصال ؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم، إرسال استغاثة',
          style: 'destructive',
          onPress: () => router.push('/emergency-sos'),
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="px-4 py-3" showsVerticalScrollIndicator={false}>
        {/* Welcome Header with Notification Bell */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-xs text-slate-400 font-semibold">مرحباً بك</Text>
            <Text className="text-2xl font-black text-slate-900">محمد أمين بن علي</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="w-11 h-11 rounded-2xl bg-white items-center justify-center border border-slate-200 shadow-xs relative"
            >
              <Text className="text-xl">🔔</Text>
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full items-center justify-center border-2 border-white">
                <Text className="text-[9px] text-white font-black">2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/chifa-card')}
              className="w-11 h-11 rounded-2xl bg-emerald-100 items-center justify-center border border-emerald-300"
            >
              <Text className="text-emerald-800 font-black text-base">O+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Digital Chifa Card Quick Access */}
        <TouchableOpacity
          onPress={() => router.push('/chifa-card')}
          activeOpacity={0.85}
          className="bg-emerald-800 rounded-3xl p-4 mb-4 border border-emerald-600 shadow-md flex-row justify-between items-center"
        >
          <View className="flex-1 pr-3">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Text className="text-[10px] text-emerald-200 font-bold uppercase">بطاقة الشفاء الرقمية 3D</Text>
              <View className="bg-emerald-600 px-2 py-0.5 rounded-full">
                <Text className="text-[9px] text-white font-bold">تغطية 80% CNAS</Text>
              </View>
            </View>
            <Text className="text-base font-mono font-black text-white">1996 0519 2800 4512</Text>
            <Text className="text-[11px] text-emerald-200 mt-0.5">انقر لإظهار كود QR والفحص السريع</Text>
          </View>
          <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
            <Text className="text-2xl">💳</Text>
          </View>
        </TouchableOpacity>

        {/* Motivational Banner */}
        <View className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-4 mb-4 shadow-lg shadow-emerald-200">
          <Text className="text-xs text-emerald-100 font-bold uppercase tracking-wider mb-1">
            صحتك أولويتنا • سطيف
          </Text>
          <Text className="text-xl font-black text-white">صحتك تهمنا</Text>
          <Text className="text-xs text-white/90 mt-0.5 leading-relaxed">
            جميع فحوصاتك ووصفاتك الطبية في متناول يدك دائماً وبأمان تام (قانون 18-07).
          </Text>
        </View>

        {/* Big Red SOS Button */}
        <TouchableOpacity
          onPress={handleSOS}
          activeOpacity={0.85}
          className="bg-red-600 rounded-3xl p-5 mb-5 shadow-xl shadow-red-300 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <Text className="text-red-200 text-[10px] font-bold uppercase tracking-wider">
              استغاثة استعجالية فورية
            </Text>
            <Text className="text-white text-xl font-black mt-0.5">زر طوارئ (SOS)</Text>
            <Text className="text-red-100 text-xs mt-1">
              مشاركة الموقع مع الحماية المدنية (14) وجهات الاتصال
            </Text>
          </View>
          <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center">
            <Text className="text-white text-2xl font-black">🚨</Text>
          </View>
        </TouchableOpacity>

        {/* Next Medication Reminder */}
        <View className="bg-white rounded-3xl p-4 mb-5 border border-slate-200 shadow-sm flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
              <Text className="text-lg">💊</Text>
            </View>
            <View>
              <Text className="text-xs text-slate-400 font-semibold">تذكير بالدواء القادم</Text>
              <Text className="text-sm font-bold text-slate-900">Valsartan (Tareg) 80mg</Text>
              <Text className="text-[10px] text-slate-500">قرص بعد الغداء • التزام 100%</Text>
            </View>
          </View>
          <Text className="text-base font-black text-emerald-600">13:00</Text>
        </View>

        {/* Grid of Main Services */}
        <Text className="text-base font-black text-slate-900 mb-3">الخدمات الرئيسية</Text>
        <View className="flex-row flex-wrap justify-between gap-y-3 mb-8">
          <ServiceGridItem
            icon="📁"
            title="ملف صحي"
            onPress={() => router.push('/medical-record')}
          />
          <ServiceGridItem
            icon="🏪"
            title="رادار الصيدليات"
            onPress={() => router.push('/pharmacies-radar')}
          />
          <ServiceGridItem
            icon="👨‍⚕️"
            title="الأطباء"
            onPress={() => router.push('/doctors-search')}
          />
          <ServiceGridItem
            icon="💊"
            title="الأدوية"
            onPress={() => router.push('/medications')}
          />
          <ServiceGridItem
            icon="🛡️"
            title="تتبع الأدوية"
            onPress={() => router.push('/traceability')}
          />
          <ServiceGridItem
            icon="🔔"
            title="التنبيهات"
            onPress={() => router.push('/notifications')}
          />
          <ServiceGridItem
            icon="💳"
            title="بطاقة الشفاء"
            onPress={() => router.push('/chifa-card')}
          />
          <ServiceGridItem
            icon="📅"
            title="المواعيد"
            onPress={() => router.push('/appointments')}
          />
          <ServiceGridItem
            icon="📍"
            title="خريطة صحية"
            onPress={() => router.push('/doctors-search')}
          />
          <ServiceGridItem
            icon="👨‍👩‍👧"
            title="حساب عائلي"
            onPress={() => router.push('/more')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ServiceGridItem({ icon, title, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-[31%] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm items-center justify-center min-h-[96px]"
    >
      <Text className="text-2xl mb-1.5">{icon}</Text>
      <Text className="font-bold text-slate-800 text-xs text-center">{title}</Text>
    </TouchableOpacity>
  );
}
