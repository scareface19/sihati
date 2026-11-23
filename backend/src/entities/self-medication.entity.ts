import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

export enum ProductType {
  OTC = 'OTC',
  SUPPLEMENT = 'SUPPLEMENT',
  HERBAL = 'HERBAL',
  TRADITIONAL = 'TRADITIONAL',
}

@Entity('self_medications')
export class SelfMedication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @ManyToOne(() => Patient, (patient) => patient.selfMedications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'product_name', length: 150 })
  productName: string;

  @Column({
    name: 'product_type',
    type: 'simple-enum',
    enum: ProductType,
    default: ProductType.OTC,
  })
  productType: ProductType;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ length: 100, nullable: true })
  dosage: string;

  @Column({ length: 100, nullable: true })
  frequency: string;

  @Column({ name: 'started_at', type: 'date', nullable: true })
  startedAt: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
