export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  isLimited: boolean;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  subtotal: number;
  shipping: number;
  tax: number;
}

export interface CheckoutStep {
  step: 1 | 2 | 3 | 4;
  currentStep: 'information' | 'shipping' | 'payment' | 'confirmation';
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  createdAt: string;
  estimatedDelivery: string;
}
