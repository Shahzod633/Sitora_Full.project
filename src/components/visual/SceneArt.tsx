import React from 'react';
import { assets, finalUrl, loadUrl, urlState, type AssetDef, type AssetId } from '../../data/assetManifest';

type Props = {
  asset: AssetId;
  className?: string;
  label?: string;
  portrait?: boolean;
};

// Paints the final artwork once it has decoded. While it is still loading the layer stays empty (the
// Director holds a stage back until its art is ready), so a reader never sees a stand-in drawing flash
// before the real one. Only a missing or broken final file falls back to the bundled illustration.
export default function SceneArt({ asset, className = '', label, portrait = false }: Props) {
  const def: AssetDef = assets[asset];
  const target = finalUrl(def, portrait);
  const pick = () => {
    if (!target) return def.fallback;
    const state = urlState(target);
    return state === true ? target : state === false ? def.fallback : '';
  };
  const [url, setUrl] = React.useState(pick);

  React.useEffect(() => {
    setUrl(pick());
    if (!target || urlState(target) !== undefined) return;
    let active = true;
    void loadUrl(target).then(ok => {
      if (active) setUrl(ok ? target : def.fallback);
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, def.fallback]);

  return <span
    className={`scene-art fit-${def.fit ?? 'contain'} ${className}`}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    style={url ? { backgroundImage: `url("${url.replace(/"/g, '%22')}")` } : undefined}
  />;
}
