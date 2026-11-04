import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToSection from "./components/ScrollToSection";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Receitas from "./pages/Receitas";
import Sobre from "./pages/Sobre";
import TrabalheConosco from "./pages/TrabalheConosco";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToSection />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route
          path="/trabalhe-conosco"
          element={<TrabalheConosco />}
        />
      </Routes>
    </BrowserRouter>
  );
}