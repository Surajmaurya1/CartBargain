import type { AppConfig } from "../config/env";
import { validateNearbyRequest } from "../validation/nearbySchemas";
import { findNearbyCheaperOptions } from "../services/nearby/NearbyCheaperService";

export async function nearbyCart(input: unknown, config: AppConfig, requestId: string) {
  const request = validateNearbyRequest(input);
  const result = await findNearbyCheaperOptions(request, config);
  return { ...result, requestId };
}
