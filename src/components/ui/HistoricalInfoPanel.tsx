import React from 'react';
import './HistoricalInfoPanel.css';

export default function HistoricalInfoPanel({ onClose }: { onClose: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useLayoutEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog className="info-panel" ref={ref} aria-labelledby="apollo-history-title"
    onCancel={event => { event.preventDefault(); onClose(); }}>
    <h2 id="apollo-history-title">Apollo 11 – 1969</h2>
    <p>First human landing on the Moon. Neil Armstrong and Buzz Aldrin walked on the lunar surface, while Michael Collins remained in lunar orbit.</p>
    <p><strong>Mission:</strong> Apollo 11</p>
    <p><strong>Year:</strong> 1969</p>
    <p><em>Image placeholder for NASA archival photo.</em></p>
    <p>Source: NASA archives (to be added)</p>
    <button className="close-button" onClick={onClose}>Close</button>
  </dialog>;
}
