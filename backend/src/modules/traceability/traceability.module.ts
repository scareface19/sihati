import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrugTraceability } from '../../entities/drug-traceability.entity';
import { TraceabilityService } from './traceability.service';
import { TraceabilityController } from './traceability.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DrugTraceability]),
    NotificationsModule,
  ],
  controllers: [TraceabilityController],
  providers: [TraceabilityService],
  exports: [TraceabilityService],
})
export class TraceabilityModule {}
