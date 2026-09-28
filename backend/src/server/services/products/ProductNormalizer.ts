import { PROVIDERS, type ProviderConfig } from "../../config/providers";
import type { SerpApiShoppingResult } from "../serpapi/serpApiTypes";
import type { GroceryItem, ProductOffer } from "../../types/shopping";
import { matchProduct } from "./ProductMatcher";
import { parseDelivery } from "../pricing/DeliveryParser";
import { parseMoney } from "../../utils/parseMoney";
import { canonicalUnit, type Unit } from "../../utils/units";
import { parsePackSize } from "../../utils/parsePackSize";

function providerForSource(source: unknown, selected: string[]): ProviderConfig | null {
  if (typeof source !== "string") return null;
  const normalized = source.toLowerCase();
  return PROVIDERS.find((provider) => selected.includes(provider.id) && provider.aliases.some((alias) => normalized === alias || normalized.includes(alias))) ?? null;
}

export function normalizeOffers(item: GroceryItem, results: SerpApiShoppingResult[], selectedProviders: string[], demoData = false): ProductOffer[] {
  const dedupe = new Set<string>();
  const offers: ProductOffer[] = [];
  for (const result of results) {
    const provider = providerForSource(result.source, selectedProviders);
    if (!provider || typeof result.title !== "string") continue;
    const match = matchProduct(item, result.title);
    const price = parseMoney(result.extracted_price ?? result.price);
    const oldPrice = parseMoney(result.extracted_old_price ?? result.old_price);
    const delivery = parseDelivery(result.delivery);
    const pack = parsePackSize(result.title);
    const key = `${provider.id}|${result.product_id ?? result.title}|${price ?? ""}`;
    if (dedupe.has(key)) continue;
    dedupe.add(key);
    const discountAmount = oldPrice !== null && price !== null && oldPrice > price ? oldPrice - price : null;
    const discountPercent = discountAmount !== null && oldPrice ? Math.round((discountAmount / oldPrice) * 10000) / 100 : null;
    offers.push({
      id: `${item.id}_${provider.id}_${offers.length + 1}`,
      groceryItemId: item.id,
      providerId: provider.id,
      providerName: provider.displayName,
      title: result.title,
      price,
      currency: "INR",
      oldPrice,
      discountPercent,
      discountAmount,
      quantity: null,
      unit: null as Unit | null,
      normalizedUnitPrice: null,
      packQuantity: pack.quantity,
      packUnit: pack.unit,
      available: price !== null,
      deliveryText: delivery.text,
      deliveryFee: delivery.fee,
      rating: typeof result.rating === "number" && Number.isFinite(result.rating) ? result.rating : null,
      reviews: typeof result.reviews === "number" && Number.isFinite(result.reviews) ? result.reviews : null,
      productUrl: typeof result.product_link === "string" ? result.product_link : null,
      productId: typeof result.product_id === "string" ? result.product_id : null,
      sourceIcon: typeof result.source_icon === "string" ? result.source_icon : null,
      tags: typeof result.tag === "string" ? [result.tag] : [],
      badges: typeof result.badge === "string" ? [result.badge] : [],
      matchQuality: match.quality,
      matchScore: match.score,
      rawReference: { position: result.position },
      demoData
    });
    const offer = offers[offers.length - 1];
    offer.normalizedUnitPrice = price !== null && pack.quantity !== null && pack.quantity > 0 && pack.unit !== null ? Math.round((price / pack.quantity) * 100) / 100 : null;
  }
  return offers;
}
