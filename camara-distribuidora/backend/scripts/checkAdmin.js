import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;

  if (!email || !senha) {
    console.log("Configure ADMIN_EMAIL e ADMIN_PASSWORD no .env.");
    return;
  }

  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  console.log("Administrador encontrado:", Boolean(admin));

  if (admin) {
    const senhaCorreta = await bcrypt.compare(senha, admin.senhaHash);
    console.log("Senha corresponde:", senhaCorreta);
  }
}

try {
  await main();
} catch (error) {
  console.error("Erro ao verificar administrador:", error.message);
} finally {
  await prisma.$disconnect();
}