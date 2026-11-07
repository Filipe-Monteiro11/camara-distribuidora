import { MapPin, Phone } from "lucide-react";
import "../styles/Footer.css";

const navegacao = [
  { nome: "Início", link: "/#inicio" },
  { nome: "Produtos", link: "/#produtos" },
  { nome: "Sobre nós", link: "/#sobre" },
  { nome: "Receitas", link: "/#receitas" },
  { nome: "Localização", link: "/#localizacao" }
];

const telefones = [
  { nome: "Telefone: 1", numero: "(81) 99632-8171", whatsapp: "5581996328171" },
  { nome: "Telefone: 2", numero: "(81) 98954-8266", whatsapp: "5581989548266" },
  { nome: "Telefone: 3", numero: "(81) 99992-8670", whatsapp: "5581999928670" }
];

const mapa =
  "https://www.google.com/maps/search/?api=1&query=Rua%20Manoel%20Honorato%20da%20Costa%20556%20Vila%20da%20F%C3%A1brica%20Camaragibe%20PE%2054759-475";

export default function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="container footer-grid">
        <div>
          <h2 className="footer-brand">
            CAMARÁ<span>.</span>
          </h2>
          <p>
            Conheça nossos produtos e descubra mais sobre
            a Camará Distribuidora.
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

          <a
            href="https://www.instagram.com/camara_distribuidora/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">◎</span>
            @camara_distribuidora
          </a>
        </div>

        <div>
          <h3>Contato</h3>

          {telefones.map(({ nome, numero, whatsapp }) => (
            <a
              key={whatsapp}
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${nome}: ${numero}. Conversar pelo WhatsApp`}
            >
              <Phone size={16} aria-hidden="true" />
              <span>
                {nome}: {numero}
              </span>
            </a>
          ))}

          <a href={mapa} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} aria-hidden="true" />
            <span>
              Rua Manoel Honorato da Costa, 556,
              Vila da Fábrica, Camaragibe – PE, 54759-475
            </span>
          </a>
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