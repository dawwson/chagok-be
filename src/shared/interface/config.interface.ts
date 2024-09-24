import { NodeEnv } from '../enum/node-env.enum';

export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface ServerConfig {
  nodeEnv: NodeEnv;
  port: number;
  domain: string;
  jwtSecret: string;
  jwtExpiresIn: number;
}
