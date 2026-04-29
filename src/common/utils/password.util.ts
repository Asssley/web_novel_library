import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise < string > {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(passwordA: string, passwordB: string) {
  return await bcrypt.compare(passwordA, passwordB);
}