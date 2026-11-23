import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'registration_number', length: 50 })
  registrationNumber: string;

  @Column({ length: 30 })
  code: string;

  @Index()
  @Column({ length: 255 })
  dci: string;

  @Index()
  @Column({ name: 'brand_name', length: 150 })
  brandName: string;

  @Column({ length: 150 })
  form: string;

  @Column({ length: 100 })
  dosage: string;

  @Column({ length: 100 })
  packaging: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
