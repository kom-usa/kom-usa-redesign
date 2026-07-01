# KOM USA Design System

## Company & product context

KOM USA is a local home-services company (roofing, remodeling, general repairs) whose brand is meant to feel **friendly, hometown, practical, and professional** — the opposite of a slick national franchise. The logo depicts a house silhouette (peaked roof + chimney) over the wordmark, with "USA" set beneath it, reinforcing the local/American-craft positioning.

At the time this system was authored, no product codebase, Figma file, or existing website was attached — only a standalone **brand kit** (`kom-usa-design-kit/`, mounted locally):

- `kom-usa-design-kit/README.md` — kit overview and license notes
- `kom-usa-design-kit/guide/KOM-USA-brand-guide.md` (+ `.pdf`) — the one-page brand guide (source of truth for all rules below)
- `kom-usa-design-kit/colors/kom-usa-palette.json` — palette with usage notes
- `kom-usa-design-kit/typography/font-use.md` — type usage rules
- `kom-usa-design-kit/web/brand-tokens.css`, `kom-usa-design-kit/web/google-fonts.css` — starter CSS tokens
- `kom-usa-design-kit/logos/*.svg` — three logo lockups (charcoal, green, white)

Because there was no real website or app to recreate, **the website UI kit in this system (`ui_kits/website/`) is an original interpretation built strictly from the documented brand rules** — not a pixel recreation of an existing product. If a real KOM USA site or app exists, attach its code or a Figma link and this system should be updated to match it exactly.

There is currently **one product surface**: a local-business marketing website (home, services, about, contact/quote-request).

_Last reviewed: this system currently ships 76 tokens, 14 Design System tab cards (Brand, Colors, Components, Spacing, Type, Website groups), and one UI kit (`ui_kits/website/`). Update this note whenever the inventory changes meaningfully._

## Index

