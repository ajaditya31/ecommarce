import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { KafkaProducer } from './kafka.producer';
import { Order } from './order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'admin',
      database: process.env.DB_NAME || 'ecommerce',
      entities: [Order],
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrderService, KafkaProducer],
})
export class AppModule {}
