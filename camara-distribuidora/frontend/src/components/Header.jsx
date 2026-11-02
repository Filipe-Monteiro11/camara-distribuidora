import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import "../style/Header.css";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Receitas", href: "#receitas" },
  { label: "Localização", href: "#localizacao" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-content">
        <a href="#inicio" className="brand" aria-label="Camará - Início">
          <span className="brand-name">CAMARÁ<span>.</span></span>
          <span className="brand-subtitle">DISTRIBUIDORA</span>
        </a>

        <nav className={menuOpen ? "header-nav open" : "header-nav"} aria-label="Menu principal">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="header-contact" href="#contato">
          Entre em contato <ArrowUpRight size={17} />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </header>
  );
}