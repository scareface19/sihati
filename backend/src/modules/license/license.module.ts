import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { TrialGuard } from './trial.guard';

@Global()
@Module({
  controllers: [LicenseController],
  providers: [
    LicenseService,
    // Activation globale du TrialGuard pour protéger TOUS les modules et endpoints
    {
      provide: APP_GUARD,
      useClass: TrialGuard,
    },
  ],
  exports: [LicenseService],
})
export class LicenseModule {}
