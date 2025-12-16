import { Word, User, GrammarLesson } from '../types';

const STORAGE_KEYS = {
  WORDS: 'leyland_words_v2',
  USER: 'leyland_user_v4_levels', // Changed key to force reset for new logic
  GRAMMAR: 'leyland_grammar_v2',
};

// Seeding a comprehensive list of words for A1 level
const SEED_WORDS: Word[] = [
  // --- EXISTING BASIC NOUNS ---
  { id: '1', russian: 'Человек', azerbaijani: 'İnsan', transcription: "[che-la-vyek]", example_ru: 'Это хороший человек.', example_az: 'Bu yaxşı insandır.', level: 'A1', learned: false },
  { id: '2', russian: 'Время', azerbaijani: 'Vaxt', transcription: "[vre-mya]", example_ru: 'У меня нет времени.', example_az: 'Mənim vaxtım yoxdur.', level: 'A1', learned: false },
  { id: '3', russian: 'День', azerbaijani: 'Gün', transcription: "[dyen']", example_ru: 'Добрый день.', example_az: 'Hər vaxtınız xeyir.', level: 'A1', learned: false },
  { id: '4', russian: 'Дом', azerbaijani: 'Ev', transcription: "[dom]", example_ru: 'Это мой дом.', example_az: 'Bu mənim evimdir.', level: 'A1', learned: false },
  { id: '5', russian: 'Работа', azerbaijani: 'İş', transcription: "[ra-bo-ta]", example_ru: 'Я иду на работу.', example_az: 'Mən işə gedirəm.', level: 'A1', learned: false },
  { id: '6', russian: 'Жизнь', azerbaijani: 'Həyat', transcription: "[zhizn']", example_ru: 'Жизнь прекрасна.', example_az: 'Həyat gözəldir.', level: 'A1', learned: false },
  { id: '7', russian: 'Рука', azerbaijani: 'Əl', transcription: "[ru-ka]", example_ru: 'Дай мне руку.', example_az: 'Mənə əlini ver.', level: 'A1', learned: false },
  { id: '8', russian: 'Глаз', azerbaijani: 'Göz', transcription: "[glaz]", example_ru: 'У неё красивые глаза.', example_az: 'Onun gözəl gözləri var.', level: 'A1', learned: false },
  { id: '9', russian: 'Место', azerbaijani: 'Yer', transcription: "[mye-sta]", example_ru: 'Это моё место.', example_az: 'Bu mənim yerimdir.', level: 'A1', learned: false },
  { id: '10', russian: 'Друг', azerbaijani: 'Dost', transcription: "[drug]", example_ru: 'Ты мой лучший друг.', example_az: 'Sən mənim ən yaxşı dostumsan.', level: 'A1', learned: false },
  { id: '11', russian: 'Страна', azerbaijani: 'Ölkə', transcription: "[stra-na]", example_ru: 'Россия - большая страна.', example_az: 'Rusiya böyük ölkədir.', level: 'A1', learned: false },
  { id: '12', russian: 'Город', azerbaijani: 'Şəhər', transcription: "[go-rad]", example_ru: 'Я живу в этом городе.', example_az: 'Mən bu şəhərdə yaşayıram.', level: 'A1', learned: false },
  { id: '13', russian: 'Вода', azerbaijani: 'Su', transcription: "[va-da]", example_ru: 'Дайте мне воды.', example_az: 'Mənə su verin.', level: 'A1', learned: false },
  { id: '14', russian: 'Еда', azerbaijani: 'Yemək', transcription: "[ye-da]", example_ru: 'Еда на столе.', example_az: 'Yemək stolun üstündədir.', level: 'A1', learned: false },
  { id: '15', russian: 'Машина', azerbaijani: 'Maşın', transcription: "[ma-shi-na]", example_ru: 'У меня новая машина.', example_az: 'Mənim yeni maşınım var.', level: 'A1', learned: false },
  { id: '16', russian: 'Дорога', azerbaijani: 'Yol', transcription: "[da-ro-ga]", example_ru: 'Длинная дорога.', example_az: 'Uzun yol.', level: 'A1', learned: false },
  { id: '17', russian: 'Школа', azerbaijani: 'Məktəb', transcription: "[shko-la]", example_ru: 'Дети идут в школу.', example_az: 'Uşaqlar məktəbə gedirlər.', level: 'A1', learned: false },
  { id: '18', russian: 'Семья', azerbaijani: 'Ailə', transcription: "[sim-ya]", example_ru: 'Я люблю свою семью.', example_az: 'Mən ailəmi sevirəm.', level: 'A1', learned: false },
  { id: '19', russian: 'Собака', azerbaijani: 'İt', transcription: "[sa-ba-ka]", example_ru: 'Собака лает.', example_az: 'İt hürür.', level: 'A1', learned: false },
  { id: '20', russian: 'Деньги', azerbaijani: 'Pul', transcription: "[dyen'-gi]", example_ru: 'Время - деньги.', example_az: 'Vaxt puldur.', level: 'A1', learned: false },
  { id: '21', russian: 'Ночь', azerbaijani: 'Gecə', transcription: "[noch']", example_ru: 'Спокойной ночи.', example_az: 'Gecəniz xeyrə qalsın.', level: 'A1', learned: false },
  { id: '22', russian: 'Утро', azerbaijani: 'Səhər', transcription: "[u-tra]", example_ru: 'Доброе утро.', example_az: 'Sabahınız xeyir.', level: 'A1', learned: false },
  { id: '23', russian: 'Вечер', azerbaijani: 'Axşam', transcription: "[vye-cher]", example_ru: 'Добрый вечер.', example_az: 'Axşamınız xeyir.', level: 'A1', learned: false },
  { id: '24', russian: 'Вопрос', azerbaijani: 'Sual', transcription: "[va-pros]", example_ru: 'У меня есть вопрос.', example_az: 'Mənim sualım var.', level: 'A1', learned: false },
  { id: '25', russian: 'Ответ', azerbaijani: 'Cavab', transcription: "[at-vyet]", example_ru: 'Я знаю ответ.', example_az: 'Mən cavabı bilirəm.', level: 'A1', learned: false },

  // --- NEW VERBS (ACTIONS) ---
  { id: '26', russian: 'Думать', azerbaijani: 'Düşünmək', transcription: "[du-mat']", example_ru: 'Я думаю о тебе.', example_az: 'Mən sənin haqqında düşünürəm.', level: 'A1', learned: false },
  { id: '27', russian: 'Знать', azerbaijani: 'Bilmək', transcription: "[znat']", example_ru: 'Я не знаю.', example_az: 'Mən bilmirəm.', level: 'A1', learned: false },
  { id: '28', russian: 'Хотеть', azerbaijani: 'İstəmək', transcription: "[xa-tyet']", example_ru: 'Я хочу спать.', example_az: 'Mən yatmaq istəyirəm.', level: 'A1', learned: false },
  { id: '29', russian: 'Видеть', azerbaijani: 'Görmək', transcription: "[vi-dyet']", example_ru: 'Ты видишь это?', example_az: 'Sən bunu görürsən?', level: 'A1', learned: false },
  { id: '30', russian: 'Слышать', azerbaijani: 'Eşitmək', transcription: "[sli-shat']", example_ru: 'Я тебя не слышу.', example_az: 'Mən səni eşitmirəm.', level: 'A1', learned: false },
  { id: '31', russian: 'Говорить', azerbaijani: 'Danışmaq', transcription: "[ga-va-rit']", example_ru: 'Она говорит по-русски.', example_az: 'O rusca danışır.', level: 'A1', learned: false },
  { id: '32', russian: 'Сказать', azerbaijani: 'Demək', transcription: "[ska-zat']", example_ru: 'Что ты сказал?', example_az: 'Sən nə dedin?', level: 'A1', learned: false },
  { id: '33', russian: 'Понимать', azerbaijani: 'Başa düşmək', transcription: "[pa-ni-mat']", example_ru: 'Я понимаю тебя.', example_az: 'Mən səni başa düşürəm.', level: 'A1', learned: false },
  { id: '34', russian: 'Любить', azerbaijani: 'Sevmək', transcription: "[lyu-bit']", example_ru: 'Я люблю музыку.', example_az: 'Mən musiqini sevirəm.', level: 'A1', learned: false },
  { id: '35', russian: 'Ждать', azerbaijani: 'Gözləmək', transcription: "[zhdat']", example_ru: 'Я жду автобус.', example_az: 'Mən avtobus gözləyirəm.', level: 'A1', learned: false },
  { id: '36', russian: 'Жить', azerbaijani: 'Yaşamaq', transcription: "[zhit']", example_ru: 'Где ты живешь?', example_az: 'Sən harada yaşayırsan?', level: 'A1', learned: false },
  { id: '37', russian: 'Делать', azerbaijani: 'Etmək', transcription: "[dye-lat']", example_ru: 'Что ты делаешь?', example_az: 'Sən nə edirsən?', level: 'A1', learned: false },
  { id: '38', russian: 'Смотреть', azerbaijani: 'Baxmaq', transcription: "[sma-tryet']", example_ru: 'Не смотри назад.', example_az: 'Geriyə baxma.', level: 'A1', learned: false },
  { id: '39', russian: 'Писать', azerbaijani: 'Yazmaq', transcription: "[pi-sat']", example_ru: 'Я пишу письмо.', example_az: 'Mən məktub yazıram.', level: 'A1', learned: false },
  { id: '40', russian: 'Читать', azerbaijani: 'Oxumaq', transcription: "[chi-tat']", example_ru: 'Я читаю книгу.', example_az: 'Mən kitab oxuyuram.', level: 'A1', learned: false },

  // --- COMMON ADJECTIVES (DESCRIPTIONS) ---
  { id: '41', russian: 'Хороший', azerbaijani: 'Yaxşı', transcription: "[xa-ro-shiy]", example_ru: 'Хороший день.', example_az: 'Yaxşı gün.', level: 'A1', learned: false },
  { id: '42', russian: 'Плохой', azerbaijani: 'Pis', transcription: "[pla-xoy]", example_ru: 'Плохая погода.', example_az: 'Pis hava.', level: 'A1', learned: false },
  { id: '43', russian: 'Большой', azerbaijani: 'Böyük', transcription: "[bal'-shoy]", example_ru: 'Большой дом.', example_az: 'Böyük ev.', level: 'A1', learned: false },
  { id: '44', russian: 'Маленький', azerbaijani: 'Balaca / Kiçik', transcription: "[ma-len'-kiy]", example_ru: 'Маленький кот.', example_az: 'Balaca pişik.', level: 'A1', learned: false },
  { id: '45', russian: 'Новый', azerbaijani: 'Yeni / Təzə', transcription: "[no-viy]", example_ru: 'Это новый телефон.', example_az: 'Bu yeni telefondur.', level: 'A1', learned: false },
  { id: '46', russian: 'Старый', azerbaijani: 'Köhnə / Qoca', transcription: "[sta-riy]", example_ru: 'Старый город.', example_az: 'Köhnə şəhər.', level: 'A1', learned: false },
  { id: '47', russian: 'Красивый', azerbaijani: 'Gözəl', transcription: "[kra-si-viy]", example_ru: 'Красивая девушка.', example_az: 'Gözəl qız.', level: 'A1', learned: false },
  { id: '48', russian: 'Вкусный', azerbaijani: 'Dadlı', transcription: "[vkus-niy]", example_ru: 'Вкусный хлеб.', example_az: 'Dadlı çörək.', level: 'A1', learned: false },
  { id: '49', russian: 'Горячий', azerbaijani: 'İsti', transcription: "[ga-rya-chiy]", example_ru: 'Горячий чай.', example_az: 'İsti çay.', level: 'A1', learned: false },
  { id: '50', russian: 'Холодный', azerbaijani: 'Soyuq', transcription: "[ha-lod-niy]", example_ru: 'Холодная вода.', example_az: 'Soyuq su.', level: 'A1', learned: false },

  // --- QUESTION WORDS & BASICS ---
  { id: '51', russian: 'Кто', azerbaijani: 'Kim', transcription: "[kto]", example_ru: 'Кто это?', example_az: 'Bu kimdir?', level: 'A1', learned: false },
  { id: '52', russian: 'Что', azerbaijani: 'Nə', transcription: "[shto]", example_ru: 'Что это?', example_az: 'Bu nədir?', level: 'A1', learned: false },
  { id: '53', russian: 'Где', azerbaijani: 'Harada', transcription: "[gdye]", example_ru: 'Где ты?', example_az: 'Sən haradasan?', level: 'A1', learned: false },
  { id: '54', russian: 'Когда', azerbaijani: 'Nə vaxt', transcription: "[kag-da]", example_ru: 'Когда ты придешь?', example_az: 'Sən nə vaxt gələcəksən?', level: 'A1', learned: false },
  { id: '55', russian: 'Почему', azerbaijani: 'Niyə', transcription: "[pa-chi-mu]", example_ru: 'Почему ты грустный?', example_az: 'Niyə sən kədərlisən?', level: 'A1', learned: false },
  { id: '56', russian: 'Как', azerbaijani: 'Necə', transcription: "[kak]", example_ru: 'Как дела?', example_az: 'İşlər necədir?', level: 'A1', learned: false },
  { id: '57', russian: 'Спасибо', azerbaijani: 'Çox sağ ol', transcription: "[spa-si-ba]", example_ru: 'Спасибо за помощь.', example_az: 'Kömək üçün çox sağ ol.', level: 'A1', learned: false },
  { id: '58', russian: 'Пожалуйста', azerbaijani: 'Buyurun / Xahiş edirəm', transcription: "[pa-zha-lu-sta]", example_ru: 'Скажи, пожалуйста.', example_az: 'De, zəhmət olmasa.', level: 'A1', learned: false },
  { id: '59', russian: 'Да', azerbaijani: 'Bəli / Hə', transcription: "[da]", example_ru: 'Да, я знаю.', example_az: 'Bəli, mən bilirəm.', level: 'A1', learned: false },
  { id: '60', russian: 'Нет', azerbaijani: 'Xeyr / Yox', transcription: "[nyet]", example_ru: 'Нет, спасибо.', example_az: 'Yox, sağ olun.', level: 'A1', learned: false },
  
  // --- FAMILY ---
  { id: '61', russian: 'Мама', azerbaijani: 'Ana', transcription: "[ma-ma]", example_ru: 'Я люблю маму.', example_az: 'Mən anamı sevirəm.', level: 'A1', learned: false },
  { id: '62', russian: 'Папа', azerbaijani: 'Ata', transcription: "[pa-pa]", example_ru: 'Мой папа сильный.', example_az: 'Mənim atam güclüdür.', level: 'A1', learned: false },
  { id: '63', russian: 'Брат', azerbaijani: 'Qardaş', transcription: "[brat]", example_ru: 'Это мой брат.', example_az: 'Bu mənim qardaşımdır.', level: 'A1', learned: false },
  { id: '64', russian: 'Сестра', azerbaijani: 'Bac', transcription: "[si-stra]", example_ru: 'У меня есть сестра.', example_az: 'Mənim bacım var.', level: 'A1', learned: false },
  { id: '65', russian: 'Дядя', azerbaijani: 'Əmi / Dayı', transcription: "[dya-dya]", example_ru: 'Дядя живет в Баку.', example_az: 'Əmim Bakıda yaşayır.', level: 'A1', learned: false }
];

