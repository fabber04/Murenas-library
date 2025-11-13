# Supabase Setup Guide

## Step 1: Get Your Supabase Connection String

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (or create a new one)
3. **Go to Settings** → **Database**
4. **Find "Connection string"** section
5. **Copy the "URI" connection string** - it looks like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   
   OR use the "Session mode" connection string (recommended for connection pooling):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true
   ```

## Step 2: Update Your .env File

Edit `server/.env` and replace the `DATABASE_URL`:

```env
# Supabase PostgreSQL Connection
DATABASE_URL="postgresql://postgres.[project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true&schema=public"

# Supabase requires SSL
DATABASE_SSL="true"

# Session secret (generate a random string)
SESSION_SECRET="your-random-secret-key-here-change-in-production"
```

**Important Notes:**
- Replace `[project-ref]`, `[your-password]`, and `[region]` with your actual Supabase values
- The password is the database password you set when creating the project
- Use port `5432` for connection pooling (recommended) or `6543` for direct connection
- Make sure `DATABASE_SSL="true"` is set

## Step 3: Run Migrations

After updating `.env`, run:

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

## Step 4: Verify Connection

Test the connection:

```bash
cd server
npx prisma studio
```

This should open Prisma Studio in your browser, showing your database tables.

## Step 5: Run Your Upload Script

Now you can upload files:

```bash
cd server
npm run upload:dir "/home/fab/Documents/part 1.2"
```

## Troubleshooting

### "Connection refused" or "Timeout"
- Check your Supabase project is active
- Verify the connection string is correct
- Make sure `DATABASE_SSL="true"` is set

### "SSL required"
- Supabase requires SSL connections
- Set `DATABASE_SSL="true"` in `.env`

### "Schema not found"
- Make sure `?schema=public` is in your connection string
- Or add `&schema=public` if using other query parameters

### "Password authentication failed"
- Double-check your database password in Supabase dashboard
- Reset password in Supabase if needed: Settings → Database → Reset database password

## Finding Your Connection String in Supabase

1. Go to: https://app.supabase.com
2. Select your project
3. Click **Settings** (gear icon)
4. Click **Database** in the left sidebar
5. Scroll to **Connection string** section
6. Select **URI** tab
7. Copy the connection string
8. Replace `[YOUR-PASSWORD]` with your actual database password

## Example Connection String Format

```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&schema=public
```

After replacing `[YOUR-PASSWORD]`, it should look like:
```
postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&schema=public
```

