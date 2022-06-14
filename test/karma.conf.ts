import module from '../webpack.config';

export default (config: any) => {
    config.set({
        basePath: '../..',
        port: 42069,
        frameworks: [
            'jasmine'
        ],
        browsers: [
            'Chrome',
            'PhantomJS'
        ],
        preprocessors: {
            './dist/js/n4v.js': ['webpack'],
            './test/**/*.test.js': ['babel']
        }
    });
}