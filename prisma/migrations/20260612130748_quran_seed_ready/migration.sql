/*
  Warnings:

  - You are about to drop the column `ayahNumber` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `surahId` on the `Progress` table. All the data in the column will be lost.
  - The primary key for the `QuranAyah` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `translation` on the `QuranAyah` table. All the data in the column will be lost.
  - Added the required column `ayahId` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_ayahId_fkey";

-- AlterTable
ALTER TABLE "Hadith" ADD COLUMN     "number" INTEGER;

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "ayahId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "ayahNumber",
DROP COLUMN "surahId",
ADD COLUMN     "ayahId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuranAyah" DROP CONSTRAINT "QuranAyah_pkey",
DROP COLUMN "translation",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "QuranAyah_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Hadith_bookId_idx" ON "Hadith"("bookId");

-- CreateIndex
CREATE INDEX "QuranAyah_surahId_number_idx" ON "QuranAyah"("surahId", "number");

-- CreateIndex
CREATE INDEX "QuranAyah_juz_idx" ON "QuranAyah"("juz");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "QuranAyah"("id") ON DELETE SET NULL ON UPDATE CASCADE;
