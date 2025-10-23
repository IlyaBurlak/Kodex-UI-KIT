module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'no-descending-specificity': null,
    'selector-class-pattern': [
      '^[a-z][a-z0-9_-]+$',
      {
        message: 'Selector class should be kebab-case and start with a lowercase letter',
      },
    ],
    'order/properties-alphabetical-order': true,
    'declaration-block-single-line-max-declarations': 5,
    'scss/no-unused-private-members': true,
  },
};
