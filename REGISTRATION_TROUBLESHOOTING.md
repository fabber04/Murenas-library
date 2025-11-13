# Registration Troubleshooting Guide

## Common Issues and Solutions

### 1. Database Not Connected

**Symptoms:**
- Error message about database connection
- "An error occurred" without details

**Solution:**
1. Check your `.env` file in `server/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/database
   ```

2. Verify database is running:
   ```bash
   # For local PostgreSQL
   sudo systemctl status postgresql
   # Or check if you can connect
   psql $DATABASE_URL
   ```

3. Test database connection:
   ```bash
   cd server
   npx prisma db pull
   ```

### 2. User Table Doesn't Exist

**Symptoms:**
- Error: "Table 'User' does not exist"
- Prisma errors about missing tables

**Solution:**
Run database migrations:
```bash
cd server
npm run prisma:migrate
```

Or if migrations don't exist:
```bash
cd server
npx prisma migrate dev --name init
```

### 3. Email Already Registered

**Symptoms:**
- "Email already registered" error

**Solution:**
- Use a different email address
- Or login with existing account at `/login`

### 4. Session Store Not Working

**Symptoms:**
- Registration succeeds but you're not logged in
- Session errors in console

**Solution:**
1. Check PostgreSQL session table exists:
   ```bash
   # The session table should be created automatically
   # Check your database for 'session' table
   ```

2. Verify `SESSION_SECRET` in `.env`:
   ```env
   SESSION_SECRET=your-random-secret-key-here
   ```

### 5. Password Validation Fails

**Symptoms:**
- "Please provide valid email and password" error

**Solution:**
- Password must be at least 6 characters
- Email must be valid format
- Check browser console for validation errors

## Quick Diagnostic Steps

1. **Check server logs:**
   ```bash
   # Look for error messages when trying to register
   # Check terminal where server is running
   ```

2. **Test database connection:**
   ```bash
   cd server
   npx prisma studio
   # This opens a browser - check if User table exists
   ```

3. **Verify environment variables:**
   ```bash
   cd server
   cat .env
   # Make sure DATABASE_URL and SESSION_SECRET are set
   ```

4. **Check if registration route is accessible:**
   - Visit: `http://localhost:4000/register`
   - Should show registration form
   - If 404, check server routes

## Manual User Creation (If Registration Still Fails)

If you need to create a user manually for testing:

```bash
cd server
npx prisma studio
```

Or use SQL:
```sql
-- Hash a password first (use bcrypt or online tool)
-- Then insert:
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$hashedpasswordhere',  -- Use bcrypt hash
  'admin',
  NOW(),
  NOW()
);
```

## Create Admin User Script

Create a file `server/scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin User';

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
    console.log('Admin user created:', user.email);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('User already exists');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
```

Run it:
```bash
cd server
npx tsx scripts/create-admin.ts admin@example.com password123 "Admin Name"
```

## Still Having Issues?

1. Check server console for detailed error messages
2. Verify all environment variables are set
3. Ensure database migrations have been run
4. Check PostgreSQL is running and accessible
5. Review server logs for specific error codes

