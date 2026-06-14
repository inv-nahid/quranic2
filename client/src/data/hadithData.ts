export interface HadithBook {
    id: string;
    name: string;
    arabicName: string;
    tag?: string;
    count: string;
    description: string;
    color: string;
}

export interface HadithItem {
    id: string;
    bookId: string;
    number: number;
    narrator: string;
    bookRef: string;
    arabic: string;
    english: string;
}

export const fallbackBooks: HadithBook[] = [
    {
        id: "bukhari",
        name: "Sahih al-Bukhari",
        arabicName: "صحيح البخاري",
        tag: "Most Authentic",
        count: "7,563",
        description: "The most authoritative collection of Hadith, compiled by Imam Muhammad al-Bukhari.",
        color: "bg-[#004D40] text-gray-50",
    },
    {
        id: "muslim",
        name: "Sahih Muslim",
        arabicName: "صحيح مسلم",
        tag: "Fundamental",
        count: "3,033",
        description: "An incredibly authentic collection compiled by Imam Muslim ibn al-Hajjaj.",
        color: "bg-[#2E5B53] text-gray-100",
    },
    {
        id: "nasa",
        name: "Sunan an-Nasa'i",
        arabicName: "سنن النسائي",
        count: "5,758",
        description: "One of the Sunan collections, celebrated for Imam an-Nasa'i's rigorous grading.",
        color: "bg-[#5D2E2B] text-gray-50",
    },
    {
        id: "abudawud",
        name: "Sunan Abi Dawud",
        arabicName: "سنن أبي داود",
        count: "5,274",
        description: "Compiled by Imam Abu Dawud, focusing primarily on legal rulings (Ahkam).",
        color: "bg-white text-slate-800",
    },
    {
        id: "tirmidhi",
        name: "Jami` at-Tirmidhi",
        arabicName: "جامع الترمذي",
        count: "3,956",
        description: "Renowned for its sorting of Hadith categories and jurisprudential opinions.",
        color: "bg-white text-slate-800",
    },
    {
        id: "ibnmajah",
        name: "Sunan Ibn Majah",
        arabicName: "سنن ابن ماجه",
        count: "4,341",
        description: "The sixth canonical book of Hadith, providing valuable moral and ethical lessons.",
        color: "bg-white text-slate-800",
    },
];

export const fallbackHadiths: HadithItem[] = [
    // --- BUKHARI ---
    {
        id: "bukhari_1",
        bookId: "bukhari",
        number: 1,
        narrator: "Narrated by 'Umar bin Al-Khattab",
        bookRef: "Sahih al-Bukhari 1",
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَتَزَوَّجُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
        english: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.",
    },
    {
        id: "bukhari_2",
        bookId: "bukhari",
        number: 2,
        narrator: "Narrated by 'Abdullah bin 'Amr",
        bookRef: "Sahih al-Bukhari 10",
        arabic: "الْمُسْلِمُ مَنْ سَلَمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ.",
        english: "A Muslim is the one from whose tongue and hands the Muslims are safe; and a Muhajir (emigrant) is the one who refrains from what Allah has forbidden.",
    },
    {
        id: "bukhari_3",
        bookId: "bukhari",
        number: 3,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Sahih al-Bukhari 24",
        arabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ.",
        english: "If Allah wants to do good to a person, He makes him comprehend the religion.",
    },
    {
        id: "bukhari_4",
        bookId: "bukhari",
        number: 4,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Sahih al-Bukhari 35",
        arabic: "آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ.",
        english: "The signs of a hypocrite are three: Whenever he speaks, he tells a lie; whenever he promises, he breaks his promise; and whenever he is entrusted, he betrays his trust.",
    },

    // --- MUSLIM ---
    {
        id: "muslim_1",
        bookId: "muslim",
        number: 1,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Sahih Muslim 5",
        arabic: "الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ.",
        english: "'The Deen (religion) is sincere advice.' We said: 'To whom?' He said: 'To Allah, His Book, His Messenger, and to the leaders of the Muslims and their common folk.'",
    },
    {
        id: "muslim_2",
        bookId: "muslim",
        number: 2,
        narrator: "Narrated by Abu Malik al-Ash'ari",
        bookRef: "Sahih Muslim 223",
        arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلآنِ أَوْ تَمْلأُ مَا بَيْنَ السَّمَاوَاتِ وَالأَرْضِ.",
        english: "Purity is half of Iman (faith). Alhamdulillah (praise be to Allah) fills the scale, and Subhanallah (glory be to Allah) and Alhamdulillah fill up what is between the heavens and the earth.",
    },
    {
        id: "muslim_3",
        bookId: "muslim",
        number: 3,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Sahih Muslim 2580",
        arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.",
        english: "Be mindful of Allah wherever you are, follow up a bad deed with a good deed which will wipe it out, and behave with good character towards people.",
    },

    // --- NASA'I ---
    {
        id: "nasa_1",
        bookId: "nasa",
        number: 1,
        narrator: "Narrated by Anas bin Malik",
        bookRef: "Sunan an-Nasa'i 332",
        arabic: "حُبِّبَ إِلَيَّ مِنَ الدُّنْيَا النِّسَاءُ وَالطِّيبُ، وَجُعِلَتْ قُرَّةُ عَيْنِي فِي الصَّلاَةِ.",
        english: "Of the things of this world, women and perfume have been made dear to me, and my comfort has been provided in prayer.",
    },
    {
        id: "nasa_2",
        bookId: "nasa",
        number: 2,
        narrator: "Narrated by Jabir bin 'Abdullah",
        bookRef: "Sunan an-Nasa'i 540",
        arabic: "كُلُّ مَعْرُوفٍ صَدَقَةٌ، وَإِنَّ مِنَ الْمَعْرُوفِ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ.",
        english: "Every good deed is charity. Part of good deeds is to meet your brother with a cheerful face.",
    },

    // --- ABU DAWUD ---
    {
        id: "abudawud_1",
        bookId: "abudawud",
        number: 1,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Sunan Abi Dawud 120",
        arabic: "لاَ يَشْكُرُ اللَّهَ مَنْ لاَ يَشْكُرُ النَّاسَ.",
        english: "He who does not thank people does not thank Allah.",
    },
    {
        id: "abudawud_2",
        bookId: "abudawud",
        number: 2,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Sunan Abi Dawud 456",
        arabic: "إنَّ الرَّجُلَ لَيُدْرِكُ بِحُسْنِ خُلُقِهِ دَرَجَةَ الصَّائِمِ القَائِمِ.",
        english: "A believer will reach by his good character the ranks of one who fasts and prays during the night.",
    },

    // --- BIRMIDHI ---
    {
        id: "tirmidhi_1",
        bookId: "tirmidhi",
        number: 1,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Jami` at-Tirmidhi 322",
        arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا، وَخِيَارُكُمْ خِيَارُكُمْ لِنِسَائِهِمْ.",
        english: "The most perfect of believers in faith are those with the best character, and the best of you are those who are best to their women.",
    },
    {
        id: "tirmidhi_2",
        bookId: "tirmidhi",
        number: 2,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Jami` at-Tirmidhi 5027",
        arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.",
        english: "The best among you are those who learn the Quran and teach it.",
    },

    // --- IBN MAJAH ---
    {
        id: "ibnmajah_1",
        bookId: "ibnmajah",
        number: 1,
        narrator: "Narrated by Muadh bin Jabal",
        bookRef: "Sunan Ibn Majah 100",
        arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ.",
        english: "Seeking knowledge is an obligation upon every Muslim.",
    },
    {
        id: "ibnmajah_2",
        bookId: "ibnmajah",
        number: 2,
        narrator: "Narrated by Abu Hurairah",
        bookRef: "Sunan Ibn Majah 224",
        arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ.",
        english: "Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.",
    },
];
