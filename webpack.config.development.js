import webpack from 'webpack';
import path from 'path';
import config from './webpack.config.default';

config.entry.push('webpack/hot/dev-server');
config.entry.push('webpack-hot-middleware/client');

config.output.publicPath ='/';
config.devtool = 'cheap-eval-source-map';
config.watch = true;

config.module.rules.push({
  test: /\.scss$/,
  use: [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader', options: {
      sourceMap: true
    }
  }, {
    loader: 'sass-loader', options: {
      sourceMap: true
    }
  }]
});

config.module.rules.push({
  test: /\.jsx?$/,
  exclude: /(node_modules)/,
  use: [
    'react-hot-loader',
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }
  ]
});

config.module.rules.push({
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: [
    'react-hot-loader',
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }
  ]
});

config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.LoaderOptionsPlugin({
  debug: true,
  watch: true
}));

config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('development'),
    'version': JSON.stringify('0.0.0'),
    'stage': JSON.stringify('development')
  }
}));

export default config;
