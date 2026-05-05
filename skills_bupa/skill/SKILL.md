# Skill: Xiaohongshu Cover Frame (L-Frame Brand System)

## What this skill does
Given a single input image, produce a 3:4 Xiaohongshu (小红书) cover by wrapping it in a fixed L-shaped brand frame. The frame is the user's visual signature — it never changes between posts. Only the photo inside changes.

## When to invoke
Trigger this skill when the user:
- Provides an image and asks for "封面" / "小红书封面" / "cover"
- Asks to "套相框" / "加品牌框" / "wrap with frame"
- Wants to publish a new Xiaohongshu post with their consistent brand look

## Inputs
| Name | Required | Description |
|---|---|---|
| `source_image` | yes | Any aspect ratio. Will be cropped center to fit the photo area. |
| `output_path` | no | Defaults to `cover-{timestamp}.jpg` |

## Output
A single `1242 × 1656` JPG (3:4, sRGB, ≤ 5 MB) ready to upload to Xiaohongshu.

## The frame — exact spec
**Canvas:** 1242 × 1656 px, 3:4, white background (`#FFFFFF`).

The frame is two solid bars forming an L shape. **All values are fixed — never change them between posts.**

```
┌──┬───────────────────────────┐
│  │                           │
│  │                           │
│  │                           │
│  │      PHOTO AREA           │   ← source image, center-cropped, cover-fit
│  │      (91% w × 89% h)      │
│  │                           │
│  │                           │
│  │                           │
│  ├───────────────────────────┤
│  │  [LOGO]                   │   ← bottom white bar, logo left-aligned
└──┴───────────────────────────┘
   ↑ 9% wide blue vertical bar    ↑ 11% tall white horizontal bar
```

### Numeric spec (in px, on a 1242×1656 canvas)
| Element | x | y | width | height | fill |
|---|---|---|---|---|---|
| Left vertical bar | 0 | 0 | 112 (9%) | 1656 (100%) | `#0E5BA8` |
| Bottom horizontal bar | 112 | 1474 | 1130 (91%) | 182 (11%) | `#FFFFFF` |
| Photo area | 112 | 0 | 1130 (91%) | 1474 (89%) | source image, `object-fit: cover` |
| Logo | 168 (left of bottom bar + 5% inset) | 1507 (vertically centered in bottom bar) | scaled so height = 117 (64% of 182) | 117 | `assets/logo.png`, contain |

### Percent spec (resolution-independent)
- Left bar: `left:0; top:0; width:9%; height:100%; fill:#0E5BA8`
- Bottom bar: `left:9%; bottom:0; width:91%; height:11%; fill:#FFFFFF`
- Photo: `left:9%; top:0; width:91%; height:89%; object-fit:cover`
- Logo inside bottom bar: `height:64% of bar height; aspect-ratio:1/1; left-aligned with 5% inset; vertically centered`

## Brand assets
- Brand color: `#0E5BA8`
- Logo file: `assets/logo.png` (square, 250×250 source)

## Rules — DO NOT BREAK
1. **Never** change the bar widths, colors, or logo position between posts. Consistency is the entire point.
2. **Never** add text, badges, issue numbers, account names, or decorative elements anywhere. Frame stays empty.
3. **Never** add rounded corners, shadows, or gradients to the bars.
4. The photo is always **center-cropped** to fill the photo area. Never letterbox.
5. Output JPG at quality ≥ 90, sRGB.

## How to execute
Open `frame-tool.html` in a browser. Drop a photo in. Click download.
For programmatic use, see `compose.js` — pure Canvas, no dependencies.

## Files in this skill
- `SKILL.md` — this file
- `frame-tool.html` — drag-and-drop browser tool, exports JPG
- `compose.js` — standalone Canvas function, AI-callable
- `spec.json` — machine-readable spec
- `assets/logo.png` — brand logo
- `examples/` — before/after reference images
