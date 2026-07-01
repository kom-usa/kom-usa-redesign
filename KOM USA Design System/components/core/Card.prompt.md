Base white surface with subtle border + soft shadow (`Card`), and a ready-made `ServiceCard` for services-grid sections (icon + title + description + "Learn more" link).

```jsx
<Card><p>Any content</p></Card>
<ServiceCard title="Roof Repair" description="Fast, honest fixes." icon={<Icon/>} />
```

Corners are `--radius-md` (8px) per the brand's "lightly rounded" rule — never large/pill-shaped cards. Shadow is intentionally soft (`--shadow-card`); do not stack heavier shadows.
