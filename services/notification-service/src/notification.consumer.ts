import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class NotificationConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationConsumer.name);
  private kafka: Kafka;
  private consumer: Consumer;

  // Topics to subscribe to
  private readonly TOPICS = [
    'order.placed',
    'order.status_changed',
  ];

  onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'notification-service',
      brokers: [(process.env.KAFKA_BROKER || 'kafka:9092')],
    });
    this.consumer = this.kafka.consumer({ groupId: 'notification-group' });
    this.startConsuming();
  }

  private async startConsuming() {
    try {
      await this.consumer.connect();
      for (const topic of this.TOPICS) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
      }
      await this.consumer.run({ eachMessage: (payload) => this.handleMessage(payload) });
      this.logger.log(`Subscribed to topics: ${this.TOPICS.join(', ')}`);
    } catch (err) {
      this.logger.warn(`Kafka not available, notification consumer offline: ${err.message}`);
    }
  }

  private async handleMessage({ topic, message }: EachMessagePayload): Promise<void> {
    try {
      const payload = JSON.parse(message.value?.toString() || '{}');
      this.logger.log(`[${topic}] received: ${JSON.stringify(payload)}`);

      switch (topic) {
        case 'order.placed':
          await this.sendOrderConfirmation(payload);
          break;
        case 'order.status_changed':
          await this.sendStatusUpdate(payload);
          break;
        default:
          this.logger.warn(`Unhandled topic: ${topic}`);
      }
    } catch (err) {
      this.logger.error(`Failed to process message from ${topic}: ${err.message}`);
    }
  }

  private async sendOrderConfirmation(payload: any): Promise<void> {
    // TODO: integrate real email provider (SendGrid, SES, etc.)
    this.logger.log(`[EMAIL] Order confirmation → userId:${payload.userId} orderId:${payload.orderId} total:${payload.total}`);
  }

  private async sendStatusUpdate(payload: any): Promise<void> {
    // TODO: integrate real email/SMS provider
    this.logger.log(`[EMAIL] Status update → orderId:${payload.orderId} ${payload.previousStatus} → ${payload.newStatus}`);
  }

  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
    } catch (_) { /* ignore on shutdown */ }
  }
}
