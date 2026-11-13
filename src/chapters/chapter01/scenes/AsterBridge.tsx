import React from 'react';
import './AsterBridge.css';
import SceneArt from '../../../components/visual/SceneArt';
import ChapterFrame from '../../../components/visual/ChapterFrame';
import DialogueBox, { DialogueLine } from '../../../components/dialogue/DialogueBox';
import { assetManifest } from '../../../data/assetManifest';

type Props = {
  onNext: () => void;
};

const dialogueLines: DialogueLine[] = [
  { id: '1', speaker: 'ELI', text: "We're going all the way to Mars, and I still don't know if they have decent coffee there.", expression: 'sarcastic' },
  { id: '2', speaker: 'MARA', text: "Six years of preparation, and you're worried about coffee?", expression: 'serious' },
  { id: '3', speaker: 'ELI', text: "Everyone has their priorities.", expression: 'neutral' },
  { id: '4', speaker: 'PIP', text: "According to medical research, excessive caffeine consumption can—", expression: 'thinking' },
  { id: '5', speaker: 'ELI', text: "Pip, don't start.", expression: 'neutral' },
  { id: '6', speaker: 'PIP', text: "Understood. Disabling concern for your health.", expression: 'neutral' },
];

const AsterBridge: React.FC<Props> = ({ onNext }) => {
  const [dialogueFinished, setDialogueFinished] = React.useState(false);

  const handleDialogueEnd = () => {
    setDialogueFinished(true);
  };

  return (
    <main className="scene aster-bridge">
      <div className="art-stage bridge-stage">
        <SceneArt className="space-sky" asset={assetManifest.backgrounds.spaceStars}/>
        <SceneArt className="window-earth" asset={assetManifest.backgrounds.earth} label="Earth through the bridge windows"/>
        <SceneArt className="cockpit" asset={assetManifest.backgrounds.cockpit} label="Aster flight deck"/>
        <SceneArt className="crew mara" asset={assetManifest.characters.mara} label="Captain Mara"/>
        <SceneArt className="crew eli" asset={assetManifest.characters.eli} label="Engineer Eli"/>
        <SceneArt className="crew pip" asset={assetManifest.characters.pip} label="Pip"/>
      </div>
      <ChapterFrame scene={2}/>
      {dialogueFinished ? (
        <button className="next-button" onClick={onNext}>Continue</button>
      ) : (
        <DialogueBox lines={dialogueLines} onSequenceEnd={handleDialogueEnd} />
      )}
    </main>
  );
};

export default AsterBridge;

