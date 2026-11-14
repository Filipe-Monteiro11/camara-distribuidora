import { useEffect, useRef } from "react";
import { ArrowUpRight, Package, X } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/ProdutoModal.css";

export default function ProdutoModal({ produto, onClose }) {
  const modalRef = useRef(null);
  const fecharRef = useRef(null);

  useEffect(() => {
    if (!produto) return;

    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    fecharRef.current?.focus();

    function aoPressionarTecla(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onClose();
        return;
      }

      if (evento.key !== "Tab") return;

      const elementos = modalRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );

      if (!elementos?.length) {
        evento.preventDefault();
        return;
      }

      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (
        evento.shiftKey &&
        document.activeElement === primeiro
      ) {
        evento.preventDefault();
        ultimo.focus();
      } else if (
        !evento.shiftKey &&
        document.activeElement === ultimo
      ) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener(
        "keydown",
        aoPressionarTecla
      );
      elementoAnterior?.focus?.();
    };
  }, [produto, onClose]);

  if (!produto) return null;

  return (
    <div
      className="produto-modal-overlay"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={modalRef}
        className="produto-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="produto-modal-titulo"
      >
        <button
          ref={fecharRef}
          type="button"
          className="produto-modal-fechar"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <div className="produto-modal-imagem">
          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
            />
          ) : (
            <Package size={52} aria-hidden="true" />
          )}
        </div>

        <div className="produto-modal-conteudo">
          {produto.categoria && (
            <span className="produto-modal-categoria">
              {produto.categoria}
            </span>
          )}

          <h2 id="produto-modal-titulo">
            {produto.nome}
          </h2>

          <p>
            {produto.descricao ||
              "Descrição não disponível."}
          </p>

          <Link
            to="/#contato"
            className="btn btn-red"
            onClick={onClose}
          >
            Consultar disponibilidade
            <ArrowUpRight
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}