import { authRequest } from "./http";
import type { Task, TaskPayload } from "./types";

export type { Task, TaskPayload };

export async function getTasks(projectId: number) {
  return authRequest<Task[]>(`/tasks/?project=${projectId}`, "Не удалось получить задачи");
}

export async function createTask(task: TaskPayload) {
  return authRequest<Task>("/tasks/", "Не удалось создать задачу", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function updateTask(id: number, task: TaskPayload) {
  return authRequest<Task>(`/tasks/${id}/`, "Не удалось обновить задачу", {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export async function deleteTask(id: number) {
  await authRequest(`/tasks/${id}/`, "Не удалось удалить задачу", { method: "DELETE" });
}
