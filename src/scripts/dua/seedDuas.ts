import fs from "fs";
import path from "path";

import { prisma } from "../../config/prisma";

const CHUNK_SIZE = 500;

async function main() {
    const filePath = path.resolve(
        "data/dua/husn_en.json"
    );

    const raw = fs
        .readFileSync(filePath, "utf8")
        .replace(/^\uFEFF/, "");

    const json = JSON.parse(raw);

    const categories = json.English;

    for (const category of categories) {
        const createdCategory =
            await prisma.duaCategory.upsert({
                where: {
                    sourceId: category.ID,
                },
                update: {},
                create: {
                    sourceId: category.ID,
                    slug: category.TITLE
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    name: category.TITLE,
                },
            });

        const duas = category.TEXT.map(
            (dua: any) => ({
                sourceId: dua.ID,

                categoryId: createdCategory.id,

                title: category.TITLE,

                arabicText:
                    dua.ARABIC_TEXT ?? "",

                transliteration:
                    dua.LANGUAGE_ARABIC_TRANSLATED_TEXT ??
                    null,

                englishText:
                    dua.TRANSLATED_TEXT ?? "",

                repeat:
                    dua.REPEAT ?? null,

                audioUrl:
                    dua.AUDIO ?? null,
            })
        );

        for (
            let i = 0;
            i < duas.length;
            i += CHUNK_SIZE
        ) {
            const chunk = duas.slice(
                i,
                i + CHUNK_SIZE
            );

            await prisma.dua.createMany({
                data: chunk,
                skipDuplicates: true,
            });
        }

        console.log(
            `Seeded ${duas.length} duas from ${category.TITLE}`
        );
    }

    console.log("Dua seed complete");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });