import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Patient,
  Doctor,
  Medication,
  Appointment,
  MedicalRecord,
  Prescription,
  PrescriptionItem,
  EmergencyContact,
  EmergencyAlert,
  SelfMedication,
  AccessConsent,
  MedicalDocument,
  MedicalExamination,
  PharmacyProfile,
  PharmacyStock,
  PharmacyOrder,
  NotificationEntity,
  DrugTraceability,
} from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { ExaminationsModule } from './modules/examinations/examinations.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TraceabilityModule } from './modules/traceability/traceability.module';
import { LicenseModule } from './modules/license/license.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sihati_db',
      entities: [
        User,
        Patient,
        Doctor,
        Medication,
        Appointment,
        MedicalRecord,
        Prescription,
        PrescriptionItem,
        EmergencyContact,
        EmergencyAlert,
        SelfMedication,
        AccessConsent,
        MedicalDocument,
        MedicalExamination,
        PharmacyProfile,
        PharmacyStock,
        PharmacyOrder,
        NotificationEntity,
        DrugTraceability,
      ],
      synchronize: true, // TypeORM synchronise automatiquement les tables MySQL
      logging: false,
    }),
    AuthModule,
    PatientsModule,
    DoctorsModule,
    MedicationsModule,
    AppointmentsModule,
    PrescriptionsModule,
    EmergencyModule,
    ConsentsModule,
    ExaminationsModule,
    PharmacyModule,
    NotificationsModule,
    TraceabilityModule,
    LicenseModule,
    SettingsModule,
    SeedModule,
  ],
})
export class AppModule {}
