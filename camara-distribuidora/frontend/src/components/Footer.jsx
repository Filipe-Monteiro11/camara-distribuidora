import { Instagram, MapPin, Mail, Phone } from "lucide-react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="container footer-grid">
        <div>
          <h2 className="footer-brand">CAMARÁ<span>.</span></h2>
          <p>
            Conheça nossos produtos e descubra mais sobre
            a Camará Distribuidora.
          </p>
        </div>

        <div>
          <h3>Navegação</h3>
          <a href="#inicio">Início</a>
          <a href="#produtos">Produtos</a>
          <a href="#sobre">Sobre nós</a>
          <a href="#receitas">Receitas</a>
        </div>

        <div>
          <h3>Institucional</h3>
          <a href="#industria">Nossa indústria</a>
          <a href="#historia">Nossa história</a>
          <a href="#trabalhe-conosco">Trabalhe conosco</a>
        </div>

        <div>
          <h3>Contato</h3>
          <p><Phone size={16} /> Telefone a definir</p>
          <p><Mail size={16} /> E-mail a definir</p>
          <p><MapPin size={16} /> Endereço a definir</p>
          <p><Instagram size={16} /> Instagram a definir</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Camará Distribuidora.</span>
        <span>Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}