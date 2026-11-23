import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription, PrescriptionStatus } from '../../entities/prescription.entity';
import { PrescriptionItem } from '../../entities/prescription-item.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private itemRepo: Repository<PrescriptionItem>,
  ) {}

  async createPrescription(data: {
    recordId?: number;
    patientId: number;
    doctorId: number;
    items: Array<{
      medicationId?: number;
      customMedicationName?: string;
      dosageInstructions: string;
      duration: string;
    }>;
  }) {
    const qrCodeHash = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const prescription = this.prescRepo.create({
      recordId: data.recordId || null,
      patientId: data.patientId,
      doctorId: data.doctorId,
      qrCodeHash,
      status: PrescriptionStatus.ACTIVE,
    });
    const savedPrescription = await this.prescRepo.save(prescription);

    const items = data.items.map((item) =>
      this.itemRepo.create({
        prescriptionId: savedPrescription.id,
        medicationId: item.medicationId || null,
        customMedicationName: item.customMedicationName || null,
        dosageInstructions: item.dosageInstructions,
        duration: item.duration,
      }),
    );
    await this.itemRepo.save(items);

    return this.findOne(savedPrescription.id);
  }

  async findOne(id: number) {
    const presc = await this.prescRepo.findOne({
      where: { id },
      relations: [
        'items',
        'items.medication',
        'doctor',
        'doctor.user',
        'patient',
        'patient.user',
      ],
    });
    if (!presc) throw new NotFoundException('Ordonnance introuvable');
    return presc;
  }

  async findByQrHash(qrCodeHash: string) {
    const presc = await this.prescRepo.findOne({
      where: { qrCodeHash },
      relations: [
        'items',
        'items.medication',
        'doctor',
        'doctor.user',
        'patient',
        'patient.user',
      ],
    });
    if (!presc) throw new NotFoundException('Ordonnance invalide ou inexistante');
    return presc;
  }

  async getPatientPrescriptions(patientId: number) {
    return this.prescRepo.find({
      where: { patientId },
      relations: ['items', 'items.medication', 'doctor', 'doctor.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDoctorPrescriptions(doctorId: number) {
    return this.prescRepo.find({
      where: { doctorId },
      relations: ['items', 'items.medication', 'patient', 'patient.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsDispensed(qrCodeHash: string) {
    const presc = await this.findByQrHash(qrCodeHash);
    presc.status = PrescriptionStatus.DISPENSED;
    return this.prescRepo.save(presc);
  }
}
