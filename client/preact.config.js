export default (config, env, helpers) => {
  const { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0];

  if (env.production) {
    plugin.definitions['process.env.API_HOST'] = JSON.stringify('http://192.168.1.2:4445');
  } else {
    plugin.definitions['process.env.API_HOST'] = JSON.stringify('http://192.168.1.29:4445');
  }
};
