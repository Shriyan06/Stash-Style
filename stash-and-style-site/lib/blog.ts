import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Markdown posts in /content/blog/*.md with a small YAML-style frontmatter:
 *   ---
 *   title: Layering necklaces
 *   date: 2026-03-01
 *   excerpt: One line summary
 *   cover: /blog/layering.jpg
 *   tags: necklaces, styling
 *   ---
 * Files starting with "_" (e.g. _example.md) are ignored.
 */

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  tags: string[];
  html: string;
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), "content/blog");

function parseFrontmatter(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {} as Record<string, string>, body: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i < 1) continue;
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return { data, body: m[2] };
}

function files() {
  try {
    return readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    return [];
  }
}

let cache: Post[] | null = null;

export function getPosts(): Post[] {
  if (cache) return cache;
  cache = files()
    .map((file) => {
      const { data, body } = parseFrontmatter(readFileSync(path.join(DIR, file), "utf8"));
      const words = body.split(/\s+/).filter(Boolean).length;
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title || file.replace(/\.md$/, ""),
        date: data.date || "",
        excerpt: data.excerpt || "",
        cover: data.cover || "",
        tags: (data.tags || "")
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        html: marked.parse(body, { async: false }),
        readingMinutes: Math.max(1, Math.round(words / 220)),
      };
    })
    .sort((a, b) => Date.parse(b.date || "0") - Date.parse(a.date || "0"));
  return cache;
}

export const getPostSlugs = () => getPosts().map((p) => p.slug);

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug) ?? null;

export function getRelatedPosts(post: Post, limit = 3) {
  const others = getPosts().filter((p) => p.slug !== post.slug);
  const score = (p: Post) => p.tags.filter((t) => post.tags.includes(t)).length;
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}
