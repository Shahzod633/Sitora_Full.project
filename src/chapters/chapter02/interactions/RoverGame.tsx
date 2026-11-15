import React from 'react';
import ActivityHud from '../../../components/interactions/ActivityHud';
import SceneArt from '../../../components/visual/SceneArt';
import { useAudio } from '../../../components/audio/AudioContext';
import { useStoryActions } from '../../../story/StoryActions';
import type { FxProps } from '../../../story/fxRegistry';
import { apxs } from '../../../data/missions';

// Interaction C — a short, gentle reconstruction of Sojourner's first science drive in 1997.
//
// The reader drives the rover from the lander to the marked rock ("Barnacle Bill") and switches on the
// APXS. Three ways to drive: arrow keys / WASD, the on-screen pad (press and hold), or tap the ground to
// send the rover there. "Drive there for me" is the alternative for readers who cannot or do not want to
// steer. Rocks block the way; nothing can be failed and there is no timer.
//
// The board is a simplified, not-to-scale illustration. No measurement values are shown: the "spectrum" is
// an animation labelled as such, and the finding quoted afterwards comes from NASA (data/missions.ts).

/** Board units. */
const W = 120, H = 70;
const ROVER_R = 4.6;
const SPEED = 15; // units per second: the whole drive takes about 20–40 seconds at a relaxed pace
const START = { x: 31, y: 47 };
const LANDER = { x: 15, y: 52, r: 11 };
const TARGET = { x: 100, y: 30, r: 6.5 };
const ROCKS = [
  { x: 52, y: 29, r: 6 }, { x: 62, y: 53, r: 5.5 }, { x: 80, y: 21, r: 5 }, { x: 84, y: 47, r: 6.5 }, { x: 44, y: 13, r: 4.5 },
] as const;
const SOLIDS = [...ROCKS, TARGET, LANDER];
/** Close enough to press the instrument against the rock. */
const REACH = TARGET.r + ROVER_R + 3.2;
/** Route used by "Drive there for me" (clear of every rock). */
const AUTO_ROUTE = [{ x: 48, y: 44 }, { x: 66, y: 40 }, { x: 88, y: 32 }];

type Vec = { x: number; y: number };
type Phase = 'drive' | 'analyzing' | 'result';

const blocked = (p: Vec) =>
  p.x < ROVER_R || p.x > W - ROVER_R || p.y < ROVER_R || p.y > H - ROVER_R ||
  SOLIDS.some(s => Math.hypot(p.x - s.x, p.y - s.y) < s.r + ROVER_R);

const KEY_DIRS: Record<string, Vec> = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
};

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

