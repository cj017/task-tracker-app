import { useState } from "react";
import { login } from "../../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    try {
      const data = await login(username, password);

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      console.log("Успешный вход");
      console.log(data);

      navigate("/projects");

    } catch (error) {
      setError("Неверный логин или пароль");
    }
  }

  return (
    <div>
      <h1>Вход</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          Войти
        </button>
      </form>

      {error && <p>{error}</p>}

      
    </div>
  );
}

export default Login;