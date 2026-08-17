import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive, MinLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Headphones', description: 'Product name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'High-quality wireless headphones with noise cancellation' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 99.99, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 'WH-1000XM5', description: 'Stock Keeping Unit' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 100, description: 'Available stock quantity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
