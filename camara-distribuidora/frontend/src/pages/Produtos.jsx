import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Produtos.css";

const produtos = [
  {
    id: 1,
    nome: "Charque Tradicional",
    descricao: "Conheça nossa linha de charques e opções disponíveis.",
    imagem:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    nome: "Cortes Especiais",
    descricao: "Confira os cortes e produtos disponíveis no catálogo.",
    imagem:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    nome: "Linha de Carnes",
    descricao: "Explore as opções da nossa linha de produtos.",
    imagem:
      "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Produtos() {
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
              {produtos.map((produto) => (
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
                      <ArrowUpRight size={17} aria-hidden="true" />
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