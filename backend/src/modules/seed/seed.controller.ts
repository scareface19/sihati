import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Initialisation & Données de Démonstration')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOperation({ summary: 'Peupler automatiquement la base de données MySQL' })
  @Get('init')
  runInit() {
    return this.seedService.runSeed();
  }

  @Post('init')
  runPostInit() {
    return this.seedService.runSeed();
  }
}
