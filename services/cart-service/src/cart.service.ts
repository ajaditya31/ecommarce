import { Injectable, NotFoundException, BadRequestException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { AddItemDto, UpdateItemDto, Cart, CartItem } from './cart.dto';

const CART_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Simple coupon registry (replace with DB-backed table in production)
const COUPONS: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
  WELCOME5: 5,
};

@Injectable()
export class CartService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  private cartKey(cartId: string) {
    return `cart:${cartId}`;
  }

  private async getCartOrThrow(cartId: string): Promise<Cart> {
    const raw = await this.redis.get(this.cartKey(cartId));
    if (!raw) throw new NotFoundException(`Cart ${cartId} not found or expired`);
    return JSON.parse(raw) as Cart;
  }

  private async saveCart(cart: Cart): Promise<Cart> {
    cart.updatedAt = new Date().toISOString();
    await this.redis.set(this.cartKey(cart.cartId), JSON.stringify(cart), 'EX', CART_TTL_SECONDS);
    return cart;
  }

  async createCart(userId?: string): Promise<Cart> {
    const cart: Cart = {
      cartId: uuidv4(),
      userId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.saveCart(cart);
  }

  async getCart(cartId: string): Promise<Cart> {
    return this.getCartOrThrow(cartId);
  }

  async addItem(cartId: string, dto: AddItemDto): Promise<Cart> {
    const cart = await this.getCartOrThrow(cartId);
    const existing = cart.items.find(i => i.productId === dto.productId);
    if (existing) {
      existing.quantity += dto.quantity;
      existing.price = dto.price; // update to latest price
    } else {
      const item: CartItem = {
        productId: dto.productId,
        name: dto.name,
        quantity: dto.quantity,
        price: dto.price,
      };
      cart.items.push(item);
    }
    return this.saveCart(cart);
  }

  async updateItem(cartId: string, productId: string, dto: UpdateItemDto): Promise<Cart> {
    const cart = await this.getCartOrThrow(cartId);
    const idx = cart.items.findIndex(i => i.productId === productId);
    if (idx === -1) throw new NotFoundException(`Item ${productId} not in cart`);
    if (dto.quantity === 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = dto.quantity;
    }
    return this.saveCart(cart);
  }

  async removeItem(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.getCartOrThrow(cartId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    return this.saveCart(cart);
  }

  async applyCoupon(cartId: string, couponCode: string): Promise<Cart> {
    const discount = COUPONS[couponCode.toUpperCase()];
    if (!discount) throw new BadRequestException(`Invalid coupon code: ${couponCode}`);
    const cart = await this.getCartOrThrow(cartId);
    cart.couponCode = couponCode.toUpperCase();
    cart.discountPercent = discount;
    return this.saveCart(cart);
  }

  async clearCart(cartId: string): Promise<{ cleared: boolean }> {
    await this.redis.del(this.cartKey(cartId));
    return { cleared: true };
  }

  getTotal(cart: Cart): number {
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discount = cart.discountPercent ? subtotal * (cart.discountPercent / 100) : 0;
    return Math.round((subtotal - discount) * 100) / 100;
  }
}
