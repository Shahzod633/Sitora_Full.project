import space from '../assets/chapter01/space.svg?raw';
import earth from '../assets/chapter01/earth.svg?raw';
import bridge from '../assets/chapter01/bridge.svg?raw';
import moon from '../assets/chapter01/moon.svg?raw';
import facility from '../assets/chapter01/facility.svg?raw';
import apollo from '../assets/chapter01/apollo.svg?raw';
import aster from '../assets/chapter01/aster.svg?raw';
import mara from '../assets/chapter01/mara.svg?raw';
import eli from '../assets/chapter01/eli.svg?raw';
import pip from '../assets/chapter01/pip.svg?raw';

export type Illustration = { fallback: string; src?: string };

// Add the delivered artwork URL as src. The illustrated fallback stays bundled.
function illustration(fallback: string, src?: string): Illustration {
  return { fallback: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallback)}`, src };
}

export const assetManifest = {
  backgrounds: {
    spaceStars: illustration(space),
    earth: illustration(earth),
    cockpit: illustration(bridge),
    moon: illustration(moon),
    lunarBase: illustration(facility),
  },
  objects: {
    asterSpaceship: illustration(aster),
    apolloDescent: illustration(apollo),
  },
  characters: {
    mara: illustration(mara),
    eli: illustration(eli),
    pip: illustration(pip),
  },
  audio: { click: `${import.meta.env.BASE_URL}assets/audio/click-placeholder.wav` },
};
