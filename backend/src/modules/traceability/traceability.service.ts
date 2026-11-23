import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DrugTraceability } from '../../entities/drug-traceability.entity';
import { NotificationsService } from '../notifications/notifications.service';

export interface ControlledDrugDispensation {
  id: string;
  patientName: string;
  patientChifa: string;
  patientNin: string;
  patientPhone: string;
  patientAge: number;
  patientWilaya: string;
  drugName: string;
  dci: string;
  category: 'PSYCHOTROPE' | 'STUPEFIANT' | 'COLD_CHAIN';
  batchNumber: string;
  serialNumber: string;
  quantityDispensed: number;
  prescribingDoctor: string;
  doctorSpecialty: string;
  doctorRegistrationNumber: string;
  prescriptionHash: string;
  prescriptionDate: string;
  dispensingPharmacy: string;
  pharmacistName: string;
  dispensationDate: string;
  anomalyAlert: boolean;
  anomalyReason?: string;
  status: 'VERIFIED' | 'SUSPECT' | 'UNDER_INVESTIGATION';
}

@Injectable()
export class TraceabilityService implements OnModuleInit {
  constructor(
    @InjectRepository(DrugTraceability)
    private readonly traceRepo: Repository<DrugTraceability>,
    private readonly notifService: NotificationsService,
  ) {}

  async onModuleInit() {
    await this.seedInitialTraceabilityData();
  }

