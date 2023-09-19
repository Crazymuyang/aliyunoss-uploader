export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/index.mjs.js',
      format: 'es'
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
  ]
};