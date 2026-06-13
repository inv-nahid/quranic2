/*
  Warnings:

  - You are about to drop the column `text` on the `Dua` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sourceId]` on the table `Dua` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sourceId]` on the table `DuaCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `DuaCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `arabicText` to the `Dua` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishText` to the `Dua` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `Dua` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `DuaCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `DuaCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dua" DROP COLUMN "text",
ADD COLUMN     "arabicText" TEXT NOT NULL,
ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "englishText" TEXT NOT NULL,
ADD COLUMN     "repeat" INTEGER,
ADD COLUMN     "sourceId" INTEGER NOT NULL,
ADD COLUMN     "transliteration" TEXT;

-- AlterTable
ALTER TABLE "DuaCategory" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "sourceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dua_sourceId_key" ON "Dua"("sourceId");

-- CreateIndex
CREATE INDEX "Dua_categoryId_idx" ON "Dua"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "DuaCategory_sourceId_key" ON "DuaCategory"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "DuaCategory_slug_key" ON "DuaCategory"("slug");
