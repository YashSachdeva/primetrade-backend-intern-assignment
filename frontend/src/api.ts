const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  isActive: boolean;
};

type ApiOptions = {
  method?: string;
  token?: string;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload as T;
}