const INITIAL_GRAMMAR: GrammarLesson[] = [
  { 
    id: '1', 
    title: 'Alphabet', 
    subtitle: 'Əlifba', 
    content: 'Russian uses the Cyrillic alphabet. It has 33 letters. Some look like Latin letters but sound different (P is R, C is S).', 
    status: 'completed',
    progress: 1.0
  },
  { 
    id: '2', 
    title: 'Nouns', 
    subtitle: 'İsim', 
    content: 'All Russian nouns belong to one of three genders: masculine (mas.), feminine (fem.), or neuter (neut.).\n\n* **Masculine**: ends in a consonant (й)\n* **Feminine**: ends in -а, -я\n* **Neuter**: ends in -о, -е', 
    status: 'unlocked',
    progress: 0.5
  },
  { 
    id: '3', 
    title: 'Adjectives', 
    subtitle: 'Sifət', 
    content: 'Adjectives change to match the gender of the noun they describe.\n\n* Masc: -ый, -ий (Красивый)\n* Fem: -ая, -яя (Красивая)\n* Neut: -ое, -ее (Красивое)', 
    status: 'locked',
    progress: 0
  },
  { 
    id: '4', 
    title: 'Verbs', 
    subtitle: 'Fel', 
    content: 'Russian verbs change endings based on who is doing the action (conjugation).\n\nЯ (Mən) -ю/-у\nТы (Sən) -ешь/-ишь\nОн/Она (O) -ет/-ит', 
    status: 'locked',
    progress: 0
  }
];

