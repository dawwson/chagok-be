import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = (plainPassword: string, encryptedPassword: string) => {
  return bcrypt.compare(plainPassword, encryptedPassword);
};
