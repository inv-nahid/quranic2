export interface DuaCategory {
    id: string;
    name: string;
    count: number;
    iconType: "sun" | "moon" | "shield" | "airplane" | "prayer" | "hardship" | "sleep";
    layout: "horizontal" | "vertical";
    colorBg: string;
    iconBg: string;
    iconColor: string;
}

export interface Dua {
    id: string;
    categoryId: string;
    title: string;
    reference: string;
    arabic: string;
    transliteration?: string;
    translation: string;
    info?: string;
    recitationLimit: number;
    reads?: string;
}

export const fallbackDuaCategories: DuaCategory[] = [
    {
        id: "morning",
        name: "Morning",
        count: 24,
        iconType: "sun",
        layout: "horizontal",
        colorBg: "bg-[#EBF7F5] border-[#D1ECE7]", // light greenish-teal
        iconBg: "bg-white",
        iconColor: "text-teal-600"
    },
    {
        id: "evening",
        name: "Evening",
        count: 18,
        iconType: "moon",
        layout: "vertical",
        colorBg: "bg-white border-slate-100",
        iconBg: "bg-[#E6F3F8]",
        iconColor: "text-sky-600"
    },
    {
        id: "protection",
        name: "Protection",
        count: 12,
        iconType: "shield",
        layout: "vertical",
        colorBg: "bg-white border-slate-100",
        iconBg: "bg-[#FDF2F0]",
        iconColor: "text-rose-500"
    },
    {
        id: "travel",
        name: "Travel",
        count: 9,
        iconType: "airplane",
        layout: "horizontal",
        colorBg: "bg-[#F0F7F4] border-[#DBECDE]",
        iconBg: "bg-white",
        iconColor: "text-[#0A6C51]"
    },
    {
        id: "prayer",
        name: "Prayer",
        count: 32,
        iconType: "prayer",
        layout: "vertical",
        colorBg: "bg-white border-slate-100",
        iconBg: "bg-[#E8F8F0]",
        iconColor: "text-emerald-500"
    },
    {
        id: "hardship",
        name: "Hardship",
        count: 15,
        iconType: "hardship",
        layout: "vertical",
        colorBg: "bg-white border-slate-100",
        iconBg: "bg-[#F3F4F6]",
        iconColor: "text-slate-500"
    },
    {
        id: "sleep",
        name: "Sleep",
        count: 10,
        iconType: "sleep",
        layout: "horizontal",
        colorBg: "bg-[#F5F3FF] border-[#E9E3FF]",
        iconBg: "bg-white",
        iconColor: "text-violet-600"
    }
];

