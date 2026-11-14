export type DeliveryStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'CANCELLED';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  merchantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentRail: 'ONXC_NATIVE' | 'SEPA_INSTANT';
  deliveryAddress: string;
  status: DeliveryStatus;
  createdAt: string;
}
