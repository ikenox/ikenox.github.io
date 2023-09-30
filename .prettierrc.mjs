/** @type {import("prettier").Config} */
export default {
  trailingComma: 'es5',
  printWidth: 100,
  singleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
