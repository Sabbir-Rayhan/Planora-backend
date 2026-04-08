import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { UserRole, UserStatus } from '../../generated/prisma/enums.js';



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

const demoUser = await prisma.user.upsert({
  where: { email: 'demo@planora.com' },
  update: {},
  create: {
    name: 'Demo User',
    email: 'demo@planora.com',
    password: await bcrypt.hash('demo123', 10),
    role: 'USER',
    status: 'ACTIVE',
  },
});
console.log('Demo user created:', demoUser.email);

// Seed demo admin (if not already created by admin seeder)
const demoAdmin = await prisma.user.upsert({
  where: { email: 'demoadmin@planora.com' },
  update: {},
  create: {
    name: 'Demo Admin',
    email: 'demoadmin@planora.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'ADMIN',
    status: 'ACTIVE',
  },
});
console.log('Demo admin created:', demoAdmin.email);

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});