import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ExaminationsService } from './examinations.service';

@ApiTags('Nomenclature Examens Médicaux & Imagerie')
@Controller('examinations')
export class ExaminationsController {
  constructor(private readonly examsService: ExaminationsService) {}

  @ApiOperation({ summary: 'Liste des examens médicaux (Radiologies, Scanners, IRM, etc.)' })
  @ApiQuery({ name: 'category', required: false })
  @Get()
  getAll(@Query('category') category?: string) {
    return this.examsService.getAll(category);
  }

  @ApiOperation({ summary: 'Détails d’un examen médical' })
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.getById(id);
  }

  @ApiOperation({ summary: 'Injecter / Ajouter un examen médical (Admin)' })
  @Post()
  create(@Body() body: any) {
    return this.examsService.create(body);
  }

  @ApiOperation({ summary: 'Modifier un examen médical (Admin)' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.examsService.update(id, body);
  }

  @ApiOperation({ summary: 'Supprimer un examen du catalogue (Admin)' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.delete(id);
  }
}
