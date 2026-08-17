import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from './order.entity';

export class OrderItemDto {
  @ApiProperty({ example: 'prod-42' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'user-123' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: 'cart-uuid-here' })
  @IsOptional()
  @IsString()
  cartId?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ example: 'SAVE10' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ example: '123 Main St, New York, NY' })
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional({ example: 'unique-key-to-prevent-duplicates' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;
}
