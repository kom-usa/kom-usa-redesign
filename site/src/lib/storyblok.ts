import { useStoryblokApi } from "@storyblok/astro";
import type { ISbStoryData } from "@storyblok/astro";

/**
 * Storyblok is being retired in favour of Sanity. Until Sanity is wired, the
 * production build runs with no `STORYBLOK_TOKEN`, so these helpers must degrade
 * to empty results instead of throwing — `useStoryblokApi()` is only reachable
 * when the integration was actually registered (i.e. a token exists).
 */
export function storyblokEnabled(): boolean {
  return Boolean(import.meta.env.STORYBLOK_TOKEN ?? process.env.STORYBLOK_TOKEN);
}

export function sbVersion(): "draft" | "published" {
  return import.meta.env.STORYBLOK_PREVIEW === "true" ? "draft" : "published";
}

export async function getStories(
  contentType: string,
  opts: Record<string, string> = {},
): Promise<ISbStoryData[]> {
  if (!storyblokEnabled()) return [];
  const api = useStoryblokApi();
  return (await api.getAll("cdn/stories", {
    version: sbVersion(),
    content_type: contentType,
    sort_by: "first_published_at:desc",
    ...opts,
  })) as ISbStoryData[];
}

export async function getStory(fullSlug: string, opts: Record<string, string> = {}) {
  if (!storyblokEnabled()) return null;
  const api = useStoryblokApi();
  try {
    const { data } = await api.get(`cdn/stories/${fullSlug}`, { version: sbVersion(), ...opts });
    return data.story as ISbStoryData;
  } catch (e: any) {
    if (String(e?.status ?? e).includes("404")) return null;
    throw e;
  }
}

export async function serviceNav() {
  const stories = await getStories("service", { sort_by: "created_at:asc" });
  return stories.map((s) => ({
    slug: s.slug,
    title: s.content.title as string,
    shortTitle: s.content.short_title as string,
  }));
}

/** Article display date: editor-set content.date, falling back to Storyblok's
 *  publish timestamp so a blank date can never crash a build. */
export function storyDate(story: ISbStoryData): Date {
  const raw = (story.content as any).date as string | undefined;
  if (raw && raw.trim()) return new Date(raw.replace(" ", "T"));
  return new Date(story.first_published_at ?? story.published_at ?? story.created_at);
}
