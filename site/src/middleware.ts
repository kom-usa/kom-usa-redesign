import type { MiddlewareHandler } from "astro";

/**
 * Gates SSR preview mode behind a shared key (or the Storyblok visual-editor
 * bridge param) and marks every preview response noindex. No-op in the
 * static production build — this only runs when STORYBLOK_PREVIEW=true.
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  if (import.meta.env.STORYBLOK_PREVIEW !== "true") {
    return next();
  }

  const { request, cookies, url } = context;
  const previewKey = import.meta.env.PREVIEW_ACCESS_KEY;

  const hasStoryblokParam = url.searchParams.has("_storyblok");
  const previewParam = url.searchParams.get("_preview");
  const cookieValid = Boolean(previewKey) && cookies.get("kom_preview")?.value === previewKey;
  const paramValid = Boolean(previewKey) && previewParam === previewKey;

  if (!hasStoryblokParam && !paramValid && !cookieValid) {
    return new Response("Not found", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const response = await next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  if (paramValid) {
    response.headers.append(
      "Set-Cookie",
      `kom_preview=${previewKey}; Path=/; HttpOnly`,
    );
  }

  return response;
};
