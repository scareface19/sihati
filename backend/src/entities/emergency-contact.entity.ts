import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('emergency_contacts')
export class EmergencyContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @ManyToOne(() => Patient, (patient) => patient.emergencyContacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  relation: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'priority_order', default: 1 })
  priorityOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
