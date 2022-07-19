
import webpack from 'webpack';
import merge from 'webpack-merge';
import config from './webpack.config';
import dev from './webpack.dev';

const devConfig: webpack.Configuration = merge(config, dev);

export default devConfig;