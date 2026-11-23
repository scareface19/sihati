import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('emergency_alerts')
export class EmergencyAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: 'address_description', length: 255, nullable: true })
  addressDescription: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'RESOLVED', 'FALSE_ALARM'],
    default: 'ACTIVE',
  })
  status: string;

  @Column({ name: 'notified_contacts_count', default: 0 })
  notifiedContactsCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
