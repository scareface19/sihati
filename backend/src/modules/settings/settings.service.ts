import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface PlatformSettings {
  name: string;             // Nom officiel de la plateforme / clinique en arabe
  nameFr: string;           // Nom officiel en français
  subTitle: string;         // En-tête institutionnel républicain
  address: string;          // Adresse physique complète (Wilaya, commune, rue)
  phone: string;            // Téléphone standard
  emergencyPhone: string;   // Ligne d'urgence 24/7
  fax: string;              // Numéro de Fax
  email: string;            // Adresse Email de contact
  website: string;          // Site Web officiel
  directorName: string;     // Nom du directeur de l'établissement / praticien chef
  agreementNumber: string;  // Numéro d'agrément ministériel
  legalNotice: string;      // Mention légale de conformité (Loi 18-07 / Loi 18-11)
  updatedAt: string;
}

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger('SettingsService');
  private readonly settingsFilePath = path.resolve(process.cwd(), 'data/platform-settings.json');

  // Configuration par défaut conforme aux spécifications de santé publique de Sétif
  private defaultSettings: PlatformSettings = {
    name: 'المنظومة الوطنية للرعاية الصحية الرقمية « صحّتي »',
    nameFr: 'Plateforme Nationale de Santé Numérique Algérienne « SIHATI »',
    subTitle: 'الجمهورية الجزائرية الديمقراطية الشعبية • وزارة الصحة • ولاية سطيف',
    address: 'شارع 8 ماي 1945، وسط مدينة سطيف، 19000، ولاية سطيف، الجزائر',
    phone: '+213 (0) 36 84 55 12',
    emergencyPhone: '14 / +213 (0) 36 84 12 14',
    fax: '+213 (0) 36 84 55 13',
    email: 'contact@sihati.dz',
    website: 'https://sihati.dz',
    directorName: 'د. يوسف بلمعزة (مدير المؤسسة الاستشفائية / صيدلي معتمد)',
    agreementNumber: 'DSP-SETIF-AGR-2024-84920',
    legalNotice: 'وثيقة رسمية مؤمنة مشفرة رقمياً • مطابقة للقانون 18-07 المتعلق بحماية المعطيات الصحية والقانون الصحي 18-11',
    updatedAt: new Date().toISOString(),
  };

  onModuleInit() {
    this.ensureDirectoryAndFile();
  }

  private ensureDirectoryAndFile() {
    const dir = path.dirname(this.settingsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.settingsFilePath)) {
      fs.writeFileSync(
        this.settingsFilePath,
        JSON.stringify(this.defaultSettings, null, 2),
        'utf-8',
      );
      this.logger.log(`Configuration institutionnelle initialisée : ${this.settingsFilePath}`);
    }
  }

  public getSettings(): PlatformSettings {
    try {
      this.ensureDirectoryAndFile();
      const content = fs.readFileSync(this.settingsFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      this.logger.error(`Erreur de lecture des paramètres : ${err.message}`);
      return this.defaultSettings;
    }
  }

  public updateSettings(partial: Partial<PlatformSettings>): PlatformSettings {
    const current = this.getSettings();
    const updated: PlatformSettings = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(this.settingsFilePath, JSON.stringify(updated, null, 2), 'utf-8');
    this.logger.log('Paramètres institutionnels de la plateforme mis à jour avec succès.');
    return updated;
  }
}
