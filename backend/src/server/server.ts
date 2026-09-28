declare const process: any;
declare const require: any;

import { loadConfig } from "./config/env";
import { health } from "./api/health";
import { compare } from "./api/compare";
import { AppError } from "./errors/AppError";
import { optimizeCart } from "./api/optimize";
import { RateLimiter } from "./services/reliability/RateLimiter";
import { logEvent } from "./logging/logger";
import { nearbyCart } from "./api/nearby";

const http = require("node:http");
const config = loadConfig();
const compareLimiter = new RateLimiter(config.maxCompareRequestsPerIp, config.compareRateWindowMs);

function requestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const server = http.createServer((request: any, response: any) => {
  const id = requestId();
  const startedAt = Date.now();
  logEvent("request_started", { requestId: id, method: request.method, route: request.url });
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Request-Id", id);

  if (request.method === "GET" && request.url === "/api/health") {
    response.writeHead(200);
    response.end(JSON.stringify(health(config)));
    return;
  }

  if (request.method === "POST" && request.url === "/api/compare") {
    const clientKey = request.socket?.remoteAddress ?? "unknown";
    if (!compareLimiter.allow(clientKey)) {
      response.writeHead(429);
      response.end(JSON.stringify({ success: false, requestId: id, error: { code: "RATE_LIMITED", message: "Too many comparison requests. Please try again shortly." } }));
      logEvent("request_completed", { requestId: id, status: 429, durationMs: Date.now() - startedAt });
      return;
    }
    let body = "";
    request.on("data", (chunk: any) => { body += chunk.toString(); if (body.length > 1_000_000) request.destroy(); });
    request.on("end", async () => {
      try {
        const result = await compare(JSON.parse(body), config, id);
        response.writeHead(200);
        response.end(JSON.stringify(result));
        logEvent("request_completed", { requestId: id, status: 200, durationMs: Date.now() - startedAt, route: "/api/compare", resultStatus: result.status });
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError("INTERNAL_ERROR", "Unexpected server error.", 500);
        response.writeHead(appError.status);
        response.end(JSON.stringify({ success: false, requestId: id, error: { code: appError.code, message: appError.message } }));
        logEvent("request_completed", { requestId: id, status: appError.status, durationMs: Date.now() - startedAt, route: "/api/compare", errorCode: appError.code });
      }
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/optimize") {
    let body = "";
    request.on("data", (chunk: any) => { body += chunk.toString(); if (body.length > 2_000_000) request.destroy(); });
    request.on("end", () => {
      try {
        response.writeHead(200);
        response.end(JSON.stringify(optimizeCart(JSON.parse(body), id)));
        logEvent("request_completed", { requestId: id, status: 200, durationMs: Date.now() - startedAt, route: "/api/optimize" });
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError("INTERNAL_ERROR", "Unexpected server error.", 500);
        response.writeHead(appError.status);
        response.end(JSON.stringify({ success: false, requestId: id, error: { code: appError.code, message: appError.message } }));
        logEvent("request_completed", { requestId: id, status: appError.status, durationMs: Date.now() - startedAt, route: "/api/optimize", errorCode: appError.code });
      }
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/nearby") {
    const clientKey = request.socket?.remoteAddress ?? "unknown";
    if (!compareLimiter.allow(clientKey)) {
      response.writeHead(429);
      response.end(JSON.stringify({ success: false, requestId: id, error: { code: "RATE_LIMITED", message: "Too many comparison requests. Please try again shortly." } }));
      logEvent("request_completed", { requestId: id, status: 429, durationMs: Date.now() - startedAt, route: "/api/nearby" });
      return;
    }
    let body = "";
    request.on("data", (chunk: any) => { body += chunk.toString(); if (body.length > 2_000_000) request.destroy(); });
    request.on("end", async () => {
      try {
        const result = await nearbyCart(JSON.parse(body), config, id);
        response.writeHead(200);
        response.end(JSON.stringify(result));
        logEvent("request_completed", { requestId: id, status: 200, durationMs: Date.now() - startedAt, route: "/api/nearby" });
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError("INTERNAL_ERROR", "Unexpected server error.", 500);
        response.writeHead(appError.status);
        response.end(JSON.stringify({ success: false, requestId: id, error: { code: appError.code, message: appError.message } }));
        logEvent("request_completed", { requestId: id, status: appError.status, durationMs: Date.now() - startedAt, route: "/api/nearby", errorCode: appError.code });
      }
    });
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ success: false, requestId: id, error: { code: "NOT_FOUND", message: "Route not found." } }));
});

server.listen(config.port, () => {
  console.log(JSON.stringify({ event: "server_started", port: config.port, serpApiConfigured: config.serpApiKey !== null }));
});
