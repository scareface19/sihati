import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from '../../entities/appointment.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PatientsService } from '../patients/patients.service';
import { DoctorsService } from '../doctors/doctors.service';

@ApiTags('Gestion des Rendez-vous')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
  ) {}

  @ApiOperation({ summary: 'Prendre un rendez-vous (Patient)' })
  @Post()
  async book(
    @CurrentUser() user: any,
    @Body() body: { doctorId: number; appointmentDate: string; reason?: string },
  ) {
    const patient = await this.patientsService.getProfileByUserId(user.id);
    return this.appointmentsService.createAppointment({
      patientId: patient.id,
      doctorId: body.doctorId,
      appointmentDate: new Date(body.appointmentDate),
      reason: body.reason,
    });
  }

  @ApiOperation({ summary: 'Mes rendez-vous en tant que patient' })
  @Get('my-as-patient')
  async getMyPatientAppointments(@CurrentUser() user: any) {
    const patient = await this.patientsService.getProfileByUserId(user.id);
    return this.appointmentsService.getPatientAppointments(patient.id);
  }

  @ApiOperation({ summary: 'Mes rendez-vous en tant que médecin' })
  @Get('my-as-doctor')
  async getMyDoctorAppointments(@CurrentUser() user: any) {
    const doctor = await this.doctorsService.getDoctorByUserId(user.id);
    return this.appointmentsService.getDoctorAppointments(doctor.id);
  }

  @ApiOperation({ summary: 'Changer le statut d’un rendez-vous (CONFIRMED, CANCELLED, COMPLETED)' })
  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: AppointmentStatus; notes?: string },
  ) {
    return this.appointmentsService.updateStatus(id, body.status, body.notes);
  }
}
