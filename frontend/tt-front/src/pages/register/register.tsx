import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { register } from "../../services/auth";

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
    <AuthLayout
      title="Начните с ясного плана."
      copy="Создайте личное пространство для идей, задач и важных дедлайнов."
      benefits={[
        { mark: "1", label: "Создайте проект" },
        { mark: "2", label: "Добавьте задачи" },
        { mark: "3", label: "Двигайтесь к результату" },
      ]}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Создать аккаунт</h2>
        <p>Это займёт меньше минуты.</p>
        {error && <div className="notice">{error}</div>}
        <div className="form-stack">
          <label className="field">
            Имя пользователя
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
          <label className="field">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </label>
          <label className="field">
            Пароль
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
          </label>
          <button className="button button-primary" type="submit">Создать аккаунт</button>
        </div>
        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
