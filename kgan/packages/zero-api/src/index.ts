// Import the main API client function
import { apiClient } from "./functions/api-client.functions.js";

// Import all necessary types
import type {
  URLMapping,
  EnvType,
  ConfigOptions,
  CustomURLMapping,
} from "./types/api-clients.types.js";

// Export the API client as the main functionality
export { apiClient };

// Re-export all types for consumer convenience
export type { URLMapping, EnvType, ConfigOptions, CustomURLMapping };
