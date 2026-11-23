import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { TraceabilityService } from './traceability.service';

@Controller('traceability')
export class TraceabilityController {
  constructor(private readonly traceService: TraceabilityService) {}

  // --- REGISTRE DES DISPENSATIONS DE PSYCHOTROPES ET DRUGS (LOI 04-18) ---
  @Get('controlled-dispensations/stats')
  getControlledStats() {
    return this.traceService.getControlledDispensationsStats();
  }

  @Get('controlled-dispensations')
  getControlledDispensations(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('alertOnly') alertOnly?: string,
  ) {
    return this.traceService.getControlledDispensations(search, category, alertOnly);
  }

  @Put('controlled-dispensations/:id/status')
  updateControlledStatus(
    @Param('id') id: string,
    @Body() body: { status: 'VERIFIED' | 'SUSPECT' | 'UNDER_INVESTIGATION'; notes?: string },
  ) {
    return this.traceService.updateControlledDispensationStatus(id, body.status, body.notes);
  }

  @Get('verify/:query')
  verifyParam(@Param('query') query: string) {
    return this.traceService.verify(query);
  }

  @Get('verify')
  verifyQuery(@Query('query') query: string) {
    return this.traceService.verify(query);
  }

  @Get('batches')
  getAllBatches(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('coldChain') coldChain?: string,
  ) {
    return this.traceService.getAllBatches(search, status, coldChain);
  }

  @Get('recalls')
  getActiveRecalls() {
    return this.traceService.getActiveRecalls();
  }

  @Get('stats')
  getStats() {
    return this.traceService.getStats();
  }

  @Post('report')
  reportIssue(
    @Body()
    dto: {
      batchNumber: string;
      reporterName: string;
      reporterPhone: string;
      issueType: string;
      description: string;
    },
  ) {
    return this.traceService.reportIssue(dto);
  }
}