  // --- SEED INITIAL TRACEABILITY DATA ---
  private async seedInitialTraceabilityData() {
    const count = await this.traceRepo.count();
    if (count === 0) {
      const items: Partial<DrugTraceability>[] = [
        {
          cipCode: 'MIP-2025-001',
          brandName: 'DOLIPRANE 1000 MG',
          dci: 'PARACETAMOL',
          dosage: '1000 MG',
          form: 'COMPRIME',
          batchNumber: 'LOT-2026-DZ-8492',
          serialNumber: 'SN-ALG-2026-94821048',
          manufacturer: 'SAIDAL (Usine Constantine)',
          manufacturingCountry: 'Algérie (إنتاج وطني)',
          manufacturingDate: new Date('2026-01-15'),
          expiryDate: new Date('2029-01-15'),
          coldChainRequired: false,
          temperatureMin: 15.0,
          temperatureMax: 25.0,
          currentTemperature: 20.4,
          currentStage: 'PHARMACY',
          currentLocation: 'صيدلية بلمعزة - سطيف المركز',
          status: 'CONFORME',
          verificationHash: 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
          timeline: [
            {
              step: 'Fabrication & Contrôle Qualité',
              location: 'Usine SAIDAL Constantine - Ligne de compression N°3',
              date: '15/01/2026',
              actor: 'Laboratoire de Contrôle Qualité SAIDAL',
              status: 'CONFORME',
              temperatureObserved: 21.0,
            },
            {
              step: 'Expédition Grossiste Répartiteur',
              location: 'Plateforme Logistique Maghreb Pharma Sétif',
              date: '02/02/2026',
              actor: 'Transporteur Certifié PharmaLog DZ',
              status: 'CONFORME',
              temperatureObserved: 19.5,
            },
            {
              step: 'Réception en Officine Agréée',
              location: 'Pharmacie Belmaaza - Sétif Centre',
              date: '18/02/2026',
              actor: 'Dr. Youcef Belmaaza (Pharmacien)',
              status: 'CONFORME',
              temperatureObserved: 20.4,
            },
          ],
        },
        {
          cipCode: 'MIP-2025-006',
          brandName: 'LANTUS SOLOSTAR 100 U/ML',
          dci: 'INSULINE GLARGINE',
          dosage: '100 UI/ML',
          form: 'STYLO PRE-REMPLI',
          batchNumber: 'LOT-2026-COLD-1142',
          serialNumber: 'SN-ALG-2026-55829104',
          manufacturer: 'Biopharm Algérie (Partenariat Sanofi)',
          manufacturingCountry: 'Algérie (إنتاج وطني)',
          manufacturingDate: new Date('2026-02-10'),
          expiryDate: new Date('2028-02-10'),
          coldChainRequired: true,
          temperatureMin: 2.0,
          temperatureMax: 8.0,
          currentTemperature: 4.8,
          currentStage: 'PHARMACY',
          currentLocation: 'صيدلية بلمعزة - ثلاجة الأدوية الذكية (+4.8°C)',
          status: 'CONFORME',
          verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          timeline: [
            {
              step: 'Fabrication & Conditionnement Stérile',
              location: 'Unité Biotechnologique Biopharm Oued Smar (Alger)',
              date: '10/02/2026',
              actor: 'Biopharm QA Unit',
              status: 'CONFORME',
              temperatureObserved: 4.0,
            },
            {
              step: 'Transport Sous Chaîne du Froid Monitorée',
              location: 'Camion frigorifique GPS / Capteur IoT IoT-COLD-44',
              date: '25/02/2026',
              actor: 'TransCold Algérie',
              status: 'CONFORME',
              temperatureObserved: 4.5,
            },
            {
              step: 'Stockage Frigorifique d’Officine',
              location: 'Pharmacie Belmaaza (Sétif) - Frigo N°1 (Alarme IoT)',
              date: '28/02/2026',
              actor: 'Dr. Youcef Belmaaza',
              status: 'CONFORME',
              temperatureObserved: 4.8,
            },
          ],
        },
        {
          cipCode: 'MIP-2025-003',
          brandName: 'AUGMENTIN 1 G / 125 MG',
          dci: 'AMOXICILLINE + ACIDE CLAVULANIQUE',
          dosage: '1 G / 125 MG',
          form: 'POUDRE SACHET',
          batchNumber: 'LOT-2025-RECALL-991',
          serialNumber: 'SN-ALG-2025-00192841',
          manufacturer: 'Laboratoires GSK Algérie',
          manufacturingCountry: 'Algérie (إنتاج محلي)',
          manufacturingDate: new Date('2025-11-01'),
          expiryDate: new Date('2027-11-01'),
          coldChainRequired: false,
          temperatureMin: 15.0,
          temperatureMax: 25.0,
          currentTemperature: 22.0,
          currentStage: 'PHARMACY',
          currentLocation: 'Zone de Quarantaine / Retrait Sanitaire - Sétif',
          status: 'RECALLED',
          recallReason: 'Avis du Ministère de la Santé N° 44/2026 : Présence d’un défaut d’étanchéité sur certains sachets du lot. Rappel préventif immédiat de niveau 2.',
          verificationHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          timeline: [
            {
              step: 'Production Initiale',
              location: 'GSK Algérie',
              date: '01/11/2025',
              actor: 'Contrôle Lot N°991',
              status: 'CONFORME',
            },
            {
              step: 'Distribution Officines',
              location: 'Réseau Sétif et Bordj Bou Arreridj',
              date: '15/12/2025',
              actor: 'Pharmacies de garde',
              status: 'DISTRIBUE',
            },
            {
              step: 'ALERTE SANITAIRE - RAPPEL MINISTÉRIEL',
              location: 'Direction Générale de la Pharmacie (Ministère de la Santé)',
              date: '20/09/2026',
              actor: 'Commission Nationale de Pharmacovigilance',
              status: 'RAPPEL_ACTIF',
            },
          ],
        },
        {
          cipCode: 'MIP-2025-055',
          brandName: 'LYRICA 150 MG',
          dci: 'PREGABALINE (مؤثر عقلي مراقب - قانون 04-18)',
          dosage: '150 MG',
          form: 'GELULE',
          batchNumber: 'LOT-2026-PSY-9011',
          serialNumber: 'SN-ALG-2026-PSY-88912',
          manufacturer: 'SAIDAL (Usine Constantine) sous licence',
          manufacturingCountry: 'Algérie (إنتاج وطني مراقب)',
          manufacturingDate: new Date('2026-02-01'),
          expiryDate: new Date('2029-02-01'),
          coldChainRequired: false,
          temperatureMin: 15.0,
          temperatureMax: 25.0,
          currentTemperature: 21.2,
          currentStage: 'PHARMACY',
          currentLocation: 'خزانة المواد المقننة والمؤثرات العقلية - صيدلية بلمعزة (سطيف)',
          status: 'CONFORME',
          verificationHash: 'a8f5b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
          timeline: [
            {
              step: 'تصنيع ومراقبة تحليلية للمادة الأولية (Loi 04-18)',
              location: 'مجمع صيدال - وحدة الإنتاج قسنطينة',
              date: '01/02/2026',
              actor: 'مخبر مراقبة الجودة والسلائف الكيميائية',
              status: 'CONFORME',
              temperatureObserved: 21.0,
            },
            {
              step: 'إشعار الحصة للمفتشية الصيدلانية (MIP Alger)',
              location: 'وزارة الإنتاج الصيدلاني (MIP)',
              date: '10/02/2026',
              actor: 'اللجنة الوطنية لمراقبة المؤثرات العقلية',
              status: 'CONFORME',
              temperatureObserved: 20.5,
            },
            {
              step: 'استلام بالصيدلية وقيد بالسجل الخاص للمؤثرات العقلية',
              location: 'صيدلية بلمعزة - سطيف المركز (خزانة مقفلة)',
              date: '25/02/2026',
              actor: 'د. يوسف بلمعزة (صيدلي معتمد)',
              status: 'CONFORME',
              temperatureObserved: 21.2,
            },
            {
              step: 'صرف بوصفة طبية مؤمنة ثلاثية النسخ وبطاقة الشفاء',
              location: 'شباك الصرف - المريض محمد أمين بن علي',
              date: '20/03/2026',
              actor: 'تسجيل رسمي برقم بطاقة الشفاء وبطاقة التعريف',
              status: 'DISPENSED',
              temperatureObserved: 20.8,
            },
          ],
        },
        {
          cipCode: 'MIP-2025-089',
          brandName: 'TRAMADOL SAIDAL 50 MG',
          dci: 'TRAMADOL CHLORHYDRATE (مسكن أفيوني مركزي - جدول ب)',
          dosage: '50 MG',
          form: 'COMPRIME',
          batchNumber: 'LOT-2026-STUP-4401',
          serialNumber: 'SN-ALG-2026-STUP-11029',
          manufacturer: 'SAIDAL Médéa',
          manufacturingCountry: 'Algérie (إنتاج وطني)',
          manufacturingDate: new Date('2026-03-01'),
          expiryDate: new Date('2029-03-01'),
          coldChainRequired: false,
          temperatureMin: 15.0,
          temperatureMax: 25.0,
          currentTemperature: 20.1,
          currentStage: 'PHARMACY',
          currentLocation: 'صيدلية بلمعزة - سجل المواد السمية والمؤثرات العقلية',
          status: 'CONFORME',
          verificationHash: 'c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
          timeline: [
            {
              step: 'تصنيع صيدلاني مقنن (جدول ب - مسكن أفيوني مركزي)',
              location: 'وحدة صيدال المدية (SAIDAL)',
              date: '01/03/2026',
              actor: 'قسم مراقبة الأدوية المقننة',
              status: 'CONFORME',
              temperatureObserved: 20.0,
            },
            {
              step: 'تتبع تسلسلي ومطابقة الباركود الموحد Datamatrix',
              location: 'المركز اللوجستي المغاربي للأدوية سطيف',
              date: '12/03/2026',
              actor: 'مؤسسة التوزيع الصيدلاني المعتمدة',
              status: 'CONFORME',
              temperatureObserved: 20.2,
            },
            {
              step: 'حفظ آمن في خزانة المواد المقيدة بالصيدلية',
              location: 'صيدلية بلمعزة (سطيف)',
              date: '15/03/2026',
              actor: 'د. يوسف بلمعزة',
              status: 'CONFORME',
              temperatureObserved: 20.1,
            },
          ],
        },
        {
          cipCode: 'MIP-2025-004',
          brandName: 'TAREG 80 MG',
          dci: 'VALSARTAN',
          dosage: '80 MG',
          form: 'COMPRIME PELLICULE',
          batchNumber: 'LOT-2026-VAL-4819',
          serialNumber: 'SN-ALG-2026-78451299',
          manufacturer: 'Merinal Laboratoires (Alger)',
          manufacturingCountry: 'Algérie (إنتاج وطني)',
          manufacturingDate: new Date('2026-03-01'),
          expiryDate: new Date('2029-03-01'),
          coldChainRequired: false,
          temperatureMin: 15.0,
          temperatureMax: 25.0,
          currentTemperature: 21.0,
          currentStage: 'DISPENSED',
          currentLocation: 'Délivré au patient Mohamed Amine BENALI (Sétif)',
          status: 'CONFORME',
          verificationHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
          timeline: [
            {
              step: 'Fabrication & Libération',
              location: 'Merinal Usine Zéralda',
              date: '01/03/2026',
              actor: 'Merinal QA',
              status: 'CONFORME',
            },
            {
              step: 'Réception Officine Belmaaza',
              location: 'Sétif Centre',
              date: '20/03/2026',
              actor: 'Dr. Belmaaza',
              status: 'CONFORME',
            },
            {
              step: 'Dispensation Ordonnance Chifa',
              location: 'Au comptoir - Patient Mohamed Amine BENALI',
              date: '29/09/2026',
              actor: 'Délivrance Chifa 80%',
              status: 'DISPENSED',
            },
          ],
        },
      ];

      for (const item of items) {
        await this.traceRepo.save(this.traceRepo.create(item));
      }
    }
  }

