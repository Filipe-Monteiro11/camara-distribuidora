import { useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Mail,
  ShieldCheck,
  Upload,
  Users,
  X
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { curriculosApi } from "../services/api";
import "../styles/TrabalheConosco.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
  area: "",
  mensagem: ""
};

const areas = [
  "Administrativo",
  "Comercial",
  "Logística",
  "Estoque",
  "Operacional",
  "Outras áreas"
];

const destaques = [
  {
    icon: Users,
    titulo: "Faça parte da equipe",
    descricao:
      "Conheça nosso espaço dedicado a profissionais interessados em fazer parte da Camará."
  },
  {
    icon: BriefcaseBusiness,
    titulo: "Sua área de interesse",
    descricao:
      "Informe a área em que deseja atuar e apresente suas experiências profissionais."
  },
  {
    icon: FileText,
    titulo: "Apresente seu currículo",
    descricao:
      "Envie seu currículo em PDF para futuras oportunidades na distribuidora."
  }
];

export default function TrabalheConosco() {
  const [form, setForm] = useState(initialForm);
  const [curriculo, setCurriculo] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const fileInputRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setErro("");
    setSucesso("");
  }

  function handleFile(event) {
    const file = event.target.files?.[0];

    setErro("");
    setSucesso("");

    if (!file) {
      setCurriculo(null);
      return;
    }

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setErro("Selecione um currículo em formato PDF.");
      event.target.value = "";
      setCurriculo(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErro("O currículo deve ter no máximo 5 MB.");
      event.target.value = "";
      setCurriculo(null);
      return;
    }

    setCurriculo(file);
  }

  function removeFile() {
    setCurriculo(null);
    setErro("");
    setSucesso("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (enviando) return;

    setErro("");
    setSucesso("");

    if (!curriculo) {
      setErro("Anexe seu currículo para continuar.");
      return;
    }

    const dados = new FormData();

    dados.append("nome", form.nome.trim());
    dados.append("email", form.email.trim());
    dados.append("telefone", form.telefone.trim());
    dados.append("area", form.area);
    dados.append("mensagem", form.mensagem.trim());
    dados.append("curriculo", curriculo);
    setEnviando(true);

    try {
      const resposta = await curriculosApi.enviar(dados);

      setSucesso(
        resposta?.message || "Currículo enviado com sucesso!"
      );

      setForm(initialForm);
      setCurriculo(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setErro(
        error.message || "Não foi possível enviar seu currículo."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="careers-page">
        <section className="careers-hero">
          <div className="container careers-hero-content">
            <span className="careers-eyebrow">
              OPORTUNIDADES NA CAMARÁ
            </span>

            <h1>
              Faça parte da
              <br />
              nossa <span>história.</span>
            </h1>

            <p>
              Grandes histórias são construídas por pessoas.
              Conheça nosso espaço dedicado a quem deseja
              fazer parte da Camará Distribuidora.
            </p>

            <a
              href="#candidatura"
              className="careers-hero-link"
            >
              Enviar candidatura
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="careers-intro">
          <div className="container careers-intro-grid">
            <div>
              <span className="careers-section-label">
                TRABALHE CONOSCO
              </span>

              <h2>
                Seu próximo passo
                <br />
                pode começar <span>aqui.</span>
              </h2>
            </div>

            <div className="careers-intro-text">
              <p>
                A Camará Distribuidora valoriza profissionais
                comprometidos e interessados em crescer junto
                com a nossa equipe.
              </p>

              <p>
                Cadastre seus dados e envie seu currículo para
                avaliação em futuras oportunidades.
              </p>
            </div>
          </div>
        </section>

        <section className="careers-features">
          <div className="container">
            <div className="careers-features-heading">
              <span className="careers-section-label">
                SUA JORNADA
              </span>

              <h2>
                O primeiro passo para
                <br />
                novas <span>possibilidades.</span>
              </h2>
            </div>

            <div className="careers-features-grid">
              {destaques.map(
                ({ icon: Icon, titulo, descricao }) => (
                  <article key={titulo}>
                    <div className="careers-feature-icon">
                      <Icon
                        size={26}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </div>

                    <h3>{titulo}</h3>
                    <p>{descricao}</p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        <section
          className="careers-application"
          id="candidatura"
        >
          <div className="container careers-application-grid">
            <div className="careers-application-info">
              <span className="careers-section-label">
                CADASTRO DE CANDIDATOS
              </span>

              <h2>
                Quer trabalhar
                <br />
                <span>com a gente?</span>
              </h2>

              <p>
                Preencha seus dados e encaminhe seu currículo
                para futuras oportunidades na Camará
                Distribuidora.
              </p>

              <div className="careers-info-list">
                <div>
                  <Mail size={21} aria-hidden="true" />

                  <span>
                    <strong>Informações de contato</strong>
                    Utilize um e-mail e telefone válidos.
                  </span>
                </div>

                <div>
                  <BriefcaseBusiness
                    size={21}
                    aria-hidden="true"
                  />

                  <span>
                    <strong>Área de interesse</strong>
                    Escolha a área em que deseja atuar.
                  </span>
                </div>

                <div>
                  <CheckCircle2
                    size={21}
                    aria-hidden="true"
                  />

                  <span>
                    <strong>Currículo em PDF</strong>
                    Arquivo de até 5 MB.
                  </span>
                </div>
              </div>

              <div className="careers-info-notice">
                <ShieldCheck
                  size={22}
                  aria-hidden="true"
                />

                <p>
                  Seus dados de contato e currículo serão
                  utilizados para análise de candidaturas
                  pela equipe responsável da Camará.
                </p>
              </div>
            </div>

            <form
              className="careers-form"
              onSubmit={handleSubmit}
            >
              <div className="careers-form-header">
                <span>FORMULÁRIO DE CANDIDATURA</span>

                <h3>Seus dados profissionais</h3>

                <p>
                  Preencha as informações abaixo para
                  enviar sua candidatura.
                </p>
              </div>

              <div className="careers-field">
                <label htmlFor="careers-nome">
                  Nome completo *
                </label>

                <input
                  id="careers-nome"
                  name="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                  minLength={3}
                  maxLength={120}
                  value={form.nome}
                  onChange={handleChange}
                  disabled={enviando}
                  required
                />
              </div>

              <div className="careers-form-row">
                <div className="careers-field">
                  <label htmlFor="careers-email">
                    E-mail *
                  </label>

                  <input
                    id="careers-email"
                    name="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={handleChange}
                    disabled={enviando}
                    required
                  />
                </div>

                <div className="careers-field">
                  <label htmlFor="careers-telefone">
                    Telefone *
                  </label>

                  <input
                    id="careers-telefone"
                    name="telefone"
                    type="tel"
                    placeholder="(81) 99999-9999"
                    autoComplete="tel"
                    maxLength={20}
                    value={form.telefone}
                    onChange={handleChange}
                    disabled={enviando}
                    required
                  />
                </div>
              </div>

              <div className="careers-field">
                <label htmlFor="careers-area">
                  Área de interesse *
                </label>

                <select
                  id="careers-area"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  disabled={enviando}
                  required
                >
                  <option value="">
                    Selecione uma área
                  </option>

                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="careers-field">
                <label htmlFor="careers-mensagem">
                  Apresentação (opcional)
                </label>

                <textarea
                  id="careers-mensagem"
                  name="mensagem"
                  rows={4}
                  maxLength={1000}
                  placeholder="Conte um pouco sobre sua experiência profissional..."
                  value={form.mensagem}
                  onChange={handleChange}
                  disabled={enviando}
                />
              </div>

              <div className="careers-field">
                <label htmlFor="careers-curriculo">
                  Anexar currículo *
                </label>

                <label
                  htmlFor="careers-curriculo"
                  className="careers-upload"
                >
                  <Upload
                    size={27}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />

                  <strong>
                    Clique para selecionar seu currículo
                  </strong>

                  <span>Arquivo PDF de até 5 MB</span>
                </label>

                <input
                  ref={fileInputRef}
                  id="careers-curriculo"
                  className="careers-file-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFile}
                  disabled={enviando}
                  required={!curriculo}
                />

                {curriculo && (
                  <div className="careers-selected-file">
                    <FileText
                      size={19}
                      aria-hidden="true"
                    />

                    <span>{curriculo.name}</span>

                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={enviando}
                      aria-label="Remover currículo"
                    >
                      <X
                        size={18}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </div>

              {erro && (
                <p
                  className="careers-form-error"
                  role="alert"
                >
                  {erro}
                </p>
              )}

              {sucesso && (
                <p
                  className="careers-form-success"
                  role="status"
                  style={{
                    color: "#257345",
                    background: "#e8f5ed",
                    padding: "12px",
                    borderRadius: "6px"
                  }}
                >
                  {sucesso}
                </p>
              )}

              <button
                type="submit"
                className="careers-submit"
                disabled={enviando}
              >
                {enviando
                  ? "Enviando candidatura..."
                  : "Enviar candidatura"}

                {!enviando && (
                  <ArrowUpRight
                    size={19}
                    aria-hidden="true"
                  />
                )}
              </button>

              <p className="careers-form-note">
                Ao enviar, você autoriza o uso dos dados
                fornecidos para análise de sua candidatura.
                O envio não garante contratação.
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}