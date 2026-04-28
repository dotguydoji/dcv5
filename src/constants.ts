import { FAQItem, Product, ProductLanguage, ProductLevel, SiteContent } from './types';

const MOBILE_URL = 'https://m.me/103186496068437';
const DESKTOP_URL = 'https://www.facebook.com/share/p/18DmuzbFKk/';

const PROGRAMMING_LANGUAGES_CATEGORY = 'Programming Languages';
const PROGRAMMING_LANGUAGE_PACKAGES_CATEGORY = 'Programming Language Packages';
const WEB_DEVELOPMENT_CATEGORY = 'Web Development';
const TOOLS_CATEGORY = 'Tools';
const FRAMEWORKS_CATEGORY = 'Frameworks';
const AI_MODULES_CATEGORY = 'AI Modules';

const LANGUAGE_FILE_SEGMENT: Record<ProductLanguage, 'english' | 'tagalog'> = {
  en: 'english',
  tl: 'tagalog'
};

type ProgrammingLanguageKey = 'c' | 'cpp' | 'csharp' | 'java' | 'javascript' | 'python';
type WebDevelopmentKey = 'html' | 'css' | 'jsdom' | 'package';
type AIItemKey = 'machine-learning' | 'natural-language-processing' | 'deep-learning';

interface ProgrammingLanguageMeta {
  itemKey: ProgrammingLanguageKey;
  name: string;
}

interface ProgrammingLevelMeta {
  key: ProductLevel;
  label: string;
  folder: string;
  fileSuffix: string;
  price: Partial<Record<ProductLanguage, number>>;
  available: boolean;
}

interface WebDevelopmentMeta {
  itemKey: WebDevelopmentKey;
  title: string;
  fileStem: string;
  description: Record<ProductLanguage, string>;
  price: Record<ProductLanguage, number>;
}

interface AIItemMeta {
  itemKey: AIItemKey;
  title: string;
  description: Record<ProductLanguage, string>;
}

/**
 * EDIT THIS SECTION TO CHANGE GLOBAL SITE TEXT
 */
export const SITE_CONTENT: SiteContent = {
  brandName: 'DC NOTES',
  brandTagline: 'Notes',
  hero: {
    mainTitle: 'Simple at Madaling Intindihin.',
    subTitle: 'DC NOTES / TECHNICAL LIBRARY'
  },
  footer: {
    description:
      'Easy-to-understand documentation made for beginners. Learn concepts step by step with clear explanations and helpful visuals.',
    copyright: '(c) 2026 DC NOTES. ALL RIGHTS RESERVED.'
  },
  socials: {
    facebook: 'https://facebook.com/dojicreates'
  }
};

/**
 * EDIT THIS SECTION TO MANAGE PRODUCT CATEGORIES (Order matters)
 */
export const CATEGORIES = [
  PROGRAMMING_LANGUAGES_CATEGORY,
  PROGRAMMING_LANGUAGE_PACKAGES_CATEGORY,
  WEB_DEVELOPMENT_CATEGORY,
  TOOLS_CATEGORY,
  FRAMEWORKS_CATEGORY,
  AI_MODULES_CATEGORY
];

const PROGRAMMING_LANGUAGES: readonly ProgrammingLanguageMeta[] = [
  { itemKey: 'c', name: 'C' },
  { itemKey: 'cpp', name: 'C++' },
  { itemKey: 'csharp', name: 'C#' },
  { itemKey: 'java', name: 'Java' },
  { itemKey: 'javascript', name: 'JavaScript' },
  { itemKey: 'python', name: 'Python' }
];

const PROGRAMMING_LEVELS: readonly ProgrammingLevelMeta[] = [
  {
    key: 'beginner',
    label: 'Beginner',
    folder: 'programming-languages-beginners',
    fileSuffix: 'beginners',
    price: { en: 99, tl: 120 },
    available: true
  },
  {
    key: 'intermediate',
    label: 'Intermediate',
    folder: 'programming-languages-intermediate',
    fileSuffix: 'intermediate',
    price: { en: 149, tl: 170 },
    available: true
  },
  {
    key: 'advanced',
    label: 'Advanced',
    folder: 'programming-languages-advanced',
    fileSuffix: 'advanced',
    price: { en: 199, tl: 220 },
    available: true
  },
  {
    key: 'build-phase',
    label: 'Build Phase',
    folder: 'programming-languages-buildphase',
    fileSuffix: 'buildphase',
    price: {},
    available: false
  },
  {
    key: 'activities',
    label: 'Activities',
    folder: 'programming-languages-activities',
    fileSuffix: 'activities',
    price: { en: 99, tl: 119 },
    available: true
  }
];

