import {
  ConfigOptions,
  CustomURLMapping,
  EnvType,
  URLMapping,
} from "../types/api-clients.types";

class APIClientBuilder {
  private configOptions: ConfigOptions = {
    tokenStorage: "localStorage",
    tokenKey: "auth",
    tokenPath: "auth.token",
  };

  private clientURLs: Record<EnvType, string> = {
    local: "",
    test: "",
    development: "",
    production: "",
  };

  private serverURLs: Record<EnvType, string> = {
    local: "",
    test: "",
    development: "",
    production: "",
  };

  private customURLs: Record<string, string> = {};

  private matchedType: EnvType | null = null;

  config(options: ConfigOptions) {
    this.configOptions = options;
    return this;
  }

  clientURL(urls: URLMapping[]) {
    for (const { type, url } of urls) {
      this.clientURLs[type] = url;
    }

    const currentOrigin = location.origin;
    for (const { type, url } of urls) {
      try {
        const parsed = new URL(url, location.href);
        if (parsed.origin === currentOrigin) {
          this.matchedType = type;
          break;
        }
      } catch {
        // skip invalid URL
      }
    }

    return this;
  }

  serverURL(urls: URLMapping[]) {
    for (const { type, url } of urls) {
      this.serverURLs[type] = url;
    }
    return this;
  }

  customURL(urls: CustomURLMapping[]) {
    for (const { key, url } of urls) {
      this.customURLs[key] = url;
    }
    return this;
  }

  private getTokenFromStorage(): string | null {
    const { tokenStorage, tokenKey, tokenPath } = this.configOptions;

    let rawData: any = null;
    if (tokenStorage === "localStorage") {
      rawData = localStorage.getItem(tokenKey);
    } else if (tokenStorage === "sessionStorage") {
      rawData = sessionStorage.getItem(tokenKey);
    } else if (tokenStorage === "cookie") {
      const match = document.cookie.match(
        new RegExp("(^| )" + tokenKey + "=([^;]+)")
      );
      rawData = match ? decodeURIComponent(match[2]) : null;
    }

    if (!rawData) return null;

    try {
      const parsed =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;
      return (
        tokenPath.split(".").reduce((acc, key) => acc?.[key], parsed) || null
      );
    } catch {
      return null;
    }
  }

  api(envOrKey?: EnvType | string) {
    let baseURL: string;

    if (!envOrKey) {
      baseURL = this.matchedType
        ? this.serverURLs[this.matchedType]
        : this.serverURLs["production"];
    } else if (
      ["local", "test", "development", "production"].includes(envOrKey)
    ) {
      baseURL = this.serverURLs[envOrKey as EnvType];
    } else {
      baseURL = this.customURLs[envOrKey] || "";
    }

    const request = async (
      method: string,
      url: string,
      data?: any,
      customHeaders?: HeadersInit
    ) => {
      const isFormData =
        typeof FormData !== "undefined" && data instanceof FormData;

      const token = this.getTokenFromStorage();

      const headers: Record<string, string> = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(customHeaders as Record<string, string>),
      };

      if (!isFormData) headers["Content-Type"] = "application/json";

      const config: RequestInit = {
        method,
        headers,
        credentials: "include",
      };

      let fullUrl = `${baseURL}${url}`;

      if (method === "GET" && data) {
        const params = new URLSearchParams();
        for (const key in data) {
          const value = data[key];
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        }
        const queryString = params.toString();
        fullUrl += queryString ? `?${queryString}` : "";
      } else if (data) {
        config.body = isFormData ? data : JSON.stringify(data);
      }

      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const errorData = contentType?.includes("application/json")
          ? await response.json().catch(() => ({}))
          : await response
              .text()
              .then((text) => ({ message: text }))
              .catch(() => ({}));

        throw { status: response.status, ...errorData };
      }

      if (response.headers.get("content-type")?.includes("application/json")) {
        return response.json();
      }

      return null;
    };

    return {
      get: (url: string) => request("GET", url),
      getAll: (url: string, params: Record<string, any>) =>
        request("GET", url, params),
      post: (url: string, data: any, headers?: HeadersInit) =>
        request("POST", url, data, headers),
      put: (url: string, data: any) => request("PUT", url, data),
      patch: (url: string, data: any) => request("PATCH", url, data),
      delete: (url: string) => request("DELETE", url),
    };
  }
}

export const apiClient = () => new APIClientBuilder();
