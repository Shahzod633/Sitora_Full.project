import type { ScriptLine } from '../../story/types';

// Every spoken line of the Chapter 3 screenplay, verbatim and in order. Beats reference lines by id;
// validateChapter() checks that each line appears exactly once, in this order.

export const scriptOrder = [
  // Scene 1 — The Legacy of Mars Exploration
  'pip-relatives',
  'eli-simplify',
  'pip-impressive-family',
  'mara-every-mission',
  'eli-helped-us',
  'pip-grandpa-helped',
  'eli-in-a-way',
  'pip-completed-mission',
  'mara-more-than-expected',
  // Scene 3 — One More Passenger
  'mara-prepare-cargo',
  'pip-for-what',
  'mara-one-more-passenger',
  'pip-taking-grandpa',
  'mara-long-enough',
  'eli-dont-drop',
  'pip-heirloom',
] as const;

export type LineId = (typeof scriptOrder)[number];

const line = (id: LineId, speaker: ScriptLine['speaker'], expression: ScriptLine['expression'], text: string): ScriptLine<LineId> =>
  ({ id, speaker, expression, text });

export const script: Record<LineId, ScriptLine<LineId>> = {
  'pip-relatives': line('pip-relatives', 'pip', 'awed', 'Are these all my relatives?'),
  'eli-simplify': line('eli-simplify', 'eli', 'wry', 'Well, if you really simplify things, yeah.'),
  'pip-impressive-family': line('pip-impressive-family', 'pip', 'happy', 'I have an impressive family.'),
  'mara-every-mission': line('mara-every-mission', 'mara', 'thoughtful',
    'So every mission helped answer questions left by the ones before it?'),
  'eli-helped-us': line('eli-helped-us', 'eli', 'smile', 'Exactly. And all those discoveries helped us get here.'),
  'pip-grandpa-helped': line('pip-grandpa-helped', 'pip', 'curious', 'So Grandpa helped us reach Mars?'),
  'eli-in-a-way': line('eli-in-a-way', 'eli', 'reflective', 'In a way, he did.'),
  'pip-completed-mission': line('pip-completed-mission', 'pip', 'thinking', 'Then he completed his mission?'),
  'mara-more-than-expected': line('mara-more-than-expected', 'mara', 'reflective',
    'I think he accomplished more than anyone expected.'),

  'mara-prepare-cargo': line('mara-prepare-cargo', 'mara', 'serious', 'Pip, prepare the cargo compartment.'),
  'pip-for-what': line('pip-for-what', 'pip', 'confused', 'For what, Captain?'),
  'mara-one-more-passenger': line('mara-one-more-passenger', 'mara', 'smile', "We're bringing one more passenger."),
  'pip-taking-grandpa': line('pip-taking-grandpa', 'pip', 'excited', "We're taking Grandpa with us?"),
  'mara-long-enough': line('mara-long-enough', 'mara', 'reflective', "Yeah. I think he's been out here long enough."),
  'eli-dont-drop': line('eli-dont-drop', 'eli', 'grin', "Just don't drop him. He's almost a century older than you."),
  'pip-heirloom': line('pip-heirloom', 'pip', 'deadpan', "I'm aware. He's a family heirloom."),
};
