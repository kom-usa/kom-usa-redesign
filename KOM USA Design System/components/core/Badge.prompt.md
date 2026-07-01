Small pill labels: `Badge` for status/trust markers ("Licensed & Insured", "New"), `Tag` for removable filter chips.

```jsx
<Badge tone="green">Licensed & Insured</Badge>
<Tag onRemove={() => {}}>Roofing</Tag>
```

Badge tones: `neutral` (concrete gray), `green` (soft sage — trust signals), `brass` (premium/rating highlight), `inverse` (charcoal, for dark sections). Tag is used in filter bars (e.g. service-type filters) and includes an optional remove (×) affordance.
