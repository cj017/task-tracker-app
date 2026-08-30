import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const data = await login(username, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/projects");
    } catch {
      setError("Проверьте имя пользователя и пароль.");
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <Link className="brand" to="/login"><span className="brand-mark">✓</span><span>Taskflow</span></Link>
        <div className="auth-copy">
          <h1>Работайте спокойно. Всё под контролем.</h1>
          <p>Соберите проекты и задачи в одном простом пространстве — без лишнего шума.</p>
          <div className="auth-benefits">
            <span><b>✓</b> Понятный список задач</span>
            <span><b>✓</b> Дедлайны и приоритеты</span>
            <span><b>✓</b> Ваши данные доступны только вам</span>
          </div>
        </div>
      </section>
      <main className="auth-panel">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>С возвращением</h2>
          <p>Войдите, чтобы продолжить работу с проектами.</p>
          {error && <div className="notice">{error}</div>}
          <div className="form-stack">
            <label className="field">Имя пользователя
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            </label>
            <label className="field">Пароль
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </label>
            <button className="button button-primary" type="submit">Войти в Taskflow</button>
          </div>
          <p className="auth-footer">Ещё нет аккаунта? <Link to="/register">Создать аккаунт</Link></p>
        </form>
      </main>
    </div>
  );
}

export default Login;
