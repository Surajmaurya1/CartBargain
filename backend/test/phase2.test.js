const test = require("node:test");
const assert = require("node:assert/strict");

const { parseSerpApiResponse } = require("../dist/server/services/serpapi/serpApiParser.js");
const { SerpApiClient } = require("../dist/server/services/serpapi/SerpApiClient.js");
const { validateCompareRequest } = require("../dist/server/validation/compareSchemas.js");
const { AppError } = require("../dist/server/errors/AppError.js");
const { parseDelivery } = require("../dist/server/services/pricing/DeliveryParser.js");
const { parsePackSize } = require("../dist/server/utils/parsePackSize.js");
const { optimize } = require("../dist/server/services/optimizer/Optimizer.js");
const { RateLimiter } = require("../dist/server/services/reliability/RateLimiter.js");
const { haversineDistanceKm } = require("../dist/server/services/nearby/NearbyCheaperService.js");
const { validateNearbyRequest } = require("../dist/server/validation/nearbySchemas.js");

test("parser tolerates optional shopping fields and keeps valid entries", () => {
  const result = parseSerpApiResponse({
    search_metadata: { id: "x" },
    shopping_results: [{ title: "Rice", source: "Blinkit" }, null, "bad"]
  });
  assert.equal(result.shoppingResults.length, 1);
  assert.equal(result.shoppingResults[0].title, "Rice");
});

test("parser rejects malformed top-level responses", () => {
  assert.throws(() => parseSerpApiResponse(null), (error) => error instanceof AppError && error.code === "SERPAPI_BAD_RESPONSE");
});

test("compare validation rejects unknown providers and accepts canonical request shape", () => {
  assert.throws(() => validateCompareRequest({ location: { text: "Bengaluru" }, items: [{ name: "rice" }], providers: ["amazon"] }), /supported/);
  const request = validateCompareRequest({ location: { text: "Bengaluru", pinCode: "560001" }, items: [{ name: "rice", quantity: 2, unit: "KG" }], providers: ["blinkit"] });
  assert.equal(request.items[0].name, "rice");
});

test("SerpApi client coalesces and caches identical searches", async () => {
  let calls = 0;
  const client = new SerpApiClient({
    apiKey: "test-key",
    timeoutMs: 1000,
    maxAttempts: 1,
    cacheTtlMs: 60_000,
    circuitFailureThreshold: 3,
    circuitCooldownMs: 1000,
    retryBaseDelayMs: 1,
    fetchImpl: async (url) => {
      calls += 1;
      assert.match(String(url), /engine=google_shopping/);
      assert.match(String(url), /no_cache=false/);
      return { ok: true, status: 200, json: async () => ({ shopping_results: [] }) };
    }
  });
  const request = { query: "rice 2kg", location: "Bengaluru, India" };
  await Promise.all([client.search(request), client.search(request)]);
  await client.search(request);
  assert.equal(calls, 1);
});

test("delivery timing is not fabricated into a delivery fee", () => {
  assert.equal(parseDelivery("Delivery in 30 mins").fee, null);
  assert.equal(parseDelivery("Delivery fee ₹25").fee, 25);
  assert.equal(parseDelivery("Free delivery").fee, 0);
});

test("pack size extraction and deterministic optimization honor quantity coverage", () => {
  assert.deepEqual(parsePackSize("Rice 2 kg"), { quantity: 2, unit: "kg" });
  const item = { id: "item_1", rawText: "rice 2 kg", name: "rice", quantity: 2, unit: "kg" };
  const offer = (id, providerId, price, packQuantity) => ({ id, groceryItemId: "item_1", providerId, providerName: providerId, title: `Rice ${packQuantity} kg`, price, currency: "INR", oldPrice: null, discountPercent: null, discountAmount: null, quantity: null, unit: null, normalizedUnitPrice: price / packQuantity, packQuantity, packUnit: "kg", available: true, deliveryText: "Free delivery", deliveryFee: 0, rating: null, reviews: null, productUrl: null, productId: id, sourceIcon: null, tags: [], badges: [], matchQuality: "exact", matchScore: 100, rawReference: {} });
  const result = optimize({ strategy: "LOWEST_TOTAL", constraints: { maxProviders: 2, allowSubstitutes: false, allowOverbuy: false }, items: [item], offers: [offer("a", "blinkit", 100, 1), offer("b", "zepto", 180, 2)] });
  assert.equal(result.data.recommendedBasket.estimatedTotal, 180);
  assert.equal(result.data.recommendedBasket.providerCount, 1);
});

test("rate limiter blocks only after the configured window budget", () => {
  let now = 1000;
  const limiter = new RateLimiter(2, 100, () => now);
  assert.equal(limiter.allow("ip"), true);
  assert.equal(limiter.allow("ip"), true);
  assert.equal(limiter.allow("ip"), false);
  now += 101;
  assert.equal(limiter.allow("ip"), true);
});

test("nearby distance uses deterministic straight-line geographic distance", () => {
  const distance = haversineDistanceKm(12.9716, 77.5946, 12.9810, 77.6000);
  assert.ok(distance > 1 && distance < 1.3);
});

test("nearby validation bounds radius and preserves optional coordinates", () => {
  assert.throws(() => validateNearbyRequest({ location: { text: "Bengaluru" }, radiusKm: 6, items: [{ id: "item_1", name: "rice" }], offers: [] }), /radiusKm/);
  const request = validateNearbyRequest({ location: { text: "Bengaluru", latitude: 12.9716, longitude: 77.5946 }, items: [{ id: "item_1", name: "rice", quantity: null, unit: null }], offers: [{ id: "offer_1", groceryItemId: "item_1", providerId: "blinkit", providerName: "Blinkit", price: 100 }] });
  assert.equal(request.radiusKm, 2);
  assert.equal(request.location.latitude, 12.9716);
});
