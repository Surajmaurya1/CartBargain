import type { Unit } from "../utils/units";

export type GroceryItem = {
  id: string;
  rawText: string;
  name: string;
  quantity: number | null;
  unit: Unit | null;
};

export type ProductOffer = {
  id: string;
  groceryItemId: string;
  providerId: string;
  providerName: string;
  title: string;
  price: number | null;
  currency: "INR";
  oldPrice: number | null;
  discountPercent: number | null;
  discountAmount: number | null;
  quantity: number | null;
  unit: Unit | null;
  normalizedUnitPrice: number | null;
  packQuantity: number | null;
  packUnit: Unit | null;
  available: boolean;
  deliveryText: string | null;
  deliveryFee: number | null;
  rating: number | null;
  reviews: number | null;
  productUrl: string | null;
  productId: string | null;
  sourceIcon: string | null;
  tags: string[];
  badges: string[];
  matchQuality: "exact" | "possible" | "rejected";
  matchScore: number;
  rawReference: { position?: number };
  demoData?: boolean;
};
