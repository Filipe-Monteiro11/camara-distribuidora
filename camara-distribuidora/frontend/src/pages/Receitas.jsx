import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Clock, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Receitas.css";

const receitas = [
  {
    id: 1,
    nome: "Escondidinho de Charque",
    descricao: "Uma combinação de charque desfiado e purê de macaxeira.",
    tempo: "60 min",
    imagem:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    ingredientes: [
      "500 g de charque dessalgado e desfiado",
      "1 kg de macaxeira",
      "1 cebola picada",
      "2 dentes de alho",
      "2 colheres de manteiga",
      "200 ml de leite",
      "200 g de queijo muçarela",
      "Sal e temperos a gosto",
    ],
    preparo: [
      "Cozinhe a macaxeira até ficar macia.",
      "Amasse e misture com manteiga e leite até formar um purê.",
      "Refogue a cebola e o alho, acrescente o charque e misture.",
      "Em um refratário, coloque uma camada de purê, o charque e outra camada de purê.",
      "Finalize com queijo e leve ao forno até gratinar.",
    ],
  },
  {
    id: 2,
    nome: "Charque com Macaxeira",
    descricao: "Um prato tradicional, com charque acebolado e macaxeira.",
    tempo: "50 min",
    imagem:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
    ingredientes: [
      "500 g de charque dessalgado",
      "700 g de macaxeira",
      "2 cebolas fatiadas",
      "2 colheres de manteiga",
      "2 dentes de alho",
      "Cheiro-verde a gosto",
    ],
    preparo: [
      "Cozinhe a macaxeira em água até ficar macia.",
      "Cozinhe o charque previamente dessalgado até ficar macio.",
      "Corte o charque em pedaços e doure na manteiga.",
      "Acrescente a cebola e o alho e refogue.",
      "Sirva com a macaxeira e finalize com cheiro-verde.",
    ],
  },
  {
    id: 3,
    nome: "Arroz de Charque",
    descricao: "Uma receita prática e saborosa para o almoço.",
    tempo: "45 min",
    imagem:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
    ingredientes: [
      "300 g de charque dessalgado e desfiado",
      "2 xícaras de arroz",
      "1 cebola picada",
      "2 dentes de alho",
      "1 tomate picado",
      "2 colheres de óleo",
      "Água quente e cheiro-verde a gosto",
    ],
    preparo: [
      "Cozinhe o charque dessalgado até ficar macio e desfie.",
      "Refogue a cebola, o alho e o tomate no óleo.",
      "Acrescente o charque e misture.",
      "Adicione o arroz e a água quente.",
      "Cozinhe até o arroz ficar macio e finalize com cheiro-verde.",
    ],
  },
];

export default function Receitas() {
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  return (
    <>
      <Header />

      <main className="recipes-page">
        <section className="recipes-intro">
          <div className="container">
            <span className="eyebrow">CAMARÁ DISTRIBUIDORA</span>

            <h1>
              Sabores que <span>inspiram.</span>
            </h1>

            <p>
              Descubra receitas com charque para preparar e
              compartilhar em diferentes ocasiões.
            </p>
          </div>
        </section>

        <section className="recipes-list-section">
          <div className="container">
            <div className="recipes-list-heading">
              <span className="eyebrow">NOSSAS RECEITAS</span>
              <h2>Escolha sua próxima receita</h2>
              <p>
                Explore os pratos e confira os ingredientes
                e o modo de preparo.
              </p>
            </div>

            <div className="recipes-list-grid">
              {receitas.map((receita) => (
                <article className="recipes-list-card" key={receita.id}>
                  <div className="recipes-list-image">
                    <img
                      src={receita.imagem}
                      alt={`Imagem ilustrativa de ${receita.nome}`}
                      loading="lazy"
                    />
                  </div>

                  <div className="recipes-list-info">
                    <span className="recipes-time">
                      <Clock size={15} aria-hidden="true" />
                      {receita.tempo}
                    </span>

                    <h3>{receita.nome}</h3>
                    <p>{receita.descricao}</p>

                    <button
                      type="button"
                      onClick={() => setReceitaSelecionada(receita)}
                    >
                      Ver receita
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {receitaSelecionada && (
          <div
            className="recipe-modal-backdrop"
            onClick={() => setReceitaSelecionada(null)}
          >
            <section
              className="recipe-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="recipe-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="recipe-modal-close"
                aria-label="Fechar receita"
                onClick={() => setReceitaSelecionada(null)}
              >
                <X size={22} />
              </button>

              <img
                src={receitaSelecionada.imagem}
                alt={`Imagem ilustrativa de ${receitaSelecionada.nome}`}
              />

              <div className="recipe-modal-content">
                <span className="eyebrow">MODO DE PREPARO</span>
                <h2 id="recipe-modal-title">
                  {receitaSelecionada.nome}
                </h2>

                <p className="recipes-time">
                  <Clock size={16} aria-hidden="true" />
                  Tempo estimado: {receitaSelecionada.tempo}
                </p>

                <h3>Ingredientes</h3>
                <ul>
                  {receitaSelecionada.ingredientes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <h3>Modo de preparo</h3>
                <ol>
                  {receitaSelecionada.preparo.map((passo) => (
                    <li key={passo}>{passo}</li>
                  ))}
                </ol>

                <button
                  type="button"
                  className="recipe-back"
                  onClick={() => setReceitaSelecionada(null)}
                >
                  <ArrowLeft size={17} />
                  Voltar às receitas
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}