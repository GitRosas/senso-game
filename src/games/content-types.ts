/** Shared shape for each game's localized long-form SEO content. */

export interface FaqItem {
  q: string;
  a: string;
}

export interface GameContentSections {
  /** Short lede shown under the hero and reused as a fallback meta description. */
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  whatItIs: string[];
  howToPlay: string[];
  science: string[];
  scoring: string[];
  tips: string[];
  faq: FaqItem[];
}

export type LocalizedGameContent = Record<'en' | 'pt', GameContentSections>;
