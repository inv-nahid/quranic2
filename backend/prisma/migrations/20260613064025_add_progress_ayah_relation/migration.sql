-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "QuranAyah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
