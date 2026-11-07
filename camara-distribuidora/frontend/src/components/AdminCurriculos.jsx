import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Trash2,
  FileText,
  RefreshCw
} from "lucide-react";
import { curriculosApi } from "../services/api";
import "../styles/AdminCurriculos.css";

const statusOpcoes = [
  { valor: "novo", nome: "Novo" },
  { valor: "em_analise", nome: "Em análise" },
  { valor: "finalizado", nome: "Finalizado" }
];

function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(data));
}

export default function AdminCurriculos({ onTotalChange }) {
  const [curriculos, setCurriculos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);
  const [erro, setErro] = useState("");

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
    if (
      !window.confirm(
        `Excluir o currículo de "${curriculo.nome}" permanentemente?`
      )
    ) {
      return;
    }

    setProcessandoId(curriculo.id);
    setErro("");

    try {
      await curriculosApi.excluir(curriculo.id);

      setCurriculos((atuais) => {
        const lista = atuais.filter((item) => item.id !== curriculo.id);
        onTotalChange?.(lista.length);
        return lista;
      });
    } catch (error) {
      setErro(error.message || "Não foi possível excluir o currículo.");
    } finally {
      setProcessandoId(null);
    }
  }

  const filtrados = curriculos.filter((item) => {
    const termo = busca.toLocaleLowerCase("pt-BR");

    const correspondeBusca = [
      item.nome,
      item.email,
      item.telefone
    ].some((valor) =>
      String(valor || "").toLocaleLowerCase("pt-BR").includes(termo)
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
            Consulte candidaturas, baixe documentos e acompanhe
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
            placeholder="Buscar candidato, e-mail ou telefone..."
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
          <p className="admin-no-results">Carregando currículos...</p>
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
                <th>Telefone</th>
                <th>Recebido em</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((curriculo) => {
                const processando = processandoId === curriculo.id;

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
                          alterarStatus(curriculo, evento.target.value)
                        }
                        aria-label={`Status de ${curriculo.nome}`}
                      >
                        {statusOpcoes.map((opcao) => (
                          <option key={opcao.valor} value={opcao.valor}>
                            {opcao.nome}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <div className="admin-table-actions">
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
    </section>
  );
}