export type Category = 'All' | 'Clothing' | 'Accessories' | 'Footwear' | 'New Arrivals' | 'Sale';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  details: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
  badge?: 'New' | 'Best Seller' | 'Sale' | 'Featured';
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ShippingAddress {
  email: string;
  phone: string;
  emailOrPhone: string;
  emailNewsletters: boolean;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  saveInformation: boolean;
  textNewsletters: boolean;
}

export interface PaymentDetails {
  method: 'credit_card' | 'paypal' | 'apple_pay';
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  nameOnCard: string;
  sameBillingAddress: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: Currency;
  status: 'Processing' | 'Shipped' | 'Delivered';
  estimatedDelivery: string;
}

declare global {
  interface Window {
    mtrem?: any[];
    mtag?: (...args: any[]) => void;
  }
}

