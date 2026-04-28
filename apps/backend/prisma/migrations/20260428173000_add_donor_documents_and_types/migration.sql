-- CreateEnum
CREATE TYPE "DonorDocumentType" AS ENUM ('FICHA_INSCRICAO_ANEXO_I', 'DOCUMENTO_IDENTIFICACAO');

-- CreateEnum
CREATE TYPE "DonationDocumentType" AS ENUM ('PROPOSTA_DETALHADA');

-- AlterTable
ALTER TABLE "DonationDocument"
ADD COLUMN "documentType" "DonationDocumentType" NOT NULL DEFAULT 'PROPOSTA_DETALHADA';

-- CreateTable
CREATE TABLE "DonorDocument" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "documentType" "DonorDocumentType" NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "objectKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonationDocument_donationId_documentType_key" ON "DonationDocument"("donationId", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "DonorDocument_objectKey_key" ON "DonorDocument"("objectKey");

-- CreateIndex
CREATE INDEX "DonorDocument_donorId_idx" ON "DonorDocument"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "DonorDocument_donorId_documentType_key" ON "DonorDocument"("donorId", "documentType");

-- AddForeignKey
ALTER TABLE "DonorDocument" ADD CONSTRAINT "DonorDocument_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
