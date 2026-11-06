import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  X
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { receitasApi } from "../services/api";
import "../styles/Receitas.css";

export default function Receitas() {
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    let ativo = true;

    async function carregarReceitas() {
      try {
        const dados = await receitasApi.listar();

        if (ativo) {
          setReceitas(Array.isArray(dados) ? dados : []);
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar as receitas.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarReceitas();

    return () => {
      ativo = false;
    };
  }, []);

  function abrirReceita(receita) {
    triggerRef.current = document.activeElement;
    setReceitaSelecionada(receita);
  }

  function fecharReceita() {
    setReceitaSelecionada(null);
  }

  useEffect(() => {
    if (!receitaSelecionada) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    function aoPressionarTecla(evento) {
      if (evento.key === "Escape") {
        fecharReceita();
        return;
      }

      if (evento.key !== "Tab" || !modalRef.current) return;

      const elementos = Array.from(
        modalRef.current.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )
      );

      if (!elementos.length) {
        evento.preventDefault();
        return;
      }

      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoPressionarTecla);
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
                  style={{ position: "relative" }}
                >
                  <div className="recipes-list-image">
                    {receita.imagem && (
                      <img
                        src={receita.imagem}
                        alt={receita.titulo}
                        loading="lazy"
                      />
                    )}

                    <span className="recipes-image-label">
                      RECEITA {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="recipes-list-info">
                    <h3>{receita.titulo}</h3>
                    <p>{receita.descricao}</p>

                    <button
                      type="button"
                      onClick={() => abrirReceita(receita)}
                      aria-label={`Ver receita completa de ${receita.titulo}`}
                    >
                      Ver receita completa
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Abrir detalhes de ${receita.titulo}`}
                    onClick={() => abrirReceita(receita)}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                      border: 0,
                      padding: 0
                    }}
                  />
                </article>
              ))}
            </div>

            {carregando && (
              <p className="recipes-disclaimer">
                Carregando receitas...
              </p>
            )}

            {!carregando && erro && (
              <p className="recipes-disclaimer" role="alert">
                {erro}
              </p>
            )}

            {!carregando && !erro && receitas.length === 0 && (
              <p className="recipes-disclaimer">
                Nenhuma receita disponível no momento.
              </p>
            )}
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

            <a
              href="/produtos"
              className="recipes-bottom-button"
            >
              Conhecer produtos
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          </div>
        </section>

        {receitaSelecionada && (
          <div
            className="recipe-modal-backdrop"
            onMouseDown={(evento) => {
              if (evento.target === evento.currentTarget) {
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

              {receitaSelecionada.imagem && (
                <div className="recipe-modal-image">
                  <img
                    src={receitaSelecionada.imagem}
                    alt={receitaSelecionada.titulo}
                  />
                </div>
              )}

              <div className="recipe-modal-content">
                <span className="recipes-eyebrow">
                  RECEITA CAMARÁ
                </span>

                <h2 id="recipe-modal-title">
                  {receitaSelecionada.titulo}
                </h2>

                {receitaSelecionada.descricao && (
                  <p>{receitaSelecionada.descricao}</p>
                )}

                <div className="recipe-modal-divider" />

                <h3>Ingredientes</h3>

                <ul>
                  {receitaSelecionada.ingredientes.map(
                    (ingrediente, index) => (
                      <li key={index}>{ingrediente}</li>
                    )
                  )}
                </ul>

                <h3>Modo de preparo</h3>

                <ol>
                  {receitaSelecionada.preparo
                    .split("\n")
                    .map((passo) => passo.trim())
                    .filter(Boolean)
                    .map((passo, index) => (
                      <li key={index}>
                        {passo.replace(/^\d+[.)]\s*/, "")}
                      </li>
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