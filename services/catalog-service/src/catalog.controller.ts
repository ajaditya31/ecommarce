import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for catalog-service' })
  healthCheck() {
    return { status: 'OK', service: 'catalog-service' };
  }

  @Get()
  @ApiOperation({ summary: 'Hello world entry point' })
  getHello(): string {
    return this.catalogService.getHello();
  }
}
