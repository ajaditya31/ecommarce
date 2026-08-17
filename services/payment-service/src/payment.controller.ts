import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto, ConfirmPaymentDto, RefundPaymentDto } from './payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { status: 'OK', service: 'payment-service' };
  }

  @Post('intent')
  @ApiOperation({ summary: 'Create a payment intent (sandbox or live gateway)' })
  createIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentService.createIntent(dto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm / capture a payment' })
  confirm(@Param('id') id: string, @Body() dto: ConfirmPaymentDto) {
    return this.paymentService.confirmPayment(id, dto);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund a succeeded payment' })
  refund(@Param('id') id: string, @Body() dto: RefundPaymentDto) {
    return this.paymentService.refund(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get all payments for an order' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentService.findByOrder(orderId);
  }
}
