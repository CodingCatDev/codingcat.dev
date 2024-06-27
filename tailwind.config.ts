const { fontFamily } = require("tailwindcss/defaultTheme");
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: ({ theme }: { theme: any }) => ({
        violet: {
          css: {
            "--tw-prose-body": theme("colors.zinc[700]"),
            "--tw-prose-headings": theme("colors.violet[600]"),
            "--tw-prose-lead": theme("colors.zinc[600]"),
            "--tw-prose-links": theme("colors.violet[600]"),
            "--tw-prose-bold": theme("colors.violet[600]"),
            "--tw-prose-counters": theme("colors.zinc[500]"),
            "--tw-prose-bullets": theme("colors.violet[600]"),
            "--tw-prose-hr": theme("colors.zinc[200]"),
            "--tw-prose-quotes": theme("colors.zinc[900]"),
            "--tw-prose-quote-borders": theme("colors.zinc[200]"),
            "--tw-prose-captions": theme("colors.zinc[500]"),
            "--tw-prose-kbd": theme("colors.zinc[900]"),
            "--tw-prose-code": theme("colors.violet[600]"),
            "--tw-prose-pre-code": theme("colors.zinc[200]"),
            "--tw-prose-pre-bg": theme("colors.zinc[800]"),
            "--tw-prose-th-borders": theme("colors.zinc[300]"),
            "--tw-prose-td-borders": theme("colors.zinc[200]"),
            "--tw-prose-invert-body": theme("colors.zinc[300]"),
            "--tw-prose-invert-headings": theme("colors.violet[500]"),
            "--tw-prose-invert-lead": theme("colors.zinc[400]"),
            "--tw-prose-invert-links": theme("colors.violet[500]"),
            "--tw-prose-invert-bold": theme("colors.violet[500]"),
            "--tw-prose-invert-counters": theme("colors.zinc[400]"),
            "--tw-prose-invert-bullets": theme("colors.violet[500]"),
            "--tw-prose-invert-hr": theme("colors.zinc[700]"),
            "--tw-prose-invert-quotes": theme("colors.zinc[100]"),
            "--tw-prose-invert-quote-borders": theme("colors.zinc[700]"),
            "--tw-prose-invert-captions": theme("colors.zinc[400]"),
            "--tw-prose-invert-kbd": theme("colors.white"),
            "--tw-prose-invert-code": theme("colors.violet[500]"),
            "--tw-prose-invert-pre-code": theme("colors.zinc[300]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.zinc[600]"),
            "--tw-prose-invert-td-borders": theme("colors.zinc[700]"),
            maxWidth: "100ch",
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
