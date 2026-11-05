import { useState } from "react";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { entrar } from "../services/auth";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(evento) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const admin = await entrar(email.trim(), senha);
      onLogin(admin);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <img
          src="/images/logo-camara.png"
          alt="Camará Distribuidora"
          className="login-logo"
        />

        <div className="login-heading">
          <span>ÁREA RESTRITA</span>
          <h1>Painel administrativo</h1>
          <p>Entre com suas credenciais para gerenciar o site.</p>
        </div>

        <form onSubmit={fazerLogin} className="login-form">
          <label htmlFor="login-email">E-mail</label>
          <div className="login-input">
            <Mail size={19} aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="Digite seu e-mail"
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="login-senha">Senha</label>
          <div className="login-input">
            <LockKeyhole size={19} aria-hidden="true" />
            <input
              id="login-senha"
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          {erro && <p className="login-error" role="alert">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar no painel"}
            {!carregando && <ArrowRight size={19} />}
          </button>
        </form>

        <a href="/">Voltar ao site</a>
      </section>
    </main>
  );
}