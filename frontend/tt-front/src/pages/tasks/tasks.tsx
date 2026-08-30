import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createTask, deleteTask, getTasks, type Task, type TaskPayload, updateTask } from "../../services/api";

const emptyTask = (): Omit<TaskPayload, "project"> => ({
  title: "", description: "", status: "todo", priority: "medium", due_date: null,
});

const statusLabels: Record<Task["status"], string> = { todo: "Не начата", in_progress: "В работе", done: "Готово" };
const priorityLabels: Record<Task["priority"], string> = { low: "Низкий", medium: "Средний", high: "Высокий" };

function Tasks() {
  const { projectId } = useParams();
  const project = Number(projectId);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState(emptyTask);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try { setTasks((await getTasks()).filter((task) => task.project === project)); }
      catch { setError("Не удалось загрузить задачи. Попробуйте обновить страницу."); }
      finally { setLoading(false); }
    }
    if (Number.isInteger(project) && project > 0) loadTasks();
    else { setError("Некорректный проект."); setLoading(false); }
  }, [project]);

  function updateForm<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() { setEditingId(null); setForm(emptyTask()); }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, status: task.status, priority: task.priority, due_date: task.due_date });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) return;
    setError("");
    const payload: TaskPayload = { ...form, title: form.title.trim(), description: form.description.trim(), project };
    try {
      if (editingId === null) {
        const task = await createTask(payload);
        setTasks((current) => [...current, task]);
      } else {
        const task = await updateTask(editingId, payload);
        setTasks((current) => current.map((item) => item.id === task.id ? task : item));
      }
      resetForm();
    } catch { setError("Не удалось сохранить задачу."); }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Удалить задачу?")) return;
    try { await deleteTask(id); setTasks((current) => current.filter((task) => task.id !== id)); }
    catch { setError("Не удалось удалить задачу."); }
  }

  if (loading) return <p className="loading">Загружаем задачи...</p>;

  return (
    <>
      <Link className="back-link" to="/projects">← Все проекты</Link>
      <section className="page-heading">
        <div><p className="eyebrow">Проект #{project}</p><h1>Задачи</h1><p>Расставьте приоритеты и двигайтесь вперёд без перегрузки.</p></div>
        <span className="count">{tasks.length}</span>
      </section>
      {error && <div className="notice">{error}</div>}
      <div className="content-grid">
        <section className="tasks-list">
          {tasks.length === 0 ? (
            <div className="card empty-state"><div className="empty-icon">✓</div><h2>Список пока пуст</h2><p>Создайте первую задачу и превратите план в действие.</p></div>
          ) : tasks.map((task) => (
            <article className="card task-card" key={task.id}>
              <div className="task-card-top"><div><h2>{task.title}</h2><p>{task.description || "Описание не добавлено."}</p></div><div className="task-meta"><span className={`chip status-${task.status}`}>{statusLabels[task.status]}</span><span className={`chip priority-${task.priority}`}>{priorityLabels[task.priority]}</span>{task.due_date && <span className="chip due-date">До {task.due_date}</span>}</div></div>
              <div className="card-actions"><button className="button button-secondary button-small" onClick={() => startEditing(task)}>Редактировать</button><button className="button button-danger button-small" onClick={() => handleDelete(task.id)}>Удалить</button></div>
            </article>
          ))}
        </section>
        <aside className="card form-card">
          <h2>{editingId === null ? "Новая задача" : "Редактировать задачу"}</h2>
          <p>Маленький следующий шаг — уже движение к результату.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">Название<input value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Например, Подготовить макет" required /></label>
            <label className="field">Описание<textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Что нужно сделать?" /></label>
            <label className="field">Статус<select value={form.status} onChange={(event) => updateForm("status", event.target.value as Task["status"])}><option value="todo">Не начата</option><option value="in_progress">В работе</option><option value="done">Готово</option></select></label>
            <label className="field">Приоритет<select value={form.priority} onChange={(event) => updateForm("priority", event.target.value as Task["priority"])}><option value="low">Низкий</option><option value="medium">Средний</option><option value="high">Высокий</option></select></label>
            <label className="field">Дедлайн<input type="date" value={form.due_date ?? ""} onChange={(event) => updateForm("due_date", event.target.value || null)} /></label>
            <div className="form-actions"><button className="button button-primary" type="submit">{editingId === null ? "Создать задачу" : "Сохранить"}</button>{editingId !== null && <button className="button button-ghost" type="button" onClick={resetForm}>Отмена</button>}</div>
          </form>
        </aside>
      </div>
    </>
  );
}

export default Tasks;
