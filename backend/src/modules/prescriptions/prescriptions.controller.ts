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
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';

@ApiTags('Ordonnances Électroniques')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(
    private readonly prescService: PrescriptionsService,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}

  @ApiOperation({ summary: 'Créer une ordonnance électronique (Médecin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPrescription(
    @CurrentUser() user: any,
    @Body() body: {
      patientId: number;
      recordId?: number;
      items: Array<{
        medicationId?: number;
        customMedicationName?: string;
        dosageInstructions: string;
        duration: string;
      }>;
    },
  ) {
    const doctor = await this.doctorsService.getDoctorByUserId(user.id);
    return this.prescService.createPrescription({
      doctorId: doctor.id,
      patientId: body.patientId,
      recordId: body.recordId,
      items: body.items,
    });
  }

  @ApiOperation({ summary: 'Vérifier une ordonnance par son code QR (Public / Pharmacie)' })
  @Get('verify/:qrCodeHash')
  verifyByQr(@Param('qrCodeHash') qrCodeHash: string) {
    return this.prescService.findByQrHash(qrCodeHash);
  }

  @ApiOperation({ summary: 'Valider la délivrance en pharmacie' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('dispense/:qrCodeHash')
  dispense(@Param('qrCodeHash') qrCodeHash: string) {
    return this.prescService.markAsDispensed(qrCodeHash);
  }

  @ApiOperation({ summary: 'Mes ordonnances (Patient)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-prescriptions')
  async getMyPrescriptions(@CurrentUser() user: any) {
    const patient = await this.patientsService.getProfileByUserId(user.id);
    return this.prescService.getPatientPrescriptions(patient.id);
  }

  @ApiOperation({ summary: 'Détails d’une ordonnance' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.prescService.findOne(id);
  }
}
