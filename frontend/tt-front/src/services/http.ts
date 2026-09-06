import { AUTH_EXPIRED_EVENT } from "../auth/events";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const JSON_HEADERS = { "Content-Type": "application/json" };

export function hasStoredTokens() {
  return Boolean(localStorage.getItem("access_token") && localStorage.getItem("refresh_token"));
}

export function storeTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

async function getApiError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  if (typeof data?.detail === "string") return data.detail;
  if (data && typeof data === "object") {
    const firstError = Object.values(data).flat().find((value) => typeof value === "string");
    if (typeof firstError === "string") return firstError;
  }
  return fallback;
}

async function parseJson<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) throw new Error(await getApiError(response, fallback));
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function withJsonHeaders(options: RequestInit): RequestInit {
  if (!options.body) return options;
  return { ...options, headers: { ...JSON_HEADERS, ...options.headers } };
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) return false;
  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return true;
}

async function authenticatedFetch(path: string, options: RequestInit = {}) {
  const request = () =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

  let response = await request();
  if (response.status !== 401) return response;
  if (await refreshAccessToken()) {
    response = await request();
    if (response.status !== 401) return response;
  }

  clearTokens();
  return response;
}

export async function publicRequest<T>(path: string, fallback: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, withJsonHeaders(options));
  return parseJson<T>(response, fallback);
}

export async function authRequest<T>(path: string, fallback: string, options: RequestInit = {}) {
  const response = await authenticatedFetch(path, withJsonHeaders(options));
  return parseJson<T>(response, fallback);
}

export async function postWithoutParsing(path: string, body: unknown) {
  await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
}
