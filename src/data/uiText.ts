import type { CategoryMeta, DifficultyLevel, Language } from '../types/atlas';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'web-hosting',
    label: { en: 'Web & Hosting', bn: 'ওয়েব ও হোস্টিং' },
    description: {
      en: 'Static publishing, GitHub Pages, custom domains, and clean HTML setups.',
      bn: 'স্ট্যাটিক পাবলিশিং, গিটহাব পেজেস, কাস্টম ডোমেইন এবং সহজ ওয়েব সেটআপ।',
    },
  },
  {
    id: 'digital-safety',
    label: { en: 'Digital Safety', bn: 'ডিজিটাল নিরাপত্তা' },
    description: {
      en: 'Account protection, two-factor authentication, and safe recovery habits.',
      bn: 'অ্যাকাউন্ট সুরক্ষা, টু-ফ্যাক্টর অথেনটিকেশন এবং নিরাপদ রিকভারি অভ্যাস।',
    },
  },
  {
    id: 'productivity',
    label: { en: 'Cloud & Workflow', bn: 'ক্লাউড ও ওয়ার্কফ্লো' },
    description: {
      en: 'Organized folders, file naming rules, and team collaboration basics.',
      bn: 'গোছানো ফোল্ডার কাঠামো, ফাইল নামকরণের নিয়ম এবং সহজ কোলাবোরেশন।',
    },
  },
  {
    id: 'media-optimization',
    label: { en: 'Media & Speed', bn: 'মিডিয়া ও স্পিড' },
    description: {
      en: 'Screenshot compression, WebP conversion, and faster page loading.',
      bn: 'স্ক্রিনশট কমপ্রেশন, WebP ফরম্যাট এবং দ্রুত পেজ লোডিং কৌশল।',
    },
  },
];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, { en: string; bn: string }> = {
  beginner: { en: 'Beginner', bn: 'শুরুর ধাপ' },
  intermediate: { en: 'Intermediate', bn: 'মাঝারি' },
  practical: { en: 'Practical', bn: 'ব্যবহারিক' },
};

