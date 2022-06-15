import path from 'path';
import webpack from 'webpack';
import devServer from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const isDev: boolean = true;
const min: string = isDev ? '' : '.min';

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

const serverConfig: devServer.Configuration = {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 42069
};

const config: webpack.Configuration = {
    mode: isDev ? 'development' : 'production',
    entry: {
        n4v: './src/ts/n4v.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: `js/[name]${min}.js`,
        chunkFilename: `js/[name].[chunkhash].chunk.${min}.js`
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
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `css/[name]${min}.css`,
            chunkFilename: `css/[name].[chunkhash].chunk.${min}.css`
        }),
        new CopyWebpackPlugin({
            patterns: [
                './src/index.html'
            ]
        })
    ],
    resolve: {
        extensions: ['.ts', 'tsx', '.js'],
    },
    devServer: serverConfig
}

export default config;