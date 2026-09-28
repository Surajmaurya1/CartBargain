import type { GroceryItem, ProductOffer } from "./shopping";

export type NearbyLocation = { text: string; pinCode?: string; latitude?: number; longitude?: number };
export type NearbyRequest = { location: NearbyLocation; radiusKm: number; items: GroceryItem[]; offers: ProductOffer[] };
export type NearbyStore = {
  name: string;
  address: string | null;
  placeId: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceKm: number | null;
  rating: number | null;
  reviews: number | null;
  hours: string | null;
  url: string | null;
  pricingStatus: "unavailable";
};
