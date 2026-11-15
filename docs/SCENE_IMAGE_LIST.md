# Список картинок по сценам (для генерации)

Это рабочий список для художников и для генерации картинок другим ИИ. Для каждой картинки указано:
где она используется на сайте, что на ней, ракурс, поза и эмоция персонажа, фон, размер и **имя файла**.
Для каждой картинки есть готовый промпт на английском: генераторы лучше понимают английский.

## Перед генерацией — прочитайте

**1. Давайте генератору референсы.** Чтобы персонажи были похожи сами на себя, прикладывайте:
- `Photos/photo_1_2026-11-14_21-50-02.jpg` — лист персонажа Мары (спереди, сбоку, сзади);
- `Photos/IMG_0090.PNG` — Мара и Эли в кабине;
- `public/assets/art/moon-crew.webp` — все трое в скафандрах, Пип в полный рост;
- `Photos/IMG_0117.PNG` — стиль фона и света.

**2. Общий стиль** — добавляйте эту строку в начало **каждого** промпта:

> `hand-drawn 2D anime illustration, painterly science-fiction graphic novel, soft hand-painted lighting, subtle brush texture, muted colors, clean dark outlines, cinematic composition, not photorealistic, no 3D render, no text, no logos`

**3. Персонажи — всегда одинаковые:**

| Персонаж | Как выглядит |
|---|---|
| **Мара** (капитан) | Короткие тёмно-каштановые волнистые волосы с чёлкой, веснушки, спокойное лицо, взрослая женщина ~30 лет. В корабле: серый комбинезон, коричневый жилет-панель на груди, тёмный пояс. Снаружи: белый герметичный скафандр со шлемом, лицо видно через стекло. |
| **Эли** (инженер) | Короткие светлые (блонд) растрёпанные волосы, сине-зелёные глаза, живое выразительное лицо, ~28 лет. В корабле: серый комбинезон с оранжевыми лямками. Снаружи: такой же белый скафандр, как у Мары, с оранжевыми акцентами. |
| **Пип** (робот) | Маленький — **ростом примерно по пояс людям** (около 45 % их роста). Квадратная голова-коробка, тёмный экран вместо лица (глаза — светящиеся линии), круглая оранжевая лампа сбоку головы, тонкая антенна, белое/серое тело, две механические руки с кистями, две короткие ноги, магнитные ступни, маленький рюкзак. **Без шлема.** |
| **Sojourner** | Настоящий марсоход NASA 1997 года: маленький (как микроволновка), 6 колёс с шипами на рычажной подвеске, плоская солнечная панель сверху, тонкая антенна, камеры спереди. Пыльный, старый, **не работает**. |

**4. Запрещено:** логотипы NASA, шевроны и надписи миссий на скафандрах и технике (правило Space Apps). Используйте значок ASTER или оставляйте нашивки пустыми. Без текста на картинках.

**5. Прозрачный фон.** Генераторы обычно не умеют делать прозрачный фон. Для **персонажей и предметов** генерируйте на **ровном однотонном фоне** (чисто-белом или ярко-зелёном), без теней на полу, персонаж целиком в кадре. Фон вырежу я.

**6. Размеры.** Сцены (фоны) — 16:9, лучше 1920×1080 или крупнее. Персонажи — вертикальная картинка, персонаж в полный рост, ноги видны.

**7. Пометка ИИ.** Картинки, сделанные ИИ, нужно указать в `docs/AI_DISCLOSURE.md`: так требуют правила конкурса.

---

## ГЛАВА 2 — Марс

### Обязательные (без них Глава 2 на заглушках)

#### 2.1 Место находки — средний план · `mars-digsite.jpg` · фон 16:9
- **Где:** почти вся Глава 2 после посадки (знакомство с «дедушкой», возвращение из прошлого) и почти вся Глава 3.
- **Что:** ровная пыльная марсианская равнина, камера на уровне груди человека. Небо светлое, рыжевато-бежевое («ириска»), вдали низкие холмы, разбросаны камни. **Внизу посередине — пустое ровное место**: там будут стоять трое героев и маленький ровер. Без персонажей, без ровера, без корабля.
- **Промпт:** `wide shot of a flat dusty Martian plain near an old landing site, camera at chest height, pale butterscotch dusty sky, low distant hills, scattered dark rocks, empty open ground in the lower middle of the frame, calm quiet ancient atmosphere, warm muted orange and ochre palette, no people, no vehicles, 16:9`

#### 2.2 То же место крупно · `mars-closeup.jpg` · фон 16:9
- **Где:** сцена стирания пыли и появление Sojourner; в Главе 3 — табличка с именем.
- **Что:** вид совсем низко над землёй: мелкая пыль, камешки, мягкие тени. Середина кадра пустая — туда ставится ровер.
- **Промпт:** `low close-up view of Martian ground, fine reddish dust and small pebbles, soft warm light, shallow depth, empty center of the frame, warm muted orange palette, no objects, 16:9`

