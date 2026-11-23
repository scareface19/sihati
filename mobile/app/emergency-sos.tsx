import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function EmergencySOSModal() {
  const router = useRouter();
  const [sosSent, setSosSent] = useState(true);

  const call14 = () => {
    Linking.openURL('tel:14');
  };

  const callContact = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-red-600">
      <View className="flex-1 px-6 py-8 flex flex-col justify-between">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Text className="text-white font-bold text-lg">✕</Text>
          </TouchableOpacity>
          <Text className="text-white text-xs font-bold uppercase tracking-wider">
            حالة طوارئ نشطة • SIHATI SOS
          </Text>
        </View>

        {/* SOS Central Display */}
        <View className="items-center my-6">
          <View className="w-36 h-36 rounded-full bg-white flex items-center justify-center shadow-2xl">
            <Text className="text-red-600 text-4xl font-black">SOS</Text>
          </View>
          <Text className="text-white text-2xl font-black mt-6 text-center">
            تم إرسال إشارة الاستغاثة
          </Text>
          <Text className="text-red-100 text-xs text-center mt-2 px-4 leading-relaxed">
            تم تحديد موقعك بدقة (ولاية سطيف: 36.1911, 5.4137) وتنبيه جهات الاتصال الخاصة بك فوراً.
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4">
          {/* Call 14 */}
          <TouchableOpacity
            onPress={call14}
            activeOpacity={0.8}
            className="w-full py-4 bg-white rounded-2xl items-center flex-row justify-center gap-3 shadow-lg"
          >
            <Text className="text-2xl">📞</Text>
            <Text className="text-red-600 font-black text-lg">
              اتصال مباشر بالإسعاف والحماية المدنية (14)
            </Text>
          </TouchableOpacity>

          {/* Emergency Contacts */}
          <View className="bg-red-700/80 p-4 rounded-2xl border border-red-500">
            <Text className="text-xs text-red-200 font-bold mb-2">جهات الاتصال التي تم تنبيهها :</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white text-sm font-bold">• فاطمة بن علي (أم)</Text>
              <TouchableOpacity
                onPress={() => callContact('0612345678')}
                className="px-3 py-1 bg-white/20 rounded-lg"
              >
                <Text className="text-white text-xs font-bold">اتصال</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-sm font-bold">• أحمد بن علي (أخ)</Text>
              <TouchableOpacity
                onPress={() => callContact('0698765432')}
                className="px-3 py-1 bg-white/20 rounded-lg"
              >
                <Text className="text-white text-xs font-bold">اتصال</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full py-3 bg-red-800 rounded-xl items-center"
          >
            <Text className="text-red-200 text-xs font-bold">إلغاء إنذار الطوارئ (Faux alerte)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
