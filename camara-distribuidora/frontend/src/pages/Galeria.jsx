
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ImageIcon, Play, X } from "lucide-react";

import { categoriasGaleria } from "../data/galeria";
import { galeriaApi } from "../services/api";
import "../styles/Galeria.css";

function obterUrlVideo(url) {
  if (!url || typeof url !== "string") return "";

  try {
    const endereco = new URL(url);
    const hostname = endereco.hostname.toLowerCase();
    let id = "";

    if (hostname === "youtu.be" || hostname === "www.youtu.be") {
      id = endereco.pathname.split("/")[1];
    } else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(
        hostname
      )
    ) {
      if (endereco.pathname === "/watch") {
        id = endereco.searchParams.get("v");
      } else if (
        endereco.pathname.startsWith("/embed/") ||
        endereco.pathname.startsWith("/shorts/") ||
        endereco.pathname.startsWith("/live/")
      ) {
        id = endereco.pathname.split("/")[2];
      }
    } else if (
      ["youtube-nocookie.com", "www.youtube-nocookie.com"].includes(
        hostname
      )
    ) {
      if (endereco.pathname.startsWith("/embed/")) {
        id = endereco.pathname.split("/")[2];
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id || "")
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : "";
  } catch {
    return "";
  }
}

export default function Galeria() {
  const [categoria, setCategoria] = useState("Todos");
  const [publicacoes, setPublicacoes] = useState([]);
  const [publicacao, setPublicacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    let ativo = true;

    async function carregarPublicacoes() {
      try {
        const dados = await galeriaApi.listar();

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.publicacoes)
            ? dados.publicacoes
            : [];

        if (ativo) {
          setPublicacoes(
            lista.filter((item) => item.ativo !== false)
          );
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar a galeria.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPublicacoes();

    return () => {
      ativo = false;
    };
  }, []);

  const publicacoesFiltradas = useMemo(
    () =>
      publicacoes.filter(
        (item) =>
          categoria === "Todos" || item.categoria === categoria
      ),
    [publicacoes, categoria]
  );

  const urlVideo = useMemo(
    () =>
      publicacao?.tipo === "video"
        ? obterUrlVideo(publicacao.videoUrl)
        : "",
    [publicacao]
  );

  function abrirPublicacao(item, elemento) {
    triggerRef.current = elemento;
    setPublicacao(item);
  }

  function fecharPublicacao() {
    setPublicacao(null);
  }

  useEffect(() => {
    if (!publicacao) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    modalRef.current?.focus();

    function aoPressionarTecla(evento) {
      if (evento.key === "Escape") {
        fecharPublicacao();
        return;
      }

      if (evento.key !== "Tab" || !modalRef.current) return;

      const elementos = Array.from(
        modalRef.current.querySelectorAll(
          'button:not([disabled]), a[href], iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (elemento) =>
          elemento.getAttribute("aria-hidden") !== "true"
      );

      if (!elementos.length) {
        evento.preventDefault();
        modalRef.current.focus();
        return;
      }

      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (evento.shiftKey) {
        if (
          document.activeElement === primeiro ||
          document.activeElement === modalRef.current
        ) {
          evento.preventDefault();
          ultimo.focus();
        }
      } else if (
        document.activeElement === ultimo ||
        document.activeElement === modalRef.current
      ) {
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
  }, [publicacao]);

  return (
    <main className="gallery-page">
      <section className="gallery-hero">
        <div className="container gallery-hero-content">
          <span className="gallery-eyebrow">
            CAMARÁ DISTRIBUIDORA
          </span>

          <h1>
            Nossos <span>Momentos</span>
          </h1>

          <p>
            Acompanhe nossas novidades, produtos,
            eventos e momentos especiais.
          </p>

          <a href="#galeria" className="gallery-hero-link">
            Explorar galeria
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="gallery-section" id="galeria">
        <div className="container">
          <div className="gallery-heading">
            <div>
              <span className="gallery-eyebrow">
                NOSSA GALERIA
              </span>

              <h2>
                Um pouco mais da <span>Camará</span>
              </h2>
            </div>

            <p>
              Um espaço para compartilhar novidades,
              experiências e momentos que fazem parte
              da nossa história.
            </p>
          </div>

          <div
            className="gallery-filters"
            role="group"
            aria-label="Filtrar publicações"
          >
            {categoriasGaleria.map((item) => (
              <button
                key={item}
                type="button"
                className={categoria === item ? "active" : ""}
                aria-pressed={categoria === item}
                onClick={() => setCategoria(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {publicacoesFiltradas.map((item) => (
              <article className="gallery-card" key={item.id}>
                <button
                  type="button"
                  className="gallery-card-button"
                  aria-label={`Visualizar ${item.titulo}`}
                  onClick={(evento) =>
                    abrirPublicacao(item, evento.currentTarget)
                  }
                >
                  <div className="gallery-card-media">
                    {item.imagem ? (
                      <img
                        src={item.imagem}
                        alt={item.titulo}
                        loading="lazy"
                      />
                    ) : (
                      <div className="gallery-placeholder">
                        {item.tipo === "video" ? (
                          <Play size={35} aria-hidden="true" />
                        ) : (
                          <ImageIcon
                            size={35}
                            aria-hidden="true"
                          />
                        )}

                        <span>Conteúdo em breve</span>
                      </div>
                    )}

                    {item.categoria && (
                      <span className="gallery-card-category">
                        {item.categoria}
                      </span>
                    )}

                    {item.tipo === "video" && (
                      <span className="gallery-video-icon">
                        <Play
                          size={19}
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </div>

                  <div className="gallery-card-content">
                    <span className="gallery-card-type">
                      {item.tipo === "video"
                        ? "VÍDEO"
                        : "FOTOGRAFIA"}
                    </span>

                    <h3>{item.titulo}</h3>

                    {item.descricao && (
                      <p>{item.descricao}</p>
                    )}

                    <span className="gallery-card-action">
                      Visualizar publicação
                      <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </div>

          {carregando && (
            <p className="gallery-notice" role="status">
              Carregando publicações...
            </p>
          )}

          {!carregando && erro && (
            <p className="gallery-notice" role="alert">
              {erro}
            </p>
          )}

          {!carregando &&
            !erro &&
            publicacoesFiltradas.length === 0 && (
              <p className="gallery-notice">
                Nenhuma publicação disponível nesta categoria.
              </p>
            )}
        </div>
      </section>

      {publicacao && (
        <div
          className="gallery-modal-backdrop"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              fecharPublicacao();
            }
          }}
        >
          <section
            ref={modalRef}
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
            tabIndex={-1}
          >
            <button
              type="button"
              className="gallery-modal-close"
              aria-label="Fechar publicação"
              onClick={fecharPublicacao}
            >
              <X size={22} aria-hidden="true" />
            </button>

            {urlVideo ? (
              <iframe
                src={urlVideo}
                title={publicacao.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : publicacao.imagem ? (
              <img
                src={publicacao.imagem}
                alt={publicacao.titulo}
              />
            ) : (
              <div className="gallery-placeholder gallery-modal-placeholder">
                {publicacao.tipo === "video" ? (
                  <Play size={35} aria-hidden="true" />
                ) : (
                  <ImageIcon size={35} aria-hidden="true" />
                )}

                <span>Conteúdo em breve</span>
              </div>
            )}

            <div className="gallery-modal-info">
              <h2 id="gallery-modal-title">
                {publicacao.titulo}
              </h2>

              {publicacao.descricao && (
                <p>{publicacao.descricao}</p>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
