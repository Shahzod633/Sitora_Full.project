import type { Chapter } from '../story/types';
import type { AssetId } from '../data/assetManifest';

// The story: three chapters played in order. Chapter data (and each chapter's activities) is loaded on
// demand, so opening the site only downloads Chapter 1.

export type ChapterEntry = {
  id: string;
  number: string;
  title: string;
  /** One line for the chapter list. */
  place: string;
  load: () => Promise<Chapter>;
  /** Art to warm while the reader is on the title screen or the previous chapter's end card. */
  preload: readonly AssetId[];
};

export const chapterList: readonly ChapterEntry[] = [
  {
    id: 'chapter01', number: '01', title: 'Where It All Began', place: 'The Moon',
    load: () => import('./chapter01').then(m => m.chapter01 as Chapter),
    preload: ['spaceStars', 'spaceEarthLimb', 'earth', 'aster', 'asterSpace', 'cockpitWide'],
  },
  {
    id: 'chapter02', number: '02', title: 'The Little Explorer', place: 'Mars · Ares Vallis',
    load: () => import('./chapter02').then(m => m.chapter02 as Chapter),
    preload: ['spaceStars', 'observationDeck', 'observationDeckEli', 'observationDeckMara', 'maraSheet', 'cockpitTwoShot'],
  },
  {
    id: 'chapter03', number: '03', title: 'Those Who Came After', place: 'Mars · the legacy',
    load: () => import('./chapter03').then(m => m.chapter03 as Chapter),
    preload: ['spaceStars', 'marsDigSite', 'sojourner', 'holoSpirit', 'holoCuriosity'],
  },
];

export const chapterIndexFromQuery = () => {
  const value = new URLSearchParams(window.location.search).get('chapter');
  const number = value ? Number.parseInt(value, 10) : NaN;
  return Number.isInteger(number) && number >= 1 && number <= chapterList.length ? number - 1 : undefined;
};
