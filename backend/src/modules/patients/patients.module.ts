import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';
import { MedicalRecord } from '../../entities/medical-record.entity';
import { SelfMedication } from '../../entities/self-medication.entity';
import { EmergencyContact } from '../../entities/emergency-contact.entity';
import { MedicalDocument } from '../../entities/medical-document.entity';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
      MedicalRecord,
      SelfMedication,
      EmergencyContact,
      MedicalDocument,
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
