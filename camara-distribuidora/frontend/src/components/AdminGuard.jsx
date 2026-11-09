import { useEffect, useState } from "react";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import {
  obterToken,
  sair,
  verificarSessao
} from "../services/auth";

export default function AdminGuard() {
  const [admin, setAdmin] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarSessao() {
      try {
        if (!obterToken()) {
          if (ativo) setAdmin(null);
          return;
        }

        const dados = await verificarSessao();

        if (ativo) {
          setAdmin(dados);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  function fazerLogout() {
    sair();
    setAdmin(null);
  }

  if (carregando) {
    return (
      <main className="login-page">
        Verificando sessão...
      </main>
    );
  }

  if (erro) {
    return (
      <main className="login-page">
        <section className="login-card">
          <p role="alert">{erro}</p>
          <button
            type="button"
            onClick={() => {
              setErro("");
              sair();
              setAdmin(null);
            }}
          >
            Voltar ao login
          </button>
        </section>
      </main>
    );
  }

  if (!admin || !obterToken()) {
    return <Login onLogin={setAdmin} />;
  }

  return (
    <Admin
      admin={admin}
      onLogout={fazerLogout}
      onAtualizarAdmin={setAdmin}
    />
  );
}