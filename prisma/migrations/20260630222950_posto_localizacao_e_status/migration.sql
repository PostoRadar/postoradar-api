/*
  Warnings:

  - Added the required column `bairro` to the `postos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `postos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "postos" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bairro" VARCHAR(120) NOT NULL,
ADD COLUMN     "cep" VARCHAR(9),
ADD COLUMN     "estado" VARCHAR(2) NOT NULL;

-- CreateIndex
CREATE INDEX "postos_ativo_idx" ON "postos"("ativo");
