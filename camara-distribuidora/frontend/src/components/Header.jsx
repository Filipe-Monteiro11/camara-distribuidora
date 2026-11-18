import { useEffect, useRef, useState } from "react";
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
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }

    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-content">
        <Link
          to="/#inicio"
          className="brand"
          aria-label="Camará Distribuidora - Início"
          onClick={closeMenu}
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
          inert={!menuOpen && undefined}
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
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          ref={toggleRef}
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