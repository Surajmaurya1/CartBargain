export type ApiError = {
  code: string;
  message: string;
};

export type ErrorResponse = {
  success: false;
  requestId: string;
  error: ApiError;
};

export type HealthResponse = {
  success: true;
  status: "ok";
  service: "blinkbargain-api";
  serpApiConfigured: boolean;
};
