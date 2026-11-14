import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
    "Quer fazer parte da nossa equipe? Conheça nossas oportunidades!",
};

const TEMPO_EXIBICAO = 6000;
const DURACAO_SAIDA = 600;

export default function Camarencio() {
  const { pathname } = useLocation();
  const mensagem = mensagens[pathname];

  const [estado, setEstado] = useState("oculto");

  useEffect(() => {
    if (!mensagem) return;

    const entrada = window.setTimeout(() => {
      setEstado("visivel");
    }, 0);

    const saida = window.setTimeout(() => {
      setEstado("saindo");
    }, TEMPO_EXIBICAO - DURACAO_SAIDA);

    const remover = window.setTimeout(() => {
      setEstado("oculto");
    }, TEMPO_EXIBICAO);

    return () => {
      window.clearTimeout(entrada);
      window.clearTimeout(saida);
      window.clearTimeout(remover);
    };
  }, [pathname, mensagem]);

  if (!mensagem || estado === "oculto") {
    return null;
  }

  return (
    <aside
      className={`camarencio ${
        estado === "saindo" ? "camarencio-saindo" : ""
      }`}
      aria-label="Camarêncio, mascote da Camará Distribuidora"
    >
      <img
        src="/images/camarencio.png"
        alt="Camarêncio, mascote da Camará Distribuidora"
        className="camarencio-imagem"
        draggable="false"
      />

      <div className="camarencio-balao">
        <strong>Camarêncio</strong>
        <p>{mensagem}</p>
      </div>
    </aside>
  );
}