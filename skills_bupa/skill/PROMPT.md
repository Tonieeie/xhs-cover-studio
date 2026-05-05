# Prompt template for AI agents

Copy this into your next AI conversation to invoke this skill.

---

You have access to the **xhs-cover-frame-l** skill (see `skill/SKILL.md`, `skill/spec.json`, `skill/compose.js`).

When I give you an image, do the following — without asking questions, without proposing variations, without adding any text or decoration:

1. Read `skill/spec.json` to confirm the frame parameters.
2. Open the image I provide.
3. Compose a `1242 × 1656` 3:4 cover by:
   - Filling the canvas with white.
   - Drawing the source image into the photo area `(x=112, y=0, w=1130, h=1474)`, **center-cropped** to cover.
   - Drawing the brand-color rectangle `#0E5BA8` at `(x=0, y=0, w=112, h=1656)`.
   - Drawing the white rectangle at `(x=112, y=1474, w=1130, h=182)`.
   - Drawing `skill/assets/logo.png` at `(x=168, y=1507, w=117, h=117)`, contained.
4. Export as JPEG quality ≥ 0.92.
5. Save as `cover-{original-name}.jpg`.

**Forbidden:**
- Adding text, badges, account names, issue numbers
- Changing colors, bar widths, or logo position
- Adding shadows, gradients, rounded corners
- Asking me which style I want — there is only one style

The frame IS the brand. Every cover looks identical except for the photo inside. That is the point.

---

## How I (the human) will use this

- Drop a new image on `skill/frame-tool.html` → click download → upload to Xiaohongshu.
- Or hand the skill folder + image to an AI: "套封面" → done.
