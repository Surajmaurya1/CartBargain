import type { AppConfig } from "../config/env";
import type { HealthResponse } from "../types/api";

export function health(config: AppConfig): HealthResponse {
  return {
    success: true,
    status: "ok",
    service: "blinkbargain-api",
    serpApiConfigured: config.serpApiKey !== null
  };
}
