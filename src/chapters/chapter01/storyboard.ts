import type { Beat, LayerTarget } from '../../story/types';
import type { LineId } from './script';

// Chapter 01 storyboard: 34 connected beats across seven reusable stages.
// Pure data. Timings are in seconds. Layer `dx/dy` are % of the viewport; camera shots are named per stage
// (see stages.ts). Progression modes: auto (cinematic, click to fast-forward), dialogue (reader-paced),
// interaction (hotspot), confirm (reading moment), end.
//
// Painted scenes: in the cockpit the `twoShot` painting carries lip-sync (mouths move while a line types);
// on the Moon, lines cut between `crewScene` (who is speaking) and `apolloScene` (what they are looking at).

const show = (duration = 0.5, delay = 0): LayerTarget => ({ opacity: 1, duration, delay, ease: 'sine.inOut' });
const hide = (duration = 0.5, delay = 0): LayerTarget => ({ opacity: 0, duration, delay, ease: 'sine.inOut' });

export const storyboard: Beat<LineId>[] = [
  // ============================================================ SEQUENCE A — THE BEGINNING
  {
    id: 'B01', slug: 'earth', sequence: 'A', title: 'Earth', stage: 'orbit',
    transition: { kind: 'black', duration: 2.4 },
    camera: { from: 'earthNear', to: { shot: 'earthDrift', duration: 9, ease: 'sine.inOut' } },
    layers: { sun: { opacity: 0.62, duration: 6, ease: 'sine.inOut' } },
    caption: [{ kind: 'scene', text: 'The Journey to the Moon' }, { kind: 'narration', text: 'The late 21st century.' }],
    advance: { mode: 'auto', hold: 5.2 },
  },
  {
    id: 'B02', slug: 'distant-object', sequence: 'A', title: 'A distant object', stage: 'orbit',
    from: { aster: { opacity: 0, dx: -42, dy: -26, scale: 0.05, rotation: -6 } },
    layers: { aster: { opacity: 1, dx: -30, dy: -18, scale: 0.17, rotation: -4, duration: 4.2, ease: 'sine.out' } },
    camera: { to: { shot: 'distant', duration: 4.4, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 4 },
  },
  {
    id: 'B03', slug: 'aster-reveal', sequence: 'A', title: 'Aster reveal', stage: 'orbit',
    layers: {
      aster: [
        { dx: -14, dy: -6, scale: 0.6, rotation: -2, duration: 2.8, ease: 'sine.inOut' },
        { dx: 2, dy: 0, scale: 1, rotation: 0, duration: 3.4, ease: 'sine.out' },
      ],
      sun: { opacity: 0.9, duration: 2.4, delay: 1.6, ease: 'sine.inOut' },
      // The artists' hero frame of Aster takes over as the ship settles.
      hero: show(1.5, 4.6),
    },
    camera: { to: [{ shot: 'reveal', duration: 4.6, ease: 'sine.inOut' }, { shot: 'heroDrift', duration: 2.4, ease: 'sine.out' }] },
    caption: { kind: 'narration', text: 'Aster — bound for Mars on humanity’s first settlement mission.' },
    advance: { mode: 'auto', hold: 7 },
  },
  {
    id: 'B04', slug: 'entering-aster', sequence: 'A', title: 'Entering the spacecraft', stage: 'orbit',
    layers: { sun: { opacity: 0.5, duration: 2 } },
    camera: { to: { shot: 'intoWindow', duration: 2.5, ease: 'power2.in' } },
    advance: { mode: 'auto', hold: 2.2 },
  },

  // ============================================================ SEQUENCE B — INSIDE ASTER
  {
    id: 'B05', slug: 'cockpit-establishing', sequence: 'B', title: 'Cockpit establishing shot', stage: 'cockpit',
    transition: { kind: 'push', duration: 1.1 },
    camera: { from: 'windowIn', to: { shot: 'establishing', duration: 2.8, ease: 'power3.out' } },
    layers: { pipDiag: show(0.6, 1.4) },
    caption: { kind: 'location', text: 'Aboard Aster' },
    advance: { mode: 'auto', hold: 3.8 },
  },
  {
    id: 'B06', slug: 'crew-introductions', sequence: 'B', title: 'Introducing the crew', stage: 'cockpit',
    camera: {
      to: [
        { shot: 'maraIntro', duration: 1.4, ease: 'power2.inOut' },
        { shot: 'eliIntro', duration: 1.4, delay: 1.2, ease: 'power2.inOut' },
        { shot: 'pipIntro', duration: 1.4, delay: 1.2, ease: 'power2.inOut' },
      ],
    },
    layers: {
      tagMara: [{ opacity: 1, duration: 0.4, delay: 0.9 }, { opacity: 0, duration: 0.35, delay: 1.2 }],
      tagEli: [{ opacity: 1, duration: 0.4, delay: 3.5 }, { opacity: 0, duration: 0.35, delay: 1.2 }],
      tagPip: [{ opacity: 1, duration: 0.4, delay: 6.1 }, { opacity: 0, duration: 0.35, delay: 1.4 }],
    },
    advance: { mode: 'auto', hold: 8.2 },
  },
  {
    id: 'B07', slug: 'eli-coffee', sequence: 'B', title: "Eli's coffee comment", stage: 'cockpit',
    // Cut in to the two-shot painting; Eli's mouth moves while his line types out.
    layers: { twoShot: show(0.6), pipDiag: hide(0.4) },
    camera: { to: { shot: 'twoEli', duration: 1.2 } },
    dialogue: ['eli-coffee'],
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B08', slug: 'mara-response', sequence: 'B', title: "Mara's response", stage: 'cockpit',
    camera: { to: { shot: 'twoMara', duration: 1.1 } },
    dialogue: ['mara-preparation'],
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B09', slug: 'eli-reaction', sequence: 'B', title: "Eli's reaction", stage: 'cockpit',
    camera: { to: { shot: 'twoEliClose', duration: 0.9, ease: 'power2.out' } },
    dialogue: ['eli-priorities'],
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B10', slug: 'pip-interrupts', sequence: 'B', title: 'Pip interrupts', stage: 'cockpit',
    layers: { twoShot: hide(0.45), pipDiag: show(0.4, 0.3) },
    camera: { to: { shot: 'pipClose', duration: 1 } },
    dialogue: ['pip-caffeine'],
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B11', slug: 'eli-interrupts-pip', sequence: 'B', title: 'Eli interrupts Pip', stage: 'cockpit',
    // Whip from Pip to Eli in the same wide painting (comic timing); his open-mouth frame carries the line.
    layers: { pipDiag: hide(0.2) },
    camera: { to: { shot: 'eliWide', duration: 0.35, ease: 'power3.out' } },
    dialogueDelay: 0.1,
    dialogue: ['eli-dont-start'],
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B12', slug: 'pip-joke', sequence: 'B', title: "Pip's joke", stage: 'cockpit',
    layers: { twoShot: hide(0.45) },
    camera: { to: { shot: 'pipMara', duration: 1 } },
    dialogue: ['pip-disabling-concern'],
    // Screenplay: "Mara smiles." The two-shot's closed-mouth frame has her smiling.
    outro: {
      hold: 2.4, focus: 'mara', expressions: { mara: 'smile' },
      layers: { twoShot: show(0.7) },
      camera: { to: { shot: 'twoMara', duration: 1.8, ease: 'sine.inOut' } },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B13', slug: 'moon-approach', sequence: 'B', title: 'Approaching the Moon', stage: 'cockpit',
    expressions: { mara: 'neutral', eli: 'neutral', pip: 'curious' },
    layers: {
      twoShot: hide(0.6),
      hud: [{ opacity: 1, duration: 0.5, delay: 0.3 }, { opacity: 0, duration: 0.6, delay: 3.4 }],
      consoleGlow: [{ opacity: 0.55, duration: 0.5, delay: 0.3 }, { opacity: 0.2, duration: 1.4 }],
      windowMoon: { opacity: 1, scale: 1.7, duration: 4.8, delay: 0.6, ease: 'sine.inOut' },
      vignette: { opacity: 0.5, duration: 3 },
    },
    sound: [{ cue: 'computer', at: 0.3 }],
    camera: { to: [{ shot: 'establishing', duration: 0.8 }, { shot: 'moonWindow', duration: 4.2, delay: 0.2, ease: 'power1.inOut' }] },
    advance: { mode: 'auto', hold: 5.8 },
  },

  {
    // Wordless beat in the artists' galley painting: Eli gets his coffee after all, Mara glances over,
    // and the Moon fills the window. No dialogue is added to the screenplay.
    id: 'B13A', slug: 'galley-moon', sequence: 'B', title: 'The Moon fills the window', stage: 'galley',
    transition: { kind: 'crossfade', duration: 1.3 },
    layers: { glance: [{ opacity: 1, duration: 0.14, delay: 2.2 }, { opacity: 0, duration: 0.14, delay: 1.7 }] },
    camera: { from: 'coffee', to: { shot: 'moonView', duration: 6.2, delay: 0.6, ease: 'sine.inOut' } },
    caption: { kind: 'location', text: 'Aster galley · lunar approach' },
    advance: { mode: 'auto', hold: 7 },
  },

  // ============================================================ SEQUENCE C — ARRIVAL ON THE MOON
  {
    id: 'B14', slug: 'lunar-orbit', sequence: 'C', title: 'Lunar orbit', stage: 'orbit',
    transition: { kind: 'push', duration: 1.1 },
    from: {
      earthLimb: { opacity: 0 },
      earth: { opacity: 0.9, scale: 0.2, dx: -51, dy: -32 },
      moon: { opacity: 1, dx: 40 },
      aster: { opacity: 1, dx: -36, dy: -12, scale: 0.42, rotation: 2 },
      sun: { opacity: 0.5 },
    },
    layers: { aster: { dx: -6, dy: -3, scale: 0.56, rotation: 0, duration: 5.6, ease: 'sine.inOut' } },
    camera: { from: 'lunarApproach', to: { shot: 'lunarSurface', duration: 5.8, ease: 'sine.inOut' } },
    caption: { kind: 'location', text: 'Lunar orbit' },
    advance: { mode: 'auto', hold: 5.2 },
  },
  {
    id: 'B15', slug: 'lunar-descent', sequence: 'C', title: 'Descent to the lunar base', stage: 'lunarBase',
    transition: { kind: 'crossfade', duration: 1.4 },
    from: { aster: { dx: -18, dy: -46, scale: 0.55, rotation: 4 }, landingGlow: { opacity: 1 } },
    layers: {
      aster: [
        { dx: -6, dy: -16, scale: 0.84, rotation: 2, duration: 3.6, ease: 'sine.out' },
        { dx: -1, dy: -5, scale: 0.95, rotation: 0, duration: 2.2, ease: 'sine.inOut' },
      ],
    },
    camera: { from: 'descentHigh', to: { shot: 'descentTrack', duration: 5.8, ease: 'sine.inOut' } },
    caption: { kind: 'location', text: 'Lunar surface' },
    advance: { mode: 'auto', hold: 5.6 },
  },
  {
    id: 'B16', slug: 'landing-refuelling', sequence: 'C', title: 'Landing and refuelling', stage: 'lunarBase',
    layers: {
      aster: { dx: 0, dy: 0, scale: 1, duration: 1.8, ease: 'power2.out' },
      dust: [{ opacity: 0.8, duration: 0.5, delay: 1.2 }, { opacity: 0, duration: 1.8 }],
      landingGlow: { opacity: 0, duration: 0.8, delay: 1.6 },
      asterThrust: { opacity: 0, duration: 0.8, delay: 1.6 },
      refuelLine: { opacity: 1, duration: 0.6, delay: 2.6 },
      refuelStatus: [{ opacity: 1, duration: 0.5, delay: 2.8 }, { vars: { progress: 0.64 }, duration: 3.6, ease: 'none' }],
      baseGlow: { opacity: 0.7, duration: 2, delay: 2.4 },
    },
    camera: { to: [{ shot: 'landed', duration: 2 }, { shot: 'refuel', duration: 3, delay: 0.6, ease: 'sine.inOut' }] },
    caption: { kind: 'location', text: 'Refuelling stop' },
    advance: { mode: 'auto', hold: 6.6 },
  },
  {
    id: 'B17', slug: 'lunar-exploration', sequence: 'C', title: 'Crossing the lunar surface', stage: 'apolloSite',
    transition: { kind: 'crossfade', duration: 1.3 },
    camera: { from: 'crewArrive', to: { shot: 'crewGroup', duration: 6.5, ease: 'sine.inOut' } },
    caption: [
      { kind: 'scene', text: 'The Legacy of Apollo' },
      { kind: 'narration', text: 'While their spacecraft is being refueled, the crew decides to visit the historic Apollo 11 landing area.' },
    ],
    advance: { mode: 'auto', hold: 6.4 },
  },
  {
    id: 'B18', slug: 'apollo-discovery', sequence: 'C', title: 'Apollo 11 discovery', stage: 'apolloSite',
    layers: { apolloScene: show(1.6) },
    camera: { from: 'apolloWide', to: { shot: 'apolloReveal', duration: 5, ease: 'sine.inOut' } },
    caption: { kind: 'narration', text: 'Eli wants to show Mara and Pip where humanity’s journey beyond Earth truly began.' },
    advance: { mode: 'auto', hold: 5.4 },
  },

  // ============================================================ SEQUENCE D — THE CONVERSATION
  {
    id: 'B19', slug: 'mara-and-eli', sequence: 'D', title: 'Is that really Apollo 11?', stage: 'apolloSite',
    // Mara's question plays over the lander (what she sees); Eli answers on camera.
    camera: { to: { shot: 'apolloFocus', duration: 1.4 } },
    dialogue: ['mara-really-apollo', 'eli-hundred-years'],
    onLine: { 'eli-hundred-years': { layers: { apolloScene: hide(0.6) }, camera: { to: { shot: 'eliCrew', duration: 0.9 } } } },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B20', slug: 'pip-scans', sequence: 'D', title: 'Pip scans the lander', stage: 'apolloSite',
    expressions: { pip: 'scanning' },
    layers: { apolloScene: show(0.6), scanWave: show(0.5, 0.4), apolloReticle: show(0.5, 0.9) },
    sound: [{ cue: 'scan', at: 0.4 }],
    camera: { to: { shot: 'apolloFocus', duration: 1.2 } },
    dialogueDelay: 1.4,
    dialogue: ['pip-object-identified'],
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B21', slug: 'eli-corrects-pip', sequence: 'D', title: 'Eli corrects Pip', stage: 'apolloSite',
    layers: { apolloScene: hide(0.3), scanWave: hide(0.3), apolloReticle: hide(0.3) },
    camera: { to: { shot: 'eliCrew', duration: 0.5, ease: 'power3.out' } },
    dialogueDelay: 0.25,
    dialogue: ['eli-historical-artifact', 'pip-old-equipment'],
    onLine: { 'pip-old-equipment': { camera: { to: { shot: 'pipCrew', duration: 0.8 } } } },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B22', slug: 'final-joke', sequence: 'D', title: 'The final joke', stage: 'apolloSite',
    camera: { to: { shot: 'maraCrew', duration: 1.1 } },
    dialogue: ['mara-exactly', 'pip-humans-strange'],
    onLine: { 'pip-humans-strange': { camera: { to: { shot: 'pipCrew', duration: 1.2, ease: 'sine.inOut' } } } },
    outro: {
      hold: 2.6, focus: 'all', layers: { apolloScene: show(1.4, 0.4) },
      camera: { to: { shot: 'apolloReveal', duration: 2.6, ease: 'sine.inOut' } },
    },
    advance: { mode: 'dialogue' },
  },

  // ============================================================ SEQUENCE E — THE APOLLO 11 FLASHBACK
  {
    id: 'B23', slug: 'interactive-discovery', sequence: 'E', title: 'Explore the landing site', stage: 'apolloSite',
    layers: { apolloScene: show(0.3), apolloHotspot: show(0.6, 0.2) },
    camera: { to: { shot: 'apolloFocus', duration: 0.9 } },
    caption: { kind: 'scene', text: 'Apollo 11 Flashback' },
    advance: { mode: 'interaction', target: 'apolloHotspot', hint: 'Select the Apollo 11 landing site to look back to 1969.' },
  },
  {
    id: 'B24', slug: 'transition-1969', sequence: 'E', title: '1969 — Apollo 11', stage: 'archive',
    transition: { kind: 'archive', duration: 1.5 },
    layers: {
      dateCard: { opacity: 1, duration: 1.2, delay: 0.2 },
      reconLabel: { opacity: 1, duration: 0.8, delay: 1 },
      astronaut: [
        { opacity: 1, duration: 0.5, delay: 1.2 },
        { yp: -12, duration: 2.4, ease: 'sine.inOut' },
        { xp: 0, yp: 0, duration: 1.2, delay: 0.3, ease: 'power1.out' },
      ],
    },
    sound: [{ cue: 'archive', at: 0 }],
    camera: { from: 'wide', to: { shot: 'firstStep', duration: 6, delay: 0.4, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 6.6 },
  },
  {
    id: 'B25', slug: 'lunar-hardware-archive', sequence: 'E', title: 'Lunar hardware archive', stage: 'archive',
    layers: {
      archivePanel: { opacity: 1, duration: 0.8 },
      recon: { opacity: 0.16, duration: 0.8 },
      dateCard: { opacity: 0, duration: 0.5 },
      reconLabel: { opacity: 0, duration: 0.4 },
    },
    camera: { to: { shot: 'wide', duration: 1.2 } },
    // Three records: Apollo 11 + reflector, Lunokhod 1, NASA Apollo LRVs.
    advance: { mode: 'interaction', target: 'archivePanel' },
  },
  {
    id: 'B26', slug: 'return-to-future', sequence: 'E', title: 'Back to the present', stage: 'apolloSite',
    transition: { kind: 'present', duration: 1.4 },
    from: { apolloScene: { opacity: 1 }, vignette: { opacity: 0.45 } },
    camera: { from: 'apolloReveal', to: { shot: 'apolloWide', duration: 5.5, ease: 'sine.inOut' } },
    // Screenplay: "For a few seconds, the characters remain silent."
    advance: { mode: 'auto', hold: 5 },
  },

  // ============================================================ SEQUENCE F — WHAT REMAINS
  {
    // Additional dialogue inserted after the lunar archive: Pip puts the two rovers side by side,
    // Eli draws the line forward to Mars. Original screenplay lines follow unchanged.
    id: 'B26A', slug: 'rovers-compared', sequence: 'F', title: 'One rover was driven from Earth', stage: 'apolloSite',
    layers: { apolloScene: hide(1) },
    camera: { to: { shot: 'pipCrew', duration: 1.6, ease: 'sine.inOut' } },
    dialogueDelay: 0.6,
    dialogue: ['pip-one-from-earth', 'eli-little-robot-mars'],
    onLine: { 'eli-little-robot-mars': { camera: { to: { shot: 'eliCrew', duration: 1 } } } },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B27', slug: 'reflection', sequence: 'F', title: 'Reflection', stage: 'apolloSite',
    layers: { apolloScene: hide(1.6) },
    camera: { to: { shot: 'maraCrew', duration: 2.2, ease: 'sine.inOut' } },
    dialogueDelay: 1.4,
    dialogue: ['mara-never-imagined', 'eli-neither-can-we'],
    onLine: { 'eli-neither-can-we': { camera: { to: { shot: 'maraEli', duration: 2, ease: 'sine.inOut' } } } },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B28', slug: 'pip-question', sequence: 'F', title: "Pip's question", stage: 'apolloSite',
    camera: { to: { shot: 'pipCrew', duration: 1.4 } },
    dialogue: ['pip-still-important', 'eli-exactly'],
    onLine: { 'eli-exactly': { camera: { to: { shot: 'eliCrew', duration: 0.9 } } } },
    // Screenplay: "Pip pauses."
    outro: {
      hold: 2.2, focus: 'pip', expressions: { pip: 'processing' },
      layers: { pipThinking: show(0.4, 0.5) },
      camera: { to: { shot: 'pipCloser', duration: 1.8, ease: 'sine.inOut' } },
    },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B29', slug: 'saving-memory', sequence: 'F', title: 'Saving the memory', stage: 'apolloSite',
    layers: { pipThinking: hide(0.3) },
    camera: { to: { shot: 'pipCloser', duration: 0.6 } },
    dialogueDelay: 0.3,
    dialogue: ['pip-saving-memory'],
    onLine: { 'pip-saving-memory': { sound: [{ cue: 'save', at: 1.4 }] } },
    // Pip's first small smile: the painting already shows his happy face; a quiet chip confirms the memory.
    outro: { hold: 2.8, focus: 'pip', expressions: { pip: 'content' }, layers: { pipSaved: [show(0.5, 0.3), hide(0.6, 1.6)] } },
    advance: { mode: 'dialogue' },
  },
  {
    id: 'B30', slug: 'leaving-apollo', sequence: 'F', title: 'Leaving Apollo', stage: 'apolloSite',
    // The crew heads back toward the base and Aster; one last look at the untouched site.
    expressions: { mara: 'neutral', eli: 'neutral' },
    camera: { to: [{ shot: 'toBase', duration: 3.2, ease: 'sine.inOut' }, { shot: 'apolloWide', duration: 2.8, ease: 'sine.inOut' }] },
    layers: { apolloScene: show(1.6, 3) },
    advance: { mode: 'auto', hold: 6 },
  },
  {
    id: 'B31', slug: 'departure', sequence: 'F', title: 'Departure', stage: 'lunarBase',
    transition: { kind: 'crossfade', duration: 1.3 },
    layers: {
      landingGlow: { opacity: 1, duration: 0.6, delay: 0.6 },
      dust: [{ opacity: 0.7, duration: 0.6, delay: 0.8 }, { opacity: 0, duration: 2 }],
      aster: [
        { dy: -2.5, duration: 1.3, delay: 0.6, ease: 'power1.in' },
        { dy: -62, dx: 6, scale: 0.72, rotation: -3, duration: 3.8, ease: 'power2.in' },
      ],
      baseGlow: { opacity: 0.6, duration: 2 },
    },
    sound: [{ cue: 'rumble', at: 0.6 }],
    camera: { from: 'liftoffNear', to: { shot: 'liftoffSky', duration: 4.6, delay: 0.8, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 5.6 },
  },
  {
    id: 'B32', slug: 'toward-mars', sequence: 'F', title: 'Toward Mars', stage: 'orbit',
    transition: { kind: 'crossfade', duration: 1.4 },
    from: {
      earthLimb: { opacity: 0 },
      earth: { opacity: 0.85, scale: 0.15, dx: -52, dy: -36 },
      moon: { opacity: 1, dx: -6, dy: 26, scale: 1.25 },
      aster: { opacity: 1, dx: -16, dy: 6, scale: 0.7, rotation: -2 },
      sun: { opacity: 0.35 },
    },
    layers: {
      aster: { dx: 34, dy: -26, scale: 0.08, rotation: -1, duration: 7, ease: 'sine.in' },
      mars: { opacity: 1, duration: 2.5, delay: 2.5 },
      moon: { dx: -10, dy: 30, scale: 1.1, duration: 7, ease: 'sine.out' },
    },
    camera: { from: 'departNear', to: { shot: 'wide', duration: 6.5, ease: 'sine.inOut' } },
    advance: { mode: 'auto', hold: 6.6 },
  },
  {
    id: 'B33', slug: 'chapter-ending', sequence: 'F', title: 'Chapter ending', stage: 'ending',
    transition: { kind: 'black', duration: 1.6 },
    advance: { mode: 'end' },
  },
];
