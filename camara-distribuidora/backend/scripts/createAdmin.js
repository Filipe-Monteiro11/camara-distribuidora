
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const senha = process.env.ADMIN_PASSWORD;

async function main() {
  if (!email || !senha || senha.length < 12) {
    throw new Error(
      "Configure ADMIN_EMAIL e ADMIN_PASSWORD no .env com uma senha de pelo menos 12 caracteres."
    );
  }

  const existente = await prisma.admin.findUnique({
    where: { email }
  });

  if (existente) {
    console.log("Administrador já cadastrado.");
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  await prisma.admin.create({
    data: { email, senhaHash }
  });

  console.log("Administrador criado com sucesso.");
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
