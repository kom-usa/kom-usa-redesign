export type ServiceLine = "maintenance" | "construction";
export type PricingLabel =
  | "Standard Pricing Available"
  | "Project Estimate Required"
  | "Call to Confirm Scope";

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDefinition {
  line: ServiceLine;
  slug: string;
  title: string;
  shortTitle: string;
  h1: string;
  summary: string;
  problem: string;
  pricingLabel: PricingLabel;
  included: string[];
  excluded: string[];
  guidance: string;
  scopeItems?: string[];
  faqs: ServiceFaq[];
  related: string[];
  image: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

const maintenance = (service: Omit<ServiceDefinition, "line">): ServiceDefinition => ({
  ...service,
  line: "maintenance",
});

const construction = (service: Omit<ServiceDefinition, "line">): ServiceDefinition => ({
  ...service,
  line: "construction",
});

export const maintenanceServices: ServiceDefinition[] = [
  maintenance({
    slug: "heating-cooling",
    title: "Heating & Cooling",
    shortTitle: "Heating & Cooling",
    h1: "Heating and Cooling Service in Metro Detroit",
    summary: "Help with residential heating and cooling systems, comfort issues, and maintenance needs.",
    problem: "Uneven temperatures, unusual equipment sounds, weak airflow, and a system that will not start can make a home uncomfortable quickly. KOM USA reviews the symptoms and helps determine the right maintenance or repair path.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Heating and cooling issue assessment", "Routine system maintenance needs", "Thermostat and airflow concerns", "Repair-scope review and next-step guidance"],
    excluded: ["Unconfirmed emergency dispatch", "A guaranteed repair price before the system is reviewed"],
    guidance: "Age, equipment type, access, and the failed component determine whether a targeted repair or a larger replacement conversation makes sense.",
    faqs: [
      { question: "Can you help if only part of the house is uncomfortable?", answer: "Yes. Tell us which rooms are affected and whether the issue is seasonal or constant so the team can review likely airflow, thermostat, or equipment causes." },
      { question: "Will I receive an instant HVAC quote?", answer: "No. We first review the equipment and symptoms, then explain the appropriate next step and any estimate needed." },
    ],
    related: ["electrical-services", "air-duct-cleaning", "water-heaters"],
    image: "worker-electrical",
  }),
  maintenance({
    slug: "drain-cleaning",
    title: "Drain Cleaning",
    shortTitle: "Drain Cleaning",
    h1: "Drain Cleaning and Clog Removal in Metro Detroit",
    summary: "Residential drain cleaning for slow drains, recurring clogs, and blocked fixtures.",
    problem: "A slow sink, backed-up tub, or recurring clog usually gets worse when the cause is left in place. KOM USA reviews where the blockage appears and the fixtures involved before recommending the next step.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Kitchen and bathroom drain concerns", "Slow or blocked fixture drains", "Recurring-clog assessment", "Basic access and condition review"],
    excluded: ["A guaranteed sewer-line diagnosis without inspection", "Repairs concealed behind finished surfaces unless separately approved"],
    guidance: "One slow fixture often points to a local blockage; several affected fixtures can indicate a larger line issue that needs a different scope.",
    faqs: [
      { question: "What should I tell you about a clogged drain?", answer: "Tell us which fixtures are affected, how long the problem has been happening, and whether water is backing up elsewhere." },
      { question: "Do you quote drain cleaning before reviewing the problem?", answer: "We can discuss the likely scope by phone, but final pricing depends on access, location, and the type of blockage." },
    ],
    related: ["demolition-debris-removal", "handyman-services", "water-heaters"],
    image: "bathroom-remodel",
  }),
  maintenance({
    slug: "electrical-services",
    title: "Electrical Services",
    shortTitle: "Electrical",
    h1: "Residential Electrical Services in Metro Detroit",
    summary: "Practical electrical maintenance and repair support for common household needs.",
    problem: "A dead outlet, unreliable switch, flickering light, or installation need should be reviewed carefully. KOM USA gathers the symptoms, location, and access details to define a safe service scope.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Outlet and switch concerns", "Fixture and device installation requests", "Basic electrical troubleshooting", "Repair-scope planning"],
    excluded: ["Work outside verified qualifications", "Unsafe temporary fixes or bypasses"],
    guidance: "Electrical symptoms can share several causes. The team confirms the affected circuit, device, access, and condition before recommending repair or replacement.",
    faqs: [
      { question: "What details help with an electrical request?", answer: "Share which outlet, switch, light, or device is affected, when the issue began, and whether a breaker is tripping." },
      { question: "Can you install a customer-supplied fixture?", answer: "Include the fixture type and a photo if available. The team will confirm compatibility, access, and installation scope." },
    ],
    related: ["heating-cooling", "handyman-services", "drywall-repair"],
    image: "worker-electrical",
  }),
  maintenance({
    slug: "water-heaters",
    title: "Water Heater Services",
    shortTitle: "Water Heaters",
    h1: "Water Heater Services in Metro Detroit",
    summary: "Water-heater replacement and service-scope review for common electric and gas configurations.",
    problem: "No hot water, inconsistent temperature, visible corrosion, or a leaking tank can signal different levels of failure. KOM USA reviews the current unit, fuel type, capacity, venting, and access before confirming a replacement scope.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Electric water-heater replacement review", "Gas and power-vent replacement review", "Capacity and configuration matching", "Installation-access assessment"],
    excluded: ["Unverified published prices", "A replacement recommendation without reviewing the existing setup"],
    guidance: "Tank leaks, age, condition, venting, and repair history help determine whether replacement is more practical than a repair attempt.",
    scopeItems: [
      "Electric Smart — 30 gallon short", "Electric Smart — 30 gallon tall", "Electric Smart — 40 gallon tall", "Electric Smart — 40 gallon short",
      "Gas Power Vent — 40 gallon tall", "Gas Power Vent — 40 gallon short", "Gas Premium — 40 gallon tall", "Gas Premium — 50 gallon tall",
    ],
    faqs: [
      { question: "What information should I send about my water heater?", answer: "A photo of the label, the fuel type, approximate tank size, vent type, and a description of the problem help the team review the request." },
      { question: "Are the older website prices still valid?", answer: "Pricing is being reconfirmed for the expanded service model. KOM USA will review the exact unit and installation conditions before confirming a quote." },
    ],
    related: ["heating-cooling", "electrical-services", "drain-cleaning"],
    image: "worker-electrical",
  }),
  maintenance({
    slug: "air-duct-cleaning",
    title: "Air Duct & Dryer Vent Cleaning",
    shortTitle: "Air Ducts",
    h1: "Air Duct and Dryer Vent Cleaning in Metro Detroit",
    summary: "Dryer-vent and household vent cleaning options based on length, vent size, and access.",
    problem: "Lint buildup, restricted airflow, and debris in vents can reduce performance and make routine maintenance harder. KOM USA confirms the vent type, approximate length, access, and number of openings before scheduling.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Dryer-vent cleaning requests", "Small household vent cleaning", "Large vent cleaning", "Length and access review"],
    excluded: ["Whole-system remediation claims", "Indoor-air-quality guarantees"],
    guidance: "Vent length, bends, termination point, size, and access determine the service scope. Photos of the appliance connection and exterior termination can help.",
    scopeItems: ["Dryer vent cleaning — under 10 feet, no additional service", "Dryer vent cleaning — over 10 feet", "Small vent cleaning — per vent", "Large vent cleaning — per vent"],
    faqs: [
      { question: "How do I estimate dryer-vent length?", answer: "Tell us where the dryer sits and where the vent exits the building. If you are unsure, photos are useful and the team can confirm the scope." },
      { question: "Can several vents be included in one request?", answer: "Yes. List the approximate number and size of vents so KOM USA can review the combined scope." },
    ],
    related: ["heating-cooling", "handyman-services", "gutter-cleaning"],
    image: "basement-interior",
  }),
  maintenance({
    slug: "locksmith",
    title: "Locksmith Services",
    shortTitle: "Locksmith",
    h1: "Residential Locksmith Services in Metro Detroit",
    summary: "House-door unlocks, lock replacement, lock boxes, keys, padlocks, and combination locks.",
    problem: "Whether you are locked out, replacing hardware after a move, or improving access for a property, KOM USA confirms ownership, door condition, hardware, location, and the requested result before dispatch or installation.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Residential house-door unlocks", "Lock replacement for one or multiple locks", "Lock-box installation options", "Key duplication and lock hardware requests"],
    excluded: ["Dispatch without property verification", "Unverified pricing or response-time promises"],
    guidance: "For a lockout, call the Maintenance line. For planned replacement, share the number of doors, current hardware, and photos when possible.",
    scopeItems: [
      "House door unlock", "Lock replacement — first lock", "Lock replacement — additional second lock", "Lock replacement — additional third lock", "Lock replacement — each additional lock after three",
      "Lock box — no additional service", "Lock box — with additional service", "Key duplication — first key", "Key duplication — each additional key", "Padlock", "Combination lock",
    ],
    faqs: [
      { question: "What should I do if I am locked out?", answer: "Call the Maintenance team at 248-264-3631. Be ready to confirm the property address and your authority to access it." },
      { question: "Can I request several lock replacements at once?", answer: "Yes. Tell us how many locks and doors are involved and whether you want matching keys or different access arrangements." },
    ],
    related: ["handyman-services", "window-repair-installation", "electrical-services"],
    image: "door-lock",
  }),
  maintenance({
    slug: "handyman-services",
    title: "Handyman Services",
    shortTitle: "Handyman",
    h1: "Handyman and Small Repair Services in Metro Detroit",
    summary: "One practical request path for household installations, touch-ups, assembly, and small repairs.",
    problem: "Small jobs are often related: a shelf needs mounting, a closet system needs adjustment, and a patched wall needs touch-up paint. KOM USA can review a combined list so the visit is scoped around the actual work.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Shelf installation", "Closet-system assembly and disassembly", "Small-area painting and touch-ups", "Minor household installations and repairs"],
    excluded: ["Large remodeling scopes better handled by Construction", "Work requiring unverified specialized credentials"],
    guidance: "Create one list, include quantities and photos, and note which materials you already have. Larger drywall, painting, or remodeling work may be routed to the appropriate dedicated team.",
    faqs: [
      { question: "Can I combine several small jobs?", answer: "Yes. A single clear list with photos helps KOM USA review the time, materials, and best service path." },
      { question: "When does a handyman request become a construction project?", answer: "Full-room work, substantial demolition, new layouts, or multi-trade scopes are usually better handled through the Construction line." },
    ],
    related: ["drywall-repair", "electrical-services", "demolition-debris-removal"],
    image: "painting-drywall",
  }),
  maintenance({
    slug: "drywall-repair",
    title: "Drywall Repair",
    shortTitle: "Drywall Repair",
    h1: "Drywall Repair in Metro Detroit",
    summary: "Patches, cracks, holes, water-damage repair areas, and small-area finishing.",
    problem: "Holes, stress cracks, failed patches, and localized water damage can leave walls unfinished even after the underlying issue is fixed. Maintenance drywall work focuses on repairing limited areas and blending the finish.",
    pricingLabel: "Project Estimate Required",
    included: ["Small and medium wall patches", "Crack and damaged-area repair", "Localized finishing and blending", "Repair after a resolved leak or access opening"],
    excluded: ["Active leak correction", "New whole-room drywall installation"],
    guidance: "The size, texture, location, moisture history, and desired paint finish determine the repair scope. New installation belongs under Construction drywall.",
    faqs: [
      { question: "Can you repair drywall after a plumbing or electrical opening?", answer: "Yes, after the underlying work is complete and the area is dry and ready to close." },
      { question: "Is painting included?", answer: "Small blending or touch-up needs can be discussed, but paint matching and full-wall painting depend on the final scope." },
    ],
    related: ["handyman-services", "electrical-services", "/construction/drywall-installation"],
    image: "painting-drywall",
  }),
  maintenance({
    slug: "gutter-cleaning",
    title: "Gutter Cleaning",
    shortTitle: "Gutter Cleaning",
    h1: "Gutter Cleaning in Metro Detroit",
    summary: "Seasonal gutter and downspout cleaning based on home height, access, and buildup.",
    problem: "Clogged gutters can overflow near siding, foundations, and walkways. KOM USA reviews roof height, access, gutter length, guards, and the visible buildup before confirming the service.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Gutter debris removal", "Accessible downspout flow review", "Basic visible-condition observations", "Cleanup of removed debris"],
    excluded: ["Roof replacement", "Hidden drainage or underground-line repair"],
    guidance: "Multi-story access, steep grades, gutter guards, and heavy buildup can change the scope. Exterior photos help with planning.",
    faqs: [
      { question: "Do gutter guards change the service?", answer: "They can. Tell us the guard type and send photos so the team can review access and removal needs." },
      { question: "Can you repair a loose gutter too?", answer: "Mention the damaged area in your request. Cleaning and limited repair can be reviewed together when practical." },
    ],
    related: ["roof-repair-maintenance", "siding-repair-installation", "chimney-care"],
    image: "home-exterior",
  }),
  maintenance({
    slug: "fence-repair-installation",
    title: "Fence Repair & Installation",
    shortTitle: "Fence Repair",
    h1: "Fence Repair and Limited Installation in Metro Detroit",
    summary: "Repair and limited replacement work for damaged residential fence sections, posts, and gates.",
    problem: "Leaning posts, broken panels, storm damage, and gates that no longer close can affect privacy and security. Maintenance work focuses on repair and limited replacement rather than a broad site-construction scope.",
    pricingLabel: "Project Estimate Required",
    included: ["Fence-section repair", "Post and gate concerns", "Limited replacement requests", "Material and access review"],
    excluded: ["Unreviewed property-line decisions", "Large new enclosures without a project estimate"],
    guidance: "Material, linear footage, grade, post condition, access, and property boundaries all affect the estimate.",
    faqs: [
      { question: "Should I repair or replace a damaged section?", answer: "A localized break may be repairable; widespread rot, movement, or mismatched materials can make limited replacement more practical." },
      { question: "What photos should I send?", answer: "Send the full damaged run, close views of posts or gates, and a wider photo showing access." },
    ],
    related: ["demolition-debris-removal", "handyman-services", "siding-repair-installation"],
    image: "home-exterior",
  }),
  maintenance({
    slug: "roof-repair-maintenance",
    title: "Roof Repair & Maintenance",
    shortTitle: "Roof Repair",
    h1: "Roof Repair and Maintenance in Metro Detroit",
    summary: "Limited roof repair and maintenance requests reviewed around access, condition, and weather exposure.",
    problem: "Missing materials, localized damage, flashing concerns, and visible wear should be reviewed before they spread. KOM USA gathers roof type, height, affected area, and interior symptoms to define the next step.",
    pricingLabel: "Project Estimate Required",
    included: ["Localized repair requests", "Visible flashing and penetration concerns", "Maintenance-scope review", "Repair-versus-larger-project guidance"],
    excluded: ["Emergency-response promises", "Full replacement without a construction estimate"],
    guidance: "The extent of damage, roof age, slope, material, and safe access determine whether a limited repair is appropriate.",
    faqs: [
      { question: "Can a small leak be handled as maintenance?", answer: "Possibly. Interior and exterior photos, roof age, and the suspected location help determine whether a targeted repair is appropriate." },
      { question: "Do you offer instant roof prices?", answer: "No. Roof work requires review of material, access, condition, and scope before an estimate can be confirmed." },
    ],
    related: ["gutter-cleaning", "chimney-care", "siding-repair-installation"],
    image: "home-exterior",
  }),
  maintenance({
    slug: "siding-repair-installation",
    title: "Siding Repair & Installation",
    shortTitle: "Siding Repair",
    h1: "Siding Repair and Limited Installation in Metro Detroit",
    summary: "Localized siding repair and limited replacement for damaged or missing exterior sections.",
    problem: "Loose, cracked, missing, or impact-damaged siding can expose the wall assembly and reduce curb appeal. Maintenance scope centers on limited repairs and replacements that can be matched responsibly.",
    pricingLabel: "Project Estimate Required",
    included: ["Localized siding repair", "Limited section replacement", "Trim and transition review", "Material-match assessment"],
    excluded: ["Guaranteed exact color matching", "Whole-home replacement without a construction estimate"],
    guidance: "Material type, availability, height, access, substrate condition, and match expectations determine the project scope.",
    faqs: [
      { question: "Can old siding be matched exactly?", answer: "Sometimes, but age and sun exposure can change color. KOM USA will explain realistic matching options before work begins." },
      { question: "What should I photograph?", answer: "Send a close photo of the damage and a wider view showing the full wall and access." },
    ],
    related: ["window-repair-installation", "gutter-cleaning", "roof-repair-maintenance"],
    image: "home-exterior",
  }),
  maintenance({
    slug: "window-repair-installation",
    title: "Window Repair & Installation",
    shortTitle: "Window Repair",
    h1: "Window Repair, Glass Replacement, and Installation in Metro Detroit",
    summary: "Window operation, limited replacement, and glass-repair requests reviewed in one service path.",
    problem: "Sticking sashes, broken hardware, damaged glass, drafts, and failed window units each require a different scope. KOM USA reviews the unit type, dimensions, condition, and access before recommending repair or replacement.",
    pricingLabel: "Project Estimate Required",
    included: ["Window operation and hardware concerns", "Window glass repair or replacement review", "Limited unit replacement", "Opening and access assessment"],
    excluded: ["Glass-only pricing without dimensions", "Whole-home replacement without project review"],
    guidance: "Hardware problems may be repairable; failed sealed units, damaged frames, or widespread deterioration may point toward replacement.",
    faqs: [
      { question: "Can you replace just the glass?", answer: "Depending on the unit. Send photos and approximate dimensions so the team can determine whether glass-only work is practical." },
      { question: "How do I describe my window?", answer: "Photos of the full window, damage, label if visible, and the opening mechanism are most useful." },
    ],
    related: ["siding-repair-installation", "handyman-services", "locksmith"],
    image: "interior-renovation",
  }),
  maintenance({
    slug: "brick-mortar-repair",
    title: "Brick Repointing & Mortar Repair",
    shortTitle: "Brick & Mortar Repair",
    h1: "Brick Repointing and Mortar Repair in Metro Detroit",
    summary: "Localized masonry maintenance for deteriorated joints, small damaged areas, and weathered mortar.",
    problem: "Open joints, crumbling mortar, and localized brick damage let Michigan weather work farther into the assembly. KOM USA reviews the affected area, access, matching needs, and signs of larger movement.",
    pricingLabel: "Project Estimate Required",
    included: ["Localized mortar-joint repair", "Small-area repointing", "Limited brick repair review", "Material and access assessment"],
    excluded: ["Structural-engineering conclusions", "Large reconstruction without a separate project scope"],
    guidance: "Localized weathering can often be repaired; widespread cracking, movement, or water entry may need broader evaluation before cosmetic work.",
    faqs: [
      { question: "Is every mortar crack a simple repair?", answer: "No. Pattern, width, movement, and water exposure matter. KOM USA will flag when the condition appears broader than routine repointing." },
      { question: "Can new mortar match the old color?", answer: "Matching is a project consideration. Existing age and weathering can make an exact match unrealistic, and the team will explain options." },
    ],
    related: ["chimney-care", "demolition-debris-removal", "siding-repair-installation"],
    image: "fireplace-chimney",
  }),
  maintenance({
    slug: "chimney-care",
    title: "Chimney Care",
    shortTitle: "Chimney Care",
    h1: "Chimney Cleaning and Cap Service in Metro Detroit",
    summary: "Chimney cleaning, height-based service, chimney caps, and liner caps.",
    problem: "Soot buildup, missing caps, and open flue terminations can create maintenance and weather-exposure concerns. KOM USA confirms height, access, fireplace use, and the number and type of caps before scheduling.",
    pricingLabel: "Call to Confirm Scope",
    included: ["Chimney cleaning requests", "Height-based cleaning review", "Chimney cap installation", "Liner cap installation"],
    excluded: ["Unverified published prices", "Structural chimney reconstruction within a cleaning visit"],
    guidance: "Height, roof access, flue count, cap type, condition, and visible masonry damage can change the service scope.",
    scopeItems: ["Chimney cleaning — up to 35 feet", "Chimney cleaning — after 35 feet, per foot", "Chimney cap — first cap", "Chimney cap — additional second cap", "Chimney cap — additional third cap", "Liner cap"],
    faqs: [
      { question: "How do I know the chimney height?", answer: "An estimate is fine for the initial request. Photos showing the house and full chimney help the team confirm access and likely height." },
      { question: "Can cleaning and cap work be requested together?", answer: "Yes. Note the number of flues or visible caps so KOM USA can review the combined scope." },
    ],
    related: ["brick-mortar-repair", "roof-repair-maintenance", "gutter-cleaning"],
    image: "fireplace-chimney",
  }),
  maintenance({
    slug: "demolition-debris-removal",
    title: "Light Demolition & Debris Removal",
    shortTitle: "Demolition & Cleanup",
    h1: "Light Demolition, Tear-Out, and Debris Removal in Metro Detroit",
    summary: "One coordinated scope for small tear-outs, light demolition, junk removal, and debris cleanup.",
    problem: "A small renovation, damaged installation, or property cleanup can stall when removal and disposal are not planned together. KOM USA reviews materials, volume, access, utilities, and what must remain protected.",
    pricingLabel: "Project Estimate Required",
    included: ["Light interior or exterior tear-out", "Job-related debris removal", "Junk-removal requests", "Access and disposal planning"],
    excluded: ["Hazardous-material handling", "Major structural demolition without a separate construction scope"],
    guidance: "Photos, approximate volume, material type, stairs, parking, and disposal access are important estimate inputs.",
    faqs: [
      { question: "Can tear-out and hauling be combined?", answer: "Yes. Describe what needs removal and where it is located so labor, protection, and disposal can be reviewed together." },
      { question: "What materials cannot be accepted?", answer: "Identify any paint, chemicals, fuel, suspected asbestos, or other potentially hazardous material before scheduling." },
    ],
    related: ["handyman-services", "drywall-repair", "/construction/new-construction"],
    image: "construction-framing",
  }),
];

