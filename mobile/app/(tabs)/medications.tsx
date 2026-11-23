import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MedicationsScreen() {
  const [activeTab, setActiveTab] = useState<'prescribed' | 'selfMed'>('prescribed');
  const [modalVisible, setModalVisible] = useState(false);
  const [newSelfMedName, setNewSelfMedName] = useState('');
  const [newSelfMedReason, setNewSelfMedReason] = useState('');

  const [selfMeds, setSelfMeds] = useState([
    {
      name: 'فيتامين د (Vitamine D)',
      type: 'مكمل غذائي',
      dosage: '1000 وحدة',
      frequency: 'صباحاً بعد الغداء',
    },
    {
      name: 'مغلي البابونج (Tisane)',
      type: 'أعشاب طبيعية',
      dosage: 'كوب دافئ',
      frequency: 'قبل النوم',
    },
  ]);

  const handleAddSelfMed = () => {
    if (!newSelfMedName) return;
    setSelfMeds([
      ...selfMeds,
      {
        name: newSelfMedName,
        type: 'علاج بدون وصفة',
        dosage: 'حسب الحاجة',
        frequency: newSelfMedReason || 'يومياً',
      },
    ]);
    setNewSelfMedName('');
    setNewSelfMedReason('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <Text className="text-xl font-black text-slate-900">الأدوية والتنبيهات</Text>
        <Text className="text-xs text-slate-400">تتبع مواعيد العلاج وسجل الأدوية المتناولة</Text>

        <View className="flex-row mt-3 bg-slate-100 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setActiveTab('prescribed')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'prescribed' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'prescribed' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              الوصفات الحالية
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('selfMed')}
            className={`flex-1 py-2 rounded-lg items-center ${
              activeTab === 'selfMed' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'selfMed' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              العلاج الذاتي (المكملات)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'prescribed' ? (
          <View className="space-y-4">
            {/* Daily Schedule Box */}
            <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <Text className="text-xs font-black text-slate-400 mb-3">أدوية اليوم (Horaires)</Text>

              <View className="space-y-3">
                <View className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm font-bold text-slate-900">Valsartan 80mg</Text>
                    <Text className="text-[11px] text-emerald-800">قرص واحد بعد الإفطار</Text>
                  </View>
                  <Text className="text-sm font-black text-emerald-700">08:00</Text>
                </View>

                <View className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm font-bold text-slate-900">Vitamine D 1000 UI</Text>
                    <Text className="text-[11px] text-blue-800">كبسولة بعد الغداء</Text>
                  </View>
                  <Text className="text-sm font-black text-blue-700">13:00</Text>
                </View>

                <View className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm font-bold text-slate-900">Atorvastatine 20mg</Text>
                    <Text className="text-[11px] text-purple-800">قرص ليلاً قبل النوم</Text>
                  </View>
                  <Text className="text-sm font-black text-purple-700">21:00</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="space-y-4">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-emerald-600 p-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
            >
              <Text className="text-white text-lg font-bold">+</Text>
              <Text className="text-white text-sm font-bold">تسجيل منتج أو عشب مستعمل بدون وصفة</Text>
            </TouchableOpacity>

            <View className="space-y-3">
              {selfMeds.map((m, idx) => (
                <View key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-bold text-slate-900">{m.name}</Text>
                    <Text className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {m.type}
                    </Text>
                  </View>
                  <Text className="text-xs text-slate-500 mt-1">الجرعة : {m.dosage}</Text>
                  <Text className="text-xs text-slate-500">التكرار : {m.frequency}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal for adding Self-Medication */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 space-y-4">
            <Text className="text-lg font-black text-slate-900">تسجيل علاج ذاتي (Auto-médication)</Text>
            <TextInput
              value={newSelfMedName}
              onChangeText={setNewSelfMedName}
              placeholder="اسم المنتج أو الدواء أو العشبة..."
              className="p-3 border border-slate-200 rounded-xl text-sm"
            />
            <TextInput
              value={newSelfMedReason}
              onChangeText={setNewSelfMedReason}
              placeholder="سبب الاستعمال (مثال: ألم رأس، نوم مضطرب...)"
              className="p-3 border border-slate-200 rounded-xl text-sm"
            />
            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity
                onPress={handleAddSelfMed}
                className="flex-1 py-3 bg-emerald-600 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-sm">حفظ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="py-3 px-6 bg-slate-100 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-bold text-sm">إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
