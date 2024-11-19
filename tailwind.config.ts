import daisyui from "daisyui"
import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: ["class", '[data-theme="dark"]'],
} satisfies Config
