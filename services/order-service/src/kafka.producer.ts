import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducer.name);
  private kafka: Kafka;
  private producer: Producer;
  private connected = false;

  onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'order-service',
      brokers: [(process.env.KAFKA_BROKER || 'kafka:9092')],
    });
    this.producer = this.kafka.producer();
    this.connect();
  }

  private async connect() {
    try {
      await this.producer.connect();
      this.connected = true;
      this.logger.log('Kafka producer connected');
    } catch (err) {
      this.logger.warn(`Kafka not available, events will be skipped: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.connected) await this.producer.disconnect();
  }

  async emit(topic: string, key: string, value: object): Promise<void> {
    if (!this.connected) {
      this.logger.warn(`Kafka offline — skipping event ${topic}:${key}`);
      return;
    }
    try {
      await this.producer.send({
        topic,
        messages: [{ key, value: JSON.stringify(value) }],
      });
      this.logger.log(`Event published → ${topic} [key=${key}]`);
    } catch (err) {
      this.logger.error(`Failed to publish event: ${err.message}`);
    }
  }
}
