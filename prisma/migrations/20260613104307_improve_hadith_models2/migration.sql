/*
  Warnings:

  - You are about to drop the column `grade` on the `Hadith` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Hadith` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sourceId]` on the table `Hadith` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `Hadith` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hadith" DROP COLUMN "grade",
DROP COLUMN "reference",
ADD COLUMN     "chapterId" INTEGER,
ADD COLUMN     "narrator" TEXT,
ADD COLUMN     "sourceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hadith_sourceId_key" ON "Hadith"("sourceId");