export const constructionServices: ServiceDefinition[] = [
  construction({
    slug: "kitchen-remodeling", title: "Kitchen Remodeling", shortTitle: "Kitchen Remodeling", h1: "Kitchen Remodeling in Metro Detroit",
    summary: "Project planning and construction for kitchens, layouts, finishes, and coordinated improvements.",
    problem: "A kitchen remodel combines layout, utilities, cabinetry, surfaces, flooring, and finish decisions. KOM USA starts by understanding how the room needs to work and which parts of the existing space should change.",
    pricingLabel: "Project Estimate Required", included: ["Kitchen renovation planning", "Layout and finish scope review", "Cabinet, surface, flooring, and trade coordination", "Phased estimate discussion"],
    excluded: ["Instant square-foot pricing", "Final material allowances before selections are reviewed"], guidance: "Dimensions, structural changes, utility relocation, cabinetry, materials, and occupied-home conditions drive the estimate.",
    faqs: [{ question: "What should I prepare for a kitchen estimate?", answer: "Share photos, approximate dimensions, must-have changes, preferred timing, and any inspiration or material ideas." }, { question: "Can the layout change?", answer: "Possibly. Moving plumbing, electrical, walls, or appliances changes complexity and must be reviewed as part of the project scope." }],
    related: ["flooring-installation", "tile-installation", "painting"], image: "kitchen-remodel",
  }),
  construction({
    slug: "bathroom-remodeling", title: "Bathroom Remodeling", shortTitle: "Bathroom Remodeling", h1: "Bathroom Remodeling in Metro Detroit",
    summary: "Bathroom renovation planning for showers, tile, fixtures, layouts, and finish work.",
    problem: "Bathrooms concentrate water, ventilation, plumbing, electrical, waterproofing, tile, and finish details into a small room. KOM USA reviews the existing condition and intended result before estimating.",
    pricingLabel: "Project Estimate Required", included: ["Full and partial bathroom remodels", "Shower and tub-area planning", "Tile, fixture, and finish coordination", "Existing-condition review"],
    excluded: ["A quote based only on room count", "Material assumptions that have not been selected"], guidance: "Waterproofing needs, plumbing changes, tile complexity, ventilation, access, and product selections determine scope.",
    faqs: [{ question: "Can I keep the current bathroom layout?", answer: "Yes, and doing so can reduce complexity. KOM USA can also review layout changes when they better support the project goals." }, { question: "Should fixtures be selected before the estimate?", answer: "Early preferences help. Final scope and allowances become clearer as fixtures, tile, and major finishes are selected." }],
    related: ["tile-installation", "flooring-installation", "drywall-installation"], image: "bathroom-remodel",
  }),
  construction({
    slug: "tile-installation", title: "Tile Installation", shortTitle: "Tile Installation", h1: "Tile Installation in Metro Detroit",
    summary: "Tile planning and installation for floors, walls, showers, backsplashes, and project-specific surfaces.",
    problem: "A durable tile installation depends on substrate condition, layout, waterproofing, movement control, material, and detail work—not only the visible tile.",
    pricingLabel: "Project Estimate Required", included: ["Floor and wall tile", "Shower and wet-area tile scopes", "Backsplashes and feature areas", "Substrate and layout review"],
    excluded: ["Installation over an unsuitable substrate", "Fixed pricing before material and layout are known"], guidance: "Tile size, pattern, cuts, transitions, substrate repair, waterproofing, and room access all affect labor and materials.",
    faqs: [{ question: "Can tile go over the existing surface?", answer: "Sometimes, but only when the existing assembly is stable, flat, compatible, and appropriate for the room." }, { question: "Does pattern affect the estimate?", answer: "Yes. Layout, alignment, mosaics, large-format tile, and detailed cuts can materially change the installation scope." }],
    related: ["bathroom-remodeling", "kitchen-remodeling", "flooring-installation"], image: "bathroom-remodel",
  }),
  construction({
    slug: "flooring-installation", title: "Flooring Installation", shortTitle: "Flooring", h1: "Flooring Installation in Metro Detroit",
    summary: "Project-based flooring installation with subfloor, transition, room-use, and material considerations.",
    problem: "The finished floor is only as successful as the surface below it. KOM USA reviews existing flooring, subfloor condition, transitions, material, layout, furniture, and occupied-space needs.",
    pricingLabel: "Project Estimate Required", included: ["Project flooring installation", "Removal and preparation review", "Subfloor and transition assessment", "Room-by-room scope planning"],
    excluded: ["Unverified material-performance claims", "A final estimate without dimensions and product information"], guidance: "Square footage, demolition, subfloor repair, material, pattern, trim, and occupied-home logistics determine the estimate.",
    faqs: [{ question: "Do existing floors need to be removed?", answer: "It depends on condition, height, material compatibility, and manufacturer requirements. KOM USA will review the assembly." }, { question: "Can several rooms be phased?", answer: "Yes. Mention priorities and household constraints so transitions and sequencing can be planned." }],
    related: ["tile-installation", "kitchen-remodeling", "painting"], image: "open-plan-interior",
  }),
  construction({
    slug: "concrete-services", title: "Concrete Services", shortTitle: "Concrete", h1: "Residential Concrete Services in Metro Detroit",
    summary: "Concrete project review for residential flatwork, repairs, and scope-dependent installations.",
    problem: "Concrete projects depend on soil, drainage, thickness, reinforcement, access, finish, removal, and weather—not just surface area. KOM USA reviews the site before estimating.",
    pricingLabel: "Project Estimate Required", included: ["Residential concrete project review", "Removal and replacement scopes", "Access, grade, and drainage considerations", "Finish and edge-detail planning"],
    excluded: ["Pricing from square footage alone", "Work without site and access review"], guidance: "Demolition, haul-out, base preparation, reinforcement, thickness, finish, drainage, and equipment access shape the project.",
    faqs: [{ question: "What photos help with a concrete request?", answer: "Send the entire area, nearby structures, access from the street, and any cracking, settlement, or drainage problem." }, { question: "When can concrete work begin?", answer: "Timing depends on scope, preparation, scheduling, and suitable weather. The team will discuss a realistic sequence after review." }],
    related: ["new-construction", "demolition-debris-removal", "flooring-installation"], image: "concrete-work",
  }),
  construction({
    slug: "painting", title: "Construction Painting", shortTitle: "Painting", h1: "Interior and Exterior Painting Projects in Metro Detroit",
    summary: "Full-room, whole-home, exterior, and project-based painting with preparation included in the scope.",
    problem: "Larger painting projects depend on preparation, repairs, access, coatings, occupied-space protection, and finish expectations. Construction painting is separate from small maintenance touch-ups.",
    pricingLabel: "Project Estimate Required", included: ["Full-room and multi-room painting", "Whole-home and project-based painting", "Exterior painting review", "Preparation and finish planning"],
    excluded: ["Small touch-ups better routed to Handyman Services", "Pricing without surface-condition review"], guidance: "Surface condition, repairs, height, color changes, product, masking, furniture, and number of coats determine scope.",
    faqs: [{ question: "Do walls need repair first?", answer: "Cracks, holes, failing coatings, and water-damaged areas should be addressed as part of preparation before final painting." }, { question: "Can occupied rooms be phased?", answer: "Yes. KOM USA can discuss sequencing around access, drying time, furniture, and household use." }],
    related: ["drywall-installation", "flooring-installation", "/maintenance/handyman-services#painting-touch-ups"], image: "painting-drywall",
  }),
  construction({
    slug: "drywall-installation", title: "Drywall Installation & Finishing", shortTitle: "Drywall Installation", h1: "Drywall Installation and Finishing in Metro Detroit",
    summary: "New drywall hanging, finishing, additions, basements, remodels, and larger project scopes.",
    problem: "New drywall work must coordinate framing, utilities, insulation, board type, seams, corners, openings, finish level, and the surfaces that follow.",
    pricingLabel: "Project Estimate Required", included: ["New drywall hanging", "Finishing and larger-area work", "Basements, additions, and remodeling scopes", "Board and finish-level review"],
    excluded: ["Small isolated patches better routed to Maintenance", "Closing walls before required underlying work is complete"], guidance: "Area, ceiling height, access, board type, finish level, framing condition, and project sequencing determine the estimate.",
    faqs: [{ question: "Is this different from drywall repair?", answer: "Yes. Construction drywall covers new installation and larger areas; Maintenance drywall covers holes, cracks, and localized patches." }, { question: "Can drywall be estimated from photos?", answer: "Photos help, but measurements, access, ceiling height, framing, and finish expectations must also be confirmed." }],
    related: ["painting", "new-construction", "/maintenance/drywall-repair"], image: "construction-framing",
  }),
  construction({
    slug: "new-construction", title: "New Construction", shortTitle: "New Construction", h1: "Residential New Construction in Metro Detroit",
    summary: "Early project conversations for additions, new residential construction, and coordinated building scopes.",
    problem: "A new build or addition begins with site, goals, plans, approvals, budget expectations, materials, trades, and sequencing. KOM USA starts with a scope conversation rather than a generic price promise.",
    pricingLabel: "Project Estimate Required", included: ["New residential construction conversations", "Addition and major project review", "Scope, phase, and material planning", "Contractor and homeowner coordination"],
    excluded: ["Instant cost-per-square-foot guarantees", "Unsupported permit, financing, or schedule promises"], guidance: "Project stage, drawings, site conditions, approvals, selections, structure, utilities, and delivery approach determine the next step.",
    faqs: [{ question: "How early should I contact KOM USA?", answer: "Early planning is useful. Tell us whether you are exploring, developing plans, or ready to price a defined scope." }, { question: "Can contractors request support too?", answer: "Yes. Contractors can describe the project, required scope, documentation available, location, and desired timing through the same estimate form." }],
    related: ["concrete-services", "drywall-installation", "/home-building-materials"], image: "construction-framing",
  }),
];

