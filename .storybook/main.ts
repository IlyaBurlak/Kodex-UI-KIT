import path from 'path';
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
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          {
            loader: require.resolve('sass-loader'),
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, '../src')],
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ];

    baseConfig.module = {
      ...(baseConfig.module || {}),
      rules: [...(baseConfig.module?.rules || []), ...rules],
    };
    baseConfig.resolve = {
      ...(baseConfig.resolve || {}),
      extensions: Array.from(new Set([...(baseConfig.resolve?.extensions || []), '.ts', '.tsx'])),
      alias: {
        ...(baseConfig.resolve?.alias || {}),
        '@': path.resolve(__dirname, '../src'),
        '@components': path.resolve(__dirname, '../src/components'),
        '@widgets': path.resolve(__dirname, '../src/widgets'),
        '@store': path.resolve(__dirname, '../src/store'),
        '@hooks': path.resolve(__dirname, '../src/hooks'),
        '@api': path.resolve(__dirname, '../src/api'),
        '@styles': path.resolve(__dirname, '../src/styles'),
      },
    };
    return baseConfig;
  },
};

export default config;
