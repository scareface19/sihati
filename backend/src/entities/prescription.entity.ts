import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
import { MedicalRecord } from './medical-record.entity';
import { PrescriptionItem } from './prescription-item.entity';

export enum PrescriptionStatus {
  ACTIVE = 'ACTIVE',
  DISPENSED = 'DISPENSED',
  EXPIRED = 'EXPIRED',
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'record_id', nullable: true })
  recordId: number;

  @ManyToOne(() => MedicalRecord, (rec) => rec.prescriptions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'record_id' })
  medicalRecord: MedicalRecord;

  @Column({ name: 'patient_id' })
  patientId: number;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'doctor_id' })
  doctorId: number;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'qr_code_hash', unique: true, length: 255 })
  qrCodeHash: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.ACTIVE,
  })
  status: PrescriptionStatus;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription, {
    cascade: true,
  })
  items: PrescriptionItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
