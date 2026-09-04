import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { addItem, calculateCartTotals, changeItemQuantity } from '@/src/domain/cart';
import { createOrder, synchronizeQueuedOrders } from '@/src/domain/order';
import type {
  CartLine,
  DeliveryAddress,
  MenuItem,
  Order,
  OrderStatus,
  PaymentMethod,
} from '@/src/domain/models';

type DeliveryState = {
  cart: CartLine[];
  orders: Order[];
  online: boolean;
  hydrated: boolean;
  addToCart: (item: MenuItem) => void;
  changeQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setOnline: (online: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  placeOrder: (address: DeliveryAddress, paymentMethod: PaymentMethod) => Order;
  synchronize: () => void;
  advanceOrder: (orderId: string, status: OrderStatus) => void;
};

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      online: true,
      hydrated: false,
      addToCart: item => set(state => ({ cart: addItem(state.cart, item) })),
      changeQuantity: (itemId, quantity) =>
        set(state => ({ cart: changeItemQuantity(state.cart, itemId, quantity) })),
      clearCart: () => set({ cart: [] }),
      setOnline: online => set({ online }),
      setHydrated: hydrated => set({ hydrated }),
      placeOrder: (address, paymentMethod) => {
        const { cart, online } = get();
        const order = createOrder({
          lines: cart,
          totals: calculateCartTotals(cart),
          address,
          paymentMethod,
          online,
        });

        set(state => ({ cart: [], orders: [order, ...state.orders] }));
        return order;
      },
      synchronize: () => set(state => ({ orders: synchronizeQueuedOrders(state.orders) })),
      advanceOrder: (orderId, status) =>
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order,
          ),
        })),
    }),
    {
      name: 'food-delivery-state',
      storage: createJSONStorage(() => Storage),
      partialize: state => ({ cart: state.cart, orders: state.orders }),
      onRehydrateStorage: () => state => state?.setHydrated(true),
    },
  ),
);
