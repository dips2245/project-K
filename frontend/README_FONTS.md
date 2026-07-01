# How to Install PolySans Font

## Current Setup
The site already uses **Plus Jakarta Sans** (Google Fonts, free) which is a nearly pixel-perfect
match for PolySans Neutral. It loads automatically with zero setup.

## To activate real PolySans (when you get the files)

1. Get PolySans font files from any of these sources:
   - **Official (paid):** https://gradient.type.today/
   - **Trial (personal use):** https://befonts.com/polysans-font-family.html

2. Export/convert to `.woff2` + `.woff` formats (use https://cloudconvert.com/ttf-to-woff2 if needed)

3. Rename files **exactly** as follows and drop into `frontend/public/fonts/`:

```
frontend/
  public/
    fonts/
      PolySans-Slim.woff2       ← weight 300 (Slim/Light)
      PolySans-Slim.woff
      PolySans-Neutral.woff2    ← weight 400 (Regular)
      PolySans-Neutral.woff
      PolySans-Median.woff2     ← weight 500-600 (Medium)
      PolySans-Median.woff
      PolySans-Bulky.woff2      ← weight 700-800 (Bold)
      PolySans-Bulky.woff
```

4. That's it! The CSS `@font-face` rules are already written in `src/styles/index.css`.
   The browser will automatically pick up PolySans over Plus Jakarta Sans.

## Font Stack Order (in CSS)
```
'PolySans' → 'Plus Jakarta Sans' → system-ui → sans-serif
```
- If PolySans files exist in `/public/fonts/` → uses PolySans ✓
- If not → falls back to Plus Jakarta Sans from Google Fonts CDN ✓
- If offline → falls back to system-ui ✓
