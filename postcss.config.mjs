export default {
  plugins: {
    '@unocss/postcss': {
      content: ['./{app,layouts,components}/**/*.{html,js,ts,jsx,tsx}']
    }
  }
}
