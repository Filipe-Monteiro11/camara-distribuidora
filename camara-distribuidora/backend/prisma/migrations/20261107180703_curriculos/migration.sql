-- CreateTable
CREATE TABLE "Curriculo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'novo',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Curriculo_criadoEm_idx" ON "Curriculo"("criadoEm");

-- CreateIndex
CREATE INDEX "Curriculo_status_idx" ON "Curriculo"("status");
