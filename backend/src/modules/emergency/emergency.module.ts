import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyAlert } from '../../entities/emergency-alert.entity';
import { Patient } from '../../entities/patient.entity';
import { EmergencyContact } from '../../entities/emergency-contact.entity';
import { MedicalRecord } from '../../entities/medical-record.entity';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmergencyAlert,
      Patient,
      EmergencyContact,
      MedicalRecord,
    ]),
  ],
  controllers: [EmergencyController],
  providers: [EmergencyService],
  exports: [EmergencyService],
})
export class EmergencyModule {}
