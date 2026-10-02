import type { Config } from "tailwindcss";

/**
 * Tailwind theme. Colours point at the CSS variables in app/globals.css,
 * so brand colours are changed in exactly one place.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        navy: "var(--navy)",
        "navy-deep": "var(--navy-deep)",
        "on-navy-muted": "var(--on-navy-muted)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        "accent-ink": "var(--accent-ink)",
        tint: "var(--tint)",
        champagne: "var(--champagne)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.75rem, 1.5rem + 5.2vw, 5.75rem)", { lineHeight: "1", letterSpacing: "-0.015em" }],
        h1: ["clamp(2.25rem, 1.65rem + 2.6vw, 3.75rem)", { lineHeight: "1.05" }],
        h2: ["clamp(1.875rem, 1.45rem + 1.8vw, 2.875rem)", { lineHeight: "1.1" }],
        h3: ["clamp(1.375rem, 1.2rem + 0.6vw, 1.75rem)", { lineHeight: "1.15" }],
      },
      borderRadius: {
        img: "2px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
      transitionTimingFunction: {
        brand: "var(--ease)",
      },
    },
  },
};

export default config;