  // --- RECHERCHE ET VÉRIFICATION D'AUTHENTICITÉ ---
  async verify(query: string): Promise<DrugTraceability> {
    const q = query.trim();
    const item = await this.traceRepo.findOne({
      where: [
        { batchNumber: q },
        { serialNumber: q },
        { cipCode: q },
        { brandName: Like(`%${q}%`) },
      ],
    });

    if (!item) {
      throw new NotFoundException(`Aucun produit enregistré ne correspond à l'identifiant : ${q}`);
    }

    return item;
  }

  // --- LISTE DES LOTS SOUS SURVEILLANCE ---
  async getAllBatches(search?: string, status?: string, coldChain?: string): Promise<DrugTraceability[]> {
    const qb = this.traceRepo.createQueryBuilder('d');

    if (search) {
      qb.andWhere(
        '(d.brandName LIKE :s OR d.dci LIKE :s OR d.batchNumber LIKE :s OR d.manufacturer LIKE :s)',
        { s: `%${search}%` },
      );
    }

    if (status && status !== 'ALL') {
      qb.andWhere('d.status = :status', { status });
    }

    if (coldChain === 'true') {
      qb.andWhere('d.coldChainRequired = true');
    }

    qb.orderBy('d.updatedAt', 'DESC');
    return qb.getMany();
  }

