import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LicenseService {
  private readonly logger = new Logger('LicenseService');

  /**
   * Statut permanent sans restriction ni période d'essai
   */
  public checkTrialStatus() {
    return {
      isExpired: false,
      isPermanent: true,
      daysRemaining: 99999,
      installationDate: '2026-01-01T00:00:00.000Z',
      expirationDate: 'ILLIMITÉE (Version Complète Sans Restriction)',
      supportContact: 'contact@sihati.dz',
    };
  }

  /**
   * Validation automatique
   */
  public activatePermanent(key?: string) {
    return {
      success: true,
      message: 'Licence permanente active. Aucune restriction.',
    };
  }
}
