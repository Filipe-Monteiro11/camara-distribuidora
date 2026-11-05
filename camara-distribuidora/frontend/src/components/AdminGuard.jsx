import { useEffect, useState } from "react";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import { sair, verificarSessao } from "../services/auth";

export default function AdminGuard() {
  const [admin, setAdmin] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    verificarSessao()
      .then((dados) => {
        if (ativo) setAdmin(dados);
      })
      .catch((error) => {
        if (ativo) setErro(error.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function fazerLogout() {
    sair();
    setAdmin(null);
  }

  if (carregando) {
    return <main className="login-page">Verificando sessão...</main>;
  }

  if (erro) {
    return (
      <main className="login-page">
        <section className="login-card">
          <p role="alert">{erro}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  if (!admin) {
    return <Login onLogin={setAdmin} />;
  }

  return <Admin admin={admin} onLogout={fazerLogout} />;
}