/* global require, module, __dirname*/
const VueLoaderPlugin = require('vue-loader/lib/plugin');
var path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        build: './tests/Specs/MyComponentTest.js'
    },
    output: {
        path: path.resolve(__dirname, 'tests/Tests'),
        publicPath: 'tests/Tests',
        filename: '[name].js'
    },
    resolveLoader: {
        modules: ['node_modules']
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        alias: {
            '@src': path.resolve(
                __dirname,
                'src'
            ),
            '@example': path.resolve(
                __dirname,
                'example'
            )
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval',
    plugins :[
        new VueLoaderPlugin()
    ]
};
