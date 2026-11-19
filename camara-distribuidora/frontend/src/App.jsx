
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import ScrollToSection from "./components/ScrollToSection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminGuard from "./components/AdminGuard";
import WhatsAppButton from "./components/WhatsAppButton";
import Camarencio from "./components/Camarencio";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Receitas from "./pages/Receitas";
import Sobre from "./pages/Sobre";
import Galeria from "./pages/Galeria";
import TrabalheConosco from "./pages/TrabalheConosco";

function ElementosPublicos() {
  const { pathname } = useLocation();

  const paginaAdministrativa =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (paginaAdministrativa) {
    return null;
  }

  return (
    <>
      <Camarencio />
      <WhatsAppButton />
    </>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToSection />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/produtos"
          element={<Produtos />}
        />

        <Route
          path="/receitas"
          element={<Receitas />}
        />

        <Route
          path="/sobre"
          element={<Sobre />}
        />

        <Route
          path="/trabalhe-conosco"
          element={<TrabalheConosco />}
        />

        <Route
          path="/galeria"
          element={
            <>
              <Header />
              <Galeria />
              <Footer />
            </>
          }
        />

        <Route
          path="/admin"
          element={<AdminGuard />}
        />
      </Routes>

      <ElementosPublicos />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
