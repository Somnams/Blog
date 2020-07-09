/**
 * Webpack 配置文件 _global
 *
 * @author Wang Qinhong
 * @copyright XUST KCSoft
 */

const path = require('path');
// const os = require('os');

// 打包基本包
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Webpack 4.0
const HappyPack = require('happypack'); // happypack 对 url-loader 和 file-loader 不友好

// 按需打包
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

// 打包优化
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// Env
const isDev = Boolean(process.env.NODE_ENV != 'production');
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// 麻烦的 Vue Loader
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// HappyPack plugin contrustor
function createHappyPlugin(id, loaders) {
  return new HappyPack({
    id,
    loaders,
    // threadPool: happyThreadPool,
  });
}

// PATH
const SOURCE_PATH = path.resolve(__dirname, '../src');
const NODE_MODULES = path.resolve(__dirname, '../node_modules');

// webpack config
const config = {
  context: SOURCE_PATH,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              formatter: require('eslint-friendly-formatter'),
              emitWarning: false,
            },
          },
        ],
        include: SOURCE_PATH,
        exclude: NODE_MODULES,
      },
      {
        test: /\.vue/,
        exclude: NODE_MODULES,
        include: SOURCE_PATH,
        use: ['vue-loader'],
      },
      {
        test: /\.jsx?/,
        exclude: NODE_MODULES,
        include: SOURCE_PATH,
        use: ['happypack/loader?id=happy-babel-js'],
      },
      {
        test: /\.tsx?/,
        exclude: NODE_MODULES,
        include: SOURCE_PATH,
        use: ['happypack/loader?id=happy-babel-ts'],
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader'],
        exclude: NODE_MODULES,
      },
      {
        test: /\.css$/,
        use: isDev ?
          ['style-loader', 'happypack/loader?id=happy-css'] :
          ['style-loader', MiniCssExtractPlugin.loader, 'happypack/loader?id=happy-css'],
        include: NODE_MODULES,
        exclude: SOURCE_PATH,
      },
      {
        test: /\.s(c|a)ss$/,
        exclude: NODE_MODULES,
        use: isDev ?
          ['style-loader', 'happypack/loader?id=happy-sass'] :
          ['style-loader', MiniCssExtractPlugin.loader, 'happypack/loader?id=happy-sass'],
      },
      {
        test: /.(gif|jpg|png|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 8192,
              name: 'images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.json$/i,
        type: 'javascript/auto',
        use: 'happypack/loader?id=happy-json',
      },
    ],
    noParse: /node_modules\/(jquey|js\\-cookie\.js)/,
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    modules: [SOURCE_PATH, NODE_MODULES],
    alias: {
      '@': SOURCE_PATH,
      '@components': path.resolve(SOURCE_PATH, 'components'),
      '@container': path.resolve(SOURCE_PATH, 'container'),
      '@constants': path.resolve(SOURCE_PATH, 'common', 'constants'),
      '@utils': path.resolve(SOURCE_PATH, 'common', 'utils'),
      '@store': path.resolve(SOURCE_PATH, 'store'),
    },
  },
  externals: {
    jquery: '$',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: '[name].css',
    }),
    new ProgressBarPlugin({
      format: `${chalk.blue.bold('Build')}  ${chalk.cyan('[:bar]')}  ${chalk.green.bold(':percent')} (${chalk.magenta(
        ':elapsed'
      )} seconds), ${chalk.greenBright('Euphoria Happy Every Day ✨')}`,
      clear: false,
      complete: '*',
      incomplete: '.',
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, './'),
      manifest: require('./vue-manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, './'),
      manifest: require('./common-manifest.json'),
    }),
    new VueLoaderPlugin(),

    // JS
    createHappyPlugin('happy-babel-js', [
      {
        loader: 'cache-loader',
        options: {
          cacheDirectory: path.resolve(__dirname, '.cache--happypack'),
        },
      },
      {
        loader: 'babel-loader',
      },
    ]),

    // TS
    createHappyPlugin('happy-babel-ts', [
      {
        loader: 'cache-loader',
        options: {
          cacheDirectory: path.resolve(__dirname, '.cache--happypack'),
        },
      },
      {
        loader: 'babel-loader',
      },
    ]),

    // CSS
    createHappyPlugin('happy-css', [
      {
        loader: 'css-loader',
        exclude: [/node_modules/],
        query: {
          url: false,
          sourceMap: true,
          importLoaders: 1,
          modules: false,
        },
      },
      {
        loader: 'postcss-loader',
        exclude: [/node_modules/],
        query: {
          config: {
            path: path.join(__dirname, './postcss.config.js'),
          },
        },
      },
    ]),

    // SASS
    createHappyPlugin('happy-sass', [
      {
        loader: 'css-loader',
        query: {
          url: false,
          sourceMap: true,
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        query: {
          config: {
            path: path.join(__dirname, './postcss.config.js'),
          },
        },
      },
      {
        loader: 'sass-loader',
        query: {
          sourceMap: true,
        },
      },
    ]),

    // JSON
    createHappyPlugin('happy-json', [
      {
        loader: 'json-loader',
      },
    ]),
  ],
};

module.exports = config;
