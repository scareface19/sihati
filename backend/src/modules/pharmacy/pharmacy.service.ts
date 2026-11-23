import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { PharmacyProfile, PharmacyStock, PharmacyOrder } from '../../entities/pharmacy.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PharmacyService implements OnModuleInit {
  constructor(
    @InjectRepository(PharmacyProfile)
    private readonly profileRepo: Repository<PharmacyProfile>,
    @InjectRepository(PharmacyStock)
    private readonly stockRepo: Repository<PharmacyStock>,
    @InjectRepository(PharmacyOrder)
    private readonly orderRepo: Repository<PharmacyOrder>,
    private readonly notifService: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.seedInitialPharmacyData();
  }

  // --- SEED INITIAL PHARMACY DATA ---
  private async seedInitialPharmacyData() {
    const profileCount = await this.profileRepo.count();
    if (profileCount === 0) {
      await this.profileRepo.save({
        userId: 7,
        name: 'صيدلية بلمعزة (Pharmacie Belmaaza)',
        pharmacistName: 'Dr. Youcef Belmaaza (د. يوسف بلمعزة)',
        licenseNumber: 'ORD-PHARM-SETIF-2018-0442',
        commune: 'سطيف المركز (Sétif Centre)',
        address: 'شارع 8 ماي 1945، بالقرب من ساحة عين الفوارة، سطيف',
        phone: '036 84 12 55',
        email: 'pharmacie@sihati.dz',
        openingHours: '08:00 - 19:30 (24h/24h en garde)',
        isNightGuard: true,
        chifaConventionNumber: 'CNAS-SETIF-CH-884210',
        chifaEnabled: true,
      });
    }

    const stockCount = await this.stockRepo.count();
    if (stockCount === 0) {
      const defaultStocks = [
        { code: 'MIP-2025-001', brandName: 'DOLIPRANE 1000 MG', dci: 'PARACETAMOL', form: 'COMPRIME', dosage: '1000 MG', quantity: 64, minThreshold: 15, unitPrice: 195.0, isReimbursable: true, status: 'IN_STOCK' as const },
        { code: 'MIP-2025-002', brandName: 'CLAMOXYL 1 G', dci: 'AMOXICILLINE', form: 'COMPRIME DISPERSIBLE', dosage: '1000 MG', quantity: 38, minThreshold: 10, unitPrice: 580.0, isReimbursable: true, status: 'IN_STOCK' as const },
        { code: 'MIP-2025-003', brandName: 'AUGMENTIN 1 G / 125 MG', dci: 'AMOXICILLINE + ACIDE CLAVULANIQUE', form: 'POUDRE SACHET', dosage: '1 G / 125 MG', quantity: 8, minThreshold: 12, unitPrice: 890.0, isReimbursable: true, status: 'LOW_STOCK' as const },
        { code: 'MIP-2025-004', brandName: 'TAREG 80 MG', dci: 'VALSARTAN', form: 'COMPRIME PELLICULE', dosage: '80 MG', quantity: 22, minThreshold: 10, unitPrice: 650.0, isReimbursable: true, status: 'IN_STOCK' as const },
        { code: 'MIP-2025-005', brandName: 'GLUCOPHAGE 850 MG', dci: 'METFORMINE CHLORHYDRATE', form: 'COMPRIME', dosage: '850 MG', quantity: 45, minThreshold: 15, unitPrice: 320.0, isReimbursable: true, status: 'IN_STOCK' as const },
        { code: 'MIP-2025-006', brandName: 'LANTUS SOLOSTAR 100 U/ML', dci: 'INSULINE GLARGINE', form: 'STYLO PRE-REMPLI', dosage: '100 UI/ML', quantity: 5, minThreshold: 10, unitPrice: 4200.0, isReimbursable: true, status: 'LOW_STOCK' as const },
        { code: 'MIP-2025-007', brandName: 'VENTOLINE 100 MCG', dci: 'SALBUTAMOL', form: 'AEROSOL DOSEUR', dosage: '100 MCG/DOSE', quantity: 0, minThreshold: 8, unitPrice: 280.0, isReimbursable: true, status: 'OUT_OF_STOCK' as const },
        { code: 'MIP-2025-008', brandName: 'MOPRAL 20 MG', dci: 'OMEPRAZOLE', form: 'GELULE GASTRO-RESISTANTE', dosage: '20 MG', quantity: 29, minThreshold: 10, unitPrice: 450.0, isReimbursable: true, status: 'IN_STOCK' as const },
        { code: 'MIP-2025-009', brandName: 'KARDICIC 75 MG', dci: 'ACIDE ACETYLSALICYLIQUE', form: 'POUDRE SACHET', dosage: '75 MG', quantity: 52, minThreshold: 15, unitPrice: 160.0, isReimbursable: true, status: 'IN_STOCK' as const },
        { code: 'MIP-2025-010', brandName: 'ZITHROMAX 500 MG', dci: 'AZITHROMYCINE', form: 'COMPRIME PELLICULE', dosage: '500 MG', quantity: 4, minThreshold: 10, unitPrice: 720.0, isReimbursable: true, status: 'LOW_STOCK' as const },
        { code: 'MIP-2025-011', brandName: 'VOLTARENE 50 MG', dci: 'DICLOFENAC SODIQUE', form: 'COMPRIME GASTRO-RESISTANT', dosage: '50 MG', quantity: 31, minThreshold: 10, unitPrice: 240.0, isReimbursable: true, status: 'IN_STOCK' as const },
        { code: 'MIP-2025-012', brandName: 'INEXIUM 40 MG', dci: 'ESOMEPRAZOLE', form: 'COMPRIME GASTRO-RESISTANT', dosage: '40 MG', quantity: 18, minThreshold: 10, unitPrice: 690.0, isReimbursable: true, status: 'IN_STOCK' as const },
      ];
      await this.stockRepo.save(defaultStocks);
    }

    const orderCount = await this.orderRepo.count();
    if (orderCount === 0) {
      const defaultOrders = [
        {
          orderReference: 'CMD-2026-0929-01',
          patientName: 'محمد أمين بن علي (Mohamed Amine Benali)',
          patientChifaNumber: '1988-1901-7845-12',
          patientPhone: '0661234567',
          doctorName: 'Dr. Mohamed ALI (طبيب عام)',
          prescriptionHash: 'ORD-2024-SETIF-984712',
          itemsCount: 3,
          itemsSummary: 'Doliprane 1000mg (B/8), Tareg 80mg (B/28), Kardégic 75mg (B/30)',
          chifaCoverageRate: 80,
          totalAmount: 1005.0,
          patientCopay: 201.0,
          status: 'PENDING' as const,
        },
        {
          orderReference: 'CMD-2026-0929-02',
          patientName: 'فاطمة الزهراء منصوري (Fatima Zohra Mansouri)',
          patientChifaNumber: '1975-1902-3321-44',
          patientPhone: '0550445566',
          doctorName: 'Dr. Belkadi (أمراض القلب)',
          prescriptionHash: 'ORD-2024-SETIF-441290',
          itemsCount: 2,
          itemsSummary: 'Glucophage 850mg (B/30), Lantus Solostar 100UI (B/5)',
          chifaCoverageRate: 100,
          totalAmount: 4520.0,
          patientCopay: 0.0,
          status: 'PREPARING' as const,
        },
        {
          orderReference: 'CMD-2026-0929-03',
          patientName: 'كريم بوجمعة (Karim Boudjemaa)',
          patientChifaNumber: '1992-1901-8899-77',
          patientPhone: '0770998811',
          doctorName: 'Dr. Souad Ammari (طب الأطفال)',
          prescriptionHash: 'ORD-2024-SETIF-667788',
          itemsCount: 2,
          itemsSummary: 'Clamoxyl 1g (B/14), Mopral 20mg (B/14)',
          chifaCoverageRate: 80,
          totalAmount: 1030.0,
          patientCopay: 206.0,
          status: 'READY' as const,
        },
        {
          orderReference: 'CMD-2026-0928-04',
          patientName: 'عمر دحماني (Omar Dahmani)',
          patientChifaNumber: '1963-1901-5511-22',
          patientPhone: '0662334455',
          doctorName: 'Dr. Karim Benabdelkader (أمراض الصدر)',
          prescriptionHash: 'ORD-2024-SETIF-223344',
          itemsCount: 1,
          itemsSummary: 'Inexium 40mg (B/28)',
          chifaCoverageRate: 80,
          totalAmount: 690.0,
          patientCopay: 138.0,
          status: 'DISPENSED' as const,
        },
      ];
      await this.orderRepo.save(defaultOrders);
    }
  }

  // --- PROFILE ---
  async getProfile(): Promise<PharmacyProfile> {
    const profile = await this.profileRepo.findOne({ where: {} });
    if (!profile) {
      return this.profileRepo.save({
        name: 'صيدلية بلمعزة (Pharmacie Belmaaza)',
        pharmacistName: 'Dr. Youcef Belmaaza',
        commune: 'سطيف المركز (Sétif Centre)',
        address: 'شارع 8 ماي 1945، سطيف',
        phone: '036 84 12 55',
        email: 'pharmacie@sihati.dz',
      });
    }
    return profile;
  }

  async updateProfile(dto: Partial<PharmacyProfile>): Promise<PharmacyProfile> {
    const profile = await this.getProfile();
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  // --- STOCKS ---
  async getStocks(search?: string, statusFilter?: string): Promise<PharmacyStock[]> {
    const qb = this.stockRepo.createQueryBuilder('stock');

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      qb.andWhere(
        '(stock.brandName LIKE :term OR stock.dci LIKE :term OR stock.code LIKE :term)',
        { term },
      );
    }

    if (statusFilter && statusFilter !== 'ALL') {
      qb.andWhere('stock.status = :status', { status: statusFilter });
    }

    qb.orderBy('stock.quantity', 'ASC');
    return qb.getMany();
  }

  async addStockItem(dto: Partial<PharmacyStock>): Promise<PharmacyStock> {
    const qty = Number(dto.quantity) || 0;
    const minThreshold = Number(dto.minThreshold) || 10;

    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK';
    if (qty <= 0) status = 'OUT_OF_STOCK';
    else if (qty <= minThreshold) status = 'LOW_STOCK';

    const stock = this.stockRepo.create({
      ...dto,
      quantity: qty,
      minThreshold,
      status,
      lastReplenishedAt: new Date(),
    });
    return this.stockRepo.save(stock);
  }

  async updateStockItem(id: number, dto: Partial<PharmacyStock>): Promise<PharmacyStock> {
    const stock = await this.stockRepo.findOne({ where: { id } });
    if (!stock) throw new NotFoundException('Médicament en stock non trouvé');

    Object.assign(stock, dto);

    const qty = Number(stock.quantity) || 0;
    const minThreshold = Number(stock.minThreshold) || 10;
    if (qty <= 0) stock.status = 'OUT_OF_STOCK';
    else if (qty <= minThreshold) stock.status = 'LOW_STOCK';
    else stock.status = 'IN_STOCK';

    return this.stockRepo.save(stock);
  }

  async adjustStockQuantity(id: number, delta: number): Promise<PharmacyStock> {
    const stock = await this.stockRepo.findOne({ where: { id } });
    if (!stock) throw new NotFoundException('Médicament en stock non trouvé');

    const newQty = Math.max(0, (Number(stock.quantity) || 0) + delta);
    stock.quantity = newQty;

    const minThreshold = Number(stock.minThreshold) || 10;
    if (newQty <= 0) stock.status = 'OUT_OF_STOCK';
    else if (newQty <= minThreshold) stock.status = 'LOW_STOCK';
    else stock.status = 'IN_STOCK';

    if (delta > 0) stock.lastReplenishedAt = new Date();

    return this.stockRepo.save(stock);
  }

  async deleteStockItem(id: number): Promise<{ success: boolean }> {
    const stock = await this.stockRepo.findOne({ where: { id } });
    if (!stock) throw new NotFoundException('Médicament non trouvé');
    await this.stockRepo.remove(stock);
    return { success: true };
  }

  // --- ORDERS ---
  async getOrders(search?: string, statusFilter?: string): Promise<PharmacyOrder[]> {
    const qb = this.orderRepo.createQueryBuilder('order');

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      qb.andWhere(
        '(order.orderReference LIKE :term OR order.patientName LIKE :term OR order.patientChifaNumber LIKE :term OR order.doctorName LIKE :term OR order.prescriptionHash LIKE :term)',
        { term },
      );
    }

    if (statusFilter && statusFilter !== 'ALL') {
      qb.andWhere('order.status = :status', { status: statusFilter });
    }
    qb.orderBy('order.createdAt', 'DESC');
    return qb.getMany();
  }

  async getOrderById(id: number): Promise<PharmacyOrder> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }

  async createOrder(dto: Partial<PharmacyOrder>): Promise<PharmacyOrder> {
    const ref = dto.orderReference || `CMD-2026-${Date.now().toString().slice(-6)}`;
    const order = this.orderRepo.create({
      ...dto,
      orderReference: ref,
      status: dto.status || 'PENDING',
    });
    const savedOrder = await this.orderRepo.save(order);

    // 1. Notification temps réel pour la Pharmacie
    try {
      await this.notifService.createNotification({
        targetRole: 'PHARMACY',
        type: 'ORDER_CREATED',
        titleAr: 'طلب حجز دواء جديد (Click & Reserve 2h)',
        titleFr: 'Nouvelle commande Click & Reserve (2h)',
        titleEn: 'New Click & Reserve order (2h)',
        messageAr: `طلب حجز جديد برقم ${savedOrder.orderReference} للمريض ${savedOrder.patientName || 'مواطن'} (${savedOrder.itemsSummary || 'دواء'}).`,
        messageFr: `Nouvelle réservation ${savedOrder.orderReference} de ${savedOrder.patientName || 'Patient'} (${savedOrder.itemsSummary || 'Médicaments'}).`,
        messageEn: `New order ${savedOrder.orderReference} from ${savedOrder.patientName || 'Patient'} (${savedOrder.itemsSummary || 'Meds'}).`,
        link: '/pharmacies',
        metadata: { orderId: savedOrder.id, orderReference: savedOrder.orderReference },
      });

      // 2. Notification temps réel pour le Patient
      await this.notifService.createNotification({
        targetRole: 'PATIENT',
        type: 'ORDER_CREATED',
        titleAr: 'تم تسجيل طلب حجز الدواء بنجاح',
        titleFr: 'Réservation de médicaments enregistrée',
        titleEn: 'Medication reservation recorded',
        messageAr: `طلبك برقم ${savedOrder.orderReference} قيد المراجعة في صيدلية الحراسة للاستلام في غضون ساعتين.`,
        messageFr: `Votre réservation ${savedOrder.orderReference} est en cours de traitement par l'officine de garde.`,
        messageEn: `Your reservation ${savedOrder.orderReference} is being processed for 2h pickup.`,
        link: '/patients/1',
        metadata: { orderId: savedOrder.id, orderReference: savedOrder.orderReference },
      });

      // 3. Émission d'événement direct sur le bus SSE
      this.notifService.emitRealtimeEvent({
        type: 'ORDER_CREATED',
        data: savedOrder,
        targetRole: 'ALL',
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      // Ignorer erreur de notification pour ne pas bloquer la commande
    }

    return savedOrder;
  }

  async updateOrderStatus(
    id: number,
    status: 'PENDING' | 'PREPARING' | 'READY' | 'DISPENSED',
  ): Promise<PharmacyOrder> {
    const order = await this.getOrderById(id);
    order.status = status;
    const updatedOrder = await this.orderRepo.save(order);

    try {
      let statusTitleAr = 'تحديث حالة طلب الدواء';
      let statusTitleFr = 'Statut de votre commande actualisé';
      let statusMsgAr = `أصبحت حالة طلبيتك ${order.orderReference}: ${status}`;
      let statusMsgFr = `Votre commande ${order.orderReference} est désormais : ${status}`;

      if (status === 'PREPARING') {
        statusTitleAr = 'طلبك قيد التحضير في الصيدلية';
        statusTitleFr = 'Commande en cours de préparation';
        statusMsgAr = `يقوم الصيدلي بتحضير طلبيتك ${order.orderReference} وتجهيز العلب الطبية.`;
        statusMsgFr = `Votre commande ${order.orderReference} est en cours de préparation au comptoir.`;
      } else if (status === 'READY') {
        statusTitleAr = 'طلبك جاهز للاستلام الفوري من الصيدلية (2h) !';
        statusTitleFr = 'Commande prête pour retrait au comptoir !';
        statusMsgAr = `طلبك ${order.orderReference} جاهز الآن للاستلام من صيدلية الحراسة. احتفظ برقم الطلب.`;
        statusMsgFr = `Votre commande ${order.orderReference} est prête pour retrait sous 2h en pharmacie.`;
      } else if (status === 'DISPENSED') {
        statusTitleAr = 'تم استلام وصرف طلبيتك بنجاح';
        statusTitleFr = 'Médicaments délivrés et validés';
        statusMsgAr = `تم تأكيد صرف الأدوية للطلب ${order.orderReference} عبر نظام Chifa. دمتم بصحة وعافية.`;
        statusMsgFr = `Dispensation validée via Chifa pour la commande ${order.orderReference}.`;
      }

      await this.notifService.createNotification({
        targetRole: 'PATIENT',
        type: 'ORDER_STATUS_CHANGED',
        titleAr: statusTitleAr,
        titleFr: statusTitleFr,
        titleEn: `Order ${order.orderReference} updated to ${status}`,
        messageAr: statusMsgAr,
        messageFr: statusMsgFr,
        messageEn: `Your order ${order.orderReference} status is now: ${status}`,
        link: '/patients/1',
        metadata: { orderId: order.id, status },
      });

      // Émettre l'événement direct sur le bus SSE
      this.notifService.emitRealtimeEvent({
        type: 'ORDER_STATUS_CHANGED',
        data: updatedOrder,
        targetRole: 'ALL',
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      // Ignorer erreur notification
    }

    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<{ success: boolean }> {
    const order = await this.getOrderById(id);
    await this.orderRepo.remove(order);
    return { success: true };
  }

  // --- STATS ---
  async getStats() {
    const profile = await this.getProfile();
    const totalStockItems = await this.stockRepo.count();
    const lowStockCount = await this.stockRepo.count({ where: { status: 'LOW_STOCK' } });
    const outOfStockCount = await this.stockRepo.count({ where: { status: 'OUT_OF_STOCK' } });
    const pendingOrdersCount = await this.orderRepo.count({ where: { status: 'PENDING' } });
    const preparingOrdersCount = await this.orderRepo.count({ where: { status: 'PREPARING' } });
    const readyOrdersCount = await this.orderRepo.count({ where: { status: 'READY' } });
    const dispensedTodayCount = await this.orderRepo.count({ where: { status: 'DISPENSED' } });

    return {
      pharmacyName: profile.name,
      pharmacistName: profile.pharmacistName,
      isNightGuard: profile.isNightGuard,
      chifaEnabled: profile.chifaEnabled,
      totalStockItems,
      lowStockCount,
      outOfStockCount,
      pendingOrdersCount,
      preparingOrdersCount,
      readyOrdersCount,
      dispensedTodayCount,
    };
  }
}
