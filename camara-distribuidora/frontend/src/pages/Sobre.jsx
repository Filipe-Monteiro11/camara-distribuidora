import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, History, Image } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Sobre.css";

export default function Sobre() {
  return (
    <>
      <Header />

      <main className="about-page">
        <section className="about-hero">
          <div className="container">
            <span className="about-eyebrow">CONHEÇA A CAMARÁ</span>
            <h1>
              Nossa história, <span>nossa essência.</span>
            </h1>
            <p>
              Conheça mais sobre a Camará Distribuidora, sua
              trajetória e a identidade da marca.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="container about-grid">
            <div className="about-image-placeholder">
              <Building2 size={48} strokeWidth={1.4} />
              <span>Foto oficial da empresa</span>
            </div>

            <div className="about-content">
              <span className="about-eyebrow">
                <History size={17} />
                NOSSA TRAJETÓRIA
              </span>

              <h2>Uma história para contar</h2>

              <p>
                Este espaço será dedicado à história da Camará
                Distribuidora, desde sua fundação até os dias atuais.
              </p>

              <p>
                Aqui apresentaremos as principais conquistas, os
                valores e os momentos que marcaram o crescimento
                da empresa.
              </p>

              <span className="about-pending">
                Conteúdo oficial a ser fornecido pela empresa.
              </span>
            </div>
          </div>
        </section>

        <section className="about-section about-logo-section">
          <div className="container about-grid">
            <div className="about-content">
              <span className="about-eyebrow">
                <History size={17} />
                NOSSA IDENTIDADE
              </span>

              <h2>A história da nossa marca</h2>

              <p>
                A logomarca é parte importante da identidade de
                uma empresa. Nesta seção, vamos apresentar a
                origem da marca Camará e o significado de seus
                elementos visuais.
              </p>

              <span className="about-pending">
                Aguardando a história e a logomarca oficiais.
              </span>
            </div>

            <div className="about-logo-placeholder">
              <span className="about-logo-name">CAMARÁ</span>
              <span className="about-logo-subtitle">
                DISTRIBUIDORA
              </span>
              <small>Identidade visual provisória</small>
            </div>
          </div>
        </section>

        <section className="about-gallery-section">
          <div className="container">
            <div className="about-gallery-heading">
              <span className="about-eyebrow">
                <Image size={17} />
                NOSSA ESTRUTURA
              </span>

              <h2>Conheça nossa estrutura</h2>
              <p>
                Em breve, fotos das instalações e das indústrias
                relacionadas à Camará Distribuidora.
              </p>
            </div>

            <div className="about-gallery">
              {[1, 2, 3].map((item) => (
                <div className="about-gallery-placeholder" key={item}>
                  <Image size={30} strokeWidth={1.4} />
                  <span>Foto {item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="container about-cta-content">
            <div>
              <span>CAMARÁ DISTRIBUIDORA</span>
              <h2>Conheça nossos produtos</h2>
              <p>
                Explore o catálogo e descubra os produtos da Camará.
              </p>
            </div>

            <Link to="/produtos">
              Ver produtos
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}