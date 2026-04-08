/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentData" JSONB,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paymentUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_paymentId_key" ON "orders"("paymentId");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "orders_paymentId_idx" ON "orders"("paymentId");