export const UI_TEXT = {
  nav: {
    guides: { en: 'Guides', bn: 'গাইডসমূহ' },
    categories: { en: 'Categories', bn: 'ক্যাটাগরি' },
    popular: { en: 'Popular', bn: 'জনপ্রিয়' },
    publishing: { en: 'How It Works', bn: 'আমাদের পদ্ধতি' },
    adminCta: { en: 'Admin Studio', bn: 'অ্যাডমিন স্টুডিও' },
    backToSite: { en: 'View Public Site', bn: 'মূল সাইট দেখুন' },
  },
  hero: {
    kicker: {
      en: 'Bilingual Visual Tutorial Library · English & বাংলা',
      bn: 'দ্বিভাষিক ভিজ্যুয়াল টিউটোরিয়াল লাইব্রেরি · বাংলা ও English',
    },
    title: {
      en: 'Practical step-by-step guides anyone can follow.',
      bn: 'বাস্তব স্ক্রিনশটসহ সহজ ধাপে ধাপে শেখার প্র্যাকটিক্যাল গাইড।',
    },
    subtitle: {
      en: 'Learn digital tools, web publishing, and everyday workflows with real screenshots, common mistake checklists, and instant switching between English and Bangla.',
      bn: 'দৈনন্দিন ডিজিটাল টুল, ওয়েব পাবলিশিং এবং কাজের নিয়ম শিখুন আসল স্ক্রিনশট, সাধারণ ভুলের সমাধান এবং সাথে সাথে বাংলা-ইংরেজি পরিবর্তনের সুবিধাসহ।',
    },
    primaryBtn: { en: 'Explore Guides', bn: 'গাইডগুলো দেখুন' },
    secondaryBtn: { en: 'Open Admin Studio', bn: 'অ্যাডমিন স্টুডিও খুলুন' },
    imageCaption: {
      en: 'Step-by-step bilingual walkthroughs built for clarity on desktop and mobile.',
      bn: 'ডেস্কটপ ও মোবাইলে সহজে পড়ার উপযোগী দ্বিভাষিক টিউটোরিয়াল।',
    },
  },
  stats: {
    totalGuides: { en: 'Published Guides', bn: 'প্রকাশিত গাইড' },
    bilingualReady: { en: 'Bilingual Coverage', bn: 'দ্বিভাষিক কভারেজ' },
    avgReadTime: { en: 'Avg. Guide Length', bn: 'গড় পড়ার সময়' },
    staticHosting: { en: 'Publishing Format', bn: 'পাবলিশিং ফরম্যাট' },
  },
  toolbar: {
    searchPlaceholder: {
      en: 'Search guides, tools, or common mistakes...',
      bn: 'গাইড, টুল বা সাধারণ ভুল লিখে খুঁজুন...',
    },
    allCategories: { en: 'All Categories', bn: 'সব ক্যাটাগরি' },
    sortPopular: { en: 'Popular First', bn: 'জনপ্রিয় আগে' },
    sortLatest: { en: 'Recently Updated', bn: 'সাম্প্রতিক আপডেট' },
    languageLabel: { en: 'Language', bn: 'ভাষা' },
    resultsCount: { en: 'guides shown', bn: 'টি গাইড পাওয়া গেছে' },
    clearFilters: { en: 'Reset filters', bn: 'ফিল্টার রিসেট করুন' },
  },
  sections: {
    popularHeading: { en: 'Most Popular Guides', bn: 'সবচেয়ে জনপ্রিয় গাইড' },
    popularSub: {
      en: 'High-impact tutorials readers bookmark most often.',
      bn: 'পাঠকেরা যে গাইডগুলো সবচেয়ে বেশি ব্যবহার ও বুকমার্ক করেন।',
    },
    categoriesHeading: { en: 'Browse by Topic', bn: 'বিষয় অনুযায়ী খুঁজুন' },
    categoriesSub: {
      en: 'Organized paths designed for beginners learning step by step.',
      bn: 'নতুনদের জন্য ধাপে ধাপে শেখার গোছানো ক্যাটাগরি।',
    },
    catalogHeading: { en: 'Complete Tutorial Directory', bn: 'সম্পূর্ণ টিউটোরিয়াল তালিকা' },
    publishingHeading: {
      en: 'How Every HowToAtlas Guide Is Built',
      bn: 'প্রতিটি HowToAtlas গাইড যেভাবে তৈরি করা হয়',
    },
    publishingSub: {
      en: 'Every tutorial is tested step by step with real screenshots, clear bilingual prose in English and Bangla, and practical fixes for common beginner mistakes.',
      bn: 'প্রতিটি টিউটোরিয়াল আসল স্ক্রিনশট, সহজ বাংলা ও ইংরেজি নির্দেশনা এবং সাধারণ ভুলের বাস্তব সমাধানসহ যাচাই করে প্রকাশ করা হয়।',
    },
  },
  reader: {
    backToAll: { en: 'All Guides', bn: 'সব গাইড' },
    prerequisites: { en: 'Before You Start', bn: 'শুরু করার আগে যা লাগবে' },
    progressLabel: { en: 'Step Completion', bn: 'ধাপ সম্পন্ন' },
    stepsHeading: { en: 'Step-by-Step Walkthrough', bn: 'ধাপে ধাপে নির্দেশিকা' },
    stepWord: { en: 'Step', bn: 'ধাপ' },
    tipLabel: { en: 'Helpful Tip', bn: 'সহায়ক টিপস' },
    zoomHint: { en: 'Click screenshot to enlarge', bn: 'বড় করে দেখতে স্ক্রিনশটে ক্লিক করুন' },
    videoHeading: { en: 'Video Walkthrough', bn: 'ভিডিও নির্দেশিকা' },
    videoWatchLink: { en: 'Open video in new tab', bn: 'নতুন ট্যাবে ভিডিও দেখুন' },
    mistakesHeading: { en: 'Common Mistakes & How to Fix Them', bn: 'সাধারণ ভুল এবং সঠিক সমাধান' },
    mistakeLabel: { en: 'Common Mistake', bn: 'সাধারণ ভুল' },
    fixLabel: { en: 'How to Fix', bn: 'সঠিক সমাধান' },
    relatedHeading: { en: 'Related Guides', bn: 'সম্পর্কিত অন্যান্য গাইড' },
    resetChecklist: { en: 'Reset checklist', bn: 'চেকলিস্ট রিসেট করুন' },
  },
  empty: {
    title: { en: 'No matching guides found', bn: 'মিলে যাওয়া কোনো গাইড পাওয়া যায়নি' },
    description: {
      en: 'Try clearing the search query or switching to All Categories.',
      bn: 'সার্চ টেক্সট মুছে ফেলুন অথবা সব ক্যাটাগরি নির্বাচন করে আবার চেষ্টা করুন।',
    },
  },
  footer: {
    tagline: {
      en: 'Global, beginner-friendly bilingual tutorials hosted cleanly on static JSON.',
      bn: 'সবার জন্য সহজ, বাংলা ও ইংরেজিতে ব্যবহারিক টিউটোরিয়াল প্ল্যাটফর্ম।',
    },
    copyright: {
      en: 'HowToAtlas · Built for GitHub Pages static publishing',
      bn: 'HowToAtlas · GitHub Pages স্ট্যাটিক পাবলিশিংয়ের জন্য নির্মিত',
    },
  },
};

export function t(text: { en: string; bn: string }, lang: Language): string {
  return text[lang] || text.en;
}
