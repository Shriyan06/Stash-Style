import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Icon>
);
export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Icon>
);
export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1.2-3.6 3.8-5.5 7-5.5s5.8 1.9 7 5.5" />
  </Icon>
);
export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Icon {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
  </Icon>
);
export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Icon>
);
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);
export const ChevronIcon = ({ dir = "right", ...p }: IconProps & { dir?: "left" | "right" | "up" | "down" }) => {
  const r = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <Icon {...p} style={{ transform: `rotate(${r}deg)`, ...p.style }}>
      <path d="m9 5 7 7-7 7" />
    </Icon>
  );
};
export const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15m-5-5 5 5-5 5" />
  </Icon>
);
export const TruckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7" />
    <circle cx="7" cy="17.5" r="1.5" />
    <circle cx="17" cy="17.5" r="1.5" />
  </Icon>
);
export const ReturnIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </Icon>
);
export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Icon>
);
export const TagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.7 7.7a1 1 0 0 1-1.4 0l-7.9-7.9Z" />
    <circle cx="8" cy="8" r="1.4" />
  </Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);
export const StarOutlineIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8L12 3.8Z" />
  </Icon>
);
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);
export const FilterIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Icon>
);
export const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15V4m-4 4 4-4 4 4" />
    <path d="M6 12v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7" />
  </Icon>
);
export const LinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Icon>
);
export const RulerIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="8" width="19" height="8" rx="1" />
    <path d="M6.5 8v3M10.5 8v4M14.5 8v3M18.5 8v4" />
  </Icon>
);
export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m4 7 8 6 8-6" />
  </Icon>
);

/* Brand marks — simplified single-path glyphs, filled. */
function Brand({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}
export const InstagramIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
  </Icon>
);
export const TikTokIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.7a7 7 0 0 1-3.8-1.2v6.3A5.6 5.6 0 1 1 11 9v2.8a2.9 2.9 0 1 0 2 2.8V3h3.6Z" />
  </Brand>
);
export const FacebookIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.4-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.2Z" />
  </Brand>
);
export const PinterestIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.1-1.8 0-2.6l1.1-4.6s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-.8 3.1-.2 1 .5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.4 0-2.3-1.7-3.9-4-3.9-2.7 0-4.3 2-4.3 4.1 0 .8.3 1.7.7 2.2.1.1.1.2.1.3l-.3 1.1c0 .2-.2.2-.4.1-1.2-.6-2-2.4-2-3.8 0-3.1 2.3-6 6.5-6 3.4 0 6.1 2.4 6.1 5.7 0 3.4-2.1 6.1-5.1 6.1-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.9-.8 1.9-1.2 2.6A9 9 0 1 0 12 3Z" />
  </Brand>
);
