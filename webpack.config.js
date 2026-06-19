const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/',
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'styles.[contenthash].css' : 'styles.css',
      }),
      new webpack.DefinePlugin({
        'process.env.RAWG_API_KEY': JSON.stringify(process.env.RAWG_API_KEY || ''),
      }),
    ],
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      historyApiFallback: true,
      hot: true,
      port: 8080,
      open: false,
    },
  };
};
