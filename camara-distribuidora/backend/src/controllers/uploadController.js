
import { open, rename, copyFile, unlink } from "node:fs/promises";
import { COPYFILE_EXCL } from "node:fs";
import path from "node:path";

import { uploadDir } from "../middleware/upload.js";

function validarAssinatura(buffer, mimetype) {
  if (mimetype === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (mimetype === "image/png") {
    const assinatura = Buffer.from([
      0x89, 0x50, 0x4e, 0x47,
      0x0d, 0x0a, 0x1a, 0x0a
    ]);

    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(assinatura)
    );
  }

  if (mimetype === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

async function verificarImagem(arquivo, mimetype) {
  const handle = await open(arquivo, "r");

  try {
    const buffer = Buffer.alloc(16);

    const { bytesRead } = await handle.read(
      buffer,
      0,
      buffer.length,
      0
    );

    return validarAssinatura(
      buffer.subarray(0, bytesRead),
      mimetype
    );
  } finally {
    await handle.close();
  }
}

async function removerArquivo(arquivo) {
  if (!arquivo) return;

  await unlink(arquivo).catch(() => {});
}

async function moverArquivo(origem, destino) {
  try {
    await rename(origem, destino);
  } catch (error) {
    if (error.code !== "EXDEV") {
      throw error;
    }

    await copyFile(origem, destino, COPYFILE_EXCL);
    await removerArquivo(origem);
  }
}

export async function enviarImagem(req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: "Selecione uma imagem."
    });
  }

  const arquivoTemporario = req.file.path;
  const nomeArquivo = path.basename(req.file.filename);
  const destino = path.join(uploadDir, nomeArquivo);

  try {
    const imagemValida = await verificarImagem(
      arquivoTemporario,
      req.file.mimetype
    );

    if (!imagemValida) {
      await removerArquivo(arquivoTemporario);

      return res.status(400).json({
        error: "O conteúdo do arquivo não corresponde a uma imagem válida."
      });
    }

    await moverArquivo(arquivoTemporario, destino);

    const enderecoServidor = (
      process.env.PUBLIC_BACKEND_URL ||
      `${req.protocol}://${req.get("host")}`
    ).replace(/\/+$/, "");

    return res.status(201).json({
      url: `${enderecoServidor}/uploads/${nomeArquivo}`
    });
  } catch (error) {
    await removerArquivo(arquivoTemporario);

    console.error("Erro ao enviar imagem:", error);

    return res.status(500).json({
      error: "Não foi possível salvar a imagem."
    });
  }
}
