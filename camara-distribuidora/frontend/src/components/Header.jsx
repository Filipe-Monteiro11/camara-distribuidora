import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/Header.css";

const links = [
  { label: "Início", href: "/#inicio" },
  { label: "Produtos", href: "/produtos" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Receitas", href: "/receitas" },
  { label: "Galeria", href: "/galeria" },
  { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    function onResize() {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link
          to="/#inicio"
          className="brand"
          aria-label="Camará Distribuidora - Início"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/images/logo-camara.png"
            alt="Camará Distribuidora"
            className="brand-logo"
          />
        </Link>

        <nav
          id="header-navigation"
          className={`header-nav${menuOpen ? " open" : ""}`}
          aria-label="Navegação principal"
        >
          {links.map(({ label, href }) => {
            const route = href.split("#")[0] || "/";
            const active =
              pathname === route &&
              (route !== "/" || !hash || hash === "#inicio");

            return (
              <Link
                key={href}
                to={href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="header-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X size={25} aria-hidden="true" />
          ) : (
            <Menu size={25} aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}