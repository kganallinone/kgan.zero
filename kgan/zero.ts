// Import the main API client function
import { apiClient } from "./packages/zero-api/src/functions/api-client.functions.js";

// Import all necessary types
import type {
  URLMapping,
  EnvType,
  ConfigOptions,
  CustomURLMapping,
} from "./packages/zero-api/src//types/api-clients.types.js";

// Export the API client as the main functionality
export { apiClient };

// Re-export all types for consumer convenience
export type { URLMapping, EnvType, ConfigOptions, CustomURLMapping };