#### 2.3 Sojourner · `sojourner.png` · предмет, прозрачный фон
- **Где:** Главы 2 и 3 — самая используемая картинка после фонов.
- **Поза/ракурс:** ¾ вид, нос смотрит **вправо**. Сбоку на корпусе — **пустая прямоугольная табличка** (имя SOJOURNER сайт напишет сам).
- **Промпт:** `the small six-wheeled Mars Pathfinder rover Sojourner, three-quarter view facing right, rocker-bogie suspension, six cleated wheels, flat solar panel on top, thin antenna mast, small cameras at the front, a blank rectangular nameplate on its side, old and covered in red Martian dust, inactive, isolated on plain white background, full object visible`

#### 2.4 Мара в марсианском скафандре · `mara-mars.png` · персонаж
- **Поза:** стоит в полный рост, ¾ поворот **вправо**, руки опущены, спокойное нейтральное лицо (видно через стекло шлема).
- **Промпт:** `[Mara description] wearing a white sealed spacesuit with helmet, face visible through the clear visor, standing full body, three-quarter view facing right, arms relaxed, calm neutral expression, isolated on plain white background`

#### 2.5 Эли в марсианском скафандре · `eli-mars.png` · персонаж
- **Поза:** стоит в полный рост, ¾ поворот **влево** (смотрит на Мару), руки опущены или одна на поясе, лёгкая улыбка.
- **Промпт:** `[Eli description] wearing the same white sealed spacesuit with orange accents and helmet, face visible through visor, standing full body, three-quarter view facing left, relaxed pose, slight smile, isolated on plain white background`

#### 2.6 Пип на Марсе · `pip-mars.png` · персонаж
- **Поза:** стоит прямо, ¾ поворот вправо, руки опущены. **Экран лица пустой и тёмный** (глаза рисует сайт).
- **Промпт:** `[Pip description], standing full body, three-quarter view facing right, arms down, face screen blank dark (no eyes), small backpack, no helmet, isolated on plain white background`

### Желательные

#### 2.7 Марс из космоса · `mars-globe.png` · предмет
- **Где:** подлёт к Марсу. Круглая планета целиком, видна полярная шапка.
- **Промпт:** `the planet Mars seen from orbit, whole round planet, visible polar ice cap, soft lighting, painterly, isolated on plain black background`

#### 2.8 Вход в атмосферу · `mars-descent.jpg` · фон 16:9
- **Что:** вид с большой высоты: изогнутый горизонт Марса, тонкая пыльная дымка атмосферы, сверху тёмный космос. Без корабля.
- **Промпт:** `high altitude view of Mars during atmospheric entry, curved horizon, thin hazy dusty atmosphere glowing orange, dark space above, no spacecraft, 16:9`

#### 2.9 Равнина для посадки · `mars-landscape.jpg` · фон 16:9
- **Где:** посадка Aster и прогулка экипажа. Справа место для приземлившегося корабля, слева от центра — небольшой бугор пыли.
- **Промпт:** `wide panoramic Martian plain under a dusty sky, open flat area on the right side, a small mound of dust left of center, distant hills, warm muted palette, no people, no vehicles, 16:9`

#### 2.10 Aster стоит на Марсе · `aster-mars.png` · предмет
- **Что:** корабль Aster (как в `aster.webp`) **приземлившийся**: выпущены посадочные опоры, на корпусе рыжая пыль. ¾ вид.
- **Референс:** `public/assets/art/aster.webp`.

#### 2.11 Посадочный модуль Pathfinder 1997 · `pathfinder-recon.png` · предмет
- **Где:** воспоминание 1997 года. **Должно выглядеть как рисунок в архивных тонах, не как фото.**
- **Что:** треугольный посадочный модуль с раскрытыми лепестками-панелями, вокруг сдутые подушки безопасности, камера на мачте, рампа для ровера.
- **Промпт:** `illustrated reconstruction of the 1997 Mars Pathfinder lander, three open triangular solar petals, deflated airbags around the base, camera mast, a ramp for the rover, sepia archival tones, clearly an illustration, isolated on plain background`

#### 2.12 Мини-игра — вид сверху · прозрачный фон
- `game-rover.png` — Sojourner строго сверху, нос вправо;
- `game-rock.png` — камень сверху;
- `game-target.png` — бугристый камень «Barnacle Bill» сверху;
- `game-ground.jpg` — марсианский грунт сверху, без объектов, 12:7.

---

## ГЛАВА 3 — Наследие

### Обязательные

