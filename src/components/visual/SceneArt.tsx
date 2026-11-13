import React from 'react';
import { assets, currentUrl, finalUrl, loadUrl, type AssetDef, type AssetId } from '../../data/assetManifest';

type Props = {
  asset: AssetId;
  className?: string;
  label?: string;
  portrait?: boolean;
};

// Paints the bundled illustration immediately and swaps in the final artwork once it has decoded.
// A missing or broken final file keeps the bundled illustration.
export default function SceneArt({ asset, className = '', label, portrait = false }: Props) {
  const def: AssetDef = assets[asset];
  const target = finalUrl(def, portrait);
  const [url, setUrl] = React.useState(() => currentUrl(asset, portrait));

  React.useEffect(() => {
    if (!target) {
      setUrl(def.fallback);
      return;
    }
    let active = true;
    void loadUrl(target).then(ok => {
      if (active) setUrl(ok ? target : def.fallback);
    });
    return () => { active = false; };
  }, [target, def.fallback]);

  return <span
    className={`scene-art fit-${def.fit ?? 'contain'} ${className}`}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    style={{ backgroundImage: `url("${url.replace(/"/g, '%22')}")` }}
  />;
}
