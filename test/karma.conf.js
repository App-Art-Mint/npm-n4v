require('ts-node').register({
    compilerOptions: {
        module: 'commonjs'
    }
});
require('./karma.conf.ts');