import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { Medication } from './medication.entity';

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'prescription_id' })
  prescriptionId: number;

  @ManyToOne(() => Prescription, (presc) => presc.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prescription_id' })
  prescription: Prescription;

  @Column({ name: 'medication_id', nullable: true })
  medicationId: number;

  @ManyToOne(() => Medication, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'medication_id' })
  medication: Medication;

  @Column({ name: 'custom_medication_name', length: 150, nullable: true })
  customMedicationName: string;

  @Column({ name: 'dosage_instructions', length: 255 })
  dosageInstructions: string;

  @Column({ length: 50 })
  duration: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
