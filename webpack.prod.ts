import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import merge from 'webpack-merge';
import config from './webpack.config';

const prodConfig = merge(config, {
    mode: 'production',
    output: {
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[name].[chunkhash].chunk.min.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
            chunkFilename: 'css/[name].[chunkhash].chunk.min.css'
        })
    ]
});

export default prodConfig;