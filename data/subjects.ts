export type Level = "A" | "B" | "C" | "D";

/** Скільки пунктів детальної структури програми МОН віднесено до кожного рівня. */
export type LevelCounts = Partial<Record<Level, number>>;

export type SyllabusGroup = {
  title: string;
  weight: string;
  topics: string[];
};

export type LevelExample = {
  level: Level;
  label: string;
  official: string;
  meaning: string;
  example: string;
};

export type KitFile = {
  /**
   * Номер файлу. Якщо файл — один підрозділ програми, він збігається з номером підрозділу («1.1»);
   * якщо файл-модуль охоплює кілька підрозділів, це його порядковий номер («1»), а підрозділи вказано в `covers`.
   */
  code: string;
  title: string;
  /** Номери підрозділів програми, які охоплює файл. Без цього поля файл охоплює один підрозділ `code`. */
  covers?: string[];
  /** Кількість сторінок у файлі. Поки невідома — не вказуйте: на сайті цей показник просто не з’явиться. */
  pages?: number;
};

export type Kit = {
  /**
   * Єдиний прапорець готовності комплекту. Поки він `false`, сторінка комплекту має
   * `noindex`, не потрапляє в sitemap, а замість «Купити» показується «Повідомити, коли буде готово».
   */
  ready: boolean;
  /** Ціна в гривнях. Без неї кнопка «Купити» є, але ціни на сайті немає (і немає розмітки Product). */
  price?: number;
  files: KitFile[];
};
/** Для якої програми підготовлено матеріали й що буде при її зміні. */
export type Edition = {
  /** Коротка мітка для картки комплекту: «Програма 2026». */
  label: string;
  note: string;
  /** Що буде з матеріалами, коли програму змінять. Без поля — окремого оновлення не обіцяємо. */
  update?: string;
  /** Покупці цього комплекту безкоштовно отримують оновлені матеріали. */
  freeUpdate?: boolean;
};

export type Subject = {
  id: "pedagogy" | "psychology" | "management";
  number: string;
  /** Повна назва предмета; скрізь на сайті використовується саме вона. */
  title: string;
  description: string;
  icon: string;
  /** Зображення для попереднього перегляду посилання (Open Graph), 1200×675. */
  og: { path: string; width: number; height: number };
  /** Рекламне превʼю комплекту (16:9, оригінальні 1672×941) для головної, картки й сторінки комплекту. */
  preview: { src: string; width: number; height: number };
  edition: Edition;
  /** Основний колір предмета та його неонова версія для темних секцій. */
  accent: string;
  neon: string;
  overview: string;
  summary: string;
  officialSource: string;
  sourceLabel: string;
  syllabus: SyllabusGroup[];
  /** Вага окремих підрозділів за програмою (там, де вона вказана в офіційному тексті). */
  topicWeights?: Record<string, string>;
  /** Рівні пунктів детальної структури програми за підрозділами: ключ — номер підрозділу. */
  levelCounts: Record<string, LevelCounts>;
  levels: LevelExample[];
  kit: Kit;
};

export const LEVELS: Level[] = ["A", "B", "C", "D"];

/** Когнітивні рівні охоплення — формулювання з програм МОН; кожен наступний рівень включає попередні. */
export const levelsMeaning: Pick<LevelExample, "level" | "label" | "official" | "meaning">[] = [
  { level: "A", label: "Знання", official: "Знання", meaning: "Пригадати факт, термін або визначення." },
  { level: "B", label: "Розуміння", official: "Знання, розуміння", meaning: "Пояснити зв’язок або розпізнати правильне тлумачення." },
  { level: "C", label: "Застосування", official: "Знання, розуміння, застосування", meaning: "Використати правило чи метод у типовій ситуації." },
  { level: "D", label: "Аналіз і оцінювання", official: "Знання, розуміння, застосування та аналіз / синтез / оцінка", meaning: "Зіставити умови, аргументи й обрати обґрунтоване рішення." },
];

const levels = (examples: [string, string, string, string]): LevelExample[] =>
  levelsMeaning.map((item, index) => ({ ...item, example: examples[index] }));

