module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        accent: '#22c55e'
      },
      borderRadius: {
        'lg-custom': '20px'
      }
    },
  },
  plugins: [],
};
