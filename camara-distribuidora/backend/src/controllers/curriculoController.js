import { prisma } from "../lib/prisma.js";
import { open, unlink } from "node:fs/promises";
import path from "node:path";
import { curriculosDir } from "../middleware/curriculoUpload.js";

const STATUS_PERMITIDOS = ["novo", "em_analise", "finalizado"];

const AREAS_PERMITIDAS = [
  "Administrativo",
  "Comercial",
  "Logística",
  "Estoque",
  "Operacional",
  "Outras áreas"
];

async function removerArquivo(arquivo) {
  if (arquivo) {
    await unlink(arquivo).catch(() => {});
  }
}

async function pdfValido(arquivo) {
  const handle = await open(arquivo, "r");

  try {
    const buffer = Buffer.alloc(5);
    const { bytesRead } = await handle.read(buffer, 0, 5, 0);

    return bytesRead === 5 && buffer.toString("ascii") === "%PDF-";
  } finally {
    await handle.close();
  }
}

function caminhoCurriculo(arquivo) {
  if (
    typeof arquivo !== "string" ||
    !/^[a-f0-9-]{36}\.pdf$/i.test(arquivo)
  ) {
    return null;
  }

  return path.join(curriculosDir, arquivo);
}

export async function enviarCurriculo(req, res) {
  const arquivo = req.file?.path;

  try {
    const nome =
      typeof req.body?.nome === "string"
        ? req.body.nome.trim()
        : "";

    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const telefone =
      typeof req.body?.telefone === "string"
        ? req.body.telefone.trim()
        : "";

    const area =
      typeof req.body?.area === "string"
        ? req.body.area.trim()
        : "";

    const mensagem =
      typeof req.body?.mensagem === "string"
        ? req.body.mensagem.trim()
        : "";

    if (
      nome.length < 3 ||
      nome.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      !/^\+?[\d\s()-]{10,20}$/.test(telefone)
    ) {
      await removerArquivo(arquivo);

      return res.status(400).json({
        error: "Preencha corretamente nome, e-mail e telefone."
      });
    }

    if (
      (area && !AREAS_PERMITIDAS.includes(area)) ||
      mensagem.length > 1000
    ) {
      await removerArquivo(arquivo);

      return res.status(400).json({
        error: "Área de interesse ou apresentação inválida."
      });
    }

    if (!arquivo || !(await pdfValido(arquivo))) {
      await removerArquivo(arquivo);

      return res.status(400).json({
        error: "Envie um arquivo PDF válido."
      });
    }

    await prisma.curriculo.create({
      data: {
        nome,
        email,
        telefone,
        area: area || null,
        mensagem: mensagem || null,
        arquivo: path.basename(arquivo),
        nomeArquivo: path.basename(req.file.originalname).slice(0, 200)
      }
    });

    return res.status(201).json({
      message: "Currículo enviado com sucesso!"
    });
  } catch (error) {
    await removerArquivo(arquivo);
    console.error("Erro ao receber currículo:", error);

    return res.status(500).json({
      error: "Não foi possível enviar o currículo."
    });
  }
}

export async function listarCurriculos(req, res) {
  try {
    const curriculos = await prisma.curriculo.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        area: true,
        mensagem: true,
        nomeArquivo: true,
        status: true,
        criadoEm: true,
        atualizadoEm: true
      },
      orderBy: {
        criadoEm: "desc"
      }
    });

    return res.json({ curriculos });
  } catch (error) {
    console.error("Erro ao listar currículos:", error);

    return res.status(500).json({
      error: "Não foi possível carregar os currículos."
    });
  }
}

export async function baixarCurriculo(req, res) {
  try {
    const curriculo = await prisma.curriculo.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!curriculo) {
      return res.status(404).json({
        error: "Currículo não encontrado."
      });
    }

    const arquivo = caminhoCurriculo(curriculo.arquivo);

    if (!arquivo) {
      return res.status(500).json({
        error: "Arquivo do currículo inválido."
      });
    }

    const nomeArquivo = curriculo.nomeArquivo
      .replace(/[\r\n"\\/]/g, "_")
      .slice(0, 200);

    return res.download(
      arquivo,
      nomeArquivo || "curriculo.pdf",
      (error) => {
        if (!error) return;

        if (res.headersSent) {
          return res.destroy();
        }

        console.error("Erro ao baixar currículo:", error);

        return res.status(404).json({
          error: "Arquivo do currículo não encontrado."
        });
      }
    );
  } catch (error) {
    console.error("Erro ao buscar currículo:", error);

    return res.status(500).json({
      error: "Não foi possível baixar o currículo."
    });
  }
}

export async function atualizarStatusCurriculo(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};

    if (!STATUS_PERMITIDOS.includes(status)) {
      return res.status(400).json({
        error: "Status inválido."
      });
    }

    const curriculo = await prisma.curriculo.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        nome: true,
        status: true,
        atualizadoEm: true
      }
    });

    return res.json(curriculo);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Currículo não encontrado."
      });
    }

    console.error("Erro ao atualizar currículo:", error);

    return res.status(500).json({
      error: "Não foi possível atualizar o status."
    });
  }
}

export async function excluirCurriculo(req, res) {
  try {
    const curriculo = await prisma.curriculo.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!curriculo) {
      return res.status(404).json({
        error: "Currículo não encontrado."
      });
    }

    const arquivo = caminhoCurriculo(curriculo.arquivo);

    if (!arquivo) {
      return res.status(500).json({
        error: "Arquivo do currículo inválido."
      });
    }

    await prisma.curriculo.delete({
      where: {
        id: curriculo.id
      }
    });

    await removerArquivo(arquivo);

    return res.json({
      message: "Currículo excluído com sucesso."
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Currículo não encontrado."
      });
    }

    console.error("Erro ao excluir currículo:", error);

    return res.status(500).json({
      error: "Não foi possível excluir o currículo."
    });
  }
}