const pedagogyRows: [code: string, title: string, pages: number][] = [
  ["1.1", "Педагогіка та психологія у структурі сучасних наук", 8],
  ["1.2", "Загальні закономірності розвитку і соціалізації особистості", 10],
  ["2.1", "Педагогічна та психологічна думка XVII – початку XX ст.", 13],
  ["2.2", "Педагогічна та психологічна думка XX – початку XXI ст.", 20],
  ["3.1", "Планування та забезпечення якості дослідження", 7],
  ["3.2", "Методи збирання інформації", 12],
  ["3.3", "Методи аналізу емпіричних даних", 10],
  ["4.1", "Освіта і навчання особистості", 23],
  ["4.2", "Виховання особистості", 18],
  ["4.3", "Особистість у життєвому та професійному просторі", 19],
];

const pedagogyFiles: KitFile[] = pedagogyRows.map(([code, title, pages]) => ({ code, title, pages }));

type TemplateExtras = {
  /** Кількість сторінок за номером файлу: `{ "1.1": 8, "1.2": 10 }`. */
  pages?: Record<string, number>;
};

/**
 * Шаблон комплекту: по одному файлу на кожен підрозділ програми (номер і назва беруться з програми).
 * Кількість сторінок додавайте в `extras.pages` за номером файлу.
 */
function filesFromProgram(groups: SyllabusGroup[], extras: TemplateExtras = {}): KitFile[] {
  return groups.flatMap((group) =>
    group.topics.map((topic) => {
      const code = topic.split(" ")[0];
      const file: KitFile = { code, title: topic.slice(code.length).trim() };
      if (extras.pages?.[code] !== undefined) file.pages = extras.pages[code];
      return file;
    }),
  );
}

/** Ціна кожного комплекту, ₴. */
export const KIT_PRICE = 700;

/** Для кожного комплекту: на що розраховано зміст і що це не гарантія. */
export const SCORE_NOTE = "Змістово матеріали розраховані на складання іспиту на 170 балів і більше, але не гарантують його складання.";

/** Усі матеріали відповідають за підходом і змістом тому, що показано в прикладах. */
export const SAMPLES_NOTE = "Усі матеріали мають аналогічний підхід і змістове наповнення, аналогічне до того, яке зображено в прикладах.";

/** Продаж приватний, без платіжних систем: повернення коштів не передбачено. */
export const REFUND_NOTE = "У разі придбання та отримання доступу до матеріалів повернення коштів не передбачено.";

const psychologySyllabus: SyllabusGroup[] = [
    { title: "1. Основи психології та соціології", weight: "14–16%", topics: ["1.1 Психологія та соціологія у структурі сучасних наук", "1.2 Основні категорії психології та соціології"] },
    { title: "2. Історія і теорія психології та соціології", weight: "14–16%", topics: ["2.1 Соціологічна та психологічна думка XIX ст.", "2.2 Соціологічна та психологічна думка кінця XIX — початку XX ст.", "2.3 Психологічна та соціологічна думка другої половини XX — початку XXI ст."] },
    { title: "3. Методи психології та соціології", weight: "19–21%", topics: ["3.1 Планування та забезпечення якості дослідження", "3.2 Методи збору інформації", "3.3 Методи аналізу емпіричних даних"] },
    { title: "4. Прикладні аспекти психології та соціології", weight: "29–31%", topics: ["4.1 Особистість як об’єкт та суб’єкт соціальних відносин", "4.2 Особистість у життєвому та професійному просторі"] },
    { title: "5. Психологічні та соціологічні виміри суспільства", weight: "19–21%", topics: ["5.1 Група як структурний елемент суспільства", "5.2 Соціальні та психологічні характеристики й форми організації суспільних процесів і явищ"] },
  ];

const managementSyllabus: SyllabusGroup[] = [
    { title: "1. Менеджмент", weight: "33–35%", topics: ["1.1 Теоретичні основи менеджменту", "1.2 Функція планування в менеджменті", "1.3 Функція організування в менеджменті", "1.4 Мотивування як функція менеджменту", "1.5 Контролювання як функція менеджменту", "1.6 Інформація і комунікації в менеджменті", "1.7 Управлінські рішення", "1.8 Вплив, влада і лідерство в менеджменті. Стилі керівництва"] },
    { title: "2. Маркетинг", weight: "32–34%", topics: ["2.1 Теоретичні основи маркетингу", "2.2 Аналіз маркетингового середовища", "2.3 Маркетингова товарна політика", "2.4 Маркетингова цінова політика", "2.5 Маркетингова політика розподілу", "2.6 Маркетингова політика комунікацій"] },
    { title: "3. Підприємництво", weight: "32–34%", topics: ["3.1 Теоретичні засади підприємництва", "3.2 Види підприємництва", "3.3 Підприємство як форма організації підприємницької діяльності. Види підприємств", "3.4 Організація підприємницької діяльності", "3.5 Планування підприємницької діяльності", "3.6 Ресурсне забезпечення підприємницької діяльності", "3.7 Ефективність підприємницької діяльності", "3.8 Соціальна відповідальність бізнесу та ділова етика"] },
  ];

