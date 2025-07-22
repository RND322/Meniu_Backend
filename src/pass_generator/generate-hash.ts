import * as bcrypt from 'bcrypt';

// Para ejecutar: npx ts-node generate-hash.ts

async function generateHash() {
  const plainPassword = 'Alex!6969';
  const saltRounds = 10;

  const hash = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hash generado:', hash);
}

generateHash();