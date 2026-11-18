import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Package } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProdutoModal from "../components/ProdutoModal";
import { produtosApi } from "../services/api";
import "../styles/Produtos.css";

function ordenarProdutos(lista, tipo) {
  return [...lista].sort((a, b) => {
    const compararNome = () =>
      String(a.nome ?? "").localeCompare(String(b.nome ?? ""), "pt-BR");

    if (tipo === "nome") {
      return compararNome();
    }

    if (tipo === "vendidos") {
      return (
        Number(b.maisVendido === true) -
          Number(a.maisVendido === true) ||
        compararNome()
      );
    }

    if (tipo === "procurados") {
      return (
        Number(b.maisProcurado === true) -
          Number(a.maisProcurado === true) ||
        compararNome()
      );
    }

    const prioridadeA =
      Number(a.prioridade) > 0 ? Number(a.prioridade) : Infinity;

    const prioridadeB =
      Number(b.prioridade) > 0 ? Number(b.prioridade) : Infinity;

    return (
      prioridadeA - prioridadeB ||
      Number(b.maisVendido === true) -
        Number(a.maisVendido === true) ||
      Number(b.maisProcurado === true) -
        Number(a.maisProcurado === true) ||
      compararNome()
    );
  });
}

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [ordenacao, setOrdenacao] = useState("destaques");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const fecharModal = useCallback(() => {
    setSelecionado(null);
  }, []);

  const produtosOrdenados = useMemo(
    () => ordenarProdutos(produtos, ordenacao),
    [produtos, ordenacao]
  );

  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
        const dados = await produtosApi.listar();

        const lista = Array.isArray(dados)
          ? dados
          : dados?.produtos ?? [];

        if (ativo) {
          setProdutos(
            lista.filter((produto) => produto.ativo !== false)
          );
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar os produtos.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <>
      <Header />

      <main className="catalog-page">
        <section className="catalog-intro">
          <div className="container catalog-intro-content">
            <span className="eyebrow">
              CAMARÁ DISTRIBUIDORA
            </span>

            <h1>
              Nosso <span>catálogo.</span>
            </h1>

            <p>
              Conheça nossa linha de produtos e entre em contato
              para consultar informações e disponibilidade.
            </p>

            <a
              href="#nossos-produtos"
              className="catalog-hero-link"
            >
              Explorar nossos produtos
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          className="catalog-section"
          id="nossos-produtos"
        >
          <div className="container">
            <div className="catalog-heading">
              <span className="eyebrow">
                NOSSOS PRODUTOS
              </span>

              <h2>Conheça nossas opções</h2>

              <p>
                Confira os produtos disponíveis em nosso catálogo.
              </p>
            </div>

            <div className="catalog-sort">
              <label htmlFor="ordenacao-produtos">
                Ordenar por
              </label>

              <select
                id="ordenacao-produtos"
                value={ordenacao}
                onChange={(evento) =>
                  setOrdenacao(evento.target.value)
                }
              >
                <option value="destaques">Destaques</option>
                <option value="vendidos">Mais vendidos</option>
                <option value="procurados">Mais procurados</option>
                <option value="nome">Nome (A–Z)</option>
              </select>
            </div>

            <div className="catalog-grid">
              {produtosOrdenados.map((produto) => (
                <article
                  className="catalog-card"
                  key={produto.id}
                >
                  <button
                    type="button"
                    className="catalog-image"
                    onClick={() => setSelecionado(produto)}
                    aria-label={`Ver detalhes de ${produto.nome}`}
                  >
                    {produto.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        loading="lazy"
                      />
                    ) : (
                      <Package size={38} aria-hidden="true" />
                    )}
                  </button>

                  <div className="catalog-info">
                    {produto.categoria && (
                      <span className="catalog-category">
                        {produto.categoria}
                      </span>
                    )}

                    <h3>{produto.nome}</h3>

                    <p>
                      {produto.descricao ||
                        "Descrição não disponível."}
                    </p>

                    <button
                      type="button"
                      className="catalog-details-button"
                      onClick={() => setSelecionado(produto)}
                    >
                      Conhecer produto
                      <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {carregando && (
              <p className="catalog-empty" role="status">
                Carregando produtos...
              </p>
            )}

            {!carregando && erro && (
              <p className="catalog-empty" role="alert">
                {erro}
              </p>
            )}

            {!carregando &&
              !erro &&
              produtos.length === 0 && (
                <p className="catalog-empty">
                  Nenhum produto disponível no momento.
                </p>
              )}
          </div>
        </section>
      </main>

      <Footer />

      <ProdutoModal
        produto={selecionado}
        onClose={fecharModal}
      />
    </>
  );
}