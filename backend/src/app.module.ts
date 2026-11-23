import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
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
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const rawDbType = (config.get<string>('DB_TYPE') || '').toLowerCase().trim();
        const hasMysqlConfig =
          (config.get<string>('DB_HOST') && config.get<string>('DB_HOST') !== 'localhost') ||
          config.get<string>('DATABASE_URL');

        // Mode MySQL si explicitement demandé (DB_TYPE=mysql) ou si DATABASE_URL est fourni
        const useMysql = rawDbType === 'mysql' || (rawDbType !== 'sqlite' && hasMysqlConfig);

        const entities = [
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
        ];

        if (useMysql) {
          const dbUrl = config.get<string>('DATABASE_URL');
          const isSsl =
            config.get<string>('DB_SSL') === 'true' ||
            (dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1'));

          return {
            type: 'mysql',
            ...(dbUrl
              ? { url: dbUrl }
              : {
                  host: config.get<string>('DB_HOST') || 'localhost',
                  port: parseInt(config.get<string>('DB_PORT') || '3306', 10),
                  username: config.get<string>('DB_USERNAME') || 'root',
                  password: config.get<string>('DB_PASSWORD') || '',
                  database: config.get<string>('DB_NAME') || 'sihati_db',
                }),
            ssl: isSsl ? { rejectUnauthorized: false } : false,
            entities,
            synchronize: true,
            logging: false,
          };
        }

        // Mode SQLite (Première préférence par défaut pour déploiement autonome zéro-dépendance)
        const rawPath = config.get<string>('SQLITE_PATH') || 'data/sihati.sqlite';
        const sqlitePath = path.isAbsolute(rawPath) ? rawPath : path.resolve(process.cwd(), rawPath);
        const dir = path.dirname(sqlitePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        let sqliteDriver: any;
        try {
          sqliteDriver = require('sqlite3');
        } catch (e) {}

        return {
          type: 'sqlite',
          database: sqlitePath,
          ...(sqliteDriver ? { driver: sqliteDriver } : {}),
          entities,
          synchronize: true,
          logging: false,
        };
      },
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
