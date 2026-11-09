import { useEffect, useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import { configuracoesApi } from "../services/api";
import "../styles/AdminConfiguracoes.css";

export default function AdminConfiguracoes({ admin, onAtualizar }) {
  const [email, setEmail] = useState(admin?.email || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
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

    if (salvando || carregando) return;

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

      onAtualizar?.(resposta.admin);

      setEmail(resposta.admin.email);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setMostrarSenhas(false);
      setSucesso(
        resposta.message || "Configurações atualizadas com sucesso."
      );
    } catch (error) {
      setErro(error.message || "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  const desabilitado = carregando || salvando;

  return (
    <div className="admin-configuracoes">
      <div className="admin-configuracoes-heading">
        <div>
          <span className="admin-configuracoes-eyebrow">
            GERENCIAMENTO DE ACESSO
          </span>
          <h2>Configurações da conta</h2>
          <p>
            Gerencie suas informações e mantenha seu acesso
            administrativo protegido.
          </p>
        </div>

        <div className="admin-configuracoes-heading-icon">
          <ShieldCheck size={25} />
        </div>
      </div>

      <form onSubmit={salvar}>
        <section className="admin-configuracoes-card">
          <div className="admin-configuracoes-card-heading">
            <div className="admin-configuracoes-icon">
              <UserRound size={21} />
            </div>

            <div>
              <h3>Informações da conta</h3>
              <p>
                Dados utilizados para acessar o painel administrativo.
              </p>
            </div>
          </div>

          <div className="admin-configuracoes-card-body">
            <label className="admin-configuracoes-field">
              <span>E-mail administrativo</span>

              <div className="admin-configuracoes-input">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="Digite o e-mail administrativo"
                  maxLength={254}
                  autoComplete="email"
                  required
                  disabled={desabilitado}
                />
              </div>
            </label>

            <p className="admin-configuracoes-help">
              Este e-mail será utilizado para entrar no painel.
            </p>
          </div>
        </section>

        <section className="admin-configuracoes-card">
          <div className="admin-configuracoes-card-heading">
            <div className="admin-configuracoes-icon">
              <LockKeyhole size={21} />
            </div>

            <div>
              <h3>Segurança e senha</h3>
              <p>
                Atualize sua senha para manter a conta protegida.
              </p>
            </div>
          </div>

          <div className="admin-configuracoes-card-body">
            <label className="admin-configuracoes-field">
              <span>Senha atual</span>

              <div className="admin-configuracoes-input">
                <LockKeyhole size={18} />
                <input
                  type={mostrarSenhas ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(evento) => setSenhaAtual(evento.target.value)}
                  placeholder="Informe sua senha atual"
                  autoComplete="current-password"
                  required
                  disabled={desabilitado}
                />
              </div>
            </label>

            <div className="admin-configuracoes-grid">
              <label className="admin-configuracoes-field">
                <span>Nova senha</span>

                <div className="admin-configuracoes-input">
                  <LockKeyhole size={18} />
                  <input
                    type={mostrarSenhas ? "text" : "password"}
                    value={novaSenha}
                    onChange={(evento) => setNovaSenha(evento.target.value)}
                    placeholder="Mínimo de 8 caracteres"
                    autoComplete="new-password"
                    minLength={8}
                    disabled={desabilitado}
                  />
                </div>
              </label>

              <label className="admin-configuracoes-field">
                <span>Confirmar nova senha</span>

                <div className="admin-configuracoes-input">
                  <LockKeyhole size={18} />
                  <input
                    type={mostrarSenhas ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(evento) =>
                      setConfirmarSenha(evento.target.value)
                    }
                    placeholder="Repita a nova senha"
                    autoComplete="new-password"
                    disabled={desabilitado}
                  />
                </div>
              </label>
            </div>

            <button
              type="button"
              className="admin-configuracoes-visibility"
              onClick={() => setMostrarSenhas((atual) => !atual)}
              disabled={desabilitado}
              aria-pressed={mostrarSenhas}
            >
              {mostrarSenhas ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}

              {mostrarSenhas ? "Ocultar senhas" : "Mostrar senhas"}
            </button>

            <div className="admin-configuracoes-info">
              <Info size={18} />
              <p>
                Para salvar qualquer alteração, informe sua senha atual.
                Deixe os campos de nova senha vazios caso queira alterar
                somente o e-mail.
              </p>
            </div>
          </div>
        </section>

        {erro && (
          <div
            className="admin-configuracoes-feedback admin-configuracoes-error"
            role="alert"
          >
            <AlertCircle size={19} />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div
            className="admin-configuracoes-feedback admin-configuracoes-success"
            role="status"
          >
            <CheckCircle2 size={19} />
            <span>{sucesso}</span>
          </div>
        )}

        <div className="admin-configuracoes-actions">
          <p>
            As alterações serão aplicadas à sua conta administrativa.
          </p>

          <button
            type="submit"
            className="admin-configuracoes-save"
            disabled={desabilitado}
          >
            <Save size={18} />
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}