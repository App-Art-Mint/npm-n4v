import path from 'path';
import webpack from 'webpack';
import devServer from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const serverConfig: devServer.Configuration = {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 42069
}

const dev: webpack.Configuration = {
    mode: 'development',
    output: {
        filename: 'js/[lc-name].js',
        chunkFilename: 'js/[lc-name].[chunkhash].chunk.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[lc-name].css',
            chunkFilename: 'css/[lc-name].[chunkhash].chunk.css'
        })
    ],
    devServer: serverConfig
};

export default dev;