// Психологія та соціологія: 12 файлів, по одному на підрозділ.
const psychologyKit: Kit = {
  ready: true,
  price: KIT_PRICE,
  files: filesFromProgram(psychologySyllabus, {
    pages: {
      "1.1": 16, "1.2": 17, "2.1": 11, "2.2": 16, "2.3": 19, "3.1": 12,
      "3.2": 16, "3.3": 15, "4.1": 11, "4.2": 14, "5.1": 12, "5.2": 14,
    },
  }),
};

// Управління та адміністрування: 10 файлів-модулів, кожен охоплює кілька підрозділів програми.
const managementModules: [title: string, covers: string[], pages: number][] = [
  ["Основи менеджменту та планування", ["1.1", "1.2"], 31],
  ["Організування та контролювання", ["1.3", "1.5"], 31],
  ["Мотивування, влада і лідерство", ["1.4", "1.8"], 26],
  ["Інформація, комунікації та управлінські рішення", ["1.6", "1.7"], 32],
  ["Основи маркетингу й аналіз ринку", ["2.1", "2.2"], 23],
  ["Товарна і цінова політика", ["2.3", "2.4"], 19],
  ["Розподіл і маркетингові комунікації", ["2.5", "2.6"], 19],
  ["Засади, види та форми підприємництва", ["3.1", "3.2", "3.3", "3.8"], 27],
  ["Створення бізнесу та бізнес-планування", ["3.4", "3.5"], 22],
  ["Ресурси та ефективність підприємства", ["3.6", "3.7"], 23],
];

const managementKit: Kit = {
  ready: true,
  price: KIT_PRICE,
  files: managementModules.map(([title, covers, pages], index) => ({ code: String(index + 1), title, covers, pages })),
};

/** «Психологія та соціологія» й «Управління та адміністрування»: матеріали за програмами 2026 року, у 2027-му програми зміняться. */
const nextProgramEdition: Edition = {
  label: "Програма 2026",
  note: "Матеріали підготовлено за програмою 2026 року. У 2027 році програма іспиту зміниться в пунктах щодо кількох тем.",
  update: "Згодом матеріали буде змінено під усі теми нової програми. Придбавши комплект 2026 року, ти безкоштовно отримаєш і оновлені матеріали.",
  freeUpdate: true,
};

