import React from 'react';
import './ApolloLegacy.css';
import SceneArt from '../../../components/visual/SceneArt';
import ChapterFrame from '../../../components/visual/ChapterFrame';
import DialogueBox, { DialogueLine } from '../../../components/dialogue/DialogueBox';
import { assetManifest } from '../../../data/assetManifest';
import Hotspot from '../../../components/visual/InteractiveHotspot';
import HistoricalInfoPanel from '../../../components/ui/HistoricalInfoPanel';

type Props = {
  onNext: () => void;
};

const dialogueLines: DialogueLine[] = [
  { id: '1', speaker: 'MARA', text: "Is that really Apollo 11?", expression: 'surprised' },
  { id: '2', speaker: 'ELI', text: "Yep. More than a hundred years ago, humans landed here for the very first time.", expression: 'neutral' },
  { id: '3', speaker: 'PIP', text: "Object identified. Age: over one hundred years. Technical condition: outdated. Replacement recommended.", expression: 'thinking' },
  { id: '4', speaker: 'ELI', text: "Pip, that's a historical artifact!", expression: 'neutral' },
  { id: '5', speaker: 'PIP', text: "Understood. Extremely old equipment that humans refuse to throw away.", expression: 'neutral' },
  { id: '6', speaker: 'MARA', text: "Exactly.", expression: 'neutral' },
  { id: '7', speaker: 'PIP', text: "Humans are very strange.", expression: 'neutral' },
];

const ApolloLegacy: React.FC<Props> = ({ onNext }) => {
  const [dialogueFinished, setDialogueFinished] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const handleDialogueEnd = () => {
    setDialogueFinished(true);
  };

  const handleHotspotClick = () => {
    setShowInfo(true);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <main className="scene apollo-legacy">
      <div className="art-stage lunar-stage">
        <SceneArt className="space-sky" asset={assetManifest.backgrounds.spaceStars}/>
        <SceneArt className="lunar-earth" asset={assetManifest.backgrounds.earth} label="Distant Earth"/>
        <SceneArt className="lunar-ground" asset={assetManifest.backgrounds.moon} label="Lunar highlands and cratered ground"/>
        <SceneArt className="lunar-facility" asset={assetManifest.backgrounds.lunarBase} label="Distant lunar facility"/>
        <div className="landing-site">
          <SceneArt className="descent-stage" asset={assetManifest.objects.apolloDescent} label="Apollo 11 descent stage"/>
          <Hotspot x={0.69} y={0.35} width={0.12} height={0.18} onClick={handleHotspotClick} label="Inspect Apollo 11 site"/>
        </div>
      </div>
      <ChapterFrame scene={3}/>
      {showInfo && <HistoricalInfoPanel onClose={closeInfo} />}
      {!dialogueFinished && <DialogueBox lines={dialogueLines} onSequenceEnd={handleDialogueEnd} />}
      {dialogueFinished && !showInfo && (
        <button className="next-button" onClick={onNext}>Continue</button>
      )}
    </main>
  );
};

export default ApolloLegacy;

