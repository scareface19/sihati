import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessConsent, ConsentStatus } from '../../entities/access-consent.entity';

@Injectable()
export class ConsentsService {
  constructor(
    @InjectRepository(AccessConsent)
    private consentRepo: Repository<AccessConsent>,
  ) {}

  // Le médecin demande l'accès au dossier -> génère un OTP 6 chiffres
  async requestAccess(patientId: number, doctorId: number) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes pour valider

    const consent = this.consentRepo.create({
      patientId,
      doctorId,
      otpCode,
      status: ConsentStatus.PENDING,
      expiresAt,
    });
    await this.consentRepo.save(consent);

    return {
      consentId: consent.id,
      message: 'Code OTP généré et transmis au patient pour validation',
      otpCode, // Dans un environnement réel avec SMS, ceci est envoyé par SMS/Push
      expiresAt,
    };
  }

  // Validation de l'OTP
  async verifyOtp(patientId: number, doctorId: number, otpCode: string) {
    const consent = await this.consentRepo.findOne({
      where: {
        patientId,
        doctorId,
        otpCode,
        status: ConsentStatus.PENDING,
      },
    });

    if (!consent) {
      throw new BadRequestException('Code OTP invalide ou expiré');
    }

    if (new Date() > consent.expiresAt) {
      consent.status = ConsentStatus.EXPIRED;
      await this.consentRepo.save(consent);
      throw new BadRequestException('Code OTP expiré');
    }

    consent.status = ConsentStatus.GRANTED;
    // Accès valide pour les 2 prochaines heures de consultation
    consent.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await this.consentRepo.save(consent);

    return {
      status: 'GRANTED',
      validUntil: consent.expiresAt,
      message: 'Accès au dossier médical accordé avec succès',
    };
  }

  // Vérifier si le médecin a un accès actif
  async hasActiveConsent(patientId: number, doctorId: number): Promise<boolean> {
    const consent = await this.consentRepo.findOne({
      where: {
        patientId,
        doctorId,
        status: ConsentStatus.GRANTED,
      },
      order: { createdAt: 'DESC' },
    });

    if (!consent) return false;
    return new Date() <= consent.expiresAt;
  }
}
