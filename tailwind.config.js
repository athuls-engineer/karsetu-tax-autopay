/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        m3: {
          primary: "#0B57D0",
          "primary-hover": "#0842A0",
          "primary-container": "#D3E3FD",
          "on-primary-container": "#041E49",
          surface: "#F8F9FA",
          "surface-container-low": "#F0F4F9",
          "surface-container": "#E9EEF6",
          "surface-container-high": "#E1E8F0",
          "surface-container-highest": "#D5DFE9",
          // True AMOLED Pure Black tokens (0% OLED emission)
          "dark-bg": "#000000",
          "dark-surface": "#050505",
          "dark-card": "#0A0A0A",
          "dark-card-elevated": "#121212",
          "dark-border": "rgba(255, 255, 255, 0.08)",
          outline: "#72777F",
          "outline-variant": "#C4C7C5",
          secondary: "#006874",
          "secondary-container": "#97F0FF",
          "on-secondary-container": "#001F24",
          tertiary: "#984061",
          "tertiary-container": "#FFD9E2",
          emerald: "#146C2E",
          "emerald-container": "#C4EED0",
          "on-emerald-container": "#00210B",
          amber: "#8C5000",
          "amber-container": "#FFDDB3",
          "on-amber-container": "#2D1600",
          coral: "#BA1A1A",
          "coral-container": "#FFDAD6",
          "on-coral-container": "#410002"
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Google Sans Display"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        'm3-1': '0 1px 3px 1px rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.06)',
        'm3-2': '0 2px 6px 2px rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'm3-3': '0 4px 12px 3px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.05)',
        'm3-4': '0 8px 24px 4px rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.06)',
        'dark-glow': '0 0 25px -5px rgba(59, 130, 246, 0.15)',
        'emerald-glow': '0 0 20px -5px rgba(16, 185, 129, 0.2)',
      }
    },
  },
  plugins: [],
}
