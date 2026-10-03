# Velmora Resort & Spa: Luxury Resort Landing Page

A responsive landing page for **Velmora Resort & Spa**, a fictional boutique beach resort on Sri Lanka's southern coast.
Built with plain **HTML5, CSS3 and vanilla JavaScript**, with no frameworks or libraries.

> Syntecxhub Frontend Development Internship, Project 2

## Features

- Sticky header that turns into a frosted bar on scroll, with an active-section indicator
- Animated full-screen mobile menu (keyboard accessible: Esc to close, focus trap)
- Full-screen hero with masked headline reveal and a booking / availability panel
- Animated statistics counters (IntersectionObserver)
- Editorial room cards with image zoom and offset grid
- Split-layout experiences section, hairline facilities grid
- Lightweight parallax (no libraries, disabled for reduced-motion users)
- Brand story, guest reviews (swipeable on tablet / mobile), final call to action, multi-column footer
- Fully responsive layouts redesigned at 1200, 992, 768 and 576 px
- Accessible markup: semantic landmarks, skip link, ARIA labels, visible focus states, `prefers-reduced-motion` support
- Non-hero images are lazy-loaded

## Project structure

```
ocean-stays-landing-page/
├── index.html          # Page markup and inline SVG icon sprite
├── style.css           # Design tokens, components, responsive rules
├── script.js           # Navigation, reveals, counters, parallax, forms
├── README.md
└── assets/
    ├── images/         # Optimised photography (≈2 MB total)
    └── icons/
        └── favicon.svg
```

## Run locally

No build step is needed.

1. Open `index.html` in a browser, **or**
2. In VS Code, install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**, **or**
3. From the project folder run `npx serve .` (or `python -m http.server 8000`) and visit the URL it prints.

## Tech

HTML5 · CSS3 (Flexbox, Grid, custom properties) · Vanilla JavaScript (IntersectionObserver, requestAnimationFrame)
Fonts: Cormorant Garamond and Manrope via Google Fonts.

## Image credits

All photographs are from [Unsplash](https://unsplash.com) and used under the Unsplash License.
Velmora and the people quoted on the page are fictional.
