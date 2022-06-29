import path from 'path';
import devServer from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import merge from 'webpack-merge';
import config from './webpack.config';

const serverConfig: devServer.Configuration = {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 42069
}

const devConfig = merge(config, {
    mode: 'development',
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].[chunkhash].chunk.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].[chunkhash].chunk.css'
        })
    ],
    devServer: serverConfig
});

export default devConfig;