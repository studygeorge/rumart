-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT,
    "colorHex" TEXT,
    "memory" TEXT,
    "connectivity" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "oldPrice" DECIMAL(10,2),
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "stockCount" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- Шаг 1: Добавляем basePrice с временным значением по умолчанию
ALTER TABLE "products" ADD COLUMN "basePrice" DECIMAL(10,2) DEFAULT 0;

-- Шаг 2: Копируем существующие цены в basePrice
UPDATE "products" SET "basePrice" = "price";

-- Шаг 3: Удаляем значение по умолчанию (делаем basePrice обязательным)
ALTER TABLE "products" ALTER COLUMN "basePrice" DROP DEFAULT;

-- Шаг 4: Для каждого существующего продукта создаем базовый вариант
INSERT INTO "product_variants" ("id", "productId", "price", "oldPrice", "inStock", "stockCount", "sku", "images", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    "id",
    "price",
    "oldPrice",
    "inStock",
    "stockCount",
    "sku" || '-BASE',
    "images",
    "createdAt",
    NOW()
FROM "products";

-- Шаг 5: Удаляем старые поля из products (теперь они в variants)
ALTER TABLE "products" DROP COLUMN "price";
ALTER TABLE "products" DROP COLUMN "oldPrice";
ALTER TABLE "products" DROP COLUMN "inStock";
ALTER TABLE "products" DROP COLUMN "stockCount";
ALTER TABLE "products" DROP COLUMN "sku";

-- Добавляем variantInfo в cart_items и order_items
ALTER TABLE "cart_items" ADD COLUMN "variantInfo" JSONB;
ALTER TABLE "order_items" ADD COLUMN "variantInfo" JSONB;

-- Создаем индексы
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");
CREATE INDEX "product_variants_sku_idx" ON "product_variants"("sku");
CREATE INDEX "product_variants_inStock_idx" ON "product_variants"("inStock");

-- Добавляем внешние ключи
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" 
FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