export const subjects: Subject[] = [
  {
    id: "pedagogy",
    number: "01",
    title: "Педагогіка та психологія",
    description: "Навчання, виховання, розвиток особистості, методи дослідження та прикладна психологія освіти.",
    icon: "/img/subject-pedagogy.webp",
    og: { path: "/og/pedagogy.jpg", width: 1200, height: 675 },
    preview: { src: "/img/preview-pedagogy.webp", width: 1672, height: 941 },
    edition: {
      label: "Програма 2027",
      note: "Матеріали підготовлено за програмою, актуальною в 2027 році. Іспит у 2027 році проходитиме за тією самою програмою, тож комплект підходить і для нього.",
    },
    accent: "#2563EB",
    neon: "#4da3ff",
    overview: "Програма поєднує фундаментальні засади педагогіки й психології з історією і теорією, методами дослідження та прикладними засадами освіти.",
    summary: "Об’єкт і предмет педагогіки та психології, їхня мета й основні напрями; ключові постаті та наукові школи; методи дослідження й аналізу результатів; принципи, форми та методи навчання і виховання; психічний розвиток, пізнавальні процеси, мотивація та індивідуальні відмінності.",
    officialSource: "https://mon.gov.ua/static-objects/mon/sites/1/vishcha-osvita/vstup-2024/Zatverdzheni.prohramy.YEVI-YEFVV/01.04.2024/Pro.zatv.Prohr.predm.testu.z.pedahohiky.ta.psykholohiyi-nakaz-426-01.04.2024.pdf",
    sourceLabel: "Наказ МОН № 426 від 01.04.2024",
    syllabus: [
      { title: "1. Основи педагогіки та психології", weight: "13–17%", topics: ["1.1 Педагогіка та психологія у структурі сучасних наук", "1.2 Загальні закономірності розвитку і соціалізації особистості"] },
      { title: "2. Історія і теорія педагогіки та психології", weight: "20–30%", topics: ["2.1 Педагогічна та психологічна думка XVII – початок XX ст.", "2.2 Педагогічна та психологічна думка XX – початку XXI ст."] },
      { title: "3. Методи дослідження у педагогіці та психології", weight: "13–17%", topics: ["3.1 Планування та забезпечення якості дослідження", "3.2 Методи збирання інформації", "3.3 Методи аналізу емпіричних даних"] },
      { title: "4. Прикладні психолого-педагогічні засади освіти, навчання, виховання та розвитку особистості", weight: "40–50%", topics: ["4.1 Освіта і навчання особистості", "4.2 Виховання особистості", "4.3 Особистість у життєвому та професійному просторі"] },
    ],
    topicWeights: { "1.1": "5–7%", "1.2": "8–10%", "2.1": "8–12%", "2.2": "13–17%", "3.1": "3,5–4,5%", "3.2": "7–9%", "3.3": "2,5–3,5%", "4.1": "18–22%", "4.2": "8–12%", "4.3": "12–16%" },
    levelCounts: {
      "1.1": { B: 6 }, "1.2": { B: 8, C: 1 },
      "2.1": { B: 10 }, "2.2": { B: 12, C: 1 },
      "3.1": { B: 4 }, "3.2": { B: 4, C: 3 }, "3.3": { B: 3 },
      "4.1": { B: 11, C: 4 }, "4.2": { B: 6, C: 2 }, "4.3": { B: 6, C: 3 },
    },
    levels: levels([
      "Назвати основні функції навчання.",
      "Розрізнити формувальне й підсумкове оцінювання.",
      "Обрати метод навчання для заданої освітньої мети.",
      "Оцінити педагогічну ситуацію та запропонувати обґрунтовану стратегію взаємодії.",
    ]),
    kit: { ready: true, price: KIT_PRICE, files: pedagogyFiles },
  },
  {
    id: "psychology",
    number: "02",
    title: "Психологія та соціологія",
    description: "Основи двох наук, їх історія, методи, прикладні аспекти та виміри суспільства.",
    icon: "/img/subject-psychology.webp",
    og: { path: "/og/psychology.jpg", width: 1200, height: 675 },
    preview: { src: "/img/preview-psychology.webp", width: 1672, height: 941 },
    edition: nextProgramEdition,
    accent: "#4F1A87",
    neon: "#b78bff",
    overview: "Тест перевіряє розуміння психіки, особистості й поведінки разом із соціальною структурою, групами, інститутами та методами дослідження.",
    summary: "Особистість, соціалізація і поведінка; соціальні групи, комунікація, нерівність та соціальний контроль; основні теорії й постаті психології та соціології; методи дослідження, вибірка, вимірювання і базовий статистичний аналіз.",
    officialSource: "https://mon.gov.ua/static-objects/mon/sites/1/vishcha-osvita/vstup-2022/Prohramy-YEFVV/Zatverdzheni.prohramy.YEFVV/11.02/Pro.zatv.Prohr.predm.testu.psykhol.sotsiol-nakaz-156-11.02.2022.pdf",
    sourceLabel: "Наказ МОН № 156 від 11.02.2022",
    syllabus: psychologySyllabus,
    levelCounts: {
      "1.1": { B: 7 }, "1.2": { B: 5, C: 2 },
      "2.1": { B: 4 }, "2.2": { B: 6, C: 1 }, "2.3": { B: 2 },
      "3.1": { B: 3, C: 1 }, "3.2": { B: 4, C: 2 }, "3.3": { B: 1, C: 1, D: 2 },
      "4.1": { B: 3, C: 1 }, "4.2": { B: 2, C: 3 },
      "5.1": { B: 2, C: 1 }, "5.2": { B: 3, C: 1 },
    },
    levels: levels([
      "Назвати автора поняття аномії.",
      "Пояснити відмінність між об’єктом і предметом дослідження.",
      "Обрати метод для вивчення ставлень великої групи.",
      "Інтерпретувати суперечливі результати опитування з урахуванням вибірки й похибки.",
    ]),
    kit: psychologyKit,
  },
  {
    id: "management",
    number: "03",
    title: "Управління та адміністрування",
    description: "Менеджмент, маркетинг і підприємництво — три майже рівні частини офіційної програми.",
    icon: "/img/subject-management.webp",
    og: { path: "/og/management.jpg", width: 1200, height: 675 },
    preview: { src: "/img/preview-management.webp", width: 1672, height: 941 },
    edition: nextProgramEdition,
    accent: "#0D9488",
    neon: "#2ee6c7",
    overview: "Предметний тест охоплює управління організацією, ринок і споживача, а також створення та розвиток підприємницької діяльності.",
    summary: "Функції менеджменту, лідерство, команди та управлінські рішення; маркетингове середовище, поведінка споживача, сегментація і комплекс маркетингу; підприємництво, бізнес-моделі, ресурси, ризики та розвиток організації.",
    officialSource: "https://mon.gov.ua/static-objects/mon/sites/1/vishcha-osvita/vstup-2022/Prohramy-YEFVV/Zatverdzheni.prohramy.YEFVV/11.02/Pro.zatv.Prohr.predm.testu.upravl.administruv-nakaz-157-11.02.2022.pdf",
    sourceLabel: "Наказ МОН № 157 від 11.02.2022",
    syllabus: managementSyllabus,
    topicWeights: {
      "1.1": "4–6%", "1.2": "4–6%", "1.3": "4–6%", "1.4": "3,5–4,5%", "1.5": "2,5–3,5%", "1.6": "3,5–4,5%", "1.7": "4–6%", "1.8": "2,5–3,5%",
      "2.1": "5–7%", "2.2": "5–7%", "2.3": "5–7%", "2.4": "4–6%", "2.5": "4–6%", "2.6": "4–6%",
      "3.1": "1,5–2,5%", "3.2": "3,5–4,5%", "3.3": "3,5–4,5%", "3.4": "2,5–3,5%", "3.5": "6–8%", "3.6": "5–7%", "3.7": "5–7%", "3.8": "0,8–1,2%",
    },
    levelCounts: {
      "1.1": { B: 5 }, "1.2": { B: 5 }, "1.3": { B: 6 }, "1.4": { B: 4 }, "1.5": { B: 3 }, "1.6": { B: 5 }, "1.7": { B: 4 }, "1.8": { B: 8 },
      "2.1": { B: 3 }, "2.2": { B: 3 }, "2.3": { B: 3 }, "2.4": { B: 2 }, "2.5": { B: 5 }, "2.6": { B: 3 },
      "3.1": { B: 2 }, "3.2": { B: 4 }, "3.3": { B: 6 }, "3.4": { B: 3 }, "3.5": { B: 3, C: 1 }, "3.6": { B: 5 }, "3.7": { B: 5 }, "3.8": { B: 3 },
    },
    levels: levels([
      "Назвати функції менеджменту.",
      "Пояснити різницю між сегментом і цільовим ринком.",
      "Обрати канал збуту для заданого продукту.",
      "Оцінити альтернативні стратегії розвитку підприємства за умов ризику.",
    ]),
    kit: managementKit,
  },
];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

