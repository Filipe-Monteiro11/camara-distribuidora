const API_URL = "http://localhost:3001/api";
const TOKEN_KEY = "camara-admin-token";

export function obterToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function salvarToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function sair() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function entrar(email, senha) {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.error || "E-mail ou senha inválidos.");
  }

  salvarToken(dados.token);

  return dados.admin;
}

export async function verificarSessao() {
  const token = obterToken();

  if (!token) return null;

  const resposta = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!resposta.ok) {
    sair();
    return null;
  }

  return resposta.json();
}