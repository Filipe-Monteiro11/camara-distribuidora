
import "dotenv/config";
import express from "express";
import cors from "cors";

import { prisma } from "./lib/prisma.js";
import { uploadDir } from "./middleware/upload.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import curriculoRoutes from "./routes/curriculoRoutes.js";

const app = express();

const PORT = Number(process.env.PORT) || 3001;

const origensPermitidas = (
  process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")
  .map((origem) => origem.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.disable("x-powered-by");

if (process.env.TRUST_PROXY === "1") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: origensPermitidas,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "100kb" }));

app.use(
  "/uploads",
  express.static(uploadDir, {
    dotfiles: "deny",
    index: false,
    fallthrough: false,
    maxAge: "1d"
  })
);

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.json({
      status: "online",
      database: "connected"
    });
  } catch {
    return res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/curriculos", curriculoRoutes);

app.use((req, res) => {
  return res.status(404).json({
    error: "Rota não encontrada."
  });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "O tamanho da requisição excede o limite permitido."
    });
  }

  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      error: "JSON inválido."
    });
  }

  if (error.status === 404) {
    return res.status(404).json({
      error: "Arquivo ou recurso não encontrado."
    });
  }

  console.error("Erro no servidor:", error);

  return res.status(500).json({
    error: "Erro interno do servidor."
  });
});

const servidor = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

async function encerrarServidor(sinal) {
  console.log(`Recebido ${sinal}. Encerrando servidor...`);

  servidor.close(async () => {
    try {
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      console.error("Erro ao encerrar conexão:", error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => encerrarServidor("SIGINT"));
process.on("SIGTERM", () => encerrarServidor("SIGTERM"));