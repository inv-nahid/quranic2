import { prisma } from "../../config/prisma";

export async function upsertProgress(userId: string, ayahId: string) {
  return prisma.progress.upsert({
    where: { userId },
    update: { ayahId },
    create: { userId, ayahId },
  });
}

export async function getProgress(userId: string) {
  return prisma.progress.findUnique({
    where: { userId },
    include: {
      ayah: {
        include: {
          surah: true,
        },
      },
    },
  });
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