-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailSentAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "orders_emailSent_idx" ON "orders"("emailSent");
