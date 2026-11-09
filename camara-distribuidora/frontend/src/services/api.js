import { obterToken, salvarToken, sair } from "./auth";

const API_URL = "http://localhost:3001/api";

async function requisicao(caminho, opcoes = {}) {
  const { body, headers = {}, ...configuracao } = opcoes;
  const token = obterToken();

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...configuracao,
    headers: {
      ...(body !== undefined && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(body !== undefined
      ? {
          body:
            body instanceof FormData
              ? body
              : JSON.stringify(body)
        }
      : {})
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    if (resposta.status === 401 && token) {
      sair();
    }

    throw new Error(
      dados?.error ||
      dados?.message ||
      `Erro na requisição (${resposta.status}).`
    );
  }

  return dados;
}

function criarApiCrud(recurso) {
  return {
    listar() {
      return requisicao(`/${recurso}`);
    },

    listarTodos() {
      return requisicao(`/${recurso}/admin/all`);
    },

    buscar(id) {
      return requisicao(
        `/${recurso}/${encodeURIComponent(id)}`
      );
    },

    criar(dados) {
      return requisicao(`/${recurso}`, {
        method: "POST",
        body: dados
      });
    },

    atualizar(id, dados) {
      return requisicao(
        `/${recurso}/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: dados
        }
      );
    },

    excluir(id) {
      return requisicao(
        `/${recurso}/${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      );
    }
  };
}

export const produtosApi = criarApiCrud("products");
export const galeriaApi = criarApiCrud("gallery");
export const receitasApi = criarApiCrud("recipes");

export const uploadApi = {
  enviar(arquivo) {
    const formulario = new FormData();
    formulario.append("imagem", arquivo);

    return requisicao("/upload", {
      method: "POST",
      body: formulario
    });
  }
};

export const configuracoesApi = {
  perfil() {
    return requisicao("/auth/me");
  },

  async atualizar(dados) {
    const resposta = await requisicao("/auth/me", {
      method: "PATCH",
      body: dados
    });

    if (!resposta.token) {
      throw new Error("O servidor não retornou o novo token.");
    }

    salvarToken(resposta.token);

    return resposta;
  }
};

export const curriculosApi = {
  enviar(dados) {
    return requisicao("/curriculos", {
      method: "POST",
      body: dados
    });
  },

  listarTodos() {
    return requisicao("/curriculos/admin/all");
  },

  atualizarStatus(id, status) {
    return requisicao(
      `/curriculos/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: { status }
      }
    );
  },

  excluir(id) {
    return requisicao(
      `/curriculos/${encodeURIComponent(id)}`,
      {
        method: "DELETE"
      }
    );
  },

  async baixar(id) {
    const token = obterToken();

    if (!token) {
      throw new Error("Faça login para baixar currículos.");
    }

    const resposta = await fetch(
      `${API_URL}/curriculos/${encodeURIComponent(id)}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!resposta.ok) {
      if (resposta.status === 401) {
        sair();
      }

      const dados = await resposta.json().catch(() => null);

      throw new Error(
        dados?.error || "Não foi possível baixar o currículo."
      );
    }

    return resposta.blob();
  }
};