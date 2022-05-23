-- CreateTable
CREATE TABLE "shipBars" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "fontColor" TEXT NOT NULL,
    "fontFamily" TEXT NOT NULL,
    "fontSize" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop" TEXT NOT NULL,

    CONSTRAINT "shipBars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shops" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Shops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipBars_uuid_key" ON "shipBars"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_uuid_key" ON "Shops"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Shops_name_key" ON "Shops"("name");

-- AddForeignKey
ALTER TABLE "shipBars" ADD CONSTRAINT "shipBars_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Shops"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
