import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ default: 'ALL' })
  targetRole: string; // 'ALL' | 'PHARMACY' | 'PATIENT' | 'DOCTOR' | 'ADMIN'

  @Column({ default: 'SYSTEM' })
  type: string; // 'ORDER_CREATED' | 'ORDER_STATUS_CHANGED' | 'APPOINTMENT' | 'PRESCRIPTION' | 'ALERT' | 'SYSTEM'

  @Column()
  titleAr: string;

  @Column()
  titleFr: string;

  @Column({ nullable: true })
  titleEn: string;

  @Column({ type: 'text' })
  messageAr: string;

  @Column({ type: 'text' })
  messageFr: string;

  @Column({ type: 'text', nullable: true })
  messageEn: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