  // --- RAPPELS DE LOTS ACTIFS ---
  async getActiveRecalls(): Promise<DrugTraceability[]> {
    return this.traceRepo.find({
      where: { status: 'RECALLED' },
      order: { updatedAt: 'DESC' },
    });
  }

  // --- STATISTIQUES GLOBALES DE TRAÇABILITÉ ---
  async getStats() {
    const totalBatches = await this.traceRepo.count();
    const conformBatches = await this.traceRepo.count({ where: { status: 'CONFORME' } });
    const recalledBatches = await this.traceRepo.count({ where: { status: 'RECALLED' } });
    const coldChainCount = await this.traceRepo.count({ where: { coldChainRequired: true } });

    return {
      totalBatches,
      conformBatches,
      recalledBatches,
      coldChainCount,
      complianceRate: totalBatches > 0 ? Math.round((conformBatches / totalBatches) * 100) : 100,
    };
  }

  // --- SIGNALEMENT DE PHARMACOVIGILANCE / SUSPICION CONTREFAÇON ---
  async reportIssue(dto: {
    batchNumber: string;
    reporterName: string;
    reporterPhone: string;
    issueType: string;
    description: string;
  }) {
    // Alerte en temps réel pour l'administrateur et les pharmacies
    await this.notifService.createNotification({
      targetRole: 'ADMIN',
      type: 'ALERT',
      titleAr: `🚨 إشعار يقظة دوائية: فحص الدفعة ${dto.batchNumber}`,
      titleFr: `🚨 Signalement Pharmacovigilance : Lot ${dto.batchNumber}`,
      titleEn: `🚨 Pharmacovigilance Alert: Batch ${dto.batchNumber}`,
      messageAr: `تم إيداع بلاغ من ${dto.reporterName} حول وجود مشكلة (${dto.issueType}) في الدواء: ${dto.description}`,
      messageFr: `Signalement émis par ${dto.reporterName} (${dto.issueType}) : ${dto.description}`,
      messageEn: `Issue reported by ${dto.reporterName} (${dto.issueType}) : ${dto.description}`,
      link: '/traceability',
      metadata: dto,
    });

    return {
      success: true,
      message: 'Signalement de pharmacovigilance enregistré et transmis à la Direction de la Santé (DSP Sétif).',
      incidentTicket: `SIGNAL-2026-SETIF-${Math.floor(Math.random() * 90000 + 10000)}`,
    };
  }

