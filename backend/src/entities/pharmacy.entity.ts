import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pharmacy_profiles')
export class PharmacyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ default: 'صيدلية بلمعزة (Pharmacie Belmaaza)' })
  name: string;

  @Column({ name: 'pharmacist_name', default: 'Dr. Youcef Belmaaza' })
  pharmacistName: string;

  @Column({ name: 'license_number', default: 'ORD-PHARM-SETIF-2018-0442' })
  licenseNumber: string;

  @Column({ default: 'سطيف المركز (Sétif Centre)' })
  commune: string;

  @Column({ default: 'شارع 8 ماي 1945، بالقرب من عين الفوارة، سطيف' })
  address: string;

  @Column({ default: '036 84 12 55' })
  phone: string;

  @Column({ default: 'pharmacie@sihati.dz' })
  email: string;

  @Column({ name: 'opening_hours', default: '08:00 - 19:30' })
  openingHours: string;

  @Column({ name: 'is_night_guard', default: true })
  isNightGuard: boolean;

  @Column({ name: 'chifa_convention_number', default: 'CNAS-SETIF-CH-884210' })
  chifaConventionNumber: string;

  @Column({ name: 'chifa_enabled', default: true })
  chifaEnabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('pharmacy_stocks')
export class PharmacyStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pharmacy_id', default: 1 })
  pharmacyId: number;

  @Column({ length: 64 })
  code: string;

  @Column({ name: 'brand_name' })
  brandName: string;

  @Column()
  dci: string;

  @Column({ default: 'COMPRIME' })
  form: string;

  @Column({ default: '1000 MG' })
  dosage: string;

  @Column({ default: 0 })
  quantity: number;

  @Column({ name: 'min_threshold', default: 10 })
  minThreshold: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, default: 250.0 })
  unitPrice: number;

  @Column({ name: 'is_reimbursable', default: true })
  isReimbursable: boolean;

  @Column({ default: 'IN_STOCK' })
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

  @Column({ name: 'last_replenished_at', type: 'datetime', nullable: true })
  lastReplenishedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('pharmacy_orders')
export class PharmacyOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pharmacy_id', default: 1 })
  pharmacyId: number;

  @Column({ name: 'order_reference', length: 64, unique: true })
  orderReference: string;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ name: 'patient_chifa_number', nullable: true })
  patientChifaNumber: string;

  @Column({ name: 'patient_phone', nullable: true })
  patientPhone: string;

  @Column({ name: 'doctor_name' })
  doctorName: string;

  @Column({ name: 'prescription_hash', nullable: true })
  prescriptionHash: string;

  @Column({ name: 'items_count', default: 1 })
  itemsCount: number;

  @Column({ name: 'items_summary', type: 'text' })
  itemsSummary: string;

  @Column({ name: 'chifa_coverage_rate', default: 80 })
  chifaCoverageRate: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  totalAmount: number;

  @Column({ name: 'patient_copay', type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  patientCopay: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DISPENSED';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
