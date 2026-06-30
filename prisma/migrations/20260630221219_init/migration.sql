-- CreateEnum
CREATE TYPE "Combustivel" AS ENUM ('GASOLINA_COMUM', 'GASOLINA_ADITIVADA', 'ETANOL', 'DIESEL', 'DIESEL_S10', 'GNV');

-- CreateTable
CREATE TABLE "postos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(160) NOT NULL,
    "bandeira" VARCHAR(80) NOT NULL,
    "cidade" VARCHAR(120) NOT NULL,
    "endereco" VARCHAR(240) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precos" (
    "id" UUID NOT NULL,
    "posto_id" UUID NOT NULL,
    "combustivel" "Combustivel" NOT NULL,
    "valor" DECIMAL(6,3) NOT NULL,
    "reportado_por" UUID NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "precos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "postos_cidade_idx" ON "postos"("cidade");

-- CreateIndex
CREATE INDEX "precos_posto_id_idx" ON "precos"("posto_id");

-- CreateIndex
CREATE UNIQUE INDEX "precos_posto_id_combustivel_key" ON "precos"("posto_id", "combustivel");

-- AddForeignKey
ALTER TABLE "precos" ADD CONSTRAINT "precos_posto_id_fkey" FOREIGN KEY ("posto_id") REFERENCES "postos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
