import api from './api';

export interface PlatformSettings {
  name: string;
  nameFr: string;
  subTitle: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  fax: string;
  email: string;
  website: string;
  directorName: string;
  agreementNumber: string;
  legalNotice: string;
  updatedAt: string;
}

export const defaultPlatformSettings: PlatformSettings = {
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
  legalNotice:
    'وثيقة رسمية مؤمنة مشفرة رقمياً • مطابقة للقانون 18-07 المتعلق بحماية المعطيات الصحية والقانون الصحي 18-11',
  updatedAt: new Date().toISOString(),
};

/**
 * Récupère les paramètres institutionnels actuels depuis le backend
 */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  try {
    const res = await api.get('/settings');
    if (res.data && res.data.name) {
      return res.data;
    }
  } catch (e) {
    // Fallback silencieux vers les paramètres par défaut
  }
  return defaultPlatformSettings;
}

/**
 * Met à jour les paramètres institutionnels (réservé aux administrateurs)
 */
export async function updatePlatformSettings(
  partial: Partial<PlatformSettings>
): Promise<PlatformSettings> {
  const res = await api.put('/settings', partial);
  return res.data;
}
