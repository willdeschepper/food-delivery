export type MenuCategory = 'Combos' | 'Hambúrgueres' | 'Acompanhamentos' | 'Bebidas';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  emoji: string;
  accent: string;
  popular?: boolean;
};

export type CartLine = {
  item: MenuItem;
  quantity: number;
};

export type CartTotals = {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
};

export type PaymentMethod = 'card' | 'pix';

export type OrderStatus =
  | 'queued'
  | 'confirmed'
  | 'preparing'
  | 'on_the_way'
  | 'delivered';

export type DeliveryAddress = {
  label: string;
  street: string;
  complement: string;
};

export type Order = {
  id: string;
  idempotencyKey: string;
  lines: CartLine[];
  totals: CartTotals;
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};
