'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api, { API_BASE } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import {
  Bell,
  CheckCircle,
  Pill,
  Calendar,
  AlertTriangle,
  FileText,
  Activity,
  Shield,
  Clock,
  Check,
  Radio,
  X,
  ExternalLink,
} from 'lucide-react';

interface NotificationItem {
  id: number;
  userId?: number;
  targetRole: string;
  type: string;
  titleAr: string;
  titleFr: string;
  titleEn?: string;
  messageAr: string;
  messageFr: string;
  messageEn?: string;
  link?: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export default function NotificationCenter() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { language, dir } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ORDERS' | 'HEALTH'>('ALL');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveToast, setLiveToast] = useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = user?.role || 'ALL';
  const userId = user?.id;

  // Charger les notifications initiales
  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications', {
        params: { role, userId },
      });
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: NotificationItem) => !n.isRead).length);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    loadNotifications();

    // Connexion SSE (Server-Sent Events) Temps Réel
    let eventSource: EventSource | null = null;
    try {
      const streamUrl = `${API_BASE}/notifications/stream?role=${role}${userId ? `&userId=${userId}` : ''}`;
      eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => {
        setIsLiveConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'NOTIFICATION_RECEIVED' && parsed.data) {
            const newNotif: NotificationItem = parsed.data;
            setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
            setUnreadCount((prev) => prev + 1);

            // Afficher toast en temps réel
            setLiveToast(newNotif);
            setTimeout(() => setLiveToast(null), 5000);
          } else if (parsed.type === 'ORDER_CREATED' || parsed.type === 'ORDER_STATUS_CHANGED') {
            // Recharger la liste
            loadNotifications();
          }
        } catch (err) {
          // Erreur de parsing SSE
        }
      };

      eventSource.onerror = () => {
        setIsLiveConnected(false);
      };
    } catch (e) {
      setIsLiveConnected(false);
    }

    // Polling de secours toutes les 15 secondes
    const interval = setInterval(loadNotifications, 15000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [role, userId]);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Marquer tout comme lu
  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read', { role, userId });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  // Clic sur une notification
  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  // Filtrer les notifications affichées
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'ORDERS') return n.type === 'ORDER_CREATED' || n.type === 'ORDER_STATUS_CHANGED';
    if (filter === 'HEALTH') return n.type === 'APPOINTMENT' || n.type === 'PRESCRIPTION' || n.type === 'STOCK_ALERT';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER_CREATED':
      case 'ORDER_STATUS_CHANGED':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-cyan-600" />;
      case 'STOCK_ALERT':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'PRESCRIPTION':
        return <FileText className="w-4 h-4 text-teal-600" />;
      case 'SYSTEM':
        return <Shield className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-600" />;
    }
  };

  // Libellés traduits
  const title = dir === 'rtl' ? 'مركز التنبيهات اللحظية' : 'Centre de Notifications';
  const markAllText = dir === 'rtl' ? 'تعليم الكل كمقروء' : 'Tout marquer comme lu';
  const liveText = isLiveConnected ? (dir === 'rtl' ? 'مباشر' : 'En direct') : (dir === 'rtl' ? 'متصل' : 'Connecté');
  const emptyText = dir === 'rtl' ? 'لا توجد إشعارات جديدة حالياً' : 'Aucune notification pour le moment';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toast Notification Flottante en temps réel */}
      {liveToast && (
        <div
          onClick={() => handleNotificationClick(liveToast)}
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-white rounded-2xl border-2 border-emerald-500 shadow-2xl p-4 cursor-pointer animate-slide-down transition hover:shadow-emerald-200"
          dir={dir}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl shrink-0 mt-0.5">
              {getNotificationIcon(liveToast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {dir === 'rtl' ? 'تنبيه فوري مباشر' : 'Alerte Temps Réel'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Maintenant</span>
              </div>
              <h5 className="text-xs font-black text-slate-900 leading-tight">
                {language === 'ar' ? liveToast.titleAr : language === 'en' && liveToast.titleEn ? liveToast.titleEn : liveToast.titleFr}
              </h5>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {language === 'ar' ? liveToast.messageAr : language === 'en' && liveToast.messageEn ? liveToast.messageEn : liveToast.messageFr}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiveToast(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bouton Cloche dans la Navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center justify-center shadow-2xs"
        title={title}
        aria-label={title}
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-emerald-700 animate-wiggle' : 'text-slate-600'}`} />

        {/* Badge compteur non lus */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -end-1.5 min-w-[20px] h-5 px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Pastille SSE live */}
        <span
          className={`absolute bottom-1 end-1 w-2 h-2 rounded-full border border-white ${
            isLiveConnected ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
          title={isLiveConnected ? 'SSE Connecté en direct' : 'Recherche de flux...'}
        />
      </button>

      {/* Menu Déroulant (Dropdown) */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2.5 w-[360px] sm:w-[420px] max-w-[calc(100vw-24px)] bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-scale-up ${
            dir === 'rtl' ? 'left-0 sm:left-auto sm:right-0' : 'right-0'
          }`}
          dir={dir}
        >
          {/* En-tête du Dropdown */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Bell className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-black text-slate-900">{title}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{liveText}</span>
                </span>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>{markAllText}</span>
                </button>
              )}
            </div>

            {/* Onglets Filtres */}
            <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => setFilter('ALL')}
                className={`flex-1 py-1.5 rounded-xl transition ${
                  filter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dir === 'rtl' ? 'الكل' : 'Tous'} ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('UNREAD')}
                className={`flex-1 py-1.5 rounded-xl transition ${
                  filter === 'UNREAD'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dir === 'rtl' ? 'غير مقروءة' : 'Non lus'} ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('ORDERS')}
                className={`flex-1 py-1.5 rounded-xl transition ${
                  filter === 'ORDERS'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dir === 'rtl' ? 'الطلبات' : 'Commandes'}
              </button>
              <button
                onClick={() => setFilter('HEALTH')}
                className={`flex-1 py-1.5 rounded-xl transition ${
                  filter === 'HEALTH'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dir === 'rtl' ? 'الصحة' : 'Santé'}
              </button>
            </div>
          </div>

          {/* Liste des Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">{emptyText}</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const notifTitle =
                  language === 'ar'
                    ? notif.titleAr
                    : language === 'en' && notif.titleEn
                    ? notif.titleEn
                    : notif.titleFr;
                const notifMessage =
                  language === 'ar'
                    ? notif.messageAr
                    : language === 'en' && notif.messageEn
                    ? notif.messageEn
                    : notif.messageFr;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 sm:p-4 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 relative ${
                      !notif.isRead ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    {/* Indicateur non lu */}
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    )}

                    {/* Icône par type */}
                    <div className="p-2 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h5 className="text-xs font-black text-slate-900 truncate">
                          {notifTitle}
                        </h5>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {notifMessage}
                      </p>

                      {notif.link && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <span>{dir === 'rtl' ? 'عرض التفاصيل' : 'Voir les détails'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pied du Dropdown */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 font-semibold">
              {dir === 'rtl'
                ? 'خدمة التنبيهات المباشرة مؤمنة بالكامل وفق القانون 18-07'
                : 'Service temps réel sécurisé (Loi 18-07 - ANPDP)'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
