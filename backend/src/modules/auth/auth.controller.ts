import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Authentification & Administration Utilisateurs')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Inscription nouveau compte (Patient ou Médecin)' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Connexion par téléphone ou email' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Récupérer le profil connecté' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.id);
  }

  // --- ROUTES ADMINISTRATION COMPTES (Médecins, Citoyens, Pharmaciens) ---

  @ApiOperation({ summary: 'Liste de tous les utilisateurs pour l’administration' })
  @Get('admin/users')
  getAllUsers() {
    return this.authService.getAllUsersAdmin();
  }

  @ApiOperation({ summary: 'Activer / Suspendre un compte utilisateur (Admin)' })
  @Patch('admin/users/:id/toggle')
  toggleUser(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.authService.toggleUserActive(id, isActive);
  }

  @ApiOperation({ summary: 'Créer / Injecter un compte utilisateur (Admin)' })
  @Post('admin/users')
  createAdminUser(@Body() body: any) {
    return this.authService.createAdminUser(body);
  }

  @ApiOperation({ summary: 'Supprimer un utilisateur (Admin)' })
  @Delete('admin/users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteUser(id);
  }
}

