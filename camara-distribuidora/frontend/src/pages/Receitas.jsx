import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Clock3,
  X,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Receitas.css";

const receitas = [
  {
    id: 1,
    nome: "Escondidinho de Charque",
    descricao:
      "Uma combinação de charque desfiado e purê de macaxeira.",
    tempo: "60 min",
    imagem:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
    ingredientes: [
      "500 g de charque dessalgado e desfiado",
      "1 kg de macaxeira",
      "1 cebola picada",
      "2 dentes de alho",
      "2 colheres de manteiga",
      "200 ml de leite",
      "200 g de queijo muçarela",
      "Sal e temperos a gosto",
    ],
    preparo: [
      "Cozinhe a macaxeira até ficar macia.",
      "Amasse e misture com manteiga e leite até formar um purê.",
      "Refogue a cebola e o alho, acrescente o charque e misture.",
      "Em um refratário, coloque uma camada de purê, o charque e outra camada de purê.",
      "Finalize com queijo e leve ao forno até gratinar.",
    ],
  },
  {
    id: 2,
    nome: "Charque com Macaxeira",
    descricao:
      "Um prato tradicional, com charque acebolado e macaxeira.",
    tempo: "50 min",
    imagem:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85",
    ingredientes: [
      "500 g de charque dessalgado",
      "700 g de macaxeira",
      "2 cebolas fatiadas",
      "2 colheres de manteiga",
      "2 dentes de alho",
      "Cheiro-verde a gosto",
    ],
    preparo: [
      "Cozinhe a macaxeira em água até ficar macia.",
      "Cozinhe o charque previamente dessalgado até ficar macio.",
      "Corte o charque em pedaços e doure na manteiga.",
      "Acrescente a cebola e o alho e refogue.",
      "Sirva com a macaxeira e finalize com cheiro-verde.",
    ],
  },
  {
    id: 3,
    nome: "Arroz de Charque",
    descricao:
      "Uma receita prática e saborosa para o almoço.",
    tempo: "45 min",
    imagem:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85",
    ingredientes: [
      "300 g de charque dessalgado e desfiado",
      "2 xícaras de arroz",
      "1 cebola picada",
      "2 dentes de alho",
      "1 tomate picado",
      "2 colheres de óleo",
      "Água quente e cheiro-verde a gosto",
    ],
    preparo: [
      "Cozinhe o charque dessalgado até ficar macio e desfie.",
      "Refogue a cebola, o alho e o tomate no óleo.",
      "Acrescente o charque e misture.",
      "Adicione o arroz e a água quente.",
      "Cozinhe até o arroz ficar macio e finalize com cheiro-verde.",
    ],
  },
];

export default function Receitas() {
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  function abrirReceita(receita) {
    triggerRef.current = document.activeElement;
    setReceitaSelecionada(receita);
  }

  function fecharReceita() {
    setReceitaSelecionada(null);
  }

  useEffect(() => {
    if (!receitaSelecionada) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        fecharReceita();
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [receitaSelecionada]);

  return (
    <>
      <Header />

      <main className="recipes-page">
        <section className="recipes-intro">
          <div className="container recipes-intro-content">
            <span className="recipes-eyebrow">
              <ChefHat size={17} aria-hidden="true" />
              SABORES DA CAMARÁ
            </span>

            <h1>
              Sabores que
              <br />
              <span>inspiram.</span>
            </h1>

            <p>
              Descubra receitas com charque, explore
              combinações e encontre inspiração
              para preparar pratos especiais.
            </p>

            <a href="#nossas-receitas" className="recipes-intro-link">
              Explorar receitas
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          className="recipes-list-section"
          id="nossas-receitas"
        >
          <div className="container">
            <div className="recipes-list-heading">
              <div>
                <span className="recipes-eyebrow">
                  NOSSA SELEÇÃO
                </span>

                <h2>
                  Escolha sua próxima
                  <br />
                  <span>receita favorita.</span>
                </h2>
              </div>

              <p>
                Explore os pratos, confira os ingredientes
                e acompanhe o modo de preparo.
              </p>
            </div>

            <div className="recipes-list-grid">
              {receitas.map((receita, index) => (
                <article
                  className="recipes-list-card"
                  key={receita.id}
                >
                  <div className="recipes-list-image">
                    <img
                      src={receita.imagem}
                      alt={`Imagem ilustrativa de ${receita.nome}`}
                      loading="lazy"
                    />

                    <span className="recipes-image-label">
                      RECEITA 0{index + 1}
                    </span>
                  </div>

                  <div className="recipes-list-info">
                    <span className="recipes-time">
                      <Clock3 size={16} aria-hidden="true" />
                      {receita.tempo} de preparo
                    </span>

                    <h3>{receita.nome}</h3>
                    <p>{receita.descricao}</p>

                    <button
                      type="button"
                      onClick={() => abrirReceita(receita)}
                    >
                      Ver receita completa
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <p className="recipes-disclaimer">
              Imagens ilustrativas. Os tempos de preparo são estimados.
            </p>
          </div>
        </section>

        <section className="recipes-bottom">
          <div className="container recipes-bottom-content">
            <div>
              <span className="recipes-eyebrow">
                CAMARÁ DISTRIBUIDORA
              </span>

              <h2>
                Toda boa receita
                <br />
                começa com uma escolha.
              </h2>

              <p>
                Conheça os produtos disponíveis
                no catálogo da Camará Distribuidora.
              </p>
            </div>

            <a href="/produtos" className="recipes-bottom-button">
              Conhecer produtos
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          </div>
        </section>

        {receitaSelecionada && (
          <div
            className="recipe-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                fecharReceita();
              }
            }}
          >
            <section
              ref={modalRef}
              className="recipe-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="recipe-modal-title"
              tabIndex={-1}
            >
              <button
                type="button"
                className="recipe-modal-close"
                aria-label="Fechar receita"
                onClick={fecharReceita}
              >
                <X size={22} aria-hidden="true" />
              </button>

              <div className="recipe-modal-image">
                <img
                  src={receitaSelecionada.imagem}
                  alt={`Imagem ilustrativa de ${receitaSelecionada.nome}`}
                />
              </div>

              <div className="recipe-modal-content">
                <span className="recipes-eyebrow">
                  RECEITA CAMARÁ
                </span>

                <h2 id="recipe-modal-title">
                  {receitaSelecionada.nome}
                </h2>

                <span className="recipes-time">
                  <Clock3 size={16} aria-hidden="true" />
                  Tempo estimado: {receitaSelecionada.tempo}
                </span>

                <div className="recipe-modal-divider" />

                <h3>Ingredientes</h3>

                <ul>
                  {receitaSelecionada.ingredientes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <h3>Modo de preparo</h3>

                <ol>
                  {receitaSelecionada.preparo.map((passo) => (
                    <li key={passo}>{passo}</li>
                  ))}
                </ol>

                <button
                  type="button"
                  className="recipe-back"
                  onClick={fecharReceita}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                  Voltar às receitas
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}