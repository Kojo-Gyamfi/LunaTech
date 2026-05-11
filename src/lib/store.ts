'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, CustomerInfo, ShippingAddress, PaymentInfo } from '@/types';

export interface CheckoutState {
  customerInfo: CustomerInfo | null;
  shippingAddress: ShippingAddress | null;
  paymentInfo: PaymentInfo | null;
}

export interface CartStore {
  items: CartItem[];
  checkoutState: CheckoutState;

  // Cart actions
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Checkout actions
  setCustomerInfo: (info: CustomerInfo) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  resetCheckout: () => void;

  // Getters
  getCartTotal: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getItemCount: () => number;
}

const SHIPPING_COST = 50;
const TAX_RATE = 0.08;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutState: {
        customerInfo: null,
        shippingAddress: null,
        paymentInfo: null,
      },

      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setCustomerInfo: (info: CustomerInfo) => {
        set((state) => ({
          checkoutState: { ...state.checkoutState, customerInfo: info },
        }));
      },

      setShippingAddress: (address: ShippingAddress) => {
        set((state) => ({
          checkoutState: { ...state.checkoutState, shippingAddress: address },
        }));
      },

      setPaymentInfo: (info: PaymentInfo) => {
        set((state) => ({
          checkoutState: { ...state.checkoutState, paymentInfo: info },
        }));
      },

      resetCheckout: () => {
        set({
          checkoutState: {
            customerInfo: null,
            shippingAddress: null,
            paymentInfo: null,
          },
        });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getShipping: () => {
        return get().items.length > 0 ? SHIPPING_COST : 0;
      },

      getTax: () => {
        return Math.round(get().getSubtotal() * TAX_RATE * 100) / 100;
      },

      getCartTotal: () => {
        return (
          get().getSubtotal() + get().getShipping() + get().getTax()
        );
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'luna-tech-cart',
    }
  )
);
