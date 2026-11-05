import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { produtosIniciais } from "../data/produtos";
import "../styles/Produtos.css";

const STORAGE_KEY = "camara-produtos";

function carregarProdutos() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    const produtos = dados ? JSON.parse(dados) : produtosIniciais;

    return Array.isArray(produtos) ? produtos : produtosIniciais;
  } catch {
    return produtosIniciais;
  }
}

export default function Produtos() {
  const [produtos, setProdutos] = useState(carregarProdutos);

  useEffect(() => {
    const atualizarProdutos = (evento) => {
      if (evento.key === STORAGE_KEY) {
        setProdutos(carregarProdutos());
      }
    };

    window.addEventListener("storage", atualizarProdutos);

    return () => {
      window.removeEventListener("storage", atualizarProdutos);
    };
  }, []);

  const produtosAtivos = produtos.filter((produto) => produto.ativo);

  return (
    <>
      <Header />

      <main className="catalog-page">
        <section className="catalog-intro">
          <div className="container">
            <span className="eyebrow">CAMARÁ DISTRIBUIDORA</span>

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
              <span className="eyebrow">NOSSOS PRODUTOS</span>
              <h2>Conheça nossas opções</h2>
              <p>Imagens e informações ilustrativas.</p>
            </div>

            <div className="catalog-grid">
              {produtosAtivos.map((produto) => (
                <article className="catalog-card" key={produto.id}>
                  <div className="catalog-image">
                    <img
                      src={produto.imagem}
                      alt={`Imagem ilustrativa de ${produto.nome}`}
                      loading="lazy"
                    />
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
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}