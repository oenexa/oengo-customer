import crypto from 'node:crypto';
import type { CustomerOrder, CartItem, DeliveryStatus } from '../domain/types.js';

export class CustomerOrderService {
  private orders = new Map<string, CustomerOrder>();

  public createOrder(params: {
    customerId: string;
    merchantId: string;
    items: CartItem[];
    deliveryAddress: string;
    paymentRail: 'ONXC_NATIVE' | 'SEPA_INSTANT';
  }): CustomerOrder {
    if (params.items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }

    const subtotal = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2.50;
    const total = parseFloat((subtotal + deliveryFee).toFixed(2));

    const orderId = `ord_oengo_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const order: CustomerOrder = {
      id: orderId,
      customerId: params.customerId,
      merchantId: params.merchantId,
      items: params.items,
      subtotal,
      deliveryFee,
      total,
      paymentRail: params.paymentRail,
      deliveryAddress: params.deliveryAddress,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
    };

    this.orders.set(order.id, order);
    return order;
  }

  public updateStatus(orderId: string, status: DeliveryStatus): CustomerOrder {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order '${orderId}' not found.`);
    order.status = status;
    return order;
  }

  public getOrder(orderId: string): CustomerOrder | undefined {
    return this.orders.get(orderId);
  }
}
