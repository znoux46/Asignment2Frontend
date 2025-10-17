import { CartItem, Product, Order } from '@/types';
import config from '@/config/env';

const API_BASE = config.API_BASE_URL;
import { getAuth, type AuthUser } from "./auth";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  async listProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
    return handle<Product[]>(res);
  },
  async getProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: "no-store" });
    return handle<Product>(res);
  },
  async createProduct(formData: FormData): Promise<Product> {
    const auth = getAuth();
    const headers: HeadersInit = {};
    if (auth?.token) {
      headers.Authorization = `Bearer ${auth.token}`;
    }
    const res = await fetch(`${API_BASE}/api/products`, { method: "POST", headers, body: formData });
    return handle<Product>(res);
  },
  async updateProduct(id: number, formData: FormData): Promise<Product> {
    const auth = getAuth();
    const headers: HeadersInit = {};
    if (auth?.token) {
      headers.Authorization = `Bearer ${auth.token}`;
    }
    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: "PUT", headers, body: formData });
    return handle<Product>(res);
  },
  async deleteProduct(id: number): Promise<void> {
    const auth = getAuth();
    const headers: HeadersInit = {};
    if (auth?.token) {
      headers.Authorization = `Bearer ${auth.token}`;
    }
    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  },
  async register(data: { username: string; email: string; password: string }): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Username: data.username, Email: data.email, Password: data.password }) });
    const user = await handle<AuthUser>(res);
    return user;
  },
  async login(data: { usernameOrEmail: string; password: string }): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ UsernameOrEmail: data.usernameOrEmail, Password: data.password }) });
    const user = await handle<AuthUser>(res);
    return user;
  },
  async getCart(): Promise<CartItem[]> { throw new Error("not implemented type stub"); }
};

export const secureApi = {
  async getCart() {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/cart`, { headers: { Authorization: `Bearer ${au?.token ?? ""}` } });
    return handle<CartItem[]>(res);
  },
  async addToCart(productId: number, quantity = 1) {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/cart`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${au?.token ?? ""}` }, body: JSON.stringify({ productId, quantity }) });
    return handle<CartItem[]>(res);
  },
  async updateCartQuantity(productId: number, quantity: number) {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/cart/${productId}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${au?.token ?? ""}` }, body: JSON.stringify({ quantity }) });
    return handle<CartItem[]>(res);
  },
  async removeFromCart(productId: number) {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/cart/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${au?.token ?? ""}` } });
    return handle<CartItem[]>(res);
  },
  async checkout() {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/cart/checkout`, { method: "POST", headers: { Authorization: `Bearer ${au?.token ?? ""}` } });
    return handle<{ id: number; total: number }>(res);
  },
  async myOrders() {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/orders/me`, { headers: { Authorization: `Bearer ${au?.token ?? ""}` } });
    return handle<Order[]>(res);
  },
  async processPayment(orderId: number) {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/pay`, { method: "POST", headers: { Authorization: `Bearer ${au?.token ?? ""}` } });
    return handle<{ id: number; total: number }>(res);
  },
  async createPaymentIntent(orderId: number, amount: number) {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/payments/create-payment-intent`, { 
      method: "POST", 
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${au?.token ?? ""}` 
      },
      body: JSON.stringify({ orderId, amount, currency: "usd" })
    });
    return handle<{ clientSecret: string; paymentIntentId: string }>(res);
  },
  async confirmPayment(paymentIntentId: string) {
    const au = getAuth();
    const res = await fetch(`${API_BASE}/api/payments/confirm-payment`, { 
      method: "POST", 
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${au?.token ?? ""}` 
      },
      body: JSON.stringify({ paymentIntentId })
    });
    return handle<{ id: number; total: number }>(res);
  },
};


