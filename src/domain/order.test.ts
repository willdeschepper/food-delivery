import { describe, expect, it } from 'vitest';

import { createOrder, synchronizeQueuedOrders } from './order';
import type { MenuItem } from './models';

const item: MenuItem = {
  id: 'combo',
  name: 'Combo',
  description: 'Test combo',
  category: 'Combos',
  price: 40,
  emoji: '🥤',
  accent: '#fff',
};

const input = {
  lines: [{ item, quantity: 1 }],
  totals: { subtotal: 40, deliveryFee: 6.9, serviceFee: 2.49, total: 49.39 },
  address: { label: 'Casa', street: 'Rua A, 1', complement: 'Centro' },
  paymentMethod: 'card' as const,
  now: new Date('2026-09-04T12:00:00.000Z'),
  random: () => 0.42,
};

describe('order domain', () => {
  it('queues an offline order with a stable idempotency key', () => {
    const order = createOrder({ ...input, online: false });
    const retriedOrder = createOrder({ ...input, online: false });

    expect(order.status).toBe('queued');
    expect(order.idempotencyKey).toMatch(/^order-/);
    expect(retriedOrder.idempotencyKey).toBe(order.idempotencyKey);
  });

  it('confirms an online order immediately', () => {
    const order = createOrder({ ...input, online: true });

    expect(order.status).toBe('confirmed');
  });

  it('synchronizes only queued orders and preserves their identity', () => {
    const queued = createOrder({ ...input, online: false });
    const synchronized = synchronizeQueuedOrders([queued], new Date('2026-09-04T12:01:00.000Z'));

    expect(synchronized[0].status).toBe('confirmed');
    expect(synchronized[0].id).toBe(queued.id);
    expect(synchronized[0].idempotencyKey).toBe(queued.idempotencyKey);
  });
});
