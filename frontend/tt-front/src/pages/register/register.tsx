import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Не удалось создать аккаунт.");
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <Link className="brand" to="/login"><span className="brand-mark">✓</span><span>Taskflow</span></Link>
        <div className="auth-copy">
          <h1>Начните с ясного плана.</h1>
          <p>Создайте личное пространство для идей, задач и важных дедлайнов.</p>
          <div className="auth-benefits">
            <span><b>1</b> Создайте проект</span>
            <span><b>2</b> Добавьте задачи</span>
            <span><b>3</b> Двигайтесь к результату</span>
          </div>
        </div>
      </section>
      <main className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Создать аккаунт</h2>
          <p>Это займёт меньше минуты.</p>
          {error && <div className="notice">{error}</div>}
          <div className="form-stack">
            <label className="field">Имя пользователя
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            </label>
            <label className="field">Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </label>
            <label className="field">Пароль
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
            </label>
            <button className="button button-primary" type="submit">Создать аккаунт</button>
          </div>
          <p className="auth-footer">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </form>
      </main>
    </div>
  );
}

export default Register;
