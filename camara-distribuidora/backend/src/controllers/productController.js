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

  if (
    !Number.isSafeInteger(prioridade) ||
    prioridade < 0 ||
    prioridade > 9999
  ) {
    return { erro: "A prioridade deve ser um inteiro entre 0 e 9999." };
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
    const produto = await prisma.product.create({ data: dados });
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
    const produto = await prisma.product.update({
      where: { id: req.params.id },
      data: dados
    });

    res.json(produto);
  } catch (error) {
    if (error.code === "P2025") {
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