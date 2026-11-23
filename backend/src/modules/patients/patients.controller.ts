import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PatientsService } from './patients.service';

@ApiTags('Gestion Patients & Dossier Médical')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({ summary: 'Obtenir mon profil médical complet' })
  @Get('me')
  getMyProfile(@CurrentUser() user: any) {
    return this.patientsService.getProfileByUserId(user.id);
  }

  @ApiOperation({ summary: 'Mettre à jour mon profil médical (allergies, maladies chroniques, poids...)' })
  @Put('me')
  updateMyProfile(@CurrentUser() user: any, @Body() data: any) {
    return this.patientsService.updateProfile(user.id, data);
  }

  @ApiOperation({ summary: 'Consulter mon dossier médical classé par spécialité' })
  @Get('me/records')
  async getMyRecords(
    @CurrentUser() user: any,
    @Query('specialty') specialty?: string,
  ) {
    const profile = await this.patientsService.getProfileByUserId(user.id);
    return this.patientsService.getRecords(profile.id, specialty);
  }

  @ApiOperation({ summary: 'Liste de mon automédication (العلاج الذاتي)' })
  @Get('me/self-medications')
  async getMySelfMeds(@CurrentUser() user: any) {
    const profile = await this.patientsService.getProfileByUserId(user.id);
    return this.patientsService.getSelfMedications(profile.id);
  }

  @ApiOperation({ summary: 'Ajouter une automédication (vitamines, herbes, OTC)' })
  @Post('me/self-medications')
  async addSelfMed(@CurrentUser() user: any, @Body() data: any) {
    const profile = await this.patientsService.getProfileByUserId(user.id);
    return this.patientsService.addSelfMedication(profile.id, data);
  }

  @ApiOperation({ summary: 'Liste des membres de ma famille (Compte Famille)' })
  @Get('me/family')
  async getFamily(@CurrentUser() user: any) {
    const profile = await this.patientsService.getProfileByUserId(user.id);
    return this.patientsService.getFamilyMembers(profile.id);
  }

  @ApiOperation({ summary: 'Ajouter un enfant ou un parent âgé au compte famille' })
  @Post('me/family')
  addFamilyMember(@CurrentUser() user: any, @Body() data: any) {
    return this.patientsService.addFamilyMember(user.id, data);
  }

  @ApiOperation({ summary: 'Ajouter un contact d’urgence SOS' })
  @Post('me/emergency-contacts')
  async addEmergencyContact(@CurrentUser() user: any, @Body() data: any) {
    const profile = await this.patientsService.getProfileByUserId(user.id);
    return this.patientsService.addEmergencyContact(profile.id, data);
  }

  @ApiOperation({ summary: 'Consulter mes analyses et radios téléversées' })
  @Get('me/documents')
  async getMyDocuments(@CurrentUser() user: any) {
    const profile = await this.patientsService.getProfileByUserId(user.id);
    return this.patientsService.getDocuments(profile.id);
  }

  @ApiOperation({ summary: 'Accès praticien à un patient spécifique (avec contrôle)' })
  @Get(':id')
  getPatientById(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.getPatientById(id);
  }
}
