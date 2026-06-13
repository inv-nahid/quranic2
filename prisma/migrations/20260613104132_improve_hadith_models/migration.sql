/*
  Warnings:

  - A unique constraint covering the columns `[sourceId]` on the table `HadithBook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `HadithBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HadithBook" ADD COLUMN     "sourceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HadithBook_sourceId_key" ON "HadithBook"("sourceId");
