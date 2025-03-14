// 这个文件用于 pm2 管理，
module.exports = {
  app: [
    {
      name: 'inventory-management',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        ENV_VAR1: 'environment-variable',
      },
    },
  ],
}
