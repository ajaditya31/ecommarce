import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentGateway } from './payment.entity';
import { CreatePaymentIntentDto, ConfirmPaymentDto, RefundPaymentDto } from './payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  /**
   * Creates a payment intent.
   * In sandbox mode (default for dev) it skips the real gateway and returns a mock response.
   * In production, plug in real Stripe/Razorpay SDK calls here.
   */
  async createIntent(dto: CreatePaymentIntentDto): Promise<Payment> {
    const gateway = dto.gateway ?? PaymentGateway.SANDBOX;
    const isSandbox = dto.sandboxMode ?? (gateway === PaymentGateway.SANDBOX);

    let gatewayPaymentId: string;
    let gatewayClientSecret: string;

    if (isSandbox || gateway === PaymentGateway.SANDBOX) {
      // Sandbox: return mock IDs — no real money moved
      gatewayPaymentId = `sandbox_pi_${Date.now()}`;
      gatewayClientSecret = `sandbox_secret_${Date.now()}`;
      this.logger.log(`[SANDBOX] Payment intent created for order ${dto.orderId}`);
    } else if (gateway === PaymentGateway.STRIPE) {
      // TODO: Replace with real Stripe SDK call
      // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      // const intent = await stripe.paymentIntents.create({ amount: dto.amount * 100, currency: dto.currency });
      // gatewayPaymentId = intent.id;
      // gatewayClientSecret = intent.client_secret;
      throw new BadRequestException('Stripe live mode not configured yet — use sandboxMode: true');
    } else if (gateway === PaymentGateway.RAZORPAY) {
      // TODO: Replace with real Razorpay SDK call
      throw new BadRequestException('Razorpay live mode not configured yet — use sandboxMode: true');
    }

    const payment = this.paymentRepo.create({
      orderId: dto.orderId,
      userId: dto.userId,
      amount: dto.amount,
      currency: dto.currency ?? 'USD',
      gateway,
      sandboxMode: isSandbox,
      gatewayPaymentId,
      gatewayClientSecret,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepo.save(payment);
  }

  async confirmPayment(paymentId: string, dto: ConfirmPaymentDto): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(`Payment is already in status: ${payment.status}`);
    }

    payment.status = PaymentStatus.PROCESSING;
    await this.paymentRepo.save(payment);

    if (payment.sandboxMode) {
      // Sandbox: auto-succeed
      payment.status = PaymentStatus.SUCCEEDED;
      this.logger.log(`[SANDBOX] Payment ${paymentId} confirmed successfully`);
    } else {
      // TODO: call gateway confirmation API
      payment.status = PaymentStatus.SUCCEEDED;
    }

    return this.paymentRepo.save(payment);
  }

  async refund(paymentId: string, dto: RefundPaymentDto): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException(`Cannot refund payment with status: ${payment.status}`);
    }

    if (payment.sandboxMode) {
      this.logger.log(`[SANDBOX] Refund processed for payment ${paymentId}`);
    }
    // TODO: call gateway refund API for live payments

    payment.status = PaymentStatus.REFUNDED;
    return this.paymentRepo.save(payment);
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException(`Payment ${id} not found`);
    return payment;
  }

  async findByOrder(orderId: string): Promise<Payment[]> {
    return this.paymentRepo.find({ where: { orderId }, order: { createdAt: 'DESC' } });
  }
}
