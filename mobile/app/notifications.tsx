import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface NotificationItem {
  id: number;
  type: string;
  titleAr: string;
  titleFr: string;
  messageAr: string;
  messageFr: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: 'ORDER_STATUS_CHANGED',
      titleAr: 'طلبك جاهز للاستلام من صيدلية بلمعزة',
      titleFr: 'Commande prête pour retrait en pharmacie',
      messageAr: 'تم تحضير طلبيتك رقم CMD-2026-0929-01 وهي جاهزة للاستلام الفوري من صيدلية الحراسة بلمعزة (سطيف).',
      messageFr: 'Votre commande est prête au comptoir de la Pharmacie Belmaaza.',
      link: '/medications',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'APPOINTMENT',
      titleAr: 'تأكيد موعدك الطبي مع د. محمد علي',
      titleFr: 'Rendez-vous confirmé avec Dr. Mohamed ALI',
      messageAr: 'تم تأكيد موعدك الطبي بتاريخ 15 أكتوبر 2026 الساعة 10:30 صباحاً بعيادة الأمل بسطيف.',
      messageFr: 'Votre consultation du 15 Octobre 2026 à 10h30 est confirmée.',
      link: '/appointments',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 3,
      type: 'PRESCRIPTION',
      titleAr: 'صدور نتائج التحاليل المخبرية الجديدة',
      titleFr: 'Nouveaux résultats de bilan biologique',
      messageAr: 'أودع مخبر البركة بسطيف نتائج فحص الدم الشامل والوظائف الكلوية في ملفك الطبي الموحد.',
      messageFr: 'Résultats NFS et bilan rénal disponibles dans votre dossier.',
      link: '/medical-record',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 4,
      type: 'SYSTEM',
      titleAr: 'تحديث بطاقة الشفاء الإلكترونية',
      titleFr: 'Mise à jour Carte Chifa',
      messageAr: 'تم تحديث حقوق الضمان الاجتماعي بنسبة تغطية 80% وفق نظام التعاقد CNAS الجديد.',
      messageFr: 'Droits Chifa actualisés à 80% CNAS.',
      link: '/chifa-card',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ORDERS'>('ALL');

  const fetchLiveNotifications = async () => {
    try {
      const res = await axios.get('http://10.0.2.2:3001/notifications?role=PATIENT');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setNotifications(res.data);
      }
    } catch (e) {
      try {
        const res = await axios.get('http://localhost:3001/notifications?role=PATIENT');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setNotifications(res.data);
        }
      } catch (err) {}
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLiveNotifications();
    setRefreshing(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (item: NotificationItem) => {
    setNotifications(
      notifications.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    if (item.link) {
      router.push(item.link as any);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'ORDERS') return n.type === 'ORDER_STATUS_CHANGED' || n.type === 'ORDER_CREATED';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER_STATUS_CHANGED':
      case 'ORDER_CREATED':
        return '💊';
      case 'APPOINTMENT':
        return '📅';
      case 'PRESCRIPTION':
        return '📄';
      default:
        return '🔔';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-slate-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-slate-900">مركز الإشعارات والتنبيهات</Text>
            <Text className="text-xs text-slate-400">تحديثات فورية لطلبات الأدوية والمواعيد</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center"
          >
            <Text className="text-slate-700 font-bold">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Filters and Mark all as read */}
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row gap-1.5 bg-slate-100 p-1 rounded-xl">
            <TouchableOpacity
              onPress={() => setFilter('ALL')}
              className={`py-1.5 px-3 rounded-lg ${
                filter === 'ALL' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filter === 'ALL' ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                الكل ({notifications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('UNREAD')}
              className={`py-1.5 px-3 rounded-lg ${
                filter === 'UNREAD' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filter === 'UNREAD' ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                غير مقروءة ({notifications.filter((n) => !n.isRead).length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('ORDERS')}
              className={`py-1.5 px-3 rounded-lg ${
                filter === 'ORDERS' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  filter === 'ORDERS' ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                الطلبات
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-xs font-bold text-emerald-700">قراءة الكل</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.8}
            className={`p-4 rounded-2xl border mb-3 flex-row items-start gap-3 shadow-xs ${
              !item.isRead
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <View className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-slate-200 shadow-2xs">
              <Text className="text-lg">{getIcon(item.type)}</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs font-black text-slate-900 flex-1 pr-1 text-right">
                  {item.titleAr}
                </Text>
                {!item.isRead && (
                  <View className="w-2 h-2 rounded-full bg-emerald-600 ml-1" />
                )}
              </View>

              <Text className="text-[11px] text-slate-600 text-right leading-relaxed mb-1.5">
                {item.messageAr}
              </Text>

              <Text className="text-[9px] text-slate-400 font-mono text-right">
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
