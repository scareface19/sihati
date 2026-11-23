import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService, PlatformSettings } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Consulter les informations institutionnelles de la plateforme (Nom, Adresse, Téléphone, Fax, Email, etc.)
   * Accessible publiquement par tous les rôles pour la génération des documents PDF et l'affichage.
   * GET /settings
   */
  @Get()
  getSettings(): PlatformSettings {
    return this.settingsService.getSettings();
  }

  /**
   * Mettre à jour les informations institutionnelles (Réservé à l'Administrateur)
   * PUT /settings
   */
  @Put()
  updateSettings(@Body() body: Partial<PlatformSettings>): PlatformSettings {
    return this.settingsService.updateSettings(body);
  }
}
