-- CreateEnum
CREATE TYPE "FavoriteType" AS ENUM ('QURAN', 'HADITH', 'DUA');

-- CreateEnum
CREATE TYPE "TopicTargetType" AS ENUM ('QURAN', 'HADITH', 'DUA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuranSurah" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,

    CONSTRAINT "QuranSurah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuranAyah" (
    "id" INTEGER NOT NULL,
    "surahId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT,
    "juz" INTEGER NOT NULL,

    CONSTRAINT "QuranAyah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "FavoriteType" NOT NULL,
    "refId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ayahId" INTEGER,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HadithBook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HadithBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hadith" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapter" TEXT,
    "text" TEXT NOT NULL,
    "reference" TEXT,

    CONSTRAINT "Hadith_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuaCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DuaCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dua" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Dua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicMap" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "type" "TopicTargetType" NOT NULL,
    "refId" TEXT NOT NULL,

    CONSTRAINT "TopicMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");

-- CreateIndex
CREATE INDEX "Favorite_userId_type_idx" ON "Favorite"("userId", "type");

-- CreateIndex
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "TopicMap_type_refId_idx" ON "TopicMap"("type", "refId");

-- AddForeignKey
ALTER TABLE "QuranAyah" ADD CONSTRAINT "QuranAyah_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "QuranSurah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "QuranAyah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hadith" ADD CONSTRAINT "Hadith_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "HadithBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dua" ADD CONSTRAINT "Dua_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DuaCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMap" ADD CONSTRAINT "TopicMap_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
