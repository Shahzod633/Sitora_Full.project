import type { Beat, LayerTarget } from '../../story/types';
import type { LineId } from './script';

// Chapter 02 storyboard: 27 connected beats across seven stages. Pure data (see chapter01/storyboard.ts for
// the conventions). Three interactive moments: brushing the dust away (M10), driving Sojourner to a rock and
// using the APXS (M19), and the mission timeline (M20).
//
// Staging notes that are not dialogue ("Mara smiles", "Pip pauses", "Eli laughs. Mara doesn't answer.")
// are played as wordless outros with their own hold, so the quiet moments are never rushed.

const show = (duration = 0.5, delay = 0): LayerTarget => ({ opacity: 1, duration, delay, ease: 'sine.inOut' });
const hide = (duration = 0.5, delay = 0): LayerTarget => ({ opacity: 0, duration, delay, ease: 'sine.inOut' });

export const storyboard: Beat<LineId>[] = [
  // ============================================================ SEQUENCE A — BEFORE MARS (additional prologue)
  {
    id: 'M01', slug: 'observation-deck', sequence: 'A', title: 'Earth and the Moon', stage: 'observation',
    transition: { kind: 'black', duration: 2.2 },
    camera: { from: 'establishing', to: { shot: 'settle', duration: 6.5, ease: 'sine.inOut' } },
    caption: [{ kind: 'scene', text: 'The Little Explorer' }, { kind: 'location', text: 'Aboard Aster · leaving the Moon' }],
    advance: { mode: 'auto', hold: 6 },
  },
  {
    id: 'M02', slug: 'same-window', sequence: 'A', title: 'Earth and the Moon in the same window', stage: 'observation',
    camera: { to: { shot: 'eliO', duration: 1.4 } },
    dialogue: ['pro-eli-weird', 'pro-mara-next-stop', 'pro-eli-routine'],
    onLine: {
      'pro-mara-next-stop': {
        camera: { to: { shot: 'maraO', duration: 1.1 } },
        layers: { maraReaction: [show(0.18), hide(0.25, 3)] },
      },
      'pro-eli-routine': { camera: { to: { shot: 'two', duration: 1.2 } } },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M03', slug: 'six-more-years', sequence: 'A', title: 'Another six years?', stage: 'observation',
    camera: { to: { shot: 'maraO', duration: 1 } },
    dialogue: ['pro-mara-six-years', 'pro-eli-good'],
    onLine: { 'pro-eli-good': { camera: { to: { shot: 'eliO', duration: 0.8, ease: 'power2.out' } } } },
    // The camera leaves them and pushes out past the Moon, toward Mars.
    outro: { hold: 3, focus: 'all', camera: { to: [{ shot: 'two', duration: 1 }, { shot: 'outward', duration: 2.4, delay: 0.2, ease: 'power2.in' }] } },
    advance: { mode: 'dialogue' },
  },

  // ============================================================ SEQUENCE B — ARRIVAL ON MARS
  {
    id: 'M04', slug: 'the-crossing', sequence: 'B', title: 'The long crossing', stage: 'marsSpace',
    transition: { kind: 'push', duration: 1.2 },
    from: { aster: { dx: -46, dy: 8, scale: 0.86, rotation: -2 } },
    layers: {
      aster: { dx: 4, dy: -2, scale: 0.66, rotation: 0, duration: 8.5, ease: 'sine.inOut' },
      marsFar: { scale: 1.7, duration: 8, ease: 'sine.in' },
    },
    camera: { from: 'cruise', to: { shot: 'ahead', duration: 8.5, ease: 'sine.inOut' } },
    caption: { kind: 'location', text: 'Deep space · bound for Mars' },
    advance: { mode: 'auto', hold: 8 },
  },
  {
    id: 'M05', slug: 'mars-orbit', sequence: 'B', title: 'Mars', stage: 'marsSpace',
    from: { mars: { opacity: 0, scale: 0.22, dx: 9, dy: -11 } },
    layers: {
      marsFar: hide(1.2),
      mars: { opacity: 1, scale: 1, dx: 0, dy: 0, duration: 5.4, ease: 'sine.out' },
      aster: { dx: 15, dy: 3, scale: 0.3, rotation: 3, duration: 6.4, ease: 'sine.inOut' },
      sun: { opacity: 0.55, duration: 4 },
    },
    camera: { to: [{ shot: 'orbit', duration: 4.6, ease: 'sine.inOut' }, { shot: 'marsNear', duration: 3.2, ease: 'sine.in' }] },
    caption: { kind: 'location', text: 'Mars orbit' },
    advance: { mode: 'auto', hold: 7.8 },
  },
  {
    id: 'M06', slug: 'atmospheric-entry', sequence: 'B', title: 'Through the atmosphere', stage: 'marsDescent',
    transition: { kind: 'crossfade', duration: 1.4 },
    from: { aster: { dx: -34, dy: -36, scale: 0.46, rotation: 16 } },
    layers: {
      aster: [
        { dx: -8, dy: -8, scale: 0.78, rotation: 12, duration: 3.8, ease: 'sine.out' },
        { dx: 10, dy: 12, scale: 1, rotation: 6, duration: 3.2, ease: 'sine.inOut' },
      ],
      entryGlow: [{ opacity: 1, duration: 1.2, delay: 0.5 }, { opacity: 0, duration: 2.2, delay: 2.2 }],
      haze: [{ opacity: 0.34, duration: 3, delay: 2.2 }, { opacity: 0.12, duration: 2 }],
    },
    sound: [{ cue: 'entry', at: 0.4 }],
    camera: { from: 'entryHigh', to: { shot: 'entryLow', duration: 7, ease: 'sine.inOut' } },
    caption: { kind: 'location', text: 'Entering the Martian atmosphere' },
    advance: { mode: 'auto', hold: 7.4 },
  },
  {
    id: 'M07', slug: 'landing', sequence: 'B', title: 'Landing on Mars', stage: 'marsSurface',
    // Short dissolve: both stages show the ship, and a long one reads as two ships at once.
    transition: { kind: 'crossfade', duration: 0.8 },
    from: { asterL: { dy: -62, dx: -6, scale: 0.8, rotation: -4 }, landingGlow: { opacity: 1 } },
    layers: {
      asterL: [
        { dy: -13, dx: -2, scale: 0.94, rotation: -2, duration: 3.6, ease: 'sine.out' },
        { dy: 0, dx: 0, scale: 1, rotation: 0, duration: 2.6, ease: 'power2.out' },
      ],
      landingDust: [{ opacity: 0.9, duration: 0.9, delay: 4.6 }, { opacity: 0, duration: 4.4 }],
      landingGlow: { opacity: 0, duration: 0.8, delay: 6 },
      asterShadowL: { opacity: 0.8, duration: 1.4, delay: 5.2 },
      asterThrust: { opacity: 0, duration: 0.8, delay: 6 },
      haze: [{ opacity: 0.32, duration: 1.6, delay: 4.8 }, { opacity: 0.12, duration: 4.4 }],
    },
    sound: [{ cue: 'rumble', at: 3.8 }, { cue: 'wind', at: 6.4 }],
    camera: { from: 'landingSky', to: { shot: 'landed', duration: 6.4, ease: 'sine.inOut' } },
    caption: [
      { kind: 'location', text: 'Ares Vallis, Mars' },
      { kind: 'narration', text: 'After a long journey, Aster successfully lands on Mars.' },
    ],
    advance: { mode: 'auto', hold: 10 },
  },

  // ============================================================ SEQUENCE C — AN UNEXPECTED DISCOVERY
  {
    id: 'M08', slug: 'exploration', sequence: 'C', title: 'Across the plain', stage: 'marsSurface',
    // There is no walk-cycle art, so nobody slides across the ground: the camera travels over the plain and
    // finds the crew already out on foot (a time cut), each figure easing in as the frame reaches them.
    layers: { mara: show(1.1, 2.6), eli: show(1.1, 3), pip: show(1.1, 3.4) },
    camera: { to: [{ shot: 'plain', duration: 3, ease: 'sine.inOut' }, { shot: 'crewWalk', duration: 4.4, ease: 'sine.inOut' }] },
    caption: [
      { kind: 'scene', text: 'An Unexpected Discovery' },
      { kind: 'narration', text: 'During an exploration mission near the historic Mars Pathfinder landing area…' },
    ],
    advance: { mode: 'auto', hold: 8.4 },
  },
  {
    id: 'M09', slug: 'pip-scans', sequence: 'C', title: 'Unknown object detected', stage: 'marsSurface',
    expressions: { pip: 'scanning' },
    layers: { scanWave: show(0.5, 0.3), moundReticle: show(0.5, 1.2) },
    sound: [{ cue: 'scan', at: 0.3 }],
    // Pip's report plays over what he is looking at; Eli answers on camera.
    camera: { to: [{ shot: 'pipScan', duration: 1.2 }, { shot: 'moundFocus', duration: 1.6, delay: 0.5, ease: 'sine.inOut' }] },
    dialogueDelay: 3,
    dialogue: ['pip-unknown-object', 'eli-shopping-carts'],
    onLine: { 'eli-shopping-carts': { layers: { scanWave: hide(0.3) }, camera: { to: { shot: 'eliM', duration: 0.9 } } } },
    // Screenplay: "They approach the object."
    outro: {
      hold: 3.6, focus: 'all', expressions: { pip: 'curious' },
      layers: {
        moundReticle: hide(0.4),
        // The approach is carried by the camera move toward the mound; the figures stay planted.
      },
      camera: { to: { shot: 'toMound', duration: 3.2, ease: 'sine.inOut' } },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M10', slug: 'uncover', sequence: 'C', title: 'Brush away the dust', stage: 'digSite',
    transition: { kind: 'crossfade', duration: 1.4 },
    from: { closeScene: { opacity: 1 } },
    camera: { from: 'closeWide', to: { shot: 'closeRover', duration: 2.6, ease: 'sine.inOut' } },
    caption: { kind: 'scene', text: 'Uncovering Sojourner' },
    advance: { mode: 'interaction', target: 'dustCover' },
  },
  {
    id: 'M11', slug: 'the-reveal', sequence: 'C', title: 'A tiny six-wheeled rover', stage: 'digSite',
    // Held on the rover: cinematic emphasis, nothing moves but the camera. The rover does not wake up.
    layers: { dustCover: hide(1.4), revealTag: show(0.9, 1.6) },
    camera: { to: { shot: 'closePush', duration: 5.5, ease: 'sine.inOut' } },
    music: { mood: 'emotional' },
    advance: { mode: 'auto', hold: 5.8 },
  },

  // ============================================================ SEQUENCE D — MEETING GRANDPA
  {
    id: 'M12', slug: 'no-way', sequence: 'D', title: 'No way... Sojourner!', stage: 'digSite',
    dialogueDelay: 0.3,
    dialogue: ['eli-no-way', 'mara-rover-1997', 'eli-first-robots'],
    onLine: {
      'mara-rover-1997': { layers: { closeScene: hide(0.6), revealTag: hide(0.3) }, camera: { to: { shot: 'maraS', duration: 0.9 } } },
      'eli-first-robots': { camera: { to: { shot: 'eliS', duration: 1 } } },
    },
    music: { mood: 'mars' },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M13', slug: 'also-a-robot', sequence: 'D', title: 'This is also a robot?', stage: 'digSite',
    camera: { to: { shot: 'pipRover', duration: 1.3 } },
    dialogue: ['pip-please-confirm', 'eli-of-course', 'pip-long-before', 'eli-thats-right'],
    onLine: {
      'eli-of-course': { camera: { to: { shot: 'eliPip', duration: 0.9 } } },
      'pip-long-before': { camera: { to: { shot: 'pipS', duration: 1 } } },
      'eli-thats-right': { camera: { to: { shot: 'eliS', duration: 0.8 } } },
    },
    // Screenplay: "Pip pauses for a moment."
    outro: {
      hold: 2.6, focus: 'pip', expressions: { pip: 'processing' },
      layers: { pipThinking: show(0.4, 0.5) },
      camera: { to: { shot: 'pipCloser', duration: 1.8, ease: 'sine.inOut' } },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M14', slug: 'grandpa', sequence: 'D', title: 'Does that make him my grandpa?', stage: 'digSite',
    layers: { pipThinking: hide(0.3) },
    camera: { to: { shot: 'pipCloser', duration: 0.6 } },
    dialogueDelay: 0.35,
    dialogue: ['pip-grandpa'],
    // Screenplay: "Mara smiles."
    outro: { hold: 2.6, focus: 'mara', expressions: { mara: 'smile' }, camera: { to: { shot: 'maraS', duration: 1.5, ease: 'sine.inOut' } } },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M15', slug: 'in-the-dust', sequence: 'D', title: 'Why is Grandpa lying in the dust?', stage: 'digSite',
    dialogue: ['mara-in-a-way', 'pip-why-dust'],
    // Screenplay: "Pip looks at Sojourner again."
    onLine: { 'pip-why-dust': { camera: { to: { shot: 'pipRover', duration: 1.8, ease: 'sine.inOut' } } } },
    // Screenplay: "Eli laughs. Mara doesn't answer." A short laugh, then the question hangs over the little rover.
    outro: {
      hold: 5.6, focus: 'all', expressions: { eli: 'laughing', mara: 'reflective', pip: 'sad' },
      camera: { to: [{ shot: 'crew', duration: 1.6, ease: 'sine.inOut' }, { shot: 'roverSmall', duration: 3.4, delay: 0.3, ease: 'sine.inOut' }] },
    },
    music: { mood: 'emotional', level: 0.8 },
    advance: { mode: 'dialogue' },
  },

  // ============================================================ SEQUENCE E — SOJOURNER'S MEMORIES
  {
    id: 'M16', slug: 'mission-records', sequence: 'E', title: 'Open the mission records', stage: 'digSite',
    // Screenplay: "Eli scans Sojourner. His suit computer discovers the original Mars Pathfinder mission archives."
    expressions: { mara: 'neutral', eli: 'serious', pip: 'curious' },
    layers: { scanReticle: show(0.5, 0.3) },
    sound: [{ cue: 'scan', at: 0.3 }],
    camera: { to: { shot: 'roverSmall', duration: 1 } },
    dialogueDelay: 1.6,
    dialogue: ['eli-open-records', 'pip-archive-located'],
    onLine: {
      'eli-open-records': { camera: { to: { shot: 'eliS', duration: 1 } } },
      'pip-archive-located': { camera: { to: { shot: 'pipS', duration: 1 } } },
    },
    // Screenplay: "The screen begins to flicker."
    outro: {
      hold: 2, focus: 'all',
      layers: {
        scanReticle: hide(0.3),
        flicker: [
          { opacity: 0.5, duration: 0.08, delay: 0.2 }, { opacity: 0.05, duration: 0.1 }, { opacity: 0.6, duration: 0.08, delay: 0.16 },
          { opacity: 0.1, duration: 0.1 }, { opacity: 0.7, duration: 0.1, delay: 0.2 }, { opacity: 0.3, duration: 0.3 },
        ],
      },
      sound: [{ cue: 'archive', at: 0.2 }],
      camera: { to: { shot: 'siteWide', duration: 1.8, ease: 'sine.inOut' } },
    },
    music: { mood: 'mars', level: 1 },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M17', slug: 'back-to-1997', sequence: 'E', title: 'Mars Pathfinder · 1997 · Sojourner Rover', stage: 'pathfinder',
    transition: { kind: 'archive', duration: 1.5 },
    layers: {
      missionCard: { opacity: 1, duration: 1.2, delay: 0.2 },
      reconLabel: { opacity: 1, duration: 0.8, delay: 1 },
      // The rover drives down the ramp and levels out on the ground.
      reconRover: [
        { opacity: 1, duration: 0.6, delay: 1.8 },
        { xp: 30, yp: 22, duration: 3.6, ease: 'sine.inOut' },
        { xp: 66, yp: 26, rotation: 0, duration: 1.3, ease: 'sine.out' },
      ],
    },
    camera: { from: 'wide', to: { shot: 'ramp', duration: 6, delay: 1, ease: 'sine.inOut' } },
    caption: { kind: 'scene', text: 'Sojourner’s Memories' },
    advance: { mode: 'auto', hold: 8.4 },
  },
  {
    id: 'M18', slug: 'mission-record', sequence: 'E', title: 'The mission record', stage: 'pathfinder',
    layers: {
      recordPanel: { opacity: 1, duration: 0.8 },
      recon: { opacity: 0.16, duration: 0.8 },
      missionCard: hide(0.5),
      reconLabel: hide(0.4),
    },
    camera: { to: { shot: 'wide', duration: 1.2 } },
    advance: { mode: 'confirm', label: 'Take control of Sojourner' },
  },
  {
    id: 'M19', slug: 'drive-sojourner', sequence: 'E', title: 'Exploring Mars in 1997', stage: 'pathfinder',
    layers: { recordPanel: hide(0.5), recon: hide(0.5), roverGame: show(0.8, 0.4) },
    advance: { mode: 'interaction', target: 'roverGame' },
  },
  {
    id: 'M20', slug: 'mission-timeline', sequence: 'E', title: 'Seven sols planned, eighty-three achieved', stage: 'pathfinder',
    layers: { roverGame: hide(0.6), timeline: show(0.8, 0.5) },
    advance: { mode: 'interaction', target: 'timeline' },
  },

  // ============================================================ SEQUENCE F — BACK TO THE PRESENT
  {
    id: 'M21', slug: 'return-to-present', sequence: 'F', title: 'The archive fades', stage: 'digSite',
    transition: { kind: 'present', duration: 1.4 },
    from: { dustCover: { opacity: 0 } },
    camera: { from: 'siteWide', to: { shot: 'crew', duration: 5.5, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 4.6 },
  },
  {
    id: 'M22', slug: 'not-bad', sequence: 'F', title: 'Seven planned, eighty-three', stage: 'digSite',
    camera: { to: { shot: 'maraS', duration: 1.6, ease: 'sine.inOut' } },
    dialogueDelay: 1,
    dialogue: ['mara-seven-days', 'eli-twelve-times', 'pip-1086', 'eli-say-cool', 'pip-cool'],
    onLine: {
      'eli-twelve-times': { camera: { to: { shot: 'eliS', duration: 1 } } },
      'pip-1086': { camera: { to: { shot: 'pipS', duration: 1 } } },
      'eli-say-cool': { camera: { to: { shot: 'eliPip', duration: 0.5, ease: 'power3.out' } } },
      'pip-cool': { camera: { to: { shot: 'pipCloser', duration: 0.7 } } },
    },
    // Screenplay: "A short pause."
    outro: { hold: 1.7, focus: 'pip', expressions: { pip: 'processing' } },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M23', slug: 'very-cool', sequence: 'F', title: 'Very cool.', stage: 'digSite',
    dialogueDelay: 0.1,
    dialogue: ['pip-very-cool'],
    // Screenplay: "Mara laughs. Then Pip looks at Sojourner again."
    outro: {
      hold: 3.6, focus: 'all', expressions: { mara: 'happy', eli: 'grin' },
      camera: { to: [{ shot: 'maraS', duration: 1.1 }, { shot: 'pipRover', duration: 1.6, delay: 0.7, ease: 'sine.inOut' }] },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M24', slug: 'why-left-behind', sequence: 'F', title: 'Why didn’t anyone bring him back?', stage: 'digSite',
    expressions: { mara: 'neutral', eli: 'neutral', pip: 'curious' },
    dialogueDelay: 0.3,
    dialogue: ['pip-why-not-back', 'mara-technology', 'pip-i-see'],
    onLine: {
      'mara-technology': { camera: { to: { shot: 'maraS', duration: 1.5, ease: 'sine.inOut' } } },
      'pip-i-see': { camera: { to: { shot: 'pipS', duration: 1.3, ease: 'sine.inOut' } } },
    },
    // Screenplay: "He looks at the small rover."
    outro: { hold: 2.8, focus: 'pip', expressions: { pip: 'sad' }, camera: { to: { shot: 'roverSmall', duration: 2.3, ease: 'sine.inOut' } } },
    music: { mood: 'emotional' },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M25', slug: 'it-still-mattered', sequence: 'F', title: 'Everything he accomplished still mattered', stage: 'digSite',
    camera: { to: { shot: 'pipRover', duration: 1.3 } },
    dialogue: ['pip-just-stayed', 'eli-still-mattered'],
    // Screenplay: "Eli answers more seriously this time."
    onLine: { 'eli-still-mattered': { camera: { to: { shot: 'eliS', duration: 1.8, ease: 'sine.inOut' } } } },
    outro: { hold: 3.4, focus: 'all', camera: { to: { shot: 'crew', duration: 3, ease: 'sine.inOut' } } },
    advance: { mode: 'dialogue' },
  },

  // ============================================================ SEQUENCE G — THOSE WHO CONTINUED HIS WORK
  {
    id: 'M26', slug: 'family-history', sequence: 'G', title: 'Who continued his work?', stage: 'digSite',
    expressions: { mara: 'neutral', eli: 'smile', pip: 'curious' },
    camera: { to: { shot: 'eliS', duration: 1.2 } },
    dialogue: ['eli-want-to-see', 'pip-family-history'],
    onLine: { 'pip-family-history': { camera: { to: { shot: 'pipS', duration: 1 } } } },
    // Screenplay: "Mara smiles. Holographic models of other Mars rovers begin appearing around them."
    outro: {
      hold: 6, focus: 'all', expressions: { mara: 'smile' },
      layers: { holo: [{ opacity: 1, duration: 0.6, delay: 1.2 }, { vars: { n: 5 }, duration: 3.4, ease: 'none' }] },
      sound: [{ cue: 'hologram', at: 1.2 }, { cue: 'hologram', at: 2.9 }],
      camera: { to: [{ shot: 'maraS', duration: 1 }, { shot: 'holoView', duration: 2.6, delay: 0.4, ease: 'sine.inOut' }] },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'M27', slug: 'chapter-ending', sequence: 'G', title: 'Chapter ending', stage: 'ending',
    transition: { kind: 'black', duration: 1.8 },
    advance: { mode: 'end' },
  },
];
