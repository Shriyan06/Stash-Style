import { FacebookIcon, InstagramIcon, PinterestIcon, TikTokIcon } from "@/components/icons";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

const items = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "pinterest", label: "Pinterest", Icon: PinterestIcon },
] as const;

/** Renders only the networks that have a URL in config/site.ts. */
export function SocialLinks({ className }: { className?: string }) {
  const links = items.filter((i) => site.social[i.key]);
  if (!links.length) return null;
  return (
    <ul className={cn("-ml-2.5 flex items-center gap-1", className)}>
      {links.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={site.social[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5"
            aria-label={`${label} (opens in a new tab)`}
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
