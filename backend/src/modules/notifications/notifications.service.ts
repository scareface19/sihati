import { Injectable, OnModuleInit, MessageEvent } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NotificationEntity } from '../../entities/notification.entity';

export interface RealtimeEvent {
  type: string;
  data: any;
  targetRole?: string;
  targetUserId?: number;
  timestamp: string;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly eventBus$ = new Subject<RealtimeEvent>();

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifRepo: Repository<NotificationEntity>,
  ) {}

  async onModuleInit() {
    await this.seedInitialNotifications();
  }

  // --- SEED INITIAL NOTIFICATIONS ---
  private async seedInitialNotifications() {
    const count = await this.notifRepo.count();
    if (count === 0) {
      const initial = [
        // NOTIFICATIONS PHARMACIE
        {
          targetRole: 'PHARMACY',
          type: 'ORDER_CREATED',
          titleAr: 'طلب حجز دواء جديد (Click & Reserve 2h)',
          titleFr: 'Nouvelle commande Click & Reserve (2h)',
          titleEn: 'New Click & Reserve order (2h)',
          messageAr: 'المريض محمد أمين بن علي قام بحجز Doliprane 1000mg و Tareg 80mg للاستلام من الصيدلية.',
          messageFr: 'Le patient Mohamed Amine BENALI a réservé Doliprane 1000mg et Tareg 80mg sous 2h.',
          messageEn: 'Patient Mohamed Amine BENALI reserved Doliprane 1000mg and Tareg 80mg for pickup within 2h.',
          link: '/pharmacies',
          isRead: false,
          metadata: { orderReference: 'CMD-2026-0929-01', patientName: 'Mohamed Amine BENALI' },
        },
        {
          targetRole: 'PHARMACY',
          type: 'STOCK_ALERT',
          titleAr: 'تنبيه مخزون: كمية منخفضة للأنسولين',
          titleFr: 'Alerte stock : Insuline Lantus Solostar',
          titleEn: 'Stock alert: Lantus Solostar Insulin',
          messageAr: 'الكمية المتبقية من دواء LANTUS SOLOSTAR هي 5 وحدات فقط (أقل من الحد الأدنى 10).',
          messageFr: 'Stock critique pour LANTUS SOLOSTAR (5 unités restantes, seuil min : 10).',
          messageEn: 'Critical stock for LANTUS SOLOSTAR (5 units remaining, min threshold: 10).',
          link: '/pharmacies',
          isRead: false,
          metadata: { drugCode: 'MIP-2025-006', quantity: 5 },
        },
        {
          targetRole: 'PHARMACY',
          type: 'ORDER_STATUS_CHANGED',
          titleAr: 'صرف وصفة Chifa معتمدة',
          titleFr: 'Dispensation Ordonnance Chifa validée',
          titleEn: 'Chifa prescription dispensation validated',
          messageAr: 'تمت مصادقة وتصفية الوصفة رقم ORD-2024-SETIF-667788 بنجاح عبر بوابة CNAS.',
          messageFr: 'La prescription ORD-2024-SETIF-667788 a été validée via le télé-service CNAS.',
          messageEn: 'Prescription ORD-2024-SETIF-667788 validated via CNAS portal.',
          link: '/pharmacies',
          isRead: true,
          metadata: { prescriptionHash: 'ORD-2024-SETIF-667788' },
        },

        // NOTIFICATIONS PATIENT
        {
          targetRole: 'PATIENT',
          type: 'ORDER_STATUS_CHANGED',
          titleAr: 'طلبك جاهز للاستلام من صيدلية بلمعزة',
          titleFr: 'Commande prête pour retrait en pharmacie',
          titleEn: 'Order ready for pharmacy pickup',
          messageAr: 'تم تحضير طلبيتك رقم CMD-2026-0929-01 وهي جاهزة للاستلام الفوري من صيدلية الحراسة بلمعزة.',
          messageFr: 'Votre commande CMD-2026-0929-01 est préparée et prête au comptoir de la Pharmacie Belmaaza.',
          messageEn: 'Your order CMD-2026-0929-01 is ready for counter pickup at Belmaaza Pharmacy.',
          link: '/patients/1',
          isRead: false,
          metadata: { orderReference: 'CMD-2026-0929-01', pharmacyName: 'Pharmacie Belmaaza' },
        },
        {
          targetRole: 'PATIENT',
          type: 'APPOINTMENT',
          titleAr: 'تأكيد موعدك الطبي مع د. محمد علي',
          titleFr: 'Rendez-vous confirmé avec Dr. Mohamed ALI',
          titleEn: 'Appointment confirmed with Dr. Mohamed ALI',
          messageAr: 'تم تأكيد موعدك الطبي بتاريخ 15 أكتوبر 2026 الساعة 10:30 صباحاً بعيادة الأمل بسطيف.',
          messageFr: 'Votre consultation du 15 Octobre 2026 à 10h30 au Cabinet El Amal (Sétif) est confirmée.',
          messageEn: 'Your consultation on Oct 15, 2026 at 10:30 AM at El Amal Clinic (Sétif) is confirmed.',
          link: '/appointments',
          isRead: false,
          metadata: { doctorName: 'Dr. Mohamed ALI', date: '15/10/2026' },
        },
        {
          targetRole: 'PATIENT',
          type: 'PRESCRIPTION',
          titleAr: 'صدور نتائج التحاليل المخبرية الجديدة',
          titleFr: 'Nouveaux résultats de bilan biologique',
          titleEn: 'New laboratory test results available',
          messageAr: 'أودع مخبر البركة بسطيف نتائج فحص الدم الشامل والوظائف الكلوية في ملفك الطبي الموحد.',
          messageFr: 'Le Laboratoire El Baraka a déposé vos résultats de bilan rénal et NFS dans votre dossier.',
          messageEn: 'El Baraka Laboratory deposited your blood and renal lab results into your health record.',
          link: '/patients/1',
          isRead: true,
          metadata: { labName: 'Laboratoire El Baraka' },
        },

        // NOTIFICATIONS DOCTOR
        {
          targetRole: 'DOCTOR',
          type: 'APPOINTMENT',
          titleAr: 'حجز موعد طبي جديد بالعيادة',
          titleFr: 'Nouveau rendez-vous patient réservé',
          titleEn: 'New patient appointment booked',
          messageAr: 'المريض محمد أمين بن علي حجز موعد استشارة متابعة ضغط الدم يوم 15 أكتوبر 2026.',
          messageFr: 'Le patient Mohamed Amine BENALI a réservé une consultation de suivi HTA le 15/10/2026.',
          messageEn: 'Patient Mohamed Amine BENALI booked an HTA follow-up consultation on 15/10/2026.',
          link: '/appointments',
          isRead: false,
          metadata: { patientId: 1 },
        },
        {
          targetRole: 'DOCTOR',
          type: 'SYSTEM',
          titleAr: 'موافقة المريض على مشاركة الملف الطبي (OTP)',
          titleFr: 'Consentement d’accès dossier accordé (Loi 18-07)',
          titleEn: 'Medical record consent granted (Law 18-07)',
          messageAr: 'تم تأكيد موافقة المريض رقم 1 عبر رمز OTP المؤقت للاطلاع على السوابق والأشعة.',
          messageFr: 'Le patient #1 a validé l’accès complet à son dossier via son code OTP (durée 2h).',
          messageEn: 'Patient #1 validated full record access via temporary OTP code (2h session).',
          link: '/patients/1',
          isRead: true,
          metadata: { patientId: 1 },
        },

        // NOTIFICATIONS ADMIN
        {
          targetRole: 'ADMIN',
          type: 'SYSTEM',
          titleAr: 'تحديث سجل التدقيق والأمان المركزي (ANPDP)',
          titleFr: 'Journal d’Audit Centralisé mis à jour',
          titleEn: 'Central Audit Log updated',
          messageAr: 'تم تسجيل 14 عملية وصول مشفرة للملفات الطبية بامتثال كامل للقانون 18-07.',
          messageFr: '14 accès sécurisés aux dossiers patients enregistrés en conformité avec la Loi 18-07.',
          messageEn: '14 secured EHR access logs recorded in compliance with Law 18-07.',
          link: '/admin',
          isRead: false,
          metadata: { auditEventsCount: 14 },
        },
        {
          targetRole: 'ADMIN',
          type: 'ORDER_CREATED',
          titleAr: 'اعتماد صيدلية جديدة في شبكة رادار سطيف',
          titleFr: 'Nouvelle officine raccordée au réseau Sétif',
          titleEn: 'New pharmacy joined Sétif radar network',
          messageAr: 'تم تفعيل الاتصال مع صيدلية عين ولمان (د. فاروق زيتوني) بنظام Chifa CNAS.',
          messageFr: 'Pharmacie Ain Oulmene connectée avec succès au réseau de garde Chifa.',
          messageEn: 'Ain Oulmene Pharmacy successfully connected to Chifa duty network.',
          link: '/admin',
          isRead: true,
          metadata: { pharmacyId: 7 },
        },
      ];

      for (const item of initial) {
        await this.notifRepo.save(this.notifRepo.create(item));
      }
    }
  }

  // --- EMIT REAL-TIME EVENT ---
  emitRealtimeEvent(event: RealtimeEvent) {
    this.eventBus$.next(event);
  }

  // --- CREATE NOTIFICATION & BROADCAST ---
  async createNotification(dto: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const notif = this.notifRepo.create({
      ...dto,
      isRead: false,
    });
    const saved = await this.notifRepo.save(notif);

    // Émettre en temps réel sur le bus SSE
    this.emitRealtimeEvent({
      type: 'NOTIFICATION_RECEIVED',
      data: saved,
      targetRole: saved.targetRole,
      targetUserId: saved.userId,
      timestamp: new Date().toISOString(),
    });

    return saved;
  }

  // --- QUERY NOTIFICATIONS ---
  async getNotifications(role?: string, userId?: number, unreadOnly?: boolean) {
    const query = this.notifRepo.createQueryBuilder('n');

    if (role && role !== 'ALL') {
      query.andWhere('(n.targetRole = :role OR n.targetRole = :allRole)', {
        role,
        allRole: 'ALL',
      });
    }

    if (userId) {
      query.andWhere('(n.userId = :userId OR n.userId IS NULL)', { userId });
    }

    if (unreadOnly) {
      query.andWhere('n.isRead = :isRead', { isRead: false });
    }

    query.orderBy('n.createdAt', 'DESC').take(40);
    return query.getMany();
  }

  // --- GET UNREAD COUNT ---
  async getUnreadCount(role?: string, userId?: number): Promise<{ count: number }> {
    const query = this.notifRepo.createQueryBuilder('n').where('n.isRead = :isRead', { isRead: false });

    if (role && role !== 'ALL') {
      query.andWhere('(n.targetRole = :role OR n.targetRole = :allRole)', {
        role,
        allRole: 'ALL',
      });
    }

    if (userId) {
      query.andWhere('(n.userId = :userId OR n.userId IS NULL)', { userId });
    }

    const count = await query.getCount();
    return { count };
  }

  // --- MARK AS READ ---
  async markAsRead(id: number) {
    await this.notifRepo.update(id, { isRead: true });
    return { success: true };
  }

  // --- MARK ALL AS READ ---
  async markAllAsRead(role?: string, userId?: number) {
    const query = this.notifRepo.createQueryBuilder('n').update(NotificationEntity).set({ isRead: true });

    if (role && role !== 'ALL') {
      query.andWhere('(targetRole = :role OR targetRole = :allRole)', {
        role,
        allRole: 'ALL',
      });
    }

    if (userId) {
      query.andWhere('(userId = :userId OR userId IS NULL)', { userId });
    }

    await query.execute();
    return { success: true };
  }

  // --- GET SSE STREAM FOR CLIENTS ---
  getNotificationStream(role?: string, userId?: number): Observable<MessageEvent> {
    return this.eventBus$.asObservable().pipe(
      filter((event) => {
        // Filtrer par rôle et userId si spécifiés
        if (event.targetRole && event.targetRole !== 'ALL' && role && role !== 'ALL') {
          if (event.targetRole !== role) return false;
        }
        if (event.targetUserId && userId) {
          if (event.targetUserId !== userId) return false;
        }
        return true;
      }),
      map((event) => ({
        data: JSON.stringify(event),
        id: Date.now().toString(),
        type: event.type,
      } as MessageEvent)),
    );
  }
}
