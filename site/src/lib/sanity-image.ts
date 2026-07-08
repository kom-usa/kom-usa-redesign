import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./sanity";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/**
 * Build an optimized image URL from a Sanity image reference. Only called when a
 * Sanity image object exists, which implies the client is configured — guarded
 * so a misconfigured build fails loudly rather than emitting broken URLs.
 */
export function urlFor(source: unknown) {
  if (!builder) throw new Error("urlFor() called without a configured Sanity client");
  return builder.image(source as never);
}
