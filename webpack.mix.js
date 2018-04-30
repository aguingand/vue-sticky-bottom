let mix = require('laravel-mix');

mix.js('src/index.js', 'dist/vue-sticky-bottom.js')
    .webpackConfig({
        output: {
            libraryTarget:'umd'
        }
    });