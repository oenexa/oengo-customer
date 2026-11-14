import { describe, it, expect } from 'vitest';
import { CustomerOrderService } from '../service/CustomerOrderService.js';

describe('OENGO Customer Application Service', () => {
  it('creates customer order with automated subtotal and delivery fee calculations', () => {
    const service = new CustomerOrderService();
    const order = service.createOrder({
      customerId: 'usr_cust_01',
      merchantId: 'mch_bistro_paris',
      items: [
        { id: 'itm_pizza', name: 'Artisan Truffle Pizza', price: 18.50, quantity: 2 },
        { id: 'itm_drink', name: 'Sparkling Mineral Water', price: 3.50, quantity: 2 },
      ],
      deliveryAddress: '14 Rue de Rivoli, Paris',
      paymentRail: 'ONXC_NATIVE',
    });

    // Subtotal: 37.00 + 7.00 = 44.00, Total with 2.50 fee = 46.50
    expect(order.subtotal).toBe(44.00);
    expect(order.total).toBe(46.50);
    expect(order.status).toBe('PLACED');
    expect(order.paymentRail).toBe('ONXC_NATIVE');
  });

  it('updates order lifecycle status cleanly', () => {
    const service = new CustomerOrderService();
    const order = service.createOrder({
      customerId: 'usr_cust_02',
      merchantId: 'mch_cafe_berlin',
      items: [{ id: 'itm_coffee', name: 'Flat White', price: 4.20, quantity: 1 }],
      deliveryAddress: 'Alexanderplatz 1, Berlin',
      paymentRail: 'SEPA_INSTANT',
    });

    const updated = service.updateStatus(order.id, 'PICKED_UP');
    expect(updated.status).toBe('PICKED_UP');
  });
});
