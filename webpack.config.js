let env = process.env.stage;
if(!env) {
  env = 'development';
}

let config = require(`./webpack.config.${env}`);

export default config.default;
