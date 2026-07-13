import { googleReviews } from "../data/business";
import { fetchPlaceReviews, type PlaceReviews } from "./google-places";

/**
 * Build-time review stats: live from Google Places when GOOGLE_MAPS_API_KEY is
 * set, otherwise the verified values in business.ts. Never throws — a failed
 * lookup falls back so the build can't break (same pattern as lib/sanity.ts).
 * Cached per build so Hero, GoogleReviews, and Seo share one request.
 */
const FALLBACK: PlaceReviews = {
  rating: googleReviews.rating,
  count: googleReviews.count,
  placeUri: googleReviews.url,
  reviews: googleReviews.featured.map((review) => ({
    authorName: review.name,
    text: review.quote,
    rating: 5,
    googleMapsUri: googleReviews.url,
  })),
};

let cached: Promise<PlaceReviews> | null = null;

export function getReviewStats(): Promise<PlaceReviews> {
  cached ??= (async () => {
    const key = import.meta.env.GOOGLE_MAPS_API_KEY;
    if (!key) return FALLBACK;
    try {
      const live = await fetchPlaceReviews(key, import.meta.env.GOOGLE_MAPS_PLACE_ID);
      if (!live) {
        console.warn("[google-reviews] no confident place match — using fallback values");
        return FALLBACK;
      }
      return live;
    } catch (e) {
      console.warn("[google-reviews] lookup failed, using fallback:", (e as Error).message);
      return FALLBACK;
    }
  })();
  return cached;
}
