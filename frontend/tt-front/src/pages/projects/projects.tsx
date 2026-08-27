import { useEffect, useState } from "react";
import { createProject, deleteProject, getProjects, updateProject } from "../../services/api";

type Project = {
    id: number;
    title: string;
    description: string;
};

function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch {
                setError("Не удалось загрузить проекты");
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    async function handleCreateProject(event: React.FormEvent) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {
            const newProject = await createProject(title, description);

            setProjects((currentProjects) => [
                ...currentProjects,
                newProject,
            ]);

            setTitle("");
            setDescription("");
        } catch (error) {
            console.error(error);
        }
    }

    function startEditing(project: Project) {
        setEditingId(project.id);
        setEditTitle(project.title);
        setEditDescription(project.description);
    }

    function cancelEditing() {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
    }

    async function handleUpdate(id: number) {
    try {
      const updatedProject = await updateProject(
        id,
        editTitle,
        editDescription
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? updatedProject : project
        )
      );

      cancelEditing();
    } catch (error) {
      console.error(error);
    }
  }

    async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Вы действительно хотите удалить этот проект?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(id);

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  }
  

    return (
        <div>


            <h1>Мои проекты</h1>

            {projects.length === 0 ? (
                <p>У вас пока нет проектов.</p>
            ) : (
                projects.map((project) => (
                        <div className="project-card" key={project.id}>

                            {editingId === project.id ? (
                                <>
                                    <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Название проекта"
                                    />

                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Описание проекта"
                                    />

                                    <button onClick={() => handleUpdate(project.id)}>
                                        Сохранить
                                    </button>

                                    <button onClick={cancelEditing}>
                                        Отмена
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2>{project.title}</h2>

                                    <p>{project.description}</p>

                                    <button onClick={() => startEditing(project)}>
                                        ✏️ Редактировать
                                    </button>

                                    <button onClick={() => handleDelete(project.id)}>
                                        🗑️ Удалить
                                    </button>
                                </>
                            )}

                        </div>
                        ))
                    )}



            <form onSubmit={handleCreateProject}>
                <input
                    type="text"
                    placeholder="Название проекта"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />

                <textarea
                    placeholder="Описание"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />

                <button type="submit">
                    Создать проект
                </button>
            </form>
        </div>
    );
}

export default Projects;