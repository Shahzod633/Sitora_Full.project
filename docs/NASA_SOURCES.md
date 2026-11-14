# NASA sources and fact checks

All educational content lives in `src/data/missions.ts` (and the Apollo 11 panel in
`src/components/ui/HistoricalInfoPanel.tsx`). Each statement was checked against the pages below in
November 2026. No measurement values are invented: the APXS "spectrum" in the rover game is an animation
labelled *"Illustrative animation — not mission data"*.

## Sources used

| Topic | Source |
|---|---|
| Apollo 11 | https://www.nasa.gov/mission/apollo-11/ · https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html |
| Mars Pathfinder (launch 4 Dec 1996, landing 4 Jul 1997 at Ares Vallis, final transmission 27 Sep 1997, 16,500+ lander images, 550 rover images, 15+ chemical analyses, APXS "determined the elemental composition of rocks and soils", named after Sojourner Truth) | https://science.nasa.gov/mission/mars-pathfinder/ |
| Sojourner rover (10.5 kg; 630 × 480 × 280 mm; six wheels, rocker-bogie; rolled off ~05:40 UT 6 Jul 1997; primary objectives scheduled for the first seven sols within ~10 m of the lander; APXS "to assess the composition of rocks and soil") | https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=MESURPR |
| First rock analysis "Barnacle Bill", Sol 3; rock found to be andesitic | https://www.jpl.nasa.gov/images/pia00634-sojourners-apxs-studies-barnacle-bill/ (PIA00634) |
| Spirit (landed 3 Jan 2004, Gusev Crater, 7.7 km, concluded 2010) and Opportunity (24 Jan 2004, Meridiani Planum, 45.16 km, last contact 10 Jun 2018); confirmed long-standing ancient surface water | https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/ |
| Curiosity (landed 6 Aug 2012, Gale Crater; found chemical and mineral evidence of past habitable environments; active) | https://science.nasa.gov/mission/msl-curiosity/ |
| Perseverance (landed 18 Feb 2021, Jezero Crater; seeks signs of ancient life, collects samples; active; passed Opportunity's distance record Oct 2026) | https://science.nasa.gov/mission/mars-2020-perseverance/ |

## Photographs (catalogue pages)

| ID | Shows | Credit | Catalogue |
|---|---|---|---|
| AS11-40-5903 | Aldrin on the Moon | Neil Armstrong / NASA | nssdc.gsfc.nasa.gov/imgcat/html/object_page/a11_h_40_5903.html |
| AS11-40-5878 | Bootprint | Buzz Aldrin / NASA | nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html |
| AS11-44-6642 | Ascent stage and Earth | Michael Collins / NASA | nssdc.gsfc.nasa.gov/imgcat/html/object_page/a11_h_44_6642.html |
| PIA00634 | APXS on "Barnacle Bill" | NASA/JPL | jpl.nasa.gov/images/pia00634-… |
| PIA00638 | Sojourner near "Barnacle Bill" | NASA/JPL | science.nasa.gov/photojournal/sojourner-near-barnacle-bill/ |
| PIA01466 | Pathfinder 360° panorama | NASA/JPL | science.nasa.gov/photojournal/improved-mpf-360-degree-color-panorama/ |
| PIA18079 | Opportunity self-portrait, 2014 | NASA/JPL-Caltech/Cornell Univ./Arizona State Univ. | photojournal.jpl.nasa.gov/catalog/PIA18079 |
| PIA16239 | Curiosity at "Rocknest" | NASA/JPL-Caltech/MSSS | photojournal.jpl.nasa.gov/catalog/pia16239 |
| PIA24542 | Perseverance with Ingenuity | NASA/JPL-Caltech/MSSS | science.nasa.gov/photojournal/perseverances-selfie-with-ingenuity/ |

The image files are **not** in the build yet (no files were downloaded). Each shows a labelled placeholder.

## Screenplay points flagged for review (dialogue left unchanged)

1. **Days vs sols.** The screenplay's timeline says "Planned Rover Mission: 7 Days / Actual: 83 Days", and
   Mara says "Seven days planned … eighty-three". NASA counts these in **sols** (Martian days, ~24 h 39 min).
   The dialogue is kept verbatim (people say "days" in conversation); the timeline panel shows **7 sols /
   83 sols** and explains that 83 sols ≈ 85 Earth days (4 Jul – 27 Sep 1997). Team: decide whether to keep
   the spoken wording.
2. **"1,086 percent"** — checked: (83 − 7) ÷ 7 = 1,085.7 % ✓. **"Almost twelve times"** — 83 ÷ 7 = 11.9 ✓.
3. **27 September 1997** is the Pathfinder **lander's** final transmission; Sojourner relayed through the
   lander, so the panel says contact with the lander was lost and the rover could no longer reach Earth.
4. **"One of the first robots to explore the surface of Mars"** — accurate: Sojourner was the first *rover*;
   the Viking landers (1976) were earlier robots on the surface.
5. **Rover status** — Spirit and Opportunity are shown as ended; Curiosity and Perseverance as **active**
   (verified Nov 2026). Re-check before submission.
6. **Art:** `moon-crew.webp` shows NASA insignia on the suits (see `EXISTING_ASSETS_INVENTORY.md`).

## Fiction, labelled in the app

Aster, the crew, the lunar refuelling base, the human Mars expedition, the recovery of Sojourner, the
"Heritage Recovery Authorized" display (shown with *"Fictional future authorization — not a NASA policy or
procedure"*), the Mars Colony Museum, and "The Aster expedition" node on the closing line (tagged *Fiction*).
