import React from 'react';
import './HistoricalInfoPanel.css';
import { archivePhotos, publicUrl } from '../../data/assetManifest';

// Beat 25: documented history, visually separated from the fictional story.
// Photographs are NASA originals listed in assetManifest.archivePhotos; until the files are added they
// render as clearly labelled placeholders (no request is made for a missing file).
export default function HistoricalInfoPanel() {
  return <section className="archive-panel" aria-labelledby="apollo-history-title" data-no-advance>
    <header className="archive-head">
      <p className="archive-kicker"><span className="archive-badge">Documented history</span> NASA record · July 1969</p>
      <h2 id="apollo-history-title">Apollo 11: the first crewed Moon landing</h2>
    </header>
    <div className="archive-body">
      <div className="archive-text">
        <p className="archive-lead">
          On 20 July 1969 the lunar module <em>Eagle</em> landed in the Sea of Tranquility. Neil Armstrong and
          Buzz Aldrin became the first people to walk on the Moon, while Michael Collins orbited above in the
          command module <em>Columbia</em>.
        </p>
        <dl className="archive-facts">
          <div><dt>Launch</dt><dd>16 July 1969, Kennedy Space Center</dd></div>
          <div><dt>Landing</dt><dd>20 July 1969, 20:17 UTC, Tranquility Base</dd></div>
          <div><dt>First step</dt><dd>Neil Armstrong, 21 July 1969, 02:56 UTC</dd></div>
          <div><dt>Return</dt><dd>Splashdown in the Pacific Ocean, 24 July 1969</dd></div>
        </dl>
        <p>
          When the astronauts left, <em>Eagle</em>’s descent stage served as the launch platform for the ascent
          stage and stayed behind. It still stands at Tranquility Base.
        </p>
        <blockquote>
          “That’s one small step for (a) man, one giant leap for mankind.”
          <cite>Neil Armstrong, 21 July 1969</cite>
        </blockquote>
      </div>
      <div className="archive-photos">
        {archivePhotos.map(photo => <figure key={photo.nasaId}>
          {photo.available
            ? <img src={publicUrl(photo.file)} alt={photo.caption} loading="lazy" decoding="async"/>
            : <div className="photo-placeholder" role="img" aria-label={`Placeholder for NASA photograph ${photo.nasaId}`}>
                <span>Archival photo placeholder</span>
                <strong>{photo.nasaId}</strong>
                <span>NASA image file not yet added</span>
              </div>}
          <figcaption>{photo.caption} <span className="archive-credit">{photo.credit} · {photo.nasaId}</span></figcaption>
        </figure>)}
      </div>
    </div>
    <footer className="archive-note">
      <p>
        <strong>Fact and fiction.</strong> The dates, facts and photographs here are documented history.
        The animated first step was an illustrated reconstruction, not archival footage. Aster, its crew, the lunar
        base and the beacon perimeter are fiction; the perimeter reflects NASA’s 2011 recommendation that visitors
        keep at least 75 m from the Apollo 11 descent stage.
      </p>
      <p className="archive-sources">
        Sources: <a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA: Apollo 11</a>
        {' · '}<a href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html" target="_blank" rel="noreferrer">NASA NSSDC Apollo 11 archive</a>
      </p>
    </footer>
  </section>;
}
