import React from 'react';
import { publicUrl, type ArchivePhoto } from '../../data/assetManifest';

/** A NASA archival photograph with its caption and credit. Until the file has been added to
 * public/assets/nasa/ (and `available` set in the manifest) it renders as a clearly labelled placeholder,
 * and no request is made for the missing file. A file that fails to load falls back to the same placeholder. */
export default function ArchivePhotoFigure({ photo, compact = false }: { photo: ArchivePhoto; compact?: boolean }) {
  const [broken, setBroken] = React.useState(false);
  return <figure className={compact ? 'archive-figure is-compact' : 'archive-figure'}>
    {photo.available && !broken
      ? <img src={publicUrl(photo.file)} alt={photo.caption} loading="lazy" decoding="async" onError={() => setBroken(true)}/>
      : <div className="photo-placeholder" role="img" aria-label={`Placeholder for NASA photograph ${photo.nasaId}`}>
          <span>Archival photo placeholder</span>
          <strong>{photo.nasaId}</strong>
          <span>NASA image file not yet added</span>
        </div>}
    <figcaption>{photo.caption} <span className="archive-credit">{photo.credit} · {photo.nasaId}</span></figcaption>
  </figure>;
}
