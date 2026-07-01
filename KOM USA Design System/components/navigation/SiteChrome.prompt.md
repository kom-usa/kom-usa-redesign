Top `NavBar` (logo, link row, CTA button) and dark `Footer` (logo + link columns) used to bookend every marketing page.

```jsx
<NavBar logo={<Logo/>} links={["Services","About","Contact"]} cta={<Button>Get a Quote</Button>} />
<Footer logo={<Logo variant="white"/>} columns={[{title:"Services", items:["Roofing","Remodel"]}]} />
```

NavBar is white with a hairline bottom border (no shadow/blur — brand avoids decorative chrome). Footer uses `--surface-inverse` (charcoal) with 75%-opacity white link text.
