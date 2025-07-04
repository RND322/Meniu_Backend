import * as bcrypt from 'bcrypt';

async function generateHash() {
  const plainPassword = 'password123';
  const saltRounds = 10;

  const hash = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hash generado:', hash);
}

generateHash();