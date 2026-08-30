const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export type Task = {
  id: number;
  title: string;
  description: string;
  project: number;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  created_at: string;
};

export type TaskPayload = Omit<Task, "id" | "created_at">;

export function isAuthenticated() {
  return Boolean(localStorage.getItem("access_token") && localStorage.getItem("refresh_token"));
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.dispatchEvent(new Event("auth:expired"));
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

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;

  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) return false;
  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return true;
}

async function authenticatedFetch(path: string, options: RequestInit = {}) {
  const request = () => fetch(`${API_URL}${path}`, {
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

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error(await getApiError(response, "Неверный логин или пароль"));
  return response.json();
}

export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось зарегистрироваться"));
  return response.json();
}

export async function logout() {
  const refresh = localStorage.getItem("refresh_token");
  try {
    if (refresh) {
      await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
    }
  } finally {
    clearTokens();
  }
}

export async function getProjects() {
  const response = await authenticatedFetch("/projects/");
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось получить проекты"));
  return response.json();
}

export async function createProject(title: string, description: string) {
  const response = await authenticatedFetch("/projects/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось создать проект"));
  return response.json();
}

export async function updateProject(id: number, title: string, description: string) {
  const response = await authenticatedFetch(`/projects/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось обновить проект"));
  return response.json();
}

export async function deleteProject(id: number) {
  const response = await authenticatedFetch(`/projects/${id}/`, { method: "DELETE" });
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось удалить проект"));
}

export async function getTasks() {
  const response = await authenticatedFetch("/tasks/");
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось получить задачи"));
  return response.json() as Promise<Task[]>;
}

export async function createTask(task: TaskPayload) {
  const response = await authenticatedFetch("/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось создать задачу"));
  return response.json() as Promise<Task>;
}

export async function updateTask(id: number, task: TaskPayload) {
  const response = await authenticatedFetch(`/tasks/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось обновить задачу"));
  return response.json() as Promise<Task>;
}

export async function deleteTask(id: number) {
  const response = await authenticatedFetch(`/tasks/${id}/`, { method: "DELETE" });
  if (!response.ok) throw new Error(await getApiError(response, "Не удалось удалить задачу"));
}
