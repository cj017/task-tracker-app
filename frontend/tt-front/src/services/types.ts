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

export type Project = {
  id: number;
  title: string;
  description: string;
};
