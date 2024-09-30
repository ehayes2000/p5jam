/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {keyframes: {
      oscillate: {
          '0%, 100%': { fontSize: '1rem' },
          '50%': { fontSize: '1.1rem' },
      }
  },
  animation: {
      oscillate: 'oscillate .75s ease-in-out infinite',
  }},
  },
  plugins: [],
}

