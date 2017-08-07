import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import config from './webpack.config.default';

config.devtool = false;
config.watch = false;

config.module.rules.push({
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader'
  }
});

const extractSass = new ExtractTextPlugin({
  filename: 'app.css'
});

config.module.rules.push({
  test: /\.scss$/,
  use: extractSass.extract({
    use: [{
      loader: 'css-loader', options: { minimize: true }
    }, {
      loader: 'sass-loader'
    }],
    // use style-loader in development
    fallback: 'style-loader'
  })
});

config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production'),
    'version': JSON.stringify(process.env.version),
    'stage': JSON.stringify('stable')
  }
}));

config.plugins.push(extractSass);
config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, compressor: { warnings: false }}));
config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());

export default config;
