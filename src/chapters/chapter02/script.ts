import type { ScriptLine } from '../../story/types';

// Every spoken line of Chapter 2, verbatim and in order. Beats reference lines by id; validateChapter()
// checks that each line appears exactly once, in this order.
//
// The first five lines (ids starting `pro-`) are the APPROVED ADDITIONAL prologue supplied by the team for
// the observation-window paintings. They are not part of the original screenplay and are listed in
// `additionalLines`. Everything after them is the original screenplay, unchanged.

export const scriptOrder = [
  // Additional prologue — before Mars
  'pro-eli-weird',
  'pro-mara-next-stop',
  'pro-eli-routine',
  'pro-mara-six-years',
  'pro-eli-good',
  // Scene 1 — An Unexpected Discovery
  'pip-unknown-object',
  'eli-shopping-carts',
  'eli-no-way',
  'mara-rover-1997',
  'eli-first-robots',
  'pip-please-confirm',
  'eli-of-course',
  'pip-long-before',
  'eli-thats-right',
  'pip-grandpa',
  'mara-in-a-way',
  'pip-why-dust',
  // Scene 2 — Sojourner's Memories
  'eli-open-records',
  'pip-archive-located',
  'mara-seven-days',
  'eli-twelve-times',
  'pip-1086',
  'eli-say-cool',
  'pip-cool',
  'pip-very-cool',
  'pip-why-not-back',
  'mara-technology',
  'pip-i-see',
  'pip-just-stayed',
  'eli-still-mattered',
  // Scene 3 — Those Who Continued His Work
  'eli-want-to-see',
  'pip-family-history',
] as const;

export type LineId = (typeof scriptOrder)[number];

export const additionalLines: readonly LineId[] = [
  'pro-eli-weird', 'pro-mara-next-stop', 'pro-eli-routine', 'pro-mara-six-years', 'pro-eli-good',
];

const line = (id: LineId, speaker: ScriptLine['speaker'], expression: ScriptLine['expression'], text: string): ScriptLine<LineId> =>
  ({ id, speaker, expression, text });

export const script: Record<LineId, ScriptLine<LineId>> = {
  'pro-eli-weird': line('pro-eli-weird', 'eli', 'awed', "It's weird seeing Earth and the Moon in the same window."),
  'pro-mara-next-stop': line('pro-mara-next-stop', 'mara', 'smile', 'Enjoy the view. Next stop is Mars.'),
  'pro-eli-routine': line('pro-eli-routine', 'eli', 'sarcastic', 'You make that sound like a routine flight.'),
  'pro-mara-six-years': line('pro-mara-six-years', 'mara', 'wry', 'Would you prefer another six years of preparation?'),
  'pro-eli-good': line('pro-eli-good', 'eli', 'grin', "Nope. I'm good."),

  'pip-unknown-object': line('pip-unknown-object', 'pip', 'scanning',
    'Unknown object detected. Metallic structure. Six wheels. Significant signs of deterioration.'),
  'eli-shopping-carts': line('eli-shopping-carts', 'eli', 'sarcastic',
    'Either Mars invented shopping carts, or we just found something interesting.'),
  'eli-no-way': line('eli-no-way', 'eli', 'surprised', 'No way... Sojourner!'),
  'mara-rover-1997': line('mara-rover-1997', 'mara', 'surprised', 'The rover from 1997?'),
  'eli-first-robots': line('eli-first-robots', 'eli', 'awed', 'Exactly. One of the first robots to explore the surface of Mars.'),
  'pip-please-confirm': line('pip-please-confirm', 'pip', 'confused', 'Please confirm. This is also a robot?'),
  'eli-of-course': line('eli-of-course', 'eli', 'smile', 'Of course.'),
  'pip-long-before': line('pip-long-before', 'pip', 'curious', 'And it explored Mars long before I was created?'),
  'eli-thats-right': line('eli-thats-right', 'eli', 'smile', "That's right."),
  'pip-grandpa': line('pip-grandpa', 'pip', 'excited', 'So... does that make him my grandpa?'),
  'mara-in-a-way': line('mara-in-a-way', 'mara', 'smile', 'In a way, yes.'),
  'pip-why-dust': line('pip-why-dust', 'pip', 'sad', 'Then why is Grandpa lying in the dust?'),

  'eli-open-records': line('eli-open-records', 'eli', 'serious', 'Pip, open the mission records.'),
  'pip-archive-located': line('pip-archive-located', 'pip', 'analyzing', 'Archive located. Year: 1997. Beginning reconstruction.'),
  'mara-seven-days': line('mara-seven-days', 'mara', 'wry', 'Seven days planned, and it actually worked for eighty-three. Not bad.'),
  'eli-twelve-times': line('eli-twelve-times', 'eli', 'grin', 'Yeah. Almost twelve times longer than expected.'),
  'pip-1086': line('pip-1086', 'pip', 'analyzing', 'Grandpa exceeded his expected operational lifetime by approximately 1,086 percent.'),
  'eli-say-cool': line('eli-say-cool', 'eli', 'exasperated', "Pip, can you just say 'cool' for once?"),
  'pip-cool': line('pip-cool', 'pip', 'deadpan', 'Cool.'),
  'pip-very-cool': line('pip-very-cool', 'pip', 'happy', 'Very cool.'),
  'pip-why-not-back': line('pip-why-not-back', 'pip', 'curious', "Why didn't anyone bring him back after the mission ended?"),
  'mara-technology': line('mara-technology', 'mara', 'reflective',
    "Back then, humans didn't have the technology to return equipment like this from Mars."),
  'pip-i-see': line('pip-i-see', 'pip', 'thinking', 'I see.'),
  'pip-just-stayed': line('pip-just-stayed', 'pip', 'sad', 'So he just stayed here?'),
  'eli-still-mattered': line('eli-still-mattered', 'eli', 'reflective', 'Yeah. But everything he accomplished still mattered.'),

  'eli-want-to-see': line('eli-want-to-see', 'eli', 'smile', 'Want to see who continued his work?'),
  'pip-family-history': line('pip-family-history', 'pip', 'excited', 'Of course. I need to learn more about my family history.'),
};
