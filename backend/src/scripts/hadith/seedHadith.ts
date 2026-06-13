import fs from "fs";
import path from "path";

import { prisma } from "../../config/prisma";

const CHUNK_SIZE = 500;

type HadithFile = {
    metadata: {
        id: number;
        english: {
            title: string;
        };
    };
    chapters: {
        id: number;
        english: string;
    }[];
    hadiths: {
        id: number;
        idInBook: number;
        chapterId: number;
        bookId: number;
        arabic: string;
        english: {
            narrator: string;
            text: string;
        };
    }[];
};


async function seedBook(
    filePath: string,
    slug: string
) {
    const raw = fs.readFileSync(filePath, "utf8");

    const data: HadithFile = JSON.parse(raw);

    const book = await prisma.hadithBook.upsert({
        where: {
            sourceId: data.metadata.id,
        },
        update: {},
        create: {
            sourceId: data.metadata.id,
            slug,
            name: data.metadata.english.title,
        },
    });

    const chapterMap = new Map(
        data.chapters.map((chapter) => [
            chapter.id,
            chapter.english,
        ])
    );

    const records = data.hadiths.map((hadith) => ({
        sourceId: hadith.id,

        bookId: book.id,

        hadithNumber: hadith.idInBook,

        chapterId: hadith.chapterId,

        chapter:
            chapterMap.get(hadith.chapterId) ?? null,

        narrator:
            hadith.english?.narrator ?? null,

        arabicText:
            hadith.arabic ?? null,

        englishText:
            hadith.english?.text ?? "",
    }));

    for (
        let i = 0;
        i < records.length;
        i += CHUNK_SIZE
    ) {
        const chunk = records.slice(
            i,
            i + CHUNK_SIZE
        );

        await prisma.hadith.createMany({
            data: chunk,
            skipDuplicates: true,
        });
    }

    console.log(
        `Seeded ${records.length} hadiths from ${book.name}`
    );
}

async function main() {
    await seedBook(
        path.resolve(
            "data/hadith/bukhari.json"
        ),
        "bukhari"
    );

    await seedBook(
        path.resolve(
            "data/hadith/muslim.json"
        ),
        "muslim"
    );

    await seedBook(
        path.resolve(
            "data/hadith/riyad_assalihin.json"
        ),
        "riyad-assalihin"
    );

    console.log("Hadith seed complete");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });