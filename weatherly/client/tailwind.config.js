/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        milky: "#FFDFD1",
        mantis: "#59C749",
        "dark-green": "#237A20",
        "soft-green": "#A8E6A1",
        cream: "#FFF7F2",
        ink: "#1F2D20",
      },
      backgroundImage: {
        "weatherly-gradient": "linear-gradient(135deg, #FFDFD1 0%, #FFF7F2 50%, #E8F8E5 100%)",
        "weatherly-gradient-dark":
          "linear-gradient(135deg, #10240F 0%, #16311A 50%, #133A18 100%)",
      },
      fontFamily: {
        display: ["'Clash Display'", "'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(35, 122, 32, 0.15)",
        "glass-lg": "0 20px 60px -10px rgba(35, 122, 32, 0.25)",
        float: "0 12px 24px -8px rgba(89, 199, 73, 0.35)",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
