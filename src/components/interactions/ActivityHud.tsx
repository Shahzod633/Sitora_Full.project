import React from 'react';
import { createPortal } from 'react-dom';
import './activity.css';

/** Element in the player chrome (outside the camera) where activities put instructions and controls,
 * so they keep a fixed, readable size whatever the camera is doing. */
export const HUD_SLOT_ID = 'aster-activity-hud';

type Props = { children: React.ReactNode; className?: string };

/** Renders `children` into the player's HUD slot. Renders nothing until the slot exists. */
export default function ActivityHud({ children, className = '' }: Props) {
  const [slot, setSlot] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => { setSlot(document.getElementById(HUD_SLOT_ID)); }, []);
  if (!slot) return null;
  return createPortal(<div className={`activity-hud ${className}`} data-no-advance>{children}</div>, slot);
}

/** Labelled progress bar shared by the activities. `value` is 0–1. */
export function ActivityProgress({ value, label }: { value: number; label: string }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return <div className="activity-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
    <i style={{ width: `${percent}%` }}/>
  </div>;
}