export const fallbackDuas: Dua[] = [
    // MORNING
    {
        id: "m1",
        categoryId: "morning",
        title: "Ayat al-Kursi (The Throne Verse)",
        reference: "Surah Al-Baqarah: 255",
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Allāhu lā ilāha illā huwa l-ḥayyu l-qayyūm. Lā ta'khudhuhu sinatun wa lā nawm. Lahu mā fis-samāwāti wa mā fil-arḍ. Man dhal-ladhī yashfa'u 'indahu illā bi-idhnihi. Ya'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay'im-min 'ilmihi illā bimā shā'. Wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhu ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.",
        translation: "Allah! There is no god but He, the Living, the Self-subsisting, Eternal. No slumber can seize Him nor sleep. His are all things in the heavens and on earth. Who is there can intercede in His presence except as He permitteth? He knoweth what (appeareth to His creatures as) before or after or behind them, nor shall they compass aught of His knowledge except as He willeth. His Throne doth extend over the heavens and the earth, and He feeleth no fatigue in guarding and preserving them for He is the Most High, the Supreme in glory.",
        recitationLimit: 1,
        reads: "1.2k"
    },
    {
        id: "m2",
        categoryId: "morning",
        title: "Seeking Forgiveness",
        reference: "Recite 3 times",
        arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullāha wa atūbu ilayhi.",
        translation: "I seek Allah's forgiveness and turn to Him in repentance.",
        recitationLimit: 3,
        reads: "1.1k"
    },
    {
        id: "m3",
        categoryId: "morning",
        title: "Protection from Evil",
        reference: "Sunan Abi Dawud 5088",
        arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillāhil-ladhī lā yaḍurru ma'as-mihi shay'un fil-arḍi wa lā fis-samā'i wa huwas-samī'ul-'alīm.",
        info: "The Prophet (ﷺ) said: \"Nothing will harm a servant who says this three times every morning and evening.\"",
        translation: "In the name of Allah with Whose name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, the All-Knowing.",
        recitationLimit: 3,
        reads: "1.5k"
    },
    {
        id: "m4",
        categoryId: "morning",
        title: "Morning Words of Praise",
        reference: "Sahih Muslim 2726",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
        transliteration: "Subḥānallāhi wa bi-ḥamdihi, 'adada khalqihi, wa riḍā nafsihi, wa zinata 'arshihi, wa midāda kalimātihi.",
        translation: "Glory be to Allah and His is the praise, (equal to) the number of His creation, the pleasure of His Self, the weight of His Throne, and the ink (necessary) for writing His Words.",
        recitationLimit: 3,
        reads: "890"
    },

    // EVENING
    {
        id: "e1",
        categoryId: "evening",
        title: "Evening Gratitude & Shelter",
        reference: "Recite 3 times",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
        transliteration: "Amseynā wa amsal-mulku lillāhi, wal-ḥamdu lillāhi, lā ilāha illallāhu waḥdahu lā sharīka lahu.",
        translation: "We have reached the evening and at this very time entire sovereignty belongs to Allah. Praise be to Allah; there is no deity worthy of worship except Allah, Single, without partner.",
        recitationLimit: 3,
        reads: "740"
    },
    {
        id: "e2",
        categoryId: "evening",
        title: "The Master of Seeking Forgiveness (Sayyid al-Istighfar)",
        reference: "Sahih al-Bukhari 6306",
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        transliteration: "Allāhumma anta Rabbī lā ilāha illā anta, khalaqtanī wa ana 'abduka, wa ana 'alā 'ahdika wa wa'dika mas-taṭa'tu. A'ūdhu bika min sharri mā ṣana'tu, abū'u laka bi-ni'matika 'alayya wa abū'u laka bi-dhambī faghfir lī fa-innahu lā yaghfirudh-dhunūba illā ant.",
        translation: "O Allah! You are my Lord. There is no god except You. You created me and I am Your slave, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge to You Your favor upon me, and I acknowledge my sin. Forgive me, for indeed none can forgive sins except You.",
        recitationLimit: 1,
        reads: "2.3k"
    },

    // PROTECTION
    {
        id: "p1",
        categoryId: "protection",
        title: "Protection Against Harm of Creation",
        reference: "Sahih Muslim 2708",
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'ūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq.",
        info: "Reciting this in the evening protects against scorpion bites and harmful creatures.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        recitationLimit: 3,
        reads: "1.9k"
    },
    {
        id: "p2",
        categoryId: "protection",
        title: "Three Surahs for Total Protection",
        reference: "Surah Al-Ikhlas, Al-Falaq & An-Nas",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُل ' أَعُوذُ بِرَبِّ النَّاسِ",
        translation: "Recite the last three Surahs of the Qur'an. Prophet Muhammad (ﷺ) said: \"Recite these three times in the morning and evening, it will suffice you against everything.\"",
        recitationLimit: 3,
        reads: "4.1k"
    },

    // TRAVEL
    {
        id: "t1",
        categoryId: "travel",
        title: "Dua for Boarding & Journey",
        reference: "Surah Az-Zukhruf: 13-14",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
        transliteration: "Subḥānal-ladhī sakh-khara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā Rabbinā la-munqalibūn.",
        translation: "Glory to Him Who has subjected this to our use, for we could never have accomplished this by ourselves. And turning unto our Lord, we shall assuredly return.",
        recitationLimit: 1,
        reads: "3.2k"
    },
    {
        id: "t2",
        categoryId: "travel",
        title: "Dua for Entering a Town",
        reference: "Hisn al-Muslim",
        arabic: "اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ وَرَبَّ الأَرَضِينَ السَّبْعِ وَمَا أَقْلَلْنَ رَبَّ الشَّيَاطِينِ وَمَا أَضْلَلْنَ",
        translation: "O Allah, Lord of the seven heavens and all they overshadow, Lord of the seven earths and all they carry, Lord of the devils and all they lead astray, I ask You for the goodness of this town...",
        recitationLimit: 1,
        reads: "1.0k"
    },

    // PRAYER
    {
        id: "pr1",
        categoryId: "prayer",
        title: "Dua after Tasleem (Ending Prayer)",
        reference: "Sahih Muslim 591",
        arabic: "أَسْتَغْفِرُ اللَّهَ أَسْتَغْفِرُ اللَّهَ أَسْتَغْفِرُ اللَّهَ اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
        transliteration: "Astaghfirullāh (three times). Allāhumma antas-Salāmu wa minkas-salāmu, tabārakta yā Dhal-Jalāli wal-Ikrām.",
        translation: "I seek the forgiveness of Allah (three times). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.",
        recitationLimit: 1,
        reads: "5.5k"
    },

    // HARDSHIP
    {
        id: "h1",
        categoryId: "hardship",
        title: "Relief from Distress & Sadness",
        reference: "Sahih al-Bukhari 6345",
        arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ الْعَظِيمُ الْحَلِيمُ لاَ إِلَهَ إِلاَّ اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمُ لاَ إِلَهَ إِلاَّ اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
        transliteration: "Lā ilāha illallāhul-'Aẓīmul-Ḥalīm, lā ilāha illallāhu Rabbu-l-'Arshil-'Aẓīm, lā ilāha illallāhu Rabbu-s-samāwāti wa Rabbu-l-arḍi wa Rabbu-l-'Arshil-Karīm.",
        translation: "There is no deity worthy of worship except Allah, the Great, the Forbearing. There is no deity worthy of worship except Allah, Lord of the Magnificent Throne. There is no deity worthy of worship except Allah, Lord of the heavens, Lord of the earth and Lord of the Noble Throne.",
        recitationLimit: 1,
        reads: "2.4k"
    },

    // SLEEP
    {
        id: "s1",
        categoryId: "sleep",
        title: "In Your Name I Live and Die",
        reference: "Sahih al-Bukhari 6320",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allāhumma amūtu wa aḥyā.",
        translation: "In Your name, O Allah, I die and I live.",
        recitationLimit: 1,
        reads: "6.0k"
    }
];

export const fallbackDuaOfDay: Dua = {
    id: "day1",
    categoryId: "morning",
    title: "Dua for Beneficial Knowledge, Provision, and Accepted Deeds",
    reference: "Sunan Ibn Majah 925",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    transliteration: "Allāhumma innī as'aluka 'ilman nāfi'an, wa rizqan ṭayyiban, wa 'amalan mutaqabbalā.",
    translation: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    recitationLimit: 1,
    reads: "3.5k"
};
