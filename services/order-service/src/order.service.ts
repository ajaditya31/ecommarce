import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { KafkaProducer } from './kafka.producer';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly kafka: KafkaProducer,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    // Idempotency check — prevent duplicate orders
    if (dto.idempotencyKey) {
      const existing = await this.orderRepo.findOne({ where: { idempotencyKey: dto.idempotencyKey } });
      if (existing) throw new ConflictException(`Order with idempotency key already exists: ${existing.id}`);
    }

    const subtotal = dto.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const discount = 0; // Coupon logic can expand here
    const total = Math.round((subtotal - discount) * 100) / 100;

    const order = this.orderRepo.create({
      ...dto,
      subtotal,
      discount,
      total,
      status: OrderStatus.PENDING,
    });

    const saved = await this.orderRepo.save(order);

    // Publish order.placed event to Kafka
    await this.kafka.emit('order.placed', saved.id, {
      orderId: saved.id,
      userId: saved.userId,
      total: saved.total,
      items: saved.items,
      status: saved.status,
      placedAt: saved.createdAt,
    });

    return saved;
  }

  async findAll(userId?: string): Promise<Order[]> {
    if (userId) {
      return this.orderRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    const previousStatus = order.status;
    order.status = dto.status;
    const saved = await this.orderRepo.save(order);

    // Publish status change event
    await this.kafka.emit('order.status_changed', id, {
      orderId: id,
      previousStatus,
      newStatus: dto.status,
      updatedAt: saved.updatedAt,
    });

    return saved;
  }

  async cancel(id: string): Promise<Order> {
    return this.updateStatus(id, { status: OrderStatus.CANCELLED });
  }
}
