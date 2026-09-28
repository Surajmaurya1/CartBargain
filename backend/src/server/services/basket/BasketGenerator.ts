import type { GroceryItem, ProductOffer } from "../../types/shopping";
import type { BasketCandidate, BasketLine } from "../../types/optimization";

function coverage(item: GroceryItem, offer: ProductOffer, allowOverbuy: boolean): { packs: number; overbuy: boolean } | null {
  if (!offer.available || offer.price === null || offer.matchQuality === "rejected") return null;
  if (offer.matchQuality === "possible") return null;
  if (item.quantity === null || item.unit === null) return { packs: 1, overbuy: false };
  if (offer.packQuantity === null || offer.packUnit !== item.unit) return null;
  if (offer.packQuantity >= item.quantity && !allowOverbuy) return offer.packQuantity === item.quantity ? { packs: 1, overbuy: false } : null;
  const packs = Math.ceil(item.quantity / offer.packQuantity);
  const overbuy = packs * offer.packQuantity > item.quantity;
  return overbuy && !allowOverbuy ? null : { packs, overbuy };
}

export function generateCandidates(items: GroceryItem[], offers: ProductOffer[], allowSubstitutes: boolean, allowOverbuy: boolean): BasketCandidate[] {
  const choices = items.map((item) => offers.filter((offer) => offer.groceryItemId === item.id && (allowSubstitutes || offer.matchQuality === "exact")).map((offer) => ({ offer, coverage: coverage(item, offer, allowOverbuy) })).filter((entry): entry is { offer: ProductOffer; coverage: { packs: number; overbuy: boolean } } => entry.coverage !== null));
  if (choices.some((choice) => choice.length === 0)) return [];
  const candidates: BasketCandidate[] = [];
  const visit = (index: number, lines: BasketLine[]) => {
    if (index === choices.length) {
      const providerIds = [...new Set(lines.map((line) => line.providerId))].sort();
      const productTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
      const fees = lines.map((line) => offers.find((offer) => offer.id === line.offerId)?.deliveryFee ?? null);
      const knownFees = fees.reduce<number>((sum, fee) => sum + (fee ?? 0), 0);
      const discountTotal = lines.reduce((sum, line) => sum + (offers.find((offer) => offer.id === line.offerId)?.discountAmount ?? 0), 0);
      candidates.push({ lines, productTotal, knownFees, estimatedTotal: productTotal + knownFees, providerIds, exactMatches: lines.length, unknownFees: fees.filter((fee) => fee === null).length, discountTotal });
      return;
    }
    for (const choice of choices[index]) {
      const line: BasketLine = { itemId: choice.offer.groceryItemId, offerId: choice.offer.id, providerId: choice.offer.providerId, title: choice.offer.title, packs: choice.coverage.packs, lineTotal: choice.offer.price! * choice.coverage.packs, overbuy: choice.coverage.overbuy };
      visit(index + 1, [...lines, line]);
    }
  };
  visit(0, []);
  return candidates;
}
