import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

function gerarToken(admin) {
  return jwt.sign(
    {
      adminId: admin.id,
      tokenVersion: admin.tokenVersion
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "8h"
    }
  );
}

export async function login(req, res) {
  const { email, senha } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof senha !== "string" ||
    !email.trim() ||
    !senha
  ) {
    return res.status(400).json({
      error: "Informe e-mail e senha."
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!admin || !(await bcrypt.compare(senha, admin.senhaHash))) {
      return res.status(401).json({
        error: "E-mail ou senha inválidos."
      });
    }

    return res.json({
      token: gerarToken(admin),
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);

    return res.status(500).json({
      error: "Erro ao realizar login."
    });
  }
}

export async function perfil(req, res) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId },
      select: {
        id: true,
        email: true
      }
    });

    if (!admin) {
      return res.status(401).json({
        error: "Administrador não encontrado."
      });
    }

    return res.json(admin);
  } catch (error) {
    console.error("Erro ao consultar perfil:", error);

    return res.status(500).json({
      error: "Erro ao consultar administrador."
    });
  }
}

export async function atualizarConta(req, res) {
  const { email, senhaAtual, novaSenha } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof senhaAtual !== "string" ||
    !senhaAtual
  ) {
    return res.status(400).json({
      error: "Informe o e-mail e a senha atual."
    });
  }

  const novoEmail = email.trim().toLowerCase();

  if (
    novoEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)
  ) {
    return res.status(400).json({
      error: "Informe um e-mail válido."
    });
  }

  if (
    novaSenha !== undefined &&
    typeof novaSenha !== "string"
  ) {
    return res.status(400).json({
      error: "Nova senha inválida."
    });
  }

  const alterarSenha = Boolean(novaSenha);

  if (
    alterarSenha &&
    (novaSenha.length < 8 ||
      Buffer.byteLength(novaSenha, "utf8") > 72)
  ) {
    return res.status(400).json({
      error: "A nova senha deve ter pelo menos 8 caracteres e no máximo 72 bytes."
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId }
    });

    if (!admin) {
      return res.status(401).json({
        error: "Administrador não encontrado."
      });
    }

    const senhaValida = await bcrypt.compare(
      senhaAtual,
      admin.senhaHash
    );

    if (!senhaValida) {
      return res.status(400).json({
        error: "Senha atual incorreta."
      });
    }

    if (
      alterarSenha &&
      (await bcrypt.compare(novaSenha, admin.senhaHash))
    ) {
      return res.status(400).json({
        error: "A nova senha deve ser diferente da atual."
      });
    }

    const dados = {
      email: novoEmail,
      tokenVersion: { increment: 1 }
    };

    if (alterarSenha) {
      dados.senhaHash = await bcrypt.hash(novaSenha, 12);
    }

    const atualizado = await prisma.admin.update({
      where: {
        id: admin.id,
        tokenVersion: admin.tokenVersion
      },
      data: dados
    });

    return res.json({
      message: "Configurações atualizadas com sucesso.",
      token: gerarToken(atualizado),
      admin: {
        id: atualizado.id,
        email: atualizado.email
      }
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Este e-mail já está cadastrado."
      });
    }

    if (error.code === "P2025") {
      return res.status(409).json({
        error: "A conta foi alterada. Faça login novamente."
      });
    }

    console.error("Erro ao atualizar conta:", error);

    return res.status(500).json({
      error: "Não foi possível atualizar a conta."
    });
  }
}