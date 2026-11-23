import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('drug_traceability')
export class DrugTraceability {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'cip_code', length: 64 })
  cipCode: string;

  @Index()
  @Column({ name: 'brand_name', length: 150 })
  brandName: string;

  @Column({ length: 255 })
  dci: string;

  @Column({ length: 100 })
  dosage: string;

  @Column({ length: 100 })
  form: string;

  @Index({ unique: true })
  @Column({ name: 'batch_number', length: 64 })
  batchNumber: string;

  @Index()
  @Column({ name: 'serial_number', length: 64 })
  serialNumber: string;

  @Column({ length: 150 })
  manufacturer: string;

  @Column({ name: 'manufacturing_country', default: 'Algérie (إنتاج وطني)' })
  manufacturingCountry: string;

  @Column({ name: 'manufacturing_date', type: 'date' })
  manufacturingDate: Date;

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate: Date;

  @Column({ name: 'cold_chain_required', default: false })
  coldChainRequired: boolean;

  @Column({ name: 'temperature_min', type: 'decimal', precision: 4, scale: 1, default: 15.0 })
  temperatureMin: number;

  @Column({ name: 'temperature_max', type: 'decimal', precision: 4, scale: 1, default: 25.0 })
  temperatureMax: number;

  @Column({ name: 'current_temperature', type: 'decimal', precision: 4, scale: 1, nullable: true })
  currentTemperature: number;

  @Column({
    name: 'current_stage',
    type: 'simple-enum',
    enum: ['MANUFACTURER', 'WHOLESALER', 'PHARMACY', 'DISPENSED'],
    default: 'PHARMACY',
  })
  currentStage: 'MANUFACTURER' | 'WHOLESALER' | 'PHARMACY' | 'DISPENSED';

  @Column({ name: 'current_location', length: 255 })
  currentLocation: string;

  @Column({
    type: 'simple-enum',
    enum: ['CONFORME', 'UNDER_REVIEW', 'RECALLED'],
    default: 'CONFORME',
  })
  status: 'CONFORME' | 'UNDER_REVIEW' | 'RECALLED';

  @Column({ name: 'recall_reason', type: 'text', nullable: true })
  recallReason: string;

  @Column({ name: 'verification_hash', length: 64 })
  verificationHash: string;

  @Column({ type: 'simple-json', nullable: true })
  timeline: Array<{
    step: string;
    location: string;
    date: string;
    actor: string;
    status: string;
    temperatureObserved?: number;
  }>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
