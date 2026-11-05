import { useEffect, useState } from "react";
import { ImageIcon, Play, X, ArrowUpRight } from "lucide-react";
import {
  categoriasGaleria,
  publicacoesGaleria,
} from "../data/galeria";
import "../styles/Galeria.css";

const GALERIA_KEY = "camara-galeria";

function carregarPublicacoes() {
  try {
    const dados = localStorage.getItem(GALERIA_KEY);
    const publicacoes = dados ? JSON.parse(dados) : publicacoesGaleria;

    return Array.isArray(publicacoes)
      ? publicacoes
      : publicacoesGaleria;
  } catch {
    return publicacoesGaleria;
  }
}

function obterUrlVideo(url) {
  try {
    const endereco = new URL(url);

    if (endereco.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${endereco.pathname.slice(1)}`;
    }

    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(
        endereco.hostname
      )
    ) {
      const id = endereco.searchParams.get("v");

      if (id) return `https://www.youtube.com/embed/${id}`;

      if (endereco.pathname.startsWith("/embed/")) {
        return endereco.href;
      }

      if (endereco.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${endereco.pathname.split("/")[2]}`;
      }
    }

    return "";
  } catch {
    return "";
  }
}

export default function Galeria() {
  const [categoria, setCategoria] = useState("Todos");
  const [publicacao, setPublicacao] = useState(null);
  const [publicacoes, setPublicacoes] = useState(carregarPublicacoes);

  useEffect(() => {
    const atualizarPublicacoes = () => {
      setPublicacoes(carregarPublicacoes());
    };

    window.addEventListener("storage", atualizarPublicacoes);
    window.addEventListener("focus", atualizarPublicacoes);

    return () => {
      window.removeEventListener("storage", atualizarPublicacoes);
      window.removeEventListener("focus", atualizarPublicacoes);
    };
  }, []);

  useEffect(() => {
    if (!publicacao) return;

    const fechar = (evento) => {
      if (evento.key === "Escape") {
        setPublicacao(null);
      }
    };

    document.addEventListener("keydown", fechar);

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", fechar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [publicacao]);

  const publicacoesFiltradas = publicacoes.filter(
    (item) =>
      item.ativo !== false &&
      (categoria === "Todos" || item.categoria === categoria)
  );

  function abrirPublicacao(item) {
    const disponivel =
      item.tipo === "video"
        ? Boolean(obterUrlVideo(item.video))
        : Boolean(item.imagem);

    if (disponivel) {
      setPublicacao(item);
    }
  }

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
            <ArrowUpRight size={18} />
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
            {publicacoesFiltradas.map((item) => {
              const disponivel =
                item.tipo === "video"
                  ? Boolean(obterUrlVideo(item.video))
                  : Boolean(item.imagem);

              return (
                <article className="gallery-card" key={item.id}>
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
                          <Play size={35} />
                        ) : (
                          <ImageIcon size={35} />
                        )}

                        <span>Conteúdo em breve</span>
                      </div>
                    )}

                    <span className="gallery-card-category">
                      {item.categoria}
                    </span>

                    {item.tipo === "video" && (
                      <span className="gallery-video-icon">
                        <Play size={19} fill="currentColor" />
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
                    <p>{item.descricao}</p>

                    <button
                      type="button"
                      disabled={!disponivel}
                      onClick={() => abrirPublicacao(item)}
                    >
                      {disponivel ? "Visualizar" : "Em breve"}
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {publicacoesFiltradas.length === 0 && (
            <p className="gallery-notice">
              Nenhuma publicação disponível nesta categoria.
            </p>
          )}

          <p className="gallery-notice">
            Conteúdos ilustrativos do protótipo.
            As publicações oficiais serão adicionadas
            posteriormente.
          </p>
        </div>
      </section>

      <section className="gallery-bottom">
        <div className="container gallery-bottom-content">
          <div>
            <span className="gallery-eyebrow">
              FIQUE POR DENTRO
            </span>

            <h2>Acompanhe a nossa jornada</h2>

            <p>
              Em breve, novos registros, produtos
              e momentos especiais por aqui.
            </p>
          </div>
        </div>
      </section>

      {publicacao && (
        <div
          className="gallery-modal-backdrop"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setPublicacao(null);
            }
          }}
        >
          <div
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-label={publicacao.titulo}
          >
            <button
              type="button"
              className="gallery-modal-close"
              onClick={() => setPublicacao(null)}
              aria-label="Fechar"
              autoFocus
            >
              <X size={22} />
            </button>

            {publicacao.tipo === "foto" ? (
              <img
                src={publicacao.imagem}
                alt={publicacao.titulo}
              />
            ) : (
              <iframe
                src={obterUrlVideo(publicacao.video)}
                title={publicacao.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            <div className="gallery-modal-info">
              <h3>{publicacao.titulo}</h3>
              <p>{publicacao.descricao}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}