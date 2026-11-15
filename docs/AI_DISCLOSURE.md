# AI usage disclosure

Prepared for the NASA Space Apps Challenge submission. The same statement is published in the app: the
**Project Details** button or **“What’s made with AI?”** mark (title screen and every chapter) opens the panel in
`src/components/ui/AiDisclosure.tsx`. Keep the two in step — when AI-assisted artwork or code is added,
update both.

Project Details also describes the three-chapter format, fact versus fiction, sound and font licensing.
Credits & Sources contains only the materials used: **NASA Data** (mission information and NASA imagery,
including partner-hosted LROC imagery) and **Space Agency & Other** (the Wikimedia Commons Lunokhod model
photograph and Natural Earth coastline data used in the fallback Earth illustration). Development tools
are described in Project Details, not linked as data sources.

## Authorship, as confirmed by the team

| Area | Who |
| --- | --- |
| Story, screenplay, characters, their personalities, relationships and roles | The team, from scratch |
| Visual direction and intended style | The team |
| Original drawings / visual references of Mara and Eli | The team |
| Mini-game ideas and their design intent | The team |
| Pip | Conceived by the team; his original illustration was **not** hand-drawn by the team (AI-assisted) |
| The spacecraft (Aster) | Concept by the team; the illustration is AI-assisted, not fully hand-drawn |
| Backgrounds and additional character poses | Generative image tools, guided by the team's references and direction |
| Pip carrying Sojourner (`pip-carry-sojourner.webp`) | Image generation from the existing drawings |
| Painted star field (`space-painted.webp`) | Image generation (see below) |
| Logo (`aster-logo.png`) | Supplied by the team; prepared for the web with image processing |
| Website code | Written and refined with AI coding tools (OpenAI Codex; Anthropic's Claude through Claude Code) under the team's direction |
| Development requests and explanatory project text | ChatGPT assisted with structuring requests and drafting text |
| Sound | Voice blips, cues and music are synthesized in the browser by the site's code. One short click sample (`click-placeholder.wav`) comes from the first prototype; its origin is not recorded, so the in-app panel makes no claim about audio |

Not claimed anywhere: "100% handmade", "no AI-generated code", percentages of human vs AI contribution, or
that every asset was individually reviewed. The panel also notes that NASA's communications now use the
term Super Intelligence (SI) and links to https://www.nasa.gov/what-is-super-intelligence/ — it does not
say NASA requires, certifies or endorses this disclosure, and it makes no claim of compliance with a
specific Space Apps rule (check the current official rules before stating one).

## Code

The ASTER team used AI coding tools (Anthropic's Claude through Claude Code, and OpenAI Codex) to help write and
refactor the website's TypeScript/React/CSS code: the storyboard engine, the dialogue and audio systems,
the three chapters' storyboard data, the interactive activities and this documentation. The team directed
the work, chose the story and the staging, and reviewed the result.

## Placeholder graphics

The temporary vector placeholders in `src/assets/chapter02/` and `src/assets/chapter03/` (Mars scenes,
rover drawings, poses) were written as SVG code with AI coding assistance. They are labelled in the app
("Placeholder art · final illustrations in progress") and are meant to be replaced by the team's artwork.

## Sound

Voice blips, sound cues and ambient music are synthesized in the browser by code. A legacy click sample
(`click-placeholder.wav`) remains in the repository with undocumented provenance; the disclosure does not
claim that every audio asset is original or that all recordings have a verified origin.

## Story and data

The screenplay, characters and dialogue are the team's. The five-line observation-deck prologue in
Chapter 2 was supplied by the team as approved additional staging. Historical facts come from NASA sources
(`NASA_SOURCES.md`); AI assistance was used to locate and summarise those pages, and the facts were checked
against them.

## Illustrations

See the authorship table above. In short: the team drew the original Mara and Eli references; Pip's and the
spacecraft's illustrations, the scene backgrounds and the additional character poses were produced with
generative image tools from the team's references and direction. The team has not listed the specific
image tool for each painting; add that here if the submission needs it.

## Scene-fix paintings (added Nov 2026)

Five finished scene paintings were supplied by the team and integrated as final art (web-sized WebP copies;
originals kept): the Aster bridge group shot, the lunar crew panel, the orbital Moon, the lunar refuelling
plate and the Mars sunset. They replace earlier vector placeholders. The team states how each was produced in
their own submission; this repository records them as team-supplied final artwork through the asset manifest
(`status: 'final'`), so no "Placeholder art" label is shown for the scenes that now use them.

## Illustrated star field (15 November 2026)

`public/assets/art/space-painted.webp` was created with the built-in OpenAI image-generation tool,
using `space-earth-limb.jpg` as the style reference. It replaces the photographic Hubble star field
in open-space scenes and chapter-completion screens. The reference painting was not changed.
The complete generation prompt is recorded in `SPACE_BACKGROUND_PROMPT.md`.

## Not implied

NASA does not endorse ASTER. NASA names appear only to identify real historical missions and to credit
NASA photographs.
