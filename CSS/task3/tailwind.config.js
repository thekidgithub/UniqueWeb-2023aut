/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/index.html'],
  theme: {
    extend: {
      animation: {
        'move': 'horizontal 2.6s infinite linear alternate, vertical 1.9s infinite linear alternate',
      },
      keyframes: {
        horizontal: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(calc(100vw - 100%))' }
        },
        vertical: {
          'from': { transform: 'translateY(0)' },
          'to': { transform: 'translateY(calc(100vh - 100%))' }
        }
      },
    },
  },
  plugins: [],
}

