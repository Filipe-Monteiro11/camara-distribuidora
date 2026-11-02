import { MapPin, Mail, Phone } from "lucide-react";
import "../styles/Footer.css";

const navegacao = [
  { nome: "Início", link: "#inicio" },
  { nome: "Produtos", link: "#produtos" },
  { nome: "Sobre nós", link: "#sobre" },
  { nome: "Receitas", link: "#receitas" },
  { nome: "Localização", link: "#localizacao" },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="container footer-grid">
        <div>
          <h2 className="footer-brand">
            CAMARÁ<span>.</span>
          </h2>

          <p>
            Conheça nossos produtos e descubra mais
            sobre a Camará Distribuidora.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h3>Navegação</h3>

          {navegacao.map(({ nome, link }) => (
            <a key={link} href={link}>
              {nome}
            </a>
          ))}
        </nav>

        <div>
          <h3>Institucional</h3>
          <p>Camará Distribuidora</p>
          <p>Conheça nossa história e nossos produtos.</p>
        </div>

        <div>
          <h3>Contato</h3>

          <p>
            <Phone size={16} aria-hidden="true" />
            Telefone a definir
          </p>

          <p>
            <Mail size={16} aria-hidden="true" />
            E-mail a definir
          </p>

          <p>
            <MapPin size={16} aria-hidden="true" />
            Endereço a definir
          </p>

          <p>Instagram a definir</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Camará Distribuidora.
        </span>

        <span>Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}