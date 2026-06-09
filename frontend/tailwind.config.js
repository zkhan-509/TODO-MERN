export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cream: { 50: '#fdfcf7', 100: '#faf7ee', 200: '#f3edda', 300: '#e8dfc4' },
        sage: { 100: '#e8f0e9', 200: '#c9dccb', 300: '#9cbfa0', 400: '#6a9e70', 500: '#4a7c52', 600: '#3a6140' },
        rose: { soft: '#f2e8e8', mid: '#d4a0a0', dark: '#9b5a5a' },
        ink: { light: '#8a8070', mid: '#5a5040', dark: '#2d2820' },
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        soft: '0 2px 20px rgba(45,40,32,0.06)',
        card: '0 4px 32px rgba(45,40,32,0.08)',
        float: '0 8px 48px rgba(45,40,32,0.12)',
      },
    },
  },
  plugins: [],
}
