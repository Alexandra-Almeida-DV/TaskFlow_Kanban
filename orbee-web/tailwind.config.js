/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kanban-dark': '#4D5461',
        'kanban-bg': '#F4F7F6',
        'kanban-accent': '#D9FF5E',
      },
      borderRadius: {
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