export const allServices = [...maintenanceServices, ...constructionServices];

export const constructionLinks: NavLink[] = [
  { label: "Construction Overview", href: "/construction/" },
  ...constructionServices.map((service) => ({ label: service.title, href: `/construction/${service.slug}/` })),
  { label: "Home Building Materials", href: "/home-building-materials/" },
];

export const maintenanceGroups: NavGroup[] = [
  {
    label: "Home Systems",
    links: ["heating-cooling", "drain-cleaning", "electrical-services", "water-heaters", "air-duct-cleaning"].map((slug) => {
      const service = maintenanceServices.find((item) => item.slug === slug)!;
      return { label: service.title, href: `/maintenance/${slug}/` };
    }),
  },
  {
    label: "Interior Maintenance",
    links: [
      { label: "Handyman Services", href: "/maintenance/handyman-services/" },
      { label: "Drywall Repair", href: "/maintenance/drywall-repair/" },
      { label: "Painting & Touch-Ups", href: "/maintenance/handyman-services/#painting-touch-ups" },
      { label: "Shelf Installation", href: "/maintenance/handyman-services/#shelf-installation" },
      { label: "Closet System Assembly & Disassembly", href: "/maintenance/handyman-services/#closet-systems" },
    ],
  },
  {
    label: "Exterior Maintenance",
    links: ["gutter-cleaning", "fence-repair-installation", "roof-repair-maintenance", "siding-repair-installation", "window-repair-installation", "brick-mortar-repair", "chimney-care"].map((slug) => {
      const service = maintenanceServices.find((item) => item.slug === slug)!;
      return { label: service.title, href: `/maintenance/${slug}/` };
    }),
  },
  {
    label: "Security & Cleanup",
    links: [
      { label: "Locksmith Services", href: "/maintenance/locksmith/" },
      { label: "Light Demolition & Debris Removal", href: "/maintenance/demolition-debris-removal/" },
      { label: "Junk Removal", href: "/maintenance/demolition-debris-removal/#junk-removal" },
    ],
  },
  {
    label: "Other",
    links: [
      { label: "All Maintenance Services", href: "/maintenance/" },
      { label: "Subscription Maintenance — Coming Soon", href: "/maintenance/subscription-maintenance/" },
    ],
  },
];

