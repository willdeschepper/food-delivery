import type {
  CartLine,
  CartTotals,
  DeliveryAddress,
  Order,
  OrderStatus,
  PaymentMethod,
} from './models';

type CreateOrderInput = {
  lines: CartLine[];
  totals: CartTotals;
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  online: boolean;
  now?: Date;
  random?: () => number;
};

export function createOrder({
  lines,
  totals,
  address,
  paymentMethod,
  online,
  now = new Date(),
  random = Math.random,
}: CreateOrderInput): Order {
  const seed = `${now.getTime().toString(36)}${Math.floor(random() * 1_000_000).toString(36)}`;
  const timestamp = now.toISOString();

  return {
    id: `FD-${seed.slice(-8).toUpperCase()}`,
    idempotencyKey: `order-${seed}`,
    lines,
    totals,
    address,
    paymentMethod,
    status: online ? 'confirmed' : 'queued',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function synchronizeQueuedOrders(orders: Order[], now = new Date()): Order[] {
  const timestamp = now.toISOString();

  return orders.map(order =>
    order.status === 'queued'
      ? { ...order, status: 'confirmed' as const, updatedAt: timestamp }
      : order,
  );
}

export const orderSteps = [
  'confirmed',
  'preparing',
  'on_the_way',
  'delivered',
] as const satisfies readonly Exclude<OrderStatus, 'queued'>[];

export function orderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    queued: 'Aguardando conexão',
    confirmed: 'Pedido confirmado',
    preparing: 'Preparando seu pedido',
    on_the_way: 'Saiu para entrega',
    delivered: 'Pedido entregue',
  };

  return labels[status];
}
