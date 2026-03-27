# 3D Sound & Entertainment Website

## Project Overview

Static marketing website for **3D Sound & Entertainment** — a premier event entertainment company founded in 2005, based in Toronto (Scarborough), serving clients globally. The site showcases their DJ/MC roster, services, testimonials, and handles bookings.

**Live URL:** https://www.3dsoundent.com
**Contact:** 3dsoundent@gmail.com
**GitHub Pages:** deployed via CNAME

## Tech Stack

- Pure static HTML/CSS/JS — no build tools, no framework, no npm
- Font: **Plus Jakarta Sans** (Google Fonts, variable weight 200–800)
- Booking form: **HoneyBook** widget (pid: `6795506e6917fe0026f53072`)
- All images converted to **WebP** format for performance
- CSS cache-busted with `?v=3` query string on stylesheet links

## File Structure

```
index.html          — Main single-page site
bookings.html       — Dedicated bookings page with HoneyBook form
thankyou.html       — Post-booking confirmation (noindex)
css/styles.css      — All styles (single file)
js/main.js          — All JS (single file, runs on DOMContentLoaded)
assets/images/      — WebP artist photos + logo variants
assets/audio/vib3s/ — 26 mastered MP3 tracks for the audio player
```

## Page Sections (index.html)

1. **`#hero`** — Full-bleed team photo, headline, CTA buttons
2. **`#showcase`** — About/Our Story, stats (20+ yrs, 500+ events, 30+ countries, 10+ artists)
3. **`#talent`** — Artist roster grid with hover overlays (Book Now + Instagram)
4. **`#services`** — 6 service cards (Weddings, Corporate, Private Parties, Nightlife, Destination, Concerts)
5. **`#testimonials`** — Auto-advancing carousel (5s interval), touch swipe + dot nav
6. **`#booking`** — HoneyBook embedded form CTA

## Artist Roster

**DJs:** DJ JET, DJ Kharish, DJ Gowtham, DJ Soundberry, DJ Miru, DJ Clickz, DJ Rocket, E$TRN, DJ Wavs, DJ Monty, DJ Blaze, DJ VRP, DJ Evity, DJ Shifty

**MCs:** Mister Show Business, MC Moni, MC Cyphr

Each artist card has: photo (WebP), hover overlay with "Book Now" (scrolls to `#booking` + shows inquiry banner) and Instagram link.

## Navigation

- Sticky nav: transparent over hero, turns solid black (`scrolled` class) after scrolling past hero
- Hamburger opens full-screen overlay menu with animated links
- `bookings.html` and `thankyou.html` use `scrolled` class on nav by default (always solid)
- Menu overlay footer contains social links: Instagram, YouTube, Spotify, Apple Music, SoundCloud

## Audio Player (index.html only)

A persistent playback bar at the bottom of the page plays the **VIB3S** album (26 mastered tracks by 3D Sound). Features:
- Bottom playback bar with prev/play/next, progress scrubber, track info
- "Now Playing" full-screen overlay with track list and album art
- Mobile tap-to-reveal card overlays on the talent grid
- Autoplay on first user gesture (browser policy workaround)
- Track 25 (index 24, "Love of Life (Outro)") loads as default on init

## CSS Design System

```css
--twilight-indigo: #000000   /* primary bg */
--steel-azure:     #111111
--baltic-blue:     #333333
--dusty-denim:     #666666
--wisteria-blue:   #999999
--white:           #ffffff
--off-white:       #f0f0f0
--accent:          #829cbc   /* blue-grey accent */
--font-display/body: 'Plus Jakarta Sans'
--nav-height: 80px
--bar-height: 60px           /* audio playback bar */
--container: 1200px
```

Design aesthetic: cinematic, editorial, dark — inspired by jobyaviation.com.

## Social / Streaming Presence

- Instagram: @3dsoundent
- YouTube: @3dsoundent
- Spotify: artist/1a5l5rG8z48axSF6NRK7Xd
- Apple Music: artist/3d-sound/1524553857
- SoundCloud: 3dsoundcrew

## Important Notes

- No build step — edit HTML/CSS/JS directly and push
- CSS is a single file; no preprocessor
- The HoneyBook form div class is `hb-p-6795506e6917fe0026f53072-6`
- `thankyou.html` has `noindex, nofollow` meta — keep it that way
- Images should remain WebP; maintain `width`/`height` attributes for CLS
- The `?v=3` cache buster on the stylesheet should be incremented when making significant CSS changes
