-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "maisProcurado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maisVendido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prioridade" INTEGER NOT NULL DEFAULT 0;
