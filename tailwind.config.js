/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Outfit', 'system-ui', 'sans-serif'] },
      colors: { accent: 'var(--accent)', ink: 'var(--text)', muted: 'var(--muted)' },
    },
  },
  plugins: [],
}
