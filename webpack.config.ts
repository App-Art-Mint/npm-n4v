import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
const LowerCaseNamePlugin = require('webpack-lowercase-name');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const babelConfig = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: 'defaults'
            }
        ]
    ]
};

const config: webpack.Configuration = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        Bar: './src/ts/bar.ts',
        Selectors: './src/ts/selectors.ts',
        Settings: './src/ts/settings.ts',
        n4v: './src/scss/n4v.scss',
        theme: './src/scss/theme.scss',
        noscript: './src/scss/noscript.scss'
    },
    output: {
        filename: 'js/[lc-name].min.js',
        chunkFilename: 'js/[lc-name].[chunkhash].chunk.min.js',
        path: path.resolve(__dirname, './dist'),
        library: {
            name: 'n4v[name]',
            type: 'umd',
            export: 'default'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelConfig
                    },
                    {
                        loader: 'ts-loader',
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: '/node_modules/',
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                './src/index.html'
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[lc-name].min.css',
            chunkFilename: 'css/[lc-name].[chunkhash].chunk.min.css'
        }),
        new LowerCaseNamePlugin(),
        new RemoveEmptyScriptsPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    }
}

export default config;