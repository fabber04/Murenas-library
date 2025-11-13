import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin User';

  if (!email || !password) {
    console.log('Usage: npx tsx scripts/create-admin.ts <email> <password> [name]');
    console.log('Example: npx tsx scripts/create-admin.ts admin@example.com mypassword "Admin Name"');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      }
    });
    console.log('✅ Admin user created successfully!');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('ID:', user.id);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('❌ User with this email already exists');
      console.log('Try a different email or login with existing account');
    } else {
      console.error('❌ Error creating user:', error.message);
      if (error.message?.includes('connect')) {
        console.error('💡 Database connection error. Check your DATABASE_URL in .env');
      }
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

