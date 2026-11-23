import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { EmergencyContact } from './emergency-contact.entity';
import { SelfMedication } from './self-medication.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @ManyToOne(() => Patient, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Patient;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'enum', enum: ['M', 'F'], nullable: true })
  gender: string;

  @Column({
    name: 'blood_group',
    type: 'enum',
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    nullable: true,
  })
  bloodGroup: string;

  @Column({ name: 'height_cm', type: 'decimal', precision: 5, scale: 2, nullable: true })
  heightCm: number;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 5, scale: 2, nullable: true })
  weightKg: number;

  @Column({ length: 50, default: 'Sétif' })
  wilaya: string;

  @Column({ length: 50, nullable: true })
  commune: string;

  @Column({ name: 'chronic_diseases', type: 'text', nullable: true })
  chronicDiseases: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ name: 'emergency_token', length: 64, unique: true })
  emergencyToken: string;

  @OneToMany(() => EmergencyContact, (contact) => contact.patient)
  emergencyContacts: EmergencyContact[];

  @OneToMany(() => SelfMedication, (selfMed) => selfMed.patient)
  selfMedications: SelfMedication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
