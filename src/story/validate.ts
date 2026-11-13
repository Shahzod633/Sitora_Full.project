import type { Chapter, Cue, LayerDef, ShotRef } from './types';

/** Development check of a chapter's data. Returns human-readable problems (empty when valid). */
export function validateChapter(chapter: Chapter): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const spoken: string[] = [];

  const layerIds = (layers: LayerDef[], out = new Set<string>()) => {
    for (const layer of layers) {
      out.add(layer.id);
      if (layer.children) layerIds(layer.children, out);
    }
    return out;
  };

  chapter.beats.forEach(beat => {
    if (ids.has(beat.id)) problems.push(`Duplicate beat id ${beat.id}`);
    ids.add(beat.id);
    const stage = chapter.stages[beat.stage];
    if (!stage) {
      problems.push(`${beat.id}: unknown stage ${beat.stage}`);
      return;
    }
    const layers = layerIds(stage.layers);
    const checkShot = (ref: ShotRef | undefined, where: string) => {
      if (typeof ref === 'string' && !stage.shots[ref]) problems.push(`${beat.id} ${where}: unknown shot "${ref}"`);
    };
    const checkCue = (cue: Cue | undefined, where: string) => {
      if (!cue) return;
      for (const id of Object.keys(cue.layers ?? {})) {
        if (!layers.has(id)) problems.push(`${beat.id} ${where}: unknown layer "${id}" on ${stage.id}`);
      }
      if (cue.camera) {
        checkShot(cue.camera.from, where);
        for (const move of Array.isArray(cue.camera.to) ? cue.camera.to : [cue.camera.to]) checkShot(move.shot, where);
      }
    };
    for (const id of Object.keys(beat.from ?? {})) {
      if (!layers.has(id)) problems.push(`${beat.id} from: unknown layer "${id}"`);
    }
    checkCue(beat, 'layers');
    checkCue(beat.outro, 'outro');
    for (const [line, cue] of Object.entries(beat.onLine ?? {})) {
      if (!beat.dialogue?.includes(line)) problems.push(`${beat.id}: onLine "${line}" is not spoken in this beat`);
      checkCue(cue, `onLine ${line}`);
    }
    for (const line of beat.dialogue ?? []) {
      if (!chapter.script[line]) problems.push(`${beat.id}: unknown line "${line}"`);
      spoken.push(line);
    }
    if (beat.advance.mode === 'dialogue' && !beat.dialogue?.length) problems.push(`${beat.id}: dialogue beat without lines`);
    if (beat.dialogue?.length && beat.advance.mode !== 'dialogue') problems.push(`${beat.id}: lines in a non-dialogue beat`);
    if (beat.advance.mode === 'interaction' && !layers.has(beat.advance.target)) {
      problems.push(`${beat.id}: interaction target "${beat.advance.target}" missing`);
    }
    if (beat.next && !chapter.beats.some(b => b.id === beat.next)) problems.push(`${beat.id}: next "${beat.next}" missing`);
  });

  const expected = chapter.scriptOrder.join(' → ');
  const actual = spoken.join(' → ');
  if (expected !== actual) {
    const missing = chapter.scriptOrder.filter(id => !spoken.includes(id));
    const repeated = spoken.filter((id, i) => spoken.indexOf(id) !== i);
    if (missing.length) problems.push(`Screenplay lines never shown: ${missing.join(', ')}`);
    if (repeated.length) problems.push(`Screenplay lines shown twice: ${repeated.join(', ')}`);
    if (!missing.length && !repeated.length) problems.push('Screenplay lines are out of order');
  }
  return problems;
}
