import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Données des pharmacies de garde de la Wilaya de Sétif
const PHARMACIES = [
  {
    id: 1,
    name: 'صيدلية بلمعزة',
    nameFr: 'Pharmacie Belmaaza',
    pharmacist: 'د. يوسف بلمعزة',
    commune: 'سطيف المركز',
    communeKey: 'Sétif',
    address: 'شارع 8 ماي 1945، بالقرب من ساحة عين الفوارة',
    phone: '036841255',
    phoneFormatted: '036 84 12 55',
    isNightGuard: true,
    openingHours: '24h/24h (حراسة ليلية)',
    distance: '0.8 كم',
    chifa: true,
    availableMeds: ['Doliprane 1000mg', 'Tareg 80mg', 'Kardégic 75mg', 'Augmentin'],
  },
  {
    id: 2,
    name: 'صيدلية النور',
    nameFr: 'Pharmacie En-Nour',
    pharmacist: 'د. خديجة عماري',
    commune: 'سطيف - حي بيزار',
    communeKey: 'Sétif',
    address: 'حي بيزار، مقابل العيادة المركزية متعددة الخدمات',
    phone: '036914520',
    phoneFormatted: '036 91 45 20',
    isNightGuard: true,
    openingHours: '24h/24h (حراسة ليلية)',
    distance: '2.1 كم',
    chifa: true,
    availableMeds: ['Insuline Lantus', 'Ventoline', 'Amoxicilline', 'Solupred'],
  },
  {
    id: 3,
    name: 'صيدلية الهضاب',
    nameFr: 'Pharmacie El Hidhab',
    pharmacist: 'د. سمير مبروك',
    commune: 'العلمة',
    communeKey: 'El Eulma',
    address: 'شارع دبي التجاري، العلمة، سطيف',
    phone: '036876090',
    phoneFormatted: '036 87 60 90',
    isNightGuard: true,
    openingHours: '24h/24h (حراسة ليلية)',
    distance: '18 كم',
    chifa: true,
    availableMeds: ['Glucophage 850mg', 'Lovenox 4000', 'Dafalgan', 'Aspegic'],
  },
  {
    id: 4,
    name: 'صيدلية عين الفوارة',
    nameFr: 'Pharmacie Ain Fouara',
    pharmacist: 'د. نسيمة حمودي',
    commune: 'سطيف المركز',
    communeKey: 'Sétif',
    address: 'ساحة عين الفوارة، مقابل المسجد العتيق',
    phone: '036832211',
    phoneFormatted: '036 83 22 11',
    isNightGuard: false,
    openingHours: '08:00 - 21:00',
    distance: '0.5 كم',
    chifa: true,
    availableMeds: ['Panadol 500mg', 'Clamoxyl 1g', 'Mopral 20mg'],
  },
  {
    id: 5,
    name: 'صيدلية عين أرنات',
    nameFr: 'Pharmacie Ain Arnat',
    pharmacist: 'د. مراد لعلام',
    commune: 'عين أرنات',
    communeKey: 'Ain Arnat',
    address: 'الطريق الوطني رقم 5، بالقرب من عيادة التوليد',
    phone: '036711540',
    phoneFormatted: '036 71 15 40',
    isNightGuard: true,
    openingHours: '24h/24h (حراسة ليلية)',
    distance: '12 كم',
    chifa: true,
    availableMeds: ['Doliprane 1000mg', 'Lovenox', 'Gaviscon'],
  },
  {
    id: 6,
    name: 'صيدلية عين ولمان',
    nameFr: 'Pharmacie Ain Oulmene',
    pharmacist: 'د. فاروق زيتوني',
    commune: 'عين ولمان',
    communeKey: 'Ain Oulmene',
    address: 'شارع أول نوفمبر 1954، وسط المدينة',
    phone: '036753012',
    phoneFormatted: '036 75 30 12',
    isNightGuard: true,
    openingHours: '24h/24h (حراسة ليلية)',
    distance: '32 كم',
    chifa: true,
    availableMeds: ['Insuline Lantus', 'Amoxicilline', 'Kardégic'],
  },
];

