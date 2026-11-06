import { useEffect, useState } from "react";
import { ImageIcon, Play, X, ArrowUpRight } from "lucide-react";
import { categoriasGaleria } from "../data/galeria";
import { galeriaApi } from "../services/api";
import "../styles/Galeria.css";

function obterUrlVideo(url) {
  try {
    const endereco = new URL(url);
    const hostname = endereco.hostname.toLowerCase();
    let id = "";

    if (hostname === "youtu.be") {
      id = endereco.pathname.split("/")[1];
    } else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(hostname)
    ) {
      if (endereco.pathname === "/watch") {
        id = endereco.searchParams.get("v");
      } else if (
        endereco.pathname.startsWith("/embed/") ||
        endereco.pathname.startsWith("/shorts/")
      ) {
        id = endereco.pathname.split("/")[2];
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id || "")
      ? `https://www.youtube.com/embed/${id}`
      : "";
  } catch {
    return "";
  }
}

export default function Galeria() {
  const [categoria, setCategoria] = useState("Todos");
  const [publicacao, setPublicacao] = useState(null);
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPublicacoes() {
      try {
        const dados = await galeriaApi.listar();

        if (ativo) {
          setPublicacoes(
            Array.isArray(dados) ? dados : dados?.publicacoes ?? []
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

  useEffect(() => {
    if (!publicacao) return;

    function fechar(evento) {
      if (evento.key === "Escape") {
        setPublicacao(null);
      }
    }

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", fechar);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", fechar);
    };
  }, [publicacao]);

  const publicacoesFiltradas = publicacoes.filter(
    (item) =>
      item.ativo !== false &&
      (categoria === "Todos" || item.categoria === categoria)
  );

  function abrirPublicacao(item) {
    setPublicacao(item);
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
            {publicacoesFiltradas.map((item) => (
              <article
                className="gallery-card"
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`Visualizar ${item.titulo}`}
                onClick={() => abrirPublicacao(item)}
                onKeyDown={(evento) => {
                  if (
                    evento.key === "Enter" ||
                    evento.key === " "
                  ) {
                    evento.preventDefault();
                    abrirPublicacao(item);
                  }
                }}
                style={{ cursor: "pointer" }}
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
                </div>
              </article>
            ))}
          </div>

          {carregando && (
            <p className="gallery-notice">
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

            {publicacao.tipo === "video" &&
            obterUrlVideo(publicacao.videoUrl) ? (
              <iframe
                src={obterUrlVideo(publicacao.videoUrl)}
                title={publicacao.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : publicacao.imagem ? (
              <img
                src={publicacao.imagem}
                alt={publicacao.titulo}
              />
            ) : (
              <div className="gallery-placeholder">
                <ImageIcon size={35} />
                <span>Conteúdo em breve</span>
              </div>
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