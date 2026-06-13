/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Progress_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_key" ON "Progress"("userId");
