/**
 * Webpack 配置文件 _production
 *
 * @author Wang Qinhong
 */

const path = require('path');

// webpack 相关
const { merge: webpackMerge } = require('webpack-merge');
const webpack = require('webpack');

// base config
const baseWebpackConfig = require('./webpack.config');

// 丑化
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // Vue 弃用 UglifyJsPlugin 了...唉
const TerserPlugin = require('terser-webpack-plugin');

// 其它
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-tags-plugin');

// 打包可视化
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// PATH
const OUTPUT_PATH = path.resolve(__dirname, '../', 'dist');
const SOURCE_PATH = path.resolve(__dirname, '../', 'src');

const productionConfig = webpackMerge(baseWebpackConfig, {
  devtool: false,
  mode: 'production',
  entry: {
    index: path.join(SOURCE_PATH, 'main.js'),
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: '',
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
  },
  optimization: {
    minimizer: [
      /**
       * Vue 弃用 UglifyJsPlugin 了...唉
       */
      // new UglifyJsPlugin({
      //   parallel: true, // 多线程
      //   uglifyOptions: {
      //     compress: {
      //       drop_console: true, // 去除 console
      //       keep_infinity: true, // 去除影响性能的代码
      //     },
      //     output: {
      //       comments: false, // 去除注释
      //       beautify: false, // 紧凑输出
      //     },
      //   },
      // }),
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          compress: {
            drop_console: true,
            keep_infinity: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.join(SOURCE_PATH, '../', 'public', 'index.html'),
      chunks: ['index'],
      minify: {
        // 压缩 html
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 删除间隙
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackIncludeAssetsPlugin({
      files: '*.html',
      assets: [{ path: 'lib', glob: '*.dll.js', globPath: 'dist/lib/' }],
      append: false,
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerPort: 9128
    // }),
  ],
});

module.exports = productionConfig;
