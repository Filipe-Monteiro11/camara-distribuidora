import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import "../styles/Camarencio.css";

const mensagens = {
  "/": "Olá! Eu sou o Camarêncio. Seja bem-vindo à Camará Distribuidora!",
  "/produtos":
    "Procurando qualidade? Conheça nossa seleção de produtos!",
  "/receitas":
    "Bateu aquela fome? Confira nossas receitas e inspire-se!",
  "/sobre":
    "Você conhece nossa história? Venha descobrir como tudo começou!",
  "/galeria":
    "Que tal conhecer um pouco mais da nossa estrutura e do nosso dia a dia?",
  "/trabalhe-conosco":
    "Quer fazer parte da nossa equipe? Conheça nosso espaço de oportunidades!",
};

const TEMPO_BALAO = 7000;
const CHAVE_SESSAO = "camara-camarencio-oculto";

export default function Camarencio() {
  const { pathname } = useLocation();

  const [oculto, setOculto] = useState(
    () => sessionStorage.getItem(CHAVE_SESSAO) === "true"
  );

  const [balaoAberto, setBalaoAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(pathname);

  const mensagem = mensagens[pathname];

  useEffect(() => {
    if (pathname !== paginaAtual) {
      setPaginaAtual(pathname);
    }
  }, [pathname, paginaAtual]);

  useEffect(() => {
    if (oculto || !mensagem) return;

    const abrir = window.setTimeout(() => {
      setBalaoAberto(true);
    }, 400);

    const fechar = window.setTimeout(() => {
      setBalaoAberto(false);
    }, TEMPO_BALAO + 400);

    return () => {
      window.clearTimeout(abrir);
      window.clearTimeout(fechar);
    };
  }, [paginaAtual, oculto, mensagem]);

  function alternarBalao() {
    setBalaoAberto((atual) => !atual);
  }

  function ocultarMascote() {
    sessionStorage.setItem(CHAVE_SESSAO, "true");
    setOculto(true);
    setBalaoAberto(false);
  }

  if (oculto || !mensagem || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <aside
      className="camarencio"
      aria-label="Camarêncio, mascote da Camará Distribuidora"
    >
      <div className="camarencio-personagem">
        <button
          type="button"
          className="camarencio-mascote"
          onClick={alternarBalao}
          aria-label={
            balaoAberto
              ? "Fechar mensagem do Camarêncio"
              : "Ouvir mensagem do Camarêncio"
          }
          aria-expanded={balaoAberto}
        >
          <img
            src="/images/camarencio.png"
            alt="Camarêncio, mascote da Camará Distribuidora"
            draggable="false"
          />
        </button>

        <button
          type="button"
          className="camarencio-ocultar"
          onClick={ocultarMascote}
          aria-label="Ocultar Camarêncio nesta sessão"
          title="Ocultar mascote"
        >
          <X size={14} />
        </button>
      </div>

      {balaoAberto && (
        <div className="camarencio-balao" role="status">
          <div className="camarencio-balao-topo">
            <strong>Camarêncio</strong>

            <button
              type="button"
              onClick={() => setBalaoAberto(false)}
              aria-label="Fechar balão de fala"
            >
              <X size={16} />
            </button>
          </div>

          <p>{mensagem}</p>
        </div>
      )}
    </aside>
  );
}