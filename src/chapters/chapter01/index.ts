import type { Chapter } from '../../story/types';
import { script, scriptOrder, type LineId } from './script';
import { stages } from './stages';
import { storyboard } from './storyboard';

export const chapter01: Chapter<LineId> = {
  id: 'chapter01',
  number: '01',
  title: 'Where It All Began',
  sequences: {
    A: 'The Beginning',
    B: 'Inside Aster',
    C: 'Arrival on the Moon',
    D: 'The Conversation',
    E: 'The Apollo 11 Flashback',
    F: 'What Remains',
  },
  script,
  scriptOrder,
  stages,
  beats: storyboard,
};