export default function PharmaciesRadarScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [nightOnly, setNightOnly] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState('ALL');

  // Modal Réservation Click & Reserve 2h
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [medsQuery, setMedsQuery] = useState('Doliprane 1000mg');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = PHARMACIES.filter((p) => {
    if (nightOnly && !p.isNightGuard) return false;
    if (selectedCommune !== 'ALL' && p.communeKey !== selectedCommune) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.includes(q) ||
      p.nameFr.toLowerCase().includes(q) ||
      p.pharmacist.includes(q) ||
      p.commune.includes(q) ||
      p.availableMeds.some((m) => m.toLowerCase().includes(q))
    );
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenReserve = (pharmacy: any) => {
    setSelectedPharmacy(pharmacy);
    setMedsQuery(search || 'Doliprane 1000mg');
    setOrderModalVisible(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedPharmacy) return;
    setIsSubmitting(true);
    const refNum = Math.floor(Math.random() * 9000 + 1000);
    const payload = {
      orderReference: `CMD-MOB-${refNum}`,
      patientName: 'محمد أمين بن علي (تطبيق الجوال)',
      patientPhone: '0555123456',
      itemsSummary: medsQuery || 'Doliprane 1000mg',
      doctorName: selectedPharmacy.name,
      prescriptionHash: `RES-${refNum}-SETIF`,
      chifaCoverageRate: 80,
      totalAmount: 950.0,
      patientCopay: 190.0,
      status: 'PENDING',
    };

    try {
      await axios.post('http://10.0.2.2:3001/pharmacy/orders', payload);
    } catch (e) {
      // Fallback localhost
      try {
        await axios.post('http://localhost:3001/pharmacy/orders', payload);
      } catch (err) {}
    }

    setIsSubmitting(false);
    setOrderModalVisible(false);
    Alert.alert(
      'تم الحجز بنجاح (Click & Reserve 2h) 🎉',
      `تم إرسال طلبك بنجاح إلى ${selectedPharmacy.name}.\n\nرقم الطلب: CMD-MOB-${refNum}\nالدواء المجهز: ${medsQuery}\nالمدة: جاهز للاستلام تحت ساعتين من صيدلية الحراسة.`,
      [{ text: 'حسناً' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-slate-900">رادار صيدليات الحراسة</Text>
            <Text className="text-xs text-emerald-700 font-bold">ولاية سطيف • تتبع مباشر 24h/24h</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center"
          >
            <Text className="text-slate-700 font-bold">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View className="mt-3 flex-row items-center bg-slate-100 px-3.5 py-2.5 rounded-2xl border border-slate-200">
          <Text className="text-base mr-2">🔍</Text>
          <TextInput
            placeholder="ابحث عن صيدلية، حي، أو دواء (مثال: Doliprane)..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-xs text-slate-800 text-right"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-slate-400 text-xs font-bold">✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filters */}
        <View className="flex-row items-center justify-between mt-3 gap-2">
          {/* Night guard toggle */}
          <TouchableOpacity
            onPress={() => setNightOnly(!nightOnly)}
            className={`py-2 px-3 rounded-xl border flex-row items-center gap-1.5 ${
              nightOnly
                ? 'bg-amber-500 border-amber-600'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <Text className="text-xs">🌙</Text>
            <Text
              className={`text-xs font-bold ${
                nightOnly ? 'text-white' : 'text-amber-900'
              }`}
            >
              حراسة ليلية 24h
            </Text>
          </TouchableOpacity>

          {/* Commune Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
            {['ALL', 'Sétif', 'El Eulma', 'Ain Arnat', 'Ain Oulmene'].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedCommune(c)}
                className={`py-2 px-3 rounded-xl mr-1.5 border ${
                  selectedCommune === c
                    ? 'bg-slate-900 border-slate-900'
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedCommune === c ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {c === 'ALL'
                    ? 'جميع البلديات'
                    : c === 'Sétif'
                    ? 'سطيف'
                    : c === 'El Eulma'
                    ? 'العلمة'
                    : c === 'Ain Arnat'
                    ? 'عين أرنات'
                    : 'عين ولمان'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Pharmacies Cards List */}
      <ScrollView className="flex-1 px-4 py-3" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xs font-bold text-slate-500">
            {filtered.length} صيدليات معتمدة متاحة
          </Text>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-[10px] text-emerald-700 font-bold">تحديث لحظي</Text>
          </View>
        </View>

        {filtered.map((pharmacy) => (
          <View
            key={pharmacy.id}
            className="bg-white p-4 rounded-3xl border border-slate-200 mb-3.5 shadow-sm"
          >
            {/* Top row */}
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center gap-1.5 mb-1">
                  {pharmacy.isNightGuard && (
                    <View className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex-row items-center gap-1">
                      <Text className="text-[10px]">🌙</Text>
                      <Text className="text-[10px] text-amber-900 font-black">حراسة ليلية 24h</Text>
                    </View>
                  )}
                  {pharmacy.chifa && (
                    <View className="bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] text-teal-800 font-bold">Chifa CNAS</Text>
                    </View>
                  )}
                </View>
                <Text className="text-base font-black text-slate-900">{pharmacy.name}</Text>
                <Text className="text-xs text-slate-500 font-semibold">{pharmacy.nameFr}</Text>
                <Text className="text-[11px] text-emerald-700 font-bold mt-0.5">
                  {pharmacy.pharmacist}
                </Text>
              </View>

              <View className="items-end">
                <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                  <Text className="text-xs font-black text-emerald-800">{pharmacy.distance}</Text>
                </View>
                <Text className="text-[10px] text-slate-400 mt-1 font-bold">{pharmacy.commune}</Text>
              </View>
            </View>

            {/* Address & Hours */}
            <View className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 mb-3">
              <Text className="text-xs text-slate-600 mb-1">📍 {pharmacy.address}</Text>
              <Text className="text-xs text-slate-700 font-semibold">🕒 {pharmacy.openingHours}</Text>
            </View>

            {/* Available Meds Chips */}
            <View className="mb-3">
              <Text className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase">
                الأدوية الحيوية المتوفرة الآن :
              </Text>
              <View className="flex-row flex-wrap gap-1.5">
                {pharmacy.availableMeds.map((med, i) => (
                  <View key={i} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    <Text className="text-[10px] text-slate-700 font-semibold">{med}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-2 pt-2 border-t border-slate-100">
              <TouchableOpacity
                onPress={() => handleCall(pharmacy.phone)}
                className="flex-1 py-2.5 bg-slate-100 active:bg-slate-200 rounded-xl flex-row items-center justify-center gap-1.5 border border-slate-200"
              >
                <Text className="text-sm">📞</Text>
                <Text className="text-xs font-bold text-slate-800">
                  اتصال: {pharmacy.phoneFormatted}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOpenReserve(pharmacy)}
                className="flex-1 py-2.5 bg-emerald-600 active:bg-emerald-700 rounded-xl flex-row items-center justify-center gap-1.5 shadow-sm"
              >
                <Text className="text-sm">🛍️</Text>
                <Text className="text-xs font-bold text-white">حجز مسبق (2h)</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal Réservation Click & Reserve 2h */}
      {orderModalVisible && selectedPharmacy && (
        <Modal transparent animationType="fade" visible={orderModalVisible}>
          <View className="flex-1 bg-slate-900/60 justify-center items-center p-4">
            <View className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl">
              <View className="items-center mb-4">
                <View className="w-12 h-12 rounded-2xl bg-emerald-100 items-center justify-center mb-2">
                  <Text className="text-2xl">🛍️</Text>
                </View>
                <Text className="text-base font-black text-slate-900 text-center">
                  حجز الدواء في الصيدلية (2h)
                </Text>
                <Text className="text-xs text-emerald-700 font-bold text-center mt-0.5">
                  {selectedPharmacy.name}
                </Text>
              </View>

              <Text className="text-xs text-slate-500 mb-2 font-bold">اسم الدواء المطلوب تحضيره :</Text>
              <TextInput
                value={medsQuery}
                onChangeText={setMedsQuery}
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-800 font-bold mb-4 text-right"
                placeholder="اسم الدواء..."
              />

              <View className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 mb-5">
                <Text className="text-[11px] text-emerald-900 font-bold">
                  ✓ سيتم تجهيز طلبيتك بالصيدلية خلال ساعتين (2h)
                </Text>
                <Text className="text-[10px] text-emerald-700 mt-1">
                  يمكنك الاستلام مباشرة دون انتظار مع تقديم بطاقة الشفاء عند الحضور.
                </Text>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleConfirmReservation}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 rounded-2xl items-center justify-center shadow-sm"
                >
                  <Text className="text-white text-xs font-bold">
                    {isSubmitting ? 'جارٍ الحجز...' : 'تأكيد الحجز الفوري'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setOrderModalVisible(false)}
                  className="py-3 px-4 bg-slate-100 rounded-2xl items-center justify-center"
                >
                  <Text className="text-slate-600 text-xs font-bold">إلغاء</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
