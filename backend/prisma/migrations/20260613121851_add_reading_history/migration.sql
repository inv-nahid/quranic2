-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ayahId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingHistory_userId_idx" ON "ReadingHistory"("userId");

-- CreateIndex
CREATE INDEX "ReadingHistory_createdAt_idx" ON "ReadingHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "QuranAyah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
