# Flowbase Cozy UI Theme

## Direction

Flowbase should feel cozy, modern, clean, and fresh. The app is a calm productivity workspace that combines structured pages, task boards, whiteboards, calendar planning, notes, and AI assistance.

The interface should open directly into the product experience. Avoid marketing-style hero layouts, heavy gradients, dark chrome, oversized copy, and decorative shapes that do not help the workflow.

## Color Palette

- Background: bright warm cream, `hsl(42 86% 97%)`
- Sidebar: clean soft cream, `hsl(43 86% 96%)`
- Cards and panels: crisp white, `hsl(0 0% 100%)`
- Text: muted ink, `hsl(222 24% 17%)`
- Muted text: soft blue-gray, `hsl(222 11% 45%)`
- Borders: cool mint-gray, `hsl(182 29% 84%)`
- Primary accent: vivid coral, `hsl(10 90% 58%)`
- Secondary accent: fresh mint, `hsl(172 70% 92%)`
- Support accents: mint, teal, sky, violet, amber, rose, and fuchsia.

Use colorful accents primarily for icons, status chips, small bars, and lightweight highlights. Large surfaces should stay quiet and warm.

## Typography

- Font stack: Inter first, then system sans-serif fallbacks.
- Product headings: semibold, compact line height, no negative letter spacing.
- Sidebar labels: small and scannable.
- Group labels: uppercase, very small, wide tracking.
- Body copy: calm, readable, and restrained.

## Spacing And Shape

- Sidebar expanded width: about `232px`.
- Sidebar collapsed width: about `68px`.
- Menu rows: compact, about `32px` tall.
- Cards: rounded but not bubbly; use `1rem` to `1.5rem` radii for app panels.
- Borders and shadows should be subtle. Prefer soft separation over heavy outlines.

## Sidebar Guidelines

- Header must include a compact logo mark and app name.
- Navigation should be grouped into clear sections.
- Use Lucide icons for all menu items.
- Icons should be colorful and distinct by feature.
- When collapsed, show icons only and keep them centered.
- Hide app subtitle, menu labels, group labels, and footer text when collapsed.
- Keep a visible accessible collapse toggle with an `aria-label`.

## Interaction

- Active navigation items should use a quiet tinted background, not a loud filled button.
- Hover states should feel responsive with small color and surface changes.
- Keep motion short and functional, especially for sidebar width changes.
- Preserve enough contrast for text, icons, and controls on the warm background.
