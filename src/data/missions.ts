// Documented history shown in the educational panels. Every statement here was checked against the NASA
// pages listed in `sources` (see docs/NASA_SOURCES.md for the verification notes and dates).
// Nothing in this file is fiction, and no measurement values are invented: where the story needs a visual
// (the APXS "spectrum" animation) the UI labels it as an illustration.

export type Source = { label: string; url: string };

export const sources = {
  pathfinder: { label: 'NASA Science — Mars Pathfinder', url: 'https://science.nasa.gov/mission/mars-pathfinder/' },
  pathfinderRover: { label: 'NASA NSSDC — Mars Pathfinder Rover (Sojourner)', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MESURPR' },
  barnacleBill: { label: 'NASA/JPL Photojournal PIA00634 — Sojourner’s APXS studies “Barnacle Bill”', url: 'https://www.jpl.nasa.gov/images/pia00634-sojourners-apxs-studies-barnacle-bill/' },
  mer: { label: 'NASA Science — Mars Exploration Rovers: Spirit and Opportunity', url: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/' },
  curiosity: { label: 'NASA Science — Mars Science Laboratory: Curiosity', url: 'https://science.nasa.gov/mission/msl-curiosity/' },
  perseverance: { label: 'NASA Science — Mars 2020: Perseverance', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/' },
  apollo11: { label: 'NASA — Apollo 11', url: 'https://www.nasa.gov/mission/apollo-11/' },
} satisfies Record<string, Source>;

/** A sol is one Martian day. Mission plans and logs for Mars rovers count sols, not Earth days. */
export const SOL_NOTE = 'A sol is one Martian day: about 24 hours 39 minutes, a little longer than a day on Earth.';

export const pathfinder = {
  planned: { sols: 7, label: 'Planned rover mission' },
  actual: { sols: 83, label: 'Actual rover operation' },
  /** 4 July – 27 September 1997 on the Earth calendar. */
  earthDays: 85,
  events: [
    { date: '4 December 1996', sol: undefined, title: 'Launch',
      text: 'Mars Pathfinder leaves Cape Canaveral, Florida, on a Delta II rocket.' },
    { date: '4 July 1997', sol: 1, title: 'Landing at Ares Vallis',
      text: 'The lander touches down in Ares Vallis, an ancient flood plain in Mars’ northern hemisphere.' },
    { date: '6 July 1997', sol: 2, title: 'Sojourner rolls onto Mars',
      text: 'The six-wheeled, 10.5-kilogram rover drives down its ramp at about 05:40 UT: the first rover on Mars.' },
    { date: 'July 1997', sol: 3, title: 'First rock analysis',
      text: 'Sojourner’s APXS studies the rock “Barnacle Bill”, named for its rough surface.' },
    { date: 'July 1997', sol: 7, title: 'Planned mission complete',
      text: 'The primary objectives were scheduled for the first seven sols, within about 10 metres of the lander. Sojourner keeps going.' },
    { date: '27 September 1997', sol: 83, title: 'Final transmission',
      text: 'The last data arrive from the Pathfinder lander. Contact is lost and never restored; without the lander, Sojourner cannot reach Earth.' },
  ],
  totals: [
    { value: '16,500+', label: 'images from the lander' },
    { value: '550', label: 'images from the rover' },
    { value: '15+', label: 'chemical analyses of rocks and soil' },
  ],
  sources: [sources.pathfinder, sources.pathfinderRover],
} as const;

export const apxs = {
  name: 'Alpha Proton X-ray Spectrometer',
  what: 'APXS determined the elemental composition of Martian rocks and soil: which chemical elements they are made of.',
  how: 'The instrument is held against a rock and exposes it to alpha particles. It then measures the alpha particles, protons and X-rays that come back. Each element answers with its own signature.',
  finding: 'Sojourner’s first rock analysis began on Sol 3 at “Barnacle Bill”. Scientists found the rock to be andesitic: possibly a volcanic rock, or a mixture of particles.',
  sources: [sources.pathfinder, sources.barnacleBill],
} as const;

export type RoverEntry = {
  id: 'sojourner' | 'mer' | 'curiosity' | 'perseverance';
  year: string;
  name: string;
  mission: string;
  /** One sentence in the wording of the screenplay's timeline. */
  summary: string;
  achievements: readonly string[];
  /** Correct mission status. `checked` is when it was last verified against NASA. */
  status: { state: 'ended' | 'active'; text: string };
  more: string;
  source: Source;
};

/** Status of the active missions was verified against NASA pages in November 2026. */
export const STATUS_CHECKED = 'November 2026';

export const roverTimeline: readonly RoverEntry[] = [
  {
    id: 'sojourner', year: '1997', name: 'Sojourner', mission: 'Mars Pathfinder',
    summary: 'Demonstrated that a small robotic rover could explore the Martian surface and investigate rocks and soil.',
    achievements: [
      'First rover to operate on Mars.',
      'Explored for 83 sols of a planned seven-sol mission.',
      'Returned 550 images and helped make more than 15 chemical analyses of rocks and soil.',
    ],
    status: { state: 'ended', text: 'Mission ended: final transmission 27 September 1997.' },
    more: 'Sojourner was named after the American civil-rights crusader Sojourner Truth. It weighed 10.5 kilograms and was about the size of a microwave oven: 63 centimetres long and 28 centimetres high.',
    source: sources.pathfinder,
  },
  {
    id: 'mer', year: '2004', name: 'Spirit and Opportunity', mission: 'Mars Exploration Rovers',
    summary: 'Discovered important geological evidence that liquid water existed on ancient Mars.',
    achievements: [
      'Twin rovers landed on opposite sides of Mars: Spirit on 3 January 2004 in Gusev Crater, Opportunity on 24 January 2004 on Meridiani Planum.',
      'By studying the rock record they confirmed that water was long-standing on the surface of Mars in ancient times.',
      'Opportunity drove 45.16 kilometres, an off-world record that stood until Perseverance passed it in October 2026.',
    ],
    status: { state: 'ended', text: 'Missions ended: Spirit concluded its mission in 2010; Opportunity last communicated on 10 June 2018, during a planet-wide dust storm.' },
    more: 'Spirit drove 7.7 kilometres across Gusev Crater, a possible former lake inside a giant impact crater. Opportunity explored Meridiani Planum, where mineral deposits suggested a wet history.',
    source: sources.mer,
  },
  {
    id: 'curiosity', year: '2012', name: 'Curiosity', mission: 'Mars Science Laboratory',
    summary: 'Found evidence that Mars once had environments capable of supporting microbial life.',
    achievements: [
      'Landed in Gale Crater on 6 August 2012.',
      'Its instruments found chemical and mineral evidence of past habitable environments on Mars.',
      'Analyses rock, soil and air samples on board as it climbs Mount Sharp.',
    ],
    status: { state: 'active', text: 'Active mission: still exploring Gale Crater.' },
    more: 'Curiosity’s objective is to determine whether Mars was ever able to support microbial life. In August 2026 it marked a climb of one kilometre in elevation up Mount Sharp.',
    source: sources.curiosity,
  },
  {
    id: 'perseverance', year: '2021', name: 'Perseverance', mission: 'Mars 2020',
    summary: 'Investigates Mars’s ancient environment, collects rock samples, and searches for possible signs of ancient microbial life.',
    achievements: [
      'Landed in Jezero Crater on 18 February 2021.',
      'Seeks signs of ancient life and collects samples of rock and regolith for possible return to Earth.',
      'In October 2026 it passed Opportunity’s record for the longest distance driven on another world.',
    ],
    status: { state: 'active', text: 'Active mission: still driving in and around Jezero Crater.' },
    more: 'Jezero Crater is 45 kilometres wide and once held a lake and a river delta. Perseverance carried the Ingenuity helicopter, which made the first powered flights on another planet.',
    source: sources.perseverance,
  },
];

/** Milestones on the closing "line of knowledge". `fiction` marks the one invented entry. */
export const legacyMilestones = [
  { id: 'apollo11', year: '1969', name: 'Apollo 11', photo: 'AS11-40-5903' },
  { id: 'sojourner', year: '1997', name: 'Sojourner', photo: 'PIA00638' },
  { id: 'spirit', year: '2004', name: 'Spirit', photo: undefined },
  { id: 'opportunity', year: '2004', name: 'Opportunity', photo: 'PIA18079' },
  { id: 'curiosity', year: '2012', name: 'Curiosity', photo: 'PIA16239' },
  { id: 'perseverance', year: '2021', name: 'Perseverance', photo: 'PIA24542' },
  { id: 'aster', year: 'Late 21st century', name: 'The Aster expedition', photo: undefined, fiction: true },
] as const;
