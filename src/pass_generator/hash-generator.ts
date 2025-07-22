import * as bcrypt from 'bcrypt';

export async function hashPassword(plainText: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(plainText, saltRounds);
}
