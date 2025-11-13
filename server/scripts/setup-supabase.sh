#!/bin/bash

# Supabase Setup Helper Script
# This script helps you configure your .env file for Supabase

echo "🔧 Supabase Database Setup"
echo ""
echo "This script will help you configure your .env file for Supabase."
echo ""
echo "You'll need:"
echo "  1. Your Supabase project connection string"
echo "  2. Your database password"
echo "  3. A session secret (we can generate one)"
echo ""

# Check if .env exists
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating .env file..."
    touch "$ENV_FILE"
fi

# Generate a random session secret
SESSION_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

echo "📝 Please provide the following information:"
echo ""

# Get connection string
read -p "Enter your Supabase connection string (or press Enter to skip): " CONNECTION_STRING

if [ -z "$CONNECTION_STRING" ]; then
    echo ""
    echo "⚠️  No connection string provided."
    echo ""
    echo "To get your connection string:"
    echo "  1. Go to https://app.supabase.com"
    echo "  2. Select your project"
    echo "  3. Go to Settings → Database"
    echo "  4. Copy the 'URI' connection string"
    echo "  5. Replace [YOUR-PASSWORD] with your actual password"
    echo ""
    echo "Example format:"
    echo "  postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres?pgbouncer=true&schema=public"
    echo ""
    read -p "Enter connection string now (or press Enter to exit): " CONNECTION_STRING
    
    if [ -z "$CONNECTION_STRING" ]; then
        echo "Exiting. Run this script again when you have your connection string."
        exit 0
    fi
fi

# Update .env file
echo ""
echo "📝 Updating .env file..."

# Remove old DATABASE_URL if exists
sed -i '/^DATABASE_URL=/d' "$ENV_FILE"
sed -i '/^DATABASE_SSL=/d' "$ENV_FILE"
sed -i '/^SESSION_SECRET=/d' "$ENV_FILE"

# Add new values
echo "" >> "$ENV_FILE"
echo "# Supabase PostgreSQL Connection" >> "$ENV_FILE"
echo "DATABASE_URL=\"$CONNECTION_STRING\"" >> "$ENV_FILE"
echo "DATABASE_SSL=\"true\"" >> "$ENV_FILE"
echo "SESSION_SECRET=\"$SESSION_SECRET\"" >> "$ENV_FILE"

echo "✅ .env file updated!"
echo ""
echo "📋 Configuration added:"
echo "   DATABASE_URL=\"$CONNECTION_STRING\""
echo "   DATABASE_SSL=\"true\""
echo "   SESSION_SECRET=\"$SESSION_SECRET\""
echo ""
echo "🔍 Next steps:"
echo "   1. Verify your .env file looks correct"
echo "   2. Run: npm run prisma:generate"
echo "   3. Run: npm run prisma:migrate"
echo "   4. Test: npx prisma studio"
echo "   5. Upload files: npm run upload:dir \"/path/to/files\""
echo ""

