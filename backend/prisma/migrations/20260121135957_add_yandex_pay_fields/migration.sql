/*
  Warnings:

  - A unique constraint covering the columns `[yandexPayOrderId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" TEXT DEFAULT 'TBANK',
ADD COLUMN     "yandexPayData" JSONB,
ADD COLUMN     "yandexPayOrderId" TEXT,
ADD COLUMN     "yandexPaymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "orders_yandexPayOrderId_key" ON "orders"("yandexPayOrderId");

-- CreateIndex
CREATE INDEX "orders_yandexPayOrderId_idx" ON "orders"("yandexPayOrderId");

-- CreateIndex
CREATE INDEX "orders_paymentMethod_idx" ON "orders"("paymentMethod");
