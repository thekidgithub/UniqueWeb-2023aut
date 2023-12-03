/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/index.html'],
  theme: {
    extend: {
      backgroundImage: {
        'pic1': 'url(../src/images/1.png)',
        'pic2': 'url(../src/images/2.png)',
        'pic3': 'url(../src/images/3.png)'
      },
      animation: {
        'carousel': 'carousel 4.5s ease-in-out infinite',
        'carousel1': 'carousel 4.5s ease-in-out infinite -1.5s',
        'carousel2': 'carousel 4.5s ease-in-out infinite -3s',
        'rotate': 'rotate 4.5s ease-in-out infinite'
      },
      keyframes: {
        'carousel': {
          '0%,22.22%': 
          {
            transform: 'rotateY(240deg)  translateZ(400px) ',
          },
          '33.33%,55.55%': 
          {

            transform: 'translateZ(300px)'
          },
          '66.66%,88.88%': 
          {

            transform: 'rotateY(120deg) translateZ(400px)'
          },
          '100%': 
          {
            transform: 'rotateY(240deg)  translateZ(400px) ',
          },
        },
      },
      translate: {
        '200': '50rem'
      },
      inset: {
        '2\/5': '40%'
      }
  },
  plugins: [],
}
}
