export interface Surah {
    id: number;
    name: string;
    englishName: string;
}

export interface Ayah {
    id: string;
    surahId: number;
    number: number;
    text: string;
    juz?: number;
}

export interface DashboardResponse {
    resume: {
        updatedAt: string;
        surah: Surah;
        ayah: {
            id: string;
            number: number;
            text: string;
        };
        historyCount: number;
        currentStreak: number;
        completion: {
            totalReads: number;
            uniqueAyahsRead: number;
            totalAyahs: number;
            percentage: number;
        };
    } | null;
    stats: {
        totalReads: number;
        uniqueAyahsRead: number;
        totalAyahs: number;
        completionPercentage: number;
        surahsVisited: number;
        favoriteCount: number;
        noteCount: number;
        currentStreak: number;
    };
    recentHistory: Array<{
        readAt: string;
        surah: Surah;
        ayah: {
            id: string;
            number: number;
        };
    }>;
}

export interface DailyAyahResponse {
    date: string;
    surah: Surah;
    ayah: {
        id: string;
        number: number;
        text: string;
    };
}

export interface HadithResponse {
    id: string;
    hadithNumber: number;
    chapter: string;
    narrator: string;
    arabicText: string;
    englishText: string;
    book: {
        id: string;
        name: string;
        slug: string;
    };
}
