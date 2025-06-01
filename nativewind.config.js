module.exports = {
  tailwindConfig: './tailwind.config.js',
  contentPath: {
    app: ['./app/**/*.{js,jsx,ts,tsx}'],
    src: ['./src/**/*.{js,jsx,ts,tsx}'],
    components: ['./components/**/*.{js,jsx,ts,tsx}']
  },
  // Enable just-in-time mode for better performance
  mode: 'jit',
  // Configure the output directory for the compiled styles
  output: {
    dir: './styles',
  },
  // Configure the source directory for your styles
  source: {
    dir: './',
    extensions: ['js', 'jsx', 'ts', 'tsx'],
  },
};
