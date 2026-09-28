import { validateOptimizeRequest } from "../validation/optimizeSchemas";
import { optimize } from "../services/optimizer/Optimizer";

export function optimizeCart(input: unknown, requestId: string) {
  const request = validateOptimizeRequest(input);
  return { ...optimize(request), requestId };
}
