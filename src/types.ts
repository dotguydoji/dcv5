
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  mobileUrl: string;
  desktopUrl: string;
  category: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  brandName: string;
  brandTagline: string;
  hero: {
    mainTitle: string;
    subTitle: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
  socials: {
    facebook: string;
  };
}
