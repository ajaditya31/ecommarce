import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemDto, UpdateItemDto, ApplyCouponDto } from './cart.dto';

@ApiTags('cart')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { status: 'OK', service: 'cart-service' };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiQuery({ name: 'userId', required: false })
  create(@Query('userId') userId?: string) {
    return this.cartService.createCart(userId);
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiResponse({ status: 404, description: 'Cart not found or expired' })
  findOne(@Param('cartId') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  @Post(':cartId/items')
  @ApiOperation({ summary: 'Add or update an item in the cart' })
  addItem(@Param('cartId') cartId: string, @Body() dto: AddItemDto) {
    return this.cartService.addItem(cartId, dto);
  }

  @Put(':cartId/items/:productId')
  @ApiOperation({ summary: 'Update item quantity (set to 0 to remove)' })
  updateItem(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(cartId, productId, dto);
  }

  @Delete(':cartId/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@Param('cartId') cartId: string, @Param('productId') productId: string) {
    return this.cartService.removeItem(cartId, productId);
  }

  @Patch(':cartId/coupon')
  @ApiOperation({ summary: 'Apply a coupon code to the cart' })
  applyCoupon(@Param('cartId') cartId: string, @Body() dto: ApplyCouponDto) {
    return this.cartService.applyCoupon(cartId, dto.couponCode);
  }

  @Get(':cartId/total')
  @ApiOperation({ summary: 'Get cart total (after discount)' })
  async getTotal(@Param('cartId') cartId: string) {
    const cart = await this.cartService.getCart(cartId);
    return { cartId, total: this.cartService.getTotal(cart), currency: 'USD' };
  }

  @Delete(':cartId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear / delete entire cart' })
  clear(@Param('cartId') cartId: string) {
    return this.cartService.clearCart(cartId);
  }
}
