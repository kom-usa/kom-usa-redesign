export interface ServiceAreaPage {
  slug: string;
  city: string;
  metaTitle: string;
  metaDescription: string;
  heroIntro: string;
  localContext: string;
  commonNeeds: string[];
  nearby: string[];
}

/**
 * Code-owned local landing pages. Keeping the core pages here guarantees that
 * every route and homepage link exists even when Sanity is unavailable.
 * Sanity can add longer editorial content without becoming the route source.
 */
export const featuredServiceAreas: ServiceAreaPage[] = [
  {
    slug: "detroit",
    city: "Detroit",
    metaTitle: "Detroit Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA handles home maintenance, handyman work, remodeling, and construction projects throughout Detroit. Request a local project review.",
    heroIntro: "One Metro Detroit team for repairs, property upkeep, remodeling, and larger construction projects throughout Detroit.",
    localContext: "Detroit projects can range from a short repair list in an occupied home to coordinated improvements for a rental, storefront, or full renovation. KOM USA reviews the property, access, condition, and project goal before matching the request with the right service team.",
    commonNeeds: ["Multi-item handyman and repair lists", "Drywall, painting, and interior updates", "Exterior repair and weather-related maintenance", "Kitchen, bathroom, and whole-property renovations"],
    nearby: ["dearborn", "southfield", "ferndale", "warren"],
  },
  {
    slug: "dearborn",
    city: "Dearborn",
    metaTitle: "Dearborn Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA provides handyman, home maintenance, remodeling, and construction services across Dearborn. Share your project for a local review.",
    heroIntro: "Practical help for everyday home repairs, planned improvements, and construction projects across Dearborn.",
    localContext: "Dearborn homeowners and property managers often need a team that can handle both the small work that keeps a property running and the larger work that changes how it functions. KOM USA offers one place to start, then routes the project to Maintenance or Construction based on the actual scope.",
    commonNeeds: ["Door, lock, window, and fixture work", "Drywall repair and small interior projects", "Seasonal exterior maintenance", "Kitchen, bathroom, and basement improvements"],
    nearby: ["detroit", "livonia", "southfield", "farmington-hills"],
  },
  {
    slug: "livonia",
    city: "Livonia",
    metaTitle: "Livonia Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA serves Livonia with home maintenance, handyman repairs, remodeling, and construction. Send your address and project details to get started.",
    heroIntro: "Maintenance and construction support for Livonia homes, rental properties, and small commercial spaces.",
    localContext: "A Livonia project may begin as a list of overdue repairs and grow into a room update, exterior scope, or larger renovation. KOM USA helps organize the work, identify the right service path, and set the next step without making you contact several unrelated providers first.",
    commonNeeds: ["Combined household repair lists", "Gutter, siding, roof, and window concerns", "Flooring, tile, drywall, and painting", "Remodeling and larger construction scopes"],
    nearby: ["dearborn", "farmington-hills", "southfield", "novi"],
  },
  {
    slug: "southfield",
    city: "Southfield",
    metaTitle: "Southfield Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA provides maintenance, handyman, remodeling, and construction services in Southfield for homes and properties. Request a project review.",
    heroIntro: "A local service path for Southfield repairs, property upkeep, remodeling, and construction.",
    localContext: "Southfield includes homes, condos, offices, and managed properties with very different access and scheduling needs. KOM USA reviews who uses the space, what needs attention, and whether the request is routine maintenance or a larger construction project before work is scheduled.",
    commonNeeds: ["Repairs for homes, condos, and managed properties", "Electrical, drain, water-heater, and HVAC requests", "Interior finish and accessibility improvements", "Remodeling and project coordination"],
    nearby: ["detroit", "royal-oak", "farmington-hills", "dearborn"],
  },
  {
    slug: "farmington-hills",
    city: "Farmington Hills",
    metaTitle: "Farmington Hills Home Services | KOM USA",
    metaDescription: "KOM USA handles home maintenance, handyman projects, remodeling, and construction throughout Farmington Hills. Request a local scope review.",
    heroIntro: "From a focused repair to a larger renovation, KOM USA serves properties throughout Farmington Hills.",
    localContext: "Farmington Hills property work often combines routine upkeep with planned upgrades. Instead of separating every small repair from the future project, KOM USA can review the full list and help determine what belongs in a maintenance visit and what needs a construction estimate.",
    commonNeeds: ["Handyman work and household installations", "Drywall, flooring, tile, and paint updates", "Window, siding, gutter, and masonry repair", "Bathroom, kitchen, and basement remodeling"],
    nearby: ["novi", "livonia", "southfield", "troy"],
  },
  {
    slug: "novi",
    city: "Novi",
    metaTitle: "Novi Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA provides handyman, maintenance, remodeling, and construction services in Novi. Share the property address and project scope to begin.",
    heroIntro: "Responsive maintenance and construction support for homes and properties across Novi.",
    localContext: "Novi projects range from finishing a growing household's repair list to updating rooms, exterior systems, and entire layouts. KOM USA starts with the desired result and property details, then connects the work to the team equipped for that scope.",
    commonNeeds: ["Fixture, shelving, door, and hardware installation", "Drywall and interior finish repair", "Exterior maintenance and seasonal preparation", "Remodeling, additions, and construction planning"],
    nearby: ["farmington-hills", "livonia", "troy", "royal-oak"],
  },
  {
    slug: "royal-oak",
    city: "Royal Oak",
    metaTitle: "Royal Oak Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA serves Royal Oak with handyman repairs, home maintenance, remodeling, and construction. Send one request for the right local team.",
    heroIntro: "Repair, improvement, and construction help for Royal Oak homes and properties—through one local team.",
    localContext: "Royal Oak homes often need careful updates that improve function without creating an oversized project. KOM USA can handle focused repair lists and also review broader remodeling or construction goals when the work extends beyond a typical maintenance visit.",
    commonNeeds: ["Small-space repairs and installations", "Drywall, carpentry, flooring, and paint work", "Window, masonry, and exterior maintenance", "Kitchen, bathroom, and layout updates"],
    nearby: ["ferndale", "troy", "southfield", "warren"],
  },
  {
    slug: "ferndale",
    city: "Ferndale",
    metaTitle: "Ferndale Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA provides home maintenance, handyman work, remodeling, and construction across Ferndale. Request a review for your property and project.",
    heroIntro: "Straightforward help for Ferndale home repairs, improvements, and larger renovation projects.",
    localContext: "In Ferndale, a compact home or commercial space can make access, sequencing, and finish quality especially important. KOM USA reviews the complete project list so repairs and improvements can be scoped around the way the property is actually used.",
    commonNeeds: ["Handyman lists for compact homes and spaces", "Drywall, shelving, doors, and finish carpentry", "Exterior repair and weatherproofing", "Room updates and renovation planning"],
    nearby: ["detroit", "royal-oak", "southfield", "warren"],
  },
  {
    slug: "troy",
    city: "Troy",
    metaTitle: "Troy Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA handles handyman work, home maintenance, remodeling, and construction projects throughout Troy. Request service or a project estimate.",
    heroIntro: "One point of contact for Troy maintenance needs, home improvements, and construction projects.",
    localContext: "Troy homeowners and property teams may need anything from a scheduled repair visit to a coordinated interior or exterior improvement. KOM USA keeps the first step simple: describe the property, share the goal, and let the appropriate team confirm the scope.",
    commonNeeds: ["Home and small-business repair lists", "Door, window, electrical, and fixture work", "Interior finish and flooring updates", "Remodeling and larger project estimates"],
    nearby: ["royal-oak", "sterling-heights", "warren", "farmington-hills"],
  },
  {
    slug: "warren",
    city: "Warren",
    metaTitle: "Warren Home Services | Maintenance & Construction | KOM USA",
    metaDescription: "KOM USA provides home maintenance, handyman, remodeling, and construction services throughout Warren. Share your scope for a local project review.",
    heroIntro: "Local maintenance and construction help for Warren homes, rentals, and small commercial properties.",
    localContext: "Warren property needs often combine immediate repairs with longer-term improvement plans. KOM USA can review both, separate the urgent maintenance from the larger project scope, and give you one clear next step for each.",
    commonNeeds: ["Repair lists and property turnover work", "Drain, electrical, lock, and water-heater requests", "Drywall, painting, and flooring", "Exterior work and larger renovation scopes"],
    nearby: ["sterling-heights", "royal-oak", "ferndale", "detroit"],
  },
  {
    slug: "sterling-heights",
    city: "Sterling Heights",
    metaTitle: "Sterling Heights Home Services | KOM USA",
    metaDescription: "KOM USA serves Sterling Heights with handyman repairs, home maintenance, remodeling, and construction. Send your project details to get started.",
    heroIntro: "Home maintenance, repair, and construction support throughout Sterling Heights.",
    localContext: "Sterling Heights homeowners often want to combine practical upkeep with improvements that make a home easier to use. KOM USA can review multiple needs together, then route routine repairs and larger construction work through the right team.",
    commonNeeds: ["Multi-item handyman and installation visits", "Mechanical and household system requests", "Drywall, tile, flooring, and painting", "Kitchen, bathroom, and basement projects"],
    nearby: ["troy", "warren", "clinton-township", "st-clair-shores"],
  },
  {
    slug: "clinton-township",
    city: "Clinton Township",
    metaTitle: "Clinton Township Home Services | KOM USA",
    metaDescription: "KOM USA provides maintenance, handyman, remodeling, and construction services in Clinton Township. Request a review for your home or property.",
    heroIntro: "Repairs, upkeep, remodeling, and construction for Clinton Township homes and properties.",
    localContext: "Clinton Township properties vary widely in age, size, and project needs. KOM USA reviews access, existing conditions, material needs, and timing before confirming whether the request fits a maintenance visit or needs a construction estimate.",
    commonNeeds: ["Home and property maintenance lists", "Exterior, drainage, and weather-related repairs", "Drywall, windows, doors, and interior finishes", "Remodeling and larger construction scopes"],
    nearby: ["sterling-heights", "st-clair-shores", "warren", "troy"],
  },
  {
    slug: "st-clair-shores",
    city: "St. Clair Shores",
    metaTitle: "St. Clair Shores Home Services | KOM USA",
    metaDescription: "KOM USA handles home maintenance, handyman projects, remodeling, and construction in St. Clair Shores. Share your property and project details.",
    heroIntro: "Maintenance and construction support for homes and properties throughout St. Clair Shores.",
    localContext: "St. Clair Shores properties can require close attention to exterior exposure, drainage, masonry, and the interior finishes affected by them. KOM USA looks at the underlying condition as well as the visible repair before recommending a practical scope.",
    commonNeeds: ["Gutter, siding, masonry, and exterior repair", "Window, door, lock, and weatherproofing work", "Drywall and interior finish restoration", "Bathroom, kitchen, and whole-room updates"],
    nearby: ["clinton-township", "sterling-heights", "warren", "detroit"],
  },
];

export const featuredServiceAreaCities = featuredServiceAreas.map((area) => area.city);

export function getServiceArea(slug: string): ServiceAreaPage | undefined {
  return featuredServiceAreas.find((area) => area.slug === slug);
}
