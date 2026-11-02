import { getSubject, type Subject } from "./subjects";

export type SamplePage = {
  image: string;
  thumb: string;
  width: number;
  height: number;
  /** Короткий підпис сторінки для пейджера й мініатюр. */
  label: string;
  alt: string;
};

export type SampleContentsItem = { page: number; title: string };

export type Sample = {
  slug: string;
  subjectId: Subject["id"];
  title: string;
  shortTitle: string;
  description: string;
  lead: string;
  cover: { src: string; width: number; height: number };
  pages: SamplePage[];
  contents: SampleContentsItem[];
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Сторінка прикладу: підпис у пейджері, повна назва й нативний розмір картинки з PDF (ширина × висота, px). */
type PageSpec = { label: string; title: string; size: [width: number, height: number] };

function pagesFromSpecs(dir: string, specs: PageSpec[]): SamplePage[] {
  return specs.map((spec, index) => ({
    image: `${dir}/page-${pad(index + 1)}.webp`,
    thumb: `${dir}/thumbs/page-${pad(index + 1)}.webp`,
    width: spec.size[0],
    height: spec.size[1],
    label: spec.label,
    alt: `Сторінка ${index + 1} з ${specs.length}: ${spec.title}`,
  }));
}

const contentsFromSpecs = (specs: PageSpec[]): SampleContentsItem[] => specs.map((spec, index) => ({ page: index + 1, title: spec.title }));

/*
 * На сайті — лише по одному прикладу на предмет (вибрані сторінки з PDF «Приклад сторінок»).
 * Сторінок із повних файлів комплектів, їхніх перших сторінок і карток-уривків на сайті бути не має.
 * Картинки — нативної якості з PDF (без зменшення), розміри в `size` збігаються з розмірами файлів.
 */

const pedagogySpecs: PageSpec[] = [
  { label: "Титул", title: "Титульна сторінка комплекту «Педагогіка та психологія»", size: [1054, 1492] },
  { label: "1.1", title: "1.1 Педагогіка та психологія у структурі сучасних наук: що охоплює розділ, карта розділу", size: [1086, 1448] },
  { label: "1.1.5–1.1.6", title: "1.1.5–1.1.6 Структура та основні галузі педагогіки й психології", size: [1086, 1448] },
  { label: "3.1.2", title: "3.1.2 Програма дослідження: етапи, гіпотеза, Н0/Н1", size: [1055, 1491] },
  { label: "Завдання", title: "Кейсові завдання до розділу 2.2: 8 кейсів із варіантами відповідей", size: [1055, 1491] },
  { label: "Розбір", title: "Розбір завдань до розділу 2.2: ключі й коротке пояснення", size: [1055, 1491] },
  { label: "4.2.3", title: "4.2.3 Напрями національного виховання: маркери та шкільний кейс", size: [1055, 1491] },
  { label: "4.1.2", title: "4.1.2 Процес навчання: структура, функції, навчання, учіння, научіння", size: [1055, 1491] },
  { label: "1.2.4", title: "1.2.4 Вікова періодизація психічного розвитку", size: [1055, 1491] },
  { label: "3.2.3", title: "3.2.3 Тестування: види тестів, що вимірюють, стандартизованість", size: [1055, 1491] },
];

const pedagogySample: Sample = {
  slug: "pedagogy-pryklad-storinok",
  subjectId: "pedagogy",
  title: "Педагогіка та психологія: приклад сторінок комплекту",
  shortTitle: "10 сторінок прикладу · Педагогіка та психологія",
  description: "Титульна сторінка комплекту «Педагогіка та психологія» і вибрані сторінки: розділи 1.1, 1.2.4, 3.1.2, 3.2.3, 4.1.2, 4.2.3, кейсові завдання та їхній розбір.",
  lead: "Титульна сторінка комплекту та вибрані сторінки з різних файлів: схеми розділів, кейсові завдання з варіантами відповідей і розбір відповідей. Гортай кнопками «Далі» й «Назад» або стрілками на клавіатурі.",
  cover: { src: "/img/cover-pedagogy.webp", width: 640, height: 906 },
  pages: pagesFromSpecs("/materials/pedagogy/demo", pedagogySpecs),
  contents: contentsFromSpecs(pedagogySpecs),
};

const psychologySpecs: PageSpec[] = [
  { label: "Титул", title: "Титульна сторінка комплекту «Психологія та соціологія»", size: [1054, 1492] },
  { label: "1.1", title: "1.1 Психологія та соціологія у структурі сучасних наук: карта розділу", size: [1024, 1536] },
  { label: "1.1.3", title: "1.1.3 Функції соціології: теоретико-пізнавальна, практично-політична, громадянська", size: [1024, 1536] },
  { label: "Шпаргалка 1.1", title: "Підсумок і стратегія до розділу 1.1: міні-шпаргалка", size: [1024, 1536] },
  { label: "1.2.3", title: "1.2.3 Людина, індивід, особистість, індивідуальність", size: [1024, 1536] },
  { label: "2.1.3", title: "2.1.3 Теорія наслідування Габріеля Тарда", size: [1024, 1536] },
  { label: "Шпаргалка 2.2", title: "Міні-шпаргалка до розділу 2.2", size: [1024, 1536] },
  { label: "2.3", title: "2.3 Психологічна та соціологічна думка другої половини XX — початку XXI ст.: карта розділу", size: [1024, 1535] },
  { label: "3.1.2", title: "3.1.2 Гіпотези дослідження: теоретичні, емпіричні, статистичні", size: [1024, 1536] },
  { label: "3.2.6", title: "3.2.6 Аналіз документів. Контент-аналіз", size: [1024, 1536] },
  { label: "Завдання 4.1", title: "Завдання 11–20 до файлу 4.1 з варіантами відповідей", size: [1024, 1536] },
  { label: "Відповіді 4.1", title: "Відповіді до завдань 11–20 файлу 4.1 з поясненнями", size: [1024, 1536] },
];

const psychologySample: Sample = {
  slug: "psychology-pryklad-storinok",
  subjectId: "psychology",
  title: "Психологія та соціологія: приклад сторінок комплекту",
  shortTitle: "12 сторінок прикладу · Психологія та соціологія",
  description: "Титульна сторінка комплекту «Психологія та соціологія» і вибрані сторінки з різних файлів: карти розділів, міні-шпаргалки, завдання й відповіді.",
  lead: "Титульна сторінка комплекту та вибрані сторінки з різних файлів: карти розділів, схеми з міні-кейсами, міні-шпаргалки, завдання й відповіді. Гортай кнопками «Далі» й «Назад» або стрілками на клавіатурі.",
  cover: { src: "/img/cover-psychology.webp", width: 640, height: 906 },
  pages: pagesFromSpecs("/materials/psychology", psychologySpecs),
  contents: contentsFromSpecs(psychologySpecs),
};

const managementSpecs: PageSpec[] = [
  { label: "Титул", title: "Титульна сторінка комплекту «Управління та адміністрування»", size: [1054, 1492] },
  { label: "1.1–1.2", title: "Модуль 1 «Основи менеджменту та планування» (підрозділи 1.1 і 1.2): карта модуля", size: [1024, 1536] },
  { label: "1.3.4", title: "1.3.4 Централізація та децентралізація", size: [1024, 1536] },
  { label: "1.4.4", title: "1.4.4 Теорія набутих потреб Д. Макклелланда", size: [1024, 1536] },
  { label: "1.7.3", title: "1.7.3 Діагностика проблеми — ситуація, симптом і причина", size: [1024, 1536] },
  { label: "2.2.1", title: "2.2.1 Сегментування і вибір цільового сегмента", size: [1024, 1536] },
  { label: "3.7.3", title: "3.7.3 Ефективність трудових ресурсів — виробіток і трудомісткість", size: [1024, 1536] },
  { label: "Завдання", title: "Завдання 1–8: вибери одну правильну відповідь", size: [1024, 1536] },
  { label: "Відповіді", title: "Відповіді до завдань 1–8", size: [1024, 1536] },
  { label: "Підсумок модуля", title: "Підсумок модуля — від ідеї до рішення про запуск", size: [1024, 1536] },
];

const managementSample: Sample = {
  slug: "management-pryklad-storinok",
  subjectId: "management",
  title: "Управління та адміністрування: приклад сторінок комплекту",
  shortTitle: "10 сторінок прикладу · Управління та адміністрування",
  description: "Титульна сторінка комплекту «Управління та адміністрування» і вибрані сторінки: карти модулів і розділів, схеми з міні-кейсами, завдання, відповіді та підсумок модуля.",
  lead: "Титульна сторінка комплекту та сторінки з різних модулів: карта модуля, схеми з пастками, міні-кейсами й тестовими маркерами, завдання з відповідями і підсумок модуля. Гортай кнопками «Далі» й «Назад» або стрілками на клавіатурі.",
  cover: { src: "/img/cover-management.webp", width: 640, height: 906 },
  pages: pagesFromSpecs("/materials/management", managementSpecs),
  contents: contentsFromSpecs(managementSpecs),
};

/** Рівно по одному прикладу на предмет. Порядок — як у `subjects`. */
export const samples: Sample[] = [pedagogySample, psychologySample, managementSample];

export function getSample(slug: string): Sample | undefined {
  return samples.find((sample) => sample.slug === slug);
}

export function samplePathBySlug(slug: string, page = 1): string {
  return page <= 1 ? `/pryklady/${slug}/` : `/pryklady/${slug}/${page}/`;
}

export function samplePath(sample: Sample, page = 1): string {
  return samplePathBySlug(sample.slug, page);
}

/** Приклад предмета. */
export function sampleFor(subject: Subject): Sample | undefined {
  return samples.find((sample) => sample.subjectId === subject.id);
}

/** Сторінки зразка індексуються лише тоді, коли комплект, до якого він належить, готовий. */
export function sampleIsReady(sample: Sample): boolean {
  return Boolean(getSubject(sample.subjectId)?.kit.ready);
}
