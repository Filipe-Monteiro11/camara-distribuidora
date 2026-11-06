import { obterToken, sair } from "./auth";

const API_URL = "http://localhost:3001/api";

async function requisicao(caminho, opcoes = {}) {
  const { body, headers = {}, ...configuracao } = opcoes;
  const token = obterToken();

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...configuracao,
    headers: {
      ...(body instanceof FormData
        ? {}
        : body !== undefined
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

export const produtosApi = {
  listar() {
    return requisicao("/products");
  },

  listarTodos() {
    return requisicao("/products/admin/all");
  },

  buscar(id) {
    return requisicao(`/products/${encodeURIComponent(id)}`);
  },

  criar(dados) {
    return requisicao("/products", {
      method: "POST",
      body: dados
    });
  },

  atualizar(id, dados) {
    return requisicao(`/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: dados
    });
  },

  excluir(id) {
    return requisicao(`/products/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
};

export const galeriaApi = {
  listar() {
    return requisicao("/gallery");
  },

  listarTodos() {
    return requisicao("/gallery/admin/all");
  },

  buscar(id) {
    return requisicao(`/gallery/${encodeURIComponent(id)}`);
  },

  criar(dados) {
    return requisicao("/gallery", {
      method: "POST",
      body: dados
    });
  },

  atualizar(id, dados) {
    return requisicao(`/gallery/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: dados
    });
  },

  excluir(id) {
    return requisicao(`/gallery/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
};

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