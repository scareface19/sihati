import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Urgences & Bouton SOS (زر الطوارئ)')
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @ApiOperation({ summary: 'Déclencher une alerte SOS immédiate (Patient)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('trigger')
  triggerSOS(
    @CurrentUser() user: any,
    @Body() coords: { latitude: number; longitude: number },
  ) {
    return this.emergencyService.handleSOSAlert(user.id, coords);
  }

  @ApiOperation({ summary: 'Fiche d’urgence publique (Accessible par QR code physique / Secouristes 14)' })
  @Get('public/:token')
  getPublicEmergencyData(@Param('token') token: string) {
    return this.emergencyService.getPublicProfileByToken(token);
  }
}
