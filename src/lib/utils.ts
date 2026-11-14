import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `৳${new Intl.NumberFormat('en-IN').format(price)}`;
}

export function calculateDiscountPercentage(price: number, discountPrice?: number): number | null {
  if (!discountPrice || discountPrice >= price) return null;
  const savings = price - discountPrice;
  return Math.round((savings / price) * 100);
}
