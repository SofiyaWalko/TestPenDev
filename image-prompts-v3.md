# Промпты для изображений v3 (светлый стеклянный стиль, рендеры на прозрачном фоне)

Модель: OpenAI `gpt-image-1`. Промпты на английском, потому что так результат стабильнее.
Каждый промпт = STYLE (общий блок) + сцена. Копируйте оба.
Файл `image-prompts.md` относится к старой тёплой версии (v1, v2). Для v3 он не подходит.

## Параметры вызова API (`images/generations`)

```json
{
  "model": "gpt-image-1",
  "prompt": "<STYLE + сцена>",
  "size": "1536x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png"
}
```

- Для кадров 1-9 ставьте `background: transparent` и `png`.
- Для кадра 10 (фон отзывов) ставьте `background: opaque`.
- Для аватаров ставьте `background: opaque`, размер 1024×1024.

## STYLE (вставлять в начало каждого промпта)

```
Photorealistic 3D product render, premium minimal tech aesthetic in the spirit of high-end consumer hardware. Soft large softbox lighting from the top left, gentle rim light on the edges, crisp physically accurate reflections and refractions, fine surface detail, accurate perspective, shallow depth of field only where noted. Neutral monochrome palette: smoked translucent polycarbonate, brushed and anodized aluminum, matte PBT keycaps in graphite, charcoal and light gray. Keycaps have blank surfaces without legends. The subject is isolated and floating: fully transparent background, no floor, no ground shadow, no backdrop, no reflection plane. No text, no logos, no watermarks.
```

## Правила единства серии
- Генерируйте в одной сессии. Для кадров 2-9 передавайте удачный кадр №1 как референс через `images/edits`: так сохраняются форма, материал и свет.
- Одна «героиня» — клавиатура 68 клавиш с дымчатым поликарбонатным корпусом и алюминиевой ручкой. Она одна и та же в кадрах 1, 2 и 9.
- Тень под объектом рисуется в Pencil (размытый эллипс), поэтому на PNG тени быть не должно.
- Размер при генерации, а не вставке, должен быть минимум в 1,5 раза больше рамки в макете: так остаются резкие края.

## Размеры и вставка

| № | Рамка в Pencil | Генерировать | Фон |
|---|---|---|---|
| 01 | Hero (760×560) | 1536×1024 | прозрачный |
| 02 | Разнесённая сборка (640×500) | 1536×1024 | прозрачный |
| 03 | Thock 65 Smoke (344×230) | 1536×1024 | прозрачный |
| 04 | Thock 75 Frost (344×230) | 1536×1024 | прозрачный |
| 05 | Thock 80 Graphite (344×230) | 1536×1024 | прозрачный |
| 06 | Шаг 01 «Выбираешь» (344×220) | 1536×1024 | прозрачный |
| 07 | Шаг 02 «Собираем» (344×220) | 1536×1024 | прозрачный |
| 08 | Шаг 03 «Получаешь» (344×220) | 1536×1024 | прозрачный |
| 09 | Партия №08 (560×400) | 1536×1024 | прозрачный |
| 10 | Фон отзывов (1440×800) | 1536×1024 | обычный |
| А | Аватары ×3 (52×52) | 1024×1024 | обычный |

## 01 — Hero

```
[STYLE] A compact 65% mechanical keyboard with 68 keys, smoked translucent polycarbonate case with visible internal layers through the shell, matte graphite and light gray PBT keycaps, a CNC-machined aluminum rotary knob in the top right corner. Floating in the air at a dynamic three-quarter angle viewed from slightly above, tilted about 15 degrees, the whole keyboard fully in frame with margins on all sides. Subtle rim light along the case edges.
```

## 02 — Разнесённая сборка

```
[STYLE] An exploded view of the same 65% mechanical keyboard, all layers floating separated vertically in perfect alignment, three-quarter view from slightly above. From top to bottom: a row of matte graphite keycaps, an aluminum rotary knob at the top right, a smoked translucent polycarbonate top shell, a layer of mechanical switches with metal stems, a brushed metal plate, a green-free neutral gray PCB, a smoked translucent bottom case, tiny screws and stabilizers floating between the layers. Clean technical diagram feel with realistic materials, whole composition fully in frame.
```

