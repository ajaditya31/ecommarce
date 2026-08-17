import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { ApplySellerDto, ReviewSellerDto } from './seller.dto';
import { SellerStatus } from './seller.entity';

@ApiTags('sellers')
@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { status: 'OK', service: 'seller-service' };
  }

  @Post('apply')
  @ApiOperation({ summary: 'Submit a new seller application' })
  apply(@Body() dto: ApplySellerDto) {
    return this.sellerService.apply(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all sellers (admin)' })
  @ApiQuery({ name: 'status', enum: SellerStatus, required: false })
  findAll(@Query('status') status?: SellerStatus) {
    return this.sellerService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get seller profile' })
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get seller KYC status' })
  getStatus(@Param('id') id: string) {
    return this.sellerService.getStatus(id);
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Admin: approve, reject or flag for review' })
  review(@Param('id') id: string, @Body() dto: ReviewSellerDto) {
    return this.sellerService.review(id, dto);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Upload a KYC document URL for a seller' })
  addDocument(
    @Param('id') id: string,
    @Body() body: { type: string; url: string },
  ) {
    return this.sellerService.addDocument(id, body.type, body.url);
  }
}
