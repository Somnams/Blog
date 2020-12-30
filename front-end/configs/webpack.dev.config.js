/**
 * Webpack 配置文件 _development
 *
 * @author Wang Qinhong
 */

const path = require('path');

// webpack 相关
const { merge: webpackMerge } = require('webpack-merge');
const webpack = require('webpack');

// base config
const baseWebpackConfig = require('./webpack.config');

// Dev plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-tags-plugin');

// PATH
const OUTPUT_PATH = path.resolve(__dirname, '../', 'dist');
const SOURCE_PATH = path.resolve(__dirname, '../', 'src');

// 打包可视化
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// process.traceDeprecation = true;

const developmentConfig = webpackMerge(baseWebpackConfig, {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    index: path.join(SOURCE_PATH, 'main.js'),
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:8].js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      alwaysWriteToDisk: true,
      template: path.join(SOURCE_PATH, '../', 'public', 'index.html'),
      chunks: ['index'],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackHardDiskPlugin(),
    new HtmlWebpackIncludeAssetsPlugin({
      files: '*.html',
      assets: [{ path: 'lib', glob: '*.dll.js', globPath: 'dist/lib/' }],
      append: false,
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerPort: 9128
    // }),
  ],
  devServer: {
    contentBase: path.join(OUTPUT_PATH, 'asserts'),
    port: 8080,
    compress: true,
    open: false,
    openPage: '',
    hot: true,
    host: '0.0.0.0'
  },
});

module.exports = developmentConfig;
