import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

export enum DocumentType {
  LAB_RESULT = 'LAB_RESULT',
  XRAY = 'XRAY',
  SCANNER = 'SCANNER',
  REPORT = 'REPORT',
  OTHER = 'OTHER',
}

@Entity('medical_documents')
export class MedicalDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ length: 150 })
  title: string;

  @Column({
    name: 'document_type',
    type: 'simple-enum',
    enum: DocumentType,
    default: DocumentType.LAB_RESULT,
  })
  documentType: DocumentType;

  @Column({ name: 'file_url', length: 255 })
  fileUrl: string;

  @Column({ name: 'file_size', default: 0 })
  fileSize: number;

  @Column({ name: 'mime_type', length: 50, default: 'application/pdf' })
  mimeType: string;

  @Column({
    name: 'uploaded_by',
    type: 'simple-enum',
    enum: ['PATIENT', 'DOCTOR', 'LAB'],
    default: 'PATIENT',
  })
  uploadedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
