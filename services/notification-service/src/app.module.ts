import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationConsumer } from './notification.consumer';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationConsumer],
})
export class AppModule {}
