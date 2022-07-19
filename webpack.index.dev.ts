import webpack from 'webpack';
import merge from 'webpack-merge';
import index from './webpack.index';
import dev from './webpack.dev'; 

const indexDevConfig: webpack.Configuration = merge(index, dev);

export default indexDevConfig;