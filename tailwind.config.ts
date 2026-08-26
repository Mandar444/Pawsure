import type { Config } from "tailwindcss";

/**
 * Pawsure design tokens.
 *
 * Brand palette is deliberately tiny — ink, paper, pink, peach, white.
 * Everything decorative must come from those five.
 *
 * The `status` colours below are NOT brand colours and are not for decoration.
 * They exist because severity has to be legible at a glance in the NGO tools,
 * and red/amber/green is the one convention nobody has to learn.
 */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── brand ──
        ink: "#0a0a0a",
        paper: "#fafaf9",
        hero: "#ed176a",
        "hero-dark": "#d1145d",
        peach: "#fff0eb",

        // ── status (functional only) ──
        danger: "#dc2626",
        "danger-tint": "#fef2f2",
        warn: "#ea580c",
        "warn-tint": "#fff7ed",
        safe: "#16a34a",
        "safe-tint": "#f0fdf4",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