export default function RoverGame({ id }: FxProps) {
  const { interactionTarget, interact, paused } = useStoryActions();
  const { playCue } = useAudio();
  const live = interactionTarget === id;
  const [phase, setPhase] = React.useState<Phase>('drive');
  const [near, setNear] = React.useState(false);
  const [note, setNote] = React.useState('');
  const rover = React.useRef<HTMLDivElement>(null);
  const board = React.useRef<HTMLDivElement>(null);
  const state = React.useRef({
    pos: { ...START }, heading: 0, keys: new Set<string>(), pad: null as Vec | null,
    route: [] as Vec[], lastCue: 0, near: false,
  });
  const driving = live && !paused && phase === 'drive';

  const place = React.useCallback(() => {
    const el = rover.current;
    const s = state.current;
    if (!el) return;
    el.style.left = pct(s.pos.x, W);
    el.style.top = pct(s.pos.y, H);
    el.style.setProperty('--heading', `${s.heading}deg`);
  }, []);
  React.useLayoutEffect(place, [place]);

  // One animation loop while the reader is driving. It stops when the activity is paused or finished.
  React.useEffect(() => {
    if (!driving) return;
    const s = state.current;
    let frame = 0;
    let previous = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      let dir: Vec | null = null;
      if (s.pad) dir = s.pad;
      else if (s.keys.size) {
        const sum = { x: 0, y: 0 };
        s.keys.forEach(key => { sum.x += KEY_DIRS[key].x; sum.y += KEY_DIRS[key].y; });
        if (sum.x || sum.y) dir = sum;
      }
      if (dir) s.route = [];
      else if (s.route.length) {
        const goal = s.route[0];
        const dx = goal.x - s.pos.x, dy = goal.y - s.pos.y;
        if (Math.hypot(dx, dy) < 0.8) s.route.shift();
        else dir = { x: dx, y: dy };
      }
      if (dir) {
        const length = Math.hypot(dir.x, dir.y) || 1;
        const vx = (dir.x / length) * SPEED * dt, vy = (dir.y / length) * SPEED * dt;
        // Slide along a rock rather than stopping dead: try the full move, then each axis alone.
        const tries = [{ x: s.pos.x + vx, y: s.pos.y + vy }, { x: s.pos.x + vx, y: s.pos.y }, { x: s.pos.x, y: s.pos.y + vy }];
        const next = tries.find(p => !blocked(p) && (p.x !== s.pos.x || p.y !== s.pos.y));
        if (next) {
          const target = (Math.atan2(next.y - s.pos.y, next.x - s.pos.x) * 180) / Math.PI;
          const turn = ((target - s.heading + 540) % 360) - 180;
          s.heading += turn * Math.min(1, dt * 9);
          s.pos = next;
          place();
          if (now - s.lastCue > 260) {
            s.lastCue = now;
            playCue('rover');
          }
        } else if (s.route.length) {
          s.route = [];
          setNote('A rock is in the way. Steer around it, or tap somewhere else.');
        }
      }
      const isNear = Math.hypot(s.pos.x - TARGET.x, s.pos.y - TARGET.y) <= REACH;
      if (isNear !== s.near) {
        s.near = isNear;
        setNear(isNear);
        if (isNear) {
          playCue('tick');
          setNote('');
        }
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [driving, place, playCue]);

  const analyze = React.useCallback(() => {
    if (!driving || !state.current.near) return;
    state.current.route = [];
    state.current.keys.clear();
    setPhase('analyzing');
    playCue('apxs');
  }, [driving, playCue]);

  React.useEffect(() => {
    if (phase !== 'analyzing' || paused) return;
    const timer = window.setTimeout(() => setPhase('result'), 2600);
    return () => window.clearTimeout(timer);
  }, [phase, paused]);

  // Keyboard driving. Listens on the window so the reader does not have to focus the board first.
  React.useEffect(() => {
    if (!driving) return;
    const s = state.current;
    const down = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (KEY_DIRS[key]) {
        e.preventDefault();
        s.keys.add(key);
      } else if ((e.key === ' ' || e.key === 'Enter') && !(e.target as HTMLElement).closest?.('button, a, input')) {
        e.preventDefault();
        analyze();
      }
    };
    const up = (e: KeyboardEvent) => { s.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key); };
    const clear = () => { s.keys.clear(); s.pad = null; };
    // Capture phase: the rover moves before the player's own → handler sees the key.
    window.addEventListener('keydown', down, true);
    window.addEventListener('keyup', up, true);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down, true);
      window.removeEventListener('keyup', up, true);
      window.removeEventListener('blur', clear);
      clear();
    };
  }, [driving, analyze]);

  const tapBoard = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!driving || (e.target as HTMLElement).closest('button')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const goal = { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
    state.current.route = [{ x: Math.min(W - ROVER_R, Math.max(ROVER_R, goal.x)), y: Math.min(H - ROVER_R, Math.max(ROVER_R, goal.y)) }];
    setNote('');
  };

  const autoDrive = () => {
    if (!driving) return;
    // Join the prepared route at the first waypoint that is still ahead of the rover.
    const ahead = AUTO_ROUTE.filter(p => p.x > state.current.pos.x + 2);
    state.current.route = ahead.length ? ahead : [AUTO_ROUTE[AUTO_ROUTE.length - 1]];
    setNote('Sojourner is driving to the rock.');
  };

  const pad = (dir: Vec, label: string, glyph: string, area: string) =>
    <button type="button" className="pad-button" style={{ gridArea: area }} aria-label={label} disabled={!driving}
      onPointerDown={e => { e.preventDefault(); state.current.pad = dir; }}
      onPointerUp={() => { state.current.pad = null; }} onPointerLeave={() => { state.current.pad = null; }}
      onPointerCancel={() => { state.current.pad = null; }}
      onClick={e => {
        // Keyboard or switch activation (no pointer): take one short step in that direction.
        if (e.detail !== 0) return;
        const p = state.current.pos;
        state.current.route = [{ x: Math.min(W - ROVER_R, Math.max(ROVER_R, p.x + dir.x * 9)), y: Math.min(H - ROVER_R, Math.max(ROVER_R, p.y + dir.y * 9)) }];
      }}>{glyph}</button>;

  return <div className="activity rover-game" data-active={live} data-phase={phase} data-no-advance>
    <p className="recon-label game-label">Simplified reconstruction · Mars Pathfinder, 1997 · not to scale</p>
    <div ref={board} className="game-board" onPointerDown={tapBoard}
      role="img" aria-label="Top view of the landing site: the Pathfinder lander on the left, the rover Sojourner, several rocks, and a marked rock on the right.">
      <SceneArt asset="gameGround" className="game-ground"/>
      <div className="game-lander" style={{ left: pct(LANDER.x, W), top: pct(LANDER.y, H), width: pct(LANDER.r * 2.6, W) }}>
        <span className="game-lander-body"/><span className="game-tag">Lander</span>
      </div>
      {ROCKS.map((rock, i) =>
        <div key={i} className="game-rock" style={{ left: pct(rock.x, W), top: pct(rock.y, H), width: pct(rock.r * 2.5, W), rotate: `${i * 67}deg` }}>
          <SceneArt asset="gameRock" className="game-sprite"/>
        </div>)}
      <div className={`game-rock game-target${near ? ' is-near' : ''}`} style={{ left: pct(TARGET.x, W), top: pct(TARGET.y, H), width: pct(TARGET.r * 2.5, W) }}>
        <SceneArt asset="gameRockTarget" className="game-sprite"/>
        <span className="game-ring"/>
        <span className="game-tag">“Barnacle Bill”</span>
      </div>
      <div ref={rover} className="game-rover" style={{ width: pct(ROVER_R * 2.9, W) }}>
        <SceneArt asset="gameRover" className="game-sprite game-rover-sprite"/>
        {phase !== 'drive' && <span className="game-apxs"/>}
      </div>
      {phase === 'analyzing' && <div className="apxs-scan" role="status">
        <strong>APXS measuring…</strong>
        <span className="apxs-bars" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.09}s` }}/>)}</span>
        <small>Illustrative animation — not mission data</small>
      </div>}
    </div>

    {phase === 'result' && <section className="apxs-result" aria-labelledby="apxs-title">
      <p className="archive-kicker"><span className="archive-badge">Documented history</span> Mars Pathfinder · July 1997</p>
      <h2 id="apxs-title">{apxs.name} <span>(APXS)</span></h2>
      <p>{apxs.what}</p>
      <p><strong>How it works.</strong> {apxs.how}</p>
      <p><strong>What Sojourner found.</strong> {apxs.finding}</p>
      <p className="archive-sources">Sources: {apxs.sources.map((source, i) => <React.Fragment key={source.url}>
        {i > 0 && ' · '}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
      </React.Fragment>)}</p>
      <button type="button" className="activity-button" autoFocus onClick={() => interact(id)}>See how long Sojourner kept going</button>
    </section>}

    {live && phase === 'drive' && <ActivityHud className="rover-hud">
      <p className="activity-title">{near ? 'In position' : 'Drive Sojourner to the marked rock'}</p>
      <p>{near
        ? 'Sojourner is beside the rock. Switch on its instrument to find out what the rock is made of.'
        : 'Use the arrow keys or the pad, or tap the ground to send the rover there. Rocks block the way.'}</p>
      {note && <p className="activity-note" role="status">{note}</p>}
      <div className="activity-row rover-controls">
        <div className="pad" role="group" aria-label="Drive the rover">
          {pad({ x: 0, y: -1 }, 'Drive up', '▲', 'up')}
          {pad({ x: -1, y: 0 }, 'Drive left', '◀', 'left')}
          {pad({ x: 1, y: 0 }, 'Drive right', '▶', 'right')}
          {pad({ x: 0, y: 1 }, 'Drive down', '▼', 'down')}
        </div>
        <div className="rover-actions">
          <button type="button" className="activity-button" onClick={analyze} disabled={!near}>Analyze with APXS</button>
          <button type="button" className="activity-button is-quiet" onClick={autoDrive} disabled={near}>Drive there for me</button>
        </div>
      </div>
    </ActivityHud>}
  </div>;
}
