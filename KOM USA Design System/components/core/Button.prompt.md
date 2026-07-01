Practical CTA button in three variants, used for "Get a Free Estimate", "Call Now", nav actions, and form submits.

```jsx
<Button variant="primary" size="lg">Get a Free Estimate</Button>
<Button variant="secondary">Learn More</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

Variants: `primary` (solid Field Green — main CTAs), `secondary` (charcoal outline, fills charcoal on hover — secondary actions), `ghost` (text-only, concrete-gray hover fill — low-emphasis links inside toolbars/cards). Sizes: `sm`, `md` (default), `lg` (hero CTAs). Always 700 weight per brand guide. Pass `disabled` to gray it out; pass `icon` for a leading icon element.
