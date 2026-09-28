export type SerpApiShoppingResult = {
  position?: number;
  title?: string;
  product_id?: string;
  product_link?: string;
  source?: string;
  source_icon?: string;
  price?: string;
  extracted_price?: number;
  old_price?: string;
  extracted_old_price?: number;
  delivery?: string;
  rating?: number;
  reviews?: number;
  tag?: string;
  badge?: string;
  snippet?: string;
  [key: string]: unknown;
};

export type SerpApiLocalResult = {
  position?: number;
  title?: string;
  address?: string;
  place_id?: string;
  rating?: number;
  reviews?: number;
  hours?: string;
  phone?: string;
  link?: string;
  website?: string;
  gps_coordinates?: { latitude?: number; longitude?: number };
  [key: string]: unknown;
};

export type SerpApiResponse = {
  search_metadata?: Record<string, unknown>;
  search_parameters?: Record<string, unknown>;
  shopping_results?: unknown;
  error?: string;
  [key: string]: unknown;
};

export type ParsedSerpApiResponse = {
  metadata: Record<string, unknown> | null;
  parameters: Record<string, unknown> | null;
  shoppingResults: SerpApiShoppingResult[];
  localResults: SerpApiLocalResult[];
};
