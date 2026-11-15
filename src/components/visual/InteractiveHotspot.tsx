import React from 'react';
import './InteractiveHotspot.css';

type Props = {
  label: string;
  hint?: string;
  /** Only the active hotspot is focusable and clickable; it pulses and shows its label. */
  active: boolean;
  onActivate: () => void;
};

// Fills its parent layer box, so it stays aligned with the artwork under any camera framing.
const InteractiveHotspot: React.FC<Props> = ({ label, hint, active, onActivate }) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (active) ref.current?.focus({ preventScroll: true });
  }, [active]);

  return (
    <button
      ref={ref}
      type="button"
      className="hotspot"
      data-active={active}
      disabled={!active}
      onClick={event => { event.stopPropagation(); onActivate(); }}
      aria-label={hint ? `${label}. ${hint}` : label}
    >
      <span className="hotspot-ring" aria-hidden="true"/>
      <span className="hotspot-marker" aria-hidden="true"/>
      <span className="hotspot-label" aria-hidden="true">
        <strong>{label}</strong>
        {hint && <span>{hint}</span>}
      </span>
    </button>
  );
};

export default InteractiveHotspot;
