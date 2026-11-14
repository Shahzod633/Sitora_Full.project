# Existing artwork inventory

Inspected November 2026 by opening every file (not by filename). Dimensions and transparency were read from
the files themselves; variations were compared pixel-by-pixel to find exactly which region differs.

**Where the art is.** The team's originals are in `Photos/` in the project root (17 files; first found in
`Desktop\Photos\`, since moved into the project — same files), plus `public/assets/art/` (8 files from the
previous Chapter 1 commit). The originals were **not modified**: web-sized copies (2000 px wide, JPEG
quality 88) were written to `public/assets/art/` under descriptive names. `Photos/` (~70 MB of PNGs) is not
committed to git; the site only needs the copies in `public/`.

Status legend: **Integrated** = used by the running app · **Not integrated** = available, not used yet ·
**Duplicate / alternative** = same image or a variant of one that is integrated.

## Team artwork — `Desktop\Photos\`

| Original file | Size · format · alpha | What it shows | Chapter / scene | Story beats | Status → project copy |
|---|---|---|---|---|---|
| `Space_Background.PNG` | 3344×1882 · PNG · opaque | Deep space, painterly stars, the limb of Earth lower right | Ch1 opening; title screen | Title, B01–B03 | **Integrated** → `space-earth-limb.jpg` (`spaceEarthLimb`) |
| `IMG_0090.PNG` | 3344×1882 · PNG · opaque | Cockpit wide: Mara seated at console, Eli standing arms crossed, Earth in window; both mouths closed | Ch1 Inside Aster | B05–B13 | **Duplicate** of the already-integrated `cockpit-wide.jpg` (`cockpitWide`) |
| `IMG_0089.PNG` | 3344×1882 · PNG · opaque | Same frame, **Eli mouth open** (only his mouth differs) | Ch1 Inside Aster | B11 (Eli speaks in the wide shot) | **Integrated** → `cockpit-wide-eli.jpg` (`cockpitWideEli`, talking frame) |
| `IMG_0095.PNG` | 3344×1882 · PNG · opaque | Cockpit two-shot: Eli leaning over Mara, Earth below; both mouths closed | Ch1 Inside Aster | B07–B12 | **Duplicate** of integrated `cockpit-twoshot-closed.jpg` |
| `IMG_0093.PNG` | same | Same frame, **Eli mouth open** | Ch1 | B07, B09 | **Duplicate** of integrated `cockpit-twoshot-eli.jpg` |
| `IMG_0094.PNG` | same | Same frame, **Mara mouth open** | Ch1 | B08 | **Duplicate** of integrated `cockpit-twoshot-mara.jpg` |
| `IMG_0104.PNG` | 3344×1882 · PNG · opaque | Galley: Eli at the coffee machine, Mara reading a tablet, the Moon fills the window; both mouths closed — **idle / listening** | Ch1 lunar approach | B13A (new wordless beat) | **Integrated** → `galley-idle.jpg` (`galley`) |
| `IMG_0102.PNG` | same | Same, **Eli mouth open** — speaking frame | Ch1 | B13A (ready for dialogue) | **Integrated** → `galley-eli.jpg` (`galleyEli`) |
| `IMG_0103.PNG` | same | Same, **Mara mouth open** — speaking frame | Ch1 | B13A (ready for dialogue) | **Integrated** → `galley-mara.jpg` (`galleyMara`) |
| `IMG_0107.PNG` | same | Same, mouths closed, **Mara's eyes turned toward Eli** | Ch1 | B13A (her glance) | **Integrated** → `galley-glance.jpg` (`galleyGlance`) |
| `IMG_0105.PNG` | same | Eli mouth open + Mara glancing | Ch1 | — | **Alternative** (combination frame; usable if galley dialogue is added) |
| `IMG_0106.PNG` | same | Mara mouth open + Mara glancing | Ch1 | — | **Alternative** (combination frame) |
| `IMG_0117.PNG` | 3344×1882 · PNG · opaque | Observation window from behind: Eli (left) and Mara, Earth below, the Moon beyond; mouths closed — **idle / listening** | Ch2 prologue | M01–M03 | **Integrated** → `observation-closed.jpg` (`observationDeck`) |
| `IMG_0116.PNG` | same | Same, **Eli mouth open** (profile) — speaking frame | Ch2 prologue | M02–M03 Eli lines | **Integrated** → `observation-eli.jpg` (`observationDeckEli`) |
| `IMG_0115.PNG` | same | Same, **Mara mouth open** (profile) — speaking frame | Ch2 prologue | M02–M03 Mara lines | **Integrated** → `observation-mara.jpg` (`observationDeckMara`) |
| `photo_1_2026-11-14_21-50-02.jpg` | 2560×1920 · JPEG · opaque (black) | **Mara character turnaround**: front, ¾, side, rear ¾, back; crew outfit | All | Mara's dialogue portrait on the observation deck | **Integrated** → `mara-turnaround.jpg` (`maraSheet`); also the style reference for all Mara poses |
| `Spaceship.png` | 1448×1086 · PNG · **transparent** | Aster exterior, more saturated colours, transparent background | All | — | **Alternative** of the integrated `aster.webp`. Recommendation: keep `aster.webp` (matches the paintings' muted palette); `Spaceship.png` is a good source if a landed/Mars variant is drawn |

**Frames for simple lip-sync.** Every multi-frame set above shares one canvas (diffs touch only a mouth or
the eyes), so frames are swapped in place: closed = idle/listening; *-eli / *-mara = that character speaking
(the engine alternates it with the closed frame while their line types, ~120 ms per flap, and stops when the
line is complete). Mara's mouth never moves on Eli's lines and vice versa.

## Already in the project — `public/assets/art/` (before this work)

| File | Size · alpha | What it shows | Status |
|---|---|---|---|
| `aster.webp` | 1810×869 · transparent | Aster exterior | **Integrated** (Ch1 B02–B32, title, Ch2 space/descent, stand-in for landed Aster on Mars) |
| `aster-space.webp` | 1672×941 · opaque | Aster in space with Earth (hero) | **Integrated** (B03–B04; Ch3 finale "Aster expedition" card) |
| `cockpit-wide.jpg`, `cockpit-twoshot-*.jpg` | 2000×1125 | See the duplicates above | **Integrated** |
| `apollo-site.jpg` | 1672×941 | Apollo 11 descent stage, Earth in sky | **Integrated** (B18–B30; Ch3 finale Apollo card) |
| `moon-crew.webp` | 1721×914 | Mara, Eli, Pip in EVA suits near the lunar base | **Integrated** (B17–B30; lunar & Mars EVA portraits). ⚠ Needs a small edit — see below |

## Issues found in existing art

1. **`moon-crew.webp` shows the NASA "meatball" insignia on all three suits.** NASA Space Apps rules ask
   teams not to reproduce NASA logos/insignia in their artwork, and the story must not suggest NASA endorses
   Aster. Please repaint the patches with the ASTER mark (or blank). The file also has window-control icons
   in its top-right corner (currently cropped out by framing).
2. Observation and galley paintings: no insignia found. ✓

## Missing (not found anywhere)

Everything Mars-side: landscapes, Sojourner, Mars suits, the salute and carry poses, the sunset, rover
holograms. These are labelled placeholders in the app — see `ASSET_CHECKLIST.md` for the prioritised list.
