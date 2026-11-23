import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyAlert } from '../../entities/emergency-alert.entity';
import { Patient } from '../../entities/patient.entity';
import { EmergencyContact } from '../../entities/emergency-contact.entity';
import { MedicalRecord } from '../../entities/medical-record.entity';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(EmergencyAlert)
    private alertRepo: Repository<EmergencyAlert>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(EmergencyContact)
    private contactRepo: Repository<EmergencyContact>,
    @InjectRepository(MedicalRecord)
    private recordRepo: Repository<MedicalRecord>,
  ) {}

  // Déclenché par le bouton SOS rouge sur l'application mobile
  async handleSOSAlert(userId: number, coords: { latitude: number; longitude: number }) {
    const patient = await this.patientRepo.findOne({
      where: { userId },
      relations: ['user', 'emergencyContacts'],
    });
    if (!patient) throw new NotFoundException('Profil patient introuvable');

    const alert = this.alertRepo.create({
      patientId: patient.id,
      latitude: coords.latitude,
      longitude: coords.longitude,
      status: 'ACTIVE',
      notifiedContactsCount: patient.emergencyContacts?.length || 0,
      addressDescription: `Wilaya de ${patient.wilaya}, ${patient.commune || 'Sétif'}`,
    });
    const saved = await this.alertRepo.save(alert);

    // Simulation de notification Protection Civile (14) et contacts d'urgence
    const emergencyLink = `https://sihati.dz/emergency/${patient.emergencyToken}`;
    const notifications = patient.emergencyContacts.map((c) => ({
      to: c.phone,
      relation: c.relation,
      message: `URGENCE SIHATI: ${patient.user.firstName} a déclenché un appel de détresse. Position: https://maps.google.com/?q=${coords.latitude},${coords.longitude} - Fiche Vitale: ${emergencyLink}`,
    }));

    return {
      alertId: saved.id,
      status: 'SOS_SENT',
      emergencyNumber: '14 (Protection Civile)',
      notifiedContacts: notifications,
      emergencyToken: patient.emergencyToken,
      publicEmergencyUrl: emergencyLink,
    };
  }

  // Consultation publique sécurisée de la Fiche Vitale par QR Code (sans mot de passe)
  async getPublicProfileByToken(token: string) {
    const patient = await this.patientRepo.findOne({
      where: { emergencyToken: token },
      relations: ['user', 'emergencyContacts'],
    });
    if (!patient) throw new NotFoundException('Fiche d’urgence introuvable ou révoquée');

    // Récupérer la dernière consultation pour voir les recommandations du médecin
    const latestRecord = await this.recordRepo.findOne({
      where: { patientId: patient.id },
      relations: ['doctor', 'doctor.user'],
      order: { createdAt: 'DESC' },
    });

    return {
      fullName: `${patient.user.firstName} ${patient.user.lastName}`,
      gender: patient.gender === 'M' ? 'ذكر (Homme)' : 'أنثى (Femme)',
      bloodGroup: patient.bloodGroup || 'Non renseigné',
      dateOfBirth: patient.dateOfBirth,
      heightCm: patient.heightCm,
      weightKg: patient.weightKg,
      allergies: patient.allergies ? patient.allergies.split(',') : [],
      chronicDiseases: patient.chronicDiseases ? patient.chronicDiseases.split(',') : [],
      emergencyContacts: patient.emergencyContacts.map((c) => ({
        name: c.name,
        relation: c.relation,
        phone: c.phone,
      })),
      doctorNotes: latestRecord
        ? {
            doctorName: `Dr. ${latestRecord.doctor.user.firstName} ${latestRecord.doctor.user.lastName}`,
            specialty: latestRecord.doctor.specialty,
            clinicPhone: latestRecord.doctor.user.phone,
            notes: latestRecord.clinicalNotes,
            date: latestRecord.createdAt,
          }
        : null,
      civilProtectionNumber: '14',
    };
  }
}
