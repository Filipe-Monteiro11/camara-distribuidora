import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { produtosApi } from "../services/api";
import "../styles/Produtos.css";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
        const dados = await produtosApi.listar();

        if (ativo) {
          setProdutos(
            Array.isArray(dados) ? dados : dados?.produtos ?? []
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
          <div className="container">
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
          </div>
        </section>

        <section className="catalog-section">
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

            <div className="catalog-grid">
              {produtos.map((produto) => (
                <article
                  className="catalog-card"
                  key={produto.id}
                >
                  <div className="catalog-image">
                    {produto.imagem && (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        loading="lazy"
                      />
                    )}
                  </div>

                  <div className="catalog-info">
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>

                    <a href="/#contato">
                      Consultar produto
                      <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {carregando && (
              <p className="catalog-empty">
                Carregando produtos...
              </p>
            )}

            {!carregando && erro && (
              <p className="catalog-empty" role="alert">
                {erro}
              </p>
            )}

            {!carregando && !erro && produtos.length === 0 && (
              <p className="catalog-empty">
                Nenhum produto disponível no momento.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}