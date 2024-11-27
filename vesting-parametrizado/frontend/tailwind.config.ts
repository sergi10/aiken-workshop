import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c80e22',  
        background: '#1f1f1f', 
        hover: '#000000', 
        textPrimary: '#ffffff',
      },
    },
  },
  plugins: [],
} satisfies Config;
