import { useEffect, useState } from "react";
import {
  UserRound,
  LockKeyhole,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { configuracoesApi } from "../services/api";
import "../styles/AdminConfiguracoes.css";

export default function AdminConfiguracoes({ admin, onAtualizar }) {
  const [email, setEmail] = useState(admin?.email || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let ativo = true;

    configuracoesApi.perfil()
      .then((perfil) => {
        if (ativo) setEmail(perfil.email);
      })
      .catch((error) => {
        if (ativo) setErro(error.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function salvar(evento) {
    evento.preventDefault();

    if (salvando) return;

    setErro("");
    setSucesso("");

    if (novaSenha !== confirmarSenha) {
      setErro("A confirmação da nova senha não corresponde.");
      return;
    }

    if (novaSenha && novaSenha.length < 8) {
      setErro("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setSalvando(true);

    try {
      const resposta = await configuracoesApi.atualizar({
        email: email.trim(),
        senhaAtual,
        ...(novaSenha ? { novaSenha } : {})
      });

      if (resposta.token) {
        localStorage.setItem("adminToken", resposta.token);
      }

      onAtualizar?.(resposta.admin, resposta.token);

      setEmail(resposta.admin.email);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setSucesso(resposta.message);
    } catch (error) {
      setErro(error.message || "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="admin-configuracoes">
      <div className="admin-configuracoes-heading">
        <span className="admin-section-label">
          CONFIGURAÇÕES DA CONTA
        </span>
        <h2>Gerenciar conta</h2>
        <p>
          Atualize os dados de acesso ao painel administrativo.
        </p>
      </div>

      <form onSubmit={salvar}>
        <section className="admin-configuracoes-section">
          <div className="admin-configuracoes-section-title">
            <UserRound size={20} />
            <div>
              <h3>Dados do administrador</h3>
              <p>Informações utilizadas para acessar o painel.</p>
            </div>
          </div>

          <label className="admin-configuracoes-field">
            <span>E-mail administrativo</span>
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              maxLength={254}
              autoComplete="email"
              required
              disabled={salvando || carregando}
            />
          </label>
        </section>

        <section className="admin-configuracoes-section">
          <div className="admin-configuracoes-section-title">
            <LockKeyhole size={20} />
            <div>
              <h3>Segurança da conta</h3>
              <p>
                Deixe os campos de nova senha vazios se não
                quiser alterá-la.
              </p>
            </div>
          </div>

          <label className="admin-configuracoes-field">
            <span>Senha atual</span>
            <input
              type={mostrarSenhas ? "text" : "password"}
              value={senhaAtual}
              onChange={(evento) => setSenhaAtual(evento.target.value)}
              autoComplete="current-password"
              required
              disabled={salvando || carregando}
            />
          </label>

          <div className="admin-configuracoes-grid">
            <label className="admin-configuracoes-field">
              <span>Nova senha</span>
              <input
                type={mostrarSenhas ? "text" : "password"}
                value={novaSenha}
                onChange={(evento) => setNovaSenha(evento.target.value)}
                autoComplete="new-password"
                disabled={salvando || carregando}
              />
            </label>

            <label className="admin-configuracoes-field">
              <span>Confirmar nova senha</span>
              <input
                type={mostrarSenhas ? "text" : "password"}
                value={confirmarSenha}
                onChange={(evento) => setConfirmarSenha(evento.target.value)}
                autoComplete="new-password"
                disabled={salvando || carregando}
              />
            </label>
          </div>

          <button
            type="button"
            className="admin-configuracoes-visibility"
            onClick={() => setMostrarSenhas((atual) => !atual)}
          >
            {mostrarSenhas ? <EyeOff size={17} /> : <Eye size={17} />}
            {mostrarSenhas ? "Ocultar senhas" : "Mostrar senhas"}
          </button>
        </section>

        {erro && (
          <p className="admin-configuracoes-error" role="alert">
            {erro}
          </p>
        )}

        {sucesso && (
          <p className="admin-configuracoes-success" role="status">
            {sucesso}
          </p>
        )}

        <div className="admin-configuracoes-actions">
          <button
            type="submit"
            className="admin-primary-button"
            disabled={salvando || carregando}
          >
            <Save size={18} />
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}