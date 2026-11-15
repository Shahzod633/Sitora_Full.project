import type { Beat, LayerTarget } from '../../story/types';
import type { LineId } from './script';

// Chapter 03 storyboard: 18 connected beats across four stages. Pure data (see chapter01/storyboard.ts for
// the conventions). One interactive moment: the rover timeline (L03).
//
// The salute (L06–L09) is deliberately still: a walk, a kneel, a hand across a nameplate, a salute, and a
// slow pull-back. No effects, no dialogue, the music turned down.

const show = (duration = 0.5, delay = 0): LayerTarget => ({ opacity: 1, duration, delay, ease: 'sine.inOut' });
const hide = (duration = 0.5, delay = 0): LayerTarget => ({ opacity: 0, duration, delay, ease: 'sine.inOut' });

export const storyboard: Beat<LineId>[] = [
  // ============================================================ SEQUENCE A — THE ROVER FAMILY
  {
    id: 'L01', slug: 'holograms', sequence: 'A', title: 'The rover family', stage: 'legacySite',
    transition: { kind: 'black', duration: 2 },
    expressions: { pip: 'awed', mara: 'neutral', eli: 'smile' },
    layers: {
      holo: [{ opacity: 1, duration: 0.6, delay: 1 }, { vars: { n: 5 }, duration: 3.6, ease: 'none' }],
      holoGlow: { opacity: 1, duration: 3, delay: 1 },
    },
    sound: [{ cue: 'hologram', at: 1 }, { cue: 'hologram', at: 2.8 }],
    camera: { from: 'crew', to: { shot: 'holoView', duration: 5.5, ease: 'sine.inOut' } },
    caption: [{ kind: 'scene', text: 'Those Who Came After' }, { kind: 'location', text: 'Ares Vallis, Mars · dusk' }],
    advance: { mode: 'auto', hold: 6.6 },
  },
  {
    id: 'L02', slug: 'relatives', sequence: 'A', title: 'Are these all my relatives?', stage: 'legacySite',
    // Screenplay: "Pip looks at each one with fascination."
    camera: { to: { shot: 'pipS', duration: 1.4 } },
    dialogue: ['pip-relatives', 'eli-simplify', 'pip-impressive-family'],
    onLine: {
      'eli-simplify': { camera: { to: { shot: 'eliS', duration: 1 } } },
      'pip-impressive-family': { camera: { to: { shot: 'pipCloser', duration: 1 } } },
    },
    outro: { hold: 2.4, focus: 'all', camera: { to: { shot: 'holoView', duration: 2, ease: 'sine.inOut' } } },
    advance: { mode: 'dialogue' },
  },

  // ============================================================ SEQUENCE B — THE ROVER TIMELINE
  {
    id: 'L03', slug: 'rover-timeline', sequence: 'B', title: 'Explore the rover timeline', stage: 'legacySite',
    layers: { roverTimeline: show(0.8, 0.2) },
    advance: { mode: 'interaction', target: 'roverTimeline' },
  },
  {
    id: 'L04', slug: 'holograms-fade', sequence: 'B', title: 'The holograms fade', stage: 'legacySite',
    // Screenplay: "Once the visitor finishes exploring the timeline, the holograms slowly disappear."
    expressions: { pip: 'curious' },
    layers: {
      roverTimeline: hide(0.6),
      holo: [{ vars: { n: 0 }, duration: 3.4, delay: 0.8, ease: 'none' }, { opacity: 0, duration: 0.3 }],
      holoGlow: { opacity: 0, duration: 3.6, delay: 0.8 },
    },
    camera: { to: { shot: 'crew', duration: 4.4, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 5 },
  },

  // ============================================================ SEQUENCE C — THE CONNECTION BETWEEN MISSIONS
  {
    id: 'L05', slug: 'the-connection', sequence: 'C', title: 'Every mission helped the next', stage: 'legacySite',
    camera: { to: { shot: 'maraS', duration: 1.6, ease: 'sine.inOut' } },
    dialogueDelay: 0.9,
    dialogue: ['mara-every-mission', 'eli-helped-us', 'pip-grandpa-helped', 'eli-in-a-way', 'pip-completed-mission', 'mara-more-than-expected'],
    onLine: {
      'eli-helped-us': { camera: { to: { shot: 'eliS', duration: 1.2, ease: 'sine.inOut' } } },
      // Screenplay: "Pip looks at Sojourner."
      'pip-grandpa-helped': { camera: { to: { shot: 'pipRover', duration: 1.6, ease: 'sine.inOut' } } },
      'eli-in-a-way': { camera: { to: { shot: 'eliS', duration: 1.2, ease: 'sine.inOut' } } },
      'pip-completed-mission': { camera: { to: { shot: 'pipS', duration: 1.2, ease: 'sine.inOut' } } },
      // Screenplay: "Mara looks at the little rover."
      'mara-more-than-expected': { camera: { to: { shot: 'maraRover', duration: 2.2, ease: 'sine.inOut' } } },
    },
    outro: { hold: 3.2, focus: 'all', expressions: { pip: 'content' }, camera: { to: { shot: 'roverSmall', duration: 2.8, ease: 'sine.inOut' } } },
    music: { mood: 'emotional' },
    advance: { mode: 'dialogue' },
  },

  // ============================================================ SEQUENCE D — THE FINAL SALUTE
  {
    id: 'L06', slug: 'mara-approaches', sequence: 'D', title: 'Mara approaches Sojourner', stage: 'legacySite',
    // Screenplay: "The music becomes quieter. Mara slowly approaches Sojourner."
    expressions: { mara: 'reflective', eli: 'neutral', pip: 'neutral' },
    layers: { mara: [{ xp: 95, duration: 4.6, delay: 1.4, ease: 'none', flags: { walk: true } }, { flags: { walk: false }, duration: 0.01 }] },
    camera: { to: [{ shot: 'siteWide', duration: 2.6, ease: 'sine.inOut' }, { shot: 'maraRover', duration: 3.6, delay: 0.6, ease: 'sine.inOut' }] },
    caption: { kind: 'scene', text: 'The Final Salute' },
    music: { mood: 'emotional', level: 0.45 },
    advance: { mode: 'auto', hold: 7.4 },
  },
  {
    id: 'L07', slug: 'mara-kneels', sequence: 'D', title: 'She kneels beside the rover', stage: 'legacySite',
    layers: { mara: hide(0.6, 0.3), maraKneel: show(0.6, 0.3) },
    camera: { to: { shot: 'maraRover', duration: 2.6, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 3.6 },
  },
  {
    id: 'L08', slug: 'the-nameplate', sequence: 'D', title: 'SOJOURNER', stage: 'legacySite',
    // Screenplay: "She … carefully wipes the dust from its nameplate. The name becomes visible: SOJOURNER.
    // For several seconds, nobody speaks."
    layers: {
      closeScene: show(1.1),
      plate: { vars: { wipe: 1 }, duration: 4.2, delay: 2, ease: 'sine.inOut' },
    },
    sound: [{ cue: 'brush', at: 2 }, { cue: 'brush', at: 3.1 }, { cue: 'brush', at: 4.3 }, { cue: 'brush', at: 5.3 }],
    camera: { from: 'closeRover', to: { shot: 'plate', duration: 6, delay: 0.4, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 10.5 },
  },
  {
    id: 'L09', slug: 'the-salute', sequence: 'D', title: 'The salute', stage: 'legacySite',
    // Screenplay: "Mara stands up. She looks at the little rover one last time. Then she raises her hand and
    // gives Sojourner a military salute. Eli and Pip watch silently. The camera slowly begins to pull away."
    layers: {
      closeScene: hide(1.6),
      maraKneel: hide(0.6, 1.4),
      mara: [show(0.6, 1.4), hide(0.3, 3.2)],
      maraSalute: show(0.3, 5.2),
    },
    camera: { from: 'maraRover', to: { shot: 'siteWide', duration: 8, delay: 6.4, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 15 },
  },

  // ============================================================ SEQUENCE E — ONE MORE PASSENGER
  {
    id: 'L10', slug: 'one-more-passenger', sequence: 'E', title: 'One more passenger', stage: 'legacySite',
    // Screenplay: "Mara lowers her hand. She turns toward Pip."
    layers: { maraSalute: hide(0.4), mara: show(0.4) },
    camera: { to: { shot: 'maraS', duration: 1.8, ease: 'sine.inOut' } },
    dialogueDelay: 1.4,
    dialogue: ['mara-prepare-cargo', 'pip-for-what', 'mara-one-more-passenger'],
    onLine: {
      'pip-for-what': { camera: { to: { shot: 'pipS', duration: 1 } } },
      'mara-one-more-passenger': { camera: { to: { shot: 'maraS', duration: 1 } } },
    },
    // Screenplay: "Pip looks at Sojourner. His digital eyes widen slightly."
    outro: { hold: 2.8, focus: 'pip', expressions: { pip: 'surprised' }, camera: { to: { shot: 'pipRover', duration: 1.6, ease: 'sine.inOut' } } },
    music: { mood: 'emotional', level: 0.8 },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'L11', slug: 'taking-grandpa', sequence: 'E', title: 'We’re taking Grandpa with us?', stage: 'legacySite',
    dialogueDelay: 0.2,
    dialogue: ['pip-taking-grandpa', 'mara-long-enough'],
    onLine: { 'mara-long-enough': { camera: { to: { shot: 'maraS', duration: 1.5, ease: 'sine.inOut' } } } },
    // Screenplay: "A message appears on the crew's display." Fictional; the card says so.
    outro: {
      hold: 6, focus: 'all', expressions: { pip: 'happy', mara: 'smile' },
      layers: { crewDisplay: show(0.6, 0.6) },
      sound: [{ cue: 'authorize', at: 0.6 }],
      camera: { to: { shot: 'crew', duration: 2.4, ease: 'sine.inOut' } },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'L12', slug: 'pip-lifts-sojourner', sequence: 'E', title: 'Pip lifts Sojourner', stage: 'legacySite',
    // Screenplay: "Pip carefully lifts Sojourner with his mechanical arms." Until a carrying pose is drawn,
    // the rover (its own layer) is lifted slowly to Pip's chest, held in front of him. It never floats free.
    layers: {
      crewDisplay: hide(0.5),
      roverS: [
        { yp: -10, duration: 1.4, delay: 1.4, ease: 'sine.inOut' },
        // Offsets are % of the rover's own box: onto Pip's chest.
        { xp: 117, yp: -38, scale: 0.62, duration: 2.8, ease: 'sine.inOut' },
      ],
    },
    camera: { to: { shot: 'pipRover', duration: 1.8, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 7 },
  },
  {
    id: 'L13', slug: 'family-heirloom', sequence: 'E', title: 'A family heirloom', stage: 'legacySite',
    camera: { to: { shot: 'eliS', duration: 1.2 } },
    dialogue: ['eli-dont-drop', 'pip-heirloom'],
    onLine: { 'pip-heirloom': { camera: { to: { shot: 'pipRover', duration: 1.2 } } } },
    // Screenplay: "Eli smiles. The three characters begin walking toward their spacecraft."
    outro: { hold: 3.2, focus: 'all', expressions: { eli: 'smile', mara: 'smile' }, camera: { to: { shot: 'crew', duration: 2.6, ease: 'sine.inOut' } } },
    advance: { mode: 'dialogue' },
  },

  // ============================================================ SEQUENCE F — MARTIAN SUNSET
  {
    id: 'L14', slug: 'martian-sunset', sequence: 'F', title: 'Martian sunset', stage: 'sunset',
    // The emotional climax: the crew walks toward Aster, Pip carrying Sojourner, and the camera pulls back.
    transition: { kind: 'crossfade', duration: 2.2 },
    layers: {
      maraW: { xp: 250, duration: 15, ease: 'none', flags: { walk: true } },
      eliW: { xp: 222, duration: 15, ease: 'none', flags: { walk: true } },
      pipW: { xp: 343, duration: 15, ease: 'none', flags: { walk: true } },
    },
    sound: [{ cue: 'wind', at: 0.5 }],
    camera: { from: 'walkNear', to: { shot: 'pullBack', duration: 13, delay: 1, ease: 'sine.inOut' } },
    caption: { kind: 'scene', text: 'One More Passenger' },
    advance: { mode: 'auto', hold: 14 },
  },
  {
    id: 'L15', slug: 'camera-rises', sequence: 'F', title: 'The camera rises', stage: 'sunset',
    // Screenplay: "The camera rises above the Martian surface."
    layers: { nightFall: { opacity: 0.72, duration: 5, ease: 'sine.in' } },
    camera: { to: { shot: 'sky', duration: 5.4, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 5 },
  },

  // ============================================================ SEQUENCE G — THE ENDING
  {
    id: 'L16', slug: 'line-of-knowledge', sequence: 'G', title: 'Each generation of explorers', stage: 'legacy',
    transition: { kind: 'crossfade', duration: 2 },
    layers: { line: [show(1.2, 0.4), { vars: { p: 7 }, duration: 13, ease: 'none' }] },
    sound: [{ cue: 'chime', at: 1.6 }, { cue: 'chime', at: 12.6 }],
    advance: { mode: 'auto', hold: 17.5 },
  },
  {
    id: 'L17', slug: 'not-forgotten', sequence: 'G', title: 'They were left behind. But not forgotten.', stage: 'legacy',
    // Screenplay: fade to black; "THEY WERE LEFT BEHIND." — a short pause — "BUT NOT FORGOTTEN."
    layers: {
      line: hide(2.4),
      stars: { opacity: 0, duration: 2.8 },
      words1: show(1.8, 3),
      words2: show(1.8, 6.6),
    },
    music: { level: 0.7 },
    advance: { mode: 'auto', hold: 11.5 },
  },
  {
    id: 'L18', slug: 'the-end', sequence: 'G', title: 'Abandoned But Not Forgotten', stage: 'finale',
    transition: { kind: 'black', duration: 2 },
    advance: { mode: 'end' },
  },
];
