import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PaymentGateway } from './payment.entity';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 'order-uuid-here' })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({ example: 'user-123' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: PaymentGateway, default: PaymentGateway.SANDBOX })
  @IsOptional()
  @IsEnum(PaymentGateway)
  gateway?: PaymentGateway;

  @ApiPropertyOptional({ example: false, description: 'Force sandbox mode regardless of gateway' })
  @IsOptional()
  @IsBoolean()
  sandboxMode?: boolean;
}

export class ConfirmPaymentDto {
  @ApiPropertyOptional({ example: 'pi_stripe_payment_method_id' })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}

export class RefundPaymentDto {
  @ApiPropertyOptional({ example: 'Customer requested refund' })
  @IsOptional()
  @IsString()
  reason?: string;
}
