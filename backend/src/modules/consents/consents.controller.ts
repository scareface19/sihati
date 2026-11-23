import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsentsService } from './consents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DoctorsService } from '../doctors/doctors.service';

@ApiTags('Consentement et Accès Dossier (Loi 18-07)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consents')
export class ConsentsController {
  constructor(
    private readonly consentsService: ConsentsService,
    private readonly doctorsService: DoctorsService,
  ) {}

  @ApiOperation({ summary: 'Demander l’accès au dossier médical d’un patient (Médecin)' })
  @Post('request')
  async requestConsent(
    @CurrentUser() user: any,
    @Body() body: { patientId: number },
  ) {
    const doctor = await this.doctorsService.getDoctorByUserId(user.id);
    return this.consentsService.requestAccess(body.patientId, doctor.id);
  }

  @ApiOperation({ summary: 'Valider le code OTP fourni par le patient' })
  @Post('verify')
  async verifyConsent(
    @CurrentUser() user: any,
    @Body() body: { patientId: number; otpCode: string },
  ) {
    const doctor = await this.doctorsService.getDoctorByUserId(user.id);
    return this.consentsService.verifyOtp(body.patientId, doctor.id, body.otpCode);
  }

  @ApiOperation({ summary: 'Vérifier si l’accès est actuellement valide' })
  @Get('check')
  async checkConsent(
    @CurrentUser() user: any,
    @Query('patientId') patientId: string,
  ) {
    const doctor = await this.doctorsService.getDoctorByUserId(user.id);
    const hasAccess = await this.consentsService.hasActiveConsent(
      parseInt(patientId, 10),
      doctor.id,
    );
    return { hasAccess };
  }
}
