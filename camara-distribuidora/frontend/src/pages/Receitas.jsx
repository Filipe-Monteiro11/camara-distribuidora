import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  X,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { receitasApi } from "../services/api";
import "../styles/Receitas.css";

function normalizarIngredientes(ingredientes) {
  if (Array.isArray(ingredientes)) {
    return ingredientes
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof ingredientes === "string") {
    return ingredientes
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizarPreparo(preparo) {
  if (Array.isArray(preparo)) {
    return preparo
      .map((passo) => String(passo ?? "").trim())
      .filter(Boolean);
  }

  if (typeof preparo === "string") {
    return preparo
      .split(/\r?\n/)
      .map((passo) => passo.trim())
      .filter(Boolean)
      .map((passo) => passo.replace(/^\d+[.)]\s*/, ""));
  }

  return [];
}

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
        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.receitas)
            ? dados.receitas
            : [];

        if (ativo) {
          setReceitas(
            lista.filter((receita) => receita.ativo !== false)
          );
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

  function abrirReceita(receita, elemento) {
    triggerRef.current = elemento;
    setReceitaSelecionada(receita);
  }

  function fecharReceita() {
    setReceitaSelecionada(null);
  }

  useEffect(() => {
    if (!receitaSelecionada) return;

    const overflowAnterior = document.body.style.overflow;
    const elementoAnterior = triggerRef.current;

    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    function aoPressionarTecla(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        fecharReceita();
        return;
      }

      if (evento.key !== "Tab" || !modalRef.current) return;

      const elementos = Array.from(
        modalRef.current.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((elemento) => elemento.getClientRects().length > 0);

      if (!elementos.length) {
        evento.preventDefault();
        modalRef.current.focus();
        return;
      }

      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      const focoAtual = document.activeElement;

      if (
        evento.shiftKey &&
        (focoAtual === primeiro || focoAtual === modalRef.current)
      ) {
        evento.preventDefault();
        ultimo.focus();
      } else if (
        !evento.shiftKey &&
        (focoAtual === ultimo || focoAtual === modalRef.current)
      ) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoPressionarTecla);

      if (elementoAnterior?.isConnected) {
        elementoAnterior.focus();
      }
    };
  }, [receitaSelecionada]);

  const ingredientes = receitaSelecionada
    ? normalizarIngredientes(receitaSelecionada.ingredientes)
    : [];

  const passos = receitaSelecionada
    ? normalizarPreparo(receitaSelecionada.preparo)
    : [];

  return (
    <>
      <Header />

      <main className="recipes-page">
        <section className="recipes-intro">
          <div className="container recipes-intro-content">
            <span className="recipes-eyebrow">
              <ChefHat size={17} aria-hidden="true" />
              INDICAÇÕES DA CAMARÁ
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

            <a
              href="#nossas-receitas"
              className="recipes-intro-link"
            >
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

                    {receita.descricao && (
                      <p>{receita.descricao}</p>
                    )}

                    <button
                      type="button"
                      onClick={(evento) =>
                        abrirReceita(receita, evento.currentTarget)
                      }
                      aria-label={`Ver receita completa de ${receita.titulo}`}
                    >
                      Ver receita completa
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {carregando && (
              <p className="recipes-disclaimer" role="status">
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

                {ingredientes.length > 0 ? (
                  <ul>
                    {ingredientes.map((ingrediente, index) => (
                      <li key={index}>{ingrediente}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Ingredientes não informados.</p>
                )}

                <h3>Modo de preparo</h3>

                {passos.length > 0 ? (
                  <ol>
                    {passos.map((passo, index) => (
                      <li key={index}>{passo}</li>
                    ))}
                  </ol>
                ) : (
                  <p>Modo de preparo não informado.</p>
                )}

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