export type EnvType = "local" | "test" | "development" | "production";

export interface ConfigOptions {
  tokenStorage: "localStorage" | "sessionStorage" | "cookie";
  tokenKey: string;
  tokenPath: string;
}

export interface URLMapping {
  type: EnvType;
  url: string;
}

export interface CustomURLMapping {
  key: string;
  url: string;
}
