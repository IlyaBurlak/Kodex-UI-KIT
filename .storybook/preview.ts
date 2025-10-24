import type { Preview } from '@storybook/react';

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../dist/ui-kit.css');
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
