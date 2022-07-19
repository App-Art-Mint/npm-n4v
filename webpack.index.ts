import path from 'path';
import webpack from 'webpack';
import config from './webpack.config';

const indexConfig: webpack.Configuration = {
    ...config,
    entry: {
        Index: './src/ts/index.ts'
    },
    output: {
        filename: 'js/[lc-name].min.js',
        chunkFilename: 'js/[lc-name].[chunkhash].chunk.min.js',
        path: path.resolve(__dirname, './dist'),
        library: {
            name: 'n4v',
            type: 'umd'
        }
    }
};

export default indexConfig;