const WEB_DEVELOPMENT_ITEMS: readonly WebDevelopmentMeta[] = [
  {
    itemKey: 'html',
    title: 'HTML',
    fileStem: 'html',
    description: {
      en: 'Structured HTML lessons focused on semantic layout, clean markup, and solid page-building fundamentals.',
      tl: 'Tagalog HTML lessons na nakatuon sa semantic layout, malinaw na markup, at matibay na page-building fundamentals.'
    },
    price: { en: 199, tl: 220 }
  },
  {
    itemKey: 'css',
    title: 'CSS',
    fileStem: 'css',
    description: {
      en: 'Modern CSS coverage for responsive layout, spacing systems, components, and polished visual styling.',
      tl: 'Tagalog CSS coverage para sa responsive layout, spacing systems, components, at mas maayos na visual styling.'
    },
    price: { en: 299, tl: 320 }
  },
  {
    itemKey: 'jsdom',
    title: 'JSDOM',
    fileStem: 'jsdom',
    description: {
      en: 'JavaScript DOM lessons that focus on events, interactivity, and the practical logic behind dynamic interfaces.',
      tl: 'Tagalog JavaScript DOM lessons na nakatuon sa events, interactivity, at praktikal na logic sa likod ng dynamic interfaces.'
    },
    price: { en: 399, tl: 420 }
  },
  {
    itemKey: 'package',
    title: 'Web Development Package',
    fileStem: 'package',
    description: {
      en: 'A bundled web development package covering HTML, CSS, and JavaScript DOM material in one collection.',
      tl: 'Isang bundled web development package na sakop ang HTML, CSS, at JavaScript DOM material sa iisang collection.'
    },
    price: { en: 799, tl: 820 }
  }
];

const AI_ITEMS: readonly AIItemMeta[] = [
  {
    itemKey: 'machine-learning',
    title: 'Machine Learning Fundamentals',
    description: {
      en: 'Introduction to machine learning concepts, algorithms, and practical examples for beginners.',
      tl: 'Introduksyon sa machine learning concepts, algorithms, at praktikal na mga halimbawa para sa beginners.'
    }
  },
  {
    itemKey: 'natural-language-processing',
    title: 'Natural Language Processing',
    description: {
      en: 'Core NLP topics including preprocessing, tokenization, and beginner-friendly language applications.',
      tl: 'Mga pangunahing NLP topics kabilang ang preprocessing, tokenization, at beginner-friendly na language applications.'
    }
  },
  {
    itemKey: 'deep-learning',
    title: 'Deep Learning Essentials',
    description: {
      en: 'Foundational deep learning material covering neural networks, model intuition, and practical use cases.',
      tl: 'Foundational deep learning material na sakop ang neural networks, model intuition, at praktikal na use cases.'
    }
  }
];

const AI_FALLBACK_THUMBNAIL = '/web-app-manifest-512x512.png';

type ProductSeed = Omit<Product, 'mobileUrl' | 'desktopUrl'>;

const createProduct = (product: ProductSeed): Product => ({
  mobileUrl: MOBILE_URL,
  desktopUrl: DESKTOP_URL,
  available: true,
  ...product
});

const getProgrammingLanguageTitle = (languageName: string, level: ProductLevel) => {
  switch (level) {
    case 'activities':
      return `${languageName} Activities`;
    case 'build-phase':
      return `${languageName} Build Phase`;
    case 'beginner':
      return `${languageName} for Beginners`;
    case 'intermediate':
      return `${languageName} for Intermediate`;
    case 'advanced':
      return `${languageName} for Advanced`;
    default:
      return languageName;
  }
};

const getProgrammingLanguageDescription = (
  languageName: string,
  level: ProductLevel,
  language: ProductLanguage
) => {
  if (level === 'build-phase') {
    return language === 'tl'
      ? `Ang ${languageName} Build Phase ay inihahanda pa at magiging available soon.`
      : `${languageName} Build Phase is still being prepared and will be available soon.`;
  }

  if (level === 'activities') {
    return language === 'tl'
      ? `Practice-focused na ${languageName} activities na ginawa para mapalakas ang logic, syntax, at hands-on problem solving.`
      : `Practice-focused ${languageName} activities designed to strengthen logic, syntax, and hands-on problem solving.`;
  }

  if (level === 'intermediate') {
    return language === 'tl'
      ? `Intermediate ${languageName} lessons na mas malalim ang examples, structure, at real coding workflows.`
      : `Intermediate ${languageName} lessons with deeper examples, stronger structure, and more practical coding workflows.`;
  }

  if (level === 'advanced') {
    return language === 'tl'
      ? `Advanced ${languageName} material para sa mas mataas na concepts, mas malalim na techniques, at mas seryosong development work.`
      : `Advanced ${languageName} material for higher-level concepts, deeper techniques, and more serious development work.`;
  }

  return language === 'tl'
    ? `Beginner-friendly na ${languageName} notes na may step-by-step lessons, malinaw na examples, at praktikal na exercises.`
    : `Beginner-friendly ${languageName} notes with step-by-step lessons, clear examples, and practical exercises.`;
};

