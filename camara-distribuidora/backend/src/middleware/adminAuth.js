import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export async function adminAuth(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Autenticação necessária."
    });
  }

  try {
    const token = authorization.slice(7);

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    if (
      typeof payload !== "object" ||
      typeof payload.adminId !== "string" ||
      !Number.isInteger(payload.tokenVersion)
    ) {
      return res.status(401).json({
        error: "Token inválido."
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: { tokenVersion: true }
    });

    if (!admin || admin.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({
        error: "Sessão inválida. Faça login novamente."
      });
    }

    req.adminId = payload.adminId;
    return next();
  } catch (error) {
    if (
      ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"]
        .includes(error.name)
    ) {
      return res.status(401).json({
        error: "Token inválido ou expirado."
      });
    }

    console.error("Erro de autenticação:", error);

    return res.status(500).json({
      error: "Não foi possível validar a autenticação."
    });
  }
}