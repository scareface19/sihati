import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyProfile, PharmacyStock, PharmacyOrder } from '../../entities/pharmacy.entity';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PharmacyProfile, PharmacyStock, PharmacyOrder])],
  controllers: [PharmacyController],
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