const getProgrammingLanguageThumbnail = (
  itemKey: ProgrammingLanguageKey,
  level: ProgrammingLevelMeta,
  language: ProductLanguage
) => `/images/${level.folder}/${itemKey}-${level.fileSuffix}-${LANGUAGE_FILE_SEGMENT[language]}.png`;

const getProgrammingLanguagePackageThumbnail = (
  itemKey: ProgrammingLanguageKey,
  language: ProductLanguage
) => `/images/programming-languages-packages/${itemKey}-package-${LANGUAGE_FILE_SEGMENT[language]}.png`;

const getWebDevelopmentThumbnail = (fileStem: string, language: ProductLanguage) =>
  `/images/wevdevelopment/${fileStem}-webdevelopment-${LANGUAGE_FILE_SEGMENT[language]}.png`;

const programmingLanguageProducts = PROGRAMMING_LEVELS.flatMap((level) =>
  PROGRAMMING_LANGUAGES.flatMap((languageMeta) =>
    (['en', 'tl'] as const).map((language) =>
      createProduct({
        id: `pl-${languageMeta.itemKey}-${level.key}-${language}`,
        itemKey: languageMeta.itemKey,
        title: getProgrammingLanguageTitle(languageMeta.name, level.key),
        description: getProgrammingLanguageDescription(languageMeta.name, level.key, language),
        price: level.price[language] ?? 0,
        thumbnail: getProgrammingLanguageThumbnail(languageMeta.itemKey, level, language),
        category: PROGRAMMING_LANGUAGES_CATEGORY,
        language,
        level: level.key,
        available: level.available
      })
    )
  )
);

const programmingLanguagePackageProducts = PROGRAMMING_LANGUAGES.flatMap((languageMeta) =>
  (['en', 'tl'] as const).map((language) =>
    createProduct({
      id: `pl-package-${languageMeta.itemKey}-${language}`,
      itemKey: languageMeta.itemKey,
      title: `${languageMeta.name} Package`,
      description:
        language === 'tl'
          ? `Bundled ${languageMeta.name} package sa Tagalog version para sa mas kumpletong learning set.`
          : `Bundled ${languageMeta.name} package in the English version for a more complete learning set.`,
      price: language === 'tl' ? 500 : 400,
      thumbnail: getProgrammingLanguagePackageThumbnail(languageMeta.itemKey, language),
      category: PROGRAMMING_LANGUAGE_PACKAGES_CATEGORY,
      language
    })
  )
);

const webDevelopmentProducts = WEB_DEVELOPMENT_ITEMS.flatMap((item) =>
  (['en', 'tl'] as const).map((language) =>
    createProduct({
      id: `wd-${item.itemKey}-${language}`,
      itemKey: item.itemKey,
      title: item.title,
      description: item.description[language],
      price: item.price[language],
      thumbnail: getWebDevelopmentThumbnail(item.fileStem, language),
      category: WEB_DEVELOPMENT_CATEGORY,
      language
    })
  )
);

const aiProducts = AI_ITEMS.flatMap((item) =>
  (['en', 'tl'] as const).map((language) =>
    createProduct({
      id: `ai-${item.itemKey}-${language}`,
      itemKey: item.itemKey,
      title: item.title,
      description: item.description[language],
      price: 75,
      thumbnail: AI_FALLBACK_THUMBNAIL,
      category: AI_MODULES_CATEGORY,
      language
    })
  )
);

/**
 * EDIT THIS SECTION TO MANAGE ALL STORE ITEMS
 */
export const PRODUCTS: Product[] = [
  ...programmingLanguageProducts,
  ...programmingLanguagePackageProducts,
  ...webDevelopmentProducts,
  ...aiProducts
];

/**
 * EDIT THIS SECTION TO MANAGE THE FAQ
 */
export const FAQS: FAQItem[] = [
  {
    question: 'What format are the notes in?',
    answer: 'The notes are in high-quality PDF format. They can be accessed anytime on your laptop, tablet, or phone.'
  },
  {
    question: 'How will I receive the PDF notes after payment?',
    answer: 'After completing your payment, you will be sent an access link via email where you can view your PDF notes instantly and securely.'
  },
  {
    question: 'Are these notes suitable for absolute beginners?',
    answer:
      'Yes! The notes are designed for absolute beginners and progress up to mastery level. The explanations you hear on YouTube are the same style I use inside the PDF, but the notes go deeper, with more details, examples, and expanded topics to make sure you fully understand.'
  },
  {
    question: 'Is this a one-time payment?',
    answer: 'Yes, it is a one-time payment with lifetime access. No hidden charges or subscriptions.'
  },
  {
    question: 'How often are the notes updated?',
    answer:
      'The notes are regularly updated. Whenever we upload a new tutorial on YouTube, we also update the PDF notes so your material stays fresh and relevant.'
  }
];
