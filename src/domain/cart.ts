import type { CartLine, CartTotals, MenuItem } from './models';

export const FREE_DELIVERY_THRESHOLD = 50;
export const DELIVERY_FEE = 6.9;
export const SERVICE_FEE = 2.49;

export function addItem(lines: CartLine[], item: MenuItem): CartLine[] {
  const existing = lines.find(line => line.item.id === item.id);

  if (!existing) {
    return [...lines, { item, quantity: 1 }];
  }

  return lines.map(line =>
    line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
  );
}

export function changeItemQuantity(
  lines: CartLine[],
  itemId: string,
  quantity: number,
): CartLine[] {
  if (quantity <= 0) {
    return lines.filter(line => line.item.id !== itemId);
  }

  return lines.map(line => (line.item.id === itemId ? { ...line, quantity } : line));
}

export function calculateCartTotals(lines: CartLine[]): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const serviceFee = subtotal === 0 ? 0 : SERVICE_FEE;

  return {
    subtotal,
    deliveryFee,
    serviceFee,
    total: subtotal + deliveryFee + serviceFee,
  };
}

export function countCartItems(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
