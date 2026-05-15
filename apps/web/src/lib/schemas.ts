import { z } from "zod";

// === AUTH ===
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters."),
  confirmPassword: z.string().min(8, "Password confirmation is required."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

// === ADDRESS (flat, matches FormData) ===
export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  line1: z.string().min(5, "Address line must be at least 5 characters."),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State/Province is required."),
  postalCode: z.string().min(1, "Postal code is required."), // Looser for international
  country: z.string().min(2, "Country is required."),
});

// === CHECKOUT (flat, matches FormData from multi-step form) ===
export const checkoutSchema = z.object({
  // Shipping (flat fields assembled from form)
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  line1: z.string().min(5, "Address line is required."),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
  // Contact
  email: z.string().email("Valid email is required."),
  // Options
  saveAddress: z.boolean().optional(),
  createAccount: z.boolean().optional(),
});

// === CART ===
export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().positive().default(1),
});

export const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable().optional(),
  quantity: z.number().int().positive().default(1),
});

// === Type exports ===
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