- `styles.css` — root stylesheet; imports every token file below. Link this one file from any consumer.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css` (Google Fonts import), `base.css` (element resets)
- `assets/logos/` — three SVG logo lockups (charcoal / green / white)
- `source/` — original brand-guide markdown + palette JSON, kept for reference
- `guidelines/` — foundation specimen cards shown in the Design System tab (`colors/`, `type/`, `spacing/`, `brand/`)
- `components/core/` — `Button`, `Badge`, `Tag`, `Card`, `ServiceCard`
- `components/forms/` — `Input`, `Select`, `Checkbox` (plus a `FormFields` marker export)
- `components/navigation/` — `NavBar`, `Footer` (plus a `SiteChrome` marker export)
- `ui_kits/website/` — interactive click-through of the KOM USA marketing site (Home, Services, About, Contact). Its page files (`HomePage`, `ServicesPage`, `AboutPage`, `ContactPage`, `Logo`, `Photo`) are also compiled onto the design-system namespace as a side effect of being capitalized exports, but they are page recreations, not reusable primitives — build new UI against `components/`, not against these.
- `SKILL.md` — portable skill file for using this system in Claude Code

The full set of names currently exposed on `window.<Namespace>` (see `check_design_system`) is: `Badge, Button, Card, Checkbox, Footer, FormFields, Input, NavBar, ServiceCard, SiteChrome, Select, Tag` (reusable components) plus `AboutPage, ContactPage, HomePage, ServicesPage, Logo, Photo` (website UI-kit pages).

## Content fundamentals

- **Voice**: friendly and hometown, but professional — never corporate-cold, never gimmicky. Copy should read like a local business owner talking to a neighbor, not a national ad campaign.
- **Person**: second person ("you," "your home," "your project") for anything customer-facing; first-person plural ("we," "our crew") for the company voice. Avoid the impersonal third person ("KOM USA offers...") in headlines.
- **Casing**: sentence case for headlines and buttons (e.g. "Get a free estimate," not "Get A Free Estimate" or all-caps). Reserve all-caps only for small eyebrow labels/badges (e.g. "LICENSED & INSURED").
- **Tone words**: practical, honest, trusted, local, hometown, straightforward. Avoid hype language ("revolutionary," "game-changing," "disruptive") — this is a trades business, not a tech startup.
- **Emoji**: not used in real copy. (Service icons in this system use simple emoji glyphs — 🏠 🛠️ 🔧 — only as stand-ins until real icon assets are supplied; see Iconography.)
- **Proof over adjectives**: lead with concrete trust signals (years in business, licensed/insured, project counts, real customer quotes) rather than unverifiable superlatives ("the best," "#1").
- **Example headline**: "Local craftsmanship you can trust." / "A hometown crew, not a franchise." / "We show up on time, do the job right, and stand behind every project."
- **CTAs**: always practical and specific — "Get a Free Estimate," "Request a Free Estimate," "See Our Services" — never vague ("Learn More" alone is used only as a secondary/tertiary link, not a primary CTA).

## Visual foundations

- **Color**: warm, natural, low-saturation. KOM Sage Green (#78A866) for soft accents/backgrounds, KOM Field Green (#2F6B3B) for buttons/links/strong CTAs, Graphite Charcoal (#33383E) for text/nav/logo, Warm White (#F7F7F2) as the dominant page background, Concrete Gray (#E6E3DA) for borders/dividers, Steel Blue Gray (#5E7480) for icons/secondary accents, Brass Gold (#C59A42) reserved for small premium/rating highlights only. Explicitly avoid harsh neon green and heavy all-black layouts.
- **Type**: one family only — Nunito Sans — for headlines and body, at 700 weight for headings/buttons/nav and 400–500 for body copy (never 700 for long paragraphs; readability first). No serif, no secondary display face, no mono in customer-facing UI.
- **Spacing**: 4px-based scale (4/8/12/16/20/24/32/40/48/64/80/96/128). Generous section padding (64–96px) between major page sections; tighter, denser spacing (8–16px) inside cards/forms.
- **Backgrounds**: solid warm-white or soft sage-tinted sections; no gradients as decoration, no repeating patterns/textures, no hand-drawn illustration style. Real project photography is the dominant imagery device — full-width or large photo blocks showing actual work, not stock/abstract art. Occasional full-bleed photo sections for hero/about.
- **Animation**: minimal and functional only — brief hover/press transitions (~80–120ms ease), no bounces, no scroll-triggered flourishes, no looping decorative motion. The brand favors a calm, static feel over motion-heavy interaction.
- **Hover states**: primary buttons darken (Field Green → a darker derived shade); secondary/outline buttons fill solid with charcoal; links underline on hover and shift to the hover-green. No lightening/glow effects.
- **Press states**: buttons darken one step further than hover and scale down very slightly (~0.98×) — a subtle physical "push," not a bounce.
- **Borders**: thin, 1px, Concrete Gray by default; charcoal for stronger outline buttons; Field Green only on focus rings.
- **Shadows**: one soft, low-opacity shadow token used sparingly on cards (`--shadow-card`) — never large, colored, or multi-layered "floating" shadows. The brand guide explicitly calls out avoiding oversized shadows.
- **Corners**: square-to-lightly-rounded only — 4px (buttons/inputs), 8px (cards), 12px max for larger photo blocks. No fully rounded/pill shapes except small badge/tag chips.
- **Layout**: centered content max-width (~1200px) with consistent horizontal gutters; sticky/simple top nav (no mega-menus); dark charcoal footer as the one intentional contrast section per page.
- **Transparency/blur**: not used — no glassmorphism, no backdrop blur, no translucent overlays. Flat, opaque surfaces throughout.
- **Imagery color vibe**: warm and naturalistic — real homes, real crews, daylight tones. Avoid cold/blue-tinted, black-and-white, or heavily grained/filtered photography; it should feel like an honest snapshot of real work, not a moody ad campaign.
- **Cards**: white surface, 1px Concrete Gray border, 8px radius, one soft shadow — no colored left-border accent strips, no gradient fills.

## Iconography

The brand kit does not include an icon system, icon font, or SVG icon set. There is no evidence of emoji or unicode glyphs used as icons in real product copy.

For this system: service/category icons in the UI kit and components use **plain emoji glyphs (🏠 🛠️ 🔧) as an explicit, flagged placeholder** — swap these for a real icon set once one is chosen. If/when you pick one, a clean-lined outline icon set (e.g. Lucide) at Steel Blue Gray or Charcoal, medium stroke weight, would match the brand's practical, non-decorative visual language — but this is a suggestion, not a documented brand choice, so treat it as a substitution to confirm with the user before adopting broadly.

## Fonts

**Nunito Sans** is the documented brand font and is used as-is (no substitution needed) — it's loaded via Google Fonts (`tokens/fonts.css`), which is licensed under the SIL Open Font License for commercial use. No local font files were provided or required.
