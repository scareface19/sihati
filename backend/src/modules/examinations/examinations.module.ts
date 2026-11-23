import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalExamination } from '../../entities/medical-examination.entity';
import { ExaminationsService } from './examinations.service';
import { ExaminationsController } from './examinations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalExamination])],
  controllers: [ExaminationsController],
  providers: [ExaminationsService],
  exports: [ExaminationsService],
})
export class ExaminationsModule {}
