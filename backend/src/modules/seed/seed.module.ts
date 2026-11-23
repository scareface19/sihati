import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Patient } from '../../entities/patient.entity';
import { Doctor } from '../../entities/doctor.entity';
import { Medication } from '../../entities/medication.entity';
import { EmergencyContact } from '../../entities/emergency-contact.entity';
import { MedicalRecord } from '../../entities/medical-record.entity';
import { Prescription } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';
import { Appointment } from '../../entities/appointment.entity';
import { SelfMedication } from '../../entities/self-medication.entity';
import { PharmacyProfile } from '../../entities/pharmacy.entity';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Patient,
      Doctor,
      Medication,
      EmergencyContact,
      MedicalRecord,
      Prescription,
      PrescriptionItem,
      Appointment,
      SelfMedication,
      PharmacyProfile,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
