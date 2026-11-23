import { Controller, Get, Post, Body } from '@nestjs/common';
import { LicenseService } from './license.service';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  /**
   * Endpoint public pour consulter le statut de la période d'essai (jours restants, date de fin)
   * GET /license/status
   */
  @Get('status')
  getStatus() {
    return this.licenseService.checkTrialStatus();
  }

  /**
   * Endpoint pour débloquer la plateforme avec une clé officielle définitive
   * POST /license/activate
   */
  @Post('activate')
  activate(@Body('key') key: string) {
    return this.licenseService.activatePermanent(key);
  }
}