export function kitStats(subject: Subject) {
  const files = subject.kit.files;
  const known = files.length > 0 && files.every((file) => typeof file.pages === "number");
  return {
    files: files.length,
    /** Сума сторінок — лише якщо відомі сторінки всіх файлів, інакше `null`. */
    pages: known ? files.reduce((sum, file) => sum + (file.pages ?? 0), 0) : null,
  };
}

/** Чого бракує готовому комплекту, щоб його можна було публікувати. Порожній список — усе заповнено. */
export function kitIssues(subject: Subject): string[] {
  if (!subject.kit.ready) return [];
  const issues: string[] = [];
  if (!subject.kit.price) issues.push("не вказано ціну (kit.price)");
  if (subject.kit.files.length === 0) issues.push("немає файлів (kit.files)");
  const noPages = subject.kit.files.filter((file) => typeof file.pages !== "number").map((file) => file.code);
  if (noPages.length) issues.push(`не вказано сторінки у файлах: ${noPages.join(", ")}`);
  return issues;
}
/** Номер підрозділу з рядка «1.1 Назва…». */
export function topicCode(topic: string): string {
  return topic.split(" ")[0];
}

/** Номери підрозділів, які охоплює файл. */
export function fileCovers(file: KitFile): string[] {
  return file.covers ?? [file.code];
}

