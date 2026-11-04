import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

const produtos = [
  {
    nome: "Charque Tradicional",
    descricao: "Conheça nossa seleção de carnes e opções disponíveis.",
    imagem:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85",
  },
  {
    nome: "Cortes Especiais",
    descricao: "Produtos selecionados para diferentes preparações.",
    imagem:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=900&q=85",
  },
  {
    nome: "Linha de Carnes",
    descricao: "Confira as opções do nosso catálogo de produtos.",
    imagem:
      "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=900&q=85",
  },
];

const receitas = [
  {
    nome: "Escondidinho de Charque",
    imagem:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  },
  {
    nome: "Charque com Macaxeira",
    imagem:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="hero" id="inicio">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />

          <div className="container hero-content">
            <span className="eyebrow hero-eyebrow">
              CONHEÇA A CAMARÁ DISTRIBUIDORA
            </span>

            <h1>
              Qualidade que faz
              <br />
              parte da sua <em>mesa.</em>
            </h1>

            <p>
              Conheça nossa linha de produtos e descubra mais sobre
              a Camará Distribuidora.
            </p>

            <div className="hero-actions">
              <a href="#produtos" className="btn btn-yellow">
                Conhecer produtos
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>

              <a href="#sobre" className="btn btn-outline">
                Nossa história
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hero-bottom-line" aria-hidden="true" />
        </section>

        <section className="highlights" aria-label="Conheça a Camará">
          <div className="container highlights-grid">
            <div>
              <PackageCheck size={29} aria-hidden="true" />
              <span>Conheça nossos produtos</span>
            </div>

            <div>
              <ShieldCheck size={29} aria-hidden="true" />
              <span>Saiba mais sobre a Camará</span>
            </div>

            <div>
              <Truck size={29} aria-hidden="true" />
              <span>Entre em contato com nossa equipe</span>
            </div>
          </div>
        </section>

        <section className="section products-section" id="produtos">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">NOSSO CATÁLOGO</span>
                <h2>
                  Conheça nossos <span>produtos.</span>
                </h2>
              </div>

              <p>
                Explore nossa linha de carnes e conheça as opções
                disponíveis em nosso catálogo.
              </p>
            </div>

            <div className="products-grid">
              {produtos.map((produto) => (
                <article className="product-card" key={produto.nome}>
                  <div className="product-image">
                    <img
                      src={produto.imagem}
                      alt={`Imagem ilustrativa de ${produto.nome}`}
                      loading="lazy"
                    />

                    <a href="#contato" className="product-overlay">
                      Conversar com atendente
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </div>

                  <div className="product-info">
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>

                    <a href="#contato">
                      Saiba mais
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="section-action">
              <a href="#contato" className="btn btn-red">
                Solicitar catálogo
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="about-section" id="sobre">
          <div className="about-photo">
            <img
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85"
              alt="Imagem ilustrativa de ambiente industrial"
              loading="lazy"
            />

            <span className="image-note">Imagem ilustrativa</span>
          </div>

          <div className="about-content">
            <span className="eyebrow">SOBRE A CAMARÁ</span>

            <h2>
              Uma história para
              <br />
              <span>compartilhar.</span>
            </h2>

            <p>
              Toda empresa tem uma trajetória. Aqui você poderá
              conhecer a história da Camará, a origem de sua marca
              e os caminhos que fazem parte de sua identidade.
            </p>

            <p>
              Em breve, este espaço receberá as informações
              e fotografias oficiais da empresa.
            </p>

            <a href="#contato" className="btn btn-red">
              Conheça nossa história
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="section recipes-section" id="receitas">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">SABORES E INSPIRAÇÕES</span>

                <h2>
                  Receitas para <span>experimentar.</span>
                </h2>
              </div>

              <p>
                Descubra ideias de pratos e diferentes maneiras
                de preparar receitas com charque.
              </p>
            </div>

            <div className="recipes-grid">
              {receitas.map((receita) => (
                <article className="recipe-card" key={receita.nome}>
                  <img
                    src={receita.imagem}
                    alt={`Imagem ilustrativa de ${receita.nome}`}
                    loading="lazy"
                  />

                  <div className="recipe-content">
                    <span>RECEITAS</span>
                    <h3>{receita.nome}</h3>

                    <a href="#contato">
                      Ver receita
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="location-section" id="localizacao">
          <div className="container location-content">
            <div>
              <span className="eyebrow">ONDE ESTAMOS</span>

              <h2>
                Venha conhecer a <span>Camará.</span>
              </h2>

              <p>
                Rua Exemplo, nº 100, Recife - PE
                <br />
                CEP: 00000-000
                <br />
                <small>Endereço ilustrativo para demonstração.</small>
              </p>

              <a href="#contato" className="btn btn-red">
                Entre em contato
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>

            <div className="location-placeholder">
              <MapPin size={42} aria-hidden="true" />
              <strong>Camará Distribuidora</strong>
              <span>Recife - Pernambuco</span>
              <span>Endereço ilustrativo</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}