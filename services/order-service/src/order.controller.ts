import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { status: 'OK', service: 'order-service' };
  }

  @Post()
  @ApiOperation({ summary: 'Place a new order — publishes order.placed to Kafka' })
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List orders (optionally filter by userId)' })
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.orderService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status — publishes order.status_changed to Kafka' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an order' })
  cancel(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }
}
