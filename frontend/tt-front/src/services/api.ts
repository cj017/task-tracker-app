const API_URL = "http://127.0.0.1:8000/api";

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Неверный логин или пароль");
  }

  return response.json();
}


export async function getProjects() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/projects/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Не удалось получить проекты");
  }

  return response.json();
}


export async function createProject(
  title: string,
  description: string,
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Не удалось создать проект");
  }

  return response.json();
}

export async function updateProject(
  id: number,
  title: string,
  description: string
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/projects/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить проект");
  }

  return response.json();
}


export async function deleteProject(id: number) {
  const response = await fetch(`${API_URL}/projects/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Не удалось удалить проект");
  }
}
