# Post-Clone Enhancement Instructions

After every /clone-website run, automatically apply all of the following enhancements to the cloned output. Do not skip any section.

---

## 1. Scroll Animations
- Inspect every section that appears below the fold on the original site
- Add IntersectionObserver-based reveal animations to all of them
- Elements should fade + slide up (translateY 30px → 0) on scroll entry
- Stagger children elements with 100ms delay between each
- Use CSS classes: `.reveal` (initial hidden state) and `.visible` (animated state)
- Apply to: cards, headings, feature blocks, stat numbers, testimonials, logos

## 2. Micro Animations
- All buttons: add hover scale(1.03) + subtle glow matching brand color
- All cards: add hover translateY(-4px) + shadow lift
- All nav links: add hover underline slide-in from left
- All icons: add hover rotate or pulse depending on context
- CTA buttons: add a slow shimmer/shine sweep animation on loop
- Input fields: add focus border glow animation
- All transitions must use cubic-bezier(0.4, 0, 0.2, 1) easing

## 3. Page Load Animations
- Hero heading: fade + slide up on load, 0.3s delay
- Hero subheading: fade + slide up, 0.5s delay
- Hero CTA buttons: fade in, 0.7s delay
- Hero image or visual: fade + scale from 0.95 → 1, 0.4s delay
- Navbar: fade down from top on load

## 4. Mascot / Character Element
- If the original site has a mascot, robot, character, or 3D element:
  - DO NOT copy it exactly
  - Instead place a clearly labelled placeholder div with:
    - Exact same position, size, and z-index as the original
    - A dashed border with text inside: "MASCOT PLACEHOLDER — replace with your asset"
    - Background color matching the site's secondary color
    - CSS class: `.mascot-placeholder`
  - Add a comment in the code: `<!-- Replace .mascot-placeholder with your own mascot/character asset -->`

## 5. Particle / Background Effects
- If the original site has particles, WebGL, or animated gradient backgrounds:
  - Implement using tsparticles (npm: @tsparticles/react) or pure CSS
  - Match the color palette of the original
  - Keep particle count low (max 60) for performance
  - Add subtle mouse-interaction repel effect if original has it
  - For animated gradients: use CSS @keyframes with background-position shift

## 6. Number Counters
- Any stat numbers (users, transactions, TVL, etc.) on the page:
  - Add a count-up animation when they scroll into view
  - Use IntersectionObserver to trigger
  - Duration: 2 seconds, easing: ease-out

## 7. Mobile Responsiveness
- Test all components at 375px, 768px, 1024px breakpoints
- Ensure no horizontal overflow at any breakpoint
- Stack all grid/flex layouts properly on mobile
- Increase tap target sizes to minimum 44px on mobile
- Ensure font sizes scale down appropriately

## 8. Loading State
- Add a simple page preloader:
  - Full screen overlay matching brand background color
  - Centered spinner or brand initial letter
  - Fades out after 800ms
  - CSS class: `.preloader`

## 9. Cursor Effect (if original has one)
- If site uses a custom cursor:
  - Implement a simple custom cursor dot that follows mouse
  - Add magnetic effect on buttons (cursor snaps slightly toward center)
  - CSS class: `.custom-cursor`

## 10. Missing Assets Fallback
- Any image that fails to load: replace with a styled placeholder div
  - Same dimensions as original
  - Brand color background
  - Centered text: "IMAGE — [original filename]"
  - CSS class: `.asset-placeholder`

---

## How to apply
After the base clone is assembled, go through each section above and apply enhancements one by one. Confirm each enhancement is working before moving to the next.
