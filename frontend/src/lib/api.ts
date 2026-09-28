export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export type ApiOffer = {
  id: string; groceryItemId: string; providerId: string; providerName: string; title: string;
  price: number | null; oldPrice: number | null; discountPercent: number | null; discountAmount: number | null;
  packQuantity: number | null; packUnit: string | null; available: boolean; deliveryText: string | null;
  deliveryFee: number | null; productUrl: string | null; productId: string | null; matchQuality: 'exact' | 'possible' | 'rejected';
  matchScore: number; tags: string[]; badges: string[]; demoData?: boolean;
};

export type ApiItem = { id: string; rawText: string; name: string; quantity: number | null; unit: string | null; status: string; offers: ApiOffer[] };
export type CompareResponse = { success: true; requestId: string; status: 'complete' | 'partial'; data: { location: { text: string; pinCode?: string }; items: ApiItem[]; providers: string[]; offers: ApiOffer[]; warnings: Array<{ code: string; message: string; itemId?: string }> } };
export type OptimizeResponse = { success: true; requestId: string; data: { strategy: string; recommendedBasket: { productTotal: number; knownFees: number; estimatedTotal: number; providerCount: number; savings: number | null; savingsBaseline: string | null } | null; orders: Array<{ providerId: string; providerName: string; items: Array<{ itemId: string; offerId: string; providerId: string; title: string; packs: number; lineTotal: number; overbuy: boolean }> }>; alternatives: Array<{ estimatedTotal: number; providerCount: number; providerIds: string[] }>; reasoning: { facts: string[]; tradeoffs: string[] }; warnings: Array<{ code: string; message: string }> } };
export type NearbyResponse = { success: true; requestId: string; data: import('../types').NearbyResult };

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json();
  if (!response.ok || payload.success === false) throw new Error(payload.error?.message ?? 'The backend request failed.');
  return payload as T;
}

export function compareCart(body: unknown) { return request<CompareResponse>('/api/compare', body); }
export function optimizeCart(body: unknown) { return request<OptimizeResponse>('/api/optimize', body); }
export function findNearbyOptions(body: unknown) { return request<NearbyResponse>('/api/nearby', body); }
