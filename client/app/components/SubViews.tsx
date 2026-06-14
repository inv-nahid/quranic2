import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    ScrollView,
} from "react-native";

import { useSurahsQuery, useSurahAyahsQuery, useArabicSurahQuery } from "@/src/queries/quran.queries";
import { useHadithBooksQuery, useHadithBookHadithsQuery } from "@/src/queries/hadith.queries";
import { useDuaCategoriesQuery, useDuasByCategoryQuery } from "@/src/queries/dua.queries";
import { useNotesQuery } from "@/src/queries/notes.queries";

// ----------------------------------------------------
// QURAN VIEW
// ----------------------------------------------------
export function QuranView({
    favoritesList = [],
    onToggleFavorite,
    notesList = [],
    onSaveNote,
    onDeleteNote,
    onUpdateProgress,
}: {
    favoritesList: any[];
    onToggleFavorite: any;
    notesList: any[];
    onSaveNote: any;
    onDeleteNote: any;
    onUpdateProgress: any;
}) {
    const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
    const [selectedSurahName, setSelectedSurahName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Inline Note editors state
    const [activeNoteAyahId, setActiveNoteAyahId] = useState<string | null>(null);
    const [noteInputText, setNoteInputText] = useState("");

    const { data: surahs, isLoading: surahsLoading } = useSurahsQuery();
    const { data: ayahs, isLoading: ayahsLoading } = useSurahAyahsQuery(selectedSurahId);
    const { data: arabicSurah, isLoading: arabicLoading } = useArabicSurahQuery(selectedSurahId);

    const filteredSurahs = (surahs || []).filter((s: any) =>
        s.englishName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name?.includes(searchQuery)
    );

    const handleSaveAyahNote = async (ayahId: string) => {
        if (!noteInputText.trim()) return;
        const activeNote = Array.isArray(notesList) && notesList.find(
            (n: any) => n.ayahId === ayahId
        );
        if (activeNote) {
            await onSaveNote(activeNote.id, noteInputText.trim(), selectedSurahId || undefined, true);
        } else {
            await onSaveNote(ayahId, noteInputText.trim(), selectedSurahId || undefined, false);
        }
        setNoteInputText("");
        setActiveNoteAyahId(null);
    };

    if (selectedSurahId !== null) {
        const isLoading = ayahsLoading || arabicLoading;

        return (
            <View style={styles.subContainer}>
                {/* Royal Header */}
                <View style={styles.subHeader}>
                    <TouchableOpacity onPress={() => setSelectedSurahId(null)} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>Surah {selectedSurahName}</Text>
                    <View style={{ width: 40 }} />
                </View>

                {isLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator color="#D4AF37" size="large" />
                        <Text style={styles.loadingText}>Fetching verses from heaven...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={ayahs || []}
                        keyExtractor={(item: any) => item.id}
                        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
                        ListHeaderComponent={
                            selectedSurahId !== 9 ? (
                                <View style={styles.bismillahContainer}>
                                    <Text style={styles.bismillahArabic}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</Text>
                                    <Text style={styles.bismillahEnglish}>In the name of Allah, the Entirely Merciful, the Especially Merciful</Text>
                                    <View style={styles.ornamentDivider}>
                                        <Text style={styles.ornamentText}>✦ ❖ ✦</Text>
                                    </View>
                                </View>
                            ) : null
                        }
                        ListFooterComponent={
                            <TouchableOpacity
                                style={styles.completeSurahBtn}
                                onPress={() => {
                                    const count = ayahs?.length || 1;
                                    onUpdateProgress(selectedSurahId, count, 100);
                                    alert("Progress updated! Surah marked as completed.");
                                }}
                            >
                                <Text style={styles.completeSurahBtnText}>Mark Surah as Completed 🔖</Text>
                            </TouchableOpacity>
                        }
                        renderItem={({ item, index }: any) => {
                            const isFav = Array.isArray(favoritesList) && favoritesList.some(
                                (f: any) => f.refId === item.id && (!f.type || f.type === "QURAN")
                            );
                            const arabicText = arabicSurah?.ayahs?.[index]?.text || "Loading Arabic...";
                            const activeNote = Array.isArray(notesList) && notesList.find(
                                (n: any) => n.ayahId === item.id
                            );

                            return (
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.numberBadge}>{index + 1}</Text>
                                        <View style={styles.cardHeaderActions}>
                                            {/* Note Button */}
                                            <TouchableOpacity 
                                                style={{ marginRight: 16 }}
                                                onPress={() => {
                                                    setActiveNoteAyahId(activeNoteAyahId === item.id ? null : item.id);
                                                    setNoteInputText(activeNote ? activeNote.content || activeNote.text || "" : "");
                                                }}
                                            >
                                                <Text style={styles.noteActionIcon}>💬</Text>
                                            </TouchableOpacity>
                                            
                                            {/* Favorite Button */}
                                            <TouchableOpacity onPress={() => onToggleFavorite(item.id, "QURAN")}>
                                                <Text style={[styles.starIcon, isFav && { color: "#D4AF37" }]}>
                                                    {isFav ? "★" : "☆"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Grandiose Quranic Arabic Script */}
                                    <Text style={styles.arabicText}>{arabicText}</Text>
                                    <Text style={styles.translationText}>{item.text || item.english || ""}</Text>

                                    {/* Existing Reflection Note Card */}
                                    {activeNote && (
                                        <View style={styles.reflectionNoteCard}>
                                            <View style={styles.noteCardTitleRow}>
                                                <Text style={styles.reflectionLabel}>MY REFLECTION</Text>
                                                <TouchableOpacity onPress={() => onDeleteNote(activeNote.id)}>
                                                    <Text style={styles.deleteNoteIcon}>🗑️</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.reflectionBodyText}>{activeNote.content || activeNote.text}</Text>
                                        </View>
                                    )}

                                    {/* Inline note edit form */}
                                    {activeNoteAyahId === item.id && (
                                        <View style={styles.noteEditorContainer}>
                                            <Text style={styles.noteEditorLabel}>Add reflection note:</Text>
                                            <TextInput
                                                style={styles.noteTextInput}
                                                multiline
                                                numberOfLines={3}
                                                placeholder="Write your spiritual reflection..."
                                                value={noteInputText}
                                                onChangeText={setNoteInputText}
                                            />
                                            <View style={styles.noteEditorButtons}>
                                                <TouchableOpacity 
                                                    style={styles.noteCancelBtn} 
                                                    onPress={() => setActiveNoteAyahId(null)}
                                                >
                                                    <Text style={styles.noteCancelBtnText}>Cancel</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={styles.noteSaveBtn} 
                                                    onPress={() => handleSaveAyahNote(item.id)}
                                                >
                                                    <Text style={styles.noteSaveBtnText}>Save Reflection</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        }}
                    />
                )}
            </View>
        );
    }

    return (
        <View style={styles.subContainer}>
            <Text style={styles.sectionTitle}>The Noble Quran</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Surah..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#A0A8A0"
            />

            {surahsLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#0A6C51" size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredSurahs}
                    keyExtractor={(item: any) => String(item.id)}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    renderItem={({ item }: any) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => {
                                setSelectedSurahId(item.id);
                                setSelectedSurahName(item.englishName);
                                // Save continue reading progress dynamically
                                onUpdateProgress(item.id, 1, 10);
                            }}
                        >
                            <View style={styles.row}>
                                <Text style={styles.surahNumber}>{item.id}</Text>
                                <View style={{ marginLeft: 16 }}>
                                    <Text style={styles.listItemTitle}>{item.englishName}</Text>
                                    <Text style={styles.listItemSubtitle}>{item.englishNameTranslation || "Chapter"}</Text>
                                </View>
                            </View>
                            <Text style={styles.arabicName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

// ----------------------------------------------------
// HADITH VIEW
// ----------------------------------------------------
export function HadithView({
    favoritesList = [],
    onToggleFavorite,
}: {
    favoritesList: any[];
    onToggleFavorite: any;
}) {
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [selectedBookName, setSelectedBookName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: books, isLoading: booksLoading } = useHadithBooksQuery();
    const { data: hadithsData, isLoading: hadithsLoading } = useHadithBookHadithsQuery(selectedBookId);

    const filteredBooks = (books || []).filter((b: any) =>
        b.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedBookId !== null) {
        return (
            <View style={styles.subContainer}>
                <View style={styles.subHeader}>
                    <TouchableOpacity onPress={() => setSelectedBookId(null)} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle} numberOfLines={1}>{selectedBookName}</Text>
                    <View style={{ width: 40 }} />
                </View>

                {hadithsLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator color="#D4AF37" size="large" />
                    </View>
                ) : (
                    <FlatList
                        data={hadithsData?.items || []} // Fix: use items property from paginated response
                        keyExtractor={(item: any) => item.id}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        renderItem={({ item, index }: any) => {
                            const isFav = Array.isArray(favoritesList) && favoritesList.some(
                                (f: any) => f.refId === item.id && f.type === "HADITH"
                            );
                            return (
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.numberBadge}>Hadith {item.hadithNumber || index + 1}</Text>
                                        <TouchableOpacity onPress={() => onToggleFavorite(item.id, "HADITH")}>
                                            <Text style={[styles.starIcon, isFav && { color: "#D4AF37" }]}>
                                                {isFav ? "★" : "☆"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.narratorText}>{item.narrator || "Narrated"}</Text>
                                    {item.arabicText && <Text style={styles.arabicText}>{item.arabicText}</Text>}
                                    <Text style={styles.translationText}>{item.englishText || ""}</Text>
                                </View>
                            );
                        }}
                    />
                )}
            </View>
        );
    }

    return (
        <View style={styles.subContainer}>
            <Text style={styles.sectionTitle}>Hadith Collections</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Book..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#A0A8A0"
            />

            {booksLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#0A6C51" size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredBooks}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    renderItem={({ item }: any) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => {
                                setSelectedBookId(item.id);
                                setSelectedBookName(item.name);
                            }}
                        >
                            <View style={styles.row}>
                                <View style={styles.hadithBadge}>
                                    <Text style={styles.hadithBadgeText}>📖</Text>
                                </View>
                                <View style={{ marginLeft: 16, flex: 1 }}>
                                    <Text style={styles.listItemTitle}>{item.name}</Text>
                                    <Text style={styles.listItemSubtitle}>{item.description || "Hadith Book"}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

// ----------------------------------------------------
// DUAS VIEW
// ----------------------------------------------------
export function DuasView({
    favoritesList = [],
    onToggleFavorite,
}: {
    favoritesList: any[];
    onToggleFavorite: any;
}) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    const { data: categories, isLoading: categoriesLoading } = useDuaCategoriesQuery();
    const { data: duas, isLoading: duasLoading } = useDuasByCategoryQuery(selectedCategoryId);

    if (selectedCategoryId !== null) {
        return (
            <View style={styles.subContainer}>
                <View style={styles.subHeader}>
                    <TouchableOpacity onPress={() => setSelectedCategoryId(null)} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>{selectedCategoryName}</Text>
                    <View style={{ width: 40 }} />
                </View>

                {duasLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator color="#D4AF37" size="large" />
                    </View>
                ) : (
                    <FlatList
                        data={duas || []}
                        keyExtractor={(item: any) => item.id}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        renderItem={({ item, index }: any) => {
                            const isFav = Array.isArray(favoritesList) && favoritesList.some(
                                (f: any) => f.refId === item.id && f.type === "DUA"
                            );
                            return (
                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.numberBadge}>{index + 1}</Text>
                                        <TouchableOpacity onPress={() => onToggleFavorite(item.id, "DUA")}>
                                            <Text style={[styles.starIcon, isFav && { color: "#D4AF37" }]}>
                                                {isFav ? "★" : "☆"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.listItemTitle}>{item.title}</Text>
                                    <Text style={styles.arabicText}>{item.arabicText}</Text>
                                    <Text style={styles.translationText}>{item.englishText}</Text>
                                    {item.repeat && (
                                        <View style={styles.repeatBadge}>
                                            <Text style={styles.repeatText}>Repeat: {item.repeat}x</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        }}
                    />
                )}
            </View>
        );
    }

    return (
        <View style={styles.subContainer}>
            <Text style={styles.sectionTitle}>Supplications</Text>

            {categoriesLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#0A6C51" size="large" />
                </View>
            ) : (
                <FlatList
                    data={categories || []}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    renderItem={({ item }: any) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => {
                                setSelectedCategoryId(item.id);
                                setSelectedCategoryName(item.name);
                            }}
                        >
                            <View style={styles.row}>
                                <View style={[styles.hadithBadge, { backgroundColor: "#FFF9ED" }]}>
                                    <Text style={{ fontSize: 16 }}>✨</Text>
                                </View>
                                <View style={{ marginLeft: 16, flex: 1 }}>
                                    <Text style={styles.listItemTitle}>{item.name}</Text>
                                    <Text style={styles.listItemSubtitle}>Tap to browse Duas</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

// ----------------------------------------------------
// NOTES / REFLECTIONS VIEW
// ----------------------------------------------------
export function NotesView({
    notesList = [],
    onSaveNote,
    onDeleteNote,
}: {
    notesList: any[];
    onSaveNote: any;
    onDeleteNote: any;
}) {
    const [editorOpen, setEditorOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any | null>(null);
    const [titleInput, setTitleInput] = useState("");
    const [contentInput, setContentInput] = useState("");

    const handleSave = async () => {
        if (!contentInput.trim()) return;
        if (selectedNote) {
            await onSaveNote(selectedNote.id, contentInput.trim(), undefined, true);
        } else {
            await onSaveNote("freestyle", contentInput.trim(), undefined, false);
        }
        setContentInput("");
        setTitleInput("");
        setSelectedNote(null);
        setEditorOpen(false);
    };

    if (editorOpen) {
        return (
            <View style={styles.subContainer}>
                <View style={styles.subHeader}>
                    <TouchableOpacity onPress={() => setEditorOpen(false)} style={styles.backButton}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.subHeaderTitle}>
                        {selectedNote ? "Edit Reflection" : "New Reflection"}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
                
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text style={styles.label}>Reflection Text</Text>
                    <TextInput
                        style={[styles.noteTextInput, { minHeight: 180 }]}
                        multiline
                        placeholder="Write down your spiritual reflection, notes, or learnings..."
                        value={contentInput}
                        onChangeText={setContentInput}
                    />
                    
                    <TouchableOpacity style={styles.saveNoteButton} onPress={handleSave}>
                        <Text style={styles.saveNoteButtonText}>Save Reflection Journal</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.subContainer}>
            <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Reflections Journal</Text>
                <TouchableOpacity
                    style={styles.addNoteIconBtn}
                    onPress={() => {
                        setSelectedNote(null);
                        setContentInput("");
                        setEditorOpen(true);
                    }}
                >
                    <Text style={styles.addNoteIconText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {notesList.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={styles.emptyTitle}>Journal is Empty</Text>
                    <Text style={styles.emptySub}>Document your spiritual reflections. Tapping "💬" under any Quran verse lets you note reflections directly.</Text>
                </View>
            ) : (
                <FlatList
                    data={notesList}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    renderItem={({ item }: any) => (
                        <View style={styles.noteItemCard}>
                            <View style={styles.noteItemHeader}>
                                <Text style={styles.noteItemTitle}>
                                    {item.ayahId ? `Verse Reflection` : "General Note"}
                                </Text>
                                <View style={styles.row}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setSelectedNote(item);
                                            setContentInput(item.content || item.text || "");
                                            setEditorOpen(true);
                                        }}
                                        style={{ marginRight: 16 }}
                                    >
                                        <Text style={{ fontSize: 16 }}>✏️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => onDeleteNote(item.id)}>
                                        <Text style={{ fontSize: 16 }}>🗑️</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.noteItemText}>{item.content || item.text}</Text>
                            <Text style={styles.noteItemDate}>
                                {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

// ----------------------------------------------------
// PROFILE & BOOKMARKS VIEW
// ----------------------------------------------------
export function ProfileView({
    userSession,
    favoritesList = [],
    onLogout,
}: {
    userSession: any;
    favoritesList: any[];
    onLogout: () => void;
}) {
    const quranFavs = favoritesList.filter(f => !f.type || f.type === "QURAN");
    const hadithFavs = favoritesList.filter(f => f.type === "HADITH");
    const duaFavs = favoritesList.filter(f => f.type === "DUA");

    return (
        <ScrollView style={styles.subContainer} contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(userSession?.email || "U").charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.profileEmail}>{userSession?.email || "Student of Knowledge"}</Text>
                <Text style={styles.profileBio}>STUDENT OF KNOWLEDGE</Text>
            </View>

            {/* Bookmarks Section */}
            <Text style={styles.sectionTitle}>Spiritual Bookmarks</Text>
            
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{quranFavs.length}</Text>
                    <Text style={styles.statLabel}>Quran</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{hadithFavs.length}</Text>
                    <Text style={styles.statLabel}>Hadiths</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNum}>{duaFavs.length}</Text>
                    <Text style={styles.statLabel}>Duas</Text>
                </View>
            </View>

            {/* Logout Trigger */}
            <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutBtnText}>Sign Out from Account</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// ----------------------------------------------------
// ROYAL / GRANDIOSE STYLING SYSTEM
// ----------------------------------------------------
const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        backgroundColor: "#FAF8F5", // Warm Royal Ivory Background
    },
    subHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: "#003E2F", // Deep Forest Green
        borderBottomWidth: 2,
        borderBottomColor: "#D4AF37", // Bright Royal Gold Border
    },
    subHeaderTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#D4AF37", // Royal Gold
        flex: 1,
        textAlign: "center",
    },
    backButton: {
        padding: 8,
    },
    backText: {
        fontSize: 24,
        color: "#D4AF37",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F", // Deep Emerald
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 12,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 20,
    },
    addNoteIconBtn: {
        backgroundColor: "#003E2F",
        borderColor: "#D4AF37",
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 14,
    },
    addNoteIconText: {
        color: "#D4AF37",
        fontSize: 11,
        fontWeight: "bold",
    },
    searchInput: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6D5B8",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginBottom: 16,
        fontSize: 14,
        color: "#003E2F",
    },
    listItem: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E6D5B8", // Warm Amber Border
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    surahNumber: {
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#D4AF37", // Gold
        width: 32,
    },
    hadithBadge: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#E2F5EC",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#E6D5B8",
        borderWidth: 0.5,
    },
    hadithBadgeText: {
        fontSize: 16,
    },
    listItemTitle: {
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F", // Deep Forest Green
    },
    listItemSubtitle: {
        fontSize: 11,
        color: "#808880",
        marginTop: 2,
    },
    arabicName: {
        fontSize: 20,
        color: "#003E2F",
        fontFamily: "serif",
        fontWeight: "600",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 13,
        color: "#003E2F",
        fontStyle: "italic",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E6D5B8", // Warm Amber Border
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    cardHeaderActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    numberBadge: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#003E2F",
        backgroundColor: "#E2F5EC",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "#D4AF37",
    },
    noteActionIcon: {
        fontSize: 18,
        color: "#0A6C51",
    },
    starIcon: {
        fontSize: 22,
        color: "#D1D5DB",
    },
    arabicText: {
        fontSize: 28,
        textAlign: "right",
        lineHeight: 52,
        color: "#003E2F",
        marginBottom: 16,
        fontFamily: "serif", // Royal Serif text
        fontWeight: "bold",
        paddingRight: 6,
    },
    narratorText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#D4AF37",
        fontFamily: "Georgia",
        marginBottom: 8,
    },
    translationText: {
        fontSize: 14.5,
        color: "#2C352C",
        lineHeight: 24,
        fontFamily: "Georgia", // Georgia serif for translations
        fontStyle: "italic",
    },
    repeatBadge: {
        marginTop: 10,
        alignSelf: "flex-start",
        backgroundColor: "#FFF5F5",
        borderColor: "#C5221F",
        borderWidth: 0.5,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 8,
    },
    repeatText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#C5221F",
    },
    bismillahContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E6D5B8",
    },
    bismillahArabic: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#003E2F",
        fontFamily: "serif",
        marginBottom: 8,
    },
    bismillahEnglish: {
        fontSize: 11,
        color: "#808880",
        fontStyle: "italic",
        textAlign: "center",
        paddingHorizontal: 12,
    },
    ornamentDivider: {
        marginTop: 8,
    },
    ornamentText: {
        fontSize: 12,
        color: "#D4AF37",
    },
    completeSurahBtn: {
        backgroundColor: "#003E2F",
        borderColor: "#D4AF37",
        borderWidth: 1.5,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
    },
    completeSurahBtnText: {
        color: "#D4AF37",
        fontWeight: "bold",
        fontFamily: "Georgia",
        fontSize: 13,
    },
    // Note Editor / Reflections Style
    reflectionNoteCard: {
        backgroundColor: "#FFFDF0",
        borderColor: "#E6D5B8",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 2,
    },
    noteCardTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    reflectionLabel: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#D4AF37",
        letterSpacing: 0.5,
    },
    deleteNoteIcon: {
        fontSize: 12,
    },
    reflectionBodyText: {
        fontSize: 12.5,
        color: "#3B423B",
        lineHeight: 18,
        fontFamily: "Georgia",
    },
    noteEditorContainer: {
        backgroundColor: "#F3F7F5",
        borderColor: "#0A6C51",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
    },
    noteEditorLabel: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#003E2F",
        marginBottom: 6,
    },
    noteTextInput: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E6D5B8",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 13,
        color: "#003E2F",
        minHeight: 80,
        textAlignVertical: "top",
    },
    noteEditorButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    noteCancelBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 10,
    },
    noteCancelBtnText: {
        fontSize: 12,
        color: "#888",
    },
    noteSaveBtn: {
        backgroundColor: "#003E2F",
        borderColor: "#D4AF37",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    noteSaveBtnText: {
        fontSize: 12,
        color: "#D4AF37",
        fontWeight: "bold",
    },
    // Notes tab styles
    emptyContainer: {
        flex: 0.8,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    emptyIcon: {
        fontSize: 50,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#003E2F",
        fontFamily: "Georgia",
    },
    emptySub: {
        fontSize: 12,
        color: "#888",
        textAlign: "center",
        lineHeight: 18,
        marginTop: 8,
    },
    noteItemCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6D5B8",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    noteItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#F0EAE0",
        paddingBottom: 8,
        marginBottom: 8,
    },
    noteItemTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#D4AF37",
        fontFamily: "Georgia",
    },
    noteItemText: {
        fontSize: 13,
        color: "#3B423B",
        lineHeight: 19,
        fontFamily: "Georgia",
        fontStyle: "italic",
    },
    noteItemDate: {
        fontSize: 10,
        color: "#888888",
        marginTop: 10,
        textAlign: "right",
    },
    label: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#003E2F",
        marginBottom: 6,
        marginTop: 12,
    },
    saveNoteButton: {
        backgroundColor: "#003E2F",
        borderColor: "#D4AF37",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
    },
    saveNoteButtonText: {
        color: "#D4AF37",
        fontWeight: "bold",
        fontSize: 14,
        fontFamily: "Georgia",
    },
    // Profile styles
    profileHeader: {
        alignItems: "center",
        padding: 30,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E6D5B8",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#003E2F",
        borderColor: "#D4AF37",
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#D4AF37",
    },
    profileEmail: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Georgia",
        color: "#003E2F",
    },
    profileBio: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#D4AF37",
        marginTop: 4,
        letterSpacing: 0.5,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        marginHorizontal: 4,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E6D5B8",
    },
    statNum: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#003E2F",
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
    },
    logoutBtn: {
        backgroundColor: "#FFF5F5",
        borderWidth: 1,
        borderColor: "#FFD8D8",
        paddingVertical: 14,
        borderRadius: 12,
        marginHorizontal: 20,
        alignItems: "center",
    },
    logoutBtnText: {
        color: "#C53030",
        fontWeight: "bold",
        fontSize: 14,
    },
});
