/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#FEFDF8',
          100: '#FEFBF0',
          200: '#FDF6D9',
          300: '#FAEDB3',
          400: '#F5D977',
          500: '#EEC440',
          600: '#E5A71A',
          700: '#C8800E',
          800: '#9F6212',
          900: '#814F13',
          950: '#462807',
        },
        'saffron-gold': '#D4AF37',
        'black-unknown': {
          50: '#FAFAF8',
          100: '#F5F5F0',
          200: '#EAEAE0',
          300: '#D5D5C7',
          400: '#B0B0A0',
          500: '#808070',
          600: '#555547',
          700: '#3D3D33',
          800: '#2B2B25',
          900: '#1F1F1C',
          950: '#0D0D0B',
        },
        // Add the theme colors using hsl values
        'muted': {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        'popover': {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        'card': {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'secondary': {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        'accent': {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        'destructive': {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}