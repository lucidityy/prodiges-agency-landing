/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-light': '#FAFBFC',
        'bg-gradient': '#F7F9FB',
        'primary': '#5B4FE9',
        'accent': '#7C3AED',
        'secondary': '#EC4899',
        'gradient-start': '#7C3AED',
        'gradient-end': '#EC4899',
        'text-dark': '#0F172A',
        'text-light': '#64748B',
        'glass-white': 'rgba(255, 255, 255, 0.8)',
        'glass-border': 'rgba(255, 255, 255, 0.18)',
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'button': '12px',
      },
      transitionDuration: {
        'default': '250ms',
      },
      transitionTimingFunction: {
        'default': 'ease-in-out',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FAFBFC 0%, #F7F9FB 100%)',
        'button-gradient': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, #7C3AED 0px, transparent 50%), radial-gradient(at 80% 0%, #EC4899 0px, transparent 50%), radial-gradient(at 0% 50%, #5B4FE9 0px, transparent 50%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
      },
    },
  },
  plugins: [],
}