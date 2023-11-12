import { registerAs } from '@nestjs/config';

export default registerAs('server', () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.SERVER_PORT),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN),
  };
});
