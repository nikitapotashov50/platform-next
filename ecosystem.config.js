module.exports = {
  apps: [{
    name: 'platform',
    script: 'index.js',
    instances: 0,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
