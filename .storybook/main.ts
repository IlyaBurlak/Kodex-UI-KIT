import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-webpack5', options: {} },
  webpackFinal: async (baseConfig) => {
    const rules = [
      {
        test: /\.(ts|tsx)$/,
        use: [{ loader: require.resolve('ts-loader'), options: { transpileOnly: true } }],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('sass-loader')],
        exclude: /node_modules/,
      },
    ];

    baseConfig.module = { ...(baseConfig.module || {}), rules: [...(baseConfig.module?.rules || []), ...rules] };
    baseConfig.resolve = { ...(baseConfig.resolve || {}), extensions: Array.from(new Set([...(baseConfig.resolve?.extensions || []), '.ts', '.tsx'])) };
    return baseConfig;
  },
};

export default config;