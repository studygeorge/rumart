/*
  Warnings:

  - A unique constraint covering the columns `[tbankDolamiApplicationId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "tbankDolamiApplicationId" TEXT,
ADD COLUMN     "tbankDolamiData" JSONB,
ADD COLUMN     "tbankDolamiRedirectUrl" TEXT,
ADD COLUMN     "tbankDolamiStatus" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_tbankDolamiApplicationId_key" ON "orders"("tbankDolamiApplicationId");

-- CreateIndex
CREATE INDEX "orders_tbankDolamiApplicationId_idx" ON "orders"("tbankDolamiApplicationId");
