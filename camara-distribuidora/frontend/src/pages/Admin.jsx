import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Images,
  ChefHat,
  FileText,
  Settings,
  Menu,
  X,
  ArrowUpRight,
  LogOut,
  Plus,
  Search,
  Pencil,
  Trash2,
  ImageIcon,
  Play
} from "lucide-react";

import AdminReceitas from "../components/AdminReceitas";
import { categoriasGaleria } from "../data/galeria";
import { produtosApi, galeriaApi, uploadApi } from "../services/api";
import "../styles/Admin.css";

const LIMITE_IMAGEM = 20 * 1024 * 1024;

const menuItems = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "receitas", label: "Receitas", icon: ChefHat },
  { id: "galeria", label: "Galeria", icon: Images },
  { id: "curriculos", label: "Currículos", icon: FileText },
  { id: "configuracoes", label: "Configurações", icon: Settings }
];

const produtoVazio = {
  nome: "",
  descricao: "",
  categoria: "",
  imagem: "",
  ativo: true
};

const publicacaoVazia = {
  titulo: "",
  descricao: "",
  categoria: "Produtos",
  tipo: "imagem",
  imagem: "",
  videoUrl: "",
  ativo: true
};

const categoriasPublicacao = categoriasGaleria.filter((categoria) =>
  ["Produtos", "Novidades", "Eventos", "Bastidores"].includes(categoria)
);

function normalizarLista(dados, propriedade) {
  return Array.isArray(dados) ? dados : dados?.[propriedade] ?? [];
}

