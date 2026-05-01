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
        primary: '#000a1e',
        'primary-container': '#002147',
        'on-primary': '#ffffff',
        'on-primary-container': '#708ab5',
        secondary: '#175ead',
        'secondary-container': '#72aafe',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#003d79',
        'tertiary-fixed': '#ffe088',
        'on-tertiary-fixed-variant': '#574500',
        'tertiary-container': '#cca830',
        surface: '#f8f9fa',
        'surface-dim': '#d9dadb',
        'surface-bright': '#f8f9fa',
        'surface-container': '#edeeef',
        'surface-container-low': '#f3f4f5',
        'surface-container-high': '#e7e8e9',
        'surface-container-highest': '#e1e3e4',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#191c1d',
        'on-surface-variant': '#44474e',
        'outline': '#74777f',
        'outline-variant': '#c4c6cf',
        background: '#f8f9fa',
        'on-background': '#191c1d',
        error: '#ba1a1a',
        'primary-fixed': '#d6e3ff',
        'secondary-fixed': '#d5e3ff',
        'secondary-fixed-dim': '#a8c8ff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
  require('@tailwindcss/typography'),
],
}