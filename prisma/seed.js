const { PrismaClient } = require('@prisma/client');
const uuid = require('uuid');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient({ log: ['error'] });

async function main() {
  const salt = await bcryptjs.genSalt(10);
  const pass = await bcryptjs.hash('12345678', salt);

  await prisma.$transaction([
    prisma.user.create({
      data: {
        uuid: uuid.v4(),
        username: 'admin',
        password: pass,
      },
    }),
    prisma.user.create({
      data: {
        uuid: uuid.v4(),
        username: 'staff',
        password: pass,
      },
    }),
  ]);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (err) => {
    if (err) {
      await prisma.$disconnect();

      console.error(err);
      process.exit(1);
    }
  });
