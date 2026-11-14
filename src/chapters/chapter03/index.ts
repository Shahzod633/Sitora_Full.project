import type { Chapter } from '../../story/types';
import { registerFx } from '../../story/fxRegistry';
import '../shared/marsFx';
import '../chapter02/chapter02.css';
import './chapter03.css';
import RoverTimeline from './interactions/RoverTimeline';
import { CrewDisplay, FinalTitle, LegacyLine } from './interactions/Finale';
import { script, scriptOrder, type LineId } from './script';
import { stages } from './stages';
import { storyboard } from './storyboard';

registerFx('roverTimeline', RoverTimeline);
registerFx('crewDisplay', CrewDisplay);
registerFx('legacyLine', LegacyLine);
registerFx('finalTitle', FinalTitle);

export const chapter03: Chapter<LineId> = {
  id: 'chapter03',
  number: '03',
  title: 'Those Who Came After',
  sequences: {
    A: 'The Rover Family',
    B: 'The Rover Timeline',
    C: 'The Connection Between Missions',
    D: 'The Final Salute',
    E: 'One More Passenger',
    F: 'Martian Sunset',
    G: 'The Ending',
  },
  script,
  scriptOrder,
  stages,
  beats: storyboard,
};
