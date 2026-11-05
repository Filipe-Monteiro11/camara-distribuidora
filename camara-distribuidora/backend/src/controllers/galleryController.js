import { prisma } from "../lib/prisma.js";

const categorias = ["Produtos", "Novidades", "Eventos", "Bastidores"];
const tipos = ["imagem", "video"];

function validarPublicacao(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { erro: "Dados inválidos." };
  }

  const titulo = typeof body.titulo === "string" ? body.titulo.trim() : "";
  const descricao = typeof body.descricao === "string"
    ? body.descricao.trim()
    : null;
  const categoria = body.categoria ?? "Produtos";
  const tipo = body.tipo ?? "imagem";
  const imagem = typeof body.imagem === "string" ? body.imagem.trim() : null;
  const videoUrl = typeof body.videoUrl === "string" ? body.videoUrl.trim() : null;
  const ativo = body.ativo ?? true;

  if (!titulo || titulo.length > 150) {
    return { erro: "O título deve ter entre 1 e 150 caracteres." };
  }

  if (descricao && descricao.length > 2000) {
    return { erro: "A descrição deve ter no máximo 2000 caracteres." };
  }

  if (!categorias.includes(categoria)) {
    return { erro: "Categoria inválida." };
  }

  if (!tipos.includes(tipo)) {
    return { erro: "Tipo de publicação inválido." };
  }

  if (typeof ativo !== "boolean") {
    return { erro: "O campo ativo deve ser verdadeiro ou falso." };
  }

  if (imagem && (!/^https?:\/\/\S+$/i.test(imagem) || imagem.length > 2048)) {
    return { erro: "Informe uma URL válida para a imagem." };
  }

  if (videoUrl && (!/^https?:\/\/\S+$/i.test(videoUrl) || videoUrl.length > 2048)) {
    return { erro: "Informe uma URL válida para o vídeo." };
  }

  if (tipo === "video" && !videoUrl) {
    return { erro: "Informe a URL do vídeo." };
  }

  return {
    dados: {
      titulo,
      descricao,
      categoria,
      tipo,
      imagem,
      videoUrl: tipo === "video" ? videoUrl : null,
      ativo
    }
  };
}

export async function listarGaleria(req, res) {
  try {
    const publicacoes = await prisma.gallery.findMany({
      where: { ativo: true },
      orderBy: { criadoEm: "desc" }
    });

    res.json(publicacoes);
  } catch {
    res.status(500).json({ error: "Erro ao listar publicações." });
  }
}

export async function listarTodaGaleria(req, res) {
  try {
    const publicacoes = await prisma.gallery.findMany({
      orderBy: { criadoEm: "desc" }
    });

    res.json(publicacoes);
  } catch {
    res.status(500).json({ error: "Erro ao listar publicações." });
  }
}

export async function buscarPublicacao(req, res) {
  try {
    const publicacao = await prisma.gallery.findUnique({
      where: { id: req.params.id }
    });

    if (!publicacao || !publicacao.ativo) {
      return res.status(404).json({ error: "Publicação não encontrada." });
    }

    res.json(publicacao);
  } catch {
    res.status(500).json({ error: "Erro ao buscar publicação." });
  }
}

export async function criarPublicacao(req, res) {
  const { dados, erro } = validarPublicacao(req.body);

  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const publicacao = await prisma.gallery.create({
      data: dados
    });

    res.status(201).json(publicacao);
  } catch {
    res.status(500).json({ error: "Erro ao criar publicação." });
  }
}

export async function atualizarPublicacao(req, res) {
  const { dados, erro } = validarPublicacao(req.body);

  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const publicacao = await prisma.gallery.update({
      where: { id: req.params.id },
      data: dados
    });

    res.json(publicacao);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Publicação não encontrada." });
    }

    res.status(500).json({ error: "Erro ao atualizar publicação." });
  }
}

export async function excluirPublicacao(req, res) {
  try {
    await prisma.gallery.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Publicação não encontrada." });
    }

    res.status(500).json({ error: "Erro ao excluir publicação." });
  }
}