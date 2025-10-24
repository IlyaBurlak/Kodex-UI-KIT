import type { Preview } from '@storybook/react';

try {
  if (process.env.NODE_ENV === 'production') {
    require('../dist/ui-kit.css');
  } else {
    require('../src/styles/index.scss');
  }
} catch (e) {
  require('../src/styles/index.scss');
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