## 03 — Thock 65 Smoke

```
[STYLE] A compact 65% mechanical keyboard with a smoked translucent polycarbonate case and matte charcoal keycaps with a few light gray accent keys, floating in a three-quarter view from slightly above, keyboard fully in frame, calm and elegant.
```

## 04 — Thock 75 Frost

```
[STYLE] A 75% mechanical keyboard with a frosted matte white-silver anodized aluminum case and soft white and pale gray PBT keycaps, one light gray accent key, floating in a three-quarter view from slightly above, keyboard fully in frame, bright and airy.
```

## 05 — Thock 80 Graphite

```
[STYLE] An 80% tenkeyless mechanical keyboard with a dark graphite anodized aluminum case and deep charcoal keycaps with light gray accent keys, a thin brushed metal edge accent, floating in a three-quarter view from slightly above, keyboard fully in frame, bold and understated.
```

## 06 — Шаг 01 «Выбираешь»

```
[STYLE] Three PBT keycaps standing in a neat row with slight depth between them: the first in smoked translucent gray, the second in frosted white, the third in graphite, plus one mechanical switch and a small matte gray rectangular card with rounded corners (blank, no text) floating beside them. Three-quarter view from slightly above, objects fully in frame, balanced composition.
```

## 07 — Шаг 02 «Собираем»

```
[STYLE] Assembly tools floating in the air in a balanced arrangement: metal tweezers holding one transparent mechanical switch, a handful of loose switches, a fine lubing brush with a drop of translucent grease, a small precision screwdriver, tiny brass screws and a brushed metal plate fragment. Macro product look, crisp details, objects fully in frame, three-quarter view.
```

## 08 — Шаг 03 «Получаешь»

```
[STYLE] An open matte light gray cardboard box floating at an angle, blank unbranded, with soft white tissue paper folds and a mechanical keyboard with a smoked translucent case partially emerging from the box, next to it a small matte pouch with a few loose graphite and light gray keycaps spilling out. Three-quarter view from slightly above, everything fully in frame.
```

## 09 — Партия №08

```
[STYLE] The same 65% mechanical keyboard with smoked translucent polycarbonate case, graphite and light gray keycaps and aluminum knob, viewed from directly above with a gentle 20 degree rotation and slight perspective, floating, the whole keyboard fully in frame with margins, key details sharp and symmetrical.
```

## 10 — Фон секции отзывов (обычный фон, не прозрачный)

Для этого кадра убрать из STYLE последнюю строку про прозрачный фон и поставить `background: opaque`:

```
Photorealistic interior product photography, premium minimal tech aesthetic. A clean light gray desk in soft diffused daylight from a window on the left, a silver monitor at the right edge slightly out of focus, a compact smoked translucent mechanical keyboard with graphite keycaps in the lower center, a white ceramic mug at the far left, subtle shadows, calm neutral palette of whites and grays, wide composition with empty space on the left third for text. No text, no logos, no watermarks.
```

## А — Аватары (3 шт.)

```
Friendly natural portrait, head and shoulders, soft window light from the left, neutral light gray seamless background, neutral relaxed expression, minimal casual clothing in white, gray or black tones, photorealistic, subtle film grain, no text, no logos.
```

Добавьте в конец:
- Артём, 27: `a young man with short dark hair and light stubble, wearing a charcoal crewneck.`
- Мария, 31: `a woman with a shoulder-length bob, wearing a light gray knit sweater.`
- Илья, 24: `a young man with curly hair and round glasses, wearing a white t-shirt.`

Это вымышленные люди. Для реальных фото нужно согласие.

## Если края «грязные»

Дымчатый прозрачный корпус на прозрачном фоне модель иногда рисует с серым ореолом или частичной прозрачностью. Проверяйте результат на светло-сером фоне. Если ореол заметен:
1. Сгенерируйте тот же кадр с `background: opaque` на ровном светло-сером фоне (добавьте в промпт: `on a plain flat light gray background`).
2. Уберите фон инструментом `Generate("remove-background", url)` в Pencil или любым вырезателем.
