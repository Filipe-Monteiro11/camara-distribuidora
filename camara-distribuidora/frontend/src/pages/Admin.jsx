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
} from "lucide-react";
import { produtosIniciais } from "../data/produtos";
import "../styles/Admin.css";

const STORAGE_KEY = "camara-produtos";

const menuItems = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "galeria", label: "Galeria", icon: Images },
  { id: "curriculos", label: "Currículos", icon: FileText },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

const formularioVazio = {
  nome: "",
  descricao: "",
  categoria: "",
  imagem: "",
  ativo: true,
};

function carregarProdutos() {
  try {
    const salvos = localStorage.getItem(STORAGE_KEY);
    return salvos ? JSON.parse(salvos) : produtosIniciais;
  } catch {
    return produtosIniciais;
  }
}

export default function Admin() {
  const [pagina, setPagina] = useState("dashboard");
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtos, setProdutos] = useState(carregarProdutos);
  const [busca, setBusca] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  }, [produtos]);

  const paginaAtual = menuItems.find((item) => item.id === pagina);
  const IconePagina = paginaAtual.icon;

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const navegar = (destino) => {
    setPagina(destino);
    setMenuAberto(false);
    setFormulario(null);
  };

  const abrirFormulario = (produto = null) => {
    setEditandoId(produto?.id ?? null);
    setFormulario(produto ? { ...produto } : { ...formularioVazio });
  };

  const salvarProduto = (evento) => {
    evento.preventDefault();

    const dados = {
      ...formulario,
      nome: formulario.nome.trim(),
      descricao: formulario.descricao.trim(),
      categoria: formulario.categoria.trim(),
      imagem: formulario.imagem.trim(),
    };

    if (!dados.nome || !dados.descricao || !dados.categoria) return;

    if (editandoId !== null) {
      setProdutos((atuais) =>
        atuais.map((produto) =>
          produto.id === editandoId ? { ...dados, id: editandoId } : produto
        )
      );
    } else {
      setProdutos((atuais) => [
        ...atuais,
        { ...dados, id: crypto.randomUUID() },
      ]);
    }

    setFormulario(null);
    setEditandoId(null);
  };

  const excluirProduto = (produto) => {
    if (!window.confirm(`Excluir o produto "${produto.nome}"?`)) return;

    setProdutos((atuais) =>
      atuais.filter((item) => item.id !== produto.id)
    );
  };

  const alternarStatus = (id) => {
    setProdutos((atuais) =>
      atuais.map((produto) =>
        produto.id === id
          ? { ...produto, ativo: !produto.ativo }
          : produto
      )
    );
  };

  const resumo = [
    { label: "Produtos cadastrados", value: produtos.length, icon: Package },
    { label: "Publicações", value: "—", icon: Images },
    { label: "Currículos recebidos", value: "—", icon: FileText },
  ];

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

        <nav className="admin-navigation" aria-label="Menu administrativo">
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
                  Gerencie os conteúdos do site em um só lugar.
                  O gerenciamento de produtos está disponível
                  em modo de demonstração.
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
                  onClick={() => abrirFormulario()}
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

                        <td>
                          <button
                            type="button"
                            className={`admin-status ${
                              produto.ativo ? "active" : "inactive"
                            }`}
                            onClick={() => alternarStatus(produto.id)}
                            aria-label={`${
                              produto.ativo ? "Desativar" : "Ativar"
                            } ${produto.nome}`}
                          >
                            {produto.ativo ? "Ativo" : "Inativo"}
                          </button>
                        </td>

                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              aria-label={`Editar ${produto.nome}`}
                              onClick={() => abrirFormulario(produto)}
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              className="delete"
                              aria-label={`Excluir ${produto.nome}`}
                              onClick={() => excluirProduto(produto)}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
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

          {pagina !== "dashboard" && pagina !== "produtos" && (
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
                {editandoId !== null ? "Editar produto" : "Novo produto"}
              </h2>

              <button
                type="button"
                aria-label="Fechar formulário"
                onClick={() => setFormulario(null)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={salvarProduto} className="admin-product-form">
              <label>
                Nome do produto
                <input
                  required
                  maxLength={120}
                  value={formulario.nome}
                  onChange={(evento) =>
                    setFormulario({
                      ...formulario,
                      nome: evento.target.value,
                    })
                  }
                />
              </label>

              <label>
                Categoria
                <input
                  required
                  maxLength={80}
                  value={formulario.categoria}
                  onChange={(evento) =>
                    setFormulario({
                      ...formulario,
                      categoria: evento.target.value,
                    })
                  }
                />
              </label>

              <label>
                Descrição
                <textarea
                  required
                  rows={4}
                  value={formulario.descricao}
                  onChange={(evento) =>
                    setFormulario({
                      ...formulario,
                      descricao: evento.target.value,
                    })
                  }
                />
              </label>

              <label>
                URL da imagem
                <input
                  type="url"
                  placeholder="https://..."
                  value={formulario.imagem}
                  onChange={(evento) =>
                    setFormulario({
                      ...formulario,
                      imagem: evento.target.value,
                    })
                  }
                />
              </label>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={formulario.ativo}
                  onChange={(evento) =>
                    setFormulario({
                      ...formulario,
                      ativo: evento.target.checked,
                    })
                  }
                />
                Produto ativo
              </label>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => setFormulario(null)}
                >
                  Cancelar
                </button>

                <button type="submit" className="admin-primary-button">
                  Salvar produto
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}