#### 3.1 Мара на одном колене · `mara-kneel.png` · персонаж
- **Где:** последний салют — Мара протирает табличку Sojourner.
- **Поза:** в марсианском скафандре, стоит **на одном колене**, корпус наклонён вперёд, **правая рука вытянута вперёд-вниз** (как будто стирает пыль), смотрит вниз, лицо тихое и грустное. Повёрнута **вправо**.
- **Промпт:** `[Mara description] in the white sealed spacesuit, kneeling on one knee, leaning forward, right gloved hand reaching forward and down as if gently wiping dust, looking down, quiet sad respectful expression, side view facing right, isolated on plain white background`

#### 3.2 Мара отдаёт честь · `mara-salute.png` · персонаж
- **Поза:** стоит **по стойке смирно**, правая рука поднята к краю шлема в **военном салюте**, левая рука прямо вдоль тела, ¾ поворот вправо, серьёзное спокойное лицо. **Масштаб и положение — как у `mara-mars.png`.**
- **Промпт:** `[Mara description] in the white sealed spacesuit, standing at attention, right hand raised to the brow of the helmet in a military salute, left arm straight at her side, three-quarter view facing right, serious calm expression, full body, isolated on plain white background`

#### 3.3 Пип держит ровер · `pip-carry.png` · персонаж
- **Где:** «Мы берём дедушку с собой» и закат.
- **Поза:** обе механические руки **вытянуты вперёд**, локти согнуты, **ладони раскрыты вверх** на уровне груди — как будто держит коробку. Ровер **не рисовать**: его кладёт сайт. Экран лица пустой. ¾ поворот вправо.
- **Промпт:** `[Pip description], both mechanical arms extended forward with elbows bent, hands open palms up at chest height as if carefully holding a box, nothing in his hands, face screen blank dark, three-quarter view facing right, isolated on plain white background`

#### 3.4 Марсианский закат · `mars-sunset.jpg` · фон 16:9 (лучше шире)
- **Где:** эмоциональная кульминация — экипаж уходит к кораблю.
- **Что:** широкая равнина на закате, тёплое пыльное небо, маленькое бледное солнце низко над горизонтом с **голубоватым сиянием вокруг** (так выглядит настоящий закат на Марсе), длинные тени. Горизонт примерно на 60 % высоты. **Без людей и без корабля.**
- **Промпт:** `wide panoramic Martian landscape at sunset, small pale sun low on the horizon surrounded by a cool blue glow, warm dusty sky fading to dusk, long shadows across the plain, quiet emotional mood, horizon at about 60 percent height, no people, no spacecraft, 16:9 or wider`

### Желательные

#### 3.5 Голограммы марсоходов · прозрачный фон, вид сбоку, простые контуры одним цветом
- `holo-sojourner.png`, `holo-spirit.png`, `holo-opportunity.png`, `holo-curiosity.png`, `holo-perseverance.png`;
- сайт сам красит их в голубой «голографический» цвет;
- Spirit и Opportunity могут быть одной картинкой, Curiosity и Perseverance — тоже.
- **Промпт:** `clean simple line drawing of the NASA [rover name] Mars rover, side view, single color lines on plain white background, technical illustration, no text, no logos`

#### 3.6 Общий план: трое идут к кораблю (опционально)
Если хотите одну красивую финальную картину целиком, а не собранную из слоёв: `final-walk.jpg`, 16:9. Закат, вдали Aster, Мара и Эли идут к нему, Пип рядом несёт маленький Sojourner на руках, все со спины, вид сзади-сбоку, силуэты на фоне неба.

---

## ГЛАВА 1 — Луна (желательно, сейчас там векторные заглушки)

| Файл | Что | Поза / ракурс |
|---|---|---|
| `pip-ship.png` | Пип внутри корабля | стоит, ¾ вправо, пустой экран лица, без рюкзака |
| `lunar-base.png` | Лунная база (вымышленная, будущее): купола, антенна, огни | вид сбоку, прозрачный фон, без логотипов |
| `refuel-gantry.png` | Заправочная башня с рукой-шлангом | вид сбоку, прозрачный фон |
| `moon-globe.png` | Луна из космоса | целиком, на чёрном фоне |
| `apollo-recon.png` | Рисованная реконструкция Eagle на Луне, 1969 | архивные сепия-тона, явно рисунок |

## Исправить существующую картинку

| Файл | Что поправить |
|---|---|
| `public/assets/art/moon-crew.webp` | Убрать **логотипы NASA** с трёх скафандров (у Мары, Эли и Пипа), заменить значком ASTER или оставить нашивки пустыми. Убрать значки окна в правом верхнем углу. Размер и композицию не менять. |

---

## Как отдать картинки

Положите готовые файлы в папку `Photos/` (или любую) и напишите мне. Я вырежу фон, подгоню размеры,
положу в `public/assets/art/`, подключу в манифесте и поставлю персонажей на нужные места в сценах.
Порядок важности: **2.1 → 2.3 → 2.4–2.6 → 3.3 → 3.1–3.2 → 3.4 → 2.2**, потом остальное.
