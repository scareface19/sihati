import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'license_number', unique: true, length: 50 })
  licenseNumber: string;

  @Column({ length: 100 })
  specialty: string;

  @Column({ length: 50, default: 'Sétif' })
  wilaya: string;

  @Column({ length: 50 })
  commune: string;

  @Column({ name: 'clinic_address', type: 'text' })
  clinicAddress: string;

  @Column({ name: 'consultation_fee', type: 'decimal', precision: 10, scale: 2, default: 1500.0 })
  consultationFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
