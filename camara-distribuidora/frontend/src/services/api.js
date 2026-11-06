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
          body: body instanceof FormData ? body : JSON.stringify(body)
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
      return requisicao(`/${recurso}/${encodeURIComponent(id)}`);
    },

    criar(dados) {
      return requisicao(`/${recurso}`, {
        method: "POST",
        body: dados
      });
    },

    atualizar(id, dados) {
      return requisicao(`/${recurso}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: dados
      });
    },

    excluir(id) {
      return requisicao(`/${recurso}/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
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