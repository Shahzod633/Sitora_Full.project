import React from 'react';
import { Illustration } from '../../data/assetManifest';

type Props = {
  asset: Illustration;
  className: string;
  label?: string;
};

// Keep bundled artwork painted while a replacement loads or fails to decode.
export default function SceneArt({ asset, className, label }: Props) {
  const [loaded, setLoaded] = React.useState<string>();
  React.useEffect(() => {
    if (!asset.src) return;
    let active = true;
    const image = new Image();
    const url = asset.src;
    image.src = url;
    image.decode().then(() => {
      if (active) setLoaded(url);
    }).catch(() => {});
    return () => { active = false; };
  }, [asset.src]);

  const selected = asset.src && loaded === asset.src ? asset.src : asset.fallback;
  return <span className={`scene-art ${className}`} role={label ? 'img' : undefined}
    aria-label={label} aria-hidden={label ? undefined : true}
    style={{ backgroundImage: `url("${selected}")` }} />;
}
