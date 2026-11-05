import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Images,
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
  Play,
} from "lucide-react";

import { produtosIniciais } from "../data/produtos";
import { categoriasGaleria, publicacoesGaleria } from "../data/galeria";
import "../styles/Admin.css";

const PRODUTOS_KEY = "camara-produtos";
const GALERIA_KEY = "camara-galeria";

const menuItems = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "galeria", label: "Galeria", icon: Images },
  { id: "curriculos", label: "Currículos", icon: FileText },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

const produtoVazio = {
  nome: "",
  descricao: "",
  categoria: "",
  imagem: "",
  ativo: true,
};

const publicacaoVazia = {
  titulo: "",
  descricao: "",
  categoria: "Produtos",
  tipo: "foto",
  imagem: "",
  video: "",
  ativo: true,
};

function carregarDados(chave, iniciais) {
  try {
    const dados = localStorage.getItem(chave);
    const resultado = dados ? JSON.parse(dados) : iniciais;

    return Array.isArray(resultado) ? resultado : iniciais;
  } catch {
    return iniciais;
  }
}

function gerarId() {
  return crypto.randomUUID();
}

export default function Admin() {
  const [pagina, setPagina] = useState("dashboard");
  const [menuAberto, setMenuAberto] = useState(false);

  const [produtos, setProdutos] = useState(() =>
    carregarDados(PRODUTOS_KEY, produtosIniciais)
  );

  const [publicacoes, setPublicacoes] = useState(() =>
    carregarDados(GALERIA_KEY, publicacoesGaleria)
  );

  const [busca, setBusca] = useState("");
  const [buscaGaleria, setBuscaGaleria] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [tipoFormulario, setTipoFormulario] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(PRODUTOS_KEY, JSON.stringify(produtos));
    } catch {
      console.error("Não foi possível salvar os produtos.");
    }
  }, [produtos]);

  useEffect(() => {
    try {
      localStorage.setItem(GALERIA_KEY, JSON.stringify(publicacoes));
    } catch {
      console.error("Não foi possível salvar a galeria.");
    }
  }, [publicacoes]);

  useEffect(() => {
    if (!formulario) return;

    const fechar = (evento) => {
      if (evento.key === "Escape") {
        setFormulario(null);
        setTipoFormulario(null);
        setEditandoId(null);
        setErro("");
      }
    };

    document.addEventListener("keydown", fechar);

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", fechar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [formulario]);

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
      icon: Package,
    },
    {
      label: "Publicações",
      value: publicacoes.length,
      icon: Images,
    },
    {
      label: "Currículos recebidos",
      value: "—",
      icon: FileText,
    },
  ];

  function fecharFormulario() {
    setFormulario(null);
    setTipoFormulario(null);
    setEditandoId(null);
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
    setFormulario(item ? { ...item } : { ...dadosIniciais });
    setErro("");
  }

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function selecionarImagem(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    const formatos = ["image/jpeg", "image/png", "image/webp"];

    if (!formatos.includes(arquivo.type)) {
      setErro("Selecione uma imagem JPG, PNG ou WebP.");
      evento.target.value = "";
      return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 2 MB.");
      evento.target.value = "";
      return;
    }

    setErro("");

    const leitor = new FileReader();

    leitor.onload = () => {
      if (typeof leitor.result === "string") {
        atualizarCampo("imagem", leitor.result);
      }
    };

    leitor.onerror = () => {
      setErro("Não foi possível carregar a imagem.");
    };

    leitor.readAsDataURL(arquivo);
  }

  function salvarFormulario(evento) {
    evento.preventDefault();
    setErro("");

    if (tipoFormulario === "produto") {
      const dados = {
        ...formulario,
        nome: formulario.nome.trim(),
        descricao: formulario.descricao.trim(),
        categoria: formulario.categoria.trim(),
        imagem: formulario.imagem || "",
      };

      if (!dados.nome || !dados.descricao || !dados.categoria) {
        setErro("Preencha todos os campos obrigatórios.");
        return;
      }

      const atualizados =
        editandoId !== null
          ? produtos.map((item) =>
              item.id === editandoId
                ? { ...dados, id: editandoId }
                : item
            )
          : [...produtos, { ...dados, id: gerarId() }];

      try {
        localStorage.setItem(
          PRODUTOS_KEY,
          JSON.stringify(atualizados)
        );

        setProdutos(atualizados);
      } catch {
        setErro(
          "Espaço de armazenamento insuficiente. Utilize uma imagem menor."
        );
        return;
      }
    }

    if (tipoFormulario === "galeria") {
      const dados = {
        ...formulario,
        titulo: formulario.titulo.trim(),
        descricao: formulario.descricao.trim(),
        imagem: formulario.imagem || "",
        video: formulario.video.trim(),
      };

      if (!dados.titulo || !dados.descricao) {
        setErro("Preencha todos os campos obrigatórios.");
        return;
      }

      const atualizadas =
        editandoId !== null
          ? publicacoes.map((item) =>
              item.id === editandoId
                ? { ...dados, id: editandoId }
                : item
            )
          : [...publicacoes, { ...dados, id: gerarId() }];

      try {
        localStorage.setItem(
          GALERIA_KEY,
          JSON.stringify(atualizadas)
        );

        setPublicacoes(atualizadas);
      } catch {
        setErro(
          "Espaço de armazenamento insuficiente. Utilize uma imagem menor."
        );
        return;
      }
    }

    fecharFormulario();
  }

  function excluirItem(tipo, item) {
    const nome = tipo === "produto" ? item.nome : item.titulo;

    if (!window.confirm(`Excluir "${nome}"?`)) return;

    if (tipo === "produto") {
      setProdutos((atuais) =>
        atuais.filter((produto) => produto.id !== item.id)
      );
    } else {
      setPublicacoes((atuais) =>
        atuais.filter((publicacao) => publicacao.id !== item.id)
      );
    }
  }

  function alternarStatus(tipo, id) {
    const atualizar = (atuais) =>
      atuais.map((item) =>
        item.id === id
          ? { ...item, ativo: item.ativo === false }
          : item
      );

    if (tipo === "produto") {
      setProdutos(atualizar);
    } else {
      setPublicacoes(atualizar);
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

    return (
      <button
        type="button"
        className={`admin-status ${ativo ? "active" : "inactive"}`}
        onClick={() => alternarStatus(tipo, item.id)}
        aria-label={`${ativo ? "Desativar" : "Ativar"} ${
          tipo === "produto" ? item.nome : item.titulo
        }`}
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
              <span>Modo demonstração</span>
            </div>
            <LogOut size={18} aria-hidden="true" />
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
          {pagina === "dashboard" && (
            <>
              <div className="admin-welcome">
                <span>VISÃO GERAL</span>
                <h2>Bem-vindo ao painel Camará</h2>
                <p>
                  Gerencie produtos e publicações do site em um só
                  lugar. Os dados estão disponíveis em modo de
                  demonstração.
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

          {pagina === "produtos" && (
            <section className="admin-panel">
              <div className="admin-products-heading">
                <div>
                  <span className="admin-section-label">CATÁLOGO</span>
                  <h2>Gerenciar produtos</h2>
                  <p>Cadastre e organize os produtos da distribuidora.</p>
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
              </div>
            </section>
          )}

          {pagina !== "dashboard" &&
            pagina !== "produtos" &&
            pagina !== "galeria" && (
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
                      tipoFormulario === "produto" ? "nome" : "titulo",
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
                    {categoriasGaleria
                      .filter((categoria) => categoria !== "Todos")
                      .map((categoria) => (
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
                    <option value="foto">Fotografia</option>
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
                  <span>JPG, PNG ou WebP • Máximo 2 MB</span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selecionarImagem}
                  />
                </label>

                {formulario.imagem && (
                  <div className="admin-image-preview">
                    <img
                      src={formulario.imagem}
                      alt="Prévia da imagem selecionada"
                    />

                    <button
                      type="button"
                      onClick={() => atualizarCampo("imagem", "")}
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
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formulario.video}
                      onChange={(evento) =>
                        atualizarCampo("video", evento.target.value)
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
                    fontWeight: 600,
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
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {tipoFormulario === "produto"
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