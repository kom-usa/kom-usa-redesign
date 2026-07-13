import { fetchPlaceReviews } from "../../src/lib/google-places.js";

/**
 * Live review counter for the site: returns the KOM USA listing's current
 * Google rating, review count, and featured reviews as JSON. The page ships
 * with build-time values; a small client script upgrades them from this endpoint.
 * Cached on the CDN for an hour, so Google is hit at most ~24x/day.
 */
export default async () => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return new Response("GOOGLE_MAPS_API_KEY not configured", { status: 503 });
  }
  try {
    const stats = await fetchPlaceReviews(key, process.env.GOOGLE_MAPS_PLACE_ID);
    if (!stats) return new Response("no confident place match", { status: 502 });
    return Response.json(stats, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
    });
  } catch (error) {
    console.error("google-reviews lookup failed:", error);
    return new Response("lookup failed", { status: 502 });
  }
};

export const config = { path: "/api/google-reviews" };
