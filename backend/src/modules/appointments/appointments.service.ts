import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async createAppointment(data: {
    patientId: number;
    doctorId: number;
    appointmentDate: Date;
    reason?: string;
  }) {
    const appt = this.appointmentRepo.create({
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentDate: data.appointmentDate,
      reason: data.reason,
      status: AppointmentStatus.PENDING,
    });
    return this.appointmentRepo.save(appt);
  }

  async getPatientAppointments(patientId: number) {
    return this.appointmentRepo.find({
      where: { patientId },
      relations: ['doctor', 'doctor.user'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async getDoctorAppointments(doctorId: number) {
    return this.appointmentRepo.find({
      where: { doctorId },
      relations: ['patient', 'patient.user'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async updateStatus(id: number, status: AppointmentStatus, notes?: string) {
    const appt = await this.appointmentRepo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Rendez-vous introuvable');

    appt.status = status;
    if (notes) appt.notes = notes;
    return this.appointmentRepo.save(appt);
  }
}
