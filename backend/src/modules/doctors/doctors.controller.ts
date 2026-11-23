import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Médecins & Annuaire Médical')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @ApiOperation({ summary: 'Rechercher des médecins par Wilaya, Commune, Spécialité' })
  @ApiQuery({ name: 'wilaya', required: false })
  @ApiQuery({ name: 'commune', required: false })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'query', required: false })
  @Get('search')
  search(
    @Query('wilaya') wilaya?: string,
    @Query('commune') commune?: string,
    @Query('specialty') specialty?: string,
    @Query('query') query?: string,
  ) {
    return this.doctorsService.searchDoctors({ wilaya, commune, specialty, query });
  }

  @ApiOperation({ summary: 'Liste de tous les praticiens pour l’administration' })
  @Get('admin/all')
  getAllAdmin() {
    return this.doctorsService.getAllForAdmin();
  }

  @ApiOperation({ summary: 'Dashboard du médecin connecté (Statistiques et RDV du jour)' })
  @UseGuards(JwtAuthGuard)
  @Get('dashboard/me')
  async getMyDashboard(@CurrentUser() user: any) {
    const doctor = await this.doctorsService.getDoctorByUserId(user.id);
    return this.doctorsService.getDashboardStats(doctor.id);
  }

  @ApiOperation({ summary: 'Injecter / Ajouter un praticien (Admin)' })
  @Post()
  create(@Body() body: any) {
    return this.doctorsService.createDoctor(body);
  }

  @ApiOperation({ summary: 'Valider / Révoquer l’agrément d’un médecin (Admin)' })
  @Patch(':id/verify')
  verifyDoctor(
    @Param('id', ParseIntPipe) id: number,
    @Body('isVerified') isVerified: boolean,
  ) {
    return this.doctorsService.verifyDoctor(id, isVerified);
  }

  @ApiOperation({ summary: 'Modifier les informations d’un médecin (Admin)' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.doctorsService.updateDoctor(id, body);
  }

  @ApiOperation({ summary: 'Supprimer / Révoquer un médecin (Admin)' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.deleteDoctor(id);
  }

  @ApiOperation({ summary: 'Détails d’un médecin' })
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.getDoctorById(id);
  }
}
