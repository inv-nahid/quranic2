/*
  Warnings:

  - You are about to drop the column `number` on the `Hadith` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Hadith` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `HadithBook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `englishText` to the `Hadith` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `HadithBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hadith" DROP COLUMN "number",
DROP COLUMN "text",
ADD COLUMN     "arabicText" TEXT,
ADD COLUMN     "englishText" TEXT NOT NULL,
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "hadithNumber" INTEGER;

-- AlterTable
ALTER TABLE "HadithBook" ADD COLUMN     "description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Hadith_hadithNumber_idx" ON "Hadith"("hadithNumber");

-- CreateIndex
CREATE UNIQUE INDEX "HadithBook_slug_key" ON "HadithBook"("slug");