  // --- REGISTRE DE SURVEILLANCE DES ACHATS DE DRUGS / PSYCHOTROPES (LOI 04-18) ---
  private getControlledDispensationsFilePath(): string {
    const p1 = path.resolve(process.cwd(), 'data/controlled-dispensations.json');
    if (fs.existsSync(p1)) return p1;
    const p2 = path.resolve(process.cwd(), '../data/controlled-dispensations.json');
    if (fs.existsSync(p2)) return p2;
    return p1;
  }

  private readControlledDispensations(): ControlledDrugDispensation[] {
    try {
      const filePath = this.getControlledDispensationsFilePath();
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      // Fallback
    }
    return [];
  }

  private writeControlledDispensations(data: ControlledDrugDispensation[]) {
    try {
      const filePath = this.getControlledDispensationsFilePath();
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing controlled dispensations:', e);
    }
  }

  async getControlledDispensations(search?: string, category?: string, alertOnly?: string) {
    let list = this.readControlledDispensations();

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.patientName.toLowerCase().includes(s) ||
          item.patientChifa.includes(s) ||
          item.patientNin.includes(s) ||
          item.drugName.toLowerCase().includes(s) ||
          item.batchNumber.toLowerCase().includes(s) ||
          item.prescribingDoctor.toLowerCase().includes(s) ||
          item.dispensingPharmacy.toLowerCase().includes(s),
      );
    }

    if (category && category !== 'ALL') {
      list = list.filter((item) => item.category === category);
    }

    if (alertOnly === 'true') {
      list = list.filter((item) => item.anomalyAlert === true);
    }

    return list;
  }

  async getControlledDispensationsStats() {
    const list = this.readControlledDispensations();
    const totalDispensations = list.length;
    const alertCount = list.filter((i) => i.anomalyAlert).length;
    const uniquePatients = new Set(list.map((i) => i.patientChifa)).size;
    const uniquePharmacies = new Set(list.map((i) => i.dispensingPharmacy)).size;

    return {
      totalDispensations,
      alertCount,
      uniquePatients,
      uniquePharmacies,
      complianceRate: totalDispensations > 0 ? Math.round(((totalDispensations - alertCount) / totalDispensations) * 100) : 100,
    };
  }

  async updateControlledDispensationStatus(id: string, status: 'VERIFIED' | 'SUSPECT' | 'UNDER_INVESTIGATION', notes?: string) {
    const list = this.readControlledDispensations();
    const item = list.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundException(`Délivrance introuvable pour l'identifiant ${id}`);
    }

    item.status = status;
    if (notes) {
      item.anomalyReason = (item.anomalyReason ? item.anomalyReason + ' | ' : '') + notes;
    }
    this.writeControlledDispensations(list);
    return item;
  }
}
