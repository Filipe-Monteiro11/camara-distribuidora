import { useEffect, useState } from "react";
import {
  ChefHat,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react";
import { receitasApi, uploadApi } from "../services/api";

const LIMITE_IMAGEM = 20 * 1024 * 1024;

const receitaVazia = {
  titulo: "",
  descricao: "",
  imagem: "",
  ingredientes: [],
  preparo: "",
  ativo: true
};

export default function AdminReceitas() {
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [busca, setBusca] = useState("");
  const [erroPagina, setErroPagina] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const dados = await receitasApi.listarTodos();
        if (ativo) setReceitas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        if (ativo) setErroPagina(error.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!arquivoImagem) {
      setImagemPreview("");
      return;
    }

    const url = URL.createObjectURL(arquivoImagem);
    setImagemPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [arquivoImagem]);

  useEffect(() => {
    if (!formulario) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function aoPressionarTecla(evento) {
      if (evento.key === "Escape" && !processando) {
        setFormulario(null);
        setArquivoImagem(null);
        setErroFormulario("");
      }
    }

    document.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [formulario, processando]);

  const receitasFiltradas = receitas.filter((receita) =>
    receita.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirFormulario(receita = null) {
    setEditandoId(receita?.id ?? null);
    setFormulario({
      ...receitaVazia,
      ...receita,
      ingredientesTexto: receita?.ingredientes?.join("\n") ?? ""
    });
    setArquivoImagem(null);
    setErroFormulario("");
  }

  function fecharFormulario() {
    if (processando) return;

    setFormulario(null);
    setEditandoId(null);
    setArquivoImagem(null);
    setErroFormulario("");
  }

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor
    }));
  }

  function selecionarImagem(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";

    if (!arquivo) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErroFormulario("Selecione uma imagem JPG, PNG ou WebP.");
      return;
    }

    if (arquivo.size > LIMITE_IMAGEM) {
      setErroFormulario("A imagem deve ter no máximo 20 MB.");
      return;
    }

    setArquivoImagem(arquivo);
    setErroFormulario("");
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (processando) return;

    setErroFormulario("");

    const dados = {
      titulo: formulario.titulo.trim(),
      descricao: formulario.descricao.trim(),
      imagem: formulario.imagem || null,
      ingredientes: formulario.ingredientesTexto
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      preparo: formulario.preparo.trim(),
      ativo: formulario.ativo
    };

    if (!dados.titulo || !dados.ingredientes.length || !dados.preparo) {
      setErroFormulario("Preencha o título, os ingredientes e o preparo.");
      return;
    }

    setProcessando(true);

    try {
      if (arquivoImagem) {
        const resultado = await uploadApi.enviar(arquivoImagem);
        dados.imagem = resultado.url;
      }

      if (editandoId) {
        await receitasApi.atualizar(editandoId, dados);
      } else {
        await receitasApi.criar(dados);
      }

      const atualizadas = await receitasApi.listarTodos();
      setReceitas(Array.isArray(atualizadas) ? atualizadas : []);
      fecharFormulario();
      setFormulario(null);
      setArquivoImagem(null);
      setEditandoId(null);
    } catch (error) {
      setErroFormulario(error.message || "Não foi possível salvar a receita.");
    } finally {
      setProcessando(false);
    }
  }

  async function excluir(receita) {
    if (!window.confirm(`Excluir "${receita.titulo}"?`)) return;

    try {
      await receitasApi.excluir(receita.id);
      setReceitas((atuais) =>
        atuais.filter((item) => item.id !== receita.id)
      );
      setErroPagina("");
    } catch (error) {
      setErroPagina(error.message);
    }
  }

  async function alternarStatus(receita) {
    const ativo = !receita.ativo;

    try {
      await receitasApi.atualizar(receita.id, {
        titulo: receita.titulo,
        descricao: receita.descricao,
        imagem: receita.imagem,
        ingredientes: receita.ingredientes,
        preparo: receita.preparo,
        ativo
      });

      setReceitas((atuais) =>
        atuais.map((item) =>
          item.id === receita.id ? { ...item, ativo } : item
        )
      );
      setErroPagina("");
    } catch (error) {
      setErroPagina(error.message);
    }
  }

  return (
    <>
      <section className="admin-panel">
        <div className="admin-products-heading">
          <div>
            <span className="admin-section-label">GASTRONOMIA</span>
            <h2>Gerenciar receitas</h2>
            <p>Cadastre e organize as receitas da Camará.</p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => abrirFormulario()}
          >
            <Plus size={18} />
            Nova receita
          </button>
        </div>

        {erroPagina && (
          <p role="alert" style={{ color: "#b42318" }}>
            {erroPagina}
          </p>
        )}

        <div className="admin-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Buscar receita..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <div className="admin-table-wrapper">
          {carregando ? (
            <p className="admin-no-results">Carregando receitas...</p>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Receita</th>
                    <th>Ingredientes</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {receitasFiltradas.map((receita) => (
                    <tr key={receita.id}>
                      <td>
                        <div className="admin-product-info">
                          {receita.imagem ? (
                            <img src={receita.imagem} alt="" />
                          ) : (
                            <div className="admin-product-placeholder">
                              <ChefHat size={22} />
                            </div>
                          )}

                          <div>
                            <strong>{receita.titulo}</strong>
                            <span>{receita.descricao}</span>
                          </div>
                        </div>
                      </td>

                      <td>{receita.ingredientes.length}</td>

                      <td>
                        <button
                          type="button"
                          className={`admin-status ${
                            receita.ativo ? "active" : "inactive"
                          }`}
                          onClick={() => alternarStatus(receita)}
                          aria-label={`${
                            receita.ativo ? "Desativar" : "Ativar"
                          } ${receita.titulo}`}
                        >
                          {receita.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <button
                            type="button"
                            aria-label={`Editar ${receita.titulo}`}
                            onClick={() => abrirFormulario(receita)}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            className="delete"
                            aria-label={`Excluir ${receita.titulo}`}
                            onClick={() => excluir(receita)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {receitasFiltradas.length === 0 && (
                <p className="admin-no-results">
                  Nenhuma receita encontrada.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {formulario && (
        <div className="admin-modal-backdrop">
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-recipe-title"
          >
            <div className="admin-modal-heading">
              <h2 id="admin-recipe-title">
                {editandoId ? "Editar receita" : "Nova receita"}
              </h2>

              <button
                type="button"
                aria-label="Fechar formulário"
                onClick={fecharFormulario}
                disabled={processando}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={salvar} className="admin-product-form">
              <label>
                Título da receita
                <input
                  required
                  maxLength={150}
                  value={formulario.titulo}
                  onChange={(evento) =>
                    atualizarCampo("titulo", evento.target.value)
                  }
                />
              </label>

              <label>
                Descrição
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={formulario.descricao || ""}
                  onChange={(evento) =>
                    atualizarCampo("descricao", evento.target.value)
                  }
                />
              </label>

              <label>
                Ingredientes (um por linha)
                <textarea
                  required
                  rows={6}
                  value={formulario.ingredientesTexto}
                  onChange={(evento) =>
                    atualizarCampo("ingredientesTexto", evento.target.value)
                  }
                  placeholder={"500 g de charque\n1 cebola\n2 dentes de alho"}
                />
              </label>

              <label>
                Modo de preparo (uma etapa por linha)
                <textarea
                  required
                  rows={7}
                  maxLength={10000}
                  value={formulario.preparo}
                  onChange={(evento) =>
                    atualizarCampo("preparo", evento.target.value)
                  }
                  placeholder={
                    "Cozinhe o charque.\nRefogue a cebola e o alho.\nMisture e sirva."
                  }
                />
              </label>

              <div className="admin-image-field">
                <span>Imagem</span>

                <label className="admin-image-upload">
                  <ImageIcon size={28} />
                  <strong>Selecionar imagem</strong>
                  <span>JPG, PNG ou WebP • Máximo 20 MB</span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selecionarImagem}
                  />
                </label>

                {(imagemPreview || formulario.imagem) && (
                  <div className="admin-image-preview">
                    <img
                      src={imagemPreview || formulario.imagem}
                      alt="Prévia da imagem selecionada"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setArquivoImagem(null);
                        atualizarCampo("imagem", "");
                      }}
                    >
                      <Trash2 size={16} />
                      Remover imagem
                    </button>
                  </div>
                )}
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={formulario.ativo}
                  onChange={(evento) =>
                    atualizarCampo("ativo", evento.target.checked)
                  }
                />
                Receita ativa
              </label>

              {erroFormulario && (
                <p role="alert" style={{ color: "#b42318" }}>
                  {erroFormulario}
                </p>
              )}

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={fecharFormulario}
                  disabled={processando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={processando}
                >
                  {processando ? "Salvando..." : "Salvar receita"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}