export const StorageService = {
  getWords: (): Word[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.WORDS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(SEED_WORDS));
      return SEED_WORDS;
    }
    const parsed = JSON.parse(stored);
    // Add check to ensure we have enough words if user cleared data
    if (parsed.length < SEED_WORDS.length) {
       localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(SEED_WORDS));
       return SEED_WORDS;
    }
    return parsed;
  },

  getWordsForLevel: (level: number): Word[] => {
    const allWords = StorageService.getWords();
    const startIndex = (level - 1) * 10;
    const endIndex = startIndex + 10;
    return allWords.slice(startIndex, endIndex);
  },

  getWordsForReview: (count: number): Word[] => {
    const allWords = StorageService.getWords();
    const learnedWords = allWords.filter(w => w.learned);
    if (learnedWords.length === 0) return [];
    
    // Shuffle and slice
    const shuffled = learnedWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  saveWords: (words: Word[]) => {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  },

  getCurrentUser: (): User => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    const today = new Date().toDateString();
    
    // Default User Template
    const defaultUser: User = { 
        id: 'me', 
        name: 'Leyla', 
        xp: 0, 
        streak: 0, 
        wordsLearned: 0,
        totalWords: 1000, // Fixed to 1000 as requested
        joinedDate: new Date().toISOString(), 
        role: 'user',
        lastActivityDate: today,
        dailyNewWords: 0,
        dailyReviewCount: 0,
        streakUpdatedToday: false,
        currentLevel: 1,
        dailyEnergy: 2
    };

    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      return defaultUser;
    }

    const user = JSON.parse(stored);

    // Date Logic Check (New Day Reset)
    if (user.lastActivityDate !== today) {
        // It's a new day
        const lastDate = new Date(user.lastActivityDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // Streak Logic: If more than 2 days passed (meaning they missed yesterday), reset streak
        if (diffDays > 2) {
            user.streak = 0;
        }
        
        // Reset daily trackers
        user.dailyNewWords = 0;
        user.dailyReviewCount = 0;
        user.streakUpdatedToday = false;
        
        // Reset Energy
        user.dailyEnergy = 2;
        
        user.lastActivityDate = today;
        
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    return user;
  },

  updateUser: (updates: Partial<User>) => {
    const current = StorageService.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  getAllUsers: (): User[] => {
    return [StorageService.getCurrentUser()];
  },

  addWord: (russian: string, azerbaijani: string, category: string) => {
    const words = StorageService.getWords();
    const newWord: Word = {
      id: Date.now().toString(),
      russian,
      azerbaijani,
      level: category || 'A1',
      learned: false
    };
    words.push(newWord);
    StorageService.saveWords(words);
  },

  getGrammarLessons: (): GrammarLesson[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.GRAMMAR);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.GRAMMAR, JSON.stringify(INITIAL_GRAMMAR));
      return INITIAL_GRAMMAR;
    }
    return JSON.parse(stored);
  },

  saveGrammarLessons: (lessons: GrammarLesson[]) => {
    localStorage.setItem(STORAGE_KEYS.GRAMMAR, JSON.stringify(lessons));
  },

  // Helper to mark a word as learned and update stats
  saveProgress: (wordId: string) => {
    // 1. Mark word as learned
    const allWords = StorageService.getWords();
    const updatedWords = allWords.map(w => {
      if (w.id === wordId) {
          return { ...w, learned: true };
      }
      return w;
    });
    StorageService.saveWords(updatedWords);
    
    // Note: We don't update User stats here anymore, we do it at Level Completion or explicitly
  },

  // Called when a user successfully finishes the NEW level
  completeCurrentLevel: () => {
    const user = StorageService.getCurrentUser();
    
    if (user.dailyEnergy > 0) {
        const updates: Partial<User> = {
            currentLevel: user.currentLevel + 1,
            dailyEnergy: user.dailyEnergy - 1,
            wordsLearned: user.wordsLearned + 10,
            dailyNewWords: user.dailyNewWords + 10,
            xp: user.xp + 100
        };

        // Streak check
        if (updates.dailyNewWords! >= 10 && !user.streakUpdatedToday) {
            updates.streak = user.streak + 1;
            updates.streakUpdatedToday = true;
        }

        StorageService.updateUser(updates);
        return true;
    }
    return false;
  },

  completeReviewSession: () => {
    const user = StorageService.getCurrentUser();
    const updates: Partial<User> = {
        dailyReviewCount: user.dailyReviewCount + 1,
        xp: user.xp + 50
    };
    StorageService.updateUser(updates);
  }
};