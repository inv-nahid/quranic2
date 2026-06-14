import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";

import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/auth.store";
import { useMeQuery } from "@/src/queries/auth.queries";
import { useFavoritesQuery } from "@/src/queries/favorites.queries";
import { addFavorite, deleteFavorite } from "@/src/services/favorites.service";
import {
    useDashboardQuery,
    useDailyAyahQuery,
    useRandomHadithQuery,
} from "@/src/queries/dashboard.queries";
import { useNotesQuery } from "@/src/queries/notes.queries";
import { addNote, editNote, deleteNote } from "@/src/services/notes.service";
import { updateProgress } from "@/src/services/progress.service";

import { QuranView, HadithView, DuasView, ProfileView, NotesView } from "./components/SubViews";

// Fully responsive reusable SVG Icons so they render flawlessly across Android, iOS and Web
const MenuIcon = () => (
    <View style={styles.iconContainer}>
        {/* Simple inline SVG-like line drawing */}
        <View style={[styles.menuLine, { width: 18 }]} />
        <View style={[styles.menuLine, { width: 14 }]} />
        <View style={[styles.menuLine, { width: 18 }]} />
    </View>
);

const SearchIconSvg = () => (
    <View style={styles.iconContainer}>
        <View style={styles.searchCircle} />
        <View style={styles.searchHandle} />
    </View>
);

const FlameIcon = () => (
    <View style={styles.flameWrapper}>
        <View style={styles.flameBase} />
        <View style={styles.flameTip} />
    </View>
);

