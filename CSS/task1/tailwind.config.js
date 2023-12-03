/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/index.html'],
  theme: {
    extend: {
      spacing: {
        '0.8vw': '0.8vw',
        '1.5vw': '1.5vw',
        '1.2vw': '1.2vw',
        '2.5vw': '2.5vw',
        '8vw': '8vw',
        '12vw': '12vw', 
        '20vw': '20vw'
      },
      backgroundImage: {
        'topmask': 'url(../src/images/topmask.png)',
        'tx': 'url(../src/images/tx.png)'
      },
      zIndex: {
        'low': '-1'
      },
      inset: {
        '0.05': '-0.15rem'
      },
      minHeight: {
        '12': '3rem',
        '10': '2.5rem'
      },
      lineHeight: {
        '12': '3rem',
        '20': '5rem',
        '2.5vw': '2.5vw'
      },
      borderWidth: {
        '1': '1px'
      },
      transitionProperty: {
        'min-height': 'min-height',
      },
      width: {
        '1\/8': '12.5%'
      },
      minWidth: {
        '1\/5': '20%',
        '1\/3': '30%',
        '2\/5': '40%'
      },
      fontSize: {
        '1vw': '1vw',
        '0.8vw': '0.8vw'
      },
    },
  },
  plugins: [],
}

