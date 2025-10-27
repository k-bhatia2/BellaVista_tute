module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f5ff',
          100: '#e6eaff',
          200: '#c2ceff',
          300: '#9db2ff',
          400: '#5680ff',
          500: '#2159ff',
          600: '#1b47cc',
          700: '#153799',
          800: '#0f2766',
          900: '#0a1840',
        },
      },
      boxShadow: {
        card: '0 10px 30px rgba(16, 24, 64, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
