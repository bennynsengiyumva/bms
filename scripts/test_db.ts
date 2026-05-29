import prisma from '../src/api/models/prisma';

async function test() {
  const users = await prisma.user.count();
  console.log('User count:', users);
}

test().catch(console.error);
