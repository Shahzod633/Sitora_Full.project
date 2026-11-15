import React from 'react';
import CharacterPortrait from '../../components/dialogue/CharacterPortrait';

/** A separate comic cutaway, not a replacement face pasted onto the rear-view painting.
 * The approved turnaround portrait already has Mara's slight smile. Timing lives on the line ID.
 */
export default function ObservationReaction() {
  return <div className="observation-reaction" role="img" aria-label="Mara gives a small smile">
    <CharacterPortrait speaker="mara" costume="deck" expression="smile"/>
  </div>;
}
