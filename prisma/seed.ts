import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { users } from './seeds/users';
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt();
  const usersWithHashedPassword = await Promise.all(
    users.map(async (user) => {
      const hashed = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashed };
    }),
  );

  await prisma.user.createMany({
    data: usersWithHashedPassword,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
