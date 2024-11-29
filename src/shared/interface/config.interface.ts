import { NodeEnv } from '../enum/node-env.enum';

export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface ServerConfig {
  nodeEnv: NodeEnv;
  port: number;
  domain: string;
  jwtSecret: string;
  jwtExpiresIn: number;
  logDir: string;
}
