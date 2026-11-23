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
  ParseIntPipe,
} from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // --- STATS ---
  @Get('stats')
  getStats() {
    return this.pharmacyService.getStats();
  }

  // --- PROFILE ---
  @Get('profile')
  getProfile() {
    return this.pharmacyService.getProfile();
  }

  @Put('profile')
  updateProfile(@Body() body: any) {
    return this.pharmacyService.updateProfile(body);
  }

  // --- STOCKS ---
  @Get('stocks')
  getStocks(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.pharmacyService.getStocks(search, status);
  }

  @Post('stocks')
  addStockItem(@Body() body: any) {
    return this.pharmacyService.addStockItem(body);
  }

  @Put('stocks/:id')
  updateStockItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.pharmacyService.updateStockItem(id, body);
  }

  @Patch('stocks/:id/adjust')
  adjustStockQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body('delta') delta: number,
  ) {
    return this.pharmacyService.adjustStockQuantity(id, Number(delta) || 0);
  }

  @Delete('stocks/:id')
  deleteStockItem(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyService.deleteStockItem(id);
  }

  // --- ORDERS ---
  @Get('orders')
  getOrders(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.pharmacyService.getOrders(search, status);
  }

  @Get('orders/:id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyService.getOrderById(id);
  }

  @Post('orders')
  createOrder(@Body() body: any) {
    return this.pharmacyService.createOrder(body);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: any,
  ) {
    return this.pharmacyService.updateOrderStatus(id, status);
  }

  @Delete('orders/:id')
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.pharmacyService.deleteOrder(id);
  }
}
