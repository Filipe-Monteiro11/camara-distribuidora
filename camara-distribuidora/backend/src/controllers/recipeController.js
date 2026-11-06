import { prisma } from "../lib/prisma.js";

function validarReceita(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { erro: "Informe os dados da receita." };
  }

  const titulo = typeof body.titulo === "string" ? body.titulo.trim() : "";
  const descricao = typeof body.descricao === "string" ? body.descricao.trim() : null;
  const imagem = typeof body.imagem === "string" ? body.imagem.trim() : null;
  const preparo = typeof body.preparo === "string" ? body.preparo.trim() : "";

  if (!titulo || titulo.length > 150) {
    return { erro: "O título deve ter entre 1 e 150 caracteres." };
  }

  if (descricao && descricao.length > 2000) {
    return { erro: "A descrição deve ter no máximo 2000 caracteres." };
  }

  if (imagem && (!/^https?:\/\/\S+$/i.test(imagem) || imagem.length > 2048)) {
    return { erro: "Informe uma URL válida para a imagem." };
  }

  if (
    !Array.isArray(body.ingredientes) ||
    body.ingredientes.length === 0 ||
    body.ingredientes.length > 100
  ) {
    return { erro: "Informe entre 1 e 100 ingredientes." };
  }

  if (
    body.ingredientes.some(
      (item) => typeof item !== "string" || !item.trim() || item.trim().length > 200
    )
  ) {
    return { erro: "Cada ingrediente deve ter entre 1 e 200 caracteres." };
  }

  if (!preparo || preparo.length > 10000) {
    return { erro: "O modo de preparo deve ter entre 1 e 10000 caracteres." };
  }

  if (body.ativo !== undefined && typeof body.ativo !== "boolean") {
    return { erro: "O campo ativo deve ser verdadeiro ou falso." };
  }

  return {
    dados: {
      titulo,
      descricao,
      imagem,
      ingredientes: body.ingredientes.map((item) => item.trim()),
      preparo,
      ativo: body.ativo ?? true
    }
  };
}

export async function listarReceitas(req, res) {
  try {
    const receitas = await prisma.recipe.findMany({
      where: { ativo: true },
      orderBy: { criadoEm: "desc" }
    });

    res.json(receitas);
  } catch (error) {
    console.error("ERRO PRISMA RECEITAS:", error);

    res.status(500).json({
      error: "Erro ao listar receitas."
    });
  }
}

export async function listarTodasReceitas(req, res) {
  try {
    const receitas = await prisma.recipe.findMany({
      orderBy: { criadoEm: "desc" }
    });

    res.json(receitas);
  } catch {
    res.status(500).json({ error: "Erro ao listar receitas." });
  }
}

export async function buscarReceita(req, res) {
  try {
    const receita = await prisma.recipe.findUnique({
      where: { id: req.params.id }
    });

    if (!receita || !receita.ativo) {
      return res.status(404).json({ error: "Receita não encontrada." });
    }

    res.json(receita);
  } catch {
    res.status(500).json({ error: "Erro ao buscar receita." });
  }
}

export async function criarReceita(req, res) {
  const { dados, erro } = validarReceita(req.body);

  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const receita = await prisma.recipe.create({
      data: dados
    });

    res.status(201).json(receita);
  } catch {
    res.status(500).json({ error: "Erro ao cadastrar receita." });
  }
}

export async function atualizarReceita(req, res) {
  const { dados, erro } = validarReceita(req.body);

  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const receita = await prisma.recipe.update({
      where: { id: req.params.id },
      data: dados
    });

    res.json(receita);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Receita não encontrada."
      });
    }

    console.error("Erro ao atualizar receita:", error);

    res.status(500).json({
      error: "Erro ao atualizar receita."
    });
  }
}

export async function excluirReceita(req, res) {
  try {
    await prisma.recipe.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Receita não encontrada." });
    }

    res.status(500).json({ error: "Erro ao excluir receita." });
  }
}