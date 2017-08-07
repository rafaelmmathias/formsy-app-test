import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: [
    './client/src/js/index.js'
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'app.js'
  },
  stats: 'normal',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          'url-loader',
          {
            loader: 'img-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
        use: 'url-loader?prefix=font/&limit=10000'
      }
    ]
  },
  resolve:{
    alias: {
      images: path.resolve(__dirname, './client/src/images/')
    }
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'index.html',
      template: './client/src/index.html'
    })
  ]
};