export default function Home() {
    const { logout } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<"Home" | "Quran" | "Hadith" | "Duas" | "Notes" | "Profile">("Home");

    const user = useAuthStore((state) => state.user);
    const { data: meData } = useMeQuery();
    const { data: favoritesData, refetch: refetchFavorites } = useFavoritesQuery();
    const favoritesList = favoritesData || [];

    const { data: notesData, refetch: refetchNotes } = useNotesQuery();
    const notesList = notesData || [];

    const {
        data: dashboardData,
        isLoading: dashboardLoading,
        error: dashboardError,
        refetch: refetchDashboard,
    } = useDashboardQuery();

    const {
        data: dailyAyahData,
        isLoading: dailyAyahLoading,
        refetch: refetchDailyAyah,
    } = useDailyAyahQuery();

    const {
        data: randomHadithData,
        isLoading: randomHadithLoading,
        refetch: refetchRandomHadith,
    } = useRandomHadithQuery();

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            refetchDashboard(),
            refetchDailyAyah(),
            refetchRandomHadith(),
            refetchFavorites(),
            refetchNotes(),
        ]);
        setRefreshing(false);
    };

    const handleToggleFavorite = async (refId: string, type: "QURAN" | "HADITH" | "DUA") => {
        try {
            const list = favoritesList || [];
            const existingFav = list.find(
                (f: any) => f.refId === refId && (f.type === type || (!f.type && type === "QURAN"))
            );
            if (existingFav) {
                await deleteFavorite(existingFav.id);
            } else {
                await addFavorite(type, refId);
            }
            refetchFavorites();
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    const handleSaveNote = async (noteIdOrAyahId: string, content: string, surahId?: number, isEdit = false) => {
        try {
            if (isEdit) {
                await editNote(noteIdOrAyahId, { content });
            } else {
                const payload: any = { content };
                if (noteIdOrAyahId !== "freestyle") {
                    payload.ayahId = noteIdOrAyahId;
                }
                await addNote(payload);
            }
            refetchNotes();
            refetchDashboard();
        } catch (err) {
            console.error("Error saving note:", err);
        }
    };

    const handleDeleteNote = async (noteId: string | number) => {
        try {
            await deleteNote(noteId);
            refetchNotes();
            refetchDashboard();
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };

    const handleUpdateProgress = async (surahId: number, ayahNumber: number, percentage: number) => {
        try {
            await updateProgress(surahId, ayahNumber, percentage);
            refetchDashboard();
        } catch (err) {
            console.error("Error updating progress:", err);
        }
    };

    // Calculate a personalized display name from the user's email
    const email = user?.email || meData?.email || "Reader";
    const displayName = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);

    const isLoading = dashboardLoading || dailyAyahLoading || randomHadithLoading;

    // Loading State
    if (isLoading && !refreshing) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0A6C51" />
                    <Text style={styles.loadingText}>Connecting to Quranic servers...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // fallback streak count
    const streakCount = dashboardData?.stats?.currentStreak ?? 7;

    // Fallback/Actual resume points
    const resumeInfo = dashboardData?.resume || {
        surah: { id: 2, name: "Al-Baqarah", englishName: "The Cow" },
        ayah: { id: "1", number: 255, text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ" },
        completion: { percentage: 60 }
    };

    const renderActiveContent = () => {
        switch (activeTab) {
            case "Quran":
                return (
                    <QuranView
                        favoritesList={favoritesList}
                        onToggleFavorite={handleToggleFavorite}
                        notesList={notesList}
                        onSaveNote={handleSaveNote}
                        onDeleteNote={handleDeleteNote}
                        onUpdateProgress={handleUpdateProgress}
                    />
                );
            case "Hadith":
                return (
                    <HadithView
                        favoritesList={favoritesList}
                        onToggleFavorite={handleToggleFavorite}
                    />
                );
            case "Duas":
                return (
                    <DuasView
                        favoritesList={favoritesList}
                        onToggleFavorite={handleToggleFavorite}
                    />
                );
            case "Notes":
                return (
                    <NotesView
                        notesList={notesList}
                        onSaveNote={handleSaveNote}
                        onDeleteNote={handleDeleteNote}
                    />
                );
            case "Profile":
                return (
                    <ProfileView
                        userSession={user}
                        favoritesList={favoritesList}
                        onLogout={logout}
                    />
                );
            default:
                return (
                    <ScrollView
                        style={styles.container}
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={["#0A6C51"]}
                            />
                        }
                    >
                        {/* Greeting Row */}
                        <View style={styles.greetingRow}>
                            <View style={styles.greetingLeft}>
                                <Text style={styles.greetingSubtitle}>Welcome Back</Text>
                                <Text style={styles.greetingTitle}>Assalamu Alaikum, {displayName}</Text>
                            </View>
                            <View style={styles.streakCard}>
                                <FlameIcon />
                                <Text style={styles.streakText}>{streakCount} Days</Text>
                            </View>
                        </View>

                        {/* Overarching Error Notification Card */}
                        {dashboardError && (
                            <View style={styles.errorCard}>
                                <Text style={styles.errorText}>
                                    Currently offline. Showing last cached reading metrics.
                                </Text>
                            </View>
                        )}

                        {/* Continue Reading Section */}
                        <TouchableOpacity
                            style={styles.continueCard}
                            onPress={() => setActiveTab("Quran")}
                        >
                            <View style={styles.continueHeader}>
                                <View style={styles.continueBadge}>
                                    <Text style={styles.continueBadgeText}>Continue Reading</Text>
                                </View>
                                {/* Circular progress representation */}
                                <View style={styles.progressCircle}>
                                    <Text style={styles.progressCircleText}>
                                        {resumeInfo.completion?.percentage ?? 60}%
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.continueSurah}>Surah {resumeInfo.surah?.englishName || "Al-Baqarah"}</Text>
                            <Text style={styles.continueVerse}>Verse {resumeInfo.ayah?.number || 255} (Ayah)</Text>

                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${resumeInfo.completion?.percentage ?? 60}%` }
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>

                        {/* Quick Actions Grid */}
                        <View style={styles.gridContainer}>
                            <View style={styles.gridRow}>
                                <TouchableOpacity
                                    style={styles.gridItem}
                                    onPress={() => setActiveTab("Quran")}
                                >
                                    <View style={[styles.gridIconBg, { backgroundColor: "#E0F2FE" }]}>
                                        <View style={styles.bookIcon} />
                                    </View>
                                    <Text style={styles.gridItemLabel}>Quran</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.gridItem}
                                    onPress={() => setActiveTab("Hadith")}
                                >
                                    <View style={[styles.gridIconBg, { backgroundColor: "#E6F4EA" }]}>
                                        <Text style={styles.hadithText}>99</Text>
                                    </View>
                                    <Text style={styles.gridItemLabel}>Hadith</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.gridRow}>
                                <TouchableOpacity
                                    style={styles.gridItem}
                                    onPress={() => setActiveTab("Duas")}
                                >
                                    <View style={[styles.gridIconBg, { backgroundColor: "#FCE8E6" }]}>
                                        <Text style={styles.sparkleText}>✦</Text>
                                    </View>
                                    <Text style={styles.gridItemLabel}>Duas</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.gridItem}
                                    onPress={() => setActiveTab("Quran")} // Map search to Quran page
                                >
                                    <View style={[styles.gridIconBg, { backgroundColor: "#F1F3F4" }]}>
                                        <SearchIconSvg />
                                    </View>
                                    <Text style={styles.gridItemLabel}>Search</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Daily Ayah Title */}
                        <Text style={styles.sectionHeader}>Daily Ayah</Text>

                        {/* Daily Ayah Card */}
                        <View style={styles.dailyCardBorder}>
                            <View style={styles.goldBadgeContainer}>
                                <View style={styles.goldBadge}>
                                    <Text style={styles.goldBadgeText}>VERSE OF THE DAY</Text>
                                </View>
                            </View>

                            <View style={styles.dailyCard}>
                                <Text style={styles.arabicText}>
                                    {dailyAyahData?.ayah?.text || "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ"}
                                </Text>

                                <Text style={styles.englishText}>
                                    {dailyAyahData?.ayah?.text ? (
                                        `"Allah! There is no god but He, the Living, the Self-subsisting, Eternal."`
                                    ) : (
                                        `"Allah! There is no god but He, the Living, the Self-subsisting, Eternal."`
                                    )}
                                </Text>

                                <View style={styles.refRow}>
                                    <Text style={styles.refText}>
                                        🔖 Surah {dailyAyahData?.surah?.englishName || "Al-Baqarah"}, {dailyAyahData?.ayah?.number || 255}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.readMoreButton}
                                    onPress={() => setActiveTab("Quran")}
                                >
                                    <Text style={styles.readMoreButtonText}>Read More</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Hadith / Quote Of the Day */}
                        <View style={styles.quoteCard}>
                            <Text style={styles.quoteSymbol}>“</Text>
                            <Text style={styles.quoteText}>
                                {randomHadithData?.englishText ||
                                    "The best among you are those who learn the Quran and teach it."}
                            </Text>
                            <Text style={styles.quoteNarrator}>
                                — {randomHadithData?.book?.name || "Sahih al-Bukhari"}
                            </Text>
                        </View>

                        {/* Dev Mode Session Indicator */}
                        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                            <Text style={styles.logoutButtonText}>Log Out ({email})</Text>
                        </TouchableOpacity>

                        {/* Padding to allow scroll past bottom float navigation */}
                        <View style={{ height: 80 }} />
                    </ScrollView>
                );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton}>
                    <MenuIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {activeTab === "Home" ? "Quranic" : activeTab}
                </Text>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setActiveTab("Quran")} // Go to search / Quran
                >
                    <SearchIconSvg />
                </TouchableOpacity>
            </View>

            {renderActiveContent()}

            {/* Bottom Tab Layout */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={activeTab === "Home" ? styles.tabItemActive : styles.tabItemOption}
                    onPress={() => setActiveTab("Home")}
                >
                    <Text style={activeTab === "Home" ? styles.tabItemActiveText : styles.tabItemOptionText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={activeTab === "Quran" ? styles.tabItemActive : styles.tabItemOption}
                    onPress={() => setActiveTab("Quran")}
                >
                    <Text style={activeTab === "Quran" ? styles.tabItemActiveText : styles.tabItemOptionText}>Quran</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={activeTab === "Hadith" ? styles.tabItemActive : styles.tabItemOption}
                    onPress={() => setActiveTab("Hadith")}
                >
                    <Text style={activeTab === "Hadith" ? styles.tabItemActiveText : styles.tabItemOptionText}>Hadith</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={activeTab === "Duas" ? styles.tabItemActive : styles.tabItemOption}
                    onPress={() => setActiveTab("Duas")}
                >
                    <Text style={activeTab === "Duas" ? styles.tabItemActiveText : styles.tabItemOptionText}>Duas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={activeTab === "Notes" ? styles.tabItemActive : styles.tabItemOption}
                    onPress={() => setActiveTab("Notes")}
                >
                    <Text style={activeTab === "Notes" ? styles.tabItemActiveText : styles.tabItemOptionText}>Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={activeTab === "Profile" ? styles.tabItemActive : styles.tabItemOption}
                    onPress={() => setActiveTab("Profile")}
                >
                    <Text style={activeTab === "Profile" ? styles.tabItemActiveText : styles.tabItemOptionText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FAF8F5", // Royal Ivory
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF8F5",
    },
    loadingText: {
        marginTop: 14,
        fontSize: 14,
        color: "#003E2F",
        fontFamily: "Georgia",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: "#003E2F", // Deep Forest Green
        borderBottomWidth: 2,
        borderBottomColor: "#D4AF37", // Royal Gold
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#D4AF37", // Gold
    },
    headerButton: {
        padding: 8,
    },
    // Svg custom mockups
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    menuLine: {
        height: 2,
        backgroundColor: "#D4AF37", // Gold
        marginVertical: 2.5,
        borderRadius: 1,
    },
    searchCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "#D4AF37", // Gold
    },
    searchHandle: {
        width: 6,
        height: 2,
        backgroundColor: "#D4AF37", // Gold
        transform: [{ rotate: "45deg" }],
        alignSelf: "flex-end",
        marginTop: -2,
    },
    flameWrapper: {
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    flameBase: {
        width: 10,
        height: 10,
        backgroundColor: "#D4AF37", // Gold
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        transform: [{ rotate: "45deg" }],
    },
    flameTip: {
        width: 6,
        height: 6,
        backgroundColor: "#D4AF37",
        transform: [{ rotate: "-45deg" }],
        position: "absolute",
        top: 2,
    },
    greetingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    greetingLeft: {
        flex: 1,
    },
    greetingSubtitle: {
        fontSize: 14,
        color: "#D4AF37", // Gold
        fontWeight: "600",
        fontFamily: "Georgia",
        marginBottom: 4,
    },
    greetingTitle: {
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F", // Deep Forest Green
    },
    streakCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6D5B8",
        borderLeftWidth: 3,
        borderLeftColor: "#D4AF37",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    streakText: {
        fontSize: 10,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F",
        marginTop: 4,
    },
    errorCard: {
        backgroundColor: "#FFF5F5",
        borderColor: "#FFD8D8",
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 12,
        fontFamily: "Georgia",
        color: "#C53030",
        textAlign: "center",
    },
    continueCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E6D5B8", // Gold/Amber Border
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
    },
    continueHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    continueBadge: {
        backgroundColor: "#E2F5EC",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "#0A6C51",
    },
    continueBadgeText: {
        fontSize: 11,
        fontWeight: "600",
        fontFamily: "Georgia",
        color: "#0A6C51",
    },
    progressCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 2,
        borderColor: "#D4AF37", // Gold
        justifyContent: "center",
        alignItems: "center",
    },
    progressCircleText: {
        fontSize: 9,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F",
    },
    continueSurah: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F",
        marginBottom: 4,
    },
    continueVerse: {
        fontSize: 13,
        fontFamily: "Georgia",
        color: "#606860",
        marginBottom: 16,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: "#F0EAE0", // Soft background
        borderRadius: 3,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#D4AF37", // Royal Gold
        borderRadius: 3,
    },
    // Grid Setup
    gridContainer: {
        marginBottom: 20,
    },
    gridRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    gridItem: {
        backgroundColor: "#FFFFFF",
        flex: 0.485,
        borderRadius: 14,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E6D5B8",
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    gridIconBg: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    bookIcon: {
        width: 14,
        height: 18,
        borderWidth: 2,
        borderColor: "#D4AF37",
        borderRadius: 2,
    },
    hadithText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#D4AF37",
        fontFamily: "Georgia",
    },
    sparkleText: {
        fontSize: 16,
        color: "#D4AF37",
    },
    gridItemLabel: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "Georgia",
        color: "#003E2F",
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F",
        marginBottom: 12,
        marginTop: 4,
    },
    dailyCardBorder: {
        borderWidth: 1.5,
        borderColor: "#D4AF37", // Gold Border
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    goldBadgeContainer: {
        position: "absolute",
        top: -12,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 10,
    },
    goldBadge: {
        backgroundColor: "#D4AF37", // Royal Gold
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 10,
    },
    goldBadgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "bold",
        fontFamily: "Georgia",
        letterSpacing: 0.5,
    },
    dailyCard: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingTop: 24,
        alignItems: "center",
    },
    arabicText: {
        fontSize: 24,
        textAlign: "center",
        color: "#003E2F",
        lineHeight: 42,
        fontWeight: "bold",
        marginBottom: 16,
        fontFamily: "serif",
    },
    englishText: {
        fontSize: 14,
        textAlign: "center",
        color: "#303830",
        lineHeight: 22,
        fontFamily: "Georgia",
        fontStyle: "italic",
        marginBottom: 16,
    },
    refRow: {
        marginBottom: 18,
    },
    refText: {
        fontSize: 12,
        fontFamily: "Georgia",
        color: "#D4AF37",
        fontWeight: "600",
    },
    readMoreButton: {
        backgroundColor: "#003E2F", // Royal Emerald Green
        borderColor: "#D4AF37",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 28,
        width: "100%",
        alignItems: "center",
    },
    readMoreButtonText: {
        color: "#D4AF37", // Royal Gold
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Georgia",
    },
    quoteCard: {
        backgroundColor: "#E2F5EC",
        borderRadius: 14,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E6D5B8",
    },
    quoteSymbol: {
        fontSize: 34,
        color: "#D4AF37",
        lineHeight: 18,
        marginTop: 4,
    },
    quoteText: {
        fontSize: 13,
        fontFamily: "Georgia",
        fontStyle: "italic",
        color: "#003E2F",
        lineHeight: 18,
        marginBottom: 8,
    },
    quoteNarrator: {
        fontSize: 11,
        fontWeight: "600",
        fontFamily: "Georgia",
        color: "#D4AF37",
        textAlign: "right",
    },
    logoutButton: {
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        alignSelf: "center",
    },
    logoutButtonText: {
        fontSize: 12,
        color: "#909090",
        fontFamily: "Georgia",
        textDecorationLine: "underline",
    },
    tabBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: "#003E2F", // Deep Forest Green
        borderTopWidth: 2,
        borderTopColor: "#D4AF37", // Royal Gold
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 2,
    },
    tabItemActive: {
        backgroundColor: "#084D3B",
        borderColor: "#D4AF37",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tabItemActiveText: {
        color: "#D4AF37", // Royal Gold
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: "Georgia",
    },
    tabItemOption: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    tabItemOptionText: {
        color: "#A0BCA8", // Muted Sage Green
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "Georgia",
    },
});
