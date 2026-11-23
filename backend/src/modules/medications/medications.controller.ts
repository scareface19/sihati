import { Controller, Get, Post, Put, Delete, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';

@ApiTags('Nomenclature Médicaments Algérie 2025')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @ApiOperation({ summary: 'Recherche rapide par DCI ou Nom de Marque' })
  @ApiQuery({ name: 'q', required: false, description: 'Terme de recherche (ex: Dolyc, Paracétamol, Artiz)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre max de résultats' })
  @Get('search')
  search(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
  ) {
    const lim = limit ? parseInt(limit, 10) : 25;
    return this.medicationsService.search(q || '', lim);
  }

  @ApiOperation({ summary: 'Nombre total de médicaments enregistrés' })
  @Get('stats/count')
  getCount() {
    return this.medicationsService.countTotal();
  }

  @ApiOperation({ summary: 'Recherche des équivalents génériques par DCI' })
  @Get('generics/:dci')
  getGenerics(@Param('dci') dci: string) {
    return this.medicationsService.findGenerics(dci);
  }

  @ApiOperation({ summary: 'Détails d’un médicament par son ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Injecter / Ajouter un médicament (Admin)' })
  @Post()
  create(@Body() body: any) {
    return this.medicationsService.create(body);
  }

  @ApiOperation({ summary: 'Modifier un médicament (Admin)' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.medicationsService.update(id, body);
  }

  @ApiOperation({ summary: 'Supprimer un médicament du catalogue (Admin)' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.delete(id);
  }
}
