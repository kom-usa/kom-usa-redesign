/**
 * Google Places (New) lookup for the KOM USA listing's live rating and review
 * count. Pure module — no Astro/Netlify imports — so it's shared by the
 * build-time helper (src/lib/google-reviews.ts) and the runtime endpoint
 * (netlify/functions/google-reviews.mts).
 */
export interface PlaceReviews {
  rating: string;
  count: number;
}

/** Business anchor: the existing service-area map pin in Metro Detroit. */
const DETROIT = { latitude: 42.383, longitude: -83.102 };

export async function fetchPlaceReviews(apiKey: string): Promise<PlaceReviews | null> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount",
    },
    body: JSON.stringify({
      textQuery: "KOM USA",
      locationBias: { circle: { center: DETROIT, radius: 50000 } },
    }),
  });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    places?: { displayName?: { text?: string }; rating?: number; userRatingCount?: number }[];
  };
  // Guard against matching some other business: require the name to contain KOM.
  const place = (data.places ?? []).find((p) => /kom/i.test(p.displayName?.text ?? ""));
  if (!place?.rating || !place.userRatingCount) return null;

  return { rating: place.rating.toFixed(1), count: place.userRatingCount };
}
