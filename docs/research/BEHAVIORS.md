# Solais.ai Behavior Bible

## Global Behaviors

### Smooth Scroll
- GSAP ScrollSmoother wraps entire page in `#smooth-wrapper` > `#smooth-content`
- Non-native scroll feel: momentum-based
- Implementation: Use `overflow: hidden` on html/body, GSAP ScrollSmoother

### Loading Screen
- 144 brown blocks (12×12 grid) fill screen on load
- Blocks animate in sequentially, then out
- SVG icons cycle through (Solais logo variants, chat icon, search icon, chart icon, arrow icon)
- Binary text streams across center
- "Loading.76" text at bottom fades in

### Header Scroll Behavior
- State A (top): `py-6`, text-white, transparent background
- State B (scrolled): `py-2`/`py-3`, text-brown, white background
- Trigger: scroll position > ~50px
- Transition: `duration-300` CSS transition
- Logo: `header-logo` class — white when dark, brown when light

### Word/Letter Reveal Animations
- Many elements use per-word/per-letter GSAP animation: initial state `transform: translate(0%, 100%); opacity: 0`
- Reveals upward into view (translateY 100% → 0) with stagger

### Blink Animation
- `.blink` class: opacity oscillation
- CSS: `@keyframes blink { 0% { opacity: 1; } 100% { opacity: 0; } }`

## Hero Section Behaviors

### ScrollTrigger Pin
- `#hero-container` contains a `pin-spacer` that is 1090lvh tall
- `#hero-section` is pinned fixed to viewport while scrolling through
- The 3D canvas + overlays transition as user scrolls

### Mesh Labels
- 3 floating label panels (Visibility analysis, Sentiment insight, Actionable direction)
- Position: around the 3D mesh canvas
- Fade in/out based on scroll position

### About Divs (How It Works, scroll-driven)
- 5 `about-div` elements stacked on top of each other, all initially `opacity: 0`
- As user scrolls through pin spacer, each fades in and then out:
  1. "Discovering Your Voice" intro
  2. "01 Strategising - Set your prompts"
  3. "02 Analysing - Track responses"
  4. "03 Optimising - Act with confidence"
  5. "Why brands choose Solais" (bottom left position)

### Cycle Through (Why Brands section)
- `.cycle-through` container on right side
- 4 feature divs inside: Transparent reporting, Functional dashboards, Model visibility, Verified data
- Only one visible at a time (display:flex vs display:none)
- Scroll-driven toggle

## Marquee Behavior
- 6 `marquee-travel` elements with `Solais` text (each letter individually animated to show glitch)
- Transform: `translate(-60.52%, 0%)` — continuous leftward travel
- GSAP: updates transform continuously
- Gap: gradient bar between each instance

## Industry Swiper
- Swiper.js horizontal carousel
- `!cursor-grab` on container
- "Drag" tooltip appears on hover
- Slide width: ~422px each
- 4 slides (looped: 8 total with duplicates)
- Infinite loop with auto-play or drag

## CTA/Footer Section Behaviors
- Word reveal animations triggered by IntersectionObserver or ScrollTrigger
- Active Users number counter: slot-machine animation
  - Two digit columns
  - Column 0: animates DOWN through: 1,2,3,9,7,9 → stops at 9
  - Column 1: animates UP through: 3,3,7,4,4,2 → stops at 2
  - Final number: "92" (displayed at 27vw size)
  - Implementation: GSAP translateY animation on `.number-column-*` elements

## Button Styles

### Button "primary" (Sign In)
- 3 parts: left SVG parallelogram + center div (bg-brown) + right SVG parallelogram
- Creates angled edges on both sides of pill button
- Color: bg-brown (#3c091e), text-white

### Button "second" (Get Started)
- 4 layers of nested `.btn-primary-lines` with `.line-1` and `.line-2` decorative lines
- Text in innermost `.btn-text` 
- On hover: lines animate, creating bracket effect
- Colors vary: `.white` modifier = white version

### Nav Links
- `.nav-link` with `.btn-text` child
- Underline animation on hover

## Responsive Breakpoints
- phone: 36rem (576px)
- mini: 48rem (768px) 
- tablet: 64rem (1024px)
- laptop: 80rem (1280px)
- bigLaptop: 90rem (1440px)
- desktop: 100rem (1600px)

## Supertitle Pattern (used throughout)
```html
<span class="supertitle flex flex-row gap-1">
  <span class="p-0.5 px-3 w-fit bg-[color] text-[color] leading-0 flex items-center">
    Label Text
  </span>
  <div class="bg-[color] min-h-7 w-2"></div>
  <div class="bg-[color] min-h-7 w-1"></div>
</span>
```
- Creates a labeled badge with two trailing bars
