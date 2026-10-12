# Bless portfolio integration

Preserve the uploaded React/Vite site, npm scripts and lockfile, original content, project links, cream/cobalt palette, Inter body text and Space Grotesk headings. No animation framework or additional runtime dependency is needed.

The hero keeps its existing composition and supplied dashboard/code images. Add staggered masked headline entrances, measured copy reveals, a blue-shape reveal, line-drawn orbits, softly floating interface layers, fine-pointer parallax, and a gentle scroll-away transition. Respect reduced motion and avoid layout shifts or hidden copy when animation is disabled.

Add a Project Journal section after the selected-work gallery, before Experiments. It displays the existing PharmaFinder, DEVBUG and MarketMemo projects inside a realistic dimensional book: navy/cobalt cover, warm paper pages, page stacks, spine shading and double-sided 3D leaves. A locally pinned section maps normal document scroll to page-turn progress; no global wheel interception, and visitors can continue beyond the book. Contents links, previous/next controls, keyboard navigation, drag/touch scrubbing and a skip-section link are retained. Compact viewports use single-page reading.

## Structure

`src/components/Hero.jsx` and `hero-motion.css` own hero presentation and lifecycle-safe motion. `src/components/ProjectBook.jsx` and `project-book.css` own the locally scoped book section. `src/lib/bookProgress.mjs` contains deterministic scroll/page mapping. `src/main.jsx` preserves the existing site and provides project data plus its existing project visuals to both gallery and book. Assets remain local, making the delivered archive portable. `tests/` contains npm-run dependency-free progress tests.

Deliver the working preview and a complete updated npm project archive without node_modules or generated build files.

## Motion refinement

Refine the hero into a replayable code-to-product assembly rather than simple fades. Retain source artwork while bringing interface panels in from different depths, using kinetic headline timing, restrained technical callouts, traveling orbital signals and perspective response. Offscreen motion pauses without hiding already revealed content.

Replace the static technology grid with a digital-workshop constellation: four familiar categories, authentic local SVG technology marks, animated signal lanes, a selected-tool detail stage, and an always-visible tool index. Category changes reassemble the scene; selection updates the focused logo and explanatory copy without inventing proficiency percentages. Generic concepts use Lucide symbols. Motion remains subtle in cream/cobalt styling, respects reduced motion and never hijacks page scrolling. Keep npm and no additional runtime dependencies.

The hero replays automatically on a new viewport entry. In-place CSS animation restarts preserve DOM identity and focus. A visibility threshold prevents continuous retriggering during normal scrolling within the hero, and reduced-motion visitors retain a static readable presentation. The manual Replay control has been removed.

## Latest uploaded baseline — header, theme and finishing motion

Use the October 13 uploaded ZIP as authoritative. It changes the identity header and intentionally disables the standalone Work gallery and Experiments section. Preserve these choices. Navigation follows actual document order: Home → Projects (interactive journal) → About → Stack → Contact. Fix stale Work and Experiments links rather than restoring sections the user removed.

Move the header into a focused component with Lucide menu icons, animated active indicator, scroll-aware section tracking, reading progress and an accessible animated mobile menu. A centralized theme hook initializes from saved preference or system preference, persists manual choice and handles blocked storage gracefully. A sun/moon capsule switch triggers a circular view-transition reveal where supported and a smooth color-transition fallback otherwise. Define charcoal surfaces, warm readable typography and luminous cobalt accents across the real site, journal pages and technology workshop, keeping portfolio mockups/images true to their original colors.

Finishing motion adds staggered About reveals, pointer-aware portrait detail, magnetic CTA hover and contact orbit motion rather than excessive new animations. Reduced motion removes decorative motion and smooth scrolling. npm scripts, lockfile and existing hero/book/tool interactions remain intact. Source stays modular: Header, ThemeToggle and hooks own their responsibilities; theme.css owns dark palette and transitions; site-motion.css owns finishing movement.
