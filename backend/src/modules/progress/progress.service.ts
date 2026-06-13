import { prisma } from "../../config/prisma";

export async function upsertProgress(
  userId: string,
  ayahId: string
) {
  return prisma.$transaction(async (tx) => {
    const existing =
      await tx.progress.findUnique({
        where: {
          userId,
        },
      });

    const progress = existing
      ? await tx.progress.update({
        where: {
          userId,
        },
        data: {
          ayahId,
        },
      })
      : await tx.progress.create({
        data: {
          userId,
          ayahId,
        },
      });

    await tx.readingHistory.create({
      data: {
        userId,
        ayahId,
      },
    });

    return progress;
  });
}

export async function getHistory(
  userId: string
) {
  return prisma.readingHistory.findMany({
    where: {
      userId,
    },
    include: {
      ayah: {
        include: {
          surah: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
}

export async function getProgress(
  userId: string
) {
  const progress =
    await prisma.progress.findUnique({
      where: {
        userId,
      },
      include: {
        ayah: {
          include: {
            surah: true,
          },
        },
      },
    });

  if (!progress) {
    return null;
  }

  const [
    historyCount,
    uniqueAyahs,
    totalAyahs,
  ] = await Promise.all([
    prisma.readingHistory.count({
      where: {
        userId,
      },
    }),

    prisma.readingHistory.findMany({
      where: {
        userId,
      },
      distinct: ["ayahId"],
      select: {
        ayahId: true,
      },
    }),

    prisma.quranAyah.count(),
  ]);

  const history =
    await prisma.readingHistory.findMany({
      where: {
        userId,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const uniqueDays = [
    ...new Set(
      history.map((item) =>
        item.createdAt
          .toISOString()
          .split("T")[0]
      )
    ),
  ];

  let currentStreak = 0;

  let cursor = new Date();

  while (true) {
    const day = cursor
      .toISOString()
      .split("T")[0];

    if (!uniqueDays.includes(day))
      break;

    currentStreak++;

    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  const uniqueAyahsRead =
    uniqueAyahs.length;

  const percentage =
    totalAyahs === 0
      ? 0
      : Number(
        (
          (uniqueAyahsRead /
            totalAyahs) *
          100
        ).toFixed(2)
      );

  return {
    updatedAt: progress.updatedAt,
    surah: {
      id: progress.ayah.surah.id,
      name: progress.ayah.surah.name,
      englishName:
        progress.ayah.surah.englishName,
    },
    ayah: {
      id: progress.ayah.id,
      number: progress.ayah.number,
      text: progress.ayah.text,
    },
    historyCount,
    currentStreak,
    completion: {
      totalReads: historyCount,
      uniqueAyahsRead,
      totalAyahs,
      percentage,
    },
  };
}

export async function getStats(
  userId: string
) {
  const [
    totalReads,

    uniqueAyahs,

    history,

    favoriteCount,

    noteCount,

    totalAyahs,
  ] = await Promise.all([
    prisma.readingHistory.count({
      where: {
        userId,
      },
    }),

    prisma.readingHistory.findMany({
      where: {
        userId,
      },
      distinct: ["ayahId"],
      select: {
        ayahId: true,
        ayah: {
          select: {
            surahId: true,
          },
        },
      },
    }),

    prisma.readingHistory.findMany({
      where: {
        userId,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.favorite.count({
      where: {
        userId,
      },
    }),

    prisma.note.count({
      where: {
        userId,
      },
    }),
    prisma.quranAyah.count(),
  ]);

  const surahsVisited = new Set(
    uniqueAyahs.map(
      (item) => item.ayah.surahId
    )
  ).size;

  const uniqueAyahsRead =
    uniqueAyahs.length;

  const completionPercentage =
    totalAyahs === 0
      ? 0
      : Number(
        (
          (uniqueAyahsRead /
            totalAyahs) *
          100
        ).toFixed(2)
      );

  const uniqueDays = [
    ...new Set(
      history.map((item) =>
        item.createdAt
          .toISOString()
          .split("T")[0]
      )
    ),
  ];

  let currentStreak = 0;

  let cursor = new Date();

  while (true) {
    const day = cursor
      .toISOString()
      .split("T")[0];

    if (!uniqueDays.includes(day))
      break;

    currentStreak++;

    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  return {
    totalReads,

    uniqueAyahsRead,

    totalAyahs,

    completionPercentage,

    surahsVisited,

    favoriteCount,

    noteCount,

    currentStreak,
  };
}

export async function getStreak(
  userId: string
) {
  const history =
    await prisma.readingHistory.findMany({
      where: {
        userId,
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const uniqueDays = [
    ...new Set(
      history.map((item) =>
        item.createdAt
          .toISOString()
          .split("T")[0]
      )
    ),
  ];

  let currentStreak = 0;

  let cursor = new Date();

  while (true) {
    const day = cursor
      .toISOString()
      .split("T")[0];

    if (!uniqueDays.includes(day))
      break;

    currentStreak++;

    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  return {
    currentStreak,
    activeDays: uniqueDays.length,
  };
}

export async function deleteProgress(userId: string) {
  const progress = await prisma.progress.findUnique({
    where: { userId },
  });

  if (!progress) return false;

  await prisma.progress.delete({
    where: { userId },
  });

  return true;
}