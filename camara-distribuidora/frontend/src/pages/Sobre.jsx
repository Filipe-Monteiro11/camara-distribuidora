import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Camera,
  History,
  Images,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Sobre.css";

const galeria = [
  {
    titulo: "Nossa estrutura",
    descricao: "Fotografias oficiais em breve",
  },
  {
    titulo: "Nossas instalações",
    descricao: "Fotografias oficiais em breve",
  },
  {
    titulo: "Nosso ambiente",
    descricao: "Fotografias oficiais em breve",
  },
];

export default function Sobre() {
  return (
    <>
      <Header />

      <main className="about-page">
        <section className="about-hero">
          <div className="container about-hero-content">
            <span className="about-eyebrow">
              CAMARÁ DISTRIBUIDORA
            </span>

            <h1>
              Nossa história.
              <br />
              Nossa <span>essência.</span>
            </h1>

            <p>
              Conheça a Camará Distribuidora, descubra
              o espaço dedicado à nossa trajetória
              e saiba mais sobre a identidade da marca.
            </p>

            <a href="#nossa-historia" className="about-hero-link">
              Conheça nossa história
              <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section
          className="about-story-section"
          id="nossa-historia"
        >
          <div className="container about-story-grid">
            <div className="about-story-visual">
              <div className="about-story-image">
                <img
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85"
                  alt="Imagem ilustrativa de ambiente industrial"
                  loading="lazy"
                />
              </div>

              <span className="about-image-label">
                IMAGEM ILUSTRATIVA
              </span>
            </div>

            <div className="about-story-content">
              <span className="about-eyebrow">
                <History size={17} />
                NOSSA TRAJETÓRIA
              </span>

              <h2>
                Uma história que
                <br />
                merece ser <span>contada.</span>
              </h2>

              <p>
                Toda empresa tem uma trajetória formada
                por pessoas, experiências e momentos
                importantes.
              </p>

              <p>
                Este espaço será dedicado à história
                oficial da Camará Distribuidora,
                desde sua fundação até os dias atuais.
              </p>

              <p>
                Aqui apresentaremos os principais
                acontecimentos, as conquistas e os
                caminhos que fazem parte de sua identidade.
              </p>

              <div className="about-info-note">
                <Building2 size={19} />
                <span>
                  Aguardando informações históricas
                  oficiais da empresa.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-identity-section">
          <div className="container about-identity-grid">
            <div className="about-identity-content">
              <span className="about-eyebrow">
                NOSSA IDENTIDADE
              </span>

              <h2>
                Uma marca com
                <br />
                <span>identidade própria.</span>
              </h2>

              <p>
                A identidade visual da Camará Distribuidora
                reúne elementos que tornam a marca
                reconhecível e presente em sua comunicação.
              </p>

              <p>
                Com uma composição marcante e cores
                características, nossa logomarca
                representa visualmente a Camará
                Distribuidora.
              </p>
            </div>

            <div className="about-brand-card">
              <div className="about-brand-symbol">
                <img
                  src="/images/logo-camara.png"
                  alt="Logomarca oficial da Camará Distribuidora"
                  loading="lazy"
                />
              </div>

              <div className="about-brand-bottom">
                <span>CAMARÁ DISTRIBUIDORA</span>
                <span>IDENTIDADE VISUAL</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-gallery-section">
          <div className="container">
            <div className="about-gallery-header">
              <div>
                <span className="about-eyebrow">
                  <Images size={17} />
                  NOSSA ESTRUTURA
                </span>

                <h2>
                  Conheça mais
                  <br />
                  sobre a <span>Camará.</span>
                </h2>
              </div>

              <p>
                Um espaço reservado para apresentar
                fotografias das instalações, ambientes
                e estruturas relacionadas à empresa.
              </p>
            </div>

            <div className="about-gallery-grid">
              {galeria.map((item, index) => (
                <article
                  className="about-gallery-card"
                  key={item.titulo}
                >
                  <div className="about-gallery-visual">
                    <Camera size={35} strokeWidth={1.4} />
                    <span>FOTO 0{index + 1}</span>
                  </div>

                  <div className="about-gallery-info">
                    <h3>{item.titulo}</h3>
                    <p>{item.descricao}</p>
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