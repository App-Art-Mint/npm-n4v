import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

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
    entry: {
        n4v: './src/ts/n4vbar.ts',
        theme: './src/scss/theme.scss'
    },
    output: {
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[name].[chunkhash].chunk.min.js',
        path: path.resolve(__dirname, './dist'),
        library: {
            name: 'n4v',
            type: 'var',
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
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js$/i,
                exclude: '/node_modules/',
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelConfig
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
                        loader: "sass-loader"
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
            filename: 'css/[name].min.css',
            chunkFilename: 'css/[name].[chunkhash].chunk.min.css'
        })
    ],
    resolve: {
        extensions: ['.ts', 'tsx', '.js'],
    }
}

export default config;