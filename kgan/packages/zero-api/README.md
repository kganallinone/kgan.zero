# 🌀 KGAN Zero API

**KGAN Zero API** is a lightweight, minimal-config HTTP client for frontend projects. It simplifies making authenticated API requests with automatic environment detection, token extraction, and unified error handling — all in a clean, fluent API.

---

## ✨ Features

- 🔧 Minimal configuration with smart defaults
- 🔐 Token-based authentication via `Authorization` header
- 🌐 Auto-detects environment using `location.origin`
- 🧩 Supports both environment-based and custom API endpoints
- 📦 Handles both `application/json` and `FormData`
- 🚦 Unified error handling for consistent response structure
- 🧠 Deep token path resolution from localStorage, sessionStorage, or cookies

---

## 📦 Installation

```bash
npm install @kgan/zero-api
```

---

## ⚙️ Configuration

```ts
import { apiClient } from "@kgan/zero-api";

const req = apiClient()
  .config({
    tokenStorage: "localStorage", // or "cookie", "sessionStorage"
    tokenKey: "auth", // Key used to fetch the token object
    tokenPath: "auth.token", // Dot-path to extract token from the object
  })
  .clientURL([
    { type: "local", url: "http://localhost:3000" },
    { type: "development", url: "https://dev.example.com" },
    { type: "test", url: "https://test.example.com" },
    { type: "production", url: "https://example.com" },
  ])
  .serverURL([
    { type: "local", url: "http://localhost:5000/api" },
    { type: "development", url: "https://dev-api.example.com/api" },
    { type: "test", url: "https://test-api.example.com/api" },
    { type: "production", url: "https://api.example.com/api" },
  ])
  .customURL([
    { key: "admin", url: "https://admin-api.example.com" },
    { key: "upload", url: "https://uploads.example.com" },
  ]);
```

---

## 🚀 Usage

### Auto-detected environment usage:

```ts
const api = req.get(); // Automatically selects matching environment via location.origin

const users = await api.get("/users");
const newUser = await api.post("/users", { name: "Jane Doe" });
const updatedUser = await api.put("/users/123", { active: true });
const patchUser = await api.patch("/users/123", { role: "editor" });
await api.delete("/users/123");
```

### Use a specific environment:

```ts
const testAPI = req.get("test");
const stats = await testAPI.get("/stats");
```

### Use a custom endpoint:

```ts
const uploadAPI = req.get("upload");

const formData = new FormData();
formData.append("file", selectedFile);

const result = await uploadAPI.post("/media", formData);
```

---

## 🔐 Token Extraction Logic

The token is extracted based on your configuration:

| Option         | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `tokenStorage` | Source of token: `"localStorage"`, `"sessionStorage"`, or `"cookie"` |
| `tokenKey`     | Key under which the token object is stored                           |
| `tokenPath`    | Path inside the object to extract the token                          |

Example stored value in `localStorage`:

```json
{
  "auth": {
    "token": "abc123token"
  }
}
```

---

## ❗ Error Handling

Errors return a structured object:

```ts
try {
  await api.get("/restricted");
} catch (err) {
  console.error(err.status); // HTTP status code
  console.error(err.message); // Error message from server
}
```

Non-JSON responses are returned as `{ message: string }`.

---

## 🧪 Types

```ts
export type EnvType = "local" | "development" | "test" | "production";

export type ConfigOptions = {
  tokenStorage: "cookie" | "localStorage" | "sessionStorage";
  tokenKey: string;
  tokenPath: string;
};

export type URLMapping = {
  type: EnvType;
  url: string;
};

export type CustomURLMapping = {
  key: string;
  url: string;
};
```

---

## 🛠️ License

MIT License © 2025 [KGAN](https://github.com/your-username)
