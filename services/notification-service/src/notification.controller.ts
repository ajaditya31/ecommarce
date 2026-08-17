import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { status: 'OK', service: 'notification-service' };
  }
}
