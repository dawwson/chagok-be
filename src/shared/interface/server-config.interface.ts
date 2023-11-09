export interface IServerConfig {
  nodeEnv: NODE_ENV;
  port: number;
}

enum NODE_ENV {
  DEV = 'development',
  STAGE = 'stage',
  PROD = 'production',
}
