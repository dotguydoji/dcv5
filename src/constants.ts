
import { Product, FAQItem, SiteContent } from './types';

/**
 * EDIT THIS SECTION TO CHANGE GLOBAL SITE TEXT
 */
export const SITE_CONTENT: SiteContent = {
  brandName: "DC NOTES",
  brandTagline: "Notes",
  hero: {
    mainTitle: "Simple at Madaling Intindihin.",
    subTitle: "DC NOTES / TECHNICAL LIBRARY"
  },
  footer: {
    description: "Easy-to-understand documentation made for beginners. Learn concepts step by step with clear explanations and helpful visuals.",
    copyright: "© 2026 DC NOTES. ALL RIGHTS RESERVED."
  },
  socials: {
    facebook: "https://facebook.com/dojicreates"
  }
};

/**
 * EDIT THIS SECTION TO MANAGE PRODUCT CATEGORIES (Order matters)
 */
export const CATEGORIES = [
  'Programming Languages',
  'Programming Language Activities'
  // 'Web Development',
  // 'Tools'
];

/**
 * EDIT THIS SECTION TO MANAGE ALL STORE ITEMS
 */
export const PRODUCTS: Product[] = [
  // Programming Languages
  {
    id: 'pl-c',
    title: 'C Programming Notes For Beginners',
    description: 'A clear and practical introduction to C programming, perfect for students who want to master logic, memory handling, and core programming fundamentals from the ground up.',
    price: 75,
    thumbnail: '/images/c-fun.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Languages'
  },
  {
    id: 'pl-cpp',
    title: 'C++ Notes For Beginners',
    description: 'Step-by-step C++ lessons designed to build strong coding foundations, covering syntax, problem solving, and object-oriented concepts in a simple and easy-to-follow format.',
    price: 75,
    thumbnail: '/images/cpp-fun.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Languages'
  },
  {
    id: 'pl-csharp',
    title: 'C# Notes For Beginners',
    description: 'A beginner-friendly guide to C# that simplifies object-oriented programming and prepares you for building modern desktop, web, and enterprise applications.',
    price: 75,
    thumbnail: '/images/csharp-fun.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Languages'
  },
  {
    id: 'pl-python',
    title: 'Python Notes For Beginners',
    description: 'Learn Python the easy way with simple explanations, practical examples, and beginner-friendly lessons ideal for automation, data analysis, and real-world projects.',
    price: 75,
    thumbnail: '/images/py-fun.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Languages'
  },
  {
    id: 'pl-java',
    title: 'Java Notes For Beginners',
    description: 'A structured Java guide that helps you understand object-oriented programming, build strong coding habits, and prepare for academic or professional development.',
    price: 75,
    thumbnail: '/images/java-fun.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Languages'
  },
  // {
  //   id: 'pl-javascript',
  //   title: 'JavaScript Notes For Beginners',
  //   description: 'Master the fundamentals of JavaScript with easy-to-understand lessons that help you build interactive websites and start your journey into web development.',
  //   price: 75,
  //   thumbnail: '/images/c-fun.png',
  //   mobileUrl: 'https://m.me/103186496068437',
  //   desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
  //   category: 'Programming Languages'
  // },

  // Programming Language Activities
  {
    id: 'pla-c',
    title: 'C Activities (Beginners)',
    description: 'Practice essential C programming concepts through structured exercises designed to strengthen logic, syntax, and problem-solving skills.',
    price: 75,
    thumbnail: '/images/c-act.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Language Activities'
  },
  {
    id: 'pla-cpp',
    title: 'C++ Activities (Beginners)',
    description: 'Hands-on C++ exercises that reinforce core concepts, improve coding confidence, and help beginners master object-oriented thinking.',
    price: 75,
    thumbnail: '/images/cpp-act.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Language Activities'
  },
  {
    id: 'pla-csharp',
    title: 'C# Activities (Beginners)',
    description: 'A collection of beginner-friendly C# programming tasks that build strong logical thinking and prepare students for real application development.',
    price: 75,
    thumbnail: '/images/csharp-act.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Language Activities'
  },
  {
    id: 'pla-python',
    title: 'Python Activities (Beginners)',
    description: 'Simple yet effective Python exercises that help you practice coding fundamentals and build confidence through guided problem-solving.',
    price: 75,
    thumbnail: '/images/py-act.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Language Activities'
  },
  {
    id: 'pla-java',
    title: 'Java Activities (Beginners)',
    description: 'Step-by-step Java programming activities that strengthen your understanding of object-oriented concepts and core programming logic.',
    price: 75,
    thumbnail: '/images/java-act.png',
    mobileUrl: 'https://m.me/103186496068437',
    desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
    category: 'Programming Language Activities'
  },
//   {
//     id: 'pla-javascript',
//     title: 'JavaScript Activities (Beginners)',
//     description: 'Interactive JavaScript exercises designed to improve coding skills and help beginners create dynamic and responsive web features.',
//     price: 75,
//     thumbnail: '/images/c-fun.png',
//     mobileUrl: 'https://m.me/103186496068437',
//     desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
//     category: 'Programming Language Activities'
//   },

// // Web Development
// {
//   id: 'wd-html',
//   title: 'HTML Notes For Beginners',
//   description: 'Learn how to build clean, well-structured web pages using simple and practical HTML lessons designed for absolute beginners.',
//   price: 75,
//   thumbnail: '/images/c-fun.png',
//   mobileUrl: 'https://m.me/103186496068437',
//   desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
//   category: 'Web Development'
// },
// {
//   id: 'wd-css',
//   title: 'CSS Notes For Beginners',
//   description: 'Understand modern web styling with easy-to-follow CSS lessons that teach layouts, colors, spacing, and responsive design.',
//   price: 75,
//   thumbnail: '/images/c-fun.png',
//   mobileUrl: 'https://m.me/103186496068437',
//   desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
//   category: 'Web Development'
// },
// {
//   id: 'wd-js',
//   title: 'JavaScript Notes For Beginners',
//   description: 'Start building interactive websites with beginner-friendly JavaScript lessons that explain logic, events, and core web scripting concepts.',
//   price: 75,
//   thumbnail: '/images/c-fun.png',
//   mobileUrl: 'https://m.me/103186496068437',
//   desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
//   category: 'Web Development'
// },


// // Tools
// {
//   id: 't-vscode',
//   title: 'VS Code Notes For Beginners',
//   description: 'Learn how to use Visual Studio Code efficiently with essential shortcuts, extensions, and setup tips that make coding faster and more productive.',
//   price: 75,
//   thumbnail: '/images/c-fun.png',
//   mobileUrl: 'https://m.me/103186496068437',
//   desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
//   category: 'Tools'
// },
// {
//   id: 't-github',
//   title: 'GitHub Notes For Beginners',
//   description: 'A simple and practical guide to GitHub that teaches version control, repositories, commits, and collaboration the easy way.',
//   price: 75,
//   thumbnail: '/images/c-fun.png',
//   mobileUrl: 'https://m.me/103186496068437',
//   desktopUrl: 'https://www.facebook.com/share/p/1Cj2obyjSU/',
//   category: 'Tools'
// }

];

/**
 * EDIT THIS SECTION TO MANAGE THE FAQ
 */
export const FAQS: FAQItem[] = [
  {
    question: "What format are the notes in?",
    answer: "The notes are in high-quality PDF format. They can be accessed anytime on your laptop, tablet, or phone."
  },
  {
    question: "How will I receive the PDF notes after payment?",
    answer: "After completing your payment, you will be sent an access link via email where you can view your PDF notes instantly and securely."
  },
  {
    question: "Are these notes suitable for absolute beginners?",
    answer: "Yes! The notes are designed for absolute beginners and progress up to mastery level. The explanations you hear on YouTube are the same style I use inside the PDF, but the notes go deeper, with more details, examples, and expanded topics to make sure you fully understand."
  },
  {
    question: "Is this a one-time payment?",
    answer: "Yes, it’s a one-time payment with lifetime access. No hidden charges or subscriptions."
  },
  {
    question: "How often are the notes updated?",
    answer: "The notes are regularly updated. Whenever we upload a new tutorial on YouTube, we also update the PDF notes so your material stays fresh and relevant."
  }
];
