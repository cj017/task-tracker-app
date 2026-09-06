import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import AuthLayout from "../../components/AuthLayout";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await login(username, password);
      navigate("/projects");
    } catch {
      setError("Проверьте имя пользователя и пароль.");
    }
  }

  return (
    <AuthLayout
      title="Работайте спокойно. Всё под контролем."
      copy="Соберите проекты и задачи в одном простом пространстве — без лишнего шума."
      benefits={[
        { mark: "✓", label: "Понятный список задач" },
        { mark: "✓", label: "Дедлайны и приоритеты" },
        { mark: "✓", label: "Ваши данные доступны только вам" },
      ]}
    >
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>С возвращением</h2>
        <p>Войдите, чтобы продолжить работу с проектами.</p>
        {error && <div className="notice">{error}</div>}
        <div className="form-stack">
          <label className="field">
            Имя пользователя
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
          <label className="field">
            Пароль
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          <button className="button button-primary" type="submit">Войти в Taskflow</button>
        </div>
        <p className="auth-footer">
          Ещё нет аккаунта? <Link to="/register">Создать аккаунт</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
