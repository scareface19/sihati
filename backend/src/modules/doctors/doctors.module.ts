import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../../entities/doctor.entity';
import { Appointment } from '../../entities/appointment.entity';
import { Prescription } from '../../entities/prescription.entity';
import { User } from '../../entities/user.entity';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Appointment, Prescription, User])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
