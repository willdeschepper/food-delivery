import { describe, expect, it } from 'vitest';

import { addItem, calculateCartTotals, changeItemQuantity } from './cart';
import type { MenuItem } from './models';

const burger: MenuItem = {
  id: 'burger',
  name: 'Burger',
  description: 'Test burger',
  category: 'Hambúrgueres',
  price: 24.9,
  emoji: '🍔',
  accent: '#fff',
};

describe('cart domain', () => {
  it('increments an existing item instead of duplicating its line', () => {
    const cart = addItem(addItem([], burger), burger);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('removes an item when its quantity reaches zero', () => {
    const cart = changeItemQuantity([{ item: burger, quantity: 1 }], burger.id, 0);

    expect(cart).toEqual([]);
  });

  it('applies delivery fee below the free-delivery threshold', () => {
    const totals = calculateCartTotals([{ item: burger, quantity: 1 }]);

    expect(totals).toEqual({ subtotal: 24.9, deliveryFee: 6.9, serviceFee: 2.49, total: 34.29 });
  });

  it('grants free delivery at the threshold', () => {
    const totals = calculateCartTotals([{ item: burger, quantity: 3 }]);

    expect(totals.deliveryFee).toBe(0);
    expect(totals.total).toBeCloseTo(77.19);
  });
});
