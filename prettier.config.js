/** @type {import('prettier').Config} */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxSingleQuote: true,
  arrowParens: 'always',
  bracketSameLine: false,
  endOfLine: 'auto',
  importOrder: ['<THIRD_PARTY_MODULES>', '^react', '', '<TYPES>', '<TYPES>^[.]', '^[.]'],
  importOrderCaseSensitive: false,
};

export default config;
