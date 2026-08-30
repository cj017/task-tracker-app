import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, deleteProject, getProjects, updateProject } from "../../services/api";
import ConfirmDialog from "../../components/ConfirmDialog";

type Project = { id: number; title: string; description: string };

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setProjects(await getProjects());
      } catch {
        setError("Не удалось загрузить проекты. Попробуйте обновить страницу.");
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  function startEditing(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setError("");

    try {
      if (editingId === null) {
        const project = await createProject(title.trim(), description.trim());
        setProjects((current) => [...current, project]);
      } else {
        const project = await updateProject(editingId, title.trim(), description.trim());
        setProjects((current) => current.map((item) => item.id === project.id ? project : item));
      }
      resetForm();
    } catch {
      setError("Не удалось сохранить проект. Попробуйте ещё раз.");
    }
  }

  async function handleDelete() {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      setProjects((current) => current.filter((project) => project.id !== projectToDelete.id));
      if (editingId === projectToDelete.id) resetForm();
      setProjectToDelete(null);
    } catch {
      setError("Не удалось удалить проект.");
    }
  }

  if (loading) return <p className="loading">Загружаем ваши проекты...</p>;

  return (
    <>
      <section className="page-heading">
        <div><p className="eyebrow">Рабочее пространство</p><h1>Мои проекты</h1><p>Организуйте работу так, как удобно именно вам.</p></div>
        <span className="count">{projects.length}</span>
      </section>
      {error && <div className="notice">{error}</div>}
      <div className="content-grid">
        <section className="projects-grid">
          {projects.length === 0 ? (
            <div className="card empty-state"><div className="empty-icon">✦</div><h2>Первый проект ждёт вас</h2><p>Добавьте проект справа, а затем наполните его задачами.</p></div>
          ) : projects.map((project) => (
            <article className="card project-card project-card-gradient" key={project.id}>
              <h2>{project.title}</h2>
              <p>{project.description || "Добавьте описание, чтобы сохранить контекст работы."}</p>
              <div className="card-actions">
                <button className="button button-primary button-small" onClick={() => navigate(`/projects/${project.id}/tasks`)}>Открыть задачи</button>
                <button className="button button-secondary button-small" onClick={() => startEditing(project)}>Изменить</button>
                <button className="button button-danger button-small" onClick={() => setProjectToDelete(project)}>Удалить</button>
              </div>
            </article>
          ))}
        </section>
        <aside className="card form-card gradient-form-card">
          <h2>{editingId === null ? "Новый проект" : "Редактировать проект"}</h2>
          <p>{editingId === null ? "Начните с названия и добавьте описание при необходимости." : "Обновите детали и сохраните изменения."}</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">Название проекта<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Например, Личный сайт" required /></label>
            <label className="field">Описание<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Цель, заметки или следующий шаг" /></label>
            <div className="form-actions"><button className="button button-primary" type="submit">{editingId === null ? "Создать проект" : "Сохранить"}</button>{editingId !== null && <button className="button button-ghost" type="button" onClick={resetForm}>Отмена</button>}</div>
          </form>
        </aside>
      </div>
      <ConfirmDialog
        open={projectToDelete !== null}
        title="Удалить проект?"
        description={`Проект «${projectToDelete?.title ?? ""}» и все его задачи будут удалены без возможности восстановления.`}
        confirmLabel="Удалить проект"
        onCancel={() => setProjectToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default Projects;
