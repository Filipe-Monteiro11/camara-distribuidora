import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;

  if (!email || !senha || senha.length < 12) {
    throw new Error(
      "Configure ADMIN_EMAIL e ADMIN_PASSWORD com uma senha de pelo menos 12 caracteres."
    );
  }

  const administrador = await prisma.admin.findUnique({
    where: { email }
  });

  if (!administrador) {
    throw new Error("Administrador não encontrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  await prisma.admin.update({
    where: { id: administrador.id },
    data: { senhaHash }
  });

  console.log("Senha atualizada com sucesso.");
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}