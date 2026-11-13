import type { ScriptLine } from '../../story/types';

// Every spoken line of the Chapter 1 screenplay (Demo_chapter1.txt), verbatim and in order.
// Beats reference lines by id; validateChapter() checks each line appears exactly once, in this order.
// `expression` is the speaker's expression for the line (portrait, stage figure, Pip's face screen).

export const scriptOrder = [
  'eli-coffee',
  'mara-preparation',
  'eli-priorities',
  'pip-caffeine',
  'eli-dont-start',
  'pip-disabling-concern',
  'mara-really-apollo',
  'eli-hundred-years',
  'pip-object-identified',
  'eli-historical-artifact',
  'pip-old-equipment',
  'mara-exactly',
  'pip-humans-strange',
  'mara-never-imagined',
  'eli-neither-can-we',
  'pip-still-important',
  'eli-exactly',
  'pip-saving-memory',
] as const;

export type LineId = (typeof scriptOrder)[number];

export const script: Record<LineId, ScriptLine<LineId>> = {
  // Scene 1 — The Journey to the Moon
  'eli-coffee': { id: 'eli-coffee', speaker: 'eli', expression: 'sarcastic',
    text: "We're going all the way to Mars, and I still don't know if they have decent coffee there." },
  'mara-preparation': { id: 'mara-preparation', speaker: 'mara', expression: 'wry',
    text: "Six years of preparation, and you're worried about coffee?" },
  'eli-priorities': { id: 'eli-priorities', speaker: 'eli', expression: 'grin',
    text: 'Everyone has their priorities.' },
  'pip-caffeine': { id: 'pip-caffeine', speaker: 'pip', expression: 'analyzing',
    text: 'According to medical research, excessive caffeine consumption can—' },
  'eli-dont-start': { id: 'eli-dont-start', speaker: 'eli', expression: 'exasperated',
    text: "Pip, don't start." },
  'pip-disabling-concern': { id: 'pip-disabling-concern', speaker: 'pip', expression: 'deadpan',
    text: 'Understood. Disabling concern for your health.' },

  // Scene 2 — The Legacy of Apollo
  'mara-really-apollo': { id: 'mara-really-apollo', speaker: 'mara', expression: 'surprised',
    text: 'Is that really Apollo 11?' },
  'eli-hundred-years': { id: 'eli-hundred-years', speaker: 'eli', expression: 'awed',
    text: 'Yep. More than a hundred years ago, humans landed here for the very first time.' },
  'pip-object-identified': { id: 'pip-object-identified', speaker: 'pip', expression: 'scanning',
    text: 'Object identified. Age: over one hundred years. Technical condition: outdated. Replacement recommended.' },
  'eli-historical-artifact': { id: 'eli-historical-artifact', speaker: 'eli', expression: 'exasperated',
    text: "Pip, that's a historical artifact!" },
  'pip-old-equipment': { id: 'pip-old-equipment', speaker: 'pip', expression: 'deadpan',
    text: 'Understood. Extremely old equipment that humans refuse to throw away.' },
  'mara-exactly': { id: 'mara-exactly', speaker: 'mara', expression: 'wry',
    text: 'Exactly.' },
  'pip-humans-strange': { id: 'pip-humans-strange', speaker: 'pip', expression: 'curious',
    text: 'Humans are very strange.' },

  // After the Apollo 11 flashback
  'mara-never-imagined': { id: 'mara-never-imagined', speaker: 'mara', expression: 'reflective',
    text: "They probably never imagined how far we'd eventually go." },
  'eli-neither-can-we': { id: 'eli-neither-can-we', speaker: 'eli', expression: 'reflective',
    text: 'Neither can we.' },
  'pip-still-important': { id: 'pip-still-important', speaker: 'pip', expression: 'curious',
    text: 'So this object is still important, even though it no longer works?' },
  'eli-exactly': { id: 'eli-exactly', speaker: 'eli', expression: 'smile',
    text: 'Exactly.' },
  'pip-saving-memory': { id: 'pip-saving-memory', speaker: 'pip', expression: 'saving',
    text: 'Interesting logic. Saving to memory.' },
};
