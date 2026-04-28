-- CreateTable
CREATE TABLE "DonationDocument" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "objectKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonationDocument_objectKey_key" ON "DonationDocument"("objectKey");

-- CreateIndex
CREATE INDEX "DonationDocument_donationId_idx" ON "DonationDocument"("donationId");

-- AddForeignKey
ALTER TABLE "DonationDocument" ADD CONSTRAINT "DonationDocument_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
