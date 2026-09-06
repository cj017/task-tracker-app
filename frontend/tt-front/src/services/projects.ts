import { authRequest } from "./http";
import type { Project } from "./types";

export type { Project };

export async function getProjects() {
  return authRequest<Project[]>("/projects/", "Не удалось получить проекты");
}

export async function createProject(title: string, description: string) {
  return authRequest<Project>("/projects/", "Не удалось создать проект", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

export async function updateProject(id: number, title: string, description: string) {
  return authRequest<Project>(`/projects/${id}/`, "Не удалось обновить проект", {
    method: "PUT",
    body: JSON.stringify({ title, description }),
  });
}

export async function deleteProject(id: number) {
  await authRequest(`/projects/${id}/`, "Не удалось удалить проект", { method: "DELETE" });
}
