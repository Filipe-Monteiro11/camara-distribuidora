
import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Trash2,
  FileText,
  RefreshCw,
  Eye,
  X,
  Mail,
  Phone,
  BriefcaseBusiness,
  CalendarDays
} from "lucide-react";
import { curriculosApi } from "../services/api";
import "../styles/AdminCurriculos.css";

const statusOpcoes = [
  { valor: "novo", nome: "Novo" },
  { valor: "em_analise", nome: "Em análise" },
  { valor: "finalizado", nome: "Finalizado" }
];

function formatarData(data) {
  if (!data) return "—";

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(dataFormatada);
}

export default function AdminCurriculos({ onTotalChange }) {
  const [curriculos, setCurriculos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function iniciar() {
      try {
        const resposta = await curriculosApi.listarTodos();

        if (!ativo) return;

        const lista = Array.isArray(resposta)
          ? resposta
          : resposta?.curriculos ?? [];

        setCurriculos(lista);
        onTotalChange?.(lista.length);
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Erro ao carregar currículos.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    iniciar();

    return () => {
      ativo = false;
    };
  }, [onTotalChange]);

  useEffect(() => {
    if (!selecionado) return;

    function fecharComEscape(evento) {
      if (evento.key === "Escape") {
        setSelecionado(null);
      }
    }

    window.addEventListener("keydown", fecharComEscape);

    return () => {
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, [selecionado]);

  async function carregar() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await curriculosApi.listarTodos();

      const lista = Array.isArray(resposta)
        ? resposta
        : resposta?.curriculos ?? [];

      setCurriculos(lista);
      onTotalChange?.(lista.length);
    } catch (error) {
      setErro(error.message || "Erro ao carregar currículos.");
    } finally {
      setCarregando(false);
    }
  }

  async function alterarStatus(curriculo, status) {
    setProcessandoId(curriculo.id);
    setErro("");

    try {
      await curriculosApi.atualizarStatus(curriculo.id, status);

      setCurriculos((atuais) =>
        atuais.map((item) =>
          item.id === curriculo.id ? { ...item, status } : item
        )
      );

      setSelecionado((atual) =>
        atual?.id === curriculo.id
          ? { ...atual, status }
          : atual
      );
    } catch (error) {
      setErro(error.message || "Não foi possível alterar o status.");
    } finally {
      setProcessandoId(null);
    }
  }

  async function baixar(curriculo) {
    setProcessandoId(curriculo.id);
    setErro("");

    try {
      const arquivo = await curriculosApi.baixar(curriculo.id);
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement("a");

      link.href = url;
      link.download = curriculo.nomeArquivo || "curriculo.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setErro(error.message || "Não foi possível baixar o currículo.");
    } finally {
      setProcessandoId(null);
    }
  }

  async function excluir(curriculo) {
    const confirmado = window.confirm(
      `Excluir o currículo de "${curriculo.nome}" permanentemente?`
    );

    if (!confirmado) return;

    setProcessandoId(curriculo.id);
    setErro("");

    try {
      await curriculosApi.excluir(curriculo.id);

      const lista = curriculos.filter(
        (item) => item.id !== curriculo.id
      );

      setCurriculos(lista);
      onTotalChange?.(lista.length);

      if (selecionado?.id === curriculo.id) {
        setSelecionado(null);
      }
    } catch (error) {
      setErro(error.message || "Não foi possível excluir o currículo.");
    } finally {
      setProcessandoId(null);
    }
  }

  const filtrados = curriculos.filter((item) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    const correspondeBusca = [
      item.nome,
      item.email,
      item.telefone,
      item.area
    ].some((valor) =>
      String(valor || "")
        .toLocaleLowerCase("pt-BR")
        .includes(termo)
    );

    return (
      correspondeBusca &&
      (filtro === "todos" || item.status === filtro)
    );
  });

  return (
    <section className="admin-panel">
      <div className="admin-products-heading">
        <div>
          <span className="admin-section-label">RECRUTAMENTO</span>
          <h2>Gerenciar currículos</h2>
          <p>
            Consulte candidaturas, visualize informações e acompanhe
            o processo de análise.
          </p>
        </div>

        <button
          type="button"
          className="admin-curriculos-refresh"
          onClick={carregar}
          disabled={carregando}
        >
          <RefreshCw size={17} />
          Atualizar
        </button>
      </div>

      <div className="admin-curriculos-filters">
        <div className="admin-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Buscar candidato, e-mail, telefone ou área..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <select
          aria-label="Filtrar por status"
          value={filtro}
          onChange={(evento) => setFiltro(evento.target.value)}
        >
          <option value="todos">Todos os status</option>

          {statusOpcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.nome}
            </option>
          ))}
        </select>
      </div>

      {erro && (
        <p className="admin-page-error" role="alert">
          {erro}
        </p>
      )}

      <div className="admin-table-wrapper">
        {carregando ? (
          <p className="admin-no-results">
            Carregando currículos...
          </p>
        ) : filtrados.length === 0 ? (
          <div className="admin-curriculos-empty">
            <FileText size={32} />
            <strong>Nenhum currículo encontrado</strong>
            <span>
              {curriculos.length === 0
                ? "As candidaturas recebidas aparecerão aqui."
                : "Tente alterar a pesquisa ou o filtro."}
            </span>
          </div>
        ) : (
          <table className="admin-table admin-curriculos-table">
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Área de interesse</th>
                <th>Telefone</th>
                <th>Recebido em</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((curriculo) => {
                const processando =
                  processandoId === curriculo.id;

                return (
                  <tr key={curriculo.id}>
                    <td>
                      <div className="admin-curriculos-candidato">
                        <strong>{curriculo.nome}</strong>
                        <a href={`mailto:${curriculo.email}`}>
                          {curriculo.email}
                        </a>
                      </div>
                    </td>

                    <td>
                      <span className="admin-curriculos-area">
                        {curriculo.area || "Não informada"}
                      </span>
                    </td>

                    <td>
                      <a
                        className="admin-curriculos-phone"
                        href={`tel:${curriculo.telefone.replace(/\D/g, "")}`}
                      >
                        {curriculo.telefone}
                      </a>
                    </td>

                    <td>{formatarData(curriculo.criadoEm)}</td>

                    <td>
                      <select
                        className={`admin-curriculos-status ${curriculo.status}`}
                        value={curriculo.status}
                        disabled={processando}
                        onChange={(evento) =>
                          alterarStatus(
                            curriculo,
                            evento.target.value
                          )
                        }
                        aria-label={`Status de ${curriculo.nome}`}
                      >
                        {statusOpcoes.map((opcao) => (
                          <option
                            key={opcao.valor}
                            value={opcao.valor}
                          >
                            {opcao.nome}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          title="Visualizar candidatura"
                          aria-label={`Visualizar candidatura de ${curriculo.nome}`}
                          onClick={() => setSelecionado(curriculo)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Baixar currículo"
                          aria-label={`Baixar currículo de ${curriculo.nome}`}
                          disabled={processando}
                          onClick={() => baixar(curriculo)}
                        >
                          <Download size={17} />
                        </button>

                        <button
                          type="button"
                          className="delete"
                          title="Excluir candidatura"
                          aria-label={`Excluir candidatura de ${curriculo.nome}`}
                          disabled={processando}
                          onClick={() => excluir(curriculo)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="admin-curriculos-count">
        {filtrados.length} de {curriculos.length} candidatura(s)
      </p>

      {selecionado && (
        <div
          className="admin-curriculos-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setSelecionado(null);
            }
          }}
        >
          <div
            className="admin-curriculos-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="curriculo-modal-title"
          >
            <div className="admin-curriculos-modal-header">
              <div>
                <span className="admin-section-label">
                  DETALHES DA CANDIDATURA
                </span>
                <h2 id="curriculo-modal-title">
                  {selecionado.nome}
                </h2>
              </div>

              <button
                type="button"
                className="admin-curriculos-close"
                onClick={() => setSelecionado(null)}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-curriculos-modal-body">
              <div className="admin-curriculos-details">
                <div>
                  <Mail size={18} />
                  <span>
                    <small>E-mail</small>
                    <a href={`mailto:${selecionado.email}`}>
                      {selecionado.email}
                    </a>
                  </span>
                </div>

                <div>
                  <Phone size={18} />
                  <span>
                    <small>Telefone</small>
                    <a
                      href={`tel:${selecionado.telefone.replace(/\D/g, "")}`}
                    >
                      {selecionado.telefone}
                    </a>
                  </span>
                </div>

                <div>
                  <BriefcaseBusiness size={18} />
                  <span>
                    <small>Área de interesse</small>
                    <strong>
                      {selecionado.area || "Não informada"}
                    </strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={18} />
                  <span>
                    <small>Recebido em</small>
                    <strong>
                      {formatarData(selecionado.criadoEm)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="admin-curriculos-presentation">
                <h3>Apresentação profissional</h3>
                <p>
                  {selecionado.mensagem ||
                    "O candidato não informou uma apresentação."}
                </p>
              </div>

              <div className="admin-curriculos-document">
                <FileText size={20} />
                <span>
                  {selecionado.nomeArquivo || "Currículo.pdf"}
                </span>

                <button
                  type="button"
                  onClick={() => baixar(selecionado)}
                  disabled={processandoId === selecionado.id}
                >
                  <Download size={17} />
                  Baixar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
