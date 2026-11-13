import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Camera,
  Flower2,
  History,
  Images,
  MapPin,
  Truck,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Sobre.css";

const trajetoria = [
  {
    ano: "2009",
    titulo: "O início da nossa história",
    descricao:
      "A Camará Distribuidora nasce da visão empreendedora de Cícero, inicialmente atendendo um pequeno grupo de clientes no setor alimentício.",
  },
  {
    ano: "2015",
    titulo: "Um novo passo na CEASA",
    descricao:
      "A conquista de um ponto comercial na CEASA amplia a visibilidade da empresa e impulsiona suas vendas.",
  },
  {
    ano: "RECOMEÇO",
    titulo: "Novos caminhos em Camaragibe",
    descricao:
      "Para reduzir custos e oferecer preços competitivos, a empresa transfere suas operações para a garagem de casa.",
  },
  {
    ano: "CRESCIMENTO",
    titulo: "Estrutura e consolidação",
    descricao:
      "A empresa conquista sua sede própria, estrutura a frota de entregas e amplia suas equipes comercial, administrativa e logística.",
  },
  {
    ano: "HOJE",
    titulo: "Uma trajetória em evolução",
    descricao:
      "A Camará continua crescendo, fortalecendo parcerias e valorizando as pessoas que fazem parte de sua história.",
  },
];

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
        {/* APRESENTAÇÃO */}

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
              Conheça a trajetória da Camará Distribuidora,
              as conquistas que marcaram nosso crescimento
              e a identidade que representa nossas origens.
            </p>

            <a
              href="#nossa-historia"
              className="about-hero-link"
            >
              Conheça nossa história
              <ArrowRight size={18} />
            </a>
          </div>
        </section>

        {/* NOSSA HISTÓRIA */}

        <section
          className="about-story-section"
          id="nossa-historia"
        >
          <div className="container">
            <div className="about-story-grid">
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
                  Uma história de
                  <br />
                  <span>determinação e crescimento.</span>
                </h2>

                <p>
                  A Camará Distribuidora nasceu em 2009,
                  a partir da visão empreendedora de Cícero
                  e de uma oportunidade no setor de
                  distribuição de alimentos.
                </p>

                <p>
                  Na época, a empresa atuava na representação
                  da Frinance Alimentos, atendendo grandes
                  redes de supermercados. Ao perceber que
                  alguns clientes tinham dificuldades para
                  adquirir produtos de fornecedores de outros
                  estados, surgiu a ideia de criar uma
                  distribuidora própria, inicialmente voltada
                  ao atendimento de apenas três ou quatro
                  clientes.
                </p>

                <p>
                  Em 2015, a empresa deu um passo importante
                  ao conquistar um ponto comercial na CEASA,
                  ampliando sua visibilidade e suas vendas.
                  Entretanto, os altos custos operacionais
                  tornaram difícil manter as atividades
                  no local.
                </p>
              </div>
            </div>

            <div className="about-story-continuation">
              <div className="about-story-text">
                <p>
                  Por isso, a Camará transferiu suas operações
                  para Camaragibe, recomeçando de forma simples,
                  na garagem de casa.
                </p>

                <p>
                  A mudança permitiu reduzir custos e oferecer
                  preços mais competitivos, sem abrir mão da
                  qualidade dos produtos e do compromisso
                  com os clientes.
                </p>
              </div>

              <div className="about-story-text">
                <p>
                  Com o passar dos anos, o trabalho e a dedicação
                  trouxeram novos resultados. A empresa conquistou
                  sua sede própria, localizada em frente ao
                  Shopping Camará, estruturou sua frota de entregas
                  e ampliou as equipes comercial, administrativa
                  e logística.
                </p>

                <p>
                  Hoje, a Camará Distribuidora continua crescendo,
                  fortalecendo parcerias e valorizando as pessoas
                  que fazem parte dessa trajetória.
                </p>
              </div>
            </div>

            <div className="about-info-note">
              <Building2 size={21} />

              <p>
                Mais do que uma empresa, somos o resultado de
                uma história construída com trabalho,
                determinação, disciplina e vontade de crescer.
              </p>
            </div>
          </div>
        </section>

        {/* LINHA DO TEMPO */}

        <section className="about-timeline-section">
          <div className="container">
            <div className="about-section-heading">
              <span className="about-eyebrow">
                <History size={17} />
                NOSSA EVOLUÇÃO
              </span>

              <h2>
                Nossa trajetória
                <br />
                <span>ao longo dos anos.</span>
              </h2>

              <p>
                Cada etapa representa o esforço, as decisões
                e as conquistas que ajudaram a construir
                a Camará Distribuidora.
              </p>
            </div>

            <div className="about-timeline">
              {trajetoria.map((item) => (
                <article
                  className="about-timeline-item"
                  key={item.ano}
                >
                  <div className="about-timeline-card">
                    <span className="about-timeline-year">
                      {item.ano}
                    </span>

                    <h3>{item.titulo}</h3>
                    <p>{item.descricao}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HISTÓRIA DA LOGOMARCA */}

        <section className="about-identity-section">
          <div className="container about-identity-grid">
            <div className="about-identity-content">
              <span className="about-eyebrow">
                <Flower2 size={17} />
                NOSSA IDENTIDADE
              </span>

              <h2>
                A história da
                <br />
                <span>nossa logomarca.</span>
              </h2>

              <p>
                A logomarca da Camará Distribuidora foi
                desenvolvida para representar a essência
                da empresa, sua história e sua área de atuação.
                Para isso, o projeto partiu de um estudo sobre
                a origem do negócio, suas atividades e o
                significado do nome Camará.
              </p>

              <p>
                O nome faz referência à flor Camará, que deu
                origem ao nome da cidade de Camaragibe,
                em Pernambuco. Essa ligação com a identidade
                local inspirou a escolha do nome da empresa,
                reforçando suas raízes e sua conexão com
                a cidade.
              </p>

              <p>
                Na construção da identidade visual, foram
                unidas as letras C e D, iniciais de
                Camará Distribuidora.
              </p>

              <p>
                O símbolo também traz uma combinação de dois
                elementos: a pétala da flor Camará, que
                representa nossa origem, e o símbolo de
                localização, que remete à distribuição e à
                presença da empresa em diferentes lugares.
              </p>

              <p>
                Essa união forma a extremidade característica
                da logomarca, traduzindo visualmente a proposta
                da empresa: levar seus produtos a diversos
                destinos sem perder a conexão com suas origens.
              </p>

              <p>
                Mais do que um símbolo, nossa logomarca conta
                um pouco da nossa história e representa o
                orgulho de nossas raízes, nossa identidade
                e nosso compromisso em estar presente onde
                nossos clientes precisam.
              </p>

              <div className="about-symbol-details">
                <div>
                  <Flower2 size={17} />
                  Origem e raízes
                </div>

                <div>
                  <MapPin size={17} />
                  Presença e distribuição
                </div>

                <div>
                  <Truck size={17} />
                  Compromisso com os clientes
                </div>
              </div>
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

        {/* GALERIA */}

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
                Um espaço reservado para apresentar fotografias
                das instalações, ambientes e estruturas
                relacionadas à empresa.
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