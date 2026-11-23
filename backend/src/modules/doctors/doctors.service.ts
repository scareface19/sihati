import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../entities/doctor.entity';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';
import { Prescription } from '../../entities/prescription.entity';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Prescription)
    private prescriptionRepo: Repository<Prescription>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async searchDoctors(filters: {
    wilaya?: string;
    commune?: string;
    specialty?: string;
    query?: string;
  }) {
    const qb = this.doctorRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.user', 'u')
      .where('1=1');

    if (filters.wilaya) {
      qb.andWhere('d.wilaya = :wilaya', { wilaya: filters.wilaya });
    }
    if (filters.commune) {
      qb.andWhere('d.commune = :commune', { commune: filters.commune });
    }
    if (filters.specialty) {
      qb.andWhere('d.specialty LIKE :specialty', { specialty: `%${filters.specialty}%` });
    }
    if (filters.query) {
      qb.andWhere('(u.firstName LIKE :q OR u.lastName LIKE :q OR d.clinicAddress LIKE :q)', {
        q: `%${filters.query}%`,
      });
    }

    return qb.getMany();
  }

  async getDoctorById(id: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!doctor) throw new NotFoundException('Médecin introuvable');
    return doctor;
  }

  async getDoctorByUserId(userId: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!doctor) throw new NotFoundException('Profil médecin introuvable');
    return doctor;
  }

  // Dashboard Stats pour le portail médecin
  async getDashboardStats(doctorId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await this.appointmentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'p')
      .leftJoinAndSelect('p.user', 'pu')
      .where('a.doctorId = :doctorId', { doctorId })
      .andWhere('a.appointmentDate >= :today AND a.appointmentDate < :tomorrow', {
        today,
        tomorrow,
      })
      .orderBy('a.appointmentDate', 'ASC')
      .getMany();

    const totalPrescriptions = await this.prescriptionRepo.count({
      where: { doctorId },
    });

    const pendingAppointments = await this.appointmentRepo.count({
      where: { doctorId, status: AppointmentStatus.PENDING },
    });

    return {
      appointmentsToday,
      totalPrescriptions,
      pendingAppointments,
    };
  }

  // --- MÉTHODES ADMINISTRATION (Superviseur) ---

  // Liste complète pour l'administrateur
  async getAllForAdmin() {
    return this.doctorRepo.find({
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }

  // Valider / Révoquer l'agrément d'un médecin
  async verifyDoctor(id: number, isVerified: boolean) {
    const doctor = await this.getDoctorById(id);
    doctor.isVerified = isVerified;
    return this.doctorRepo.save(doctor);
  }

  // Modifier les données d'un praticien (Admin)
  async updateDoctor(id: number, data: any) {
    const doctor = await this.getDoctorById(id);
    if (data.specialty) doctor.specialty = data.specialty;
    if (data.commune) doctor.commune = data.commune;
    if (data.clinicAddress) doctor.clinicAddress = data.clinicAddress;
    if (data.consultationFee !== undefined) doctor.consultationFee = data.consultationFee;
    if (data.licenseNumber) doctor.licenseNumber = data.licenseNumber;
    if (data.isVerified !== undefined) doctor.isVerified = data.isVerified;

    if (doctor.user && (data.firstName || data.lastName || data.phone || data.email)) {
      if (data.firstName) doctor.user.firstName = data.firstName;
      if (data.lastName) doctor.user.lastName = data.lastName;
      if (data.phone) doctor.user.phone = data.phone;
      if (data.email) doctor.user.email = data.email;
      await this.userRepo.save(doctor.user);
    }

    return this.doctorRepo.save(doctor);
  }

  // Injecter / Ajouter un médecin (Admin)
  async createDoctor(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    specialty: string;
    wilaya?: string;
    commune: string;
    clinicAddress: string;
    licenseNumber: string;
    consultationFee?: number;
    isVerified?: boolean;
  }) {
    // Créer ou lier l'utilisateur
    let user = await this.userRepo.findOne({ where: { phone: data.phone } });
    if (!user) {
      user = this.userRepo.create({
        phone: data.phone,
        email: data.email || `${data.phone}@sihati.dz`,
        passwordHash: '$2a$10$wKqC9qGvG6b3R5VfP2s8u.9yJbVjD7nE4W8kK5r6uQ9vX4z0r3K2y', // password123 hash
        role: UserRole.DOCTOR,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      user = await this.userRepo.save(user);
    }

    const doctor = this.doctorRepo.create({
      userId: user.id,
      specialty: data.specialty,
      wilaya: data.wilaya || 'Sétif',
      commune: data.commune || 'Sétif',
      clinicAddress: data.clinicAddress || 'Centre Ville, Sétif',
      licenseNumber: data.licenseNumber || `ORD-SETIF-${Date.now().toString().slice(-4)}`,
      consultationFee: data.consultationFee || 2000,
      isVerified: data.isVerified !== undefined ? data.isVerified : true,
    });

    return this.doctorRepo.save(doctor);
  }

  // Supprimer / Suspendre un praticien (Admin)
  async deleteDoctor(id: number) {
    const doctor = await this.getDoctorById(id);
    await this.doctorRepo.remove(doctor);
    return { success: true, id };
  }
}