/** Знаходить файл комплекту, у якому розкрито підрозділ програми («1.1 Назва…» → файл 1.1 або модуль, що охоплює 1.1). */
export function fileForTopic(subject: Subject, topic: string): KitFile | undefined {
  const code = topicCode(topic);
  return subject.kit.files.find((file) => fileCovers(file).includes(code));
}

/** Файли комплекту, що належать до розділу програми, без повторів і в порядку програми. */
export function filesForGroup(subject: Subject, group: SyllabusGroup): KitFile[] {
  const files = group.topics.map((topic) => fileForTopic(subject, topic)).filter((file): file is KitFile => file !== undefined);
  return [...new Set(files)];
}

/** Чи кожному файлу відповідає рівно один підрозділ із тим самим номером (інакше файли — модулі з кількох підрозділів). */
export function kitIsOneToOne(subject: Subject): boolean {
  return subject.kit.files.every((file) => !file.covers || (file.covers.length === 1 && file.covers[0] === file.code));
}

/** Рівні пунктів програми для файлу: сума за всіма підрозділами, які він охоплює. */
export function fileLevelCounts(subject: Subject, file: KitFile): LevelCounts {
  const total: LevelCounts = {};
  for (const code of fileCovers(file)) {
    for (const level of LEVELS) {
      const count = subject.levelCounts[code]?.[level];
      if (count) total[level] = (total[level] ?? 0) + count;
    }
  }
  return total;
}

/** Діапазон ваги підрозділу, наприклад «3,5–4,5%», у десятих частках відсотка. */
function parseWeight(weight: string): [number, number] | undefined {
  const match = weight.match(/^([\d,.]+)\s*[–-]\s*([\d,.]+)%$/);
  if (!match) return undefined;
  const tenths = (value: string) => Math.round(parseFloat(value.replace(",", ".")) * 10);
  return [tenths(match[1]), tenths(match[2])];
}

const formatTenths = (value: number) => (value % 10 === 0 ? String(value / 10) : (value / 10).toFixed(1).replace(".", ","));

/** Вага файлу в програмі: сума діапазонів ваг усіх підрозділів, які він охоплює. Невідома — якщо вага є не в усіх. */
export function fileWeight(subject: Subject, file: KitFile): string | undefined {
  const parts = fileCovers(file).map((code) => subject.topicWeights?.[code]);
  if (parts.length === 0 || parts.some((part) => part === undefined)) return undefined;
  if (parts.length === 1) return parts[0];
  const ranges = parts.map((part) => parseWeight(part as string));
  if (ranges.some((range) => range === undefined)) return undefined;
  const low = ranges.reduce((sum, range) => sum + (range as [number, number])[0], 0);
  const high = ranges.reduce((sum, range) => sum + (range as [number, number])[1], 0);
  return `${formatTenths(low)}–${formatTenths(high)}%`;
}

/** Сума пунктів програми за рівнями й частки у відсотках (метод найбільших залишків — разом рівно 100). */
export function levelSummary(subject: Subject) {
  const counts: Record<Level, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const topic of Object.values(subject.levelCounts)) {
    for (const level of LEVELS) counts[level] += topic[level] ?? 0;
  }
  const total = LEVELS.reduce((sum, level) => sum + counts[level], 0);
  const raw = LEVELS.map((level) => ({ level, exact: total ? (counts[level] / total) * 100 : 0 }));
  const shares: Record<Level, number> = { A: 0, B: 0, C: 0, D: 0 };
  let left = 100;
  for (const item of raw) {
    shares[item.level] = Math.floor(item.exact);
    left -= shares[item.level];
  }
  raw
    .filter((item) => counts[item.level] > 0)
    .sort((a, b) => (b.exact % 1) - (a.exact % 1))
    .slice(0, Math.max(0, left))
    .forEach((item) => { shares[item.level] += 1; });
  return { counts, shares, total };
}

/** Окремі тези «що треба знати» з короткого підсумку програми. */
export function knowledgePoints(subject: Subject): string[] {
  return subject.summary
    .replace(/\.$/, "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
}

export function kitMessage(subject: Subject): string {
  return subject.kit.ready
    ? `Привіт! Хочу комплект: ${subject.title}`
    : `Привіт! Повідом, будь ласка, коли буде готовий комплект: ${subject.title}`;
}

export function formatPrice(price: number): string {
  return `${price} ₴`;
}
