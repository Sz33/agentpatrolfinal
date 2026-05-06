# Solais.ai Page Topology

## URL: https://solais.ai/

## Overall Layout
- Smooth scroll via GSAP ScrollSmoother (`#smooth-wrapper` → `#smooth-content`)
- Fixed header overlays all content (z-50)
- Loading screen overlay (z-9999)
- Dark maroon (#3c091e) primary background
- Content flows in a single column

## Sections (Top to Bottom)

### 1. LoadingScreen (fixed overlay, z-9999)
- 144 brown grid blocks (12x12) that animate in/out
- Animated SVG icons cycling
- Binary text animation
- "Loading.76" text at bottom
- **Interaction**: entrance animation on page load, hides after complete

### 2. Header/Nav (fixed, z-50)
- Logo SVG (white/brown depending on scroll state)
- Nav: About / How it works / Advantage / Industries (anchor links)
- Sign In button (custom parallelogram SVG button)
- **Interaction**: scroll-driven — py-6 → py-2 when scrolled, color transitions

### 3. HeroSection (full-height scroll-pinned)
- Three.js 3D mesh canvas background (dark bg)
- H1: "VISIBILITY / IN AI SEARCH" 
- Supertitle: "Analytics for" badge
- Description paragraph (desktop only in full)
- 3 mesh labels floating over 3D: Visibility analysis, Sentiment insight, Actionable direction
- **Interaction**: GSAP ScrollTrigger pin — section is fixed while scrolling through ~1090lvh of content

### 4. HowItWorksSection (overlaid on pinned hero, scroll-driven)
- "Understanding What is Solais?" fade in
- "Discovering Your Voice" heading
- Steps revealed sequentially by scroll:
  - 01 Strategising → "Set your prompts"
  - 02 Analysing → "Track responses"
  - 03 Optimising → "Act with confidence"
- **Interaction**: GSAP ScrollTrigger — about-div elements fade in/out with opacity 0→1 as user scrolls

### 5. WhyBrandsSection (scroll-driven, on pinned hero)
- "Why brands choose Solais" heading (bottom left)
- Feature list cycling on right (scroll-driven):
  - Transparent reporting
  - Functional dashboards
  - Model visibility
  - Verified data
- **Interaction**: cycle-through divs with display:none/flex toggled by scroll position

### 6. MarqueeSection (bg-brown)
- "Solais" text marquee with glitching characters
- Huge font (100-300px depending on viewport)
- Continuous horizontal scroll animation
- **Interaction**: GSAP - marquee-travel elements translate continuously

### 7. DashboardSection (bg-brown)
- dashboard.png image with clip-path parallelogram
- Only visible on desktop (max-tablet:hidden)

### 8. IndustriesSection (bg-brown, #industries)
- "Find Your Industry" h4 + description + "Get Started" button (left col)
- Swiper carousel (right col) with 4 cards:
  - Marketing Teams (ai - 01)
  - Agencies (ai - 02)
  - Brand Managers (ai - 03)
  - Business leaders (ai - 04)
- Each card: parallelogram top/bottom SVG, ai label, white content area, decorative bars
- **Interaction**: Swiper horizontal carousel (drag)

### 9. CTASection (#footer-section, bg-brown)
- "Take control of the conversation" h4
- "AI engines have already formed opinions..." paragraph
- "Get Started" button (second style)
- Active Users counter (slot-machine digit animation)
- **Interaction**: number counter animates on scroll, word reveal animations

### 10. SellPoints (below CTA, bg-brown)
- 3 columns with blink indicator:
  - Schedule a Demo — "See Solais in action..."
  - Set your prompts — "Define the questions..."
  - Track your presence — "See how your brand appears..."

### 11. BigLogo (bg-brown → white transition)
- "S O L A I S" in enormous text (25vw per letter)
- Color: brown on white background
- Footer SVG transition shape above it

### 12. Footer (#footer, bg-white)
- White background
- Solais logo (max-w-[200px], brown)
- Tagline: "People don't search..."
- LinkedIn + Instagram icon buttons (parallelogram background)
- "Explore" links: About, How it works, Advantage, Industries
- "Get started" form: First name, Last name, Email, Submit (Gravity Forms)
- Bottom bar: © 2026 The Start | Terms & conditions | Privacy policy | Site by The Start

## Z-Index Layers
- 9999: Loading screen
- 50: Header
- 30: Hero overlays/labels
- 20: Footer section, big logo
- 10: Background gradients
