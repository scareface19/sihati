import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function MobileTraceabilityScreen() {
  const router = useRouter();
  const [searchCode, setSearchCode] = useState('LOT-2026-DZ-8492');
  const [loading, setLoading] = useState(false);
  const [drug, setDrug] = useState<any>({
    brandName: 'DOLIPRANE 1000 MG',
    dci: 'PARACETAMOL',
    batchNumber: 'LOT-2026-DZ-8492',
    serialNumber: 'SN-ALG-2026-94821048',
    status: 'CONFORME',
    manufacturer: 'SAIDAL (Usine Constantine)',
    coldChainRequired: false,
    expiryDate: '2029-01-15',
    timeline: [
      { step: 'Fabrication & CQ', location: 'SAIDAL Constantine', date: '15/01/2026', status: 'CONFORME' },
      { step: 'Grossiste Répartiteur', location: 'Maghreb Pharma Sétif', date: '02/02/2026', status: 'CONFORME' },
      { step: 'Officine Agréée', location: 'Pharmacie Belmaaza Sétif', date: '18/02/2026', status: 'CONFORME' },
    ],
  });

  const handleSearch = (code: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code.includes('COLD') || code.includes('1142')) {
        setDrug({
          brandName: 'LANTUS SOLOSTAR 100 U/ML',
          dci: 'INSULINE GLARGINE',
          batchNumber: 'LOT-2026-COLD-1142',
          serialNumber: 'SN-ALG-2026-55829104',
          status: 'CONFORME',
          manufacturer: 'Biopharm Algérie / Sanofi',
          coldChainRequired: true,
          currentTemperature: 4.8,
          expiryDate: '2028-02-10',
          timeline: [
            { step: 'Fabrication Stérile', location: 'Biopharm Oued Smar', date: '10/02/2026', status: 'CONFORME' },
            { step: 'Transport Frigorifique (4°C)', location: 'TransCold DZ', date: '25/02/2026', status: 'CONFORME' },
            { step: 'Stockage Frigo Officine', location: 'Pharmacie Belmaaza Sétif', date: '28/02/2026', status: 'CONFORME' },
          ],
        });
      } else if (code.includes('RECALL') || code.includes('991')) {
        setDrug({
          brandName: 'AUGMENTIN 1 G / 125 MG',
          dci: 'AMOXICILLINE + ACIDE CLAVULANIQUE',
          batchNumber: 'LOT-2025-RECALL-991',
          serialNumber: 'SN-ALG-2025-00192841',
          status: 'RECALLED',
          manufacturer: 'Laboratoires GSK Algérie',
          coldChainRequired: false,
          recallReason: 'Défaut étanchéité sachet - Rappel ANPP Niveau 2',
          expiryDate: '2027-11-01',
          timeline: [
            { step: 'Production', location: 'GSK Algérie', date: '01/11/2025', status: 'CONFORME' },
            { step: 'Alerte Sanitaire de Retrait', location: 'Ministère de la Santé', date: '20/09/2026', status: 'RECALLED' },
          ],
        });
      } else {
        setDrug({
          brandName: 'DOLIPRANE 1000 MG',
          dci: 'PARACETAMOL',
          batchNumber: 'LOT-2026-DZ-8492',
          serialNumber: 'SN-ALG-2026-94821048',
          status: 'CONFORME',
          manufacturer: 'SAIDAL (Usine Constantine)',
          coldChainRequired: false,
          expiryDate: '2029-01-15',
          timeline: [
            { step: 'Fabrication & CQ', location: 'SAIDAL Constantine', date: '15/01/2026', status: 'CONFORME' },
            { step: 'Grossiste Répartiteur', location: 'Maghreb Pharma Sétif', date: '02/02/2026', status: 'CONFORME' },
            { step: 'Officine Agréée', location: 'Pharmacie Belmaaza Sétif', date: '18/02/2026', status: 'CONFORME' },
          ],
        });
      }
    }, 400);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-slate-200 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
        >
          <Text className="text-lg font-bold text-slate-700">→</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-base font-black text-slate-900">تتبع وأصالة الأدوية</Text>
          <Text className="text-[10px] text-emerald-700 font-bold">المنظومة الوطنية للسلامة ANPP</Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {/* Search Input Box */}
        <View className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4">
          <Text className="text-xs font-bold text-slate-700 mb-2">رقم الحصة (Lot) أو المسح الرقمي</Text>
          <View className="flex-row gap-2">
            <TextInput
              value={searchCode}
              onChangeText={setSearchCode}
              placeholder="LOT-2026-DZ-8492"
              className="flex-1 bg-slate-100 px-3 py-2.5 rounded-xl font-mono text-sm border border-slate-200"
            />
            <TouchableOpacity
              onPress={() => handleSearch(searchCode)}
              className="bg-emerald-600 px-4 py-2.5 rounded-xl items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white font-bold text-xs">تحقق</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Presets */}
          <View className="flex-row gap-2 mt-3 flex-wrap">
            <TouchableOpacity
              onPress={() => {
                setSearchCode('LOT-2026-DZ-8492');
                handleSearch('LOT-2026-DZ-8492');
              }}
              className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"
            >
              <Text className="text-[11px] text-emerald-800 font-bold">🟢 دوليبران صيدال</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSearchCode('LOT-2026-COLD-1142');
                handleSearch('LOT-2026-COLD-1142');
              }}
              className="bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-lg"
            >
              <Text className="text-[11px] text-cyan-800 font-bold">🧊 لانتوس (تبريد)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSearchCode('LOT-2025-RECALL-991');
                handleSearch('LOT-2025-RECALL-991');
              }}
              className="bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg"
            >
              <Text className="text-[11px] text-rose-800 font-bold">🚨 أوجمنتين (سحب)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Drug Verification Result */}
        {drug && (
          <View className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-6">
            {/* Status Header */}
            <View
              className={`p-4 flex-row items-center gap-3 ${
                drug.status === 'RECALLED' ? 'bg-red-600' : 'bg-emerald-700'
              }`}
            >
              <Text className="text-2xl">{drug.status === 'RECALLED' ? '🚨' : '🛡️'}</Text>
              <View className="flex-1">
                <Text className="text-white font-black text-sm">
                  {drug.status === 'RECALLED'
                    ? 'تحذير : حصة مسحوبة رسمياً من السوق !'
                    : 'دواء أصلي ومعتمد رسمياً (Conforme)'}
                </Text>
                <Text className="text-white/80 text-[10px]">
                  {drug.status === 'RECALLED'
                    ? 'يمنع تناول الدواء ويجب إرجاعه للصيدلية'
                    : 'مطابق للمعايير الصيدلانية الجزائرية'}
                </Text>
              </View>
            </View>

            {/* Drug Details */}
            <View className="p-4">
              <Text className="text-xl font-black text-slate-900 mb-0.5">{drug.brandName}</Text>
              <Text className="text-xs text-slate-500 font-medium mb-4">{drug.dci}</Text>

              <View className="bg-slate-50 p-3 rounded-2xl border border-slate-100 gap-2 mb-4">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">رقم الحصة :</Text>
                  <Text className="text-xs font-mono font-bold text-slate-800">{drug.batchNumber}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">الرقم التسلسلي :</Text>
                  <Text className="text-xs font-mono font-bold text-slate-800">{drug.serialNumber}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">المصنع :</Text>
                  <Text className="text-xs font-bold text-slate-800">{drug.manufacturer}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">تاريخ الصلاحية :</Text>
                  <Text className="text-xs font-bold text-slate-800">{drug.expiryDate}</Text>
                </View>
              </View>

              {/* Cold Chain Widget */}
              {drug.coldChainRequired && (
                <View className="bg-cyan-50 p-3 rounded-2xl border border-cyan-200 mb-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-2xl">🧊</Text>
                    <View>
                      <Text className="text-xs font-bold text-cyan-900">سلسلة التبريد (Cold Chain)</Text>
                      <Text className="text-[10px] text-cyan-700">المجال النظامي : 2°C إلى 8°C</Text>
                    </View>
                  </View>
                  <View className="bg-cyan-700 px-3 py-1 rounded-xl">
                    <Text className="text-white font-black text-xs font-mono">
                      {drug.currentTemperature}°C ✅
                    </Text>
                  </View>
                </View>
              )}

              {/* Recall Warning Detail */}
              {drug.status === 'RECALLED' && (
                <View className="bg-red-50 p-3 rounded-2xl border border-red-200 mb-4">
                  <Text className="text-xs font-bold text-red-800">سبب السحب :</Text>
                  <Text className="text-xs text-red-700 mt-0.5">{drug.recallReason}</Text>
                </View>
              )}

              {/* Timeline */}
              <Text className="text-xs font-black text-slate-800 mb-2">مسار التوزيع والتدقيق :</Text>
              <View className="border-r-2 border-emerald-500 pr-3 space-y-3">
                {drug.timeline?.map((step: any, index: number) => (
                  <View key={index} className="relative mb-2">
                    <Text className="text-xs font-bold text-slate-800">{step.step}</Text>
                    <Text className="text-[10px] text-slate-500">{step.location} • {step.date}</Text>
                  </View>
                ))}
              </View>

              {/* Report Button */}
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'إبلاغ عن دواء مشبوه',
                    'تم إرسال بلاغك حول الحصة إلى مفتشية الصيدلة لولاية سطيف ووزارة الصحة.',
                    [{ text: 'حسناً' }]
                  )
                }
                className="mt-4 bg-slate-900 py-3 rounded-2xl items-center"
              >
                <Text className="text-white font-bold text-xs">🚨 إبلاغ عن شك في الدواء (يقظة دوائية)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
