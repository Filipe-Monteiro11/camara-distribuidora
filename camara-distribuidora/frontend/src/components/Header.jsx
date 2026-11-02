import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import "../styles/Header.css";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Receitas", href: "#receitas" },
  { label: "Localização", href: "#localizacao" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-content">
        <a
          href="#inicio"
          className="brand"
          aria-label="Camará Distribuidora - Início"
          onClick={closeMenu}
        >
          <span className="brand-name">CAMARÁ</span>
          <span className="brand-subtitle">DISTRIBUIDORA</span>
        </a>

        <nav
          className={`header-nav${menuOpen ? " open" : ""}`}
          aria-label="Navegação principal"
          id="header-navigation"
        >
          {links.map(({ label, href }) => (
            <a key={href} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>

        <a href="#contato" className="header-contact">
          Entre em contato
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="header-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </header>
  );
}