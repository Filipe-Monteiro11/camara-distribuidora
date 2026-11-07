import { prisma } from "../lib/prisma.js";

function validarProduto(body) {
  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  const descricao = typeof body.descricao === "string"
    ? body.descricao.trim()
    : null;
  const categoria = typeof body.categoria === "string"
    ? body.categoria.trim()
    : null;
  const imagem = typeof body.imagem === "string"
    ? body.imagem.trim()
    : null;

  if (!nome || nome.length > 150) {
    return { erro: "O nome deve ter entre 1 e 150 caracteres." };
  }

  if (descricao && descricao.length > 2000) {
    return { erro: "A descrição deve ter no máximo 2000 caracteres." };
  }

  if (categoria && categoria.length > 100) {
    return { erro: "A categoria deve ter no máximo 100 caracteres." };
  }

  if (imagem && (!/^https?:\/\/\S+$/i.test(imagem) || imagem.length > 2048)) {
    return { erro: "Informe uma URL válida para a imagem." };
  }

  for (const campo of ["ativo", "maisVendido", "maisProcurado"]) {
    if (body[campo] !== undefined && typeof body[campo] !== "boolean") {
      return { erro: `O campo ${campo} deve ser verdadeiro ou falso.` };
    }
  }

  const prioridade = body.prioridade ?? 0;

  if (!Number.isInteger(prioridade) || prioridade < 0 || prioridade > 3) {
    return { erro: "Selecione uma prioridade entre 0 e 3." };
  }

  return {
    dados: {
      nome,
      descricao,
      categoria,
      imagem,
      ativo: body.ativo ?? true,
      maisVendido: body.maisVendido ?? false,
      maisProcurado: body.maisProcurado ?? false,
      prioridade
    }
  };
}

async function salvarProdutoComPrioridade(dados, id = null) {
  return prisma.$transaction(async (tx) => {
    if (id) {
      const existente = await tx.product.findUnique({
        where: { id },
        select: { id: true }
      });

      if (!existente) {
        const error = new Error("Produto não encontrado.");
        error.status = 404;
        throw error;
      }
    }

    if (dados.prioridade > 0) {
      await tx.product.updateMany({
        where: {
          prioridade: dados.prioridade,
          ...(id ? { id: { not: id } } : {})
        },
        data: { prioridade: 0 }
      });
    }

    if (id) {
      return tx.product.update({
        where: { id },
        data: dados
      });
    }

    return tx.product.create({ data: dados });
  });
}

export async function listarProdutos(req, res) {
  try {
    const produtos = await prisma.product.findMany({
      where: { ativo: true },
      orderBy: { criadoEm: "desc" }
    });

    res.json(produtos);
  } catch {
    res.status(500).json({ error: "Erro ao listar produtos." });
  }
}

export async function listarTodosProdutos(req, res) {
  try {
    const produtos = await prisma.product.findMany({
      orderBy: { criadoEm: "desc" }
    });

    res.json(produtos);
  } catch {
    res.status(500).json({ error: "Erro ao listar produtos." });
  }
}

export async function buscarProduto(req, res) {
  try {
    const produto = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!produto || !produto.ativo) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.json(produto);
  } catch {
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
}

export async function criarProduto(req, res) {
  const { dados, erro } = validarProduto(req.body);

  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const produto = await salvarProdutoComPrioridade(dados);
    res.status(201).json(produto);
  } catch {
    res.status(500).json({ error: "Erro ao cadastrar produto." });
  }
}

export async function atualizarProduto(req, res) {
  const { dados, erro } = validarProduto(req.body);

  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const produto = await salvarProdutoComPrioridade(dados, req.params.id);
    res.json(produto);
  } catch (error) {
    if (error.status === 404 || error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
}

export async function excluirProduto(req, res) {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.status(500).json({ error: "Erro ao excluir produto." });
  }
}