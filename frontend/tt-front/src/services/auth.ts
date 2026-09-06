import { clearTokens, getRefreshToken, hasStoredTokens, postWithoutParsing, publicRequest, storeTokens } from "./http";

export { hasStoredTokens };

export async function login(username: string, password: string) {
  const data = await publicRequest<{ access: string; refresh: string }>(
    "/auth/login/",
    "Неверный логин или пароль",
    { method: "POST", body: JSON.stringify({ username, password }) },
  );
  storeTokens(data.access, data.refresh);
}

export async function register(username: string, email: string, password: string) {
  return publicRequest(
    "/auth/register/",
    "Не удалось зарегистрироваться",
    { method: "POST", body: JSON.stringify({ username, email, password }) },
  );
}

export async function logout() {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await postWithoutParsing("/auth/logout/", { refresh });
    }
  } finally {
    clearTokens();
  }
}
