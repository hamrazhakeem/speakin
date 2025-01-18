/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '2px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1F2937',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#374151',
            borderRadius: '100vh',
            '&:hover': {
              background: '#4B5563'
            }
          }
        }
      })
    },
  ]
}