/** Icon name (see components/common/Icon.astro) for each service card. */
export const serviceIcons: Record<string, string> = {
  "heating-cooling": "temperature",
  "drain-cleaning": "droplet",
  "electrical-services": "bolt",
  "water-heaters": "flame",
  "air-duct-cleaning": "wind",
  locksmith: "lock",
  "handyman-services": "tool",
  "drywall-repair": "wall",
  "gutter-cleaning": "bucket-droplet",
  "fence-repair-installation": "fence",
  "roof-repair-maintenance": "home-shield",
  "siding-repair-installation": "texture",
  "window-repair-installation": "window",
  "brick-mortar-repair": "trowel",
  "chimney-care": "ladder",
  "demolition-debris-removal": "trash",
  "kitchen-remodeling": "chef-hat",
  "bathroom-remodeling": "bath",
  "tile-installation": "layout-grid",
  "flooring-installation": "ruler-2",
  "concrete-services": "shovel",
  painting: "paint",
  "drywall-installation": "wall",
  "new-construction": "crane",
};

export const serviceIcon = (service: ServiceDefinition) => serviceIcons[service.slug] ?? "tool";

export const servicePath = (service: ServiceDefinition) => `/${service.line}/${service.slug}/`;

export function getService(line: ServiceLine, slug: string): ServiceDefinition | undefined {
  return allServices.find((service) => service.line === line && service.slug === slug);
}

export function relatedPath(current: ServiceDefinition, related: string): string {
  if (related.startsWith("/")) return related;
  const match = allServices.find((service) => service.slug === related);
  return match ? servicePath(match) : `/${current.line}/${related}/`;
}

export function relatedLabel(related: string): string {
  const clean = related.split("#")[0];
  const match = allServices.find((service) => servicePath(service).replace(/\/$/, "") === clean.replace(/\/$/, "") || service.slug === clean);
  if (match) return match.title;
  if (clean === "/home-building-materials") return "Home Building Materials";
  return clean.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? "Related service";
}
