#!/usr/bin/env node

/**
 * Database Setup Script
 * This script sets up the database by:
 * 1. Generating Prisma Client
 * 2. Pushing the schema to create tables
 * 3. Seeding the database with initial data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting database setup...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env file not found!');
  console.error('Please create a .env file with your DATABASE_URL.');
  process.exit(1);
}

// Check if DATABASE_URL is set in .env file
const envContent = fs.readFileSync(envPath, 'utf-8');
if (!envContent.includes('DATABASE_URL')) {
  console.error('❌ Error: DATABASE_URL not found in .env file!');
  console.error('Please add DATABASE_URL to your .env file.');
  process.exit(1);
}

try {
  // Step 1: Generate Prisma Client
  console.log('📦 Step 1: Generating Prisma Client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client generated successfully!\n');
  } catch (error) {
    console.warn('⚠️  Warning: Prisma Client generation had issues (this may be okay if dev server is running)\n');
  }

  // Step 2: Push schema to database
  console.log('🗄️  Step 2: Pushing schema to database...');
  console.log('   (This will create all required tables)\n');
  
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('\n✅ Database schema pushed successfully!\n');
  } catch (error) {
    console.error('\n❌ Error pushing schema to database.');
    console.error('Please check:');
    console.error('  1. Your DATABASE_URL is correct');
    console.error('  2. The database server is running and accessible');
    console.error('  3. You have the necessary permissions\n');
    throw error;
  }

  // Step 3: Seed database
  console.log('🌱 Step 3: Seeding database with initial data...');
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('\n✅ Database seeded successfully!\n');
  } catch (error) {
    console.warn('\n⚠️  Warning: Database seeding had issues (you can run "npm run db:seed" manually later)\n');
  }

  console.log('🎉 Database setup completed successfully!');
  console.log('\nYou can now start your development server with: npm run dev\n');
} catch (error) {
  console.error('\n❌ Database setup failed!');
  console.error('Please check the errors above and try again.\n');
  process.exit(1);
}

