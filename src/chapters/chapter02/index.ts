import type { Chapter } from '../../story/types';
import { registerFx } from '../../story/fxRegistry';
import '../shared/marsFx';
import './chapter02.css';
import DustReveal from './interactions/DustReveal';
import RoverGame from './interactions/RoverGame';
import MissionTimeline from './interactions/MissionTimeline';
import PathfinderRecord from './interactions/PathfinderRecord';
import ObservationReaction from './ObservationReaction';
import { additionalLines, script, scriptOrder, type LineId } from './script';
import { stages } from './stages';
import { storyboard } from './storyboard';

// Chapter 2's activities, rendered by layers with the matching `fx` in stages.ts.
registerFx('dustReveal', DustReveal);
registerFx('roverGame', RoverGame);
registerFx('missionTimeline', MissionTimeline);
registerFx('pathfinderRecord', PathfinderRecord);
registerFx('observationReaction', ObservationReaction);

export const chapter02: Chapter<LineId> = {
  id: 'chapter02',
  number: '02',
  title: 'The Little Explorer',
  ending: {
    kicker: 'Chapter 02 Complete', title: 'The Little Explorer', note: 'To be continued...',
    nextLabel: 'Next', nextValue: 'Those Who Came After',
  },
  additionalLines,
  sequences: {
    A: 'Before Mars',
    B: 'Arrival on Mars',
    C: 'An Unexpected Discovery',
    D: 'Meeting Grandpa',
    E: 'Sojourner’s Memories',
    F: 'Back to the Present',
    G: 'Those Who Continued His Work',
  },
  script,
  scriptOrder,
  stages,
  beats: storyboard,
};
