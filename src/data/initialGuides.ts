import type { AtlasDataset } from '../types/atlas';

export const INITIAL_DATASET: AtlasDataset = {
  version: '1.0.0',
  updatedAt: '2026-11-26',
  guides: [
    {
      id: 'deploy-github-pages',
      slug: 'publish-static-website-github-pages',
      category: 'web-hosting',
      difficulty: 'beginner',
      readTimeMinutes: 6,
      updatedAt: '2026-11-24',
      views: 4820,
      popular: true,
      coverImage: './src/assets/images/guide_github_pages_1795743498387.jpg',
      title: {
        en: 'Publish Your Website on GitHub Pages in 5 Minutes',
        bn: '৫ মিনিটে GitHub Pages-এ নিজের ওয়েবসাইট লাইভ করুন',
      },
      summary: {
        en: 'Turn any HTML, CSS, JavaScript, and JSON folder into a free, fast global website without paying for hosting.',
        bn: 'কোনো হোস্টিং খরচ ছাড়াই আপনার HTML, CSS, JavaScript ও JSON ফাইলগুলোকে ফ্রি ও দ্রুতগতির লাইভ ওয়েবসাইটে রূপান্তর করুন।',
      },
      videoUrl: 'https://www.youtube.com/embed/OltY8WCaP-Q',
      videoTitle: {
        en: 'GitHub Pages Branch Setup & Live URL Walkthrough',
        bn: 'GitHub Pages ব্রাঞ্চ সেটআপ এবং লাইভ লিংক দেখার ভিডিও',
      },
      prerequisites: [
        {
          en: 'A free GitHub account and a repository with your index.html file in the root folder.',
          bn: 'একটি ফ্রি GitHub অ্যাকাউন্ট এবং রুট ফোল্ডারে index.html ফাইলসহ একটি রিপোজিটরি।',
        },
        {
          en: 'Relative file paths (like ./style.css and ./data/guides.json) instead of leading slashes.',
          bn: 'লিডিং স্ল্যাশ (/style.css) এর বদলে রিলেটিভ পাথ (./style.css ও ./data/guides.json) ব্যবহার।',
        },
      ],
      steps: [
        {
          id: 'gh-step-1',
          title: {
            en: 'Open Repository Settings',
            bn: 'রিপোজিটরি সেটিংস (Settings) খুলুন',
          },
          instruction: {
            en: 'Go to your GitHub repository page in the browser and click the Settings tab on the top navigation row. Make sure the repository visibility is set to Public for free hosting.',
            bn: 'ব্রাউজারে আপনার GitHub রিপোজিটরি পেজে যান এবং ওপরের মেনু থেকে Settings ট্যাবে ক্লিক করুন। ফ্রি হোস্টিংয়ের জন্য রিপোজিটরিটি Public রাখা নিশ্চিত করুন।',
          },
          screenshot: './src/assets/images/guide_github_pages_1795743498387.jpg',
          screenshotCaption: {
            en: 'Fig. 1 — Repository settings panel showing branch selection and live deployment preview.',
            bn: 'চিত্র ১ — রিপোজিটরি সেটিংস প্যানেলে ব্রাঞ্চ নির্বাচন এবং লাইভ সাইট প্রিভিউ।',
          },
          tip: {
            en: 'Double check that your main entry file is named exactly index.html in lowercase.',
            bn: 'মূল ফাইলের নাম যেন ছোট হাতের অক্ষরে হুবহু index.html হয় তা যাচাই করে নিন।',
          },
        },
        {
          id: 'gh-step-2',
          title: {
            en: 'Select the Pages Source Branch',
            bn: 'Pages সেকশনে সোর্স ব্রাঞ্চ নির্বাচন করুন',
          },
          instruction: {
            en: 'In the left sidebar under Code and automation, click Pages. Under Build and deployment, keep Source as Deploy from a branch, select main and /(root), then click Save.',
            bn: 'বাম পাশের সাইডবার থেকে Pages অপশনে ক্লিক করুন। Build and deployment অংশে Source হিসেবে Deploy from a branch রেখে main এবং /(root) সিলেক্ট করে Save চাপুন।',
          },
          tip: {
            en: 'If you keep your built static site inside a /docs folder, select /docs instead of /(root).',
            bn: 'আপনি যদি বিল্ড করা ফাইল /docs ফোল্ডারে রাখেন, তবে /(root)-এর বদলে /docs নির্বাচন করুন।',
          },
        },
        {
          id: 'gh-step-3',
          title: {
            en: 'Verify Your Live URL & Relative Assets',
            bn: 'লাইভ URL ও অ্যাসেট লোড হওয়া যাচাই করুন',
          },
          instruction: {
            en: 'Wait 30–60 seconds and refresh the Pages screen. Your live link (username.github.io/project-name/) will appear at the top. Open it and inspect DevTools Network tab to confirm JSON and images load cleanly.',
            bn: '৩০–৬০ সেকেন্ড অপেক্ষা করে পেজটি রিফ্রেশ করুন। ওপরে আপনার লাইভ লিংক চলে আসবে। লিংকটি খুলে নিশ্চিত করুন সব ছবি ও JSON ডেটা সঠিকভাবে লোড হচ্ছে।',
          },
        },
      ],
      commonMistakes: [
        {
          id: 'gh-mistake-1',
          mistake: {
            en: 'Using root-relative paths like /data/guides.json on project pages.',
            bn: 'প্রজেক্ট পেজে /data/guides.json এর মতো লিডিং স্ল্যাশ পাথ ব্যবহার করা।',
          },
          fix: {
            en: 'Use ./data/guides.json so the browser resolves relative to /HowToAtlas/ instead of the domain root.',
            bn: 'সবসময় ./data/guides.json ব্যবহার করুন যাতে ডোমেইন রুটের বদলে /HowToAtlas/ ফোল্ডার থেকে ডেটা লোড হয়।',
          },
        },
        {
          id: 'gh-mistake-2',
          mistake: {
            en: 'Capitalized filenames like Index.html or Image.JPG causing 404 errors.',
            bn: 'Index.html বা Image.JPG এর মতো বড় হাতের অক্ষরের ফাইলের নামে 404 এরর আসা।',
          },
          fix: {
            en: 'GitHub Pages runs on Linux and is case-sensitive. Always keep filenames and links lowercase.',
            bn: 'GitHub Pages লিনাক্স সার্ভারে চলে যেখানে বড়-ছোট অক্ষর আলাদা। তাই ফাইলের নাম ও লিংক ছোট অক্ষরে রাখুন।',
          },
        },
      ],
      relatedIds: ['optimize-screenshots-webp', 'organize-cloud-folders'],
    },
    {
      id: 'enable-two-factor-auth',
      slug: 'set-up-app-based-two-factor-authentication',
      category: 'digital-safety',
      difficulty: 'beginner',
      readTimeMinutes: 5,
      updatedAt: '2026-11-22',
      views: 3940,
      popular: true,
      coverImage: './src/assets/images/guide_two_factor_auth_1795743499765.jpg',
      title: {
        en: 'Set Up App-Based Two-Factor Authentication (2FA) Safely',
        bn: 'অথেনটিকেটর অ্যাপ দিয়ে নিরাপদে Two-Factor Authentication (2FA) চালু করুন',
      },
      summary: {
        en: 'Protect your GitHub, Google, and work accounts with an authenticator app instead of vulnerable SMS codes.',
        bn: 'SMS কোডের ঝুঁকি এড়িয়ে অথেনটিকেটর অ্যাপের মাধ্যমে আপনার GitHub, Google ও কাজের অ্যাকাউন্ট সুরক্ষিত রাখুন।',
      },
      prerequisites: [
        {
          en: 'An authenticator app installed on your phone (Google Authenticator, Aegis, or 2FAS).',
          bn: 'ফোনে যেকোনো একটি অথেনটিকেটর অ্যাপ (Google Authenticator, Aegis বা 2FAS) ইনস্টল করা।',
        },
        {
          en: 'A safe place offline (printed paper or password manager) to store backup recovery codes.',
          bn: 'ব্যাকআপ রিকভারি কোড সংরক্ষণের জন্য একটি নিরাপদ জায়গা বা পাসওয়ার্ড ম্যানেজার।',
        },
      ],
      steps: [
        {
          id: '2fa-step-1',
          title: {
            en: 'Open Account Security & Choose Authenticator App',
            bn: 'অ্যাকাউন্ট সিকিউরিটি থেকে Authenticator App অপশন নিন',
          },
          instruction: {
            en: 'Navigate to your account Security settings and select Two-factor authentication. Choose Authenticator app rather than SMS text messages.',
            bn: 'আপনার অ্যাকাউন্টের Security সেটিংসে গিয়ে Two-factor authentication নির্বাচন করুন। এখানে SMS-এর পরিবর্তে Authenticator app বেছে নিন।',
          },
          screenshot: './src/assets/images/guide_two_factor_auth_1795743499765.jpg',
          screenshotCaption: {
            en: 'Fig. 1 — Scanning the QR code with a mobile authenticator app to generate a 6-digit TOTP code.',
            bn: 'চিত্র ১ — মোবাইল অথেনটিকেটর অ্যাপ দিয়ে QR কোড স্ক্যান করে ৬ ডিজিটের কোড তৈরি করা।',
          },
        },
        {
          id: '2fa-step-2',
          title: {
            en: 'Scan the QR Code & Verify the 6-Digit Code',
            bn: 'QR কোড স্ক্যান করে ৬ ডিজিটের কোড ভেরিফাই করুন',
          },
          instruction: {
            en: 'Open your phone app, tap the + icon, and scan the QR code shown on screen. Type the fresh 6-digit number back into the confirmation field before the timer resets.',
            bn: 'ফোনের অ্যাপ খুলে + বাটনে ট্যাপ করুন এবং স্ক্রিনের QR কোডটি স্ক্যান করুন। টাইমার শেষ হওয়ার আগেই ৬ ডিজিটের কোডটি বসিয়ে ভেরিফাই করুন।',
          },
          tip: {
            en: 'If your phone clock is out of sync, codes may fail. Keep automatic date & time enabled on your phone.',
            bn: 'ফোনের সময় ঠিক না থাকলে কোড কাজ নাও করতে পারে। ফোনে Automatic Date & Time চালু রাখুন।',
          },
        },
        {
          id: '2fa-step-3',
          title: {
            en: 'Download & Store Recovery Codes Immediately',
            bn: 'সাথে সাথে রিকভারি কোড ডাউনলোড করে রাখুন',
          },
          instruction: {
            en: 'Right after enabling 2FA, the site displays 8–16 single-use recovery codes. Download them and store a copy outside the phone that holds your authenticator.',
            bn: '2FA চালু হওয়ার সাথে সাথেই কিছু ওয়ান-টাইম রিকভারি কোড দেখানো হবে। এগুলো ডাউনলোড করে ফোনের বাইরে নিরাপদ কোথাও সংরক্ষণ করুন।',
          },
        },
      ],
      commonMistakes: [
        {
          id: '2fa-mistake-1',
          mistake: {
            en: 'Saving recovery codes only inside the same phone or account you are locking.',
            bn: 'যে অ্যাকাউন্ট বা ফোনে 2FA চালু করছেন, শুধু সেখানেই রিকভারি কোড রেখে দেওয়া।',
          },
          fix: {
            en: 'If you lose your phone, you lose access to both. Store recovery codes in an encrypted backup or printed sheet.',
            bn: 'ফোন হারিয়ে গেলে অ্যাকাউন্টও আটকে যাবে। তাই ব্যাকআপ কোড প্রিন্ট করে বা আলাদা নিরাপদ ড্রাইভে রাখুন।',
          },
        },
      ],
      relatedIds: ['deploy-github-pages', 'organize-cloud-folders'],
    },
    {
      id: 'organize-cloud-folders',
      slug: 'clean-cloud-folder-structure-naming-system',
      category: 'productivity',
      difficulty: 'practical',
      readTimeMinutes: 4,
      updatedAt: '2026-11-20',
      views: 2650,
      popular: true,
      coverImage: './src/assets/images/guide_cloud_storage_1795743499050.jpg',
      title: {
        en: 'Organize Cloud Folders & File Names So You Never Lose Work',
        bn: 'ক্লাউড ফোল্ডার ও ফাইল নামকরণের স্মার্ট নিয়ম যাতে কোনো কাজ না হারায়',
      },
      summary: {
        en: 'A simple numbered directory structure and date-first naming pattern that works across Google Drive, Dropbox, and local projects.',
        bn: 'সহজ নম্বরযুক্ত ফোল্ডার কাঠামো এবং তারিখ-ভিত্তিক ফাইল নামকরণের নিয়ম যা Google Drive, Dropbox বা লোকাল কম্পিউটারে দারুণ কাজ করে।',
      },
      prerequisites: [
        {
          en: 'Access to your main cloud drive or local project workspace.',
          bn: 'আপনার ক্লাউড ড্রাইভ অথবা কম্পিউটারের প্রজেক্ট ফোল্ডারে অ্যাক্সেস।',
        },
      ],
      steps: [
        {
          id: 'cloud-step-1',
          title: {
            en: 'Create 5 Numbered Top-Level Folders',
            bn: 'প্রধান ৫টি নম্বরযুক্ত ফোল্ডার তৈরি করুন',
          },
          instruction: {
            en: 'Prefix top-level folders with 01_ to 05_ (such as 01_Inbox, 02_Active_Projects, 03_Assets, 04_Reference, 05_Archive). Numbering keeps folders in workflow order instead of alphabetical chaos.',
            bn: 'মূল ফোল্ডারগুলোর শুরুতে 01_ থেকে 05_ যোগ করুন (যেমন 01_Inbox, 02_Active_Projects, 03_Assets, 04_Reference, 05_Archive)। এতে ফোল্ডারগুলো কাজের ক্রম অনুযায়ী সাজানো থাকবে।',
          },
          screenshot: './src/assets/images/guide_cloud_storage_1795743499050.jpg',
          screenshotCaption: {
            en: 'Fig. 1 — Numbered project subfolders separating prototypes, assets, documentation, and final builds.',
            bn: 'চিত্র ১ — প্রোটোটাইপ, অ্যাসেট, ডকুমেন্টেশন এবং ফাইনাল বিল্ড আলাদা রাখতে নম্বরযুক্ত সাব-ফোল্ডার।',
          },
        },
        {
          id: 'cloud-step-2',
          title: {
            en: 'Use YYYY-MM-DD_topic_v01 Naming',
            bn: 'YYYY-MM-DD_topic_v01 ফরম্যাটে ফাইলের নাম লিখুন',
          },
          instruction: {
            en: 'Avoid names like final_v2_really_final.pdf. Start filenames with ISO dates (2026-11-26) followed by lowercase words separated by underscores or hyphens.',
            bn: 'final_v2_final.pdf ধরনের নাম বাদ দিয়ে শুরুতে তারিখ (2026-11-26) ও ছোট অক্ষরে সহজ নাম ব্যবহার করুন। এতে ফাইলের নতুন ও পুরোনো ভার্সন সহজে চেনা যায়।',
          },
          tip: {
            en: 'Never use spaces or special characters in web project filenames—stick to hyphens or underscores.',
            bn: 'ওয়েব প্রজেক্টের ফাইলের নামে কখনো স্পেস বা বিশেষ চিহ্ন ব্যবহার করবেন না—হাইফেন (-) বা আন্ডারস্কোর (_) ব্যবহার করুন।',
          },
        },
      ],
      commonMistakes: [
        {
          id: 'cloud-mistake-1',
          mistake: {
            en: 'Nesting folders 7–8 levels deep just to categorize tiny files.',
            bn: 'ছোট ছোট ফাইলের জন্য ৭–৮ স্তর গভীর সাব-ফোল্ডার তৈরি করা।',
          },
          fix: {
            en: 'Keep folder depth to a maximum of 3 levels and rely on descriptive filenames + search.',
            bn: 'সর্বোচ্চ ৩ স্তর পর্যন্ত ফোল্ডার রাখুন এবং ভালো ফাইল নাম ও সার্চ ব্যবহার করুন।',
          },
        },
      ],
      relatedIds: ['deploy-github-pages', 'optimize-screenshots-webp'],
    },
    {
      id: 'optimize-screenshots-webp',
      slug: 'compress-tutorial-screenshots-webp-fast-loading',
      category: 'media-optimization',
      difficulty: 'intermediate',
      readTimeMinutes: 5,
      updatedAt: '2026-11-18',
      views: 2190,
      popular: false,
      coverImage: './src/assets/images/guide_web_performance_1795743498746.jpg',
      title: {
        en: 'Compress Tutorial Screenshots & Convert to WebP Without Blur',
        bn: 'ছবির মান নষ্ট না করে টিউটোরিয়াল স্ক্রিনশট কমপ্রেস ও WebP করুন',
      },
      summary: {
        en: 'Shrink 4 MB screenshots down to under 180 KB while keeping UI text razor-sharp for mobile and slow connections.',
        bn: 'মোবাইল ও ধীরগতির ইন্টারনেটে দ্রুত লোড হওয়ার জন্য ৪ মেগাবাইটের স্ক্রিনশটকে লেখা ঝাপসা না করে ১৮০ কিলোবাইটের নিচে নিয়ে আসুন।',
      },
      prerequisites: [
        {
          en: 'Your captured PNG or JPEG screenshots ready in an assets folder.',
          bn: 'আপনার তোলা PNG বা JPEG স্ক্রিনশটগুলো একটি ফোল্ডারে প্রস্তুত থাকা।',
        },
      ],
      steps: [
        {
          id: 'img-step-1',
          title: {
            en: 'Resize Width Before Compressing',
            bn: 'কমপ্রেস করার আগে ছবির প্রস্থ (Width) ঠিক করুন',
          },
          instruction: {
            en: 'Most tutorials display screenshots inside a 720px–960px column. Resize oversized 3840px retina captures down to 1400px–1600px wide before saving.',
            bn: 'বেশিরভাগ টিউটোরিয়ালে ছবি ৭২০–৯৬০ পিক্সেলের মধ্যে দেখানো হয়। তাই ৩৮৪০ পিক্সেলের বিশাল ছবিকে আগে ১৪০০–১৬০০ পিক্সেল প্রস্থে রিসাইজ করে নিন।',
          },
          screenshot: './src/assets/images/guide_web_performance_1795743498746.jpg',
          screenshotCaption: {
            en: 'Fig. 1 — Comparing original file weight against an 88% lighter WebP output at 75% quality.',
            bn: 'চিত্র ১ — আসল ছবির সাইজের সাথে ৮৮% হালকা WebP আউটপুটের তুলনা।',
          },
        },
        {
          id: 'img-step-2',
          title: {
            en: 'Export as WebP at 75–82% Quality',
            bn: '৭৫–৮২% কোয়ালিটিতে WebP হিসেবে সেভ করুন',
          },
          instruction: {
            en: 'Use Squoosh.app or a local CLI converter to save as WebP at quality 80. Zoom in to 100% and verify small UI buttons and menu text remain crisp.',
            bn: 'Squoosh.app বা যেকোনো কনভার্টার দিয়ে ৮০% কোয়ালিটিতে WebP ফরম্যাটে সেভ করুন। ১০০% জুম করে দেখে নিন বাটন ও মেনুর লেখাগুলো স্পষ্ট আছে কি না।',
          },
          tip: {
            en: 'Always add width, height, and loading="lazy" attributes on step screenshots below the fold.',
            bn: 'নিচের ধাপগুলোর স্ক্রিনশটে সবসময় loading="lazy" ব্যবহার করলে প্রথম পেজ আরও দ্রুত ওপেন হয়।',
          },
        },
      ],
      commonMistakes: [
        {
          id: 'img-mistake-1',
          mistake: {
            en: 'Over-compressing text-heavy UI screenshots below 50% quality.',
            bn: 'বেশি লেখাযুক্ত স্ক্রিনশটকে ৫০%-এর নিচে কমপ্রেস করে ফেলা।',
          },
          fix: {
            en: 'Keep UI screenshots at 75–85% WebP quality or use lossless WebP for sharp small text.',
            bn: 'লেখা স্পষ্ট রাখতে ৭৫–৮৫% কোয়ালিটি বজায় রাখুন অথবা ছোট টেক্সটের জন্য লসলেস WebP ব্যবহার করুন।',
          },
        },
      ],
      relatedIds: ['deploy-github-pages', 'organize-cloud-folders'],
    },
  ],
};
