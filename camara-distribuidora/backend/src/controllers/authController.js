import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

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

    const senhaValida = admin
      ? await bcrypt.compare(senha, admin.senhaHash)
      : false;

    if (!senhaValida) {
      return res.status(401).json({
        error: "E-mail ou senha inválidos."
      });
    }

    const token = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "8h"
      }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch {
    res.status(500).json({
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

    res.json(admin);
  } catch {
    res.status(500).json({
      error: "Erro ao consultar administrador."
    });
  }
}