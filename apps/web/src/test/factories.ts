// Factory pattern for test data
type UserRole = "CUSTOMER" | "ADMIN" | "EDITOR" | "STYLIST";

export function getMockUser(overrides?: Partial<User>): User {
  return {
    id: "user-123",
    email: "elena@voss.com",
    name: "Elena Voss",
    role: "CUSTOMER",
    avatar: null,
    createdAt: new Date("2026-01-01").toISOString(),
    ...overrides,
  };
}

export function getMockProduct(overrides?: Partial<Product>): Product {
  return {
    id: "prod-456",
    slug: "velvet-obsidian-blazer",
    name: "Velvet Obsidian Blazer",
    description:
      "Hand-tailored from the finest velvet, this blazer exemplifies understated luxury with its midnight obsidian hue.",
    price: 2450,
    compareAtPrice: 2800,
    currency: "USD",
    status: "ACTIVE",
    featured: true,
    images: [
      {
        url: "https://cdn.luxeverse.com/prod-456-1.jpg",
        altText: "Velvet Obsidian Blazer — front view",
        width: 1200,
        height: 1600,
      },
    ],
    ...overrides,
  };
}

export function getMockCartItem(overrides?: Partial<CartItem>): CartItem {
  return {
    id: "cart-item-789",
    productId: "prod-456",
    productName: "Velvet Obsidian Blazer",
    variantId: null,
    variantName: null,
    quantity: 1,
    unitPrice: 2450,
    totalPrice: 2450,
    imageUrl: "https://cdn.luxeverse.com/prod-456-1.jpg",
    ...overrides,
  };
}

// Types (inline for now, to be moved to shared types package in Phase 2)
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  avatar: string | null;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  status: string;
  featured: boolean;
  images: Array<{
    url: string;
    altText: string | null;
    width: number;
    height: number;
  }>;
}

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
