import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px) scale(0.8)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
          },
        },
        expandMenu: {
          '0%': {
            transform: 'translateX(-100%) translateY(-50%) scale(0)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(-100%) translateY(-50%) scale(1)',
            opacity: '1',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        collapseMenu: {
          '0%': {
            transform: 'translateX(-100%) translateY(-50%) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(-100%) translateY(-50%) scale(0)',
            opacity: '0',
          },
        },
        fadeOutDown: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        expandMenu: 'expandMenu 0.3s ease-out forwards',
        fadeInUp: 'fadeInUp 0.3s ease-out forwards',
        collapseMenu: 'collapseMenu 0.3s ease-out forwards',
        fadeOutDown: 'fadeOutDown 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
