export type ProviderId = 'blinkit' | 'zepto' | 'instamart' | 'bbnow';

export interface ProviderMeta {
  id: ProviderId;
  name: string;
  tagline: string;
  badgeText?: string;
  isAvailableInLocation: boolean;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  handlingFee: number;
  estimatedTimeMin: number;
  estimatedTimeMax: number;
  brandColor?: string;
  brandBg?: string;
}

export type ItemIconType = 'wheat' | 'rice' | 'milk' | 'egg' | 'bread' | 'butter' | 'oil' | 'coffee' | 'package';

export interface GroceryItem {
  id: string;
  rawInput: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  iconType: ItemIconType;
}

export interface ProductOffer {
  provider: ProviderId;
  productId: string;
  title: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  unit: string;
  url: string;
  available: boolean;
  isCheapest?: boolean;
  isAlternative?: boolean;
}

export interface ComparisonRow {
  item: GroceryItem;
  offers: Record<ProviderId, ProductOffer | null>;
  lowestPrice: number | null;
  lowestProvider: ProviderId | null;
  priceSpread: number;
}

export interface ProviderSummary {
  provider: ProviderId;
  name: string;
  itemsFound: number;
  totalItems: number;
  itemTotal: number;
  deliveryFee: number | null;
  handlingFee: number | null;
  estimatedTotal: number;
  isCompleteBasket: boolean;
  missingItems: GroceryItem[];
  isCheapestOverall?: boolean;
}

export interface ProviderOrderItem {
  item: GroceryItem;
  offer: ProductOffer;
}

export interface ProviderOrder {
  provider: ProviderId;
  providerName: string;
  items: ProviderOrderItem[];
  subtotal: number;
  deliveryFee: number;
  handlingFee: number;
  total: number;
}

export type OptimizationStrategy =
  | 'split_lowest_cost'
  | 'lowest_product_price'
  | 'single_store_best'
  | 'minimize_delivery_fees'
  | 'nearby_cheaper';

export interface NearbyStoreResult {
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
  pricingStatus: 'unavailable';
}

export interface NearbyResult {
  type: 'nearby_cheaper';
  radiusKm: number;
  currentBestTotal: number | null;
  stores: NearbyStoreResult[];
  recommendation: null;
  pricingAvailable: false;
  minNearbySaving: number;
  message: string;
  warnings: Array<{ code: string; message: string }>;
}

export interface OptimizationResult {
  strategy: OptimizationStrategy;
  strategyTitle: string;
  strategyDescription: string;
  estimatedTotal: number;
  singleStoreBaselineTotal: number;
  savings: number;
  savingsPercent: number;
  providerCount: number;
  orders: ProviderOrder[];
  rationale: string[];
  coveragePercent: number;
}

export interface LocationDetails {
  city: string;
  locality: string;
  pinCode: string;
  formatted: string;
  latitude?: number;
  longitude?: number;
}

export type SearchEngineType = 'google_shopping' | 'quick_aggregator' | 'serp_direct';
