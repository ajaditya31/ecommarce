import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { SellerStatus } from './seller.entity';

export class ApplySellerDto {
  @ApiProperty({ example: 'Acme Electronics' })
  @IsString()
  businessName: string;

  @ApiProperty({ example: 'seller@acme.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1-555-000-0000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'US12-3456789', description: 'Tax / GST / VAT ID' })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ example: '123 Commerce St, New York, NY' })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiPropertyOptional({ example: 'llc', enum: ['sole_proprietor', 'llc', 'corporation', 'partnership'] })
  @IsOptional()
  @IsString()
  businessType?: string;
}

export class ReviewSellerDto {
  @ApiProperty({ enum: [SellerStatus.APPROVED, SellerStatus.REJECTED, SellerStatus.UNDER_REVIEW] })
  @IsEnum(SellerStatus)
  status: SellerStatus;

  @ApiPropertyOptional({ example: 'Documents incomplete' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({ example: 'admin-user-id' })
  @IsOptional()
  @IsString()
  reviewedBy?: string;
}
