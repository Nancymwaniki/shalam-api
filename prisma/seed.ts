import 'dotenv/config';
import { PrismaClient } from '../node_modules/.prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const admins = [
  { email: 'nancymwa087@gmail.com', password: 'admin123' },
  { email: 'shalamproperties@yahoo.com', password: 'admin123' },
];

async function main() {
  for (const { email, password } of admins) {
    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.upsert({
      where: { email },
      update: {},
      create: { email, password: hashed },
    });
    console.log('Admin seeded:', admin.email);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
