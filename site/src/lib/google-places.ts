/**
 * Google Places (New) lookup for the KOM USA listing's live rating, review
 * count, and featured reviews. Pure module — no Astro/Netlify imports — so
 * it's shared by the build-time helper (src/lib/google-reviews.ts) and the
 * runtime endpoint (netlify/functions/google-reviews.mts).
 */
export interface GooglePlaceReview {
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
  text: string;
  rating: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri: string;
}

export interface PlaceReviews {
  rating: string;
  count: number;
  placeUri: string;
  reviews: GooglePlaceReview[];
}

/** Business anchor: the existing service-area map pin in Metro Detroit. */
const DETROIT = { latitude: 42.383, longitude: -83.102 };
const TEXT_SEARCH_FIELD_MASK = [
  "places.displayName",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.reviews",
].join(",");
const PLACE_DETAILS_FIELD_MASK = [
  "displayName",
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "reviews",
].join(",");

interface PlacesApiReview {
  text?: { text?: string };
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface PlacesApiPlace {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesApiReview[];
}

function isKomUsa(place: PlacesApiPlace): boolean {
  return (place.displayName?.text ?? "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, " ")
    .includes("kom usa");
}

function toPlaceReviews(place: PlacesApiPlace): PlaceReviews | null {
  if (!isKomUsa(place) || !place.rating || !place.userRatingCount || !place.googleMapsUri) {
    return null;
  }

  const reviews = (place.reviews ?? []).flatMap((review): GooglePlaceReview[] => {
    const text = review.text?.text?.trim();
    if (!text) return [];

    const rating = Math.max(1, Math.min(5, Math.round(review.rating ?? 0)));
    return [{
      authorName: review.authorAttribution?.displayName?.trim() || "Google reviewer",
      authorUri: review.authorAttribution?.uri,
      authorPhotoUri: review.authorAttribution?.photoUri,
      text,
      rating,
      relativePublishTimeDescription: review.relativePublishTimeDescription,
      publishTime: review.publishTime,
      googleMapsUri: review.googleMapsUri ?? place.googleMapsUri!,
    }];
  });

  return {
    rating: place.rating.toFixed(1),
    count: place.userRatingCount,
    placeUri: place.googleMapsUri,
    reviews,
  };
}

async function fetchByPlaceId(apiKey: string, placeId: string): Promise<PlaceReviews | null> {
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
  url.searchParams.set("languageCode", "en");
  url.searchParams.set("regionCode", "US");

  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACE_DETAILS_FIELD_MASK,
    },
  });
  if (!res.ok) return null;

  return toPlaceReviews((await res.json()) as PlacesApiPlace);
}

async function fetchByTextSearch(apiKey: string): Promise<PlaceReviews | null> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": TEXT_SEARCH_FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: "KOM USA Construction Maintenance Repairs Metro Detroit",
      locationBias: { circle: { center: DETROIT, radius: 50000 } },
      includePureServiceAreaBusinesses: true,
      languageCode: "en",
      regionCode: "US",
      maxResultCount: 5,
    }),
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { places?: PlacesApiPlace[] };
  const place = (data.places ?? []).find(isKomUsa);
  return place ? toPlaceReviews(place) : null;
}

export async function fetchPlaceReviews(apiKey: string, placeId?: string): Promise<PlaceReviews | null> {
  if (placeId?.trim()) return fetchByPlaceId(apiKey, placeId.trim());
  return fetchByTextSearch(apiKey);
}
