/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        poppins:['Poppins', 'sans-serif']
      },
      colors:{
        'primary-green':'#00A32E',
        'secondary-green':'#B3DD58',
        'tercary-green':'#E2FF54',
        'primary-blue':"#F1F2F4"
      }
    },
  },
  plugins: [],
}

