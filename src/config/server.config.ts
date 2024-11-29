import { registerAs } from '@nestjs/config';

export default registerAs('server', () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.SERVER_PORT),
    domain: process.env.DOMAIN,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN), // 단위: 초
    logDir: process.env.LOG_DIR,
  };
});
