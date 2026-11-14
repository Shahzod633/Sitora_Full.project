import React from 'react';
import '../../../components/ui/HistoricalInfoPanel.css';
import ArchivePhotoFigure from '../../../components/archive/ArchivePhotoFigure';
import { pathfinderPhotos } from '../../../data/assetManifest';
import { sources } from '../../../data/missions';

// Sequence 5 — the mission record the crew opens: documented history, visually separate from the story.
// The story never claims the rover is transmitting anything: this is the archive kept from 1997.
export default function PathfinderRecord() {
  return <section className="archive-panel" aria-labelledby="pathfinder-title" data-no-advance>
    <header className="archive-head">
      <p className="archive-kicker"><span className="archive-badge">Documented history</span> NASA record · 1997</p>
      <h2 id="pathfinder-title">Mars Pathfinder and the rover Sojourner</h2>
    </header>
    <div className="archive-body">
      <div className="archive-text">
        <p className="archive-lead">
          On 4 July 1997 Mars Pathfinder landed in Ares Vallis, an ancient flood plain on Mars. Two sols later a
          small six-wheeled rover rolled down its ramp: <em>Sojourner</em>, the first rover to explore another planet.
        </p>
        <dl className="archive-facts">
          <div><dt>Launch</dt><dd>4 December 1996, Cape Canaveral</dd></div>
          <div><dt>Landing</dt><dd>4 July 1997, Ares Vallis</dd></div>
          <div><dt>Rover</dt><dd>10.5 kg, six wheels, solar powered</dd></div>
          <div><dt>Size</dt><dd>63 cm long, 28 cm high</dd></div>
        </dl>
        <p>
          Sojourner carried cameras and one science instrument, the Alpha Proton X-ray Spectrometer, to find out
          what Martian rocks and soil are made of. It was named after the American civil-rights crusader
          Sojourner Truth.
        </p>
      </div>
      <div className="archive-photos">
        {pathfinderPhotos.map(photo => <ArchivePhotoFigure key={photo.nasaId} photo={photo}/>)}
      </div>
    </div>
    <footer className="archive-note">
      <p>
        <strong>Fact and fiction.</strong> Everything on this page is documented history. What follows is a
        simplified reconstruction built from the mission archive, not footage, and not a signal from the rover:
        the Sojourner in our story no longer works.
      </p>
      <p className="archive-sources">
        Sources: <a href={sources.pathfinder.url} target="_blank" rel="noreferrer">{sources.pathfinder.label}</a>
        {' · '}<a href={sources.pathfinderRover.url} target="_blank" rel="noreferrer">{sources.pathfinderRover.label}</a>
      </p>
    </footer>
  </section>;
}
