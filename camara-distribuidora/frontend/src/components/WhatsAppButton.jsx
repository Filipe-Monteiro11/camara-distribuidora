import { useLocation } from "react-router-dom";
import "../styles/WhatsAppButton.css";

const WHATSAPP_NUMBER = "5581996328171";

const MESSAGE =
  "Olá! Gostaria de saber mais sobre os produtos da Camará Distribuidora.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

export default function WhatsAppButton() {
  const { pathname } = useLocation();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return (
    <a
      href={WHATSAPP_URL}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a Camará Distribuidora pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <img
        src="/images/balao-whats.png"
        alt=""
        width="64"
        height="64"
        draggable="false"
      />
    </a>
  );
}