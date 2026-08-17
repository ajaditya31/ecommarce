import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';

export class AddItemDto {
  @ApiProperty({ example: 'prod-42', description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity to add' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 29.99, description: 'Unit price at time of adding' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 'Wireless Headphones' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateItemDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class ApplyCouponDto {
  @ApiProperty({ example: 'SAVE10' })
  @IsString()
  couponCode: string;
}

export interface CartItem {
  productId: string;
  name?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  cartId: string;
  userId?: string;
  items: CartItem[];
  couponCode?: string;
  discountPercent?: number;
  createdAt: string;
  updatedAt: string;
}
