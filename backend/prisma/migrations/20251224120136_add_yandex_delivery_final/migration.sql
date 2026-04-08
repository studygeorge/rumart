/*
  Warnings:

  - A unique constraint covering the columns `[deliveryId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'REJECTED';
ALTER TYPE "OrderStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryCost" DECIMAL(10,2),
ADD COLUMN     "deliveryData" JSONB,
ADD COLUMN     "deliveryEstimatedDate" TEXT,
ADD COLUMN     "deliveryId" TEXT,
ADD COLUMN     "deliveryPointAddress" TEXT,
ADD COLUMN     "deliveryPointId" TEXT,
ADD COLUMN     "deliveryStatus" TEXT,
ADD COLUMN     "deliveryTrackingUrl" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_deliveryId_key" ON "orders"("deliveryId");

-- CreateIndex
CREATE INDEX "orders_deliveryId_idx" ON "orders"("deliveryId");

-- CreateIndex
CREATE INDEX "orders_deliveryStatus_idx" ON "orders"("deliveryStatus");
