import { useState } from "react";
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
} from "lucide-react";
import "../styles/Admin.css";

const menuItems = [
  { id: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "galeria", label: "Galeria", icon: Images },
  { id: "curriculos", label: "Currículos", icon: FileText },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

const resumo = [
  { label: "Produtos cadastrados", value: "—", icon: Package },
  { label: "Publicações", value: "—", icon: Images },
  { label: "Currículos recebidos", value: "—", icon: FileText },
];

export default function Admin() {
  const [pagina, setPagina] = useState("dashboard");
  const [menuAberto, setMenuAberto] = useState(false);

  const navegar = (destino) => {
    setPagina(destino);
    setMenuAberto(false);
  };

  const paginaAtual = menuItems.find((item) => item.id === pagina);

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
          {pagina === "dashboard" ? (
            <>
              <div className="admin-welcome">
                <span>VISÃO GERAL</span>
                <h2>Bem-vindo ao painel Camará</h2>
                <p>
                  Gerencie os conteúdos do site em um só lugar.
                  As funcionalidades serão ativadas após a integração
                  com o backend.
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
          ) : (
            <section className="admin-panel admin-empty">
              <div className="admin-empty-icon">
                {paginaAtual && <paginaAtual.icon size={30} />}
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
    </div>
  );
}