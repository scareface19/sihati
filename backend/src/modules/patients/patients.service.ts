import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../entities/patient.entity';
import { User } from '../../entities/user.entity';
import { MedicalRecord } from '../../entities/medical-record.entity';
import { SelfMedication } from '../../entities/self-medication.entity';
import { EmergencyContact } from '../../entities/emergency-contact.entity';
import { MedicalDocument } from '../../entities/medical-document.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(MedicalRecord)
    private recordRepo: Repository<MedicalRecord>,
    @InjectRepository(SelfMedication)
    private selfMedRepo: Repository<SelfMedication>,
    @InjectRepository(EmergencyContact)
    private contactRepo: Repository<EmergencyContact>,
    @InjectRepository(MedicalDocument)
    private docRepo: Repository<MedicalDocument>,
  ) {}

  async getProfileByUserId(userId: number) {
    const patient = await this.patientRepo.findOne({
      where: { userId },
      relations: ['user', 'emergencyContacts', 'selfMedications'],
    });
    if (!patient) throw new NotFoundException('Profil patient introuvable');
    return patient;
  }

  async getAllPatients() {
    return this.patientRepo.find({
      relations: ['user', 'emergencyContacts'],
      order: { id: 'ASC' },
    });
  }

  async getPatientById(patientId: number) {
    const patient = await this.patientRepo.findOne({
      where: { id: patientId },
      relations: ['user', 'emergencyContacts', 'selfMedications'],
    });
    if (!patient) throw new NotFoundException('Patient introuvable');
    return patient;
  }

  async updateProfile(userId: number, data: Partial<Patient>) {
    const patient = await this.patientRepo.findOne({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient introuvable');

    Object.assign(patient, data);
    return this.patientRepo.save(patient);
  }

  // Obtenir le dossier médical par spécialité (ou tout le dossier)
  async getRecords(patientId: number, specialty?: string) {
    const query = this.recordRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.doctor', 'doc')
      .leftJoinAndSelect('doc.user', 'docUser')
      .leftJoinAndSelect('r.prescriptions', 'presc')
      .leftJoinAndSelect('presc.items', 'items')
      .leftJoinAndSelect('items.medication', 'med')
      .where('r.patientId = :patientId', { patientId })
      .orderBy('r.createdAt', 'DESC');

    if (specialty) {
      query.andWhere('r.specialty = :specialty', { specialty });
    }

    return query.getMany();
  }

  // Automédication (العلاج الذاتي)
  async addSelfMedication(patientId: number, data: Partial<SelfMedication>) {
    const item = this.selfMedRepo.create({
      patientId,
      ...data,
    });
    return this.selfMedRepo.save(item);
  }

  async getSelfMedications(patientId: number) {
    return this.selfMedRepo.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  // Compte Famille (أفراد العائلة)
  async getFamilyMembers(parentPatientId: number) {
    return this.patientRepo.find({
      where: { parentId: parentPatientId },
      relations: ['user'],
    });
  }

  async addFamilyMember(parentUserId: number, memberData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    relation: string;
  }) {
    const parent = await this.patientRepo.findOne({ where: { userId: parentUserId } });
    if (!parent) throw new NotFoundException('Compte parent introuvable');

    // Create a sub-user without login credentials or with unique virtual phone
    const virtualPhone = `FAM-${parent.id}-${Date.now().toString().slice(-4)}`;
    const user = this.userRepo.create({
      phone: virtualPhone,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      passwordHash: 'FAMILY_MANAGED_ACCOUNT',
    });
    await this.userRepo.save(user);

    const emergencyToken = 'sihati-fam-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
    const childPatient = this.patientRepo.create({
      userId: user.id,
      parentId: parent.id,
      dateOfBirth: memberData.dateOfBirth,
      gender: memberData.gender,
      wilaya: parent.wilaya,
      commune: parent.commune,
      emergencyToken,
    });

    return this.patientRepo.save(childPatient);
  }

  // Contacts d'urgence
  async addEmergencyContact(patientId: number, data: Partial<EmergencyContact>) {
    const contact = this.contactRepo.create({
      patientId,
      ...data,
    });
    return this.contactRepo.save(contact);
  }

  // Documents médicaux
  async getDocuments(patientId: number) {
    return this.docRepo.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }
}
