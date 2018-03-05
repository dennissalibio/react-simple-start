var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('./webpack.config');

config.devtool = 'source-map';
config.output.filename = '[name]-[chunkhash].js';

config.plugins.push(
  new CopyWebpackPlugin([
    { from: path.resolve(__dirname, '../index.build.html'), to: '../index.html' },
    { from: path.resolve(__dirname, '../ping.html'), to: '../ping.html' }
  ]),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
        drop_console: true
    }
  }),
  // Generate index.html that includes the generated hashed app.js and vendor.js
  new HtmlWebpackPlugin({
    filename: '../index.html',
    template: 'index.build.html'
  }),
  // Separate vendor.js and app.js
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
    }
  }),
  //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
  //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  }),
  // Merge chunks
  new webpack.optimize.AggressiveMergingPlugin()
);

module.exports = config;
