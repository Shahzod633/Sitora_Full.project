# Art integration guide

Every picture in ASTER comes from one file: `src/data/assetManifest.ts`. Replacing art never requires
touching React components or the storyboards.

## Replace a placeholder (most cases)

1. Export the artwork per `ASSET_CHECKLIST.md` (size, transparency, framing).
2. Put the file in `public/assets/art/` — e.g. `public/assets/art/sojourner.webp`. Lower-case, no spaces.
3. In `assetManifest.ts`, find the key (e.g. `sojourner`) and set:
   ```ts
   sojourner: asset({ kind: 'object', fallback: sojourner, src: 'assets/art/sojourner.webp',
     aspect: 1600 / 1067, status: 'final', brief: '…' }),
   ```
   - `src` — path relative to `public/` (no leading slash; works locally and on Vercel).
   - `aspect` — **width ÷ height of your file**. This keeps proportions and camera framing correct.
   - `status: 'final'` — removes the "Placeholder art" label from scenes that now use only final art.
4. `npm run dev`, open the scene (see "Jumping to a scene" below), check it, then `npm run build`.

The bundled placeholder (`fallback`) stays as a safety net: if the file is missing or fails to load the
scene still renders — never a blank screen or a broken icon.

## Talking frames (lip-sync)

Paintings with mouth variants use the `talkingPainting` effect. Example (Chapter 2 observation deck,
`src/chapters/chapter02/stages.ts`):

```ts
{ id: 'deck', fx: 'talkingPainting',
  props: { base: 'observationDeck', eli: 'observationDeckEli', mara: 'observationDeckMara' }, … }
```

`base` = all mouths closed; each character key = that character's open-mouth frame. All frames **must
share the exact canvas**. While a line types out, the speaker's frame flaps open/closed; it stops when the
line is complete. A character with no talking frame simply doesn't animate (no invented animation).

## Character poses and expressions

`src/data/characters.ts` → `looks` per costume (`flight`, `deck`, `eva`, `mars`):
- `base` — the standing figure used on stage.
- `expressions: { smile: 'maraMarsSmile', … }` — optional per-expression art (add the keys to the manifest).
- `painted` — portraits cropped from a painting: `focus` is the face position as fractions of the image,
  `zoom` the crop size. Adjust these two numbers after replacing a painting.
Pip's face is drawn by `src/components/visual/PipFace.tsx` on top of his screen; if the new Pip's screen sits
elsewhere, update the `SCREEN` outline there.

Stage poses (Mara kneeling/saluting, Pip carrying) are separate layers in
`src/chapters/chapter03/stages.ts` (`maraKneel`, `maraSalute`, `pipCarry`). If a new drawing's feet are not at
the bottom edge, tweak that layer's `box.y`.

## Positions inside paintings

Characters and objects placed on a painting are child layers with boxes in **% of the painting**, e.g.
`{ id: 'mara', box: { x: 29, y: 91, h: '50%', anchor: [0.5, 1] } }` = feet at 29 % across, 91 % down,
50 % of the painting tall. When the Mars site painting arrives, adjust these in
`src/chapters/shared/marsSite.ts` so feet sit on the ground. Camera shots follow automatically.

## NASA photographs

`archivePhotos`, `pathfinderPhotos`, `roverPhotos` in the manifest. Save the original to
`public/assets/nasa/<ID>.jpg` and set `available: true`. Keep caption and credit as written.

## Jumping to a scene (development)

`npm run dev`, then open `http://localhost:5173/?chapter=2&beat=M10` and press *Begin Chapter 02*. The
storyboard panel (bottom-left, toggle with `` ` ``) lists every beat and reports data problems.

## Optional mobile crops

Add `mobileSrc: 'assets/art/x-portrait.webp'` next to `src` for a portrait crop used on upright phones.
