import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';



const seed = async () => {
  const hashedPassword = await bcrypt.hash('Mahee@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@planora.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@planora.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin created:', admin.email);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});