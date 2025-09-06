/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 20% 98%)',
        muted: 'hsl(220 10% 50%)',
        accent: 'hsl(140 60% 45%)',
        primary: 'hsl(220 85% 50%)',
        surface: 'hsl(220 20% 100%)',
        foreground: 'hsl(220 15% 15%)',
        // Dark theme colors
        dark: {
          bg: 'hsl(220 20% 8%)',
          surface: 'hsl(220 20% 12%)',
          foreground: 'hsl(220 15% 85%)',
          muted: 'hsl(220 10% 60%)',
        }
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(200, 50%, 50%, 0.1)',
        'modal': '0 12px 32px hsla(200, 50%, 50%, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-up': 'slideUp 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}