export default function Admin({ admin, onLogout }) {
  const [pagina, setPagina] = useState("dashboard");
  const [menuAberto, setMenuAberto] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erroPagina, setErroPagina] = useState("");

  const [busca, setBusca] = useState("");
  const [buscaGaleria, setBuscaGaleria] = useState("");

  const [formulario, setFormulario] = useState(null);
  const [tipoFormulario, setTipoFormulario] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      const resultados = await Promise.allSettled([
        produtosApi.listarTodos(),
        galeriaApi.listarTodos()
      ]);

      if (!ativo) return;

      const [resultadoProdutos, resultadoGaleria] = resultados;
      const erros = [];

      if (resultadoProdutos.status === "fulfilled") {
        setProdutos(
          normalizarLista(resultadoProdutos.value, "produtos")
        );
      } else {
        erros.push(`Produtos: ${resultadoProdutos.reason.message}`);
      }

      if (resultadoGaleria.status === "fulfilled") {
        setPublicacoes(
          normalizarLista(resultadoGaleria.value, "publicacoes")
        );
      } else {
        erros.push(`Galeria: ${resultadoGaleria.reason.message}`);
      }

      setErroPagina(erros.join(" | "));
      setCarregando(false);
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!arquivoImagem) {
      setImagemPreview("");
      return;
    }

    const url = URL.createObjectURL(arquivoImagem);
    setImagemPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [arquivoImagem]);

  useEffect(() => {
    if (!formulario) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function aoPressionarTecla(evento) {
      if (evento.key === "Escape" && !processando) {
        fecharFormulario();
      }
    }

    document.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [formulario, processando]);

  const paginaAtual = menuItems.find((item) => item.id === pagina);
  const IconePagina = paginaAtual.icon;

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const publicacoesFiltradas = publicacoes.filter((item) =>
    item.titulo.toLowerCase().includes(buscaGaleria.toLowerCase())
  );

  const resumo = [
    {
      label: "Produtos cadastrados",
      value: produtos.length,
      icon: Package
    },
    {
      label: "Publicações",
      value: publicacoes.length,
      icon: Images
    },
    {
      label: "Currículos recebidos",
      value: "—",
      icon: FileText
    }
  ];

  function fecharFormulario() {
    if (processando) return;

    setFormulario(null);
    setTipoFormulario(null);
    setEditandoId(null);
    setArquivoImagem(null);
    setErro("");
  }

  function navegar(destino) {
    setPagina(destino);
    setMenuAberto(false);
    fecharFormulario();
  }

  function abrirFormulario(tipo, item = null) {
    const dadosIniciais =
      tipo === "produto" ? produtoVazio : publicacaoVazia;

    setTipoFormulario(tipo);
    setEditandoId(item?.id ?? null);
    setFormulario(
      item ? { ...dadosIniciais, ...item } : { ...dadosIniciais }
    );
    setArquivoImagem(null);
    setErro("");
  }

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor
    }));
  }

  function selecionarImagem(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";

    if (!arquivo) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Selecione uma imagem JPG, PNG ou WebP.");
      return;
    }

    if (arquivo.size > LIMITE_IMAGEM) {
      setErro("A imagem deve ter no máximo 20 MB.");
      return;
    }

    setArquivoImagem(arquivo);
    setErro("");
  }

  async function salvarFormulario(evento) {
    evento.preventDefault();
    if (processando) return;

    setErro("");
    setProcessando(true);

    try {
      if (tipoFormulario === "produto") {
        const dados = {
          nome: formulario.nome.trim(),
          descricao: formulario.descricao.trim(),
          categoria: formulario.categoria.trim(),
          imagem: formulario.imagem || "",
          ativo: formulario.ativo !== false
        };

        if (!dados.nome || !dados.descricao || !dados.categoria) {
          throw new Error("Preencha todos os campos obrigatórios.");
        }

        if (arquivoImagem) {
          const resultado = await uploadApi.enviar(arquivoImagem);
          dados.imagem = resultado.url;
        }

        if (editandoId) {
          await produtosApi.atualizar(editandoId, dados);
        } else {
          await produtosApi.criar(dados);
        }

        const atualizados = await produtosApi.listarTodos();
        setProdutos(normalizarLista(atualizados, "produtos"));
      }

      if (tipoFormulario === "galeria") {
        const dados = {
          titulo: formulario.titulo.trim(),
          descricao: formulario.descricao.trim(),
          categoria: formulario.categoria,
          tipo: formulario.tipo,
          imagem: formulario.imagem || null,
          videoUrl:
            formulario.tipo === "video"
              ? (formulario.videoUrl || "").trim()
              : null,
          ativo: formulario.ativo !== false
        };

        if (!dados.titulo || !dados.descricao) {
          throw new Error("Preencha todos os campos obrigatórios.");
        }

        if (dados.tipo === "video" && !dados.videoUrl) {
          throw new Error("Informe a URL do vídeo.");
        }

        if (arquivoImagem) {
          const resultado = await uploadApi.enviar(arquivoImagem);
          dados.imagem = resultado.url;
        }

        if (editandoId) {
          await galeriaApi.atualizar(editandoId, dados);
        } else {
          await galeriaApi.criar(dados);
        }

        const atualizadas = await galeriaApi.listarTodos();
        setPublicacoes(
          normalizarLista(atualizadas, "publicacoes")
        );
      }

      setFormulario(null);
      setTipoFormulario(null);
      setEditandoId(null);
      setArquivoImagem(null);
    } catch (error) {
      setErro(error.message || "Não foi possível salvar.");
    } finally {
      setProcessando(false);
    }
  }

  async function excluirItem(tipo, item) {
    const nome = tipo === "produto" ? item.nome : item.titulo;

    if (!window.confirm(`Excluir "${nome}"?`)) return;

    try {
      if (tipo === "produto") {
        await produtosApi.excluir(item.id);
        setProdutos((atuais) =>
          atuais.filter((produto) => produto.id !== item.id)
        );
      } else {
        await galeriaApi.excluir(item.id);
        setPublicacoes((atuais) =>
          atuais.filter((publicacao) => publicacao.id !== item.id)
        );
      }

      setErroPagina("");
    } catch (error) {
      setErroPagina(error.message);
    }
  }

  async function alternarStatus(tipo, item) {
    const ativo = item.ativo === false;

    try {
      if (tipo === "produto") {
        await produtosApi.atualizar(item.id, {
          nome: item.nome,
          descricao: item.descricao,
          categoria: item.categoria,
          imagem: item.imagem,
          ativo
        });

        setProdutos((atuais) =>
          atuais.map((produto) =>
            produto.id === item.id ? { ...produto, ativo } : produto
          )
        );
      } else {
        await galeriaApi.atualizar(item.id, {
          titulo: item.titulo,
          descricao: item.descricao,
          categoria: item.categoria,
          tipo: item.tipo,
          imagem: item.imagem,
          videoUrl: item.videoUrl || null,
          ativo
        });

        setPublicacoes((atuais) =>
          atuais.map((publicacao) =>
            publicacao.id === item.id
              ? { ...publicacao, ativo }
              : publicacao
          )
        );
      }

      setErroPagina("");
    } catch (error) {
      setErroPagina(error.message);
    }
  }

  function renderizarAcoes(tipo, item) {
    const nome = tipo === "produto" ? item.nome : item.titulo;

    return (
      <div className="admin-table-actions">
        <button
          type="button"
          aria-label={`Editar ${nome}`}
          onClick={() => abrirFormulario(tipo, item)}
        >
          <Pencil size={17} />
        </button>

        <button
          type="button"
          className="delete"
          aria-label={`Excluir ${nome}`}
          onClick={() => excluirItem(tipo, item)}
        >
          <Trash2 size={17} />
        </button>
      </div>
    );
  }

  function renderizarStatus(tipo, item) {
    const ativo = item.ativo !== false;
    const nome = tipo === "produto" ? item.nome : item.titulo;

    return (
      <button
        type="button"
        className={`admin-status ${ativo ? "active" : "inactive"}`}
        onClick={() => alternarStatus(tipo, item)}
        aria-label={`${ativo ? "Desativar" : "Ativar"} ${nome}`}
      >
        {ativo ? "Ativo" : "Inativo"}
      </button>
    );
  }

  return (
    <div className="admin-layout">
      {menuAberto && (
        <button
          className="admin-overlay"
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside className={`admin-sidebar${menuAberto ? " open" : ""}`}>
        <div className="admin-brand">
          <img
            src="/images/logo-camara.png"
            alt="Camará Distribuidora"
          />
          <span>PAINEL ADMINISTRATIVO</span>
        </div>

        <nav
          className="admin-navigation"
          aria-label="Menu administrativo"
        >
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={pagina === id ? "active" : ""}
              onClick={() => navegar(id)}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <a href="/" className="admin-back-link">
            <ArrowUpRight size={18} />
            Visualizar site
          </a>

          <div className="admin-user">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrador</strong>
              <span>{admin?.email || "Conta administrativa"}</span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              aria-label="Sair do painel"
              title="Sair"
              style={{
                border: 0,
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
                padding: 4
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-toggle"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            {menuAberto ? <X size={23} /> : <Menu size={23} />}
          </button>

          <div>
            <span>CAMARÁ DISTRIBUIDORA</span>
            <h1>{paginaAtual.label}</h1>
          </div>

          <div className="admin-topbar-user">
            <div className="admin-avatar">A</div>
            <span>Administrador</span>
          </div>
        </header>

        <main className="admin-content">
          {erroPagina && (
            <p role="alert" style={{ color: "#b42318" }}>
              {erroPagina}
            </p>
          )}

          {pagina === "dashboard" && (
            <>
              <div className="admin-welcome">
                <span>VISÃO GERAL</span>
                <h2>Bem-vindo ao painel Camará</h2>
                <p>
                  Gerencie produtos, receitas e publicações do site
                  em um só lugar.
                </p>
              </div>

              <div className="admin-stats">
                {resumo.map(({ label, value, icon: Icon }) => (
                  <div className="admin-stat-card" key={label}>
                    <div className="admin-stat-icon">
                      <Icon size={22} />
                    </div>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <span>GERENCIAMENTO</span>
                    <h2>Acesso rápido</h2>
                  </div>
                </div>

                <div className="admin-shortcuts">
                  {menuItems
                    .filter((item) => item.id !== "dashboard")
                    .map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => navegar(id)}
                      >
                        <Icon size={22} />
                        <strong>{label}</strong>
                        <ArrowUpRight size={18} />
                      </button>
                    ))}
                </div>
              </section>
            </>
          )}

          {pagina === "receitas" && <AdminReceitas />}

          {pagina === "produtos" && (
            <section className="admin-panel">
              <div className="admin-products-heading">
                <div>
                  <span className="admin-section-label">CATÁLOGO</span>
                  <h2>Gerenciar produtos</h2>
                  <p>
                    Cadastre e organize os produtos da distribuidora.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={() => abrirFormulario("produto")}
                >
                  <Plus size={18} />
                  Novo produto
                </button>
              </div>

              <div className="admin-search">
                <Search size={19} />
                <input
                  type="search"
                  placeholder="Buscar produto..."
                  value={busca}
                  onChange={(evento) => setBusca(evento.target.value)}
                />
              </div>

              <div className="admin-table-wrapper">
                {carregando ? (
                  <p className="admin-no-results">
                    Carregando produtos...
                  </p>
                ) : (
                  <>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th>Categoria</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>

                      <tbody>
                        {produtosFiltrados.map((produto) => (
                          <tr key={produto.id}>
                            <td>
                              <div className="admin-product-info">
                                {produto.imagem ? (
                                  <img src={produto.imagem} alt="" />
                                ) : (
                                  <div className="admin-product-placeholder">
                                    <Package size={22} />
                                  </div>
                                )}

                                <div>
                                  <strong>{produto.nome}</strong>
                                  <span>{produto.descricao}</span>
                                </div>
                              </div>
                            </td>

                            <td>{produto.categoria}</td>
                            <td>{renderizarStatus("produto", produto)}</td>
                            <td>{renderizarAcoes("produto", produto)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {produtosFiltrados.length === 0 && (
                      <p className="admin-no-results">
                        Nenhum produto encontrado.
                      </p>
                    )}
                  </>
                )}
              </div>
            </section>
          )}

          {pagina === "galeria" && (
            <section className="admin-panel">
              <div className="admin-products-heading">
                <div>
                  <span className="admin-section-label">
                    PUBLICAÇÕES
                  </span>
                  <h2>Gerenciar galeria</h2>
                  <p>
                    Organize fotos, vídeos, novidades e eventos da Camará.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={() => abrirFormulario("galeria")}
                >
                  <Plus size={18} />
                  Nova publicação
                </button>
              </div>

              <div className="admin-search">
                <Search size={19} />
                <input
                  type="search"
                  placeholder="Buscar publicação..."
                  value={buscaGaleria}
                  onChange={(evento) =>
                    setBuscaGaleria(evento.target.value)
                  }
                />
              </div>

              <div className="admin-table-wrapper">
                {carregando ? (
                  <p className="admin-no-results">
                    Carregando publicações...
                  </p>
                ) : (
                  <>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Publicação</th>
                          <th>Categoria</th>
                          <th>Tipo</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>

                      <tbody>
                        {publicacoesFiltradas.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="admin-product-info">
                                {item.imagem ? (
                                  <img src={item.imagem} alt="" />
                                ) : (
                                  <div className="admin-product-placeholder">
                                    {item.tipo === "video" ? (
                                      <Play size={22} />
                                    ) : (
                                      <ImageIcon size={22} />
                                    )}
                                  </div>
                                )}

                                <div>
                                  <strong>{item.titulo}</strong>
                                  <span>{item.descricao}</span>
                                </div>
                              </div>
                            </td>

                            <td>{item.categoria}</td>
                            <td>
                              {item.tipo === "video" ? "Vídeo" : "Foto"}
                            </td>
                            <td>{renderizarStatus("galeria", item)}</td>
                            <td>{renderizarAcoes("galeria", item)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {publicacoesFiltradas.length === 0 && (
                      <p className="admin-no-results">
                        Nenhuma publicação encontrada.
                      </p>
                    )}
                  </>
                )}
              </div>
            </section>
          )}

          {!["dashboard", "produtos", "receitas", "galeria"].includes(
            pagina
          ) && (
            <section className="admin-panel admin-empty">
              <div className="admin-empty-icon">
                <IconePagina size={30} />
              </div>

              <h2>{paginaAtual.label}</h2>
              <p>
                Esta área está preparada para receber as
                funcionalidades de gerenciamento.
              </p>
            </section>
          )}
        </main>
      </div>

      {formulario && (
        <div className="admin-modal-backdrop">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-form-title"
          >
            <div className="admin-modal-heading">
              <h2 id="admin-form-title">
                {editandoId !== null ? "Editar" : "Novo"}
                {tipoFormulario === "produto"
                  ? " produto"
                  : " publicação"}
              </h2>

              <button
                type="button"
                aria-label="Fechar formulário"
                onClick={fecharFormulario}
                disabled={processando}
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={salvarFormulario}
              className="admin-product-form"
            >
              <label>
                {tipoFormulario === "produto"
                  ? "Nome do produto"
                  : "Título da publicação"}

                <input
                  required
                  maxLength={120}
                  value={
                    tipoFormulario === "produto"
                      ? formulario.nome
                      : formulario.titulo
                  }
                  onChange={(evento) =>
                    atualizarCampo(
                      tipoFormulario === "produto"
                        ? "nome"
                        : "titulo",
                      evento.target.value
                    )
                  }
                />
              </label>

              <label>
                Categoria

                {tipoFormulario === "produto" ? (
                  <input
                    required
                    maxLength={80}
                    value={formulario.categoria}
                    onChange={(evento) =>
                      atualizarCampo("categoria", evento.target.value)
                    }
                  />
                ) : (
                  <select
                    value={formulario.categoria}
                    onChange={(evento) =>
                      atualizarCampo("categoria", evento.target.value)
                    }
                  >
                    {categoriasPublicacao.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              {tipoFormulario === "galeria" && (
                <label>
                  Tipo de publicação

                  <select
                    value={formulario.tipo}
                    onChange={(evento) =>
                      atualizarCampo("tipo", evento.target.value)
                    }
                  >
                    <option value="imagem">Fotografia</option>
                    <option value="video">Vídeo</option>
                  </select>
                </label>
              )}

              <label>
                Descrição

                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={formulario.descricao}
                  onChange={(evento) =>
                    atualizarCampo("descricao", evento.target.value)
                  }
                />
              </label>

              <div className="admin-image-field">
                <span>
                  {tipoFormulario === "galeria" &&
                  formulario.tipo === "video"
                    ? "Imagem de capa"
                    : "Imagem"}
                </span>

                <label className="admin-image-upload">
                  <ImageIcon size={28} />
                  <strong>Selecionar imagem</strong>
                  <span>JPG, PNG ou WebP • Máximo 20 MB</span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selecionarImagem}
                  />
                </label>

                {(imagemPreview || formulario.imagem) && (
                  <div className="admin-image-preview">
                    <img
                      src={imagemPreview || formulario.imagem}
                      alt="Prévia da imagem selecionada"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setArquivoImagem(null);
                        atualizarCampo("imagem", "");
                      }}
                    >
                      <Trash2 size={16} />
                      Remover imagem
                    </button>
                  </div>
                )}
              </div>

              {tipoFormulario === "galeria" &&
                formulario.tipo === "video" && (
                  <label>
                    URL do vídeo do YouTube

                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formulario.videoUrl || ""}
                      onChange={(evento) =>
                        atualizarCampo("videoUrl", evento.target.value)
                      }
                    />
                  </label>
                )}

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={formulario.ativo !== false}
                  onChange={(evento) =>
                    atualizarCampo("ativo", evento.target.checked)
                  }
                />

                {tipoFormulario === "produto"
                  ? "Produto ativo"
                  : "Publicação ativa"}
              </label>

              {erro && (
                <p
                  role="alert"
                  style={{
                    color: "#b42318",
                    fontSize: "13px",
                    fontWeight: 600
                  }}
                >
                  {erro}
                </p>
              )}

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={fecharFormulario}
                  disabled={processando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={processando}
                >
                  {processando
                    ? "Salvando..."
                    : tipoFormulario === "produto"
                      ? "Salvar produto"
                      : "Salvar publicação"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}