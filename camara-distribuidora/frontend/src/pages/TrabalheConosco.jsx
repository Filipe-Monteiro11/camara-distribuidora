import { useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Upload,
  Users,
  X,
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/TrabalheConosco.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  nome: "",
  email: "",
  telefone: "",
  area: "",
  mensagem: "",
};

export default function TrabalheConosco() {
  const [form, setForm] = useState(initialForm);
  const [curriculo, setCurriculo] = useState(null);
  const [erro, setErro] = useState("");
  const fileInputRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleFile(event) {
    const file = event.target.files?.[0];

    setErro("");

    if (!file) {
      setCurriculo(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    if (!curriculo) {
      setErro("Anexe seu currículo para continuar.");
      return;
    }

    setErro(
      "O formulário está em preparação. O envio de currículos será disponibilizado em breve."
    );
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
              Quer fazer parte da Camará Distribuidora?
              Conheça nosso espaço de oportunidades
              e prepare seu currículo.
            </p>

            <a href="#candidatura" className="careers-hero-link">
              Cadastrar currículo
              <ArrowUpRight size={19} />
            </a>
          </div>
        </section>

        <section className="careers-intro">
          <div className="container careers-intro-grid">
            <div>
              <span className="eyebrow">
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
                Este espaço foi criado para pessoas
                interessadas em futuras oportunidades
                na Camará Distribuidora.
              </p>

              <p>
                Em breve, será possível enviar seus dados
                e currículo para avaliação da equipe responsável.
              </p>
            </div>
          </div>
        </section>

        <section className="careers-features">
          <div className="container careers-features-grid">
            <article>
              <div className="careers-feature-icon">
                <Users size={27} />
              </div>

              <h3>Faça parte da equipe</h3>

              <p>
                Conheça nosso canal dedicado a pessoas
                interessadas em trabalhar na Camará.
              </p>
            </article>

            <article>
              <div className="careers-feature-icon">
                <BriefcaseBusiness size={27} />
              </div>

              <h3>Áreas de interesse</h3>

              <p>
                Informe a área em que deseja atuar
                para facilitar a identificação do seu perfil.
              </p>
            </article>

            <article>
              <div className="careers-feature-icon">
                <FileText size={27} />
              </div>

              <h3>Cadastro de currículo</h3>

              <p>
                Prepare suas informações profissionais
                e seu currículo em formato PDF.
              </p>
            </article>
          </div>
        </section>

        <section className="careers-application" id="candidatura">
          <div className="container careers-application-grid">
            <div className="careers-application-info">
              <span className="eyebrow">
                CADASTRO DE CANDIDATOS
              </span>

              <h2>
                Quer trabalhar
                <br />
                <span>com a gente?</span>
              </h2>

              <p>
                Preencha suas informações e anexe
                seu currículo. O recebimento das
                candidaturas será ativado após
                a integração do formulário.
              </p>

              <div className="careers-info-list">
                <div>
                  <Mail size={21} />

                  <span>
                    <strong>Contato profissional</strong>
                    Informe um e-mail válido para contato.
                  </span>
                </div>

                <div>
                  <MapPin size={21} />

                  <span>
                    <strong>Localização</strong>
                    Informações oficiais em breve.
                  </span>
                </div>

                <div>
                  <CheckCircle2 size={21} />

                  <span>
                    <strong>Currículo em PDF</strong>
                    Arquivo de até 5 MB.
                  </span>
                </div>
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
                  Preencha os campos abaixo para
                  preparar sua candidatura.
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
                  maxLength={120}
                  value={form.nome}
                  onChange={handleChange}
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
                  required
                >
                  <option value="">
                    Selecione uma área
                  </option>
                  <option value="Administrativo">
                    Administrativo
                  </option>
                  <option value="Comercial">
                    Comercial
                  </option>
                  <option value="Logística">
                    Logística
                  </option>
                  <option value="Estoque">
                    Estoque
                  </option>
                  <option value="Operacional">
                    Operacional
                  </option>
                  <option value="Outras áreas">
                    Outras áreas
                  </option>
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
                  <Upload size={26} />

                  <strong>
                    Clique para selecionar seu currículo
                  </strong>

                  <span>PDF de até 5 MB</span>
                </label>

                <input
                  ref={fileInputRef}
                  id="careers-curriculo"
                  className="careers-file-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFile}
                  required={!curriculo}
                />

                {curriculo && (
                  <div className="careers-selected-file">
                    <FileText size={19} />

                    <span>{curriculo.name}</span>

                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remover currículo"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {erro && (
                <p className="careers-form-error" role="status">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                className="careers-submit"
              >
                Enviar candidatura
                <ArrowUpRight size={19} />
              </button>

              <p className="careers-form-note">
                Formulário demonstrativo. Nenhum dado
                será enviado até a integração com o backend.
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}