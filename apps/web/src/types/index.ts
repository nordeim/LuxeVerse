// === USER ===
export type UserRole = "CUSTOMER" | "ADMIN" | "EDITOR" | "STYLIST";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  avatar: string | null;
  createdAt: Date;
}

// === PRODUCT ===
export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  price: number | null;
  inventory: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  status: ProductStatus;
  featured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
}

// === PRODUCTS LIST (lightweight) ===
export interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  primaryImage: string | null;
  status: ProductStatus;
}

// === CART ===
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string | null;
}

export interface CartData {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  currency: string;
}

// === ORDER ===
export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  items: OrderItem[];
  createdAt: Date;
}

// === ADDRESS ===
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
