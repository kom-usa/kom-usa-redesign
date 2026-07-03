import { useStoryblokApi } from "@storyblok/astro";
import type { ISbStoryData } from "@storyblok/astro";

export function sbVersion(): "draft" | "published" {
  return import.meta.env.STORYBLOK_PREVIEW === "true" ? "draft" : "published";
}

export async function getStories(
  contentType: string,
  opts: Record<string, string> = {},
): Promise<ISbStoryData[]> {
  const api = useStoryblokApi();
  return (await api.getAll("cdn/stories", {
    version: sbVersion(),
    content_type: contentType,
    sort_by: "first_published_at:desc",
    ...opts,
  })) as ISbStoryData[];
}

export async function getStory(fullSlug: string, opts: Record<string, string> = {}) {
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
