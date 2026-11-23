import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { User, UserRole } from '../../entities/user.entity';
import { Patient } from '../../entities/patient.entity';
import { Doctor } from '../../entities/doctor.entity';
import { Medication } from '../../entities/medication.entity';
import { EmergencyContact } from '../../entities/emergency-contact.entity';
import { MedicalRecord } from '../../entities/medical-record.entity';
import { Prescription, PrescriptionStatus } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';
import { SelfMedication, ProductType } from '../../entities/self-medication.entity';
import { PharmacyProfile } from '../../entities/pharmacy.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(Medication) private medRepo: Repository<Medication>,
    @InjectRepository(EmergencyContact) private contactRepo: Repository<EmergencyContact>,
    @InjectRepository(MedicalRecord) private recordRepo: Repository<MedicalRecord>,
    @InjectRepository(Prescription) private prescRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem) private itemRepo: Repository<PrescriptionItem>,
    @InjectRepository(Appointment) private apptRepo: Repository<Appointment>,
    @InjectRepository(SelfMedication) private selfMedRepo: Repository<SelfMedication>,
    @InjectRepository(PharmacyProfile) private pharmacyRepo: Repository<PharmacyProfile>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Vérification & Initialisation automatique de la base SIHATI...');
    try {
      await this.runSeed();
    } catch (err: any) {
      this.logger.error('Erreur lors de l’initialisation automatique de la base:', err?.message || err);
    }
  }

  async runSeed() {
    this.logger.log('Démarrage du peuplement / synchronisation de la base de données MySQL...');

    // 1. Peuplement des 560 médicaments si la table est vide
    const medCount = await this.medRepo.count();
    if (medCount === 0) {
      await this.seedMedications();
    } else {
      this.logger.log(`Nomenclature déjà présente (${medCount} médicaments).`);
    }

    // 2. Création et synchronisation des utilisateurs de démonstration
    await this.seedDemoUsersAndData();

    return {
      status: 'SUCCESS',
      message: 'Base de données MySQL صحّتي initialisée avec succès !',
      medicationsCount: await this.medRepo.count(),
      usersCount: await this.userRepo.count(),
    };
  }

  private async seedMedications() {
    this.logger.log('Chargement de la nomenclature 2025 des médicaments algériens...');
    const possiblePaths = [
      path.resolve(__dirname, '../../../../data/algerian_medications_2025.json'),
      path.resolve(process.cwd(), 'data/algerian_medications_2025.json'),
      path.resolve(process.cwd(), '../data/algerian_medications_2025.json'),
    ];

    let jsonPath = possiblePaths.find((p) => fs.existsSync(p));
    if (jsonPath) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const entities = data.map((d: any) =>
        this.medRepo.create({
          registrationNumber: d.registrationNumber,
          code: d.code,
          dci: d.dci,
          brandName: d.brandName,
          form: d.form,
          dosage: d.dosage,
          packaging: d.packaging,
        }),
      );

      // Batch insert in chunks of 100
      const chunkSize = 100;
      for (let i = 0; i < entities.length; i += chunkSize) {
        const chunk = entities.slice(i, i + chunkSize);
        await this.medRepo.save(chunk);
      }
      this.logger.log(`${entities.length} médicaments insérés dans MySQL.`);
    }
  }

  private async seedDemoUsersAndData() {
    const salt = await bcrypt.genSalt(10);
    const validPasswordHash = await bcrypt.hash('password123', salt);

    // Fonction d'aide pour garantir l'existence d'un utilisateur et un mot de passe valide
    const ensureUser = async (data: {
      phone: string;
      email: string;
      role: UserRole;
      firstName: string;
      lastName: string;
    }) => {
      let user = await this.userRepo.findOne({
        where: [{ email: data.email }, { phone: data.phone }],
      });

      if (!user) {
        user = await this.userRepo.save(
          this.userRepo.create({
            phone: data.phone,
            email: data.email,
            passwordHash: validPasswordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          }),
        );
        this.logger.log(`Compte créé : ${data.email} (${data.role})`);
      } else {
        // Synchronisation systématique de l'email, du rôle et du mot de passe
        user.email = data.email;
        user.role = data.role;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.passwordHash = validPasswordHash;
        await this.userRepo.save(user);
        this.logger.log(`Compte synchronisé : ${data.email} (${data.role})`);
      }
      return user;
    };

    // 1. ADMIN
    await ensureUser({
      phone: '0550000000',
      email: 'admin@sihati.dz',
      role: UserRole.ADMIN,
      firstName: 'مدير',
      lastName: 'النظام',
    });

    // 2. DOCTOR (dr.ali@sihati.dz et doctor@sihati.dz)
    const docUser1 = await ensureUser({
      phone: '0661234567',
      email: 'dr.ali@sihati.dz',
      role: UserRole.DOCTOR,
      firstName: 'محمد',
      lastName: 'علي',
    });
    await ensureUser({
      phone: '0661234560',
      email: 'doctor@sihati.dz',
      role: UserRole.DOCTOR,
      firstName: 'طبيب',
      lastName: 'المداومة',
    });

    // Autres médecins
    await ensureUser({
      phone: '0662345678',
      email: 'dr.sara@sihati.dz',
      role: UserRole.DOCTOR,
      firstName: 'سارة',
      lastName: 'أحمد',
    });
    await ensureUser({
      phone: '0663456789',
      email: 'dr.yasser@sihati.dz',
      role: UserRole.DOCTOR,
      firstName: 'ياسر',
      lastName: 'محمود',
    });

    // 3. PHARMACIES (pharmacie@sihati.dz et pharmacy@sihati.dz)
    const pharmUser1 = await ensureUser({
      phone: '0770123456',
      email: 'pharmacie@sihati.dz',
      role: UserRole.PHARMACY,
      firstName: 'يوسف',
      lastName: 'بلمعزة',
    });
    const pharmUser2 = await ensureUser({
      phone: '0770123450',
      email: 'pharmacy@sihati.dz',
      role: UserRole.PHARMACY,
      firstName: 'صيدلية',
      lastName: 'الشفاء المركزية',
    });

    // 4. PATIENT (patient@sihati.dz)
    const patientUser = await ensureUser({
      phone: '0555123456',
      email: 'patient@sihati.dz',
      role: UserRole.PATIENT,
      firstName: 'محمد أمين',
      lastName: 'بن علي',
    });

    // Profils liés : Patient
    let patient = await this.patientRepo.findOne({ where: { userId: patientUser.id } });
    if (!patient) {
      patient = await this.patientRepo.save(
        this.patientRepo.create({
          userId: patientUser.id,
          dateOfBirth: '1996-05-14',
          gender: 'M',
          bloodGroup: 'O+',
          heightCm: 175.0,
          weightKg: 72.0,
          wilaya: 'Sétif',
          commune: 'Sétif Centre',
          chronicDiseases: 'ضغط الدم المرتفع',
          allergies: 'حساسية البنسلين (شديدة), حساسية المكسرات (شديدة), غبار (متوسطة)',
          emergencyToken: 'sihati-sos-token-2024-784512',
        }),
      );

      await this.contactRepo.save([
        this.contactRepo.create({
          patientId: patient.id,
          name: 'فاطمة بن علي (Mère)',
          relation: 'أم',
          phone: '0612345678',
          priorityOrder: 1,
        }),
        this.contactRepo.create({
          patientId: patient.id,
          name: 'أحمد بن علي (Frère)',
          relation: 'أخ',
          phone: '0698765432',
          priorityOrder: 2,
        }),
      ]);
    }

    // Profils liés : Médecin 1
    let doctor1 = await this.doctorRepo.findOne({ where: { userId: docUser1.id } });
    if (!doctor1) {
      doctor1 = await this.doctorRepo.save(
        this.doctorRepo.create({
          userId: docUser1.id,
          licenseNumber: 'MED-SETIF-2015-089',
          specialty: 'طبيب عام (Médecine Générale)',
          wilaya: 'Sétif',
          commune: 'Sétif',
          clinicAddress: 'حي 1014 مسكن، عمارة ب، سطيف',
          consultationFee: 1500.0,
          latitude: 36.1911,
          longitude: 5.4137,
          bio: 'طبيب عام ذو خبرة 10 سنوات في الفحص السريري والمتابعة الشاملة.',
          isVerified: true,
        }),
      );
    }

    // Profils liés : Pharmacie
    let pharmProfile = await this.pharmacyRepo.findOne({ where: { userId: pharmUser1.id } });
    if (!pharmProfile) {
      pharmProfile = await this.pharmacyRepo.save(
        this.pharmacyRepo.create({
          userId: pharmUser1.id,
          name: 'صيدلية بلمعزة (Pharmacie Belmaaza)',
          pharmacistName: 'Dr. Youcef Belmaaza',
          licenseNumber: 'ORD-PHARM-SETIF-2018-0442',
          commune: 'سطيف المركز (Sétif Centre)',
          address: 'شارع 8 ماي 1945، بالقرب من عين الفوارة، سطيف',
          phone: '036 84 12 55',
          email: 'pharmacie@sihati.dz',
          openingHours: '08:00 - 19:30',
          isNightGuard: true,
          chifaConventionNumber: 'CNAS-SETIF-CH-884210',
          chifaEnabled: true,
        }),
      );
    }

    // Vérifier les consultations & ordonnances démo
    if (patient && doctor1) {
      const recordCount = await this.recordRepo.count({ where: { patientId: patient.id } });
      if (recordCount === 0) {
        const record = await this.recordRepo.save(
          this.recordRepo.create({
            patientId: patient.id,
            doctorId: doctor1.id,
            specialty: 'طبيب عام (Médecine Générale)',
            diagnosis: 'ارتفاع ضغط الدم الشرياني الخفيف (HTA modérée)',
            clinicalNotes: 'المريض يعاني من ضغط دم مرتفع تحت السيطرة. تجنب مشتقات البنسلين.',
            treatmentPlan: 'حمية قليلة الملح، ممارسة المشي 30 دقيقة يومياً.',
          }),
        );

        const presc = await this.prescRepo.save(
          this.prescRepo.create({
            recordId: record.id,
            patientId: patient.id,
            doctorId: doctor1.id,
            qrCodeHash: 'ORD-2024-SETIF-984712',
            status: PrescriptionStatus.ACTIVE,
          }),
        );

        const losartan = await this.medRepo.findOne({ where: { dci: 'VALSARTAN' } });
        await this.itemRepo.save(
          this.itemRepo.create({
            prescriptionId: presc.id,
            medicationId: losartan?.id || null,
            customMedicationName: 'Losartan 50mg',
            dosageInstructions: '1 comprimé chaque matin après le petit-déjeuner',
            duration: '30 jours',
          }),
        );

        const inTwoDays = new Date();
        inTwoDays.setDate(inTwoDays.getDate() + 2);
        await this.apptRepo.save(
          this.apptRepo.create({
            patientId: patient.id,
            doctorId: doctor1.id,
            appointmentDate: inTwoDays,
            status: AppointmentStatus.CONFIRMED,
            reason: 'متابعة دورية لضغط الدم',
          }),
        );
      }
    }

    this.logger.log('[OK] Tous les comptes démo (Admin, Médecin, Pharmacien, Patient) sont prêts avec le mot de passe "password123".');
  }
}
