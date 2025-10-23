const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.mjs',
            library: {
                type: 'module',
            },
            clean: true,
        },
        experiments: {
            outputModule: true,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        externals: {
            react: 'react',
            'react-dom': 'react-dom',
            'react/jsx-runtime': 'react/jsx-runtime',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                 
                    exclude: [/node_modules/, /\.stories\.(t|j)sx?$/],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'ui-kit.css',
            }),
            {
                apply: (compiler) => {
                    compiler.hooks.thisCompilation.tap('PrependCssPlugin', (compilation) => {
                        const { Compilation, sources } = compiler.webpack;
                        compilation.hooks.processAssets.tap(
                            {
                                name: 'PrependCssPlugin',
                                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                            },
                            (assets) => {
                                for (const assetName of Object.keys(assets)) {
                                    if (assetName.endsWith('.mjs')) {
                                        const asset = compilation.getAsset(assetName);
                                        const source = asset.source.source();
                                        const importLine = `import './ui-kit.css';\n`;
                                        const newSource = importLine + source;
                                        compilation.updateAsset(assetName, new sources.RawSource(newSource));
                                    }
                                }
                            }
                        );
                    });
                },
            },
        ],
        devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};