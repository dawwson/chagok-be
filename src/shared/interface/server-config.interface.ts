import { NodeEnv } from '../enum/node-env.enum';

export interface IServerConfig {
  nodeEnv: NodeEnv;
  port: number;
  jwtSecret: string;
  jwtExpiresIn: number;
}
