/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1400px', // Change the xl breakpoint to 1400px
      '2xl': '1536px',
    },

    extend: {
      fontFamily : {
        poppins: ["poppins", "san-serif"],
      },
      colors: {
        primary: "#f7ba34",
        secondary: "#69a79c",
        light: "#f7f7f7",
        dark: "#333333",
        dark2: "#999999",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "3rem",
          xl: "4rem",
          "2xl": "6rem",
        },
      },
      backgroundImage: {
        'hero-image':"url(./src/assets/hero_img/long-shot-modern-man-working-laptop-with-copy-space.jpg)",
        'hero-image2':"url(./src/assets/hero_img/hero_about.jpg)"
      },
      animation: {
        "slide-left": "slideLeft 0.5s ease-in-out",
        "slide-right": "slideRight 0.5s ease-in-out",
      },
      keyframes: {
        slideLeft: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        slideRight: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      
    },
  },
  plugins: [],
}

