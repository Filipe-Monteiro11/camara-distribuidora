import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Package,
  ShieldCheck,
  Truck
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProdutoModal from "../components/ProdutoModal";
import { produtosApi, receitasApi } from "../services/api";
import "../styles/Home.css";

function ordenarDestaques(lista) {
  return [...lista].sort((a, b) => {
    const prioridadeA = a.prioridade > 0 ? a.prioridade : Infinity;
    const prioridadeB = b.prioridade > 0 ? b.prioridade : Infinity;

    return (
      prioridadeA - prioridadeB ||
      Number(b.maisVendido === true) -
        Number(a.maisVendido === true) ||
      Number(b.maisProcurado === true) -
        Number(a.maisProcurado === true) ||
      a.nome.localeCompare(b.nome, "pt-BR")
    );
  });
}

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [carregandoReceitas, setCarregandoReceitas] = useState(true);
  const [erroProdutos, setErroProdutos] = useState(false);
  const [erroReceitas, setErroReceitas] = useState(false);

  const fecharModal = useCallback(() => {
    setProdutoSelecionado(null);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const [resultadoProdutos, resultadoReceitas] =
        await Promise.allSettled([
          produtosApi.listar(),
          receitasApi.listar()
        ]);

      if (!ativo) return;

      if (resultadoProdutos.status === "fulfilled") {
        const dados = resultadoProdutos.value;
        const lista = Array.isArray(dados)
          ? dados
          : dados?.produtos ?? [];

        setProdutos(
          ordenarDestaques(
            lista.filter((item) => item.ativo !== false)
          ).slice(0, 3)
        );
      } else {
        setErroProdutos(true);
      }

      if (resultadoReceitas.status === "fulfilled") {
        const dados = resultadoReceitas.value;
        const lista = Array.isArray(dados)
          ? dados
          : dados?.receitas ?? [];

        setReceitas(
          lista.filter((item) => item.ativo !== false).slice(0, 3)
        );
      } else {
        setErroReceitas(true);
      }

      setCarregandoProdutos(false);
      setCarregandoReceitas(false);
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

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
                <article className="product-card" key={produto.id}>
                  <div className="product-image">
                    {produto.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        <Package size={36} />
                      </div>
                    )}

                    <button
                      type="button"
                      className="product-overlay"
                      onClick={() => setProdutoSelecionado(produto)}
                      aria-label={`Ver detalhes de ${produto.nome}`}
                    >
                      <ArrowUpRight size={23} />
                    </button>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {produto.categoria}
                    </span>

                    <h3>{produto.nome}</h3>

                    <p>
                      {produto.descricao || "Descrição não disponível."}
                    </p>

                    <button
                      type="button"
                      className="product-details-button"
                      onClick={() => setProdutoSelecionado(produto)}
                    >
                      Conhecer produto
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {carregandoProdutos && (
              <p>Carregando produtos...</p>
            )}

            {!carregandoProdutos && erroProdutos && (
              <p role="alert">
                Não foi possível carregar os produtos.
              </p>
            )}

            {!carregandoProdutos &&
              !erroProdutos &&
              produtos.length === 0 && (
                <p>Nenhum produto disponível no momento.</p>
              )}

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
                <article className="recipe-card" key={receita.id}>
                  {receita.imagem && (
                    <img
                      src={receita.imagem}
                      alt={receita.titulo}
                      loading="lazy"
                    />
                  )}

                  <div className="recipe-content">
                    <span>
                      RECEITA {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{receita.titulo}</h3>

                    <span className="recipe-note">
                      Conheça nossas receitas
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {carregandoReceitas && (
              <p>Carregando receitas...</p>
            )}

            {!carregandoReceitas && erroReceitas && (
              <p role="alert">
                Não foi possível carregar as receitas.
              </p>
            )}

            {!carregandoReceitas &&
              !erroReceitas &&
              receitas.length === 0 && (
                <p>Nenhuma receita disponível no momento.</p>
              )}

            <div className="section-action">
              <Link to="/receitas" className="btn btn-red">
                Ver todas as receitas
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="location-section" id="localizacao">
          <div className="container location-content">
            <div className="location-text">
              <span className="eyebrow">LOCALIZAÇÃO</span>

              <h2>
                Estamos prontos
                <br />
                para <span>conversar.</span>
              </h2>

              <p>
                Visite a Camará Distribuidora na Rua Manoel Honorato
                da Costa, nº 556, Vila da Fábrica, Camaragibe – PE,
                CEP 54759-475.
              </p>

              <a href="#contato" className="btn btn-red">
                Entre em contato
                <ArrowUpRight size={18} />
              </a>
            </div>

            <a
              className="location-placeholder location-map-link"
              href="https://www.google.com/maps/search/?api=1&query=Rua%20Manoel%20Honorato%20da%20Costa%20556%20Vila%20da%20F%C3%A1brica%20Camaragibe%20PE%2054759-475"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver endereço da Camará Distribuidora no Google Maps"
            >
              <MapPin size={45} strokeWidth={1.5} />
              <strong>Camará Distribuidora</strong>
              <span>Rua Manoel Honorato da Costa, 556</span>
              <span>Vila da Fábrica, Camaragibe – PE</span>
              <span>Ver no Google Maps ↗</span>
            </a>
          </div>
        </section>

      </main>

      <Footer />

      <ProdutoModal
        produto={produtoSelecionado}
        onClose={fecharModal}
      />
    </>
  );
}