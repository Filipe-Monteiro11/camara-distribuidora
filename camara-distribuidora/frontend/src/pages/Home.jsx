import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Home.css";

const produtos = [
  {
    nome: "Charque Tradicional",
    categoria: "LINHA DE CHARQUE",
    descricao: "Conheça as opções disponíveis em nosso catálogo.",
    imagem:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=85",
  },
  {
    nome: "Cortes Especiais",
    categoria: "SELEÇÃO DE CARNES",
    descricao: "Explore nossa seleção de cortes e produtos.",
    imagem:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1000&q=85",
  },
  {
    nome: "Linha de Carnes",
    categoria: "NOSSO CATÁLOGO",
    descricao: "Descubra as opções para diferentes preparações.",
    imagem:
      "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=1000&q=85",
  },
];

const receitas = [
  {
    nome: "Escondidinho de Charque",
    imagem:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  },
  {
    nome: "Charque com Macaxeira",
    imagem:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85",
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
            <span className="hero-tag">
              CAMARÁ DISTRIBUIDORA
            </span>

            <h1>
              O sabor da tradição
              <br />
              em cada <em>escolha.</em>
            </h1>

            <p>
              Conheça a Camará Distribuidora e explore nossa
              seleção de carnes e produtos para diferentes
              momentos à mesa.
            </p>

            <div className="hero-actions">
              <Link to="/produtos" className="btn btn-yellow">
                Explorar produtos
                <ArrowUpRight size={18} />
              </Link>

              <Link to="/sobre" className="hero-secondary">
                Conheça a Camará
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="hero-caption">
              <span className="hero-caption-line" />
              CONHEÇA NOSSA MARCA
            </div>
          </div>
        </section>

        <section className="highlights">
          <div className="container highlights-grid">
            <div className="highlight-item">
              <Package size={30} strokeWidth={1.6} />
              <div>
                <strong>Nosso catálogo</strong>
                <span>Explore nossas linhas de produtos</span>
              </div>
            </div>

            <div className="highlight-item">
              <ShieldCheck size={30} strokeWidth={1.6} />
              <div>
                <strong>Conheça a Camará</strong>
                <span>Saiba mais sobre nossa identidade</span>
              </div>
            </div>

            <div className="highlight-item">
              <Truck size={30} strokeWidth={1.6} />
              <div>
                <strong>Atendimento</strong>
                <span>Fale com nossa equipe</span>
              </div>
            </div>
          </div>
        </section>

        <section className="home-intro">
          <div className="container home-intro-grid">
            <div>
              <span className="eyebrow">
                BEM-VINDO À CAMARÁ
              </span>

              <h2>
                Uma marca para
                <br />
                conhecer de perto.
              </h2>
            </div>

            <div className="home-intro-text">
              <p>
                A Camará Distribuidora apresenta um espaço
                dedicado aos seus produtos, à sua história
                e ao contato com seus clientes.
              </p>

              <Link to="/sobre" className="text-link">
                Saiba mais sobre nós
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section products-section" id="produtos">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  SELEÇÃO CAMARÁ
                </span>

                <h2>
                  Conheça nossos <span>produtos.</span>
                </h2>
              </div>

              <Link to="/produtos" className="text-link">
                Ver catálogo completo
                <ArrowUpRight size={18} />
              </Link>
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

                    <span className="product-image-label">
                      Imagem ilustrativa
                    </span>

                    <Link
                      to="/produtos"
                      className="product-overlay"
                      aria-label={`Conhecer ${produto.nome}`}
                    >
                      <ArrowUpRight size={23} />
                    </Link>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {produto.categoria}
                    </span>

                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>

                    <Link to="/produtos">
                      Conhecer produto
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="section-action">
              <Link to="/produtos" className="btn btn-red">
                Ver todos os produtos
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="home-about-section" id="sobre">
          <div className="about-photo">
            <img
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85"
              alt="Imagem ilustrativa de ambiente industrial"
              loading="lazy"
            />

            <span className="image-note">
              Imagem ilustrativa
            </span>
          </div>

          <div className="home-about-content">
            <span className="eyebrow">
              NOSSA HISTÓRIA
            </span>

            <h2>
              Muito mais que
              <br />
              <span>uma marca.</span>
            </h2>

            <p>
              Toda empresa tem uma história. A Camará
              também tem uma trajetória, uma identidade
              e pessoas que fazem parte dela.
            </p>

            <p>
              Conheça o espaço dedicado à história
              da distribuidora, à origem da marca
              e à sua estrutura.
            </p>

            <div className="about-check">
              <Check size={17} />
              História e identidade da marca
            </div>

            <div className="about-check">
              <Check size={17} />
              Estrutura e informações institucionais
            </div>

            <Link to="/sobre" className="btn btn-red">
              Conheça nossa história
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

        <section className="section recipes-section" id="receitas">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  SABORES E INSPIRAÇÕES
                </span>

                <h2>
                  Da nossa seleção
                  <br />
                  para a <span>sua mesa.</span>
                </h2>
              </div>

              <p>
                Explore inspirações de pratos e descubra
                maneiras de preparar receitas com charque.
              </p>
            </div>

            <div className="recipes-grid">
              {receitas.map((receita, index) => (
                <article className="recipe-card" key={receita.nome}>
                  <img
                    src={receita.imagem}
                    alt={`Imagem ilustrativa de ${receita.nome}`}
                    loading="lazy"
                  />

                  <div className="recipe-content">
                    <span>
                      INSPIRAÇÃO 0{index + 1}
                    </span>

                    <h3>{receita.nome}</h3>

                    <span className="recipe-note">
                      Receita em preparação
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="location-section" id="localizacao">
          <div className="container location-content">
            <div className="location-text">
              <span className="eyebrow">
                LOCALIZAÇÃO
              </span>

              <h2>
                Estamos prontos
                <br />
                para <span>conversar.</span>
              </h2>

              <p>
                Em breve, disponibilizaremos o endereço
                oficial e mais informações de contato
                da Camará Distribuidora.
              </p>

              <a href="#contato" className="btn btn-red">
                Entre em contato
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="location-placeholder">
              <MapPin size={45} strokeWidth={1.5} />
              <strong>Camará Distribuidora</strong>
              <span>Localização oficial em breve</span>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <div className="container home-cta-content">
            <div>
              <span className="eyebrow">
                CAMARÁ DISTRIBUIDORA
              </span>

              <h2>
                Conheça nossa linha
                <br />
                de produtos.
              </h2>

              <p>
                Explore nosso catálogo e descubra mais
                sobre a Camará.
              </p>
            </div>

            <Link to="/produtos" className="btn btn-yellow">
              Acessar